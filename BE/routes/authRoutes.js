import express from 'express'
import {
  forgotPassword,
  getMe,
  login,
  register,
  resetPassword,
  updateMe,
  verifyResetPasswordOtp,
} from '../controllers/authController.js'
import { protect } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/me', protect, getMe)
router.put('/me', protect, updateMe)
router.post('/forgot-password', forgotPassword)
router.post('/verify-reset-password-otp', verifyResetPasswordOtp)
router.post('/reset-password', resetPassword)

export default router
