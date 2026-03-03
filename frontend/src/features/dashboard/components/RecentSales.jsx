import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../../store/authStore'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import { ChevronRight, DollarSign } from 'lucide-react'
import { formatCurrency } from '../../../utils/helpers'

const RecentSales = ({ sales }) => {
    const navigate = useNavigate()
    const { user } = useAuthStore()

    return (
        <Card hover={false} className="overflow-hidden h-full flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div>
                    <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <DollarSign size={16} className="text-green-600" />
                        Recent Transactions
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">Latest sales activity</p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(user?.role === 'admin' ? '/admin/reports' : '/employee/history')}
                    className="text-[12px]"
                >
                    View all <ChevronRight size={13} className="ml-1" />
                </Button>
            </div>

            <div className="overflow-x-auto flex-1">
                <table className="w-full table-premium">
                    <thead>
                        <tr>
                            <th>Invoice</th>
                            <th>Customer</th>
                            <th className="text-right">Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sales?.map((sale) => (
                            <tr key={sale._id} className="hover:bg-green-50/40 transition-colors">
                                <td>
                                    <span className="font-mono text-[12px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded">#{sale.invoiceNumber}</span>
                                </td>
                                <td>
                                    <button
                                        onClick={() => sale.customer?._id && navigate(`/customers/${sale.customer._id}`)}
                                        className="text-[13px] font-medium text-gray-700 hover:text-green-600 transition-colors text-left"
                                    >
                                        {sale.customer?.name || 'Walk-in'}
                                    </button>
                                    <p className="text-[11px] text-gray-400">{new Date(sale.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </td>
                                <td className="text-right">
                                    <span className="text-[14px] font-semibold text-green-700">{formatCurrency(sale.totalAmount)}</span>
                                </td>
                                <td>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${sale.paymentStatus === 'PAID' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-600'
                                        }`}>
                                        {sale.paymentStatus}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {!sales?.length && (
                            <tr>
                                <td colSpan={4} className="text-center py-16 text-gray-400 text-sm">
                                    No transactions yet
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    )
}

export default RecentSales
