import { Link } from 'react-router-dom'
import { ArrowRight, PackageCheck, ShieldCheck, Sparkles, Truck } from 'lucide-react'
import heroImage from '../assets/hero.png'

export default function Home() {
  return (
    <>
      <main className="hero-section">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="eyebrow mb-3">Nguyên liệu móc len handmade</span>
              <h1 className="hero-title mb-4">
                Len đẹp, phụ kiện đủ, bắt đầu mẫu móc mới nhanh hơn.
              </h1>
              <p className="hero-copy mb-4">
                Chọn len sợi, kim móc, mắt thú, bông gòn và combo dành cho người mới trong một cửa hàng gọn gàng, dễ mua và rõ thông tin.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/products" className="btn btn-shop d-inline-flex align-items-center gap-2">
                  Xem sản phẩm
                  <ArrowRight size={18} />
                </Link>
                <Link to="/register" className="btn btn-shop-outline">
                  Tạo tài khoản
                </Link>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="hero-media">
                <img src={heroImage} alt="Len và phụ kiện móc handmade" />
                <div className="hero-panel">
                  <div className="d-flex align-items-start justify-content-between gap-3">
                    <div>
                      <p className="shop-badge mb-2">Combo gợi ý</p>
                      <h2 className="h4 fw-bold mb-1">Starter Crochet Kit</h2>
                      <p className="mb-0 text-muted-shop">Len milk cotton, kim 2.5mm, mắt thú và bông gòn.</p>
                    </div>
                    <Sparkles size={28} color="#8f2f4f" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <section className="feature-strip py-4">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-4">
              <div className="feature-item">
                <span className="feature-icon">
                  <PackageCheck size={22} />
                </span>
                <div>
                  <h3 className="h6 fw-bold mb-1">Đóng gói cẩn thận</h3>
                  <p className="mb-0 text-muted-shop">Sản phẩm được phân loại rõ màu, size và số lượng.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-item">
                <span className="feature-icon">
                  <Truck size={22} />
                </span>
                <div>
                  <h3 className="h6 fw-bold mb-1">Giao hàng nhanh</h3>
                  <p className="mb-0 text-muted-shop">Tối ưu quy trình để bạn nhận nguyên liệu sớm.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-item">
                <span className="feature-icon">
                  <ShieldCheck size={22} />
                </span>
                <div>
                  <h3 className="h6 fw-bold mb-1">Thanh toán an toàn</h3>
                  <p className="mb-0 text-muted-shop">Tài khoản và đơn hàng được bảo vệ rõ ràng.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
