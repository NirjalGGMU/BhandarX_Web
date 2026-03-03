import { format } from 'date-fns'
import Badge from '../../../components/ui/Badge'

const MovementTimeline = ({ movements = [] }) => {
  const getMovementTypeInfo = (type) => {
    const types = {
      'stock-in': { color: 'success', icon: '📥', label: 'Stock In' },
      'stock-out': { color: 'danger', icon: '📤', label: 'Stock Out' },
      'adjustment': { color: 'warning', icon: '⚙️', label: 'Adjustment' },
      'sale': { color: 'primary', icon: '💰', label: 'Sale' },
      'purchase': { color: 'info', icon: '🛒', label: 'Purchase' },
      'return': { color: 'default', icon: '↩️', label: 'Return' },
    }
    return types[type] || types['adjustment']
  }

  if (!movements || movements.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No stock movement history available
      </div>
    )
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {movements.map((movement, index) => {
          const typeInfo = getMovementTypeInfo(movement.type)
          const isLast = index === movements.length - 1

          return (
            <li key={movement.id || index}>
              <div className="relative pb-8">
                {!isLast && (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex space-x-3">
                  <div>
                    <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white bg-${typeInfo.color}-500`}>
                      <span className="text-lg">{typeInfo.icon}</span>
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={typeInfo.color} size="sm">
                          {typeInfo.label}
                        </Badge>
                        <span className={`text-sm font-medium ${movement.quantity >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {movement.quantity >= 0 ? '+' : ''}{movement.quantity}
                        </span>
                      </div>
                      <p className="text-sm text-gray-900">
                        {movement.description || movement.notes || 'No description'}
                      </p>
                      {movement.reference && (
                        <p className="text-xs text-gray-500 mt-1">
                          Ref: {movement.reference}
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                        <span>Balance: {movement.balanceAfter || movement.balance || 'N/A'}</span>
                        {movement.user && <span>By: {movement.user.name || movement.user}</span>}
                      </div>
                    </div>
                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                      {movement.createdAt && format(new Date(movement.createdAt), 'MMM dd, yyyy HH:mm')}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default MovementTimeline
