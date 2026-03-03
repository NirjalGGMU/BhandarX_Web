import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Package, AlertTriangle, TrendingUp, DollarSign, Plus,
  Search, FileDown, FileUp, Eye, Edit2, Trash2,
  History, ArrowUpDown, CheckCircle2,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../../../services/api'
import inventoryService from '../../../services/inventoryService'
import productService from '../../../services/productService'
import Card from '../../../components/ui/Card'
import Table from '../../../components/ui/Table'
import Button from '../../../components/ui/Button'
import Select from '../../../components/ui/Select'
import StockStatusBadge from '../components/StockStatusBadge'
import { useAuthStore } from '../../../store/authStore'
import { ROLES } from '../../../utils/constants'
import { formatCurrency, getProductImageUrl } from '../../../utils/helpers'
import toast from 'react-hot-toast'

const InventoryPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuthStore()

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)

  const isAdmin = user?.role === ROLES.ADMIN
  const canEdit = isAdmin
  const canDelete = isAdmin
  const canAdjust = isAdmin
  const canImport = isAdmin
  const canExport = isAdmin

  const { data: valuationRes } = useQuery({
    queryKey: ['stockValuation'],
    queryFn: () => inventoryService.getStockValuation(),
  })

  const { data: productsRes, isLoading } = useQuery({
    queryKey: ['inventory-products', { searchTerm, statusFilter, page }],
    queryFn: () => productService.getAllProducts({
      search: searchTerm,
      status: statusFilter === 'all' ? undefined : statusFilter,
      page,
      limit: 10,
    }),
  })

  const { data: recentActivityRes, isLoading: isActivityLoading } = useQuery({
    queryKey: ['recent-transactions'],
    queryFn: () => apiClient.get('/transactions/recent?limit=5'),
  })

  const recentActivity = (recentActivityRes?.data?.data || [])
    .sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate))

  const products = productsRes?.data?.data || []
  const pagination = productsRes?.data?.pagination || {}
  const stats = valuationRes?.data?.summary || {}

  const lowStock = products.filter(p => p.quantity <= p.minStockLevel && p.quantity > 0).length
  const outOfStock = products.filter(p => p.quantity <= 0).length
  const totalUnits = stats.totalQuantity || 0

  const handleDelete = async (id) => {
    if (window.confirm('Delete this product? This action cannot be undone.')) {
      try {
        await productService.deleteProduct(id)
        toast.success('Product removed from inventory')
        queryClient.invalidateQueries(['inventory-products'])
      } catch {
        toast.error('Failed to delete — please try again')
      }
    }
  }

  const handleExport = () => {
    toast.success('Preparing inventory export...')
  }

  const columns = [
    {
      key: 'name',
      label: 'Product',
      render: (value, product) => (
        <div className="flex items-center gap-3">
          <div className="product-thumb">
            {product.images?.[0]
              ? <img src={getProductImageUrl(product.images[0])} alt={value} className="w-full h-full object-cover" />
              : <Package size={16} className="text-green-600" />
            }
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{value}</p>
            <p className="text-[11px] text-gray-400 font-mono">SKU: {product.sku}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      render: (value) => (
        <span className="text-sm text-gray-600">
          {typeof value === 'object' ? value?.name : value || 'Uncategorized'}
        </span>
      ),
    },
    {
      key: 'quantity',
      label: 'Stock',
      render: (value, product) => {
        const isLow = value <= product.minStockLevel && value > 0
        const isOut = value <= 0
        const pct = Math.min((value / Math.max(product.minStockLevel * 2, 1)) * 100, 100)

        return (
          <div className="w-30">
            <div className="flex items-baseline gap-1 mb-1.5">
              <span className={`text-sm font-semibold tabular-nums ${isOut ? 'text-red-600' : isLow ? 'text-amber-600' : 'text-gray-900'
                }`}>
                {value}
              </span>
              <span className="text-[10px] text-gray-400">{product.unit || 'units'}</span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${isOut ? 'bg-red-500' : isLow ? 'bg-amber-400' : 'bg-green-600'
                  }`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )
      },
    },
    {
      key: 'sellingPrice',
      label: 'Price',
      render: (value) => (
        <span className="text-sm font-medium text-gray-900 tabular-nums">
          {formatCurrency(value)}
        </span>
      ),
      roles: [ROLES.ADMIN],
    },
    {
      key: 'status',
      label: 'Status',
      render: (_, product) => (
        <StockStatusBadge stock={product.quantity} reorderLevel={product.minStockLevel} />
      ),
    },
    {
      key: '_id',
      label: '',
      render: (id) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => navigate(`/inventory/ledger/${id}`)}
            className="p-1.5 rounded-md text-gray-400 hover:text-green-700 hover:bg-green-50 transition-colors"
            title="Stock Ledger"
          >
            <History size={16} />
          </button>
          <button
            onClick={() => navigate(`/products/${id}`)}
            className="p-1.5 rounded-md text-gray-400 hover:text-green-700 hover:bg-green-50 transition-colors"
            title="View"
          >
            <Eye size={16} />
          </button>
          {canEdit && (
            <button
              onClick={() => navigate(`/products/${id}/edit`)}
              className="p-1.5 rounded-md text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
              title="Edit"
            >
              <Edit2 size={16} />
            </button>
          )}
          {canDelete && (
            <button
              onClick={() => handleDelete(id)}
              className="p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      ),
    },
  ].filter(col => !col.roles || col.roles.includes(user?.role))

  const inventoryStats = [
    isAdmin && {
      label: 'Total Valuation',
      value: formatCurrency(stats.totalStockValue),
      icon: DollarSign,
      iconBg: '#ecfdf5', iconColor: '#059669',
    },
    {
      label: 'Total Units',
      value: totalUnits.toLocaleString(),
      icon: Package,
      iconBg: '#F0FDF4', iconColor: '#16A34A',
    },
    {
      label: 'Low Stock',
      value: lowStock,
      icon: AlertTriangle,
      iconBg: '#f3f4f6', iconColor: '#6b7280',
    },
    {
      label: 'Out of Stock',
      value: outOfStock,
      icon: TrendingUp,
      iconBg: '#fef2f2', iconColor: '#dc2626',
    },
  ].filter(Boolean)

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitor stock levels and track inventory movements
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {canImport && (
            <Button variant="outline" size="sm" onClick={() => navigate('/inventory/import')}>
              <FileUp className="w-4 h-4" />
              Import
            </Button>
          )}
          {canExport && (
            <Button variant="outline" size="sm" onClick={handleExport}>
              <FileDown className="w-4 h-4" />
              Export
            </Button>
          )}
          {canAdjust && (
            <Button variant="primary" size="sm" onClick={() => navigate('/inventory/adjust')}>
              <ArrowUpDown className="w-4 h-4" />
              Adjust Stock
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {inventoryStats.map((s) => (
          <Card key={s.label} className="p-4" hover={false}>
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center rounded-lg shrink-0"
                style={{ width: 40, height: 40, background: s.iconBg }}
              >
                <s.icon size={18} style={{ color: s.iconColor }} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{s.label}</p>
                <h3 className="text-xl font-bold text-gray-900">{s.value}</h3>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Search & Filter */}
      <Card className="p-3" hover={false}>
        <div className="flex flex-col md:flex-row items-stretch gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products, SKU, category..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-[#F8F9FA] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600 transition-all placeholder:text-gray-400"
            />
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
              ]}
              className="min-w-37.5 h-10 bg-gray-50"
            />
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden" hover={false}>
        <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100">
          <div>
            <h3 className="text-base font-semibold text-gray-900">Products</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Showing {products.length} of {pagination.totalDocs || 0} items
            </p>
          </div>
          {isAdmin && (
            <Button variant="primary" size="sm" onClick={() => navigate('/admin/products/add')}>
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          )}
        </div>

        <Table
          columns={columns}
          data={products}
          loading={isLoading}
          emptyMessage="No products found in inventory."
        />

        {/* Pagination */}
        {!isLoading && pagination.totalDocs > 0 && (
          <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Page {pagination.page} of {pagination.totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={!pagination.hasPrevPage}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={!pagination.hasNextPage}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Low Stock Alerts */}
        <Card className="p-5" hover={false}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
                <AlertTriangle size={18} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">Low Stock Alerts</h3>
                <p className="text-xs text-gray-400">Items needing attention</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/inventory/alerts')}
              className="text-xs font-medium text-green-700 hover:underline cursor-pointer"
            >
              View all
            </button>
          </div>

          <div className="space-y-2">
            {products.filter(p => p.quantity <= p.minStockLevel).slice(0, 4).map((product) => {
              const isOut = product.quantity <= 0
              return (
                <div
                  key={product._id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${isOut ? 'bg-red-50/50 border-red-100' : 'bg-gray-50/50 border-gray-200'}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="product-thumb shrink-0">
                      {product.images?.[0] ? <img src={getProductImageUrl(product.images[0])} className="w-full h-full object-cover" /> : <Package size={14} className="text-gray-300" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
                      <p className="text-[11px] text-gray-400">Reorder needed</p>
                    </div>
                  </div>
                  <div className="text-right ml-3">
                    <p className={`text-base font-bold ${isOut ? 'text-red-600' : 'text-gray-600'}`}>{product.quantity}</p>
                    <p className="text-[10px] text-gray-400">in stock</p>
                  </div>
                </div>
              )
            })}

            {products.filter(p => p.quantity <= p.minStockLevel).length === 0 && (
              <div className="py-10 text-center">
                <CheckCircle2 size={32} className="text-emerald-300 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-500">All stock levels healthy</p>
                <p className="text-xs text-gray-400 mt-1">No critical alerts at this time.</p>
              </div>
            )}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-5" hover={false}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-green-50 border border-green-100 flex items-center justify-center text-green-600">
                <History size={18} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">Recent Activity</h3>
                <p className="text-xs text-gray-400">Latest stock movements</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/transactions')}>
              View all
            </Button>
          </div>

          <div className="space-y-3">
            {isActivityLoading ? (
              <div className="py-10 text-center">
                <p className="text-sm text-gray-400">Loading recent activity...</p>
              </div>
            ) : (
              <>
                {recentActivity.map((txn) => {
                  const isPositive = ['stock_in', 'return'].includes(txn.type)
                  const label = txn.type === 'stock_in' ? 'Stock In' :
                    txn.type === 'stock_out' ? 'Sale / Out' :
                      txn.type === 'return' ? 'Return' : 'Adjustment'

                  return (
                    <div key={txn._id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${isPositive ? 'bg-emerald-500' :
                        txn.type === 'stock_out' ? 'bg-red-500' : 'bg-gray-400'
                        }`} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium text-gray-800">{label}</p>
                          <span className={`text-xs font-medium ${isPositive ? 'text-emerald-600' :
                            txn.type === 'stock_out' ? 'text-red-600' : 'text-gray-500'
                            }`}>
                            {isPositive ? '+' : '-'}{txn.quantity}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-gray-500 truncate">{txn.product?.name || 'Unknown Product'}</span>
                          <span className="text-[10px] text-gray-300">·</span>
                          <span className="text-[11px] text-gray-400">
                            {new Date(txn.transactionDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {recentActivity.length === 0 && (
                  <div className="py-10 text-center">
                    <p className="text-sm text-gray-400">No recent activity</p>
                  </div>
                )}
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default InventoryPage
