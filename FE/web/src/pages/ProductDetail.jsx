import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { productApi } from '../api/productApi'
import ProductGallery from '../components/product/ProductGallery'
import ProductInfoPanel from '../components/product/ProductInfoPanel'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'
import { getImageUrl } from '../utils/productImages'

const getProductVariants = (product) =>
  product.hasVariants && product.variants?.length > 0
    ? product.variants
    : [{ color: product.color, quantity: product.quantity, images: product.images || [] }]

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [activeVariantIndex, setActiveVariantIndex] = useState(0)
  const [activeImage, setActiveImage] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setError('')
    setMessage('')
    productApi
      .getProductById(id)
      .then((res) => {
        const nextProduct = res.data.product
        const variants = getProductVariants(nextProduct)
        const firstVariant = variants[0]

        setProduct({ ...nextProduct, variants })
        setActiveVariantIndex(0)
        setActiveImage(getImageUrl(firstVariant?.images?.[0]))
        setQuantity(firstVariant?.quantity > 0 ? 1 : 0)
      })
      .catch((err) => setError(err.message || 'Không tải được sản phẩm.'))
      .finally(() => setLoading(false))
  }, [id])

  const selectedVariant = product?.variants?.[activeVariantIndex]
  const price = useMemo(() => {
    if (!product) return 0
    return product.discountPrice > 0 ? product.discountPrice : product.price
  }, [product])

  const requireLogin = () => {
    if (user) return false
    navigate('/login')
    return true
  }

  const selectVariant = (index) => {
    const variant = product.variants[index]
    setActiveVariantIndex(index)
    setActiveImage(getImageUrl(variant.images?.[0]))
    setQuantity(variant.quantity > 0 ? 1 : 0)
    setMessage('')
  }

  const changeQuantity = (nextQuantity) => {
    if (!selectedVariant) return
    setQuantity(Math.max(1, Math.min(nextQuantity || 1, selectedVariant.quantity)))
  }

  const handleAddToCart = () => {
    if (!product || !selectedVariant || requireLogin()) return
    addToCart(product, quantity, selectedVariant)
    setMessage('Đã thêm sản phẩm vào giỏ hàng.')
  }

  const handleBuyNow = () => {
    if (!product || !selectedVariant || requireLogin()) return
    addToCart(product, quantity, selectedVariant)
    navigate('/cart')
  }

  if (loading) {
    return (
      <main className="page-section">
        <div className="container">
          <div className="alert alert-light border">Đang tải sản phẩm...</div>
        </div>
      </main>
    )
  }

  if (error || !product || !selectedVariant) {
    return (
      <main className="page-section">
        <div className="container">
          <div className="empty-state">
            <h1 className="h4 fw-bold">Không tìm thấy sản phẩm</h1>
            <p className="text-muted-shop mb-4">{error}</p>
            <Link className="btn btn-shop" to="/products">
              Quay lại cửa hàng
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="product-detail-page">
      <div className="container">
        <div className="product-detail-layout">
          <ProductGallery
            activeImage={activeImage}
            description={product.description}
            images={selectedVariant.images}
            productName={product.name}
            onSelectImage={setActiveImage}
          />
          <ProductInfoPanel
            activeVariantIndex={activeVariantIndex}
            message={message}
            price={price}
            product={product}
            quantity={quantity}
            selectedVariant={selectedVariant}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onChangeQuantity={changeQuantity}
            onSelectVariant={selectVariant}
          />
        </div>
      </div>
    </main>
  )
}
