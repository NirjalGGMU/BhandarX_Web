import { Mail, Phone, MapPin, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import Card from '../../../components/ui/Card'
import Badge from '../../../components/ui/Badge'
import { formatCurrency } from '../../../utils/helpers'

const CustomerCard = ({ customer, onClick }) => {
  return (
    <Card
      className="p-5 cursor-pointer transition-all duration-200"
      onClick={onClick}
      hover
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm">
            {customer.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 leading-tight">
              {customer.name}
            </h3>
            <p className="text-xs text-gray-400 font-mono mt-0.5">
              ID: {customer.customerId || customer._id.slice(-6)}
            </p>
          </div>
        </div>
        <Badge variant={customer.isActive ? 'success' : 'danger'} size="sm">
          {customer.isActive ? 'Active' : 'Inactive'}
        </Badge>
      </div>

      <div className="space-y-2 mb-4">
        {customer.email && (
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Mail className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
            <span className="truncate">{customer.email}</span>
          </div>
        )}
        {customer.phone && (
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Phone className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
            <span>{customer.phone}</span>
          </div>
        )}
        {customer.address && (
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <MapPin className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
            <span className="truncate">{customer.address}</span>
          </div>
        )}
        {customer.createdAt && (
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Calendar className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
            <span>Since {format(new Date(customer.createdAt), 'MMM dd, yyyy')}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div>
          <p className="text-xs text-gray-500 mb-0.5">Total Purchases</p>
          <p className="text-base font-bold text-green-700">
            {formatCurrency(customer.totalPurchases || 0)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 mb-0.5">Orders</p>
          <p className="text-base font-bold text-gray-900">
            {customer.orderCount || 0}
          </p>
        </div>
      </div>
    </Card>
  )
}

export default CustomerCard
