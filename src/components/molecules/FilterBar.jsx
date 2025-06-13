import { useState } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Select from '@/components/atoms/Select'

const FilterBar = ({ 
  filters, 
  onFiltersChange, 
  onClearFilters,
  className = '' 
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const priorityOptions = [
    { value: '', label: 'All Priorities' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ]

  const statusOptions = [
    { value: 'all', label: 'All Tasks' },
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
    { value: 'overdue', label: 'Overdue' }
  ]

  const sortOptions = [
    { value: 'dueDate', label: 'Due Date' },
    { value: 'priority', label: 'Priority' },
    { value: 'created', label: 'Date Created' },
    { value: 'title', label: 'Title' }
  ]

  const handleFilterChange = (key, value) => {
    onFiltersChange?.({ ...filters, [key]: value })
  }

  const hasActiveFilters = () => {
    return filters.priority || filters.status !== 'all' || filters.sortBy !== 'dueDate'
  }

  return (
    <div className={`bg-white rounded-lg border p-4 space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-900 flex items-center">
          <ApperIcon name="Filter" className="w-4 h-4 mr-2" />
          Filters
        </h3>
        <div className="flex items-center space-x-2">
          {hasActiveFilters() && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              icon="X"
            >
              Clear
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            icon={showAdvanced ? "ChevronUp" : "ChevronDown"}
          >
            {showAdvanced ? 'Less' : 'More'}
          </Button>
        </div>
      </div>

      {/* Basic Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          value={filters.status || 'all'}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          options={statusOptions}
          placeholder="Filter by status"
        />
        <Select
          value={filters.sortBy || 'dueDate'}
          onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          options={sortOptions}
          placeholder="Sort by"
        />
      </div>

      {/* Advanced Filters */}
      <motion.div
        initial={false}
        animate={{ height: showAdvanced ? 'auto' : 0, opacity: showAdvanced ? 1 : 0 }}
        className="overflow-hidden"
      >
        <div className="pt-4 border-t">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              value={filters.priority || ''}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              options={priorityOptions}
              placeholder="Filter by priority"
            />
            <div className="flex items-center space-x-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.sortOrder === 'desc'}
                  onChange={(e) => handleFilterChange('sortOrder', e.target.checked ? 'desc' : 'asc')}
                  className="mr-2"
                />
                Descending order
              </label>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default FilterBar