import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Package,
  ArrowLeft,
  Edit2,
  Trash2,
  Tag,
  DollarSign,
  Layers,
  Barcode,
  Calendar,
  AlertCircle,
  Clock,
  ChevronRight,
  Truck,
  Mail,
  Phone,
  FileText
} from 'lucide-react'
import productService from '../../../services/productService'
import inventoryService from '../../../services/inventoryService'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import StockStatusBadge from '../../inventory/components/StockStatusBadge'
import { useAuthStore } from '../../../store/authStore'
import { ROLES } from '../../../utils/constants'
import { formatCurrency, getProductImageUrl } from '../../../utils/helpers'
import { format as formatDateFns } from 'date-fns'

const ProductDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const isAdmin = user?.role === ROLES.ADMIN
  const isEmployee = user?.role === ROLES.EMPLOYEE
  const [activeImage, setActiveImage] = useState(0)

  const { data: productRes, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProductById(id),
  })

  // ... (ledger query)
  const { data: ledgerRes } = useQuery({
    queryKey: ['product-ledger', id],
    queryFn: () => inventoryService.getStockLedger(id),
  })

  const product = productRes?.data?.data
  const movements = ledgerRes?.data?.data?.movements || []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Product Not Found</h2>
        <Button variant="ghost" onClick={() => navigate('/products')} className="mt-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Products
        </Button>
      </div>
    )
  }

  const images = product.images || []

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/products')} className="group">
            <ArrowLeft className="w-5 h-5 group-hover transition-transform" />
          </Button>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Products</span>
            <ChevronRight className="w-4 h-4" />
            <span className="font-bold text-gray-900 uppercase tracking-wider">{product.sku}</span>
          </div>
        </div>
        <div className="flex gap-3">
          {isAdmin && (
            <Button variant="outline" onClick={() => navigate(`/products/${id}/edit`)}>
              <Edit2 className="w-4 h-4 mr-2" /> Edit Product
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Image Gallery & Essential Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50">
            {/* Gallery Section */}
            <div className="space-y-4">
              <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center group relative">
                {images.length > 0 ? (
                  <img
                    src={getProductImageUrl(images[activeImage])}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-300">
                    <Package size={64} strokeWidth={1} />
                    <p className="text-xs font-bold uppercase mt-2">No Image</p>
                  </div>
                )}
                {product.status === 'inactive' && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                    <Badge variant="danger">INACTIVE</Badge>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${activeImage === idx ? 'border-green-600 scale-95 shadow-lg' : 'border-gray-100 opacity-60 hover:opacity-100'
                        }`}
                    >
                      <img
                        src={getProductImageUrl(img)}
                        alt="thumb"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Core Info Section */}
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <Badge variant={product.status === 'active' ? 'success' : 'danger'}>
                  {product.status.toUpperCase()}
                </Badge>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{product.category?.name || 'Uncategorized'}</span>
              </div>

              <h1 className="text-4xl font-extrabold text-gray-900 leading-tight mb-4 tracking-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-6 mb-8">
                <div className="bg-gray-100 px-4 py-2 rounded-xl flex items-center gap-2 border border-gray-200">
                  <Barcode className="w-5 h-5 text-gray-400" />
                  <span className="text-lg font-mono font-bold tracking-tighter text-gray-700">{product.sku}</span>
                </div>
              </div>

              <div className="flex items-center gap-8 py-6 border-y border-gray-100 mb-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Selling Price</p>
                  <p className="text-3xl font-black text-green-700 leading-none">{formatCurrency(product.price || product.sellingPrice)}</p>
                </div>
                {isAdmin && (
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cost Price</p>
                    <p className="text-xl font-bold text-gray-500 leading-none">{formatCurrency(product.costPrice || product.purchasePrice)}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                <Layers className="w-4 h-4" />
                <span>Unit: <span className="text-gray-900 font-bold capitalize">{product.unit || 'Piece'}</span></span>
              </div>
            </div>
          </div>

          <Card className="p-8 border-none shadow-xl shadow-gray-200/50 bg-white">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 uppercase tracking-tighter">
              <FileText className="w-5 h-5 text-green-600" />
              Description & Specifications
            </h3>
            <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
              {product.description || 'No detailed description available for this product yet.'}
            </p>
          </Card>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-y border-gray-100 bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50">
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <Tag className="w-3.5 h-3.5" /> Classification
              </h4>
              <div className="flex flex-col gap-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm text-gray-500">Category:</span>
                  <span className="text-sm font-bold text-gray-900">{product.category?.name || 'Uncategorized'}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm text-gray-500">Base Unit:</span>
                  <span className="text-sm font-bold text-gray-900 capitalize">{product.unit || 'Piece'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <Truck className="w-3.5 h-3.5" /> Primary Supplier
              </h4>
              {product.supplier ? (
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-bold text-gray-900">{product.supplier.name}</p>
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-gray-500 flex items-center gap-1.5">
                      <Mail className="w-3 h-3" /> {product.supplier.email}
                    </p>
                    {product.supplier.phone && (
                      <p className="text-xs text-gray-500 flex items-center gap-1.5">
                        <Phone className="w-3 h-3" /> {product.supplier.phone}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">No supplier assigned</p>
              )}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-4 bg-white p-6 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>Created on {formatDateFns(new Date(product.createdAt), 'MMMM dd, yyyy')}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>Last updated {formatDateFns(new Date(product.updatedAt), 'MMMM dd, yyyy')}</span>
            </div>
          </div>

          {/* Stock History - Restricted to Admin/Manager */}
          {isAdmin && (
            <Card className="border-none shadow-xl shadow-gray-200/50 bg-white">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 uppercase tracking-tighter">
                  <Clock className="w-5 h-5 text-green-600" />
                  Inventory Movement
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Date</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Type</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Qty</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Balance</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-right">Reference</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {movements.map((move, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-600">{formatDateFns(new Date(move.date), 'MMM dd, HH:mm')}</td>
                        <td className="px-6 py-4">
                          <Badge variant={move.type === 'IN' ? 'success' : 'danger'}>
                            {move.type}
                          </Badge>
                        </td>
                        <td className={`px-6 py-4 text-sm font-bold ${move.type === 'IN' ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {move.type === 'IN' ? '+' : '-'}{move.quantity}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-gray-900">{move.balanceAfter}</td>
                        <td className="px-6 py-4 text-xs font-mono text-gray-500 uppercase text-right truncate max-w-[120px]">{move.reference.split('-').pop()}</td>
                      </tr>
                    ))}
                    {movements.length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-gray-400 italic">No movement recorded yet</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>

        {/* Right Column: Inventory Summary */}
        <div className="space-y-6">
          <Card hover={false} className="border-none shadow-xl shadow-gray-200/50 bg-white p-2">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center">
                  <Package className="w-6 h-6 text-green-600" />
                </div>
                <StockStatusBadge stock={product.quantity} reorderLevel={product.minStockLevel} />
              </div>

              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-6">Current Stock</p>
              <div className="flex items-baseline gap-2 mt-1">
                <h2 className="text-5xl font-black text-gray-900 tracking-tighter">{product.quantity}</h2>
                <span className="text-sm font-bold text-gray-500 uppercase">{product.unit || 'Piece'}</span>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 space-y-4">
                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                  <span className="text-xs font-bold text-gray-500 uppercase">Alert Level</span>
                  <span className="text-sm font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-lg border border-orange-100">{product.minStockLevel} {product.unit}</span>
                </div>
                {isAdmin && (
                  <div className="flex justify-between items-center bg-green-50/30 p-3 rounded-xl">
                    <span className="text-xs font-bold text-gray-500 uppercase">Valuation</span>
                    <span className="text-sm font-bold text-green-700">{formatCurrency(product.quantity * (product.price || product.sellingPrice))}</span>
                  </div>
                )}
              </div>
            </div>
          </Card>

          <Card className="border-none shadow-xl shadow-gray-200/50 bg-white">
            <div className="p-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Stock Health</h3>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-3">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${product.quantity === 0 ? 'bg-rose-500' :
                    product.quantity <= product.minStockLevel ? 'bg-amber-400' : 'bg-emerald-500'
                    }`}
                  style={{ width: `${Math.min((product.quantity / (product.minStockLevel * 2 || 10)) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                {product.quantity <= product.minStockLevel ?
                  'Inventory is critically low. Consider reordering soon to maintain service.' :
                  'Stock level is healthy and sufficient for current demand.'}
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailsPage
