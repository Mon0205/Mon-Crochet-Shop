import { PackagePlus } from 'lucide-react'
import { productCategories } from '../../constants/productCategories'
import ProductImageUploader from './ProductImageUploader'
import ProductPreview from './ProductPreview'
import ProductVariantEditor from './ProductVariantEditor'

export default function ProductForm({
  activeVariant,
  activeVariantIndex,
  editingId,
  form,
  loading,
  previewProduct,
  title,
  uploading,
  onAddVariant,
  onCancelEdit,
  onChange,
  onRemoveMainImage,
  onRemoveImage,
  onRemoveVariant,
  onSelectVariant,
  onSubmit,
  onToggleVariants,
  onUpdateVariant,
  onUploadMainImages,
  onUploadImages,
}) {
  return (
    <section className="admin-product-editor">
      <form className="auth-card p-4" onSubmit={onSubmit}>
        <div className="admin-product-editor-grid">
          <div>
            <h2 className="h5 fw-bold mb-3">{title || (editingId ? 'Sửa sản phẩm' : 'Thêm sản phẩm')}</h2>
            <div className="row g-3">
              <div className="col-12">
                <input className="form-control" name="name" placeholder="Tên sản phẩm" value={form.name} onChange={onChange} required />
              </div>
              <div className="col-md-6">
                <select className="form-select" name="categoryName" value={form.categoryName} onChange={onChange}>
                  {productCategories.map((category) => (
                    <option value={category} key={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <input className="form-control" name="price" type="number" placeholder="Giá" value={form.price} onChange={onChange} required />
              </div>
              <div className="col-md-3">
                <input className="form-control" name="discountPrice" type="number" placeholder="Giá KM" value={form.discountPrice} onChange={onChange} />
              </div>

              <div className="col-12">
                <label className="form-check d-flex align-items-center gap-2 fw-semibold">
                  <input className="form-check-input mt-0" type="checkbox" checked={form.hasVariants} onChange={(event) => onToggleVariants(event.target.checked)} />
                  Sản phẩm có phân loại
                </label>
              </div>

              <ProductImageUploader
                images={form.images}
                inputId={editingId ? `productMainImages-${editingId}` : 'productMainImages-create'}
                label="Chọn ảnh chung hiển thị sản phẩm"
                uploading={uploading}
                onRemoveImage={onRemoveMainImage}
                onUploadImages={onUploadMainImages}
              />

              {!form.hasVariants && (
                <>
                  <div className="col-md-6">
                    <input className="form-control" name="color" placeholder="Phân loại" value={form.color} onChange={onChange} />
                  </div>
                  <div className="col-md-6">
                    <input className="form-control" name="quantity" type="number" placeholder="Tồn kho" value={form.quantity} onChange={onChange} required />
                  </div>
                </>
              )}

              {form.hasVariants && (
                <ProductVariantEditor
                  activeVariant={activeVariant}
                  activeVariantIndex={activeVariantIndex}
                  variants={form.variants}
                  uploading={uploading}
                  onAddVariant={onAddVariant}
                  onRemoveImage={onRemoveImage}
                  onRemoveVariant={onRemoveVariant}
                  onSelectVariant={onSelectVariant}
                  onUpdateVariant={onUpdateVariant}
                  onUploadImages={onUploadImages}
                />
              )}

              <div className="col-12">
                <textarea className="form-control" name="description" rows="3" placeholder="Mô tả" value={form.description} onChange={onChange} />
              </div>
            </div>
            <div className="d-flex gap-2 mt-3">
              <button className="btn btn-shop d-inline-flex align-items-center gap-2" type="submit" disabled={loading || uploading}>
                <PackagePlus size={18} />
                {loading ? 'Đang lưu...' : 'Lưu'}
              </button>
              {(editingId || title) && (
                <button className="btn btn-shop-outline" type="button" onClick={onCancelEdit}>
                  Hủy
                </button>
              )}
            </div>
          </div>
          <ProductPreview product={previewProduct} />
        </div>
      </form>
    </section>
  )
}
