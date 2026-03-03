export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'
export const BACKEND_URL = API_BASE_URL.split('/api')[0]

export const ROLES = {
  ADMIN: 'admin',
  EMPLOYEE: 'employee',
}

export const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
}

export const TRANSACTION_TYPES = {
  IN: 'IN',
  OUT: 'OUT',
  ADJUSTMENT: 'ADJUSTMENT',
}

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  LIMIT_OPTIONS: [10, 25, 50, 100],
}
