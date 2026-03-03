import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Plus, Search, Users, DollarSign, ShoppingBag, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import customerService from '../../../services/customerService'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import { formatCurrency } from '../../../utils/helpers'
import CustomerCard from '../components/CustomerCard'

const CustomersPage = () => {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const { data: customersRes, isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: () => customerService.getAll(),
  })

  const { data: statsRes } = useQuery({
    queryKey: ['customer-statistics'],
    queryFn: () => customerService.getStatistics(),
  })

  const customers = customersRes?.data?.data || []
  const stats = statsRes?.data?.data || {}

  // Filter customers by search
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name?.toLowerCase().includes(search.toLowerCase()) ||
      customer.email?.toLowerCase().includes(search.toLowerCase()) ||
      customer.phone?.includes(search)
  )

  const statCards = [
    {
      title: 'Total Customers',
      value: stats.totalCustomers || 0,
      icon: Users,
      iconBg: '#F0FDF4',
      iconColor: '#16A34A',
    },
    {
      title: 'Active Customers',
      value: stats.activeCustomers || 0,
      icon: TrendingUp,
      iconBg: '#F0FDF4',
      iconColor: '#16A34A',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue || 0),
      icon: DollarSign,
      iconBg: '#F0FDF4',
      iconColor: '#16A34A',
    },
    {
      title: 'Avg. Order Value',
      value: formatCurrency(stats.averageOrderValue || 0),
      icon: ShoppingBag,
      iconBg: '#F0FDF4',
      iconColor: '#16A34A',
    },
  ]

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage customer database and track purchase history.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/customers/new')}
        >
          <Plus className="w-4 h-4" />
          Add Customer
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="p-5" hover={false}>
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center rounded-lg shrink-0"
                style={{ width: 40, height: 40, background: stat.iconBg }}
              >
                <stat.icon size={18} style={{ color: stat.iconColor }} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {stat.title}
                </p>
                <h3 className="text-xl font-bold text-gray-900">{stat.value}</h3>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Search & Filter */}
      <Card className="p-3" hover={false}>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search customers by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-[#F8F9FA] border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600 transition-all placeholder:text-gray-400"
          />
        </div>
      </Card>

      {/* Customer List */}
      <Card className="overflow-hidden" hover={false}>
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-900">All Customers</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Showing {filteredCustomers.length} of {customers.length} customers
          </p>
        </div>

        <div className="p-6">
          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="relative w-11 h-11">
                <div className="absolute inset-0 rounded-full border-2 border-gray-200" />
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-green-600 animate-spin" />
              </div>
              <p className="text-sm font-medium text-gray-500">Loading customers...</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredCustomers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-center px-4">
                <p className="text-base font-medium text-gray-700">
                  {search ? 'No customers found' : 'No customers yet'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {search
                    ? 'Try adjusting your search terms.'
                    : 'Add your first customer to get started.'}
                </p>
              </div>
              {!search && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/customers/new')}
                >
                  <Plus className="w-4 h-4" />
                  Add First Customer
                </Button>
              )}
            </div>
          )}

          {/* Customer Grid */}
          {!isLoading && filteredCustomers.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredCustomers.map((customer) => (
                <CustomerCard
                  key={customer._id}
                  customer={customer}
                  onClick={() => navigate(`/customers/${customer._id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

export default CustomersPage
