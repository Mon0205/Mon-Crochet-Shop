import { BarChart3, Boxes, Clock3, FileText, TrendingUp, Users } from 'lucide-react'
import { formatPrice } from '../../context/CartContext'

const rangeOptions = [
  { value: 'day', label: 'Ngày' },
  { value: 'week', label: 'Tuần' },
  { value: 'month', label: 'Tháng' },
  { value: 'year', label: 'Năm' },
]

const summaryCards = [
  { key: 'revenue', label: 'Doanh thu', icon: TrendingUp, format: formatPrice },
  { key: 'ordersCount', label: 'Đơn hàng', icon: FileText },
  { key: 'productsCount', label: 'Sản phẩm', icon: Boxes },
  { key: 'usersCount', label: 'Người dùng', icon: Users },
  { key: 'pendingOrdersCount', label: 'Đơn chờ xử lý', icon: Clock3 },
]

export default function DashboardOverview({ stats, range, onRangeChange, loading }) {
  const summary = stats?.summary || {}
  const revenueSeries = stats?.revenueSeries || []
  const topProducts = stats?.topProducts || []
  const maxRevenue = Math.max(...revenueSeries.map((item) => item.value), 1)
  const maxSold = Math.max(...topProducts.map((item) => item.quantity), 1)

  return (
    <div className="admin-dashboard">
      <div className="admin-section-header">
        
        <select className="form-select admin-range-select" value={range} onChange={(event) => onRangeChange(event.target.value)}>
          {rangeOptions.map((option) => (
            <option value={option.value} key={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="admin-metric-grid">
        {summaryCards.map((card) => {
          const Icon = card.icon
          const rawValue = summary[card.key] || 0
          const value = card.format ? card.format(rawValue) : rawValue.toLocaleString('vi-VN')

          return (
            <div className="admin-metric-card" key={card.key}>
              <span>
                <Icon size={20} />
              </span>
              <p>{card.label}</p>
              <strong>{loading ? '...' : value}</strong>
            </div>
          )
        })}
      </div>

      <div className="admin-dashboard-grid">
        <section className="admin-panel">
          <div className="admin-panel-title">
            <div>
              <h3>Doanh thu</h3>
              <p>Theo khoảng thời gian đã chọn</p>
            </div>
            <BarChart3 size={20} />
          </div>
          <div className="revenue-chart">
            {revenueSeries.map((item) => (
              <div className="revenue-chart-item" key={item.label}>
                <div className="revenue-bar-wrap">
                  <div className="revenue-bar" style={{ height: `${Math.max((item.value / maxRevenue) * 100, item.value > 0 ? 8 : 0)}%` }} />
                </div>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="admin-panel">
          <div className="admin-panel-title">
            <div>
              <h3>Sản phẩm bán chạy</h3>
              <p>Xếp theo số lượng đã bán trong khoảng này</p>
            </div>
          </div>
          <div className="top-products">
            {topProducts.map((product, index) => (
              <div className="top-product-row" key={product.id}>
                <strong>{index + 1}</strong>
                <div>
                  <p>{product.name}</p>
                  <span>
                    {product.variantColor ? `Phân loại: ${product.variantColor}` : 'Không có biến thể'} · {formatPrice(product.revenue)}
                  </span>
                </div>
                <div className="top-product-meter">
                  <span style={{ width: `${Math.max((product.quantity / maxSold) * 100, 8)}%` }} />
                </div>
                <em>{product.quantity}</em>
              </div>
            ))}
            {topProducts.length === 0 && <div className="empty-state">Chưa có dữ liệu bán chạy.</div>}
          </div>
        </section>
      </div>
    </div>
  )
}
