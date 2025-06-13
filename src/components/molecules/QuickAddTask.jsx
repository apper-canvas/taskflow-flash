import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import { taskService } from '@/services'

const QuickAddTask = ({ categories = [], onTaskAdded, className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    priority: 'medium',
    dueDate: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      toast.error('Please enter a task title')
      return
    }

    setIsSubmitting(true)
    try {
      const newTask = await taskService.create({
        ...formData,
        dueDate: formData.dueDate || null
      })
      
      toast.success('Task created successfully!')
      onTaskAdded?.(newTask)
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        categoryId: '',
        priority: 'medium',
        dueDate: ''
      })
      setIsExpanded(false)
    } catch (error) {
      toast.error('Failed to create task')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setIsExpanded(false)
    setFormData({
      title: '',
      description: '',
      categoryId: '',
      priority: 'medium',
      dueDate: ''
    })
  }

  const priorityOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' }
  ]

  const categoryOptions = categories.map(cat => ({
    value: cat.id,
    label: cat.name
  }))

  return (
    <motion.div
      className={`bg-white rounded-xl shadow-sm border ${className}`}
      layout
    >
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-4"
          >
            <motion.button
              onClick={() => setIsExpanded(true)}
              className="w-full flex items-center space-x-3 text-left text-gray-500 hover:text-gray-700 transition-colors"
              whileHover={{ scale: 1.01 }}
            >
              <ApperIcon name="Plus" className="w-5 h-5" />
              <span>Add a new task...</span>
            </motion.button>
          </motion.div>
        ) : (
          <motion.form
            key="expanded"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="p-4 space-y-4"
          >
            <Input
              label="Task Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="What needs to be done?"
              autoFocus
              required
            />

            <Input
              label="Description (Optional)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add more details..."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Category"
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                options={categoryOptions}
                placeholder="Select category"
              />

              <Select
                label="Priority"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                options={priorityOptions}
              />

              <Input
                label="Due Date"
                type="datetime-local"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>

            <div className="flex items-center space-x-3">
              <Button
                type="submit"
                disabled={!formData.title.trim()}
                loading={isSubmitting}
                icon="Plus"
              >
                Add Task
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default QuickAddTask