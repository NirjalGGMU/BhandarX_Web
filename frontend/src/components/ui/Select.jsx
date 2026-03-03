const Select = ({
  label,
  error,
  options = [],
  placeholder = 'Select an option',
  className = '',
  containerClassName = '',
  ...props
}) => {
  return (
    <div className={`space-y-1.5 ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">{label}</label>
      )}
      <div className="relative">
        <select
          className={`
            block w-full rounded-lg border border-gray-200
            pl-3 pr-8 py-2.5
            bg-white text-gray-900 text-sm
            appearance-none cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600
            disabled:opacity-50 disabled:bg-gray-50 disabled:cursor-not-allowed
            transition-all duration-150
            ${error ? 'border-red-300 focus:ring-red-500/20 focus:border-red-400' : ''}
            ${className}
          `}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <svg className="w-[18px] h-[18px] text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  )
}

export default Select
