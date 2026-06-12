import { ImagePlus, X } from 'lucide-react'
import { squareThumbImage } from '../../utils/imageUrl'
import { getImageKey, getImageUrl } from '../../utils/productImages'

export default function ProductImageUploader({ images, inputId, label, uploading, onRemoveImage, onUploadImages }) {
  return (
    <>
      <div className="col-12">
        <label className="upload-box" htmlFor={inputId}>
          <ImagePlus size={22} />
          <span>{uploading ? 'Đang upload ảnh...' : label}</span>
          <input id={inputId} type="file" accept="image/*" multiple onChange={onUploadImages} disabled={uploading} />
        </label>
      </div>

      {images.length > 0 && (
        <div className="col-12">
          <div className="image-preview-grid">
            {images.map((image) => (
              <div className="image-preview" key={getImageKey(image)}>
                <img src={squareThumbImage(getImageUrl(image), 360)} alt="Ảnh sản phẩm" />
                <button type="button" onClick={() => onRemoveImage(getImageKey(image))} aria-label="Xóa ảnh">
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
