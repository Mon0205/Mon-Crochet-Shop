import { useEffect, useMemo, useState } from 'react'
import { TicketPercent } from 'lucide-react'
import { discountApi } from '../../api/discountApi'
import { formatPrice } from '../../context/CartContext'

export const discountStorageKey = 'checkoutDiscountCode'

const getVoucherTitle = (voucher) =>
  voucher.type === 'percent' ? `Giảm ${voucher.value}%` : `Giảm ${formatPrice(voucher.value)}`

const getVoucherDescription = (voucher) => {
  const parts = [`Đơn tối thiểu ${formatPrice(voucher.minOrderAmount || 0)}`]
  if (voucher.maxDiscountAmount > 0) parts.push(`Giảm tối đa ${formatPrice(voucher.maxDiscountAmount)}`)
  if (voucher.endsAt) parts.push(`Hết hạn ${new Date(voucher.endsAt).toLocaleDateString('vi-VN')}`)
  return parts.join(' · ')
}

export default function VoucherSelector({ appliedDiscount, subtotal, onApply, onRemove }) {
  const [vouchers, setVouchers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const selectedCode = appliedDiscount?.discount?.code || ''

  const sortedVouchers = useMemo(
    () => [...vouchers].sort((a, b) => Number(b.isEligible) - Number(a.isEligible) || b.discountAmount - a.discountAmount),
    [vouchers],
  )

  useEffect(() => {
    if (subtotal <= 0) return undefined

    let ignore = false
    setLoading(true)
    setError('')

    discountApi
      .getAvailableDiscounts(subtotal)
      .then((res) => {
        if (!ignore) setVouchers(res.data.discounts || [])
      })
      .catch((err) => {
        if (!ignore) setError(err.message || 'Không tải được voucher.')
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [subtotal])

  return (
    <div className="voucher-selector">
      <div className="voucher-selector-title">
        <TicketPercent size={18} />
        <strong>Voucher của shop</strong>
      </div>

      {loading && <p className="text-muted-shop mb-0">Đang tải voucher...</p>}
      {error && <p className="discount-error">{error}</p>}

      <div className="voucher-list">
        {sortedVouchers.map((voucher) => {
          const isSelected = selectedCode === voucher.code
          return (
            <button
              className={`voucher-card${isSelected ? ' selected' : ''}`}
              disabled={!voucher.isEligible && !isSelected}
              key={voucher._id}
              type="button"
              onClick={() => (isSelected ? onRemove() : onApply(voucher.code))}
            >
              <span className="voucher-code">{voucher.code}</span>
              <span className="voucher-main">{getVoucherTitle(voucher)}</span>
              <span className="voucher-description">{getVoucherDescription(voucher)}</span>
              {voucher.isEligible ? (
                <span className="voucher-saving">
                  {isSelected ? 'Đang áp dụng' : `Giảm ${formatPrice(voucher.discountAmount)}`}
                </span>
              ) : (
                <span className="voucher-disabled">{voucher.disabledReason}</span>
              )}
            </button>
          )
        })}
        {!loading && sortedVouchers.length === 0 && <p className="text-muted-shop mb-0">Hiện chưa có voucher khả dụng.</p>}
      </div>
    </div>
  )
}
