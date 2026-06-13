import { formatPrice } from '../../context/CartContext'
import { productCardImage } from '../../utils/imageUrl'
import { getImageUrl } from '../../utils/productImages'

export default function ProductPreview({ product }) {
  return (
    <div className="preview-panel mt-4">
      <h2 className="h6 fw-bold mb-3">Preview phân loại đang chọn</h2>
      <div className="product-card">
        <img src={productCardImage(getImageUrl(product.images?.[0])) || 'https://placehold.co/900x675?text=Mon+Crochet'} alt={product.name} />
        <div className="product-body">
          <span className="shop-badge mb-3">{product.category.name}</span>
          <h3 className="product-title mb-2">{product.name}</h3>
          <p className="text-muted-shop mb-3">Phân loại: {product.color}</p>
          <div className="d-flex align-items-center justify-content-between gap-3">
            <strong className="price">{formatPrice(product.discountPrice || product.price)}</strong>
            <span className="small text-muted-shop">Còn {product.quantity}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
