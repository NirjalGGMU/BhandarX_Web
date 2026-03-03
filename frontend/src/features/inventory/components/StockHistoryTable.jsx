import { format } from 'date-fns'
import Table from '../../../components/ui/Table'
import Badge from '../../../components/ui/Badge'

const StockHistoryTable = ({ history = [], loading = false }) => {
  const columns = [
    {
      key: 'date',
      label: 'Date',
      render: (row) => format(new Date(row.createdAt), 'MMM dd, yyyy HH:mm'),
    },
    {
      key: 'type',
      label: 'Type',
      render: (row) => {
        const variants = {
          'stock-in': 'success',
          'stock-out': 'danger',
          'adjustment': 'warning',
          'sale': 'primary',
          'purchase': 'info',
        }
        return (
          <Badge variant={variants[row.type] || 'default'}>
            {row.type.replace('-', ' ').toUpperCase()}
          </Badge>
        )
      },
    },
    {
      key: 'quantity',
      label: 'Quantity',
      render: (row) => (
        <span className={row.quantity >= 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
          {row.quantity >= 0 ? '+' : ''}{row.quantity}
        </span>
      ),
    },
    {
      key: 'balance',
      label: 'Balance',
      render: (row) => row.balanceAfter || row.balance || 'N/A',
    },
    {
      key: 'reference',
      label: 'Reference',
      render: (row) => row.reference || '-',
    },
    {
      key: 'user',
      label: 'User',
      render: (row) => row.user?.name || row.user || '-',
    },
    {
      key: 'notes',
      label: 'Notes',
      render: (row) => (
        <span className="text-sm text-gray-600">
          {row.notes || row.description || '-'}
        </span>
      ),
    },
  ]

  return <Table columns={columns} data={history} loading={loading} />
}

export default StockHistoryTable
