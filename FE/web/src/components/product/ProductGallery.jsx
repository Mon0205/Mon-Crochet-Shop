import { productCardImage, squareThumbImage } from '../../utils/imageUrl'
import { getImageKey, getImageUrl } from '../../utils/productImages'

export default function ProductGallery({ activeImage, description, images = [], productName, onSelectImage }) {
  return (
    <section className="product-gallery">
      <div className="product-main-image">
        <img src={productCardImage(activeImage) || 'https://placehold.co/900x675?text=Mon+Crochet'} alt={productName} />
      </div>

      <div className="product-thumbnails">
        {images.map((image) => {
          const imageUrl = getImageUrl(image)
          return (
            <button
              className={activeImage === imageUrl ? 'active' : ''}
              key={getImageKey(image)}
              type="button"
              onClick={() => onSelectImage(imageUrl)}
            >
              <img src={squareThumbImage(imageUrl, 180)} alt={productName} />
            </button>
          )
        })}
      </div>

      <section className="detail-description-section">
        <h2>Mô tả sản phẩm</h2>
        <p>{description || 'Sản phẩm đang được shop cập nhật mô tả chi tiết.'}</p>
      </section>
    </section>
  )
}
