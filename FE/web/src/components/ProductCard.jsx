import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'
import { formatPrice } from '../context/CartContext'
import { productCardImage } from '../utils/imageUrl'
import { getImageUrl } from '../utils/productImages'

export default function ProductCard({ product }) {
  const { user } = useAuth()
  const { addToCart } = useCart()
  const navigate = useNavigate()
  const firstVariant = product.hasVariants ? product.variants?.[0] : null
  const price = product.discountPrice > 0 ? product.discountPrice : product.price
  const stock = firstVariant?.quantity ?? product.quantity

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login')
      return
    }

    addToCart(product, 1, firstVariant)
  }

  return (
    <article className="product-card">
      <Link to={`/products/${product._id}`} className="product-card-image-link" aria-label={product.name}>
        <img src={productCardImage(getImageUrl(product.images?.[0] || firstVariant?.images?.[0])) || 'https://placehold.co/900x675?text=Mon+Crochet'} alt={product.name} />
      </Link>
      <div className="product-body">
        <span className="shop-badge mb-3">{product.category?.name || 'Len sợi'}</span>
        <h3 className="product-title mb-2">
          <Link to={`/products/${product._id}`}>{product.name}</Link>
        </h3>
        <p className="text-muted-shop mb-3">Màu: {product.color || 'Đang cập nhật'}</p>
        <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
          <div>
            <strong className="price">{formatPrice(price)}</strong>
            {product.discountPrice > 0 && <span className="old-price ms-2">{formatPrice(product.price)}</span>}
          </div>
          <span className="small text-muted-shop">Còn {stock}</span>
        </div>
        <button
          onClick={handleAddToCart}
          className="btn btn-shop w-100 d-inline-flex align-items-center justify-content-center gap-2"
          disabled={stock < 1}
        >
          <ShoppingCart size={18} />
          {stock < 1 ? 'Hết hàng' : 'Thêm giỏ hàng'}
        </button>
      </div>
    </article>
  )
}
