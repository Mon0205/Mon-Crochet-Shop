import { Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Profile from './pages/Profile'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import CheckoutSuccess from './pages/CheckoutSuccess'
import Admin from './pages/Admin'
import MyOrders from './pages/MyOrders'
import ProtectedRoute from './components/ProtectedRoute'


export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout/success"
          element={
            <ProtectedRoute>
              <CheckoutSuccess />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute admin>
              <Admin />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  )
}
