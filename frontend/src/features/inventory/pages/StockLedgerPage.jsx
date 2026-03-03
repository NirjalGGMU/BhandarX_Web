import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Package,
  ArrowLeft,
  Calendar,
  TrendingUp,
  Filter,
  FileText,
  Download,
  History,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from 'lucide-react'
import inventoryService from '../../../services/inventoryService'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Select from '../../../components/ui/Select'
import Badge from '../../../components/ui/Badge'
import Table from '../../../components/ui/Table'
import { format } from 'date-fns'

const StockLedgerPage = () => {
  const { productId } = useParams()
  const navigate = useNavigate()
  const [dateRange, setDateRange] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  const { data: ledgerRes, isLoading } = useQuery({
    queryKey: ['stockLedger', productId, dateRange, typeFilter],
    queryFn: () => inventoryService.getStockLedger(productId, { dateRange, type: typeFilter }),
    enabled: !!productId,
  })

  // If no productId, we might want a global summary, but let's stick to product-specific for now as per params
  const product = ledgerRes?.data?.product
  const movements = (ledgerRes?.data?.ledger || []).sort((a, b) => new Date(b.date) - new Date(a.date))
  const summary = ledgerRes?.data?.summary || {}

  const columns = [
    {
      key: 'date',
      label: 'Timestamp',
      render: (val) => (
        <div className="flex flex-col">
          <span className="text-xs font-medium text-gray-900">
            {format(new Date(val), 'MMM dd, yyyy')}
          </span>
          <span className="text-[10px] text-gray-400">
            {format(new Date(val), 'hh a')}
          </span>
        </div>
      )
    },
    {
      key: 'type',
      label: 'Operation',
      render: (val, row) => (
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${val === 'STOCK_IN' || val === 'RETURN' ? 'bg-green-50 text-green-700' :
            val === 'STOCK_OUT' ? 'bg-rose-50 text-rose-600' : 'bg-green-50 text-green-700'
            }`}>
            {val === 'STOCK_IN' || val === 'RETURN' ? <ArrowUpRight className="w-3.5 h-3.5" /> :
              val === 'STOCK_OUT' ? <ArrowDownRight className="w-3.5 h-3.5" /> : <Activity className="w-3.5 h-3.5" />}
          </div>
          <span className="text-xs font-medium">{val.replace('_', ' ')}</span>
        </div>
      )
    },
    {
      key: 'movement',
      label: 'Delta',
      render: (val) => (
        <span className={`text-sm font-semibold ${val.includes('+') ? 'text-emerald-600' : 'text-rose-600'}`}>
          {val}
        </span>
      )
    },
    {
      key: 'newBalance',
      label: 'Final Balance',
      render: (val) => (
        <span className="text-sm font-medium text-gray-900">{val}</span>
      )
    },
    {
      key: 'reference',
      label: 'Reference',
      render: (val) => (
        <span className="text-xs font-mono text-gray-400">{val || 'N/A'}</span>
      )
    },
    {
      key: 'notes',
      label: 'Audit Notes',
      render: (val) => (
        <p className="text-xs text-gray-500 font-medium truncate max-w-[200px]">{val || '-'}</p>
      )
    }
  ]

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/inventory')} className="group p-0 hover:bg-transparent">
            <ArrowLeft className="w-5 h-5 group-hover transition-transform" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Stock Ledger
            </h1>
            <p className="text-gray-500 text-xs mt-1 flex items-center gap-2">
              <History className="w-3.5 h-3.5 text-green-600" />
              Sequential Transaction Log
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export log
          </Button>
        </div>
      </div>

      {/* Product Profile Strip */}
      <Card hover={false} className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center">
              <Package className="w-7 h-7 text-green-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-gray-900">{product?.name || 'Product'}</h2>
                <Badge variant="primary" size="sm">SKU: {product?.sku || '—'}</Badge>
              </div>
              <div className="grid grid-cols-3 gap-6 mt-4">
                <div>
                  <p className="text-[11px] font-semibold text-gray-500">Available Stock</p>
                  <p className="text-xl font-bold text-gray-900 mt-1">{product?.currentStock || 0}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-gray-500">Safety Stock</p>
                  <p className="text-xl font-bold text-gray-600 mt-1">{summary.minStockLevel || 0}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-gray-500">Audit Points</p>
                  <p className="text-xl font-bold text-green-700 mt-1">{movements.length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={() => navigate(`/products/${productId}/edit`)}>
              Modify SKU
            </Button>
          </div>
        </div>
      </Card>

      {/* Filter Hub */}
      <Card hover={false}>
        <div className="p-4 flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-green-600" />
            <input
              type="text"
              placeholder="Internal Audit Search..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-[#F8F9FA] outline-none text-sm font-medium placeholder:text-gray-400 focus:ring-2 focus:ring-green-600/20 focus:border-green-600"
            />
          </div>
          <div className="flex gap-4">
            <Select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              options={[
                { value: 'all', label: 'All Historic Data' },
                { value: 'today', label: 'Last 24 Hours' },
                { value: 'week', label: 'Rolling 7 Days' },
                { value: 'month', label: 'Last 30 Days' },
              ]}
              className="min-w-[180px]"
            />
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Operations' },
                { value: 'STOCK_IN', label: 'Stock Inflow' },
                { value: 'STOCK_OUT', label: 'Stock Outflow' },
                { value: 'ADJUSTMENT', label: 'Audits Only' },
              ]}
              className="min-w-[180px]"
            />
          </div>
        </div>
      </Card>

      {/* Ledger Table */}
      <Card className="overflow-hidden" hover={false}>
        <Table
          columns={columns}
          data={movements}
          isLoading={isLoading}
          emptyMessage="No ledger entries found for the selected filters."
        />
      </Card>
    </div>
  )
}

export default StockLedgerPage
