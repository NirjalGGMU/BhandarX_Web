import apiClient from './api'

const salesService = {
  // Get all sales
  getAll: (params) => 
    apiClient.get('/sales', { params }),

  // Get sale by ID
  getById: (id) => 
    apiClient.get(`/sales/${id}`),

  // Get sale by invoice number
  getByInvoiceNumber: (invoiceNumber) => 
    apiClient.get(`/sales/invoice/${invoiceNumber}`),

  // Get sales summary
  getSummary: (params) => 
    apiClient.get('/sales/summary', { params }),

  // Get daily sales report
  getDailyReport: (params) => 
    apiClient.get('/sales/reports/daily', { params }),

  // Get top selling products
  getTopProducts: (params) => 
    apiClient.get('/sales/reports/top-products', { params }),

  // Get sales by payment method
  getByPaymentMethod: (params) => 
    apiClient.get('/sales/reports/payment-methods', { params }),

  // Get overdue sales
  getOverdue: (params) => 
    apiClient.get('/sales/overdue', { params }),

  // Get customer sales
  getCustomerSales: (customerId, params) => 
    apiClient.get(`/sales/customer/${customerId}`, { params }),

  // Get customer purchase history
  getCustomerHistory: (customerId, params) => 
    apiClient.get(`/sales/customer/${customerId}/history`, { params }),

  // Create sale
  create: (data) => 
    apiClient.post('/sales', data),

  // Update payment
  updatePayment: (id, data) => 
    apiClient.patch(`/sales/${id}/payment`, data),

  // Reverse sale
  reverse: (id, data) => 
    apiClient.post(`/sales/${id}/reverse`, data),

  // Cancel sale
  cancel: (id, data) => 
    apiClient.patch(`/sales/${id}/cancel`, data),

  // Delete sale
  delete: (id) => 
    apiClient.delete(`/sales/${id}`),
}

export default salesService
