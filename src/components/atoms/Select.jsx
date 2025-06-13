import { forwardRef } from 'react'
import ApperIcon from '@/components/ApperIcon'

const Select = forwardRef(({ 
  label, 
  error, 
  options = [],
  placeholder = 'Select an option',
  className = '',
  ...props 
}, ref) => {
  const selectClasses = `w-full p-3 pr-10 border rounded-lg appearance-none transition-all duration-150 bg-white
    ${error 
      ? 'border-error focus:border-error focus:ring-error' 
      : 'border-gray-300 focus:border-primary focus:ring-primary'
    } 
    focus:outline-none focus:ring-2 focus:ring-opacity-50 
    ${className}`

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={selectClasses}
          {...props}
        >
          {placeholder && (
            <option value="">{placeholder}</option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <ApperIcon name="ChevronDown" className="w-4 h-4 text-gray-400" />
        </div>
      </div>
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  )
})

Select.displayName = 'Select'

export default Select