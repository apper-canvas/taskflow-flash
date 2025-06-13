import { forwardRef } from 'react'

const Input = forwardRef(({ 
  label, 
  error, 
  className = '', 
  type = 'text',
  ...props 
}, ref) => {
  const inputClasses = `w-full p-3 border rounded-lg transition-all duration-150 
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
      <input
        ref={ref}
        type={type}
        className={inputClasses}
        {...props}
      />
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input