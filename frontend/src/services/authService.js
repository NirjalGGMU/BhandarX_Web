import apiClient from './api'

export const authService = {
  login: async (credentials) => {
    const { data } = await apiClient.post('/auth/login', credentials)
    return data
  },

  register: async (userData) => {
    const { data } = await apiClient.post('/auth/register', userData)
    return data
  },

  forgotPassword: async (email) => {
    const { data } = await apiClient.post('/auth/forgot-password', { email })
    return data
  },

  resetPassword: async ({ token, ...data }) => {
    const response = await apiClient.post(`/auth/reset-password/${token}`, data)
    return response.data
  },

  getProfile: async () => {
    const { data } = await apiClient.get('/auth/me')
    return data
  },

  updateProfile: async (userData) => {
    const { data } = await apiClient.put('/auth/update-profile', userData)
    return data
  },

  changePassword: async (passwords) => {
    const { data } = await apiClient.put('/auth/change-password', passwords)
    return data
  },
}
