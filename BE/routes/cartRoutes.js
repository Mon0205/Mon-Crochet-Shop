import express from 'express'
import { clearCart, getCart, saveCart } from '../controllers/cartController.js'
import { protect } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/', protect, getCart)
router.put('/', protect, saveCart)
router.delete('/', protect, clearCart)

export default router
