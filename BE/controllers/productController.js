import Product from '../models/Product.js'
import { destroyProductImages, normalizeImages } from '../utils/cloudinaryImages.js'

const normalizeVariants = (body) => {
  if (!body.hasVariants) return []

  if (Array.isArray(body.variants) && body.variants.length > 0) {
    return body.variants
      .map((variant) => ({
        color: variant.color || 'Đang cập nhật',
        quantity: Number(variant.quantity || 0),
        images: normalizeImages(variant.images),
      }))
      .filter((variant) => variant.images.length > 0)
  }

  return [
    {
      color: body.color || 'Đang cập nhật',
      quantity: Number(body.quantity || 0),
      images: normalizeImages(body.images),
    },
  ].filter((variant) => variant.images.length > 0)
}

const normalizeProductPayload = (body) => {
  const hasVariants = body.hasVariants === true || body.hasVariants === 'true'
  const variants = normalizeVariants(body)
  const firstVariant = variants[0]
  const totalQuantity = hasVariants
    ? variants.reduce((sum, variant) => sum + Number(variant.quantity || 0), 0)
    : Number(body.quantity || 0)

  return {
    name: body.name,
    description: body.description || '',
    price: Number(body.price || 0),
    discountPrice: Number(body.discountPrice || 0),
    quantity: totalQuantity,
    color: hasVariants ? firstVariant?.color || '' : body.color || '',
    hasVariants,
    category: {
      name: body.categoryName || body.category?.name || 'Len s\u1ee3i',
    },
    images: normalizeImages(body.images),
    variants,
    isActive: body.isActive !== false,
  }
}

const getAllProductImages = (product) => [
  ...(product.images || []),
  ...(product.variants || []).flatMap((variant) => variant.images || []),
]

export const getProducts = async (req, res) => {
  try {
    const { category, sort = 'newest', search = '' } = req.query
    const filter = { isActive: true }

    if (category) filter['category.name'] = category
    if (search) filter.name = { $regex: search, $options: 'i' }

    const sortMap = {
      newest: { createdAt: -1 },
      priceAsc: { discountPrice: 1, price: 1 },
      priceDesc: { discountPrice: -1, price: -1 },
    }

    const products = await Product.find(filter).sort(sortMap[sort] || sortMap.newest)
    return res.json({ products })
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Loi server khi lay san pham.' })
  }
}

export const getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 })
    return res.json({ products })
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Loi server khi lay san pham admin.' })
  }
}

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product || !product.isActive) {
      return res.status(404).json({ message: 'Khong tim thay san pham.' })
    }

    return res.json({ product })
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Loi server khi lay chi tiet san pham.' })
  }
}

export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(normalizeProductPayload(req.body))
    return res.status(201).json({ message: 'Them san pham thanh cong.', product })
  } catch (error) {
    console.error('CREATE PRODUCT ERROR:', error)
    return res.status(500).json({ message: error.message || 'Loi server khi them san pham.' })
  }
}

export const updateProduct = async (req, res) => {
  try {
    const existingProduct = await Product.findById(req.params.id)
    if (!existingProduct) return res.status(404).json({ message: 'Khong tim thay san pham.' })

    const payload = normalizeProductPayload(req.body)
    const currentImages = getAllProductImages(existingProduct)
    const nextImages = [...payload.images, ...payload.variants.flatMap((variant) => variant.images)]
    const nextPublicIds = new Set(nextImages.map((image) => image.publicId).filter(Boolean))
    const removedImages = currentImages.filter((image) => image.publicId && !nextPublicIds.has(image.publicId))

    Object.assign(existingProduct, payload)
    const product = await existingProduct.save()

    await destroyProductImages(removedImages)

    return res.json({ message: 'Cap nhat san pham thanh cong.', product })
  } catch (error) {
    console.error('UPDATE PRODUCT ERROR:', error)
    return res.status(500).json({ message: error.message || 'Loi server khi cap nhat san pham.' })
  }
}

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) return res.status(404).json({ message: 'Khong tim thay san pham.' })

    await destroyProductImages(getAllProductImages(product))

    return res.json({ message: 'Xoa san pham thanh cong.' })
  } catch (error) {
    console.error('DELETE PRODUCT ERROR:', error)
    return res.status(500).json({ message: error.message || 'Loi server khi xoa san pham.' })
  }
}

