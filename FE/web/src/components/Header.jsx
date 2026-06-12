import { Link, NavLink } from 'react-router-dom'
import { LogOut, ReceiptText, ShoppingBag, UserCircle, UserPlus } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'
import logo from '../../img/logo.png'

export default function Header() {
  const { user, logout } = useAuth()
  const { totalQuantity } = useCart()

  return (
    <nav className="navbar navbar-expand-lg sticky-top shop-navbar">
      <div className="container">
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2 fw-bold">
          <span className="brand-mark">
            <img src={logo} alt="Mon Crochet logo" />
          </span>
          Mon Crochet
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavigation"
          aria-controls="mainNavigation"
          aria-expanded="false"
          aria-label="Mở menu"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="mainNavigation">
          <div className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
            <NavLink to="/" className="nav-link">
              Trang chủ
            </NavLink>
            <NavLink to="/products" className="nav-link">
              Sản phẩm
            </NavLink>
            {user && (
              <NavLink to="/cart" className="nav-link d-inline-flex align-items-center gap-1">
                <ShoppingBag size={17} />
                Giỏ hàng
                {totalQuantity > 0 && <span className="cart-count">{totalQuantity}</span>}
              </NavLink>
            )}
            {user?.role === 'admin' && (
              <NavLink to="/admin" className="nav-link">
                Admin
              </NavLink>
            )}

            {!user ? (
              <>
                <NavLink to="/login" className="nav-link">
                  Đăng nhập
                </NavLink>
                <NavLink to="/register" className="btn btn-shop d-inline-flex align-items-center gap-2 ms-lg-2">
                  <UserPlus size={18} />
                  Đăng ký
                </NavLink>
              </>
            ) : (
              <div className="nav-item dropdown ms-lg-2">
                <button
                  className="btn btn-shop-outline dropdown-toggle d-inline-flex align-items-center gap-2"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <UserCircle size={19} />
                  {user.name}
                </button>
                <ul className="dropdown-menu dropdown-menu-end account-menu">
                  <li>
                    <NavLink to="/profile" className="dropdown-item d-flex align-items-center gap-2">
                      <UserCircle size={18} />
                      Thông tin cá nhân
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/orders" className="dropdown-item d-flex align-items-center gap-2">
                      <ReceiptText size={18} />
                      Đơn hàng của tôi
                    </NavLink>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button onClick={logout} className="dropdown-item d-flex align-items-center gap-2 text-danger">
                      <LogOut size={18} />
                      Đăng xuất
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
