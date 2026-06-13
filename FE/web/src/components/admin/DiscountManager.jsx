import { Edit3, Search, TicketPercent } from 'lucide-react'
import { useMemo, useState } from 'react'
import { formatPrice } from '../../context/CartContext'

const emptyForm = {
  code: '',
  type: 'percent',
  value: '',
  minOrderAmount: '',
  maxDiscountAmount: '',
  usageLimit: '',
  startsAt: '',
  endsAt: '',
  isActive: true,
}

const formatDateInput = (date) => (date ? new Date(date).toISOString().slice(0, 10) : '')

const normalizeSearch = (value = '') =>
  String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()

export default function DiscountManager({ discounts, searchValue, onCreate, onSearchChange, onUpdate }) {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState('')
  const [form, setForm] = useState(emptyForm)
  const isEditing = Boolean(editingId)

  const filteredDiscounts = useMemo(() => {
    const keyword = normalizeSearch(searchValue)
    if (!keyword) return discounts

    return discounts.filter((discount) =>
      normalizeSearch(
        [
          discount.code,
          discount.type,
          discount.value,
          discount.minOrderAmount,
          discount.maxDiscountAmount,
          discount.isActive ? 'active' : 'inactive',
        ].join(' '),
      ).includes(keyword),
    )
  }, [discounts, searchValue])

  const updateForm = (event) => {
    const { checked, name, type, value } = event.target
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId('')
    setShowForm(false)
  }

  const startCreate = () => {
    setForm(emptyForm)
    setEditingId('')
    setShowForm((current) => !current)
  }

  const startEdit = (discount) => {
    setEditingId(discount._id)
    setShowForm(true)
    setForm({
      code: discount.code || '',
      type: discount.type || 'percent',
      value: discount.value || '',
      minOrderAmount: discount.minOrderAmount || '',
      maxDiscountAmount: discount.maxDiscountAmount || '',
      usageLimit: discount.usageLimit || '',
      startsAt: formatDateInput(discount.startsAt),
      endsAt: formatDateInput(discount.endsAt),
      isActive: discount.isActive !== false,
    })
  }

  const submitForm = async (event) => {
    event.preventDefault()
    const payload = isEditing
      ? {
          usageLimit: Number(form.usageLimit || 0),
          startsAt: form.startsAt || null,
          endsAt: form.endsAt || null,
        }
      : {
          ...form,
          value: Number(form.value || 0),
          minOrderAmount: Number(form.minOrderAmount || 0),
          maxDiscountAmount: Number(form.maxDiscountAmount || 0),
          usageLimit: Number(form.usageLimit || 0),
          startsAt: form.startsAt || null,
          endsAt: form.endsAt || null,
        }

    if (isEditing) {
      await onUpdate(editingId, payload)
    } else {
      await onCreate(payload)
    }

    resetForm()
  }

  return (
    <section className="admin-panel">
      <div className="admin-section-header compact">
        <div>
          <h2>Quản lý mã giảm giá</h2>
        </div>
        <button className="btn btn-shop d-inline-flex align-items-center gap-2" type="button" onClick={startCreate}>
          <TicketPercent size={18} />
          {showForm && !isEditing ? '' : 'Thêm mã'}
        </button>
      </div>

      {showForm && (
        <form className="discount-form" onSubmit={submitForm}>
          {isEditing && (
            <p className="text-muted-shop mb-3">
              Mã giảm giá đã tạo chỉ được sửa thời gian áp dụng và số lượt dùng.
            </p>
          )}
          <div className="row g-3">
            <div className="col-md-3">
              <input
                className="form-control"
                disabled={isEditing}
                name="code"
                placeholder="Mã giảm giá"
                value={form.code}
                onChange={updateForm}
                required
              />
            </div>
            <div className="col-md-3">
              <select className="form-select" disabled={isEditing} name="type" value={form.type} onChange={updateForm}>
                <option value="percent">Giảm theo %</option>
                <option value="fixed">Giảm tiền</option>
              </select>
            </div>
            <div className="col-md-3">
              <input
                className="form-control"
                disabled={isEditing}
                name="value"
                type="number"
                placeholder="Giá trị"
                value={form.value}
                onChange={updateForm}
                required
              />
            </div>
            <div className="col-md-3">
              <input
                className="form-control"
                disabled={isEditing}
                name="minOrderAmount"
                type="number"
                placeholder="Đơn tối thiểu"
                value={form.minOrderAmount}
                onChange={updateForm}
              />
            </div>
            <div className="col-md-3">
              <input
                className="form-control"
                disabled={isEditing}
                name="maxDiscountAmount"
                type="number"
                placeholder="Giảm tối đa"
                value={form.maxDiscountAmount}
                onChange={updateForm}
              />
            </div>
            <div className="col-md-3">
              <input
                className="form-control"
                name="usageLimit"
                type="number"
                min="0"
                placeholder="Giới hạn lượt"
                value={form.usageLimit}
                onChange={updateForm}
              />
            </div>
            <div className="col-md-3">
              <input className="form-control" name="startsAt" type="date" value={form.startsAt} onChange={updateForm} />
            </div>
            <div className="col-md-3">
              <input className="form-control" name="endsAt" type="date" value={form.endsAt} onChange={updateForm} />
            </div>
            <div className="col-12 d-flex flex-wrap align-items-center gap-2">
              <label className="form-check d-flex align-items-center gap-2 fw-semibold mb-0">
                <input
                  className="form-check-input mt-0"
                  disabled={isEditing}
                  name="isActive"
                  type="checkbox"
                  checked={form.isActive}
                  onChange={updateForm}
                />
                Đang bật
              </label>
              <button className="btn btn-shop" type="submit">
                {isEditing ? 'Cập nhật mã' : 'Lưu mã'}
              </button>
              <button className="btn btn-shop-outline" type="button" onClick={resetForm}>
                Hủy
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="admin-search-bar">
        <Search size={18} />
        <input
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Tìm theo mã, loại giảm, giá trị, trạng thái..."
        />
      </div>

      <div className="discount-table">
        {filteredDiscounts.map((discount) => {
          const isOutOfUses = discount.usageLimit > 0 && (discount.usedCount || 0) >= discount.usageLimit
          const isEnabled = discount.isActive && !isOutOfUses

          return (
            <div className="discount-row" key={discount._id}>
              <div>
                <strong>{discount.code}</strong>
                <span>{discount.type === 'percent' ? `Giảm ${discount.value}%` : `Giảm ${formatPrice(discount.value)}`}</span>
              </div>
              <div>
                <span>Đơn tối thiểu: {formatPrice(discount.minOrderAmount)}</span>
                <span>{discount.maxDiscountAmount > 0 ? `Tối đa ${formatPrice(discount.maxDiscountAmount)}` : 'Không giới hạn giảm tối đa'}</span>
              </div>
              <div>
                <span>
                  Đã dùng {discount.usedCount || 0}
                  {discount.usageLimit > 0 ? `/${discount.usageLimit}` : ''}
                </span>
                <span className={isEnabled ? 'discount-status active' : 'discount-status'}>{isEnabled ? 'Đang bật' : 'Đã tắt'}</span>
              </div>
              <div className="admin-actions">
                <button className="icon-button" type="button" onClick={() => startEdit(discount)} aria-label="Sửa mã giảm giá">
                  <Edit3 size={18} />
                </button>
              </div>
            </div>
          )
        })}
        {filteredDiscounts.length === 0 && <div className="empty-state">Không tìm thấy mã giảm giá phù hợp.</div>}
      </div>
    </section>
  )
}
