import { Edit3, Trash2 } from 'lucide-react'
import { formatPrice } from '../../context/CartContext'
import { squareThumbImage } from '../../utils/imageUrl'
import { getImageUrl } from '../../utils/productImages'

export default function ProductList({ editingId, products, renderEditForm, onDelete, onEdit }) {
  return (
    <div className="admin-table">
      {products.map((product) => (
        <div className="admin-product-list-item" key={product._id}>
          <div className="admin-row">
            <img src={squareThumbImage(getImageUrl(product.images?.[0]), 240) || 'https://placehold.co/240x240?text=Mon'} alt={product.name} />
            <div>
              <h3 className="h6 fw-bold mb-1">{product.name}</h3>
              <p className="text-muted-shop mb-0">
                {product.category?.name} · {product.variants?.length || 1} phân loại · {formatPrice(product.discountPrice || product.price)} · Còn {product.quantity}
              </p>
            </div>
            <div className="admin-actions">
              <button className="icon-button" type="button" onClick={() => onEdit(product)} aria-label="Sửa sản phẩm">
                <Edit3 size={18} />
              </button>
              <button className="icon-button text-danger" type="button" onClick={() => onDelete(product._id)} aria-label="Xóa sản phẩm">
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          {editingId === product._id && renderEditForm && (
            <div className="admin-inline-editor">
              {renderEditForm(product)}
            </div>
          )}
        </div>
      ))}
      {products.length === 0 && <div className="empty-state">Không tìm thấy sản phẩm phù hợp.</div>}
    </div>
  )
}
