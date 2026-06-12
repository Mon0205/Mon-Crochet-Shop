import axiosClient from './axiosClient'

export const orderApi = {
  createOrder: (data) => axiosClient.post('/orders', data),
  getMyOrders: () => axiosClient.get('/orders/mine'),
  getAdminOrders: () => axiosClient.get('/orders/admin'),
  updateOrderStatus: (id, status) => axiosClient.put(`/orders/${id}/status`, { status }),
}
