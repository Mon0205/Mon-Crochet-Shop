import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401)
    throw new Error('Bạn chưa đăng nhập.')
  }

  const token = authHeader.split(' ')[1]
  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  const user = await User.findById(decoded.id)

  if (!user) {
    res.status(401)
    throw new Error('Tài khoản không tồn tại.')
  }

  req.user = user
  next()
})

export const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    res.status(403)
    throw new Error('Chỉ admin mới được thực hiện thao tác này.')
  }
  next()
}
