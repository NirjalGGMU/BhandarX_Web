import { Trash2, Plus, Minus, ShoppingCart, Receipt } from 'lucide-react'
import Button from '../../../components/ui/Button'
import { formatCurrency } from '../../../utils/helpers'

const CartPanel = ({ items = [], onUpdateQuantity, onCheckout, subtotal, tax, total }) => {
  return (
    <div className="h-full flex flex-col bg-white rounded-3xl border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] overflow-hidden">
      {/* ── Header ── */}
      <div className="p-6 border-b border-slate-100 bg-white flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
            <ShoppingCart size={16} />
          </div>
          Cart
        </h3>
        <div className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </div>
      </div>

      {/* ── Deployment Specs (Cart Items) ── */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 px-6">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mb-4">
                <ShoppingCart size={32} strokeWidth={1} />
              </div>
              <p className="text-sm text-slate-400">Your cart is empty.</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item._id}
                className="group bg-slate-50/50 rounded-2xl p-4 border border-slate-100 hover:border-primary-200 hover:bg-white hover:shadow-xl hover:shadow-primary-600/5 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-slate-800 truncate group-hover:text-primary-700 transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      SKU: {item.sku}
                    </p>
                  </div>
                  <button
                    onClick={() => onUpdateQuantity(item._id, 0)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 bg-white rounded-xl p-1 border border-slate-200 shadow-sm">
                    <button
                      onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-400 hover:text-primary-600 transition-colors cursor-pointer"
                    >
                      <Minus size={12} strokeWidth={3} />
                    </button>
                    <span className="w-8 text-center text-xs font-semibold text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-400 hover:text-primary-600 transition-colors cursor-pointer"
                    >
                      <Plus size={12} strokeWidth={3} />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400 mb-1">Line total</p>
                    <p className="font-semibold text-sm text-primary-700">
                      {formatCurrency((item.sellingPrice || item.price) * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
      </div>

      <div className="p-6 border-t border-slate-100 bg-white space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Subtotal</span>
            <span className="text-slate-800 font-medium">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Tax</span>
            <span className="text-slate-800 font-medium">{formatCurrency(tax)}</span>
          </div>
          <div className="pt-3 border-t border-slate-100">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-slate-400 mb-0.5">Total</p>
                <p className="text-2xl font-bold text-slate-900">
                  {formatCurrency(total)}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white">
                <Receipt size={20} />
              </div>
            </div>
          </div>
        </div>

        <Button
          type="button"
          variant="primary"
          className="w-full h-12 rounded-xl text-sm font-semibold"
          onClick={onCheckout}
          disabled={items.length === 0}
        >
          Proceed to Checkout
        </Button>
      </div>
    </div>
  )
}

export default CartPanel
