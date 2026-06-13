import { useEffect, useMemo, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import AdminSidebar from '../components/admin/AdminSidebar'
import DashboardOverview from '../components/admin/DashboardOverview'
import DiscountManager from '../components/admin/DiscountManager'
import OrderList from '../components/admin/OrderList'
import ProductForm from '../components/admin/ProductForm'
import ProductList from '../components/admin/ProductList'
import UserList from '../components/admin/UserList'
import { productCategories } from '../constants/productCategories'
import { adminApi } from '../api/adminApi'
import { discountApi } from '../api/discountApi'
import { orderApi } from '../api/orderApi'
import { productApi } from '../api/productApi'
import { getImageKey } from '../utils/productImages'
import { getOrderCode } from '../utils/orderUtils'

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

const sectionTitles = {
  dashboard: 'Tổng quan cửa hàng',
  products: 'Quản lý sản phẩm',
  orders: 'Quản lý hóa đơn',
  discounts: 'Quản lý giảm giá',
  users: 'Quản lý người dùng',
}

const normalizeSearch = (value = '') =>
  String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()

export default function Admin() {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [discounts, setDiscounts] = useState([])
  const [stats, setStats] = useState(null)
  const [form, setForm] = useState(getEmptyForm)
  const [activeVariantIndex, setActiveVariantIndex] = useState(0)
  const [editingId, setEditingId] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [section, setSection] = useState('dashboard')
  const [statsRange, setStatsRange] = useState('month')
  const [productSearch, setProductSearch] = useState('')
  const [orderSearch, setOrderSearch] = useState('')
  const [discountSearch, setDiscountSearch] = useState('')
  const [userSearch, setUserSearch] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [statsLoading, setStatsLoading] = useState(false)
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
      images: form.images,
    }),
    [form, activeVariant],
  )

  const filteredProducts = useMemo(() => {
    const keyword = normalizeSearch(productSearch)
    if (!keyword) return products

    return products.filter((product) => {
      const haystack = [
        product.name,
        product.category?.name,
        product.color,
        product.price,
        product.discountPrice,
        product.quantity,
        ...(product.variants || []).flatMap((variant) => [variant.color, variant.quantity]),
      ]
      return normalizeSearch(haystack.join(' ')).includes(keyword)
    })
  }, [products, productSearch])

  const filteredOrders = useMemo(() => {
    const keyword = normalizeSearch(orderSearch)
    if (!keyword) return orders

    return orders.filter((order) => {
      const haystack = [
        getOrderCode(order),
        order.shippingAddress?.name,
        order.shippingAddress?.phone,
        order.shippingAddress?.address,
        order.user?.name,
        order.user?.email,
        order.status,
        order.paymentStatus,
        order.discount?.code,
        order.totalPrice,
        ...(order.items || []).flatMap((item) => [item.name, item.variantColor, item.quantity, item.price]),
      ]
      return normalizeSearch(haystack.join(' ')).includes(keyword)
    })
  }, [orders, orderSearch])

  const filteredUsers = useMemo(() => {
    const keyword = normalizeSearch(userSearch)
    if (!keyword) return users

    return users.filter((user) => {
      const haystack = [user.name, user.email, user.phone, user.address, user.role]
      return normalizeSearch(haystack.join(' ')).includes(keyword)
    })
  }, [users, userSearch])

  const loadData = async () => {
    const [productRes, orderRes, userRes, discountRes] = await Promise.all([
      productApi.getAdminProducts(),
      orderApi.getAdminOrders(),
      adminApi.getUsers(),
      discountApi.getAdminDiscounts(),
    ])

    setProducts(productRes.data.products)
    setOrders(orderRes.data.orders)
    setUsers(userRes.data.users)
    setDiscounts(discountRes.data.discounts)
  }

  const loadStats = async (range = statsRange) => {
    setStatsLoading(true)
    try {
      const res = await adminApi.getStats(range)
      setStats(res.data)
    } finally {
      setStatsLoading(false)
    }
  }

  useEffect(() => {
    Promise.all([loadData(), loadStats()]).catch((err) => {
      setError(err.message || 'Không tải được dữ liệu admin.')
    })
  }, [])

  useEffect(() => {
    loadStats(statsRange).catch((err) => {
      setError(err.message || 'Không tải được thống kê.')
    })
  }, [statsRange])

  useEffect(() => {
    if (!message && !error) return undefined

    const timer = window.setTimeout(() => {
      setMessage('')
      setError('')
    }, 3500)

    return () => window.clearTimeout(timer)
  }, [message, error])

  const changeSection = (nextSection) => {
    setSection(nextSection)
    setMessage('')
    setError('')
  }

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
      updateVariant(activeVariantIndex, { images: res.data.images })
      setMessage('Đã thay ảnh cho phân loại đang chọn.')
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
      setForm((current) => ({ ...current, images: res.data.images }))
      setMessage('Đã thay ảnh chung của sản phẩm.')
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
    setShowCreateForm(false)
  }

  const refreshAdminData = async () => {
    await Promise.all([loadData(), loadStats()])
  }

  const openCreateForm = () => {
    setForm(getEmptyForm())
    setActiveVariantIndex(0)
    setEditingId('')
    setShowCreateForm((current) => !current)
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
      setError('Vui lòng thêm ít nhất 1 phân loại có ảnh sản phẩm.')
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
      await refreshAdminData()
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
    setShowCreateForm(false)
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
    setSection('products')
  }

  const deleteProduct = async (id) => {
    if (!window.confirm('Xóa sản phẩm này?')) return

    try {
      await productApi.deleteProduct(id)
      setMessage('Đã xóa sản phẩm.')
      await refreshAdminData()
    } catch (err) {
      setError(err.message || 'Xóa sản phẩm thất bại.')
    }
  }

  const updateOrderStatus = async (id, status) => {
    try {
      await orderApi.updateOrderStatus(id, status)
      await refreshAdminData()
    } catch (err) {
      setError(err.message || 'Cập nhật đơn hàng thất bại.')
    }
  }

  const createDiscount = async (payload) => {
    try {
      await discountApi.createDiscount(payload)
      setMessage('Đã tạo mã giảm giá.')
      await loadData()
    } catch (err) {
      setError(err.message || 'Tạo mã giảm giá thất bại.')
      throw err
    }
  }

  const updateDiscount = async (id, payload) => {
    try {
      await discountApi.updateDiscount(id, payload)
      setMessage('Đã cập nhật mã giảm giá.')
      await loadData()
    } catch (err) {
      setError(err.message || 'Cập nhật mã giảm giá thất bại.')
      throw err
    }
  }

  const deleteDiscount = async (id) => {
    if (!window.confirm('Xóa mã giảm giá này?')) return

    try {
      await discountApi.deleteDiscount(id)
      setMessage('Đã xóa mã giảm giá.')
      await loadData()
    } catch (err) {
      setError(err.message || 'Xóa mã giảm giá thất bại.')
    }
  }

  const updateUserRole = async (id, role) => {
    try {
      const res = await adminApi.updateUserRole(id, role)
      setUsers((current) => current.map((user) => (user._id === id ? res.data.user : user)))
      setMessage('Đã cập nhật role người dùng.')
    } catch (err) {
      setError(err.message || 'Cập nhật role thất bại.')
    }
  }

  const renderProductForm = (title) => (
    <ProductForm
      activeVariant={activeVariant}
      activeVariantIndex={activeVariantIndex}
      editingId={editingId}
      form={form}
      loading={loading}
      previewProduct={previewProduct}
      title={title}
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
  )

  return (
    <main className="admin-page">
      <AdminSidebar activeSection={section} onChange={changeSection} />

      <div className="admin-main">
        <div className="admin-topbar">
          <div>
            <h1>{sectionTitles[section]}</h1>
          </div>
        </div>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {section === 'dashboard' && (
          <DashboardOverview stats={stats} range={statsRange} loading={statsLoading} onRangeChange={setStatsRange} />
        )}

        {section === 'products' && (
          <div className="admin-content-stack">
            {showCreateForm && renderProductForm('Thêm sản phẩm mới')}

            <section className="admin-panel">
              <div className="admin-section-header compact">
                <div>
                  <span className="eyebrow">Products</span>
                  <h2>Danh sách sản phẩm</h2>
                </div>
                <button className="btn btn-shop d-inline-flex align-items-center gap-2" type="button" onClick={openCreateForm}>
                  <Plus size={18} />
                  {showCreateForm ? '' : 'Thêm sản phẩm'}
                </button>
              </div>

              <div className="admin-search-bar">
                <Search size={18} />
                <input value={productSearch} onChange={(event) => setProductSearch(event.target.value)} placeholder="Tìm theo tên, loại, phân loại, giá, tồn kho..." />
              </div>

              <ProductList
                editingId={editingId}
                products={filteredProducts}
                renderEditForm={(product) => renderProductForm(`Sửa ${product.name}`)}
                onDelete={deleteProduct}
                onEdit={startEdit}
              />
            </section>
          </div>
        )}

        {section === 'orders' && (
          <section className="admin-panel">
            <div className="admin-section-header compact">
              <div>
                <span className="eyebrow">Orders</span>
                <h2>Quản lý hóa đơn</h2>
              </div>
            </div>
            <div className="admin-search-bar">
              <Search size={18} />
              <input value={orderSearch} onChange={(event) => setOrderSearch(event.target.value)} placeholder="Tìm mã đơn, trạng thái, khách hàng, mã giảm giá..." />
            </div>
            <OrderList orders={filteredOrders} onUpdateStatus={updateOrderStatus} />
          </section>
        )}

        {section === 'discounts' && (
          <DiscountManager
            discounts={discounts}
            searchValue={discountSearch}
            onCreate={createDiscount}
            onDelete={deleteDiscount}
            onSearchChange={setDiscountSearch}
            onUpdate={updateDiscount}
          />
        )}

        {section === 'users' && (
          <UserList
            searchValue={userSearch}
            users={filteredUsers}
            onSearchChange={setUserSearch}
            onUpdateRole={updateUserRole}
          />
        )}
      </div>
    </main>
  )
}
