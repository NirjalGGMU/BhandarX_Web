import { QRCodeSVG } from 'qrcode.react'
import { format } from 'date-fns'
import { formatCurrency } from '../../../utils/helpers'

const InvoicePreview = ({ invoice }) => {
  if (!invoice) return null

  const {
    invoiceNumber,
    saleDate,
    date,
    customer,
    items,
    subtotal,
    totalTax,
    totalAmount,
    paymentMethod,
  } = invoice

  const invoiceDate = saleDate || date
  const dateObj = invoiceDate ? new Date(invoiceDate) : null
  const safeDate = dateObj && !Number.isNaN(dateObj.getTime()) ? format(dateObj, 'MMM dd, yyyy') : '—'

  const subtotalValue = subtotal ?? 0
  const taxValue = totalTax ?? 0
  const totalValue = totalAmount ?? subtotalValue + taxValue

  return (
    <div className="bg-white p-12 rounded-2xl shadow-xl shadow-slate-100 border border-slate-100 max-w-3xl mx-auto">

      {/* Header */}
      <div className="flex justify-between items-start border-b border-slate-100 pb-8 mb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center text-white font-bold text-sm">
              BX
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Receipt</h1>
              <p className="text-xs text-slate-400">BhandarX Inventory Management</p>
            </div>
          </div>
        </div>
        <div className="border border-slate-100 rounded-xl p-2">
          <QRCodeSVG
            value={JSON.stringify({ invoiceNumber, total: totalValue, date: invoiceDate })}
            size={90}
            level="H"
            className="rounded-lg"
          />
        </div>
      </div>

      {/* Customer & Invoice Details */}
      <div className="grid grid-cols-2 gap-10 mb-10">
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide border-l-4 border-green-600 pl-3">Bill To</h3>
          <div className="pl-4">
            <p className="text-base font-semibold text-slate-900">{customer?.name || 'Walk-in Customer'}</p>
            {customer?.email && <p className="text-sm text-slate-500 mt-0.5">{customer.email}</p>}
            {customer?.phone && <p className="text-sm text-slate-500 mt-0.5">{customer.phone}</p>}
          </div>
        </div>
        <div className="space-y-3 flex flex-col items-end">
          <div className="text-right">
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Invoice #</p>
            <p className="text-sm font-semibold text-slate-900">#{invoiceNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Date</p>
            <p className="text-sm text-slate-700">{safeDate}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Payment Method</p>
            <p className="text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-md capitalize">{paymentMethod}</p>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="overflow-x-auto mb-10">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wide">#</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wide">Item</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase tracking-wide">Qty</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wide">Unit Price</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wide">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {items?.map((item, index) => (
              <tr key={index}>
                <td className="px-4 py-4 text-sm text-slate-400">{index + 1}</td>
                <td className="px-4 py-4">
                  <p className="text-sm font-medium text-slate-800">{item.productName || item.name}</p>
                  {item.sku && <p className="text-xs text-slate-400 mt-0.5">SKU: {item.sku}</p>}
                </td>
                <td className="px-4 py-4 text-center text-sm text-slate-700">{item.quantity}</td>
                <td className="px-4 py-4 text-right text-sm text-slate-600">
                  {formatCurrency(item.unitPrice ?? item.price ?? 0)}
                </td>
                <td className="px-4 py-4 text-right text-sm font-semibold text-slate-900">
                  {formatCurrency(
                    item.lineTotal ??
                    (item.unitPrice ?? item.price ?? 0) * (item.quantity ?? 0)
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end bg-slate-50 rounded-2xl p-8 border border-slate-100">
        <div className="w-64 space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500">Subtotal</span>
            <span className="text-slate-800">{formatCurrency(subtotalValue)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500">Tax</span>
            <span className="text-slate-800">{formatCurrency(taxValue)}</span>
          </div>
          <div className="pt-3 border-t border-slate-200 flex justify-between items-end">
            <span className="text-sm font-semibold text-slate-900">Total</span>
            <span className="text-3xl font-bold text-green-700">{formatCurrency(totalValue)}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pt-8 mt-8 border-t border-slate-100 space-y-1">
        <p className="text-sm font-medium text-slate-600">Thank you for your purchase!</p>
        <p className="text-xs text-slate-300">For support, contact: support@bhandarx.net</p>
      </div>
    </div>
  )
}

export default InvoicePreview
