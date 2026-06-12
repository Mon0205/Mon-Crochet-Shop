import cloudinary from '../config/cloudinary.js'

const uploadBuffer = (file) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'mon-crochet/products',
        resource_type: 'image',
        quality: 'auto:best',
        transformation: [{ width: 1800, height: 1800, crop: 'limit' }],
      },
      (error, result) => {
        if (error) return reject(error)
        return resolve(result)
      },
    )

    stream.end(file.buffer)
  })

export const uploadProductImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Vui long chon anh san pham.' })
    }

    const uploadedImages = await Promise.all(req.files.map(uploadBuffer))
    const images = uploadedImages.map((image) => ({
      url: image.secure_url,
      publicId: image.public_id,
    }))

    return res.status(201).json({
      message: 'Upload anh thanh cong.',
      images,
    })
  } catch (error) {
    console.error('UPLOAD PRODUCT IMAGE ERROR:', error)
    return res.status(500).json({ message: error.message || 'Loi server khi upload anh.' })
  }
}
