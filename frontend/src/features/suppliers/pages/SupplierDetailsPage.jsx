import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  Building2,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Globe,
  Tag,
  CheckCircle2,
  XCircle,
  Truck,
  Package,
  ExternalLink,
  Edit2
} from 'lucide-react'
import supplierService from '../../../services/supplierService'
import productService from '../../../services/productService'
import { formatCurrency } from '../../../utils/helpers'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import Table from '../../../components/ui/Table'

const SupplierDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  // Fetch Supplier Info
  const { data: supplierRes, isLoading: isFetchingSupplier } = useQuery({
    queryKey: ['supplier', id],
    queryFn: () => supplierService.getById(id),
  })

  // Fetch Products by this Supplier
  const { data: productsRes, isLoading: isFetchingProducts } = useQuery({
    queryKey: ['supplier-products', id],
    queryFn: () => productService.getAllProducts({ supplier: id, limit: 10 }),
  })

  const supplier = supplierRes?.data?.data
  const products = productsRes?.data?.data || []

  if (isFetchingSupplier) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!supplier) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
        <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Supplier Not Found</h2>
        <Button variant="ghost" onClick={() => navigate('/admin/suppliers')} className="mt-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Vendors
        </Button>
      </div>
    )
  }

  const columns = [
    {
      key: 'name',
      label: 'Product Info',
      render: (value, product) => (
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100">
            <Package className="w-4 h-4" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-bold text-gray-900 uppercase tracking-tight">{product.name}</p>
            <p className="text-[10px] text-gray-400 font-mono">SKU: {product.sku}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'price',
      label: 'Retail Price',
      render: (value) => <span className="text-sm font-bold text-green-700">{formatCurrency(value)}</span>
    },
    {
      key: 'quantity',
      label: 'On Hand',
      render: (value) => (
        <span className={`text-sm font-bold ${value <= 5 ? 'text-rose-600' : 'text-gray-900'}`}>
          {value} Units
        </span>
      )
    },
    {
      key: '_id',
      label: 'Action',
      render: (pid) => (
        <Button variant="ghost" size="sm" onClick={() => navigate(`/products/${pid}`)}>
          <ExternalLink className="w-4 h-4 text-gray-400" />
        </Button>
      )
    }
  ]

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin/suppliers')} className="hover:bg-green-50 group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{supplier.name}</h1>
              <Badge variant={supplier.status === 'active' ? 'success' : 'danger'}>
                {supplier.status.toUpperCase()}
              </Badge>
            </div>
            <p className="text-gray-500 font-medium flex items-center gap-1.5 mt-1">
              <Building2 className="w-4 h-4 text-green-600" />
              Vendor ID: <span className="font-mono text-gray-900">{supplier.code || 'N/A'}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="md" onClick={() => navigate(`/admin/suppliers/${id}/edit`)}>
            <Edit2 className="w-4 h-4 mr-2" /> Edit Vendor
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Info & Details */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6 border-none shadow-xl shadow-gray-200/50 bg-white">
            <h3 className="text-sm font-semibold text-gray-500 mb-4">Contact Information</h3>
            <div className="space-y-5">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="p-2 bg-white rounded-xl shadow-sm">
                  <Mail className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Primary Email</p>
                  <p className="text-sm font-bold text-gray-900 truncate">{supplier.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="p-2 bg-white rounded-xl shadow-sm">
                  <Phone className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Direct Phone</p>
                  <p className="text-sm font-bold text-gray-900">{supplier.phone}</p>
                </div>
              </div>

              {supplier.website && (
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="p-2 bg-white rounded-xl shadow-sm">
                    <Globe className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Vendor Site</p>
                    <a href={supplier.website} target="_blank" rel="noreferrer" className="text-sm font-bold text-green-700 hover:underline flex items-center gap-1">
                      Visit Website <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="p-2 bg-white rounded-xl shadow-sm">
                  <MapPin className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Headquarters</p>
                  <p className="text-sm font-medium text-gray-700 leading-relaxed">
                    {supplier.address}<br />
                    {supplier.city}, {supplier.country}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-none shadow-xl shadow-gray-200/50 bg-white">
            <h3 className="text-sm font-semibold text-gray-500 mb-4">General Info</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-xs font-medium text-gray-500">Category</span>
                <Badge variant="primary">{supplier.category || 'General'}</Badge>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-xs font-medium text-gray-500">Contact Person</span>
                <span className="text-sm font-bold text-gray-900">{supplier.contactPerson || 'No Primary Contact'}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Product Catalog From This Supplier */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-xl shadow-gray-200/50 bg-white overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-green-600" />
                  Product Catalog
                </h3>
                <p className="text-xs font-medium text-gray-400 mt-0.5">List of items sourced through this vendor</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate(`/products?supplier=${id}`)}>
                Manage All
              </Button>
            </div>
            <Table
              columns={columns}
              data={products}
              isLoading={isFetchingProducts}
              emptyMessage="No products are currently linked to this supplier."
              className="bg-white"
            />
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 border-l-4 border-l-green-600" hover={false}>
              <p className="text-xs text-gray-400">Active sourcing</p>
              <h4 className="text-2xl font-bold text-gray-900 mt-1">{products.length} Products</h4>
            </Card>
            <Card className="p-6 border-l-4 border-l-green-600" hover={false}>
              <p className="text-xs text-gray-400">Inventory Value</p>
              <h4 className="text-2xl font-bold text-green-700 mt-1">
                {formatCurrency(products.reduce((acc, p) => acc + (p.quantity * p.price), 0))}
              </h4>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SupplierDetailsPage
