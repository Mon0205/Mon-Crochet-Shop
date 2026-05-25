import ProductCard from '../components/ProductCard'

const sampleProducts = [
  {
    _id: 'milk-cotton',
    name: 'Len Milk Cotton bảng màu pastel',
    price: 28000,
    discountPrice: 24000,
    quantity: 48,
    color: 'Pastel mix',
    category: { name: 'Len sợi' },
    images: ['https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=900&q=80'],
  },
  {
    _id: 'hook-set',
    name: 'Bộ kim móc cán mềm nhiều size',
    price: 89000,
    discountPrice: 0,
    quantity: 26,
    color: 'Nhiều màu',
    category: { name: 'Dụng cụ' },
    images: ['https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=900&q=80'],
  },
  {
    _id: 'safety-eyes',
    name: 'Mắt thú an toàn cho thú bông len',
    price: 18000,
    discountPrice: 0,
    quantity: 120,
    color: 'Đen',
    category: { name: 'Phụ kiện' },
    images: ['https://images.unsplash.com/photo-1517840933437-c41356892b35?auto=format&fit=crop&w=900&q=80'],
  },
  {
    _id: 'starter-kit',
    name: 'Combo người mới bắt đầu móc len',
    price: 159000,
    discountPrice: 139000,
    quantity: 18,
    color: 'Tùy chọn',
    category: { name: 'Combo' },
    images: ['https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=900&q=80'],
  },
]

export default function Products() {
  return (
    <main className="page-section">
      <div className="container">
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-end gap-3 mb-4">
          <div>
            <span className="eyebrow mb-3">Cửa hàng</span>
            <h1 className="display-6 fw-bold mb-2">Sản phẩm nổi bật</h1>
            <p className="text-muted-shop mb-0">Danh sách mẫu để hoàn thiện giao diện trước khi nối API sản phẩm.</p>
          </div>
          <div className="d-flex gap-2">
            <select className="form-select" aria-label="Lọc danh mục">
              <option>Tất cả danh mục</option>
              <option>Len sợi</option>
              <option>Dụng cụ</option>
              <option>Phụ kiện</option>
            </select>
            <select className="form-select" aria-label="Sắp xếp">
              <option>Mới nhất</option>
              <option>Giá thấp đến cao</option>
              <option>Giá cao đến thấp</option>
            </select>
          </div>
        </div>

        <div className="row g-4">
          {sampleProducts.map((product) => (
            <div className="col-sm-6 col-lg-3" key={product._id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
