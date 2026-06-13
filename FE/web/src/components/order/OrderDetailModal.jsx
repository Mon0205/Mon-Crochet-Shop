import { X } from 'lucide-react'
import { formatPrice } from '../../context/CartContext'
import { formatOrderDate, getOrderCode, orderStatusLabels } from '../../utils/orderUtils'

const paymentStatusLabels = {
  unpaid: 'Chưa thanh toán',
  paid: 'Đã thanh toán',
}

export default function OrderDetailModal({ order, onClose }) {
  if (!order) return null

  const subtotalPrice = order.subtotalPrice || order.totalPrice + (order.discount?.amount || 0)
  const discountAmount = order.discount?.amount || 0
  const discountName = order.discount?.name || order.discount?.code || ''

  return (
    <div className="order-modal-backdrop" role="presentation" onClick={onClose}>
      <section className="order-modal" role="dialog" aria-modal="true" aria-label="Chi tiết đơn hàng" onClick={(event) => event.stopPropagation()}>
        <header className="order-modal-header">
          <div>
            <p className="eyebrow mb-2">Chi tiết đơn</p>
            <h2 className="h4 fw-bold mb-1">Đơn {getOrderCode(order)}</h2>
            <p className="text-muted-shop mb-0">{formatOrderDate(order.createdAt)}</p>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Đóng">
            <X size={20} />
          </button>
        </header>

        <div className="order-modal-body">
          <div className="order-detail-info-grid">
            <div>
              <h3 className="h6 fw-bold">Người nhận</h3>
              <p className="mb-1">{order.shippingAddress.name}</p>
              <p className="text-muted-shop mb-0">{order.shippingAddress.phone}</p>
              <p className="text-muted-shop mb-0">{order.shippingAddress.address}</p>
              {order.shippingAddress.note && <p className="text-muted-shop mb-0">Ghi chú: {order.shippingAddress.note}</p>}
            </div>
            <div>
              <h3 className="h6 fw-bold">Thanh toán</h3>
              <p className="mb-1">{order.paymentMethod || 'COD'}</p>
              <p className="text-muted-shop mb-0">Đơn hàng: {orderStatusLabels[order.status] || order.status}</p>
              <p className="text-muted-shop mb-0">
                Thanh toán: {paymentStatusLabels[order.paymentStatus] || order.paymentStatus}
              </p>
              {discountName && <p className="text-muted-shop mb-0">Mã giảm giá: {discountName}</p>}
            </div>
          </div>

          <div className="my-order-items">
            {order.items.map((item) => (
              <div className="my-order-item" key={`${item.product}-${item.variantColor || 'default'}`}>
                <img src={item.image || 'https://placehold.co/120x120?text=Mon'} alt={item.name} />
                <div>
                  <h3 className="h6 fw-bold mb-1">{item.name}</h3>
                  {item.variantColor && <p className="text-muted-shop mb-1">Phân loại: {item.variantColor}</p>}
                  <p className="text-muted-shop mb-0">
                    {formatPrice(item.price)} x {item.quantity}
                  </p>
                </div>
                <strong>{formatPrice(item.price * item.quantity)}</strong>
              </div>
            ))}
          </div>
        </div>

        <footer className="order-modal-footer order-modal-total">
          <div>
            <span>Tạm tính</span>
            <strong>{formatPrice(subtotalPrice)}</strong>
          </div>
          {discountAmount > 0 && (
            <div>
              <span>Giảm giá</span>
              <strong>-{formatPrice(discountAmount)}</strong>
            </div>
          )}
          <div>
            <span>Tổng đơn</span>
            <strong className="price">{formatPrice(order.totalPrice)}</strong>
          </div>
        </footer>
      </section>
    </div>
  )
}
