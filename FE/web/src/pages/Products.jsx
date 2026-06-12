import { useEffect, useMemo, useState } from 'react'
import ProductCard from '../components/ProductCard'
import { productApi } from '../api/productApi'

export default function Products() {
  const [products, setProducts] = useState([])
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState('newest')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    productApi
      .getProducts({ category, sort, search })
      .then((res) => setProducts(res.data.products))
      .catch((err) => setError(err.message || 'Không tải được sản phẩm.'))
      .finally(() => setLoading(false))
  }, [category, sort, search])

  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category?.name).filter(Boolean))],
    [products],
  )

  return (
    <main className="page-section">
      <div className="container">
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-end gap-3 mb-4">
          <div>
            <span className="eyebrow mb-3">Cửa hàng</span>
            <h1 className="display-6 fw-bold mb-2">Sản phẩm len móc</h1>
            <p className="text-muted-shop mb-0">Chọn nguyên liệu, phụ kiện và combo phù hợp rồi đặt COD.</p>
          </div>
          <div className="product-toolbar">
            <input
              className="form-control"
              placeholder="Tìm sản phẩm"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <select className="form-select" value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="">Tất cả danh mục</option>
              {categories.map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
            </select>
            <select className="form-select" value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="newest">Mới nhất</option>
              <option value="priceAsc">Giá thấp đến cao</option>
              <option value="priceDesc">Giá cao đến thấp</option>
            </select>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {loading && <div className="alert alert-light border">Đang tải sản phẩm...</div>}

        {!loading && products.length === 0 && (
          <div className="empty-state">Chưa có sản phẩm phù hợp.</div>
        )}

        <div className="row g-4">
          {products.map((product) => (
            <div className="col-sm-6 col-lg-3" key={product._id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
