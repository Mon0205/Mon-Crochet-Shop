import { Mail, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'

const socialLinks = [
  {
    label: 'Facebook',
    icon: 'f',
    href: 'https://www.facebook.com/moncrochet0205',
  },
  {
    label: 'Zalo',
    icon: 'Z',
    href: 'https://zalo.me/0818616494',
  },
  {
    label: 'TikTok',
    icon: '♪',
    href: 'https://www.tiktok.com/@Mon0205',
  },
]

export default function Footer() {
  return (
    <footer className="shop-footer">
      <div className="container">
        <div className="shop-footer-grid">
          <div>
            <Link to="/" className="shop-footer-brand">
              Mon Crochet
            </Link>
            <p className="shop-footer-copy">
              Cửa hàng len sợi, kim móc và phụ kiện handmade dành cho người yêu móc len.
            </p>
            <div className="shop-footer-socials">
              {socialLinks.map((social) => (
                <a href={social.href} key={social.label} target="_blank" rel="noreferrer" aria-label={social.label}>
                  <span>{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h2>Thông tin shop</h2>
            <ul className="shop-footer-list">
              <li>
                <Phone size={17} />
                <span>0818616494</span>
              </li>
              <li>
                <Mail size={17} />
                <span>mon14121214@gmail.com</span>
              </li>
              <li>
                <MapPin size={17} />
                <span>6/10 ttn13c, phường Tân Thới Nhất, quận 12, TP.HCM</span>
              </li>
            </ul>
          </div>

          <div>
            <h2>Hỗ trợ</h2>
            <div className="shop-footer-links">
              <Link to="/products">Sản phẩm</Link>
              <Link to="/cart">Giỏ hàng</Link>
              <Link to="/orders">Đơn hàng của tôi</Link>
            </div>
          </div>
        </div>

        <div className="shop-footer-bottom">
          <span>© {new Date().getFullYear()} Mon Crochet. All rights reserved.</span>
        </div>
      </div>
    </footer>
  )
}
