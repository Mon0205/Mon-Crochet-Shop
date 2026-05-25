import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function ProtectedRoute({ children, admin = false }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <p className="container py-5">Đang kiểm tra đăng nhập...</p>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (admin && user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return children
}
