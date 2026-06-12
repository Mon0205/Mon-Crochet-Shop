import { X } from 'lucide-react'
import { formatPrice } from '../../context/CartContext'
import { formatOrderDate, getOrderCode, orderStatusLabels } from '../../utils/orderUtils'

export default function OrderDetailModal({ order, onClose }) {
  if (!order) return null

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
              <p className="mb-1">COD</p>
              <p className="text-muted-shop mb-0">Trạng thái: {orderStatusLabels[order.status] || order.status}</p>
            </div>
          </div>

          <div className="my-order-items">
            {order.items.map((item) => (
              <div className="my-order-item" key={`${item.product}-${item.variantColor || 'default'}`}>
                <img src={item.image || 'https://placehold.co/120x120?text=Mon'} alt={item.name} />
                <div>
                  <h3 className="h6 fw-bold mb-1">{item.name}</h3>
                  {item.variantColor && <p className="text-muted-shop mb-1">Màu: {item.variantColor}</p>}
                  <p className="text-muted-shop mb-0">
                    {formatPrice(item.price)} x {item.quantity}
                  </p>
                </div>
                <strong>{formatPrice(item.price * item.quantity)}</strong>
              </div>
            ))}
          </div>
        </div>

        <footer className="order-modal-footer">
          <span>Tổng đơn</span>
          <strong className="price">{formatPrice(order.totalPrice)}</strong>
        </footer>
      </section>
    </div>
  )
}
