import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PackageCheck } from 'lucide-react'
import { orderApi } from '../api/orderApi'
import OrderDetailModal from '../components/order/OrderDetailModal'
import { formatPrice } from '../context/CartContext'
import { formatOrderDate, getOrderCode, getOrderItemsCount, orderStatusLabels } from '../utils/orderUtils'

export default function MyOrders() {
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    orderApi
      .getMyOrders()
      .then((res) => setOrders(res.data.orders || []))
      .catch((err) => setError(err.message || 'Không tải được đơn hàng.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="page-section">
      <div className="container">
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-end gap-3 mb-4">
          <div>
            <span className="eyebrow mb-3">Tài khoản</span>
            <h1 className="display-6 fw-bold mb-0">Đơn hàng của tôi</h1>
          </div>
          <Link to="/products" className="btn btn-shop-outline">
            Tiếp tục mua sắm
          </Link>
        </div>

        {loading && <div className="alert alert-light border">Đang tải đơn hàng...</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && orders.length === 0 && (
          <div className="empty-state">
            <PackageCheck size={34} />
            <h2 className="h4 fw-bold mt-3">Chưa có đơn hàng</h2>
            <p className="text-muted-shop mb-4">Các đơn COD của bạn sẽ xuất hiện tại đây.</p>
            <Link to="/products" className="btn btn-shop">
              Xem sản phẩm
            </Link>
          </div>
        )}

        <div className="my-orders-list">
          {orders.map((order) => (
            <button className="my-order-summary" key={order._id} type="button" onClick={() => setSelectedOrder(order)}>
              <div>
                <h2 className="h5 fw-bold mb-1">Đơn {getOrderCode(order)}</h2>
                <p className="text-muted-shop mb-0">{formatOrderDate(order.createdAt)}</p>
              </div>
              <span>{getOrderItemsCount(order)} sản phẩm</span>
              <strong>{formatPrice(order.totalPrice)}</strong>
              <span className={`order-status-badge status-${order.status}`}>{orderStatusLabels[order.status] || order.status}</span>
            </button>
          ))}
        </div>

        <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      </div>
    </main>
  )
}
