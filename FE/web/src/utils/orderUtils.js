export const orderStatusLabels = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  shipping: 'Đang giao',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
}

export const formatOrderDate = (date) =>
  new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))

export const getOrderCode = (order) => `#${order._id.slice(-6).toUpperCase()}`

export const getOrderItemsCount = (order) => order.items.reduce((sum, item) => sum + item.quantity, 0)
