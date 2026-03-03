import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

// Layouts
import AuthLayout from '../components/layout/AuthLayout'
import MainLayout from '../components/layout/MainLayout'

// Auth Pages
import LoginPage from '../features/auth/pages/LoginPage'
import RegisterPage from '../features/auth/pages/RegisterPage'
import ForgotPasswordPage from '../features/auth/pages/ForgotPasswordPage'
import ResetPasswordPage from '../features/auth/pages/ResetPasswordPage'

// Dashboard
import DashboardPage from '../features/dashboard/pages/DashboardPage'

// Products
import ProductListPage from '../features/products/pages/ProductListPage'
import ProductDetailsPage from '../features/products/pages/ProductDetailsPage'
import AddProductPage from '../features/products/pages/AddProductPage'
import EditProductPage from '../features/products/pages/EditProductPage'
import CategoryListPage from '../features/categories/pages/CategoryListPage'

// Inventory
import InventoryPage from '../features/inventory/pages/InventoryPage'
import StockAdjustmentPage from '../features/inventory/pages/StockAdjustmentPage'
import StockLedgerPage from '../features/inventory/pages/StockLedgerPage'
import InventoryImportPage from '../features/inventory/pages/InventoryImportPage'

// Transactions & Sales
import TransactionHistoryPage from '../features/transactions/pages/TransactionHistoryPage'
import InvoiceViewPage from '../features/transactions/pages/InvoiceViewPage'
import POSPage from '../features/sales/pages/POSPage'

// Customers
import CustomersPage from '../features/customers/pages/CustomersPage'
import CustomerDetailsPage from '../features/customers/pages/CustomerDetailsPage'
import CustomerFormPage from '../features/customers/pages/CustomerFormPage'

// Suppliers
import SupplierListPage from '../features/suppliers/pages/SupplierListPage'
import SupplierDetailsPage from '../features/suppliers/pages/SupplierDetailsPage'
import AddSupplierPage from '../features/suppliers/pages/AddSupplierPage'
import EditSupplierPage from '../features/suppliers/pages/EditSupplierPage'

// Reports
import ReportsPage from '../features/reports/pages/ReportsPage'

// Users
import UserListPage from '../features/users/pages/UserListPage'
import SettingsPage from '../features/users/pages/SettingsPage'

// Notifications
import NotificationsPage from '../features/notifications/pages/NotificationsPage'

import { ROLES } from '../utils/constants'

// Protected Route Component
const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

const IndexRedirect = () => {
  const { user } = useAuthStore()
  const target = user?.role === ROLES.ADMIN ? '/admin/products' : '/employee/pos'
  return <Navigate to={target} replace />
}

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuthStore()

  const getDefaultRoute = () => {
    if (!user) return '/login'
    return user.role === ROLES.ADMIN ? '/admin/products' : '/employee/pos'
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          isAuthenticated && user ? (
            <Navigate to={getDefaultRoute()} replace />
          ) : (
            <AuthLayout>
              <LoginPage />
            </AuthLayout>
          )
        }
      />
      <Route
        path="/register"
        element={
          <AuthLayout>
            <RegisterPage />
          </AuthLayout>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <AuthLayout>
            <ForgotPasswordPage />
          </AuthLayout>
        }
      />
      <Route
        path="/reset-password/:token"
        element={
          <AuthLayout>
            <ResetPasswordPage />
          </AuthLayout>
        }
      />
      <Route
        path="/reset-password"
        element={
          <AuthLayout>
            <ResetPasswordPage />
          </AuthLayout>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<IndexRedirect />} />
        <Route path="dashboard" element={<ProtectedRoute roles={[ROLES.ADMIN, ROLES.EMPLOYEE]}><DashboardPage /></ProtectedRoute>} />

        {/* ADMIN ROUTES */}
        <Route path="admin">
          <Route path="products" element={<ProtectedRoute roles={[ROLES.ADMIN]}><ProductListPage /></ProtectedRoute>} />
          <Route path="products/add" element={<ProtectedRoute roles={[ROLES.ADMIN]}><AddProductPage /></ProtectedRoute>} />
          <Route path="products/:id/edit" element={<ProtectedRoute roles={[ROLES.ADMIN]}><EditProductPage /></ProtectedRoute>} />
          <Route path="users" element={<ProtectedRoute roles={[ROLES.ADMIN]}><UserListPage /></ProtectedRoute>} />
          <Route path="reports" element={<ProtectedRoute roles={[ROLES.ADMIN]}><ReportsPage /></ProtectedRoute>} />
          <Route path="categories" element={<ProtectedRoute roles={[ROLES.ADMIN]}><CategoryListPage /></ProtectedRoute>} />
          <Route path="suppliers" element={<ProtectedRoute roles={[ROLES.ADMIN]}><SupplierListPage /></ProtectedRoute>} />
          <Route path="suppliers/add" element={<ProtectedRoute roles={[ROLES.ADMIN]}><AddSupplierPage /></ProtectedRoute>} />
          <Route path="suppliers/:id" element={<ProtectedRoute roles={[ROLES.ADMIN]}><SupplierDetailsPage /></ProtectedRoute>} />
          <Route path="suppliers/:id/edit" element={<ProtectedRoute roles={[ROLES.ADMIN]}><EditSupplierPage /></ProtectedRoute>} />
          <Route path="transactions" element={<ProtectedRoute roles={[ROLES.ADMIN]}><TransactionHistoryPage /></ProtectedRoute>} />
        </Route>

        {/* EMPLOYEE ROUTES */}
        <Route path="employee">
          <Route path="dashboard" element={<ProtectedRoute roles={[ROLES.EMPLOYEE, ROLES.ADMIN]}><DashboardPage /></ProtectedRoute>} />
          <Route path="pos" element={<ProtectedRoute roles={[ROLES.EMPLOYEE, ROLES.ADMIN]}><POSPage /></ProtectedRoute>} />
          <Route path="products" element={<ProtectedRoute roles={[ROLES.EMPLOYEE, ROLES.ADMIN]}><ProductListPage /></ProtectedRoute>} />
          <Route path="history" element={<ProtectedRoute roles={[ROLES.EMPLOYEE, ROLES.ADMIN]}><TransactionHistoryPage /></ProtectedRoute>} />
        </Route>

        {/* Shared / Other */}
        <Route path="products/:id" element={<ProductDetailsPage />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="customers" element={<ProtectedRoute roles={[ROLES.ADMIN, ROLES.EMPLOYEE]}><CustomersPage /></ProtectedRoute>} />
        <Route path="customers/new" element={<ProtectedRoute roles={[ROLES.ADMIN, ROLES.EMPLOYEE]}><CustomerFormPage /></ProtectedRoute>} />
        <Route path="customers/:id" element={<ProtectedRoute roles={[ROLES.ADMIN, ROLES.EMPLOYEE]}><CustomerDetailsPage /></ProtectedRoute>} />
        <Route path="customers/:id/edit" element={<ProtectedRoute roles={[ROLES.ADMIN, ROLES.EMPLOYEE]}><CustomerFormPage /></ProtectedRoute>} />
        <Route path="transactions/:id" element={<InvoiceViewPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="profile" element={<SettingsPage />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
