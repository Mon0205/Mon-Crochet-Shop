import express from 'express'
import {
  createProduct,
  deleteProduct,
  getAdminProducts,
  getProductById,
  getProducts,
  updateProduct,
} from '../controllers/productController.js'
import { adminOnly, protect } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/', getProducts)
router.get('/admin', protect, adminOnly, getAdminProducts)
router.get('/:id', getProductById)
router.post('/', protect, adminOnly, createProduct)
router.put('/:id', protect, adminOnly, updateProduct)
router.delete('/:id', protect, adminOnly, deleteProduct)

export default router
