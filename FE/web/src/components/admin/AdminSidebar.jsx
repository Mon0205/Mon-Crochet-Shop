import { BarChart3, Boxes, FileText, TicketPercent, Users } from 'lucide-react'

const adminSections = [
  { key: 'dashboard', label: 'Tổng quan', icon: BarChart3 },
  { key: 'products', label: 'Sản phẩm', icon: Boxes },
  { key: 'orders', label: 'Hóa đơn', icon: FileText },
  { key: 'discounts', label: 'Giảm giá', icon: TicketPercent },
  { key: 'users', label: 'Người dùng', icon: Users },
]

export default function AdminSidebar({ activeSection, onChange }) {
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-brand">
        <h1>Mon Crochet</h1>
      </div>

      <nav className="admin-nav" aria-label="Admin navigation">
        {adminSections.map((section) => {
          const Icon = section.icon
          return (
            <button
              className={activeSection === section.key ? 'active' : ''}
              key={section.key}
              type="button"
              onClick={() => onChange(section.key)}
            >
              <Icon size={18} />
              <span>{section.label}</span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
