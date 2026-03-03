import { useNavigate } from 'react-router-dom'
import Card from '../../../components/ui/Card'
import { Package, ChevronRight } from 'lucide-react'
import { getProductImageUrl } from '../../../utils/helpers'

const RecentItems = ({ products, isAdmin }) => {
    const navigate = useNavigate()

    return (
        <Card className="overflow-hidden" hover={false}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div>
                    <h3 className="text-sm font-semibold text-gray-900">Recent Products</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Recently added items</p>
                </div>
                <button
                    onClick={() => navigate(isAdmin ? '/admin/products' : '/employee/products')}
                    className="text-[12px] font-medium text-green-600 hover:text-green-700 flex items-center gap-1 transition-colors"
                >
                    View all <ChevronRight size={13} />
                </button>
            </div>

            <div className="divide-y divide-gray-50">
                {products?.slice(0, 6).map((product) => (
                    <div
                        key={product._id}
                        onClick={() => navigate(`/products/${product._id}`)}
                        className="flex items-center gap-3.5 px-5 py-3.5 hover:bg-gray-50 cursor-pointer transition-colors group"
                    >
                        <div className="product-thumb shrink-0 group-hover:border-green-200 transition-colors">
                            {product.images?.[0]
                                ? <img src={getProductImageUrl(product.images[0])} alt={product.name} className="w-full h-full object-cover" />
                                : <Package size={16} className="text-green-600" />
                            }
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-[13px] font-medium text-gray-800 truncate group-hover:text-green-700 transition-colors">{product.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[11px] text-gray-400 font-mono">{product.sku}</span>
                                <span className="w-0.5 h-0.5 rounded-full bg-gray-300" />
                                <span className="text-[11px] text-green-600 font-medium">Qty: {product.quantity}</span>
                            </div>
                        </div>
                        <ChevronRight size={14} className="text-gray-300 group-hover:text-green-500 transition-colors" />
                    </div>
                ))}

                {(!products?.length) && (
                    <div className="py-12 flex flex-col items-center justify-center">
                        <Package size={32} className="text-gray-200 mb-2" />
                        <p className="text-sm text-gray-400">No products yet</p>
                    </div>
                )}
            </div>
        </Card>
    )
}

export default RecentItems
