import { format } from 'date-fns'
import { Eye, QrCode } from 'lucide-react'
import Table from '../../../components/ui/Table'
import Badge from '../../../components/ui/Badge'
import Button from '../../../components/ui/Button'
import { formatCurrency } from '../../../utils/helpers'

const PurchaseHistoryTable = ({ purchases, isLoading, onViewInvoice }) => {
  const columns = [
    {
      key: 'invoiceNumber',
      label: 'Invoice #',
      render: (value) => (
        <span className="font-mono font-medium text-green-700">{value}</span>
      ),
    },
    {
      key: 'date',
      label: 'Date',
      render: (value) => value ? format(new Date(value), 'MMM dd, yyyy') : '---',
    },
    {
      key: 'items',
      label: 'Items',
      render: (value) => value?.length || 0,
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
          PAID: 'success',
          PENDING: 'warning',
          PARTIAL: 'info',
          CANCELLED: 'danger',
        }
        return <Badge variant={variants[value] || 'default'}>{value}</Badge>
      },
    },
    {
      key: '_id',
      label: 'Actions',
      render: (id, row) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewInvoice && onViewInvoice(row)}
            className="h-8 py-0 px-2 text-[10px]"
          >
            <QrCode className="w-3.5 h-3.5 mr-1 text-green-600" />
            QR
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewInvoice && onViewInvoice(row)}
            className="h-8 py-0 px-2 text-[10px]"
          >
            <Eye className="w-3.5 h-3.5 mr-1 text-green-600" />
            VIEW
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="mt-4">
      <Table
        columns={columns}
        data={purchases}
        loading={isLoading}
        emptyMessage="No purchase history available"
      />
    </div>
  )
}

export default PurchaseHistoryTable
