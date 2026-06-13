import express from 'express'
import {
  createDiscount,
  getAvailableDiscounts,
  getAdminDiscounts,
  updateDiscount,
  validateDiscount,
} from '../controllers/discountController.js'
import { adminOnly, protect } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/validate', protect, validateDiscount)
router.get('/available', protect, getAvailableDiscounts)
router.get('/admin', protect, adminOnly, getAdminDiscounts)
router.post('/', protect, adminOnly, createDiscount)
router.put('/:id', protect, adminOnly, updateDiscount)

export default router
