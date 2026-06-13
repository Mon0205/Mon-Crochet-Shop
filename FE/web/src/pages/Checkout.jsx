import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { discountApi } from '../api/discountApi'
import { orderApi } from '../api/orderApi'
import VoucherSelector, { discountStorageKey } from '../components/discount/VoucherSelector'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'
import { formatPrice } from '../context/CartContext'

export default function Checkout() {
  const { user } = useAuth()
  const { items, totalPrice, clearCart } = useCart()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    note: '',
  })
  const [appliedDiscount, setAppliedDiscount] = useState(null)
  const [discountError, setDiscountError] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const discountAmount = appliedDiscount?.discountAmount || 0
  const finalTotal = useMemo(() => Math.max(totalPrice - discountAmount, 0), [discountAmount, totalPrice])

  useEffect(() => {
    const storedCode = localStorage.getItem(discountStorageKey)
    if (!storedCode || totalPrice <= 0) return

    discountApi
      .validateDiscount({ code: storedCode, subtotal: totalPrice })
      .then((res) => setAppliedDiscount(res.data))
      .catch(() => {
        localStorage.removeItem(discountStorageKey)
        setAppliedDiscount(null)
      })
  }, [totalPrice])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const applyVoucher = async (code) => {
    setDiscountError('')
    try {
      const res = await discountApi.validateDiscount({ code, subtotal: totalPrice })
      setAppliedDiscount(res.data)
      localStorage.setItem(discountStorageKey, res.data.discount.code)
    } catch (err) {
      setAppliedDiscount(null)
      localStorage.removeItem(discountStorageKey)
      setDiscountError(err.message || 'Voucher không hợp lệ.')
    }
  }

  const removeVoucher = () => {
    setAppliedDiscount(null)
    setDiscountError('')
    localStorage.removeItem(discountStorageKey)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      setError('Vui lòng nhập đầy đủ thông tin nhận hàng.')
      return
    }

    setLoading(true)
    try {
      await orderApi.createOrder({
        items: items.map((item) => ({ product: item._id, quantity: item.quantity, variantColor: item.variantColor })),
        shippingAddress: form,
        discountCode: appliedDiscount?.discount?.code || '',
      })
      localStorage.removeItem(discountStorageKey)
      clearCart()
      navigate('/checkout/success')
    } catch (err) {
      setError(err.message || 'Đặt hàng thất bại.')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <main className="page-section">
        <div className="container">
          <div className="empty-state">
            <h1 className="h4 fw-bold">Không có sản phẩm để thanh toán</h1>
            <Link to="/products" className="btn btn-shop mt-3">
              Xem sản phẩm
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="page-section">
      <div className="container">
        <span className="eyebrow mb-3">COD</span>
        <h1 className="display-6 fw-bold mb-4">Thanh toán khi nhận hàng</h1>

        <div className="row g-4">
          <div className="col-lg-7">
            <form className="auth-card p-4" onSubmit={handleSubmit}>
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="checkoutName">
                  Người nhận
                </label>
                <input id="checkoutName" className="form-control" name="name" value={form.name} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="checkoutPhone">
                  Số điện thoại
                </label>
                <input id="checkoutPhone" className="form-control" name="phone" value={form.phone} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold" htmlFor="checkoutAddress">
                  Địa chỉ giao hàng
                </label>
                <textarea
                  id="checkoutAddress"
                  className="form-control"
                  name="address"
                  rows="3"
                  value={form.address}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <label className="form-label fw-semibold" htmlFor="checkoutNote">
                  Ghi chú
                </label>
                <textarea id="checkoutNote" className="form-control" name="note" rows="2" value={form.note} onChange={handleChange} />
              </div>
              <button className="btn btn-shop w-100" type="submit" disabled={loading}>
                {loading ? 'Đang đặt hàng...' : 'Xác nhận đặt COD'}
              </button>
            </form>
          </div>
          <div className="col-lg-5">
            <aside className="summary-panel">
              <h2 className="h5 fw-bold mb-3">Đơn hàng</h2>
              {items.map((item) => (
                <div className="summary-row" key={`${item._id}-${item.variantColor || 'default'}`}>
                  <span>
                    {item.name}
                    {item.variantColor ? ` (${item.variantColor})` : ''} x {item.quantity}
                  </span>
                  <strong>{formatPrice(item.price * item.quantity)}</strong>
                </div>
              ))}

              <VoucherSelector
                appliedDiscount={appliedDiscount}
                subtotal={totalPrice}
                onApply={applyVoucher}
                onRemove={removeVoucher}
              />
              {discountError && <p className="discount-error">{discountError}</p>}

              <div className="summary-row">
                <span>Tạm tính</span>
                <strong>{formatPrice(totalPrice)}</strong>
              </div>
              {discountAmount > 0 && (
                <div className="summary-row discount-row-summary">
                  <span>Giảm giá</span>
                  <strong>-{formatPrice(discountAmount)}</strong>
                </div>
              )}
              <div className="summary-total">
                <span>Tổng cộng</span>
                <strong>{formatPrice(finalTotal)}</strong>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </main>
  )
}
