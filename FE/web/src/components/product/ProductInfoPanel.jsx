import { Link } from 'react-router-dom'
import { Minus, Plus, ShoppingCart } from 'lucide-react'
import { formatPrice } from '../../context/CartContext'
import ProductColorPicker from './ProductColorPicker'

export default function ProductInfoPanel({
  activeVariantIndex,
  message,
  price,
  product,
  quantity,
  selectedVariant,
  onAddToCart,
  onBuyNow,
  onChangeQuantity,
  onSelectVariant,
}) {
  return (
    <section className="product-detail-info">
      <Link to="/products" className="detail-back-link">
        Quay lại sản phẩm
      </Link>
      <h1>{product.name}</h1>
      <div className="detail-meta">
        <p>
          Thương hiệu: <strong>Đang cập nhật</strong>
        </p>
        <p>
          Loại: <strong>{product.category?.name || 'Len sợi'}</strong>
        </p>
      </div>

      <div className="detail-price-box">
        <span>{formatPrice(price)}</span>
        {product.discountPrice > 0 && <del>{formatPrice(product.price)}</del>}
      </div>

      {product.hasVariants && <ProductColorPicker activeIndex={activeVariantIndex} variants={product.variants} onSelect={onSelectVariant} />}

      <div className="detail-stock-row">
        <span>Số lượng:</span>
        <div className="detail-quantity">
          <button type="button" onClick={() => onChangeQuantity(quantity - 1)} disabled={quantity <= 1}>
            <Minus size={17} />
          </button>
          <input value={quantity} onChange={(event) => onChangeQuantity(Number(event.target.value))} />
          <button type="button" onClick={() => onChangeQuantity(quantity + 1)} disabled={quantity >= selectedVariant.quantity}>
            <Plus size={17} />
          </button>
        </div>
        <strong>Có thể bán {selectedVariant.quantity}</strong>
      </div>

      {message && <div className="alert alert-success">{message}</div>}

      <div className="detail-actions">
        <button className="btn detail-cart-btn" type="button" onClick={onAddToCart} disabled={selectedVariant.quantity < 1}>
          <ShoppingCart size={18} />
          Thêm vào giỏ hàng
        </button>
        <button className="btn detail-buy-btn" type="button" onClick={onBuyNow} disabled={selectedVariant.quantity < 1}>
          Mua ngay
        </button>
      </div>
    </section>
  )
}
