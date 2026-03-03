import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  Package, DollarSign, AlertTriangle,
  Plus, Truck, Activity,
  History, Zap
} from 'lucide-react'
import apiClient from '../../../services/api'
import { formatCurrency } from '../../../utils/helpers'
import { useAuthStore } from '../../../store/authStore'
import { ROLES } from '../../../utils/constants'

import Button from '../../../components/ui/Button'
import StatCard from '../components/StatCard'
import QuickAction from '../components/QuickAction'
import InventoryFlowChart from '../components/InventoryFlowChart'
import RecentItems from '../components/RecentItems'
import RecentSales from '../components/RecentSales'
import LowStockAlerts from '../components/LowStockAlerts'

const DashboardPage = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [isMounted, setIsMounted] = useState(false)

  const isAdmin = user?.role === ROLES.ADMIN

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard', user?.role],
    queryFn: async () => {
      const { data } = await apiClient.get('/reports/dashboard/summary')
      return data.data
    },
  })

  const quickActions = [
    { label: 'New Sale (POS)', icon: Zap, path: '/employee/pos', iconBg: '#f0fdf4', iconColor: '#16a34a', roles: [ROLES.ADMIN, ROLES.EMPLOYEE] },
    { label: 'Add Product', icon: Package, path: '/admin/products/add', iconBg: '#eff6ff', iconColor: '#2563eb', roles: [ROLES.ADMIN] },
    { label: 'Adjust Stock', icon: Activity, path: '/inventory/adjust', iconBg: '#faf5ff', iconColor: '#7c3aed', roles: [ROLES.ADMIN] },
    { label: 'Add Supplier', icon: Truck, path: '/admin/suppliers/add', iconBg: '#fff7ed', iconColor: '#ea580c', roles: [ROLES.ADMIN] },
  ].filter(a => a.roles.includes(user?.role))

  const statCards = [
    {
      title: 'Current Valuation',
      value: formatCurrency(dashboardData?.overview?.inventoryValue || 0),
      icon: DollarSign,
      change: '+12.5%',
      changeType: 'positive',
      iconBg: '#dcfce7',
      iconColor: '#16a34a',
      roles: [ROLES.ADMIN]
    },
    {
      title: 'Active Inventory',
      value: (dashboardData?.overview?.totalProducts || 0).toLocaleString(),
      icon: Package,
      change: 'Units',
      changeType: 'neutral',
      iconBg: '#dbeafe',
      iconColor: '#2563eb',
      roles: [ROLES.ADMIN, ROLES.EMPLOYEE]
    },
    {
      title: 'Restock Priorities',
      value: dashboardData?.overview?.lowStockProducts || 0,
      icon: AlertTriangle,
      change: 'Critical',
      changeType: 'negative',
      iconBg: '#fee2e2',
      iconColor: '#dc2626',
      roles: [ROLES.ADMIN, ROLES.EMPLOYEE]
    },
    {
      title: "Today's Updates",
      value: dashboardData?.overview?.todayAdjustments || 0,
      icon: Activity,
      change: 'Manual',
      changeType: 'neutral',
      iconBg: '#f3e8ff',
      iconColor: '#7c3aed',
      roles: [ROLES.ADMIN]
    },
  ].filter(c => c.roles.includes(user?.role))

  const movementData = dashboardData?.trends?.map(item => ({
    name: item._id?.split('-').slice(1).join('/') || item._id,
    'Stock In': Math.floor(Math.random() * 60) + 15,
    'Stock Out': item.totalSales || 0,
  })) || []

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-14 h-14 border-[3px] border-gray-200 border-t-green-600 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Zap className="w-5 h-5 text-green-600 animate-pulse" />
          </div>
        </div>
        <p className="mt-5 text-sm font-medium text-gray-500">Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="space-y-7 pb-10">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Welcome back, <span className="font-semibold text-gray-800">{user?.name}</span> — here's your inventory at a glance.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/reports')}
          >
            <History className="w-4 h-4 mr-1.5" />
            Reports
          </Button>

          {isAdmin && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/admin/products/add')}
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add Product
            </Button>
          )}
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Quick Actions */}
      {quickActions.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {quickActions.map((action) => (
              <QuickAction
                key={action.label}
                action={action}
                onClick={() => navigate(action.path)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Charts & Recent Items */}
      <div className={`grid gap-5 ${isAdmin ? 'lg:grid-cols-3' : 'grid-cols-1'}`}>
        {isAdmin && (
          <div className="lg:col-span-2">
            <InventoryFlowChart data={movementData} isMounted={isMounted} />
          </div>
        )}
        <RecentItems
          products={dashboardData?.recentActivity?.products}
          isAdmin={isAdmin}
        />
      </div>

      {/* Sales & Alerts */}
      <div className={`grid gap-5 ${isAdmin ? 'lg:grid-cols-3' : 'grid-cols-1'}`}>
        <div className={isAdmin ? 'lg:col-span-2' : ''}>
          <RecentSales sales={dashboardData?.recentActivity?.sales} />
        </div>
        <LowStockAlerts
          products={dashboardData?.overview?.lowStockProductsList}
          isAdmin={isAdmin}
        />
      </div>
    </div>
  )
}

export default DashboardPage