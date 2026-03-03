import Badge from '../../../components/ui/Badge'

const StockStatusBadge = ({ stock, reorderLevel, className = '' }) => {
  const getStatus = () => {
    if (stock === 0) {
      return { variant: 'danger', text: 'Out of Stock' }
    } else if (stock <= reorderLevel) {
      return { variant: 'warning', text: 'Low Stock' }
    } else {
      return { variant: 'success', text: 'In Stock' }
    }
  }

  const status = getStatus()

  return (
    <Badge variant={status.variant} className={className}>
      {status.text}
    </Badge>
  )
}

export default StockStatusBadge
