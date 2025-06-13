import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import CategoryPill from '@/components/molecules/CategoryPill'
import { categoryService, taskService } from '@/services'

const CategorySidebar = () => {
  const location = useLocation()
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryColor, setNewCategoryColor] = useState('#6366F1')

  const predefinedColors = [
    '#6366F1', '#8B5CF6', '#EC4899', '#10B981', 
    '#F59E0B', '#EF4444', '#3B82F6', '#06B6D4'
  ]

  const navigationItems = [
    { path: '/tasks', icon: 'CheckSquare', label: 'All Tasks' },
    { path: '/completed', icon: 'CheckCircle', label: 'Completed' },
    { path: '/settings', icon: 'Settings', label: 'Settings' }
  ]

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    setLoading(true)
    try {
      const [categoriesData, tasks] = await Promise.all([
        categoryService.getAll(),
        taskService.getAll()
      ])
      
      // Update task counts for categories
      const categoriesWithCounts = categoriesData.map(category => ({
        ...category,
        taskCount: tasks.filter(task => task.categoryId === category.id).length
      }))
      
      setCategories(categoriesWithCounts)
    } catch (error) {
      toast.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  const handleAddCategory = async (e) => {
    e.preventDefault()
    if (!newCategoryName.trim()) return

    try {
      const newCategory = await categoryService.create({
        name: newCategoryName.trim(),
        color: newCategoryColor
      })
      
      setCategories([...categories, newCategory])
      setNewCategoryName('')
      setNewCategoryColor('#6366F1')
      setShowAddForm(false)
      toast.success('Category added successfully')
    } catch (error) {
      toast.error('Failed to add category')
    }
  }

  const handleCategoryClick = (category) => {
    setSelectedCategory(selectedCategory?.id === category.id ? null : category)
  }

  return (
    <aside className="w-64 bg-surface border-r border-gray-200 overflow-y-auto z-40">
      <div className="p-4 space-y-6">
        {/* Navigation */}
        <nav className="space-y-1">
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <ApperIcon name={item.icon} className="w-5 h-5 mr-3" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Categories */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              Categories
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAddForm(!showAddForm)}
              icon="Plus"
              className="text-xs"
            >
              Add
            </Button>
          </div>

          {/* Add Category Form */}
          <AnimatePresence>
            {showAddForm && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleAddCategory}
                className="mb-4 p-3 bg-white rounded-lg border space-y-3"
              >
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Category name"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                />
                
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    {predefinedColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setNewCategoryColor(color)}
                        className={`w-6 h-6 rounded-full border-2 ${
                          color === newCategoryColor ? 'border-gray-400' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button type="submit" size="sm" disabled={!newCategoryName.trim()}>
                    Add
                  </Button>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Categories List */}
          <div className="space-y-2">
            {loading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-10 bg-gray-200 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : (
              <AnimatePresence>
                {categories.map((category) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <CategoryPill
                      category={category}
                      isActive={selectedCategory?.id === category.id}
                      onClick={handleCategoryClick}
                      className="w-full justify-start"
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="pt-6 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Quick Stats</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Tasks</span>
              <span className="font-medium">{categories.reduce((sum, cat) => sum + cat.taskCount, 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Categories</span>
              <span className="font-medium">{categories.length}</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default CategorySidebar