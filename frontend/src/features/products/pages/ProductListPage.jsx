import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Package, Plus, Search, Edit2, Trash2, Eye,
  AlertCircle, XCircle, Filter
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../../store/authStore'
import productService from '../../../services/productService'
import categoryService from '../../../services/categoryService'
import Card from '../../../components/ui/Card'
import Table from '../../../components/ui/Table'
import Button from '../../../components/ui/Button'
import Select from '../../../components/ui/Select'
import StatCard from '../../../components/ui/StatCard'
import toast from 'react-hot-toast'
import { ROLES } from '../../../utils/constants'
import { formatCurrency, getProductImageUrl } from '../../../utils/helpers'

const ProductListPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuthStore()

  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)

  const isAdmin = user?.role === ROLES.ADMIN
  const canEdit = isAdmin
  const canDelete = isAdmin

  const { data: categoriesRes } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getAllCategories({ limit: 100 }),
  })

  const { data: productsRes, isLoading } = useQuery({
    queryKey: ['products', { searchTerm, categoryFilter, statusFilter, page }],
    queryFn: () => productService.getAllProducts({
      search: searchTerm,
      category: categoryFilter === 'all' ? undefined : categoryFilter,
      status: statusFilter === 'all' ? undefined : statusFilter,
      page,
      limit: 10,
    }),
  })

  const deleteProductMutation = useMutation({
    mutationFn: (id) => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['products'])
      toast.success('Product deleted.')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete product')
    },
  })

  const products = productsRes?.data?.data || []
  const pagination = productsRes?.data?.pagination || {}
  const categories = categoriesRes?.data?.data || []

  const handleDelete = (id) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-semibold text-gray-900">Delete this product?</p>
        <p className="text-xs text-gray-400">This action cannot be undone.</p>
        <div className="flex gap-2">
          <Button variant="danger" size="xs" onClick={() => { deleteProductMutation.mutate(id); toast.dismiss(t.id) }}>Delete</Button>
          <Button variant="outline" size="xs" onClick={() => toast.dismiss(t.id)}>Cancel</Button>
        </div>
      </div>
    ), { duration: 5000, position: 'bottom-right' })
  }

  /* ── Quick Stats ── */
  const totalItems = pagination.totalDocs || 0
  const lowStockCount = products.filter(p => p.quantity <= p.minStockLevel && p.quantity > 0).length
  const outOfStockCount = products.filter(p => p.quantity <= 0).length

  const columns = [
    {
      key: 'name',
      label: 'Product',
      render: (value, product) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
            {product.images?.[0]
              ? <img src={getProductImageUrl(product.images[0])} alt={value} className="w-full h-full object-cover" />
              : <Package size={18} className="text-green-600/60" />
            }
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">{value}</p>
            <p className="text-xs text-gray-400 mt-0.5">SKU: {product.sku}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      render: (value) => (
        <span className="text-sm text-gray-600">{value?.name || 'Uncategorized'}</span>
      ),
    },
    {
      key: 'price',
      label: 'Price',
      render: (value, product) => (
        <span className="text-sm font-semibold text-gray-900">
          {formatCurrency(value || product.sellingPrice)}
        </span>
      ),
      roles: [ROLES.ADMIN, ROLES.EMPLOYEE],
    },
    {
      key: 'quantity',
      label: 'Stock',
      render: (value, product) => {
        const isLow = value <= product.minStockLevel && value > 0
        const isOut = value <= 0
        const pct = Math.min((value / Math.max(product.minStockLevel * 2, 1)) * 100, 100)

        return (
          <div className="min-w-[90px]">
            <div className="flex items-baseline gap-1 mb-1">
              <span className={`text-sm font-semibold ${isOut ? 'text-red-600' : isLow ? 'text-amber-600' : 'text-green-600'}`}>
                {value}
              </span>
              <span className="text-xs text-gray-400">units</span>
            </div>
            <div className="h-1.5 w-16 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${isOut ? 'bg-red-500' : isLow ? 'bg-amber-400' : 'bg-green-500'}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )
      },
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${value === 'active'
          ? 'bg-green-50 text-green-700'
          : 'bg-gray-100 text-gray-500'
          }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${value === 'active' ? 'bg-green-500' : 'bg-gray-400'}`} />
          {value === 'active' ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: '_id',
      label: 'Actions',
      render: (id) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => navigate(`/products/${id}`)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors cursor-pointer"
          >
            <Eye size={16} />
          </button>
          {canEdit && (
            <button
              onClick={() => navigate(`/products/${id}/edit`)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
            >
              <Edit2 size={16} />
            </button>
          )}
          {canDelete && (
            <button
              onClick={() => handleDelete(id)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      ),
    },
  ].filter(col => !col.roles || col.roles.includes(user?.role))

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage your product inventory</p>
        </div>
        {canEdit && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(isAdmin ? '/admin/products/add' : '/employee/products')}
          >
            <Plus size={16} className="mr-1.5" />
            Add Product
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Products"
          value={totalItems}
          icon={Package}
          iconBg="#F0FDF4"
          iconColor="#16A34A"
          change="+2.4%"
        />
        <StatCard
          title="Low Stock"
          value={lowStockCount}
          icon={AlertCircle}
          iconBg="#FFF7ED"
          iconColor="#F97316"
          changeType="negative"
          change="Action needed"
        />
        <StatCard
          title="Out of Stock"
          value={outOfStockCount}
          icon={XCircle}
          iconBg="#FEF2F2"
          iconColor="#EF4444"
          changeType="negative"
          change="Restock required"
        />
      </div>

      {/* Filters */}
      <Card hover={false} className="p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or SKU..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-9 pr-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-sm transition-all"
            />
          </div>
          <div className="flex gap-3">
            <Select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Categories' },
                ...categories.map(cat => ({ value: cat._id, label: cat.name })),
              ]}
              className="h-10"
            />
            <Select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
              ]}
              className="h-10"
            />
          </div>
        </div>
      </Card>

      {/* Table */}
      <Table
        columns={columns}
        data={products}
        isLoading={isLoading}
        emptyMessage="No products found"
        onRowClick={(row) => navigate(`/products/${row._id}`)}
      />

      {/* Pagination */}
      {!isLoading && pagination.totalDocs > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl border border-gray-100 bg-white gap-3">
          <p className="text-sm text-gray-500">
            Showing <span className="font-medium text-gray-900">{(page - 1) * 10 + 1}–{Math.min(page * 10, pagination.totalDocs)}</span> of <span className="font-medium text-gray-900">{pagination.totalDocs}</span> products
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => { e.stopPropagation(); setPage(p => Math.max(1, p - 1)) }}
              disabled={!pagination.hasPrevPage}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(pagination.totalPages, 5) }).map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setPage(i + 1) }}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${page === i + 1 ? 'bg-green-600 text-white' : 'text-gray-500 hover:bg-gray-100'
                    }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => { e.stopPropagation(); setPage(p => Math.min(pagination.totalPages, p + 1)) }}
              disabled={!pagination.hasNextPage}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductListPage
