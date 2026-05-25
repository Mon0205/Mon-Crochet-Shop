import { useState } from 'react'
import { Edit3, Mail, MapPin, Phone, Save, User, X } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

const getProfileForm = (user) => ({
  name: user?.name || '',
  email: user?.email || '',
  phone: user?.phone || '',
  address: user?.address || '',
})

export default function Profile() {
  const { user, updateProfile } = useAuth()
  const [form, setForm] = useState(() => getProfileForm(user))
  const [isEditing, setIsEditing] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const startEditing = () => {
    setMessage('')
    setError('')
    setForm(getProfileForm(user))
    setIsEditing(true)
  }

  const cancelEditing = () => {
    setMessage('')
    setError('')
    setForm(getProfileForm(user))
    setIsEditing(false)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')
    setError('')

    if (!form.name.trim()) {
      setError('Vui lòng nhập họ tên.')
      return
    }

    setLoading(true)

    try {
      const data = await updateProfile({
        name: form.name,
        phone: form.phone,
        address: form.address,
      })
      setMessage(data.message)
      setIsEditing(false)
    } catch (err) {
      setError(err.message || 'Cập nhật thông tin thất bại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="page-section">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-9">
            <div className="auth-card p-4 p-md-5">
              <div className="row g-4">
                <div className="col-lg-4">
                  <div className="profile-summary h-100">
                    <span className="feature-icon mb-3">
                      <User size={24} />
                    </span>
                    <h1 className="h3 fw-bold mb-2">Thông tin cá nhân</h1>
                    <p className="text-muted-shop mb-0">
                      Xem thông tin tài khoản. Khi cần thay đổi, bấm nút sửa thông tin trước.
                    </p>
                  </div>
                </div>

                <div className="col-lg-8">
                  <div className="d-flex justify-content-between align-items-start gap-3 mb-4">
                    <div>
                      <h2 className="h4 fw-bold mb-1">Hồ sơ của tôi</h2>
                      <p className="text-muted-shop mb-0">Email đăng nhập không thể thay đổi.</p>
                    </div>
                    {!isEditing && (
                      <button onClick={startEditing} className="btn btn-shop-outline d-inline-flex align-items-center gap-2" type="button">
                        <Edit3 size={18} />
                        Sửa thông tin
                      </button>
                    )}
                  </div>

                  {message && <div className="alert alert-success">{message}</div>}
                  {error && <div className="alert alert-danger">{error}</div>}

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label fw-semibold" htmlFor="profileName">Họ tên</label>
                      <div className="input-group">
                        <span className="input-group-text bg-white border-end-0"><User size={18} /></span>
                        <input
                          id="profileName"
                          className="form-control border-start-0"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          disabled={!isEditing}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold" htmlFor="profileEmail">Email</label>
                      <div className="input-group">
                        <span className="input-group-text bg-white border-end-0"><Mail size={18} /></span>
                        <input
                          id="profileEmail"
                          className="form-control border-start-0"
                          name="email"
                          value={form.email}
                          disabled
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold" htmlFor="profilePhone">Số điện thoại</label>
                      <div className="input-group">
                        <span className="input-group-text bg-white border-end-0"><Phone size={18} /></span>
                        <input
                          id="profilePhone"
                          className="form-control border-start-0"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          disabled={!isEditing}
                          placeholder="0901234567"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-semibold" htmlFor="profileAddress">Địa chỉ</label>
                      <div className="input-group">
                        <span className="input-group-text bg-white border-end-0"><MapPin size={18} /></span>
                        <input
                          id="profileAddress"
                          className="form-control border-start-0"
                          name="address"
                          value={form.address}
                          onChange={handleChange}
                          disabled={!isEditing}
                          placeholder="Nhập địa chỉ giao hàng"
                        />
                      </div>
                    </div>

                    {isEditing && (
                      <div className="d-flex flex-wrap gap-2">
                        <button className="btn btn-shop d-inline-flex align-items-center gap-2" type="submit" disabled={loading}>
                          <Save size={18} />
                          {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </button>
                        <button className="btn btn-shop-outline d-inline-flex align-items-center gap-2" type="button" onClick={cancelEditing} disabled={loading}>
                          <X size={18} />
                          Hủy
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
