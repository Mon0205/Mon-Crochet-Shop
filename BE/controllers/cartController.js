import Cart from '../models/Cart.js'
import Product from '../models/Product.js'
import { getImageUrl } from '../utils/cloudinaryImages.js'

const formatCart = async (cart) => {
  await cart.populate('items.product')

  const items = cart.items
    .filter((item) => item.product && item.product.isActive)
    .map((item) => {
      const product = item.product
      const variant = product.hasVariants
        ? product.variants?.find((candidate) => candidate.color === item.variantColor) ||
          product.variants?.[0]
        : null
      const price = product.discountPrice > 0 ? product.discountPrice : product.price
      const stock = variant?.quantity ?? product.quantity

      return {
        _id: product._id,
        name: product.name,
        price,
        stock,
        image: getImageUrl(variant?.images?.[0] || product.images?.[0]),
        variantColor: variant?.color || item.variantColor || '',
        quantity: Math.min(item.quantity, stock),
      }
    })
    .filter((item) => item.quantity > 0)

  return { items }
}

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId })
  if (!cart) cart = await Cart.create({ user: userId, items: [] })
  return cart
}

export const getCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user._id)
    const formattedCart = await formatCart(cart)
    return res.json(formattedCart)
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Loi server khi lay gio hang.' })
  }
}

export const saveCart = async (req, res) => {
  try {
    const items = Array.isArray(req.body.items) ? req.body.items : []
    const cartItemsMap = new Map()

    for (const item of items) {
      const productId = item.product || item._id
      const quantity = Number(item.quantity || 0)
      const product = await Product.findById(productId)
      const variant = product?.hasVariants
        ? product?.variants?.find((candidate) => candidate.color === item.variantColor) ||
          product?.variants?.[0]
        : null
      const stock = variant?.quantity ?? product?.quantity ?? 0

      if (!product || !product.isActive || quantity < 1) continue

      const variantColor = variant?.color || item.variantColor || ''
      const cartKey = `${product._id}-${variantColor}`
      const currentItem = cartItemsMap.get(cartKey)
      const nextQuantity = Math.min((currentItem?.quantity || 0) + quantity, stock)

      cartItemsMap.set(cartKey, {
        product: product._id,
        quantity: nextQuantity,
        variantColor,
      })
    }

    const cartItems = [...cartItemsMap.values()]

    const cart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      { user: req.user._id, items: cartItems },
      { new: true, upsert: true, runValidators: true },
    )

    const formattedCart = await formatCart(cart)
    return res.json({ message: 'Da luu gio hang.', ...formattedCart })
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Loi server khi luu gio hang.' })
  }
}

export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      { user: req.user._id, items: [] },
      { new: true, upsert: true },
    )

    const formattedCart = await formatCart(cart)
    return res.json({ message: 'Da xoa gio hang.', ...formattedCart })
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Loi server khi xoa gio hang.' })
  }
}
