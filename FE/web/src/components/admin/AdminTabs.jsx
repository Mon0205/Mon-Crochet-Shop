export default function AdminTabs({ activeTab, onChange }) {
  return (
    <div className="admin-tabs">
      <button className={activeTab === 'products' ? 'active' : ''} onClick={() => onChange('products')} type="button">
        Sản phẩm
      </button>
      <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => onChange('orders')} type="button">
        Đơn hàng
      </button>
    </div>
  )
}
