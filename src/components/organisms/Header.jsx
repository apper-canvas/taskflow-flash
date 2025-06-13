import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import SearchBar from '@/components/molecules/SearchBar'
import ProgressRing from '@/components/atoms/ProgressRing'
import { taskService } from '@/services'

const Header = () => {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    completionRate: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const taskStats = await taskService.getStats()
      setStats(taskStats)
    } catch (error) {
      console.error('Failed to load stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (query) => {
    // This would be handled by the parent component or global state
    console.log('Search query:', query)
  }

  return (
    <header className="flex-shrink-0 bg-white border-b border-gray-200 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg"
            >
              <ApperIcon name="CheckSquare" className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 font-display">TaskFlow</h1>
              <p className="text-sm text-gray-500">Streamlined task management</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Stats and Progress */}
          <div className="flex items-center space-x-6">
            {!loading && (
              <>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="text-center">
                    <p className="font-semibold text-gray-900">{stats.pending}</p>
                    <p className="text-gray-500">Pending</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-gray-900">{stats.completed}</p>
                    <p className="text-gray-500">Done</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <ProgressRing 
                    percentage={stats.completionRate} 
                    size={40} 
                    strokeWidth={3} 
                  />
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">Progress</p>
                    <p className="text-gray-500">{stats.completionRate}% complete</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header