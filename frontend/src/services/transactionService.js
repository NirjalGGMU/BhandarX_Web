import apiClient from './api'

const transactionService = {
  // Get all transactions
  getAll: (params) => 
    apiClient.get('/transactions', { params }),

  // Get transaction by ID
  getById: (id) => 
    apiClient.get(`/transactions/${id}`),

  // Get recent transactions
  getRecent: (params) => 
    apiClient.get('/transactions/recent', { params }),

  // Get transaction summary
  getSummary: (params) => 
    apiClient.get('/transactions/summary', { params }),

  // Get transactions by date range
  getByDateRange: (params) => 
    apiClient.get('/transactions/date-range', { params }),

  // Get product transactions
  getProductTransactions: (productId, params) => 
    apiClient.get(`/transactions/product/${productId}`, { params }),

  // Create transaction
  create: (data) => 
    apiClient.post('/transactions', data),
}

export default transactionService
