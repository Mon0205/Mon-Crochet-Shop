import { Edit3, Trash2 } from 'lucide-react'
import { formatPrice } from '../../context/CartContext'
import { squareThumbImage } from '../../utils/imageUrl'
import { getImageUrl } from '../../utils/productImages'

export default function ProductList({ products, onDelete, onEdit }) {
  return (
    <div className="admin-table">
      {products.map((product) => (
        <div className="admin-row" key={product._id}>
          <img src={squareThumbImage(getImageUrl(product.images?.[0]), 240) || 'https://placehold.co/240x240?text=Mon'} alt={product.name} />
          <div>
            <h3 className="h6 fw-bold mb-1">{product.name}</h3>
            <p className="text-muted-shop mb-0">
              {product.category?.name} · {product.variants?.length || 1} màu · {formatPrice(product.discountPrice || product.price)} · Còn {product.quantity}
            </p>
          </div>
          <div className="admin-actions">
            <button className="icon-button" type="button" onClick={() => onEdit(product)}>
              <Edit3 size={18} />
            </button>
            <button className="icon-button text-danger" type="button" onClick={() => onDelete(product._id)}>
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
