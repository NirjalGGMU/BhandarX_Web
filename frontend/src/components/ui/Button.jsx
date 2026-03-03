const variantStyles = {
  primary: 'bg-green-600 hover:bg-green-700 text-white btn-primary-glow',
  secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-200',
  success: 'bg-green-600 hover:bg-green-700 text-white btn-primary-glow',
  danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm',
  warning: 'bg-gray-600 hover:bg-gray-700 text-white shadow-sm',
  outline: 'border border-gray-200 hover:border-green-300 hover:bg-green-50/60 text-gray-800 bg-white',
  ghost: 'hover:bg-gray-100 text-gray-600 hover:text-gray-900',
  'ghost-danger': 'hover:bg-red-50 text-red-500 hover:text-red-600',
}

const sizeStyles = {
  xs: 'px-2.5 py-1 text-xs rounded-md',
  sm: 'px-3 py-1.5 text-[13px] rounded-lg',
  md: 'px-4 py-2 text-sm rounded-lg',
  lg: 'px-5 py-2.5 text-[15px] rounded-lg',
}

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  disabled = false,
  ...props
}) => {
  const vStyle = variantStyles[variant] ?? variantStyles.primary
  const sStyle = sizeStyles[size] ?? sizeStyles.md

  return (
    <button
      type="button"
      className={`
        ${vStyle} ${sStyle}
        inline-flex items-center justify-center gap-2 font-medium
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-600/30
        disabled:opacity-50 disabled:cursor-not-allowed
        cursor-pointer select-none touch-manipulation
        active:scale-[0.98]
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading...
        </>
      ) : children}
    </button>
  )
}

export default Button
