import { motion } from 'framer-motion'

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'sm',
  priority = null,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full'
  
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    error: 'bg-error/10 text-error',
    accent: 'bg-accent/10 text-accent'
  }
  
  const sizes = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-1 text-sm',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  }

  const priorityColors = {
    high: 'bg-error/10 text-error',
    medium: 'bg-warning/10 text-warning',
    low: 'bg-success/10 text-success'
  }

  let variantClass = variants[variant]
  if (priority && priorityColors[priority]) {
    variantClass = priorityColors[priority]
  }
  
  const classes = `${baseClasses} ${variantClass} ${sizes[size]} ${className}`

  return (
    <motion.span
      className={classes}
      whileHover={{ scale: 1.05 }}
      {...props}
    >
      {priority && (
        <span 
          className={`w-2 h-2 rounded-full mr-1.5 ${
            priority === 'high' ? 'bg-error pulse-glow' : 
            priority === 'medium' ? 'bg-warning' : 
            'bg-success'
          }`}
        />
      )}
      {children}
    </motion.span>
  )
}

export default Badge