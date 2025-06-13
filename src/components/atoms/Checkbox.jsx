import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Checkbox = ({ 
  checked = false, 
  onChange, 
  disabled = false,
  size = 'md',
  className = '',
  ...props 
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }
  
  const iconSizes = {
    sm: 12,
    md: 16,
    lg: 20
  }

  return (
    <motion.div
      className={`relative inline-flex items-center justify-center ${sizes[size]} ${className}`}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="sr-only"
        {...props}
      />
      <div
        className={`
          ${sizes[size]} 
          border-2 rounded-md transition-all duration-200 cursor-pointer
          ${checked 
            ? 'bg-primary border-primary' 
            : 'bg-white border-gray-300 hover:border-primary'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onClick={() => !disabled && onChange?.({ target: { checked: !checked } })}
      >
        <motion.div
          initial={false}
          animate={checked ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="flex items-center justify-center h-full"
        >
          <ApperIcon 
            name="Check" 
            size={iconSizes[size]} 
            className="text-white" 
          />
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Checkbox