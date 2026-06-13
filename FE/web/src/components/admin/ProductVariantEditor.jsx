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
              {variant.color || `Phân loại ${index + 1}`}
            </button>
          ))}
          <button type="button" onClick={onAddVariant}>
            + Phân loại
          </button>
        </div>
      </div>

      <div className="col-md-7">
        <input
          className="form-control"
          placeholder="Tên/mã phân loại"
          value={activeVariant.color}
          onChange={(event) => onUpdateVariant(activeVariantIndex, { color: event.target.value })}
          required
        />
      </div>
      <div className="col-md-5">
        <input
          className="form-control"
          type="number"
          placeholder="Tồn kho phân loại này"
          value={activeVariant.quantity}
          onChange={(event) => onUpdateVariant(activeVariantIndex, { quantity: event.target.value })}
          required
        />
      </div>

      <ProductImageUploader
        images={activeVariant.images}
        inputId="variantImages"
        label="Chọn ảnh cho phân loại đang chọn"
        uploading={uploading}
        onRemoveImage={onRemoveImage}
        onUploadImages={onUploadImages}
      />

      <div className="col-12 d-flex justify-content-between align-items-center gap-2">
        <button className="btn btn-shop-outline" type="button" onClick={() => onRemoveVariant(activeVariantIndex)}>
          Xóa phân loại đang chọn
        </button>
      </div>
    </>
  )
}
