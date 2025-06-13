import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const CategoryPill = ({ 
  category, 
  isActive = false, 
  onClick, 
  showCount = true,
  className = '' 
}) => {
  return (
    <motion.button
      onClick={() => onClick?.(category)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-150 ${
        isActive
          ? 'text-white shadow-md'
          : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
      } ${className}`}
      style={isActive ? { backgroundColor: category.color } : {}}
    >
      <span
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ backgroundColor: category.color }}
      />
      <span className="truncate">{category.name}</span>
      {showCount && (
        <span className={`text-xs px-1.5 py-0.5 rounded-full ${
          isActive ? 'bg-white/20' : 'bg-gray-200'
        }`}>
          {category.taskCount}
        </span>
      )}
    </motion.button>
  )
}

export default CategoryPill