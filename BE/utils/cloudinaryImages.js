import cloudinary from '../config/cloudinary.js'

export const normalizeImage = (image) => {
  if (!image) return null
  if (typeof image === 'string') return { url: image, publicId: '' }

  return {
    url: image.url || image.secure_url || '',
    publicId: image.publicId || image.public_id || '',
  }
}

export const normalizeImages = (images) => {
  if (!Array.isArray(images)) {
    return String(images || '')
      .split('\n')
      .map((image) => normalizeImage(image.trim()))
      .filter((image) => image?.url)
  }

  return images.map(normalizeImage).filter((image) => image?.url)
}

export const getImageUrl = (image) => (typeof image === 'string' ? image : image?.url || '')

export const destroyProductImages = async (images = []) => {
  const publicIds = images.map(normalizeImage).map((image) => image?.publicId).filter(Boolean)

  if (publicIds.length === 0) return

  await Promise.allSettled(publicIds.map((publicId) => cloudinary.uploader.destroy(publicId)))
}
