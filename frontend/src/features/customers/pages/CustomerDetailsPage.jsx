import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit, Trash2, Mail, Phone, MapPin, Calendar, DollarSign, ShoppingBag, Eye, QrCode } from 'lucide-react'
import { format } from 'date-fns'
import apiClient from '../../../services/api'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import Modal from '../../../components/ui/Modal'
import { formatCurrency } from '../../../utils/helpers'
import PurchaseHistoryTable from '../components/PurchaseHistoryTable'
import InvoicePreview from '../../sales/components/InvoicePreview'

const CustomerDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data: customerRes, isLoading } = useQuery({
    queryKey: ['customer', id],
    queryFn: () => apiClient.get(`/customers/${id}`),
  })

  const { data: purchasesRes, isLoading: purchasesLoading } = useQuery({
    queryKey: ['customer-purchases', id],
    queryFn: () => apiClient.get(`/sales/customer/${id}`),
  })

  const customer = customerRes?.data?.data
  const purchases = purchasesRes?.data?.data || []

  const deleteCustomerMutation = useMutation({
    mutationFn: () => apiClient.delete(`/customers/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['customers'])
      navigate('/customers')
    },
  })

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      deleteCustomerMutation.mutate()
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading customer details...</div>
      </div>
    )
  }

  if (!customer) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-600">Customer not found</p>
        <Button variant="primary" onClick={() => navigate('/customers')} className="mt-4">
          Back to Customers
        </Button>
      </Card>
    )
  }

  const totalPurchases = purchases.reduce((sum, p) => sum + (p.total || 0), 0)

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Details</h1>
          <p className="text-sm text-gray-500 mt-1">View and manage customer information</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/customers')}>
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/customers/${id}/edit`)}
          >
            <Edit className="w-4 h-4" />
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleDelete}
            loading={deleteCustomerMutation.isPending}
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Customer Info */}
      <Card className="p-6" hover={false}>
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shrink-0 shadow-lg">
            {customer.name.charAt(0).toUpperCase()}
          </div>

          {/* Details */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {customer.name}
                </h2>
                <p className="text-sm text-gray-500 font-mono">
                  ID: {customer.customerId || customer._id.slice(-8)}
                </p>
              </div>
              <Badge variant={customer.isActive ? 'success' : 'danger'}>
                {customer.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {customer.email && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm text-gray-700">{customer.email}</span>
                </div>
              )}
              {customer.phone && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                    <Phone className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm text-gray-700">{customer.phone}</span>
                </div>
              )}
              {customer.address && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm text-gray-700">{customer.address}</span>
                </div>
              )}
              {customer.createdAt && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm text-gray-700">
                    Member since {format(new Date(customer.createdAt), 'MMM dd, yyyy')}
                  </span>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4 bg-[#F8F9FA]" hover={false}>
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Total Purchases
                  </span>
                </div>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(totalPurchases)}
                </p>
              </Card>

              <Card className="p-4 bg-[#F8F9FA]" hover={false}>
                <div className="flex items-center gap-2 mb-2">
                  <ShoppingBag className="w-4 h-4 text-green-600" />
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Total Orders
                  </span>
                </div>
                <p className="text-xl font-bold text-gray-900">
                  {purchases.length}
                </p>
              </Card>

              <Card className="p-4 bg-[#F8F9FA]" hover={false}>
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Avg. Order Value
                  </span>
                </div>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(purchases.length > 0 ? (totalPurchases / purchases.length) : 0)}
                </p>
              </Card>
            </div>
          </div>
        </div>
      </Card>

      {/* Purchase History */}
      <Card className="overflow-hidden" hover={false}>
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Purchase History</h2>
          <p className="text-xs text-gray-400 mt-0.5">Complete order history for this customer</p>
        </div>
        <div className="p-6">
          <PurchaseHistoryTable
            purchases={purchases}
            isLoading={purchasesLoading}
            onViewInvoice={(invoice) => {
              setSelectedInvoice(invoice)
              setIsModalOpen(true)
            }}
          />
        </div>
      </Card>

      {/* Invoice Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Invoice ${selectedInvoice?.invoiceNumber}`}
        size="lg"
      >
        <div className="max-h-[70vh] overflow-y-auto">
          <InvoicePreview invoice={selectedInvoice} />
        </div>
        <div className="mt-6 flex justify-end gap-3 print:hidden">
          <Button variant="outline" onClick={() => setIsModalOpen(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => window.print()}>
            Print Receipt
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default CustomerDetailsPage
