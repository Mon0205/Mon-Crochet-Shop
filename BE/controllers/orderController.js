import Order from '../models/Order.js'
import Product from '../models/Product.js'
import { getImageUrl } from '../utils/cloudinaryImages.js'

export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Gio hang dang trong.' })
    }

    if (!shippingAddress?.name || !shippingAddress?.phone || !shippingAddress?.address) {
      return res.status(400).json({ message: 'Vui long nhap day du thong tin nhan hang.' })
    }

    const orderItems = []
    let totalPrice = 0

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
      totalPrice += price * quantity
      product.quantity -= quantity
      if (variant) variant.quantity -= quantity
      await product.save()

      orderItems.push({
        product: product._id,
        name: product.name,
        image: getImageUrl(variant?.images?.[0] || product.images?.[0]),
        price,
        quantity,
        variantColor: variant?.color || item.variantColor || '',
      })
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod: 'COD',
      totalPrice,
    })

    return res.status(201).json({ message: 'Dat hang COD thanh cong.', order })
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Loi server khi tao don hang.' })
  }
}

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })
    return res.json({ orders })
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Loi server khi lay don hang.' })
  }
}

export const getAdminOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 })
    return res.json({ orders })
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Loi server khi lay don hang admin.' })
  }
}

export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true },
    )

    if (!order) return res.status(404).json({ message: 'Khong tim thay don hang.' })

    return res.json({ message: 'Cap nhat don hang thanh cong.', order })
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Loi server khi cap nhat don hang.' })
  }
}
