import { squareThumbImage } from '../../utils/imageUrl'
import { getImageUrl } from '../../utils/productImages'

export default function ProductColorPicker({ activeIndex, variants = [], onSelect }) {
  return (
    <div className="detail-option-panel">
      <p className="detail-option-title">Phân loại</p>
      <div className="color-code-grid">
        {variants.map((variant, index) => {
          const imageUrl = getImageUrl(variant.images?.[0])
          return (
            <button
              className={index === activeIndex ? 'color-code active' : 'color-code'}
              key={`${variant.color}-${index}`}
              type="button"
              onClick={() => onSelect(index)}
            >
              <img src={squareThumbImage(imageUrl, 90) || 'https://placehold.co/90x90?text=Mon'} alt={variant.color} />
              <span>{variant.color || `Phân loại ${index + 1}`}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
