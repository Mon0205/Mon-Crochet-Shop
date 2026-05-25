import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, MapPin, Phone, User } from 'lucide-react'
import { authApi } from '../api/authApi'
import { useAuth } from '../hooks/useAuth'

const Register = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
  })
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  const validateForm = () => {
    if (!formData.name.trim()) return 'Vui lòng nhập họ tên.'
    if (!formData.email.trim()) return 'Vui lòng nhập email.'
    if (!formData.phone.trim()) return 'Vui lòng nhập số điện thoại.'
    if (!formData.address.trim()) return 'Vui lòng nhập địa chỉ.'
    if (!formData.password.trim()) return 'Vui lòng nhập mật khẩu.'
    if (formData.password.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự.'
    if (!formData.confirmPassword.trim()) return 'Vui lòng nhập lại mật khẩu.'
    if (formData.password !== formData.confirmPassword) return 'Mật khẩu nhập lại không khớp.'
    return ''
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')

    const validationError = validateForm()
    if (validationError) {
      setErrorMessage(validationError)
      return
    }

    try {
      setLoading(true)
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        password: formData.password,
      }
      await authApi.register(payload)
      await login({ email: payload.email, password: payload.password })
      navigate('/')
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Đăng ký thất bại.'
      setErrorMessage(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-shell">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-10">
            <div className="auth-card p-3 p-md-4">
              <div className="row g-4 align-items-stretch">
                <div className="col-lg-5">
                  <div className="auth-aside d-flex flex-column justify-content-end">
                    <span className="eyebrow bg-white text-dark mb-3">Thành viên mới</span>
                    <h1 className="h2 fw-bold mb-3">Tạo tài khoản mua hàng</h1>
                    <p className="mb-0">Lưu thông tin giao hàng, theo dõi đơn và nhận các gợi ý nguyên liệu phù hợp.</p>
                  </div>
                </div>

                <div className="col-lg-7">
                  <form className="p-lg-4" onSubmit={handleSubmit}>
                    <h2 className="h3 fw-bold mb-2">Đăng ký</h2>
                    <p className="text-muted-shop mb-4">Điền thông tin để bắt đầu mua sắm tại Len Xinh Shop.</p>

                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold" htmlFor="name">Họ tên</label>
                        <div className="input-group">
                          <span className="input-group-text bg-white border-end-0"><User size={18} /></span>
                          <input id="name" className="form-control border-start-0" type="text" name="name" placeholder="Nguyễn An" value={formData.name} onChange={handleChange} />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold" htmlFor="email">Email</label>
                        <div className="input-group">
                          <span className="input-group-text bg-white border-end-0"><Mail size={18} /></span>
                          <input id="email" className="form-control border-start-0" type="email" name="email" placeholder="ban@example.com" value={formData.email} onChange={handleChange} />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold" htmlFor="phone">Số điện thoại</label>
                        <div className="input-group">
                          <span className="input-group-text bg-white border-end-0"><Phone size={18} /></span>
                          <input id="phone" className="form-control border-start-0" type="text" name="phone" placeholder="0901234567" value={formData.phone} onChange={handleChange} />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold" htmlFor="address">Địa chỉ</label>
                        <div className="input-group">
                          <span className="input-group-text bg-white border-end-0"><MapPin size={18} /></span>
                          <input id="address" className="form-control border-start-0" type="text" name="address" placeholder="Quận 1, TP.HCM" value={formData.address} onChange={handleChange} />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold" htmlFor="password">Mật khẩu</label>
                        <input id="password" className="form-control" type="password" name="password" placeholder="Tối thiểu 6 ký tự" value={formData.password} onChange={handleChange} />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold" htmlFor="confirmPassword">Nhập lại mật khẩu</label>
                        <input id="confirmPassword" className="form-control" type="password" name="confirmPassword" placeholder="Nhập lại mật khẩu" value={formData.confirmPassword} onChange={handleChange} />
                      </div>
                    </div>

                    <button className="btn btn-shop w-100 mt-4" type="submit" disabled={loading}>
                      {loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
                    </button>

                    <p className="text-center text-muted-shop mt-4 mb-0">
                      Đã có tài khoản? <Link to="/login" className="fw-bold">Đăng nhập</Link>
                    </p>
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

export default Register
