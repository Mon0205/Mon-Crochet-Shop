import ProductImageUploader from './ProductImageUploader'

export default function ProductVariantEditor({
  activeVariant,
  activeVariantIndex,
  variants,
  uploading,
  onAddVariant,
  onSelectVariant,
  onRemoveImage,
  onRemoveVariant,
  onUpdateVariant,
  onUploadImages,
}) {
  return (
    <>
      <div className="col-12">
        <div className="variant-tabs">
          {variants.map((variant, index) => (
            <button
              className={index === activeVariantIndex ? 'active' : ''}
              key={`${variant.color}-${index}`}
              type="button"
              onClick={() => onSelectVariant(index)}
            >
              {variant.color || `Màu ${index + 1}`}
            </button>
          ))}
          <button type="button" onClick={onAddVariant}>
            + Màu
          </button>
        </div>
      </div>

      <div className="col-md-7">
        <input
          className="form-control"
          placeholder="Tên/mã màu"
          value={activeVariant.color}
          onChange={(event) => onUpdateVariant(activeVariantIndex, { color: event.target.value })}
          required
        />
      </div>
      <div className="col-md-5">
        <input
          className="form-control"
          type="number"
          placeholder="Tồn kho màu này"
          value={activeVariant.quantity}
          onChange={(event) => onUpdateVariant(activeVariantIndex, { quantity: event.target.value })}
          required
        />
      </div>

      <ProductImageUploader
        images={activeVariant.images}
        inputId="variantImages"
        label="Chọn ảnh cho màu đang chọn"
        uploading={uploading}
        onRemoveImage={onRemoveImage}
        onUploadImages={onUploadImages}
      />

      <div className="col-12 d-flex justify-content-between align-items-center gap-2">
        <button className="btn btn-shop-outline" type="button" onClick={() => onRemoveVariant(activeVariantIndex)}>
          Xóa màu đang chọn
        </button>
      </div>
    </>
  )
}
