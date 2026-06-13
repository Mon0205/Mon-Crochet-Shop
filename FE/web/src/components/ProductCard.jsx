import { useState } from 'react'
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
  const [showVariantPicker, setShowVariantPicker] = useState(false)
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0)
  const firstVariant = product.hasVariants ? product.variants?.[0] : null
  const selectedVariant = product.variants?.[selectedVariantIndex] || firstVariant
  const price = product.discountPrice > 0 ? product.discountPrice : product.price
  const stock = product.hasVariants
    ? (product.variants || []).reduce((sum, variant) => sum + Number(variant.quantity || 0), 0)
    : Number(product.quantity || 0)
  const selectedStock = selectedVariant?.quantity ?? product.quantity

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login')
      return
    }

    if (product.hasVariants && product.variants?.length > 0) {
      setShowVariantPicker(true)
      return
    }

    addToCart(product, 1)
  }

  const confirmVariant = () => {
    if (!selectedVariant || selectedStock < 1) return
    addToCart(product, 1, selectedVariant)
    setShowVariantPicker(false)
  }

  return (
    <>
      <article className="product-card">
        <Link to={`/products/${product._id}`} className="product-card-image-link" aria-label={product.name}>
          <img
            src={productCardImage(getImageUrl(product.images?.[0] || firstVariant?.images?.[0])) || 'https://placehold.co/900x675?text=Mon+Crochet'}
            alt={product.name}
          />
        </Link>
        <div className="product-body">
          <span className="shop-badge mb-3">{product.category?.name || 'Sản phẩm'}</span>
          <h3 className="product-title mb-2">
            <Link to={`/products/${product._id}`}>{product.name}</Link>
          </h3>
          <p className="text-muted-shop mb-3">
            {product.hasVariants ? `${product.variants?.length || 0} phân loại có sẵn` : `Phân loại: ${product.color || 'Đang cập nhật'}`}
          </p>
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

      {showVariantPicker && (
        <div className="variant-modal-backdrop" role="presentation" onClick={() => setShowVariantPicker(false)}>
          <section className="variant-modal" role="dialog" aria-modal="true" aria-label="Chọn phân loại sản phẩm" onClick={(event) => event.stopPropagation()}>
            <div className="variant-modal-header">
              <div>
                <h2 className="h5 fw-bold mb-1">Chọn phân loại</h2>
                <p className="text-muted-shop mb-0">{product.name}</p>
              </div>
              <button className="icon-button" type="button" onClick={() => setShowVariantPicker(false)} aria-label="Đóng">
                ×
              </button>
            </div>

            <div className="variant-picker-grid">
              {product.variants.map((variant, index) => {
                const imageUrl = getImageUrl(variant.images?.[0] || product.images?.[0])
                const isActive = index === selectedVariantIndex
                const isOutOfStock = Number(variant.quantity || 0) < 1

                return (
                  <button
                    className={isActive ? 'variant-picker-option active' : 'variant-picker-option'}
                    disabled={isOutOfStock}
                    key={`${variant.color}-${index}`}
                    type="button"
                    onClick={() => setSelectedVariantIndex(index)}
                  >
                    <img src={productCardImage(imageUrl) || 'https://placehold.co/160x120?text=Mon'} alt={variant.color} />
                    <span>{variant.color || `Phân loại ${index + 1}`}</span>
                    <small>{isOutOfStock ? 'Hết hàng' : `Còn ${variant.quantity}`}</small>
                  </button>
                )
              })}
            </div>

            <div className="variant-modal-footer">
              <div>
                <strong>{selectedVariant?.color || 'Chưa chọn phân loại'}</strong>
                <span className="text-muted-shop d-block">Còn {selectedStock}</span>
              </div>
              <button className="btn btn-shop" type="button" onClick={confirmVariant} disabled={selectedStock < 1}>
                Thêm vào giỏ
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  )
}
