import apiClient from './api'

export const notificationService = {
    getUserNotifications: async (params) => {
        const { data } = await apiClient.get('/notifications', { params })
        return data
    },

    markAsRead: async (id) => {
        const { data } = await apiClient.patch(`/notifications/${id}/read`)
        return data
    },

    markAllAsRead: async () => {
        const { data } = await apiClient.patch('/notifications/read-all')
        return data
    },

    deleteNotification: async (id) => {
        const { data } = await apiClient.delete(`/notifications/${id}`)
        return data
    },

    getUnreadCount: async () => {
        const { data } = await apiClient.get('/notifications/unread-count')
        return data
    },
}

export default notificationService
