const Input = ({
  label,
  error,
  icon: Icon,
  className = '',
  containerClassName = '',
  ...props
}) => {
  return (
    <div className={`space-y-1.5 ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-[18px] w-[18px] text-green-600" />
          </div>
        )}
        <input
          className={`
            block w-full rounded-lg border border-gray-200
            ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2.5
            bg-white text-gray-900 text-sm
            placeholder:text-gray-400
            focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600
            disabled:opacity-50 disabled:bg-gray-50 disabled:cursor-not-allowed
            transition-all duration-150
            ${error ? 'border-red-300 focus:ring-red-500/20 focus:border-red-400' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}

export default Input
