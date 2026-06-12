import express from 'express'
import { uploadProductImages } from '../controllers/uploadController.js'
import { adminOnly, protect } from '../middlewares/authMiddleware.js'
import { upload } from '../middlewares/uploadMiddleware.js'

const router = express.Router()

router.post('/products', protect, adminOnly, upload.array('images', 6), uploadProductImages)

export default router
