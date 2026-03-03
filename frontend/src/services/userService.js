import apiClient from './api'

export const userService = {
    getAllUsers: async (params) => {
        const { data } = await apiClient.get('/users', { params })
        return data
    },

    getUserById: async (id) => {
        const { data } = await apiClient.get(`/users/${id}`)
        return data
    },

    createUser: async (userData) => {
        const { data } = await apiClient.post('/users', userData)
        return data
    },

    updateUser: async (id, userData) => {
        const { data } = await apiClient.put(`/users/${id}`, userData)
        return data
    },

    deleteUser: async (id) => {
        const { data } = await apiClient.delete(`/users/${id}`)
        return data
    },

    toggleUserStatus: async (id) => {
        const { data } = await apiClient.patch(`/users/${id}/toggle-status`)
        return data
    },

    getUserStats: async () => {
        const { data } = await apiClient.get('/users/statistics')
        return data
    },

    updateProfile: async (id, userData) => {
        const { data } = await apiClient.put('/users/profile/me', userData)
        return data
    },

    uploadProfileImage: async (formData) => {
        const { data } = await apiClient.post('/users/profile/image', formData)
        return data
    },

    changePassword: async (userId, passwords) => {
        const { data } = await apiClient.put('/auth/change-password', passwords)
        return data
    },
}
