import axiosClient from './axiosClient'

export const cartApi = {
  getCart: () => axiosClient.get('/cart'),
  saveCart: (items) => axiosClient.put('/cart', { items }),
  clearCart: () => axiosClient.delete('/cart'),
}
