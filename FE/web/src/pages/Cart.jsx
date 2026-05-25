import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'

export default function Cart() {
  return (
    <main className="page-section">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-7">
            <div className="auth-card p-4 p-md-5 text-center">
              <span className="feature-icon mx-auto mb-3">
                <ShoppingBag size={24} />
              </span>
              <h1 className="h3 fw-bold mb-2">Giỏ hàng của bạn</h1>
              <p className="text-muted-shop mb-4">
                Chức năng giỏ hàng sẽ được nối với API sản phẩm và đơn hàng ở bước tiếp theo.
              </p>
              <Link to="/products" className="btn btn-shop">
                Tiếp tục xem sản phẩm
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
