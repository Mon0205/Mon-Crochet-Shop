import dotenv from 'dotenv'
import { v2 as cloudinary } from 'cloudinary'

dotenv.config()

const requiredCloudinaryConfig = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET']
const missingCloudinaryConfig = requiredCloudinaryConfig.filter((key) => !process.env[key])

if (missingCloudinaryConfig.length) {
  console.warn(`Missing Cloudinary configuration: ${missingCloudinaryConfig.join(', ')}`)
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default cloudinary
