import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LockKeyhole, Mail } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onChange = (event) => setForm({ ...form, [event.target.name]: event.target.value })

  const onSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(form)
      navigate('/products')
    } catch (err) {
      setError(err.message)
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
                    <span className="eyebrow bg-white text-dark mb-3">Mon Crochet Shop</span>
                    <h1 className="h2 fw-bold mb-3">Chào mừng bạn quay lại</h1>
                    <p className="mb-0">Đăng nhập để xem giỏ hàng, theo dõi đơn hàng và mua nguyên liệu nhanh hơn.</p>
                  </div>
                </div>

                <div className="col-lg-7">
                  <form className="p-lg-4" onSubmit={onSubmit}>
                    <h2 className="h3 fw-bold mb-2">Đăng nhập</h2>
                    <p className="text-muted-shop mb-4">Nhập email và mật khẩu tài khoản của bạn.</p>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <div className="mb-3">
                      <label className="form-label fw-semibold" htmlFor="loginEmail">Email</label>
                      <div className="input-group">
                        <span className="input-group-text bg-white border-end-0">
                          <Mail size={18} />
                        </span>
                        <input
                          id="loginEmail"
                          className="form-control border-start-0"
                          name="email"
                          type="email"
                          placeholder="ban@example.com"
                          value={form.email}
                          onChange={onChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold" htmlFor="loginPassword">Mật khẩu</label>
                      <div className="input-group">
                        <span className="input-group-text bg-white border-end-0">
                          <LockKeyhole size={18} />
                        </span>
                        <input
                          id="loginPassword"
                          className="form-control border-start-0"
                          name="password"
                          type="password"
                          placeholder="Nhập mật khẩu"
                          value={form.password}
                          onChange={onChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <Link to="/forgot-password" className="fw-semibold">Quên mật khẩu?</Link>
                    </div>

                    <button className="btn btn-shop w-100" type="submit" disabled={loading}>
                      {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </button>

                    <p className="text-center text-muted-shop mt-4 mb-0">
                      Chưa có tài khoản? <Link to="/register" className="fw-bold">Đăng ký</Link>
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
