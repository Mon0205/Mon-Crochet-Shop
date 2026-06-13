import { Search } from 'lucide-react'
import { formatOrderDate } from '../../utils/orderUtils'

export default function UserList({ searchValue, users, onSearchChange, onUpdateRole }) {
  return (
    <div className="admin-panel">
      <div className="admin-section-header compact">
        <div>
          <span className="eyebrow">Users</span>
          <h2>Quản lý người dùng</h2>
        </div>
      </div>

      <div className="admin-search-bar">
        <Search size={18} />
        <input value={searchValue} onChange={(event) => onSearchChange(event.target.value)} placeholder="Tìm theo tên, email, SĐT, địa chỉ, role..." />
      </div>

      <div className="user-table">
        <div className="user-table-head">
          <span>Người dùng</span>
          <span>Liên hệ</span>
          <span>Ngày tạo</span>
          <span>Role</span>
        </div>
        {users.map((user) => (
          <div className="user-row" key={user._id}>
            <div>
              <strong>{user.name}</strong>
              <span>{user.email}</span>
            </div>
            <div>
              <span>{user.phone || 'Chưa có SĐT'}</span>
              <span>{user.address || 'Chưa có địa chỉ'}</span>
            </div>
            <span>{formatOrderDate(user.createdAt)}</span>
            <select className="form-select" value={user.role} onChange={(event) => onUpdateRole(user._id, event.target.value)}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        ))}
        {users.length === 0 && <div className="empty-state">Không tìm thấy người dùng phù hợp.</div>}
      </div>
    </div>
  )
}
