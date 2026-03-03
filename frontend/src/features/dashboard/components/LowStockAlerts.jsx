import { useNavigate } from 'react-router-dom'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import { AlertTriangle, Plus, CheckCircle2 } from 'lucide-react'

const LowStockAlerts = ({ products, isAdmin }) => {
    const navigate = useNavigate()

    return (
        <Card className="p-5 h-full flex flex-col" hover={false}>
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500" />
                        Low Stock Alerts
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">Items below reorder level</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                    <AlertTriangle size={16} className="text-red-500" />
                </div>
            </div>

            <div className="space-y-2.5 flex-1">
                {products?.slice(0, 5).map((product) => (
                    <div
                        key={product._id}
                        className="flex items-center justify-between p-3 rounded-lg bg-white border border-red-100 hover:border-red-200 transition-colors"
                    >
                        <div className="min-w-0">
                            <p className="text-[13px] font-medium text-gray-800 truncate">{product.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[11px] font-semibold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                                    Qty: {product.quantity}
                                </span>
                                <span className="text-[10px] text-gray-400">Min: {product.minStockLevel}</span>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate(isAdmin ? `/admin/products/${product._id}/edit` : '/employee/products')}
                            className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-600 text-white shadow-sm hover:bg-green-700 transition-all cursor-pointer shrink-0"
                        >
                            <Plus size={15} />
                        </button>
                    </div>
                ))}

                {(!products?.length) && (
                    <div className="flex-1 flex flex-col items-center justify-center py-10">
                        <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-2">
                            <CheckCircle2 size={24} className="text-green-500" />
                        </div>
                        <p className="text-sm text-gray-500 font-medium">All stock levels healthy</p>
                        <p className="text-xs text-gray-400 mt-1">No critical alerts</p>
                    </div>
                )}
            </div>

            {!!products?.length && (
                <Button
                    variant="danger"
                    size="sm"
                    className="w-full mt-4"
                    onClick={() => navigate(isAdmin ? '/admin/products' : '/employee/products')}
                >
                    View Critical Stock
                </Button>
            )}
        </Card>
    )
}

export default LowStockAlerts
