import apiClient from './api'

const categoryService = {
    getAllCategories: (params) =>
        apiClient.get('/categories', { params }),

    getRootCategories: () =>
        apiClient.get('/categories/root'),

    getCategoryById: (id) =>
        apiClient.get(`/categories/${id}`),

    getSubcategories: (id) =>
        apiClient.get(`/categories/${id}/subcategories`),

    createCategory: (data) =>
        apiClient.post('/categories', data),

    updateCategory: (id, data) =>
        apiClient.put(`/categories/${id}`, data),

    deleteCategory: (id) =>
        apiClient.delete(`/categories/${id}`),
}

export default categoryService
