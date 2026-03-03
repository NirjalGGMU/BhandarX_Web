import apiClient from './api'

const customerService = {
  // Get all customers
  getAll: (params) => 
    apiClient.get('/customers', { params }),

  // Get customer by ID
  getById: (id) => 
    apiClient.get(`/customers/${id}`),

  // Search customers
  search: (params) => 
    apiClient.get('/customers/search', { params }),

  // Get customers with outstanding balances
  getOutstanding: (params) => 
    apiClient.get('/customers/outstanding', { params }),

  // Get customer statistics
  getStatistics: () => 
    apiClient.get('/customers/statistics'),

  // Get customers by type
  getByType: (type, params) => 
    apiClient.get(`/customers/type/${type}`, { params }),

  // Create customer
  create: (data) => 
    apiClient.post('/customers', data),

  // Update customer
  update: (id, data) => 
    apiClient.put(`/customers/${id}`, data),

  // Toggle customer status
  toggleStatus: (id) => 
    apiClient.patch(`/customers/${id}/toggle-status`),

  // Delete customer
  delete: (id) => 
    apiClient.delete(`/customers/${id}`),
}

export default customerService
