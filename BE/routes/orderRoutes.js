import express from 'express'
import {
  createOrder,
  getAdminOrders,
  getMyOrders,
  updateOrderStatus,
} from '../controllers/orderController.js'
import { adminOnly, protect } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/', protect, createOrder)
router.get('/mine', protect, getMyOrders)
router.get('/admin', protect, adminOnly, getAdminOrders)
router.put('/:id/status', protect, adminOnly, updateOrderStatus)

export default router
