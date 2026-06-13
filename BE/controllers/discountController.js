import Discount from '../models/Discount.js'
import { calculateDiscountAmount, getApplicableDiscount } from '../utils/discountUtils.js'

const normalizePayload = (body) => ({
  code: String(body.code || '').trim().toUpperCase(),
  type: body.type === 'fixed' ? 'fixed' : 'percent',
  value: Number(body.value || 0),
  minOrderAmount: Number(body.minOrderAmount || 0),
  maxDiscountAmount: Number(body.maxDiscountAmount || 0),
  startsAt: body.startsAt ? new Date(body.startsAt) : null,
  endsAt: body.endsAt ? new Date(body.endsAt) : null,
  usageLimit: Number(body.usageLimit || 0),
  isActive: body.isActive !== false,
})

const validatePayload = (payload) => {
  if (!payload.code) return 'Vui long nhap ma giam gia.'
  if (payload.value <= 0) return 'Gia tri giam gia phai lon hon 0.'
  if (payload.type === 'percent' && payload.value > 100) return 'Giam theo phan tram khong duoc qua 100%.'
  if (payload.startsAt && payload.endsAt && payload.startsAt > payload.endsAt) {
    return 'Ngay bat dau khong duoc lon hon ngay ket thuc.'
  }
  return ''
}

export const getAdminDiscounts = async (req, res) => {
  try {
    await Discount.updateMany(
      {
        isActive: true,
        usageLimit: { $gt: 0 },
        $expr: { $gte: ['$usedCount', '$usageLimit'] },
      },
      { $set: { isActive: false } },
    )

    const discounts = await Discount.find().sort({ createdAt: -1 })
    return res.json({ discounts })
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Khong tai duoc ma giam gia.' })
  }
}

const getDiscountAvailability = (discount, subtotal) => {
  const now = new Date()
  const reasons = []

  if (!discount.isActive) reasons.push('Voucher dang tam tat.')
  if (discount.startsAt && discount.startsAt > now) reasons.push('Voucher chua den thoi gian su dung.')
  if (discount.endsAt && discount.endsAt < now) reasons.push('Voucher da het han.')
  if (discount.usageLimit > 0 && discount.usedCount >= discount.usageLimit) reasons.push('Voucher da het luot su dung.')
  if (subtotal < discount.minOrderAmount) reasons.push(`Can them ${discount.minOrderAmount - subtotal} de su dung voucher nay.`)

  const discountAmount = reasons.length === 0 ? calculateDiscountAmount(discount, subtotal) : 0

  return {
    _id: discount._id,
    code: discount.code,
    type: discount.type,
    value: discount.value,
    minOrderAmount: discount.minOrderAmount,
    maxDiscountAmount: discount.maxDiscountAmount,
    startsAt: discount.startsAt,
    endsAt: discount.endsAt,
    usageLimit: discount.usageLimit,
    usedCount: discount.usedCount,
    isActive: discount.isActive,
    isEligible: reasons.length === 0,
    disabledReason: reasons[0] || '',
    discountAmount,
    finalTotal: Math.max(subtotal - discountAmount, 0),
  }
}

export const getAvailableDiscounts = async (req, res) => {
  try {
    const subtotal = Number(req.query.subtotal || 0)
    const discounts = await Discount.find({
      isActive: true,
      $or: [{ endsAt: null }, { endsAt: { $gte: new Date() } }],
    }).sort({ value: -1, createdAt: -1 })
    const visibleDiscounts = discounts.filter(
      (discount) => discount.usageLimit === 0 || discount.usedCount < discount.usageLimit,
    )

    return res.json({
      discounts: visibleDiscounts.map((discount) => getDiscountAvailability(discount, subtotal)),
    })
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Khong tai duoc danh sach voucher.' })
  }
}

export const createDiscount = async (req, res) => {
  try {
    const payload = normalizePayload(req.body)
    const validationError = validatePayload(payload)
    if (validationError) return res.status(400).json({ message: validationError })

    const discount = await Discount.create(payload)
    return res.status(201).json({ message: 'Tao ma giam gia thanh cong.', discount })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Ma giam gia da ton tai.' })
    }
    return res.status(500).json({ message: error.message || 'Khong tao duoc ma giam gia.' })
  }
}

export const updateDiscount = async (req, res) => {
  try {
    const payload = normalizePayload(req.body)
    const validationError = validatePayload(payload)
    if (validationError) return res.status(400).json({ message: validationError })

    const discount = await Discount.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    })

    if (!discount) return res.status(404).json({ message: 'Khong tim thay ma giam gia.' })

    return res.json({ message: 'Cap nhat ma giam gia thanh cong.', discount })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Ma giam gia da ton tai.' })
    }
    return res.status(500).json({ message: error.message || 'Khong cap nhat duoc ma giam gia.' })
  }
}

export const deleteDiscount = async (req, res) => {
  try {
    const discount = await Discount.findByIdAndDelete(req.params.id)
    if (!discount) return res.status(404).json({ message: 'Khong tim thay ma giam gia.' })

    return res.json({ message: 'Da xoa ma giam gia.' })
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Khong xoa duoc ma giam gia.' })
  }
}

export const validateDiscount = async (req, res) => {
  try {
    const subtotal = Number(req.body.subtotal || 0)
    const { discount, discountAmount } = await getApplicableDiscount(req.body.code, subtotal)

    return res.json({
      discount: {
        _id: discount._id,
        code: discount.code,
        type: discount.type,
        value: discount.value,
      },
      discountAmount,
      finalTotal: Math.max(subtotal - discountAmount, 0),
    })
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Ma giam gia khong hop le.' })
  }
}
