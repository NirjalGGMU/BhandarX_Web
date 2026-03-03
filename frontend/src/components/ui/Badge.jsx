const Badge = ({ children, variant = 'default', size = 'md', className = '' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    primary: 'bg-green-50 text-green-700',
    success: 'bg-green-50 text-green-700',
    danger: 'bg-red-50 text-red-700',
    warning: 'bg-gray-100 text-gray-700 border border-gray-200',
    info: 'bg-green-50 text-green-700',
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-[11px]',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm',
  }

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  )
}

export default Badge
