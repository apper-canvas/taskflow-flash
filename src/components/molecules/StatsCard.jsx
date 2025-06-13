import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import ProgressRing from '@/components/atoms/ProgressRing'

const StatsCard = ({ 
  title, 
  value, 
  icon, 
  change, 
  color = 'primary',
  showProgress = false,
  percentage = 0,
  className = '' 
}) => {
  const colorClasses = {
    primary: 'text-primary bg-primary/10',
    secondary: 'text-secondary bg-secondary/10',
    success: 'text-success bg-success/10',
    warning: 'text-warning bg-warning/10',
    error: 'text-error bg-error/10',
    accent: 'text-accent bg-accent/10'
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className={`bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-all duration-200 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${
              change.type === 'increase' ? 'text-success' : 
              change.type === 'decrease' ? 'text-error' : 'text-gray-500'
            }`}>
              {change.type === 'increase' && '↗ '}
              {change.type === 'decrease' && '↘ '}
              {change.value}
            </p>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          {showProgress && (
            <ProgressRing percentage={percentage} size={48} />
          )}
          {icon && (
            <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
              <ApperIcon name={icon} className="w-6 h-6" />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default StatsCard