import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { discountApi } from '../api/discountApi'
import VoucherSelector from '../components/discount/VoucherSelector'
import { useCart } from '../hooks/useCart'
import { formatPrice } from '../context/CartContext'
import { squareThumbImage } from '../utils/imageUrl'

const getCartItemKey = (item) => `${item._id}-${item.variantColor || 'default'}`

export default function Cart() {
  const { items, totalPrice, changeQuantity, removeFromCart } = useCart()
  const navigate = useNavigate()
  const [appliedDiscount, setAppliedDiscount] = useState(null)
  const [discountError, setDiscountError] = useState('')

  const discountAmount = appliedDiscount?.discountAmount || 0
  const finalTotal = useMemo(() => Math.max(totalPrice - discountAmount, 0), [discountAmount, totalPrice])

  const applyVoucher = async (code) => {
    setDiscountError('')
    try {
      const res = await discountApi.validateDiscount({ code, subtotal: totalPrice })
      setAppliedDiscount(res.data)
    } catch (err) {
      setAppliedDiscount(null)
      setDiscountError(err.message || 'Voucher không hợp lệ.')
    }
  }

  const removeVoucher = () => {
    setAppliedDiscount(null)
    setDiscountError('')
  }

  if (items.length === 0) {
    return (
      <main className="page-section">
        <div className="container">
          <div className="empty-state">
            <ShoppingBag size={34} />
            <h1 className="h4 fw-bold mt-3">Giỏ hàng đang trống</h1>
            <p className="text-muted-shop mb-4">Thêm sản phẩm yêu thích rồi quay lại thanh toán COD.</p>
            <Link to="/products" className="btn btn-shop">
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
        <div className="d-flex justify-content-between align-items-end gap-3 mb-4">
          <div>
            <span className="eyebrow mb-3">Giỏ hàng</span>
            <h1 className="display-6 fw-bold mb-0">Sản phẩm đã chọn</h1>
          </div>
          <Link to="/products" className="btn btn-shop-outline">
            Mua thêm
          </Link>
        </div>

        <div className="row g-4">
          <div className="col-lg-8">
            <div className="cart-list">
              {items.map((item) => (
                <div className="cart-item" key={getCartItemKey(item)}>
                  <img src={squareThumbImage(item.image, 240) || 'https://placehold.co/240x240?text=Mon+Crochet'} alt={item.name} />
                  <div className="cart-item-main">
                    <h2 className="h6 fw-bold mb-1">{item.name}</h2>
                    {item.variantColor && <p className="text-muted-shop mb-1">Phân loại: {item.variantColor}</p>}
                    <p className="text-muted-shop mb-0">{formatPrice(item.price)}</p>
                  </div>
                  <div className="quantity-control" aria-label="Số lượng">
                    <button type="button" onClick={() => changeQuantity(item._id, item.variantColor, item.quantity - 1)}>
                      <Minus size={16} />
                    </button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => changeQuantity(item._id, item.variantColor, item.quantity + 1)}>
                      <Plus size={16} />
                    </button>
                  </div>
                  <strong className="cart-line-total">{formatPrice(item.price * item.quantity)}</strong>
                  <button className="icon-button text-danger" type="button" onClick={() => removeFromCart(item._id, item.variantColor)}>
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="col-lg-4">
            <aside className="summary-panel">
              <h2 className="h5 fw-bold mb-3">Tổng đơn</h2>

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
              <div className="summary-row">
                <span>Thanh toán</span>
                <strong>COD</strong>
              </div>
              <div className="summary-total">
                <span>Tổng cộng</span>
                <strong>{formatPrice(finalTotal)}</strong>
              </div>
              <button className="btn btn-shop w-100 mt-3" type="button" onClick={() => navigate('/checkout')}>
                Thanh toán COD
              </button>
            </aside>
          </div>
        </div>
      </div>
    </main>
  )
}
