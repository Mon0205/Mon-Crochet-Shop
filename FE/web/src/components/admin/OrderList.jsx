import { useState } from 'react'
import OrderDetailModal from '../order/OrderDetailModal'
import { formatPrice } from '../../context/CartContext'
import { formatOrderDate, getOrderCode, getOrderItemsCount } from '../../utils/orderUtils'

const orderStatuses = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  shipping: 'Đang giao',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
}

const paymentStatusLabels = {
  unpaid: 'Chưa thanh toán',
  paid: 'Đã thanh toán',
}

export default function OrderList({ orders, onUpdateStatus }) {
  const [selectedOrder, setSelectedOrder] = useState(null)

  return (
    <>
      <div className="admin-table">
        {orders.map((order) => (
          <div className="order-row" key={order._id}>
            <button className="order-summary-button" type="button" onClick={() => setSelectedOrder(order)}>
              <span className="fw-bold">Đơn {getOrderCode(order)}</span>
              <span className="text-muted-shop">{formatOrderDate(order.createdAt)}</span>
              <span className="text-muted-shop">
                {order.shippingAddress.name} · {getOrderItemsCount(order)} sản phẩm
                {order.discount?.code ? ` · Mã ${order.discount.code}` : ''}
              </span>
              <span className={order.paymentStatus === 'paid' ? 'payment-badge paid' : 'payment-badge'}>
                {paymentStatusLabels[order.paymentStatus] || order.paymentStatus}
              </span>
            </button>
            <strong>{formatPrice(order.totalPrice)}</strong>
            <select className="form-select order-status" value={order.status} onChange={(event) => onUpdateStatus(order._id, event.target.value)}>
              {Object.entries(orderStatuses).map(([value, label]) => (
                <option value={value} key={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        ))}
        {orders.length === 0 && <div className="empty-state">Chưa có đơn hàng.</div>}
      </div>

      <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </>
  )
}
