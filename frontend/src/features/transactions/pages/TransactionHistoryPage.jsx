import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Receipt, Eye, Calendar, DollarSign, QrCode } from 'lucide-react'
import transactionService from '../../../services/transactionService'
import Card from '../../../components/ui/Card'
import Table from '../../../components/ui/Table'
import Badge from '../../../components/ui/Badge'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Select from '../../../components/ui/Select'
import Modal from '../../../components/ui/Modal'
import { useNavigate } from 'react-router-dom'
import { formatCurrency } from '../../../utils/helpers'
import InvoicePreview from '../../sales/components/InvoicePreview'

const TransactionHistoryPage = () => {
  const navigate = useNavigate()
  const [dateRange, setDateRange] = useState('30')
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('sale') // Match option 'sale'
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Calculate date range
  const getDateRange = () => {
    const endDate = new Date()
    const startDate = new Date()
    if (dateRange !== 'all') {
      startDate.setDate(startDate.getDate() - parseInt(dateRange))
    } else {
      startDate.setFullYear(startDate.getFullYear() - 1) // Last 1 year
    }
    return { startDate: startDate.toISOString(), endDate: endDate.toISOString() }
  }

  const { data: transactionsRes, isLoading } = useQuery({
    queryKey: ['transactions', dateRange],
    queryFn: () => {
      const { startDate, endDate } = getDateRange()
      return transactionService.getByDateRange({ startDate, endDate })
    },
  })

  const { data: summaryRes } = useQuery({
    queryKey: ['transaction-summary'],
    queryFn: () => transactionService.getSummary(),
  })

  const transactions = transactionsRes?.data?.data || []
  const summary = summaryRes?.data?.data || {}

  // Filter and Sort Transactions (Latest First)
  const filteredTransactions = transactions
    .filter((txn) => {
      const matchesSearch =
        txn.invoiceNumber?.toLowerCase().includes(search.toLowerCase()) ||
        txn.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
        txn.product?.name?.toLowerCase().includes(search.toLowerCase())

      const matchesType =
        typeFilter === 'all' ||
        txn.type?.toLowerCase() === typeFilter.toLowerCase() ||
        (typeFilter === 'sale' && txn.type === 'stock_out') ||
        (typeFilter === 'purchase' && txn.type === 'stock_in')

      return matchesSearch && matchesType
    })
    .sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate))

  const columns = [
    {
      key: 'invoiceNumber',
      label: 'Invoice / Ref',
      render: (value, txn) => (
        <span className="font-mono font-medium text-green-700">{value || txn.reference || 'N/A'}</span>
      ),
    },
    {
      key: 'transactionDate',
      label: 'Date',
      render: (value) => value ? format(new Date(value), 'MMM dd, yyyy hh:mm a') : 'N/A',
    },
    {
      key: 'type',
      label: 'Type',
      render: (value) => {
        const variants = {
          stock_out: 'success',
          stock_in: 'info',
          return: 'warning',
          adjustment: 'secondary',
        }
        const labels = {
          stock_out: 'Sale',
          stock_in: 'Purchase',
          return: 'Return',
          adjustment: 'Adjustment',
        }
        return (
          <Badge variant={variants[value] || 'default'}>
            {labels[value] || value}
          </Badge>
        )
      },
    },
    {
      key: 'customer',
      label: 'Customer',
      render: (value) => value?.name || 'Walk-in Customer',
    },
    {
      key: 'total',
      label: 'Amount',
      render: (value) => (
        <span className="font-semibold text-gray-900">
          {formatCurrency(value)}
        </span>
      ),
    },
    {
      key: 'paymentStatus',
      label: 'Payment',
      render: (value) => {
        const variants = {
          paid: 'success',
          pending: 'warning',
          partial: 'info',
          cancelled: 'danger',
        }
        return <Badge variant={variants[value] || 'default'}>{value}</Badge>
      },
    },
    {
      key: '_id',
      label: 'Actions',
      render: (value, txn) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedInvoice(txn)
              setIsModalOpen(true)
            }}
          >
            <QrCode className="w-4 h-4 mr-1 text-green-600" />
            QR
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/transactions/${value}`)}
          >
            <Eye className="w-4 h-4 mr-1" />
            Full
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Receipt className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {summary.totalTransactions || 0}
            </p>
            <p className="text-sm text-gray-600">
              Total Transactions
            </p>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(summary.totalSales || 0)}
            </p>
            <p className="text-sm text-gray-600">Total Sales</p>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(summary.totalPurchases || 0)}
            </p>
            <p className="text-sm text-gray-600">
              Total Purchases
            </p>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency((summary.totalSales || 0) / 30)}
            </p>
            <p className="text-sm text-gray-600">
              Avg. Daily Sales
            </p>
          </div>
        </Card>
      </div>

      {/* Filters and Table */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Transaction History
            </h2>
            <Button variant="primary" onClick={() => navigate('/employee/pos')}>
              New Sale
            </Button>
          </div>

          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Input
              placeholder="Search by invoice or customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Types' },
                { value: 'sale', label: 'Sales' },
                { value: 'purchase', label: 'Purchases' },
              ]}
            />
            <Select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              options={[
                { value: '7', label: 'Last 7 Days' },
                { value: '30', label: 'Last 30 Days' },
                { value: '90', label: 'Last 90 Days' },
                { value: 'all', label: 'Last Year' },
              ]}
            />
          </div>

          {/* Table */}
          <Table
            columns={columns}
            data={filteredTransactions}
            isLoading={isLoading}
            emptyMessage="No transactions found"
          />
        </div>
      </Card>
      {/* QR & Invoice Modal */}
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
            Print Invoice
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default TransactionHistoryPage
