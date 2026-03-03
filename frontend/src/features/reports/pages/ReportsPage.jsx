import { useQuery } from '@tanstack/react-query'
import { BarChart3, Calendar, Download, Layers, DollarSign, Package, FileText, TrendingUp, PieChart as PieIcon } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import apiClient from '../../../services/api'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import { formatCurrency } from '../../../utils/helpers'

const PIE_COLORS = ['#16A34A', '#22C55E', '#86EFAC', '#BBF7D0', '#D1FAE5', '#E5E7EB']

const ReportsPage = () => {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['reports-summary'],
    queryFn: async () => {
      const { data } = await apiClient.get('/reports/dashboard/summary')
      return data.data
    },
  })

  const reportStats = [
    {
      title: 'Gross Revenue',
      value: formatCurrency(dashboardData?.sales?.totalRevenue || 0),
      icon: DollarSign,
      description: 'Lifetime accumulated revenue',
    },
    {
      title: 'Net Sales',
      value: (dashboardData?.sales?.totalSales || 0).toLocaleString(),
      icon: TrendingUp,
      description: 'Total completed orders',
    },
    {
      title: 'Inventory Value',
      value: formatCurrency(dashboardData?.overview?.inventoryValue || 0),
      icon: Package,
      description: 'Current market value of stock',
    },
    {
      title: 'Low Stock SKU',
      value: (dashboardData?.overview?.lowStockProducts || 0).toLocaleString(),
      icon: FileText,
      description: 'Items needing replenishment',
    },
  ]

  const chartData = dashboardData?.trends?.map(item => ({
    name: item._id,
    revenue: item.totalRevenue,
    orders: item.totalSales,
  })) || []

  const categoryData = dashboardData?.categoryDistribution?.map(item => ({
    name: item.categoryName || 'Uncategorized',
    value: item.totalRevenue,
  })) || []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[320px]">
        <div className="animate-spin rounded-full h-10 w-10 border-3 border-gray-200 border-t-green-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Reports & Analytics
          </h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <BarChart3 className="w-[18px] h-[18px] text-green-600" />
            Performance insights and business intelligence
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Calendar className="w-[18px] h-[18px]" />
            Custom Range
          </Button>
          <Button variant="primary" size="sm">
            <Download className="w-[18px] h-[18px]" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportStats.map((stat) => (
          <Card key={stat.title} className="p-5" hover={false}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className="w-11 h-11 rounded-full bg-green-50 border border-green-100 flex items-center justify-center shrink-0">
                <stat.icon className="w-[20px] h-[20px] text-green-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">{stat.description}</p>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="p-5" hover={false}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-[18px] h-[18px] text-green-600" />
              Revenue Trend
            </h3>
            <Badge variant="success" size="sm">LIVE</Badge>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  fontSize={12}
                  tick={{ fill: '#6B7280' }}
                  tickFormatter={(val) => String(val).split('-').slice(1).join('/')}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  fontSize={12}
                  tick={{ fill: '#6B7280' }}
                  tickFormatter={(val) => `Rs.${val}`}
                />
                <Tooltip cursor={{ fill: '#F8F9FA' }} />
                <Bar dataKey="revenue" fill="#16A34A" radius={[6, 6, 0, 0]} barSize={34} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5" hover={false}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <PieIcon className="w-[18px] h-[18px] text-green-600" />
              Category Share
            </h3>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={72}
                  outerRadius={104}
                  paddingAngle={6}
                  dataKey="value"
                >
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Table */}
      <Card hover={false} className="overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <Layers className="w-[18px] h-[18px] text-green-600" />
            Category Revenue Breakdown
          </h3>
          <Badge variant="primary" size="sm">SUMMARY</Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full table-premium">
            <thead>
              <tr>
                <th>Category</th>
                <th>Total Revenue</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData?.categoryDistribution?.map((cat, idx) => (
                <tr key={idx}>
                  <td className="font-semibold text-gray-800">{cat.categoryName}</td>
                  <td className="font-semibold text-green-700">{formatCurrency(cat.totalRevenue)}</td>
                  <td><Badge variant="success" size="sm">Active</Badge></td>
                </tr>
              ))}
              {(!dashboardData?.categoryDistribution || dashboardData.categoryDistribution.length === 0) && (
                <tr>
                  <td colSpan="3" className="text-center py-10 text-gray-400 text-sm">
                    No category data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export default ReportsPage
