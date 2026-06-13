import Discount from '../models/Discount.js'

export const calculateDiscountAmount = (discount, subtotal) => {
  if (!discount || subtotal <= 0) return 0

  const rawAmount =
    discount.type === 'percent'
      ? subtotal * (Number(discount.value || 0) / 100)
      : Number(discount.value || 0)
  const cappedAmount =
    discount.maxDiscountAmount > 0 ? Math.min(rawAmount, discount.maxDiscountAmount) : rawAmount

  return Math.max(0, Math.min(Math.round(cappedAmount), subtotal))
}

export const getApplicableDiscount = async (code, subtotal) => {
  const cleanCode = String(code || '').trim().toUpperCase()
  if (!cleanCode) return { discount: null, discountAmount: 0 }

  const discount = await Discount.findOne({ code: cleanCode })
  const now = new Date()

  if (!discount || !discount.isActive) {
    throw new Error('Ma giam gia khong ton tai hoac da tat.')
  }

  if (discount.startsAt && discount.startsAt > now) {
    throw new Error('Ma giam gia chua den thoi gian su dung.')
  }

  if (discount.endsAt && discount.endsAt < now) {
    throw new Error('Ma giam gia da het han.')
  }

  if (discount.usageLimit > 0 && discount.usedCount >= discount.usageLimit) {
    throw new Error('Ma giam gia da het luot su dung.')
  }

  if (subtotal < discount.minOrderAmount) {
    throw new Error(`Don hang can toi thieu ${discount.minOrderAmount} de dung ma nay.`)
  }

  return {
    discount,
    discountAmount: calculateDiscountAmount(discount, subtotal),
  }
}
