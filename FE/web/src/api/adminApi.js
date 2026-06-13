import axiosClient from './axiosClient'

export const adminApi = {
  getStats: (range = 'month') => axiosClient.get('/admin/stats', { params: { range } }),
  getUsers: () => axiosClient.get('/admin/users'),
  updateUserRole: (id, role) => axiosClient.put(`/admin/users/${id}/role`, { role }),
}
