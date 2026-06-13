import express from 'express'
import { getAdminStats, getAdminUsers, updateUserRole } from '../controllers/adminController.js'
import { adminOnly, protect } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.use(protect, adminOnly)

router.get('/stats', getAdminStats)
router.get('/users', getAdminUsers)
router.put('/users/:id/role', updateUserRole)

export default router
