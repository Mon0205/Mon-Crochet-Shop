import axiosClient from './axiosClient'

export const productApi = {
  getProducts: (params) => axiosClient.get('/products', { params }),
  getAdminProducts: () => axiosClient.get('/products/admin'),
  getProductById: (id) => axiosClient.get(`/products/${id}`),
  createProduct: (data) => axiosClient.post('/products', data),
  updateProduct: (id, data) => axiosClient.put(`/products/${id}`, data),
  deleteProduct: (id) => axiosClient.delete(`/products/${id}`),
  uploadImages: (files) => {
    const formData = new FormData()
    files.forEach((file) => formData.append('images', file))
    return axiosClient.post('/uploads/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}
