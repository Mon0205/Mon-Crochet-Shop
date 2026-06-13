import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PackageCheck, ShieldCheck, Truck } from 'lucide-react'

const bannerSlides = [
  {
    image: '/img/538c1065-497a-49d8-ab4e-960de485639e.jpg',
    title: 'Banner len handmade 1',
  },
  {
    image: '/img/Gemini_Generated_Image_3v96233v96233v96.png',
    title: 'Banner len handmade 2',
  },
  {
    image: '/img/watermarked_img_1561878050608508035.png',
    title: 'Banner len handmade 3',
  },
]

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0)
  const currentSlide = bannerSlides[activeSlide]

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % bannerSlides.length)
    }, 5000)

    return () => window.clearInterval(timer)
  }, [])

  const goToSlide = (index) => setActiveSlide((index + bannerSlides.length) % bannerSlides.length)

  return (
    <>
      <main className="home-banner">
        <img className="home-banner-image" src={currentSlide.image} alt={currentSlide.title} />

        <div className="home-banner-controls" aria-label="Điều khiển banner">
          <Link className="home-banner-cta" to="/products">
            Khám phá ngay
          </Link>
          <div className="home-banner-dots">
            {bannerSlides.map((slide, index) => (
              <button
                className={index === activeSlide ? 'active' : ''}
                key={slide.title}
                type="button"
                onClick={() => goToSlide(index)}
                aria-label={`Chọn banner ${index + 1}`}
              />
            ))}
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
