import { useState } from 'react'
import { Search, Grid, List, Package, Box } from 'lucide-react'
import { formatCurrency, getProductImageUrl } from '../../../utils/helpers'

const ProductSelector = ({ products = [], onSelectProduct, viewMode = 'grid' }) => {
  const [search, setSearch] = useState('')
  const [view, setView] = useState(viewMode)

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase()) ||
    product.sku.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="h-full flex flex-col bg-white">
      {/* ── Control Interface ── */}
      <div className="p-6 border-b border-slate-100 bg-slate-50/30">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Products</h3>
            <p className="text-xs text-slate-400">Select items to add to cart</p>
          </div>
          <div className="flex bg-white p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setView('grid')}
              className={`p-2 rounded-lg transition-all ${view === 'grid'
                ? 'bg-primary-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-primary-600'
                }`}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded-lg transition-all ${view === 'list'
                ? 'bg-primary-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-primary-600'
                }`}
            >
              <List size={16} />
            </button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-11 pr-4 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 transition-all text-sm"
          />
        </div>
      </div>

      {/* ── Product Matrix ── */}
      <div className="flex-1 overflow-y-auto p-6 no-scrollbar bg-white">
        {view === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredProducts.map((product) => {
              const isOutOfStock = product.quantity <= 0;
              return (
                <button
                  key={product._id}
                  onClick={() => !isOutOfStock && onSelectProduct(product)}
                  disabled={isOutOfStock}
                  className={`group relative bg-white rounded-2xl p-4 border transition-all text-left cursor-pointer overflow-hidden ${isOutOfStock ? 'opacity-60 grayscale cursor-not-allowed border-slate-100' : 'border-slate-100 hover:border-primary-200'
                    }`}
                >
                  <div className="relative aspect-square bg-slate-50 rounded-xl mb-4 overflow-hidden border border-slate-50">
                    {product.images?.[0] ? (
                      <img
                        src={getProductImageUrl(product.images[0])}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-200 group-hover:text-primary-200 transition-colors">
                        <Box size={40} strokeWidth={1} />
                      </div>
                    )}

                    {isOutOfStock && (
                      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center">
                        <span className="text-xs font-medium text-white px-2 py-1 bg-slate-800/60 rounded-md">Out of stock</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded leading-none">
                        {product.category?.name || 'Uncategorized'}
                      </span>
                    </div>
                    <h3 className="font-semibold text-slate-800 text-sm line-clamp-1 group-hover:text-primary-700 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-400">
                      SKU: {product.sku}
                    </p>
                  </div>

                  <div className="mt-4 flex items-end justify-between">
                    <span className="text-lg font-semibold text-primary-700">
                      {formatCurrency(product.sellingPrice || product.price)}
                    </span>
                    <div className={`px-2 py-1 rounded-lg text-xs font-medium ${product.quantity > product.minStockLevel ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                      }`}>
                      Stock: {product.quantity}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredProducts.map((product) => {
              const isOutOfStock = product.quantity <= 0;
              return (
                <button
                  key={product._id}
                  onClick={() => !isOutOfStock && onSelectProduct(product)}
                  disabled={isOutOfStock}
                  className={`w-full bg-white rounded-xl p-3 border transition-all flex items-center gap-4 text-left cursor-pointer group ${isOutOfStock ? 'opacity-60 grayscale border-slate-100' : 'border-slate-100 hover:border-primary-200'
                    }`}
                >
                  <div className="w-14 h-14 bg-slate-50 rounded-lg overflow-hidden shrink-0 border border-slate-100">
                    {product.images?.[0] ? (
                      <img
                        src={getProductImageUrl(product.images[0])}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-200">
                        <Box size={20} strokeWidth={1} />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-800 text-sm truncate group-hover:text-primary-700 transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-slate-400">SKU: {product.sku}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-200" />
                      <span className="text-xs text-primary-600">{product.category?.name || 'Uncategorized'}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0 px-2">
                    <p className="text-xs text-slate-400 leading-none mb-1">Price</p>
                    <p className="text-lg font-semibold text-primary-700">
                      {formatCurrency(product.sellingPrice || product.price)}
                    </p>
                  </div>

                  <div className={`w-12 h-12 flex flex-col items-center justify-center rounded-xl text-xs font-medium ${product.quantity > product.minStockLevel ? 'bg-slate-50 text-slate-600' : 'bg-rose-50 text-rose-500'
                    }`}>
                    <span className="text-[9px] opacity-60 leading-none mb-0.5">Qty</span>
                    {product.quantity}
                  </div>
                </button>
              )
            })}
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center py-20 px-6">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200 mb-6">
              <Package size={40} strokeWidth={1} />
            </div>
            <h4 className="text-base font-semibold text-slate-700 mb-2">No products found</h4>
            <p className="text-sm text-slate-400 max-w-[240px]">
              Try a different search term.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductSelector
