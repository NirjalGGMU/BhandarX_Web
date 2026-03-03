import apiClient from './api'

const purchaseService = {
  // Get all purchase orders
  getAll: (params) => 
    apiClient.get('/purchases', { params }),

  // Get purchase order by ID
  getById: (id) => 
    apiClient.get(`/purchases/${id}`),

  // Get purchase by PO number
  getByPoNumber: (poNumber) => 
    apiClient.get(`/purchases/po/${poNumber}`),

  // Get purchase summary
  getSummary: (params) => 
    apiClient.get('/purchases/summary', { params }),

  // Get daily purchase report
  getDailyReport: (params) => 
    apiClient.get('/purchases/reports/daily', { params }),

  // Get most purchased products
  getMostPurchased: (params) => 
    apiClient.get('/purchases/reports/most-purchased', { params }),

  // Get pending deliveries
  getPending: (params) => 
    apiClient.get('/purchases/pending', { params }),

  // Get overdue deliveries
  getOverdue: (params) => 
    apiClient.get('/purchases/overdue', { params }),

  // Get supplier purchase orders
  getSupplierPurchases: (supplierId, params) => 
    apiClient.get(`/purchases/supplier/${supplierId}`, { params }),

  // Get supplier purchase history
  getSupplierHistory: (supplierId, params) => 
    apiClient.get(`/purchases/supplier/${supplierId}/history`, { params }),

  // Create purchase order
  create: (data) => 
    apiClient.post('/purchases', data),

  // Update purchase order
  update: (id, data) => 
    apiClient.put(`/purchases/${id}`, data),

  // Receive items
  receiveItems: (id, data) => 
    apiClient.post(`/purchases/${id}/receive`, data),

  // Update payment
  updatePayment: (id, data) => 
    apiClient.patch(`/purchases/${id}/payment`, data),

  // Cancel purchase order
  cancel: (id, data) => 
    apiClient.patch(`/purchases/${id}/cancel`, data),

  // Delete purchase order
  delete: (id) => 
    apiClient.delete(`/purchases/${id}`),
}

export default purchaseService
