import Order from '../models/Order.js'
import Discount from '../models/Discount.js'
import Product from '../models/Product.js'
import { getImageUrl } from '../utils/cloudinaryImages.js'
import { getApplicableDiscount } from '../utils/discountUtils.js'

const syncCompletedOrdersPayment = (filter = {}) =>
  Order.updateMany(
    {
      ...filter,
      status: 'completed',
      paymentStatus: { $ne: 'paid' },
    },
    { $set: { paymentStatus: 'paid' } },
  )

const restoreOrderInventory = async (order) => {
  const productUpdates = []

  for (const item of order.items) {
    const product = await Product.findById(item.product)
    if (!product) continue

    product.quantity += item.quantity

    if (product.hasVariants && item.variantColor) {
      const variant = product.variants.find((candidate) => candidate.color === item.variantColor)
      if (variant) variant.quantity += item.quantity
    }

    productUpdates.push(product.save())
  }

  await Promise.all(productUpdates)
  order.inventoryRestored = true
}

const restoreDiscountUsage = async (order) => {
  if (order.discountUsageRestored) return

  if (!order.discount?.code) {
    order.discountUsageRestored = true
    return
  }

  const discount = await Discount.findOne({ code: order.discount.code })
  if (!discount) {
    order.discountUsageRestored = true
    return
  }

  discount.usedCount = Math.max(0, discount.usedCount - 1)

  const now = new Date()
  const isExpired = discount.endsAt && discount.endsAt < now
  const isOutOfUses = discount.usageLimit > 0 && discount.usedCount >= discount.usageLimit
  discount.isActive = !isExpired && !isOutOfUses

  await discount.save()
  order.discountUsageRestored = true
}

export const createOrder = async (req, res) => {
  try {
    const { discountCode, items, shippingAddress } = req.body

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Gio hang dang trong.' })
    }

    if (!shippingAddress?.name || !shippingAddress?.phone || !shippingAddress?.address) {
      return res.status(400).json({ message: 'Vui long nhap day du thong tin nhan hang.' })
    }

    const orderItems = []
    const productUpdates = []
    let subtotalPrice = 0

    for (const item of items) {
      const product = await Product.findById(item.product || item._id)
      const quantity = Number(item.quantity || 0)
      const variant = product?.hasVariants
        ? product?.variants?.find((candidate) => candidate.color === item.variantColor) ||
          product?.variants?.[0]
        : null
      const stock = variant?.quantity ?? product?.quantity ?? 0

      if (!product || !product.isActive) {
        return res.status(404).json({ message: 'Co san pham khong con ton tai.' })
      }

      if (quantity < 1 || quantity > stock) {
        return res.status(400).json({ message: `So luong ${product.name} khong hop le.` })
      }

      const price = product.discountPrice > 0 ? product.discountPrice : product.price
      subtotalPrice += price * quantity
      product.quantity -= quantity
      if (variant) variant.quantity -= quantity
      productUpdates.push(product)

      orderItems.push({
        product: product._id,
        name: product.name,
        image: getImageUrl(variant?.images?.[0] || product.images?.[0]),
        price,
        quantity,
        variantColor: variant?.color || item.variantColor || '',
      })
    }

    let appliedDiscount = null
    let discountAmount = 0

    if (discountCode) {
      const discountResult = await getApplicableDiscount(discountCode, subtotalPrice)
      appliedDiscount = discountResult.discount
      discountAmount = discountResult.discountAmount
    }

    const totalPrice = Math.max(subtotalPrice - discountAmount, 0)

    await Promise.all(productUpdates.map((product) => product.save()))

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod: 'COD',
      subtotalPrice,
      discount: appliedDiscount
        ? {
            code: appliedDiscount.code,
            name: appliedDiscount.code,
            amount: discountAmount,
            type: appliedDiscount.type,
            value: appliedDiscount.value,
          }
        : undefined,
      totalPrice,
    })

    if (appliedDiscount) {
      appliedDiscount.usedCount += 1
      if (appliedDiscount.usageLimit > 0 && appliedDiscount.usedCount >= appliedDiscount.usageLimit) {
        appliedDiscount.isActive = false
      }
      await appliedDiscount.save()
    }

    return res.status(201).json({ message: 'Dat hang COD thanh cong.', order })
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Loi server khi tao don hang.' })
  }
}

export const getMyOrders = async (req, res) => {
  try {
    await syncCompletedOrdersPayment({ user: req.user._id })
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })
    return res.json({ orders })
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Loi server khi lay don hang.' })
  }
}

export const getAdminOrders = async (req, res) => {
  try {
    await syncCompletedOrdersPayment()
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 })
    return res.json({ orders })
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Loi server khi lay don hang admin.' })
  }
}

export const updateOrderStatus = async (req, res) => {
  try {
    const nextStatus = req.body.status
    const order = await Order.findById(req.params.id)

    if (!order) return res.status(404).json({ message: 'Khong tim thay don hang.' })

    if (['cancelled', 'completed'].includes(order.status)) {
      return res.status(400).json({ message: 'Don hang da o trang thai cuoi, khong the cap nhat tiep.' })
    }

    if (nextStatus === 'cancelled' && order.status !== 'cancelled') {
      if (!order.inventoryRestored) await restoreOrderInventory(order)
      if (!order.discountUsageRestored) await restoreDiscountUsage(order)
    }

    order.status = nextStatus

    if (nextStatus === 'completed') {
      order.paymentStatus = 'paid'
    }

    if (nextStatus === 'cancelled') {
      order.paymentStatus = 'unpaid'
    }

    await order.save()
    return res.json({ message: 'Cap nhat don hang thanh cong.', order })
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Loi server khi cap nhat don hang.' })
  }
}
