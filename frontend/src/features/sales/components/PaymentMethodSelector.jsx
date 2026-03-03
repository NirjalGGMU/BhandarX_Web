import { CreditCard, Banknote, QrCode } from 'lucide-react'

const PaymentMethodSelector = ({ selected, onSelect }) => {
  const methods = [
    { id: 'cash', label: 'Cash', icon: Banknote },
    { id: 'card', label: 'Card', icon: CreditCard },
    { id: 'qr', label: 'QR Code', icon: QrCode },
  ]

  return (
    <div className="grid grid-cols-3 gap-4">
      {methods.map((method) => {
        const Icon = method.icon
        const isSelected = selected === method.id

        return (
          <button
            key={method.id}
            type="button"
            onClick={() => onSelect(method.id)}
            className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-3 cursor-pointer ${
              isSelected
                ? 'border-primary-600 bg-primary-50/50 text-primary-700 shadow-lg shadow-primary-600/5'
                : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'
            }`}
          >
            <Icon size={24} className={`transition-colors ${isSelected ? 'text-primary-600' : 'text-slate-300'}`} />
            <p className="text-xs font-medium">{method.label}</p>
          </button>
        )
      })}
    </div>
  )
}

export default PaymentMethodSelector
