import apiClient from './api'

const inventoryService = {
  // Get stock ledger
  getStockLedger: (productId, params) =>
    apiClient.get(`/stock-ledger/${productId}`, { params }),

  // Get stock movement summary
  getMovementSummary: (params) =>
    apiClient.get('/stock-ledger/summary', { params }),

  // Get stock valuation
  getStockValuation: (params) =>
    apiClient.get('/stock-ledger/valuation', { params }),

  // Get stock analytics
  getStockAnalytics: (params) =>
    apiClient.get('/stock-ledger/analytics', { params }),

  // Get stock alerts
  getLowStockAlerts: () =>
    apiClient.get('/alerts/low-stock'),

  getOutOfStockAlerts: () =>
    apiClient.get('/alerts/out-of-stock'),

  getExpiryAlerts: () =>
    apiClient.get('/alerts/expiry'),

  getAlertsSummary: () =>
    apiClient.get('/alerts/summary'),

  // Manual Adjust Stock
  adjustStock: (data) =>
    apiClient.post('/stock-ledger/adjust', data),
}

export default inventoryService
