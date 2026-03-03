import apiClient from './api'

const supplierService = {
    // Get all suppliers
    getAllSuppliers: (params) =>
        apiClient.get('/suppliers', { params }),

    // Search suppliers
    searchSuppliers: (query) =>
        apiClient.get('/suppliers/search', { params: { q: query } }),

    // Get supplier by ID
    getSupplierById: (id) =>
        apiClient.get(`/suppliers/${id}`),

    // Create supplier
    createSupplier: (data) =>
        apiClient.post('/suppliers', data),

    create: (data) =>
        apiClient.post('/suppliers', data),

    // Update supplier
    updateSupplier: (id, data) =>
        apiClient.put(`/suppliers/${id}`, data),

    update: (id, data) =>
        apiClient.put(`/suppliers/${id}`, data),

    // Delete supplier
    deleteSupplier: (id) =>
        apiClient.delete(`/suppliers/${id}`),

    // Get by ID alias
    getById: (id) =>
        apiClient.get(`/suppliers/${id}`),
}

export default supplierService
