import axiosClient from './axiosClient'

export const authApi = {
  register: (data) => axiosClient.post('/auth/register', data),
  login: (data) => axiosClient.post('/auth/login', data),
  me: () => axiosClient.get('/auth/me'),
  updateMe: (data) => axiosClient.put('/auth/me', data),
  forgotPassword: (data) => axiosClient.post('/auth/forgot-password', data),
  verifyResetPasswordOtp: (data) => axiosClient.post('/auth/verify-reset-password-otp', data),
  resetPassword: (data) => axiosClient.post('/auth/reset-password', data),
}
