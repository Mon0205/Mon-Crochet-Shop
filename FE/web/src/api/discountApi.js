import axiosClient from './axiosClient'

export const discountApi = {
  getAvailableDiscounts: (subtotal) => axiosClient.get('/discounts/available', { params: { subtotal } }),
  validateDiscount: (data) => axiosClient.post('/discounts/validate', data),
  getAdminDiscounts: () => axiosClient.get('/discounts/admin'),
  createDiscount: (data) => axiosClient.post('/discounts', data),
  updateDiscount: (id, data) => axiosClient.put(`/discounts/${id}`, data),
  deleteDiscount: (id) => axiosClient.delete(`/discounts/${id}`),
}
