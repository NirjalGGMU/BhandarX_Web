import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Building2,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  User,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  ExternalLink
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../../store/authStore'
import supplierService from '../../../services/supplierService'
import Card from '../../../components/ui/Card'
import Table from '../../../components/ui/Table'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Select from '../../../components/ui/Select'
import Badge from '../../../components/ui/Badge'
import toast from 'react-hot-toast'
import { ROLES } from '../../../utils/constants'

const SupplierListPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuthStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)

  const isAdmin = user?.role === ROLES.ADMIN
  const isEmployee = user?.role === ROLES.EMPLOYEE
  const canEdit = isAdmin
  const canDelete = isAdmin

  // Fetch Suppliers
  const { data: suppliersRes, isLoading } = useQuery({
    queryKey: ['suppliers', { searchTerm, statusFilter, page }],
    queryFn: () => supplierService.getAllSuppliers({
      search: searchTerm,
      status: statusFilter === 'all' ? undefined : statusFilter,
      page,
      limit: 10
    }),
  })

  // Delete Mutation
  const deleteSupplierMutation = useMutation({
    mutationFn: (id) => supplierService.deleteSupplier(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['suppliers'])
      toast.success('Supplier deleted successfully')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete supplier')
    }
  })

  const suppliers = suppliersRes?.data?.data || []
  const pagination = suppliersRes?.data?.pagination || {}

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this supplier? All associated data will be affected.')) {
      deleteSupplierMutation.mutate(id)
    }
  }

  const columns = [
    {
      key: 'name',
      label: 'Supplier Details',
      render: (value, supplier) => (
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center text-green-600">
            <Building2 className="w-[20px] h-[20px]" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-semibold text-gray-900">{supplier.name}</p>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
              <User className="w-3 h-3 text-green-600" />
              <span>{supplier.contactPerson || 'No contact person'}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'contact',
      label: 'Contact Info',
      render: (_, supplier) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Mail className="w-3.5 h-3.5 text-gray-400" />
            <span className="truncate max-w-[150px]">{supplier.email}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Phone className="w-3.5 h-3.5 text-gray-400" />
            <span>{supplier.phone}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'address',
      label: 'Location',
      render: (value) => (
        <div className="flex items-start gap-1.5 max-w-[200px]">
          <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
          <span className="text-xs text-gray-600 line-clamp-2">
            {value || 'No address provided'}
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <Badge variant={value === 'active' ? 'success' : 'danger'}>
          <div className="flex items-center gap-1 font-bold">
            {value === 'active' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
            {value.toUpperCase()}
          </div>
        </Badge>
      ),
    },
    {
      key: '_id',
      label: 'Actions',
      render: (id) => (
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/suppliers/${id}`)} title="View Detail">
            <ExternalLink className="w-[18px] h-[18px] text-green-600" />
          </Button>
          {canEdit && (
            <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/suppliers/${id}/edit`)} title="Edit Supplier">
              <Edit2 className="w-[18px] h-[18px] text-green-600" />
            </Button>
          )}
          {canDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(id)}
              className="text-rose-500 hover:bg-rose-50"
              title="Delete Supplier"
            >
              <Trash2 className="w-[18px] h-[18px]" />
            </Button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Suppliers
          </h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <Building2 className="w-[18px] h-[18px] text-green-600" />
            Manage your suppliers and procurement sources
          </p>
        </div>
        {canEdit && (
          <Button
            variant="primary"
            onClick={() => navigate('/admin/suppliers/add')}
            size="sm"
          >
            <Plus className="w-[18px] h-[18px]" />
            Add Supplier
          </Button>
        )}
      </div>

      {/* Analytics/Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="border-l-4 border-l-green-600" hover={false}>
          <div className="p-4 flex flex-col justify-center">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Suppliers</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">
              {pagination.totalDocs || 0}
            </h3>
          </div>
        </Card>
        <Card className="border-l-4 border-l-green-600" hover={false}>
          <div className="p-4 flex flex-col justify-center">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Active Partners</p>
            <h3 className="text-2xl font-bold text-green-700 mt-1">
              {suppliers.filter(s => s.status === 'active').length}
            </h3>
          </div>
        </Card>
      </div>

      {/* Filter Controls Card */}
      <Card hover={false}>
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <Input
            label="Search Directory"
            placeholder="Name, Email or Phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={Search}
            containerClassName="md:col-span-2"
          />
          <Select
            label="Supplier Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
            ]}
          />
        </div>
      </Card>

      {/* Main Content Table */}
      <Card className="overflow-hidden" hover={false}>
        <Table
          columns={columns}
          data={suppliers}
          isLoading={isLoading}
          emptyMessage="No suppliers found in your directory"
          className="bg-white"
        />

        {/* Pagination Controls */}
        {!isLoading && pagination.totalDocs > 0 && (
          <div className="p-6 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500 font-medium">
              Showing <span className="text-gray-900">{(page - 1) * 10 + 1}</span> to <span className="text-gray-900">{Math.min(page * 10, pagination.totalDocs)}</span> of <span className="text-gray-900">{pagination.totalDocs}</span> vendors
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={!pagination.hasPrevPage}
                className="font-bold uppercase tracking-tighter"
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
    </div>
  )
}

export default SupplierListPage
