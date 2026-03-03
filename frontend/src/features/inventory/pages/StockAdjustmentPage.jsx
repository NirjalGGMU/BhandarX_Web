import { useState, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowUpDown,
  Search,
  Package,
  CheckCircle2,
  AlertCircle,
  Activity,
  MessageSquare,
  ChevronRight
} from 'lucide-react'
import inventoryService from '../../../services/inventoryService'
import productService from '../../../services/productService'
import transactionService from '../../../services/transactionService'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Select from '../../../components/ui/Select'
import Badge from '../../../components/ui/Badge'
import { useAuthStore } from '../../../store/authStore'
import toast from 'react-hot-toast'

const StockAdjustmentPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuthStore()
  const [search, setSearch] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [formData, setFormData] = useState({
    quantity: '',
    reason: 'Correction',
    notes: '',
  })

  // Search products
  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['product-search', search],
    queryFn: () => productService.searchProducts(search),
    enabled: search.length > 2
  })

  // Fetch recent transactions for selected product
  const { data: productTxnsRes, isLoading: isLoadingTxns } = useQuery({
    queryKey: ['product-transactions', selectedProduct?._id],
    queryFn: () => transactionService.getProductTransactions(selectedProduct._id, { limit: 5 }),
    enabled: !!selectedProduct?._id
  })

  const recentTxns = (productTxnsRes?.data?.data || [])
    .sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate))

  const adjustMutation = useMutation({
    mutationFn: (data) => inventoryService.adjustStock(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['inventory-products'])
      queryClient.invalidateQueries(['stockValuation'])
      toast.success('Inventory adjustment recorded successfully')
      navigate('/inventory')
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Adjustment failed')
    }
  })

  const [showConfirm, setShowConfirm] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!selectedProduct) {
      toast.error('Please select a product first')
      return
    }
    if (!formData.quantity) {
      toast.error('Please enter the new quantity')
      return
    }
    setShowConfirm(true)
  }

  const handleConfirm = () => {
    adjustMutation.mutate({
      product: selectedProduct._id,
      quantity: Number(formData.quantity),
      notes: `${formData.reason}: ${formData.notes}`,
      reference: `MANUAL-${Date.now().toString().slice(-6)}`
    })
    setShowConfirm(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/inventory')}
          className="group mb-2 p-0 hover:bg-transparent"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover transition-transform" />
          Back to Inventory
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">
          Inventory Correction
        </h1>
        <p className="text-gray-500 font-medium mt-1">
          Manually sync physical stock with digital records
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product Selector */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-8 border-none shadow-2xl shadow-gray-200/50">
            <h3 className="text-base font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Search className="w-5 h-5 text-green-600" />
              Step 1: Locate Product
            </h3>

            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within transition-colors" />
              <input
                type="text"
                placeholder="Start typing product name, SKU or barcode..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-[#F8F9FA] focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600 outline-none transition-all font-bold text-gray-900 shadow-sm"
              />
            </div>

            {/* Search Results */}
            <AnimatePresence>
              {search.length > 2 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-2 rounded-2xl bg-white border border-gray-100 shadow-xl max-h-60 overflow-y-auto z-10"
                >
                  {isSearching ? (
                    <div className="p-4 text-center text-xs font-bold text-gray-400 uppercase animate-pulse">Scanning database...</div>
                  ) : searchResults?.data?.data?.length > 0 ? (
                    searchResults.data.data.map(product => (
                      <button
                        key={product._id}
                        onClick={() => {
                          setSelectedProduct(product)
                          setSearch('')
                        }}
                        className="w-full flex items-center justify-between p-4 rounded-xl hover transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                            <Package className="w-5 h-5 text-gray-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{product.name}</p>
                            <p className="text-[10px] text-gray-500 font-bold">SKU: {product.sku}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={product.quantity > 0 ? 'success' : 'danger'}>{product.quantity} In Stock</Badge>
                          <ChevronRight className="w-4 h-4 text-gray-300" />
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-center text-xs font-bold text-gray-400 uppercase italic">No matches found</div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Selected Product Display */}
            {selectedProduct && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-8 p-6 rounded-2xl bg-white border border-gray-200 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center">
                      <Package className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{selectedProduct.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">Current stock</p>
                      <p className="text-3xl font-bold mt-1 text-gray-900">{selectedProduct.quantity} <span className="text-base font-medium text-gray-500">{selectedProduct.unit}</span></p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="p-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <AlertCircle className="w-5 h-5 text-green-600" />
                  </button>
                </div>
              </motion.div>
            )}
          </Card>

          {/* Adjustment Details */}
          <Card className={`p-8 border-none shadow-2xl shadow-gray-200/50 transition-opacity ${!selectedProduct ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            <h3 className="text-base font-semibold text-gray-900 mb-8 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-500" />
              Step 2: Define Correction
            </h3>

            <div className="grid grid-cols-1 md gap-8">
              <div className="space-y-4">
                <label className="block text-xs font-medium text-gray-500">New Observed Quantity</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <ArrowUpDown className="w-4 h-4" />
                  </div>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="Enter the actual physical count"
                    className="w-full pl-16 pr-4 py-4 rounded-2xl border border-gray-200 bg-[#F8F9FA] focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600 outline-none transition-all font-semibold text-2xl text-gray-900 shadow-sm"
                  />
                </div>
                <p className="text-[10px] text-gray-400 font-bold px-4">The system will automatically record the delta and update the balance.</p>
              </div>

              <div className="space-y-4">
                <Select
                  label="Discrepancy Reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  options={[
                    { value: 'Correction', label: 'Initial Inventory Correction' },
                    { value: 'Damage', label: 'Physical Damage / Broken' },
                    { value: 'Lost', label: 'Lost / Shriking' },
                    { value: 'Theft', label: 'Theft / Missing' },
                    { value: 'Return', label: 'Product Return to Vendor' },
                  ]}
                />
                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                    <MessageSquare className="w-3 h-3" />
                    Audit Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Explain why this correction is being made..."
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-[#F8F9FA] focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600 outline-none transition-all font-medium text-sm text-gray-900 resize-none shadow-sm"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Recent Adjustments for Selected Product */}
          {selectedProduct && (
            <Card className="p-8 border-none shadow-2xl shadow-gray-200/50 mt-6">
              <h3 className="text-base font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <History className="w-5 h-5 text-green-600" />
                Recent Activity for {selectedProduct.name}
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-gray-400 font-semibold uppercase text-[10px] tracking-wider border-b border-gray-100">
                    <tr>
                      <th className="py-3 px-2">Date</th>
                      <th className="py-3 px-2">Type</th>
                      <th className="py-3 px-2 text-right">Delta</th>
                      <th className="py-3 px-2 text-right">Final</th>
                      <th className="py-3 px-2">Created By</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {isLoadingTxns ? (
                      <tr><td colSpan="5" className="py-8 text-center text-gray-400">Loading history...</td></tr>
                    ) : recentTxns.length > 0 ? (
                      recentTxns.map(txn => (
                        <tr key={txn._id} className="hover:bg-gray-50/50">
                          <td className="py-3 px-2 text-gray-600">
                            {new Date(txn.transactionDate).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-2 capitalize">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${txn.type === 'stock_in' ? 'bg-blue-50 text-blue-600' :
                                txn.type === 'stock_out' ? 'bg-emerald-50 text-emerald-600' :
                                  'bg-amber-50 text-amber-600'
                              }`}>
                              {txn.type.replace('_', ' ')}
                            </span>
                          </td>
                          <td className={`py-3 px-2 text-right font-bold ${['stock_in', 'return'].includes(txn.type) ? 'text-blue-600' : 'text-rose-600'
                            }`}>
                            {['stock_in', 'return'].includes(txn.type) ? '+' : '-'}{txn.quantity}
                          </td>
                          <td className="py-3 px-2 text-right font-bold text-gray-900">
                            {txn.newQuantity}
                          </td>
                          <td className="py-3 px-2 text-gray-500 text-xs">
                            {txn.createdBy?.name || '---'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="5" className="py-8 text-center text-gray-400 italic">No recent transactions found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-center">
                <Button
                  variant="ghost"
                  size="xs"
                  className="text-green-600 text-[11px] font-bold"
                  onClick={() => navigate(`/inventory/ledger/${selectedProduct._id}`)}
                >
                  View Full Ledger <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Confirm Sidebar */}
        <div className="space-y-6">
          <Card className="p-8 sticky top-6 bg-white border border-gray-200 shadow-sm overflow-hidden" hover={false}>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-6">Authorized By</h4>
            <div className="space-y-6">
              <div className="flex flex-col gap-1 pb-6 border-b border-gray-200">
                <span className="text-base font-semibold text-gray-900">{user?.name}</span>
                <Badge variant="primary" className="w-fit mt-1 text-[10px] px-2">{user?.role}</Badge>
              </div>

              <div className="py-4 space-y-4">
                <Button
                  className="w-full py-3 text-base font-semibold"
                  onClick={handleSubmit}
                  loading={adjustMutation.isPending}
                  disabled={!selectedProduct || !formData.quantity}
                >
                  Confirm Audit
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-gray-600 hover:text-gray-900"
                  onClick={() => navigate('/inventory')}
                >
                  Abort Process
                </Button>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-gray-200">
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                  <p className="text-[10px] leading-relaxed text-gray-600 font-medium">
                    Audit logging is enabled. Every adjustment is recorded in the Stock Ledger with a timestamp and your user signature.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-[#F8F9FA] border border-gray-200 shadow-sm" hover={false}>
            <div className="flex gap-4">
              <div className="p-2 rounded-xl bg-green-50 text-green-700 border border-green-100">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-sm font-semibold text-gray-900">Bulk Import Available</h5>
                <p className="text-[10px] text-gray-600 font-medium mt-1">Use the Import feature to adjust hundreds of items at once via CSV.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirm(false)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-xl p-8"
            >
              <div className="w-16 h-16 rounded-2xl bg-gray-100 text-gray-600 flex items-center justify-center mb-6">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Confirm Adjustment?</h3>
              <p className="text-gray-500 mt-2 font-medium">
                You are about to change the stock of <strong>{selectedProduct.name}</strong> from <span className="text-rose-600 font-bold">{selectedProduct.quantity}</span> to <span className="text-emerald-600 font-bold">{formData.quantity}</span>.
              </p>

              <div className="mt-8 flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowConfirm(false)}>
                  Review Again
                </Button>
                <Button variant="primary" className="flex-1" onClick={handleConfirm}>
                  Yes, Update
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default StockAdjustmentPage
