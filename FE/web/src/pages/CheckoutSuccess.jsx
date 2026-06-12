import { Link } from 'react-router-dom'

export default function CheckoutSuccess() {
  return (
    <main className="page-section">
      <div className="container">
        <div className="empty-state">
          <span className="feature-icon mx-auto mb-3">✓</span>
          <h1 className="h3 fw-bold">Đặt hàng thành công</h1>
          <p className="text-muted-shop mb-4">Shop sẽ liên hệ xác nhận đơn COD trước khi giao hàng.</p>
          <Link to="/products" className="btn btn-shop">
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    </main>
  )
}
