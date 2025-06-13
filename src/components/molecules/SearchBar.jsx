import { useState } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const SearchBar = ({ 
  onSearch, 
  placeholder = "Search tasks...",
  className = '' 
}) => {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch?.(query)
  }

  const handleChange = (e) => {
    const value = e.target.value
    setQuery(value)
    // Debounce search
    clearTimeout(window.searchTimeout)
    window.searchTimeout = setTimeout(() => {
      onSearch?.(value)
    }, 300)
  }

  const clearSearch = () => {
    setQuery('')
    onSearch?.('')
  }

  return (
    <motion.form 
      onSubmit={handleSubmit}
      className={`relative ${className}`}
      whileHover={{ scale: 1.01 }}
    >
      <div className="relative">
        <ApperIcon 
          name="Search" 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" 
        />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`w-full pl-10 pr-10 py-2.5 border rounded-lg transition-all duration-150 
            ${isFocused 
              ? 'border-primary ring-2 ring-primary ring-opacity-20' 
              : 'border-gray-300 hover:border-gray-400'
            } 
            focus:outline-none bg-white`}
        />
        {query && (
          <motion.button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ApperIcon name="X" className="w-4 h-4" />
          </motion.button>
        )}
      </div>
    </motion.form>
  )
}

export default SearchBar