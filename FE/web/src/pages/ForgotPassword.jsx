import { useState } from 'react'
import { Link } from 'react-router-dom'
import { KeyRound, Mail, ShieldCheck } from 'lucide-react'
import { authApi } from '../api/authApi'

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message ||
  error.response?.data?.error ||
  error.message ||
  fallback

export default function ForgotPassword() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const sendOtp = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      const response = await authApi.forgotPassword({ email: email.trim() })
      setMessage(response.data.message)
      setStep(2)
    } catch (err) {
      setError(getErrorMessage(err, 'Gửi mã xác thực thất bại.'))
    } finally {
      setLoading(false)
    }
  }

  const verifyOtp = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      const response = await authApi.verifyResetPasswordOtp({
        email: email.trim(),
        otp: otp.trim(),
      })
      setMessage(response.data.message)
      setStep(3)
    } catch (err) {
      setError(getErrorMessage(err, 'Xác thực mã thất bại.'))
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')

    if (newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.')
      return
    }

    setLoading(true)

    try {
      const response = await authApi.resetPassword({
        email: email.trim(),
        otp: otp.trim(),
        newPassword,
      })
      setMessage(response.data.message)
      setStep(4)
    } catch (err) {
      setError(getErrorMessage(err, 'Đổi mật khẩu thất bại.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-shell">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-7 col-xl-6">
            <div className="auth-card p-4 p-md-5">
              <div className="text-center mb-4">
                <span className="feature-icon mx-auto mb-3">
                  <ShieldCheck size={24} />
                </span>
                <h1 className="h3 fw-bold mb-2">Khôi phục mật khẩu</h1>
                <p className="text-muted-shop mb-0">Xác thực mã OTP trước khi đặt mật khẩu mới.</p>
              </div>

              <div className="d-flex align-items-center justify-content-center gap-2 mb-4">
                {[1, 2, 3].map((item) => (
                  <span
                    key={item}
                    className={`rounded-pill ${step >= item ? 'bg-danger' : 'bg-secondary-subtle'}`}
                    style={{ width: 54, height: 6 }}
                  />
                ))}
              </div>

              {message && <div className="alert alert-success">{message}</div>}
              {error && <div className="alert alert-danger">{error}</div>}

              {step === 1 && (
                <form onSubmit={sendOtp}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold" htmlFor="forgotEmail">Email đã đăng ký</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0"><Mail size={18} /></span>
                      <input
                        id="forgotEmail"
                        className="form-control border-start-0"
                        type="email"
                        placeholder="ban@example.com"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <button className="btn btn-shop w-100" type="submit" disabled={loading}>
                    {loading ? 'Đang gửi mã...' : 'Gửi mã xác thực'}
                  </button>
                </form>
              )}

              {step === 2 && (
                <form onSubmit={verifyOtp}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold" htmlFor="verifyEmail">Email</label>
                    <input id="verifyEmail" className="form-control" value={email} type="email" readOnly />
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-semibold" htmlFor="otp">Mã OTP</label>
                    <input
                      id="otp"
                      className="form-control text-center fw-bold fs-5"
                      placeholder="000000"
                      value={otp}
                      onChange={(event) => setOtp(event.target.value)}
                      required
                    />
                  </div>
                  <button className="btn btn-shop w-100" type="submit" disabled={loading}>
                    {loading ? 'Đang xác thực...' : 'Xác thực mã'}
                  </button>
                </form>
              )}

              {step === 3 && (
                <form onSubmit={resetPassword}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold" htmlFor="newPassword">Mật khẩu mới</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0"><KeyRound size={18} /></span>
                      <input
                        id="newPassword"
                        className="form-control border-start-0"
                        placeholder="Tối thiểu 6 ký tự"
                        type="password"
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                        required
                        minLength="6"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-semibold" htmlFor="confirmNewPassword">Xác nhận mật khẩu mới</label>
                    <input
                      id="confirmNewPassword"
                      className="form-control"
                      placeholder="Nhập lại mật khẩu mới"
                      type="password"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      required
                      minLength="6"
                    />
                  </div>
                  <button className="btn btn-shop w-100" type="submit" disabled={loading}>
                    {loading ? 'Đang đổi mật khẩu...' : 'Đổi mật khẩu'}
                  </button>
                </form>
              )}

              {step === 4 && (
                <div className="text-center">
                  <h2 className="h5 fw-bold">Đổi mật khẩu thành công</h2>
                  <p className="text-muted-shop mb-4">Bạn có thể đăng nhập lại bằng mật khẩu mới.</p>
                  <Link to="/login" className="btn btn-shop">Về trang đăng nhập</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
