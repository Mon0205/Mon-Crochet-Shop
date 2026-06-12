import { useEffect, useMemo, useState } from 'react'
import AdminTabs from '../components/admin/AdminTabs'
import OrderList from '../components/admin/OrderList'
import ProductForm from '../components/admin/ProductForm'
import ProductList from '../components/admin/ProductList'
import { productCategories } from '../constants/productCategories'
import { orderApi } from '../api/orderApi'
import { productApi } from '../api/productApi'
import { getImageKey } from '../utils/productImages'

const createVariant = () => ({
  color: '',
  quantity: '',
  images: [],
})

const getEmptyForm = () => ({
  name: '',
  categoryName: productCategories[0],
  price: '',
  discountPrice: '',
  description: '',
  hasVariants: false,
  color: '',
  quantity: '',
  images: [],
  variants: [createVariant()],
})

export default function Admin() {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [form, setForm] = useState(getEmptyForm)
  const [activeVariantIndex, setActiveVariantIndex] = useState(0)
  const [editingId, setEditingId] = useState('')
  const [tab, setTab] = useState('products')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  const activeVariant = form.variants[activeVariantIndex] || form.variants[0] || createVariant()
  const previewProduct = useMemo(
    () => ({
      name: form.name || 'Tên sản phẩm',
      category: { name: form.categoryName || productCategories[0] },
      color: form.hasVariants ? activeVariant.color || 'Đang cập nhật' : form.color || 'Đang cập nhật',
      price: Number(form.price || 0),
      discountPrice: Number(form.discountPrice || 0),
      quantity: Number(form.hasVariants ? activeVariant.quantity || 0 : form.quantity || 0),
      images: form.hasVariants ? form.images : form.images,
    }),
    [form, activeVariant],
  )

  const loadData = async () => {
    const [productRes, orderRes] = await Promise.all([productApi.getAdminProducts(), orderApi.getAdminOrders()])
    setProducts(productRes.data.products)
    setOrders(orderRes.data.orders)
  }

  useEffect(() => {
    loadData().catch((err) => setError(err.message || 'Không tải được dữ liệu admin.'))
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const updateVariant = (index, patch) => {
    setForm((current) => ({
      ...current,
      variants: current.variants.map((variant, variantIndex) =>
        variantIndex === index ? { ...variant, ...patch } : variant,
      ),
    }))
  }

  const addVariant = () => {
    setForm((current) => ({ ...current, variants: [...current.variants, createVariant()] }))
    setActiveVariantIndex(form.variants.length)
  }

  const removeVariant = (index) => {
    setForm((current) => {
      const variants = current.variants.filter((_, variantIndex) => variantIndex !== index)
      return { ...current, variants: variants.length > 0 ? variants : [createVariant()] }
    })
    setActiveVariantIndex(0)
  }

  const toggleVariants = (hasVariants) => {
    setForm((current) => ({
      ...current,
      hasVariants,
      variants: hasVariants && current.variants.length > 0 ? current.variants : [createVariant()],
    }))
    setActiveVariantIndex(0)
  }

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files || [])
    if (files.length === 0) return

    setMessage('')
    setError('')
    setUploading(true)

    try {
      const res = await productApi.uploadImages(files)
      updateVariant(activeVariantIndex, {
        images: [...activeVariant.images, ...res.data.images],
      })
      setMessage('Đã upload ảnh cho màu đang chọn.')
    } catch (err) {
      setError(err.message || 'Upload ảnh thất bại.')
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  const handleMainImageUpload = async (event) => {
    const files = Array.from(event.target.files || [])
    if (files.length === 0) return

    setMessage('')
    setError('')
    setUploading(true)

    try {
      const res = await productApi.uploadImages(files)
      setForm((current) => ({ ...current, images: [...current.images, ...res.data.images] }))
      setMessage('Đã upload ảnh chung của sản phẩm.')
    } catch (err) {
      setError(err.message || 'Upload ảnh thất bại.')
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  const removeImage = (imageKey) => {
    updateVariant(activeVariantIndex, {
      images: activeVariant.images.filter((image) => getImageKey(image) !== imageKey),
    })
  }

  const removeMainImage = (imageKey) => {
    setForm((current) => ({
      ...current,
      images: current.images.filter((image) => getImageKey(image) !== imageKey),
    }))
  }

  const resetForm = () => {
    setForm(getEmptyForm())
    setActiveVariantIndex(0)
    setEditingId('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')
    setError('')

    if (form.images.length === 0) {
      setError('Vui lòng upload ít nhất 1 ảnh chung cho sản phẩm.')
      return
    }

    const variants = form.variants
      .map((variant) => ({
        ...variant,
        color: variant.color.trim(),
        quantity: Number(variant.quantity || 0),
      }))
      .filter((variant) => variant.color && variant.images.length > 0)

    if (form.hasVariants && variants.length === 0) {
      setError('Vui lòng thêm ít nhất 1 màu có ảnh sản phẩm.')
      return
    }

    setLoading(true)

    try {
      const payload = {
        ...form,
        price: Number(form.price),
        discountPrice: Number(form.discountPrice || 0),
        quantity: Number(form.quantity || 0),
        variants: form.hasVariants ? variants : [],
      }

      if (editingId) {
        await productApi.updateProduct(editingId, payload)
        setMessage('Đã cập nhật sản phẩm.')
      } else {
        await productApi.createProduct(payload)
        setMessage('Đã thêm sản phẩm.')
      }

      resetForm()
      await loadData()
    } catch (err) {
      setError(err.message || 'Lưu sản phẩm thất bại.')
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (product) => {
    const categoryName = productCategories.includes(product.category?.name)
      ? product.category.name
      : productCategories[0]
    const variants =
      product.variants?.length > 0
        ? product.variants.map((variant) => ({
            color: variant.color || '',
            quantity: variant.quantity || '',
            images: variant.images || [],
          }))
        : [
            {
              color: product.color || '',
              quantity: product.quantity || '',
              images: product.images || [],
            },
          ]

    setEditingId(product._id)
    setForm({
      name: product.name || '',
      categoryName,
      price: product.price || '',
      discountPrice: product.discountPrice || '',
      description: product.description || '',
      hasVariants: product.hasVariants || product.variants?.length > 0,
      color: product.hasVariants ? '' : product.color || '',
      quantity: product.hasVariants ? '' : product.quantity || '',
      images: product.images || [],
      variants,
    })
    setActiveVariantIndex(0)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const deleteProduct = async (id) => {
    if (!window.confirm('Xóa sản phẩm này?')) return

    try {
      await productApi.deleteProduct(id)
      setMessage('Đã xóa sản phẩm.')
      await loadData()
    } catch (err) {
      setError(err.message || 'Xóa sản phẩm thất bại.')
    }
  }

  const updateOrderStatus = async (id, status) => {
    try {
      await orderApi.updateOrderStatus(id, status)
      await loadData()
    } catch (err) {
      setError(err.message || 'Cập nhật đơn hàng thất bại.')
    }
  }

  return (
    <main className="page-section">
      <div className="container">
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-end gap-3 mb-4">
          <div>
            <span className="eyebrow mb-3">Admin</span>
            <h1 className="display-6 fw-bold mb-0">Quản lý cửa hàng</h1>
          </div>
          <AdminTabs activeTab={tab} onChange={setTab} />
        </div>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {tab === 'products' && (
          <div className="row g-4">
            <div className="col-12">
              <ProductForm
                activeVariant={activeVariant}
                activeVariantIndex={activeVariantIndex}
                editingId={editingId}
                form={form}
                loading={loading}
                previewProduct={previewProduct}
                uploading={uploading}
                onAddVariant={addVariant}
                onCancelEdit={resetForm}
                onChange={handleChange}
                onRemoveMainImage={removeMainImage}
                onRemoveImage={removeImage}
                onRemoveVariant={removeVariant}
                onSelectVariant={setActiveVariantIndex}
                onSubmit={handleSubmit}
                onToggleVariants={toggleVariants}
                onUpdateVariant={updateVariant}
                onUploadMainImages={handleMainImageUpload}
                onUploadImages={handleImageUpload}
              />
            </div>
            <div className="col-12">
              <ProductList products={products} onDelete={deleteProduct} onEdit={startEdit} />
            </div>
          </div>
        )}

        {tab === 'orders' && <OrderList orders={orders} onUpdateStatus={updateOrderStatus} />}
      </div>
    </main>
  )
}
