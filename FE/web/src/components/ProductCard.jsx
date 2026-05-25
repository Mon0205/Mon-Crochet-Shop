import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

const formatPrice = (price) => `${new Intl.NumberFormat('vi-VN').format(price)}đ`

export default function ProductCard({ product }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const price = product.discountPrice > 0 ? product.discountPrice : product.price

  const handleBuy = () => {
    if (!user) {
      navigate('/login')
      return
    }

    navigate('/cart')
  }

  return (
    <article className="product-card">
      <Link to={`/products/${product._id}`} aria-label={product.name}>
        <img src={product.images?.[0] || 'https://placehold.co/600x450?text=Len+Xinh'} alt={product.name} />
      </Link>
      <div className="product-body">
        <span className="shop-badge mb-3">{product.category?.name || 'Nguyên liệu'}</span>
        <h3 className="product-title mb-2">{product.name}</h3>
        <p className="text-muted-shop mb-3">Màu: {product.color || 'Đang cập nhật'}</p>
        <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
          <strong className="price">{formatPrice(price)}</strong>
          <span className="small text-muted-shop">Còn {product.quantity}</span>
        </div>
        <button onClick={handleBuy} className="btn btn-shop w-100 d-inline-flex align-items-center justify-content-center gap-2">
          <ShoppingCart size={18} />
          Mua hàng
        </button>
      </div>
    </article>
  )
}
