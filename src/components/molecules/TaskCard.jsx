import { useState } from 'react'
import { motion } from 'framer-motion'
import { format, isToday, isTomorrow, isPast } from 'date-fns'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Checkbox from '@/components/atoms/Checkbox'
import Badge from '@/components/atoms/Badge'
import { taskService } from '@/services'

const TaskCard = ({ task, category, onUpdate, onDelete }) => {
  const [isCompleting, setIsCompleting] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const handleToggleComplete = async () => {
    setIsCompleting(true)
    try {
      const updatedTask = await taskService.toggleComplete(task.id)
      
      if (updatedTask.completed) {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 800)
        toast.success('Task completed! 🎉')
      } else {
        toast.success('Task marked as pending')
      }
      
      onUpdate?.(updatedTask)
    } catch (error) {
      toast.error('Failed to update task')
    } finally {
      setIsCompleting(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.delete(task.id)
        toast.success('Task deleted')
        onDelete?.(task.id)
      } catch (error) {
        toast.error('Failed to delete task')
      }
    }
  }

  const formatDueDate = (dueDate) => {
    if (!dueDate) return null
    
    const date = new Date(dueDate)
    if (isToday(date)) return 'Today'
    if (isTomorrow(date)) return 'Tomorrow'
    return format(date, 'MMM d')
  }

  const getDueDateStatus = (dueDate) => {
    if (!dueDate) return null
    
    const date = new Date(dueDate)
    if (isPast(date) && !task.completed) return 'overdue'
    if (isToday(date)) return 'today'
    return 'upcoming'
  }

  const dueDateStatus = getDueDateStatus(task.dueDate)
  const formattedDueDate = formatDueDate(task.dueDate)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className={`relative bg-white rounded-xl p-4 shadow-sm border transition-all duration-200 hover:shadow-md
        ${task.completed ? 'opacity-75 bg-gray-50' : ''}
      `}
    >
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 confetti ${
                i % 3 === 0 ? 'bg-primary' : i % 3 === 1 ? 'bg-accent' : 'bg-secondary'
              }`}
              style={{
                left: `${20 + i * 10}%`,
                top: '50%',
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>
      )}

      <div className="flex items-start space-x-3">
        {/* Checkbox */}
        <div className="flex-shrink-0 mt-0.5">
          <Checkbox
            checked={task.completed}
            onChange={handleToggleComplete}
            disabled={isCompleting}
            size="md"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className={`font-medium text-gray-900 break-words ${
                task.completed ? 'line-through text-gray-500' : ''
              }`}>
                {task.title}
              </h3>
              
              {task.description && (
                <p className={`mt-1 text-sm text-gray-600 break-words ${
                  task.completed ? 'line-through' : ''
                }`}>
                  {task.description}
                </p>
              )}

              {/* Meta Information */}
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                {/* Priority Badge */}
                <Badge priority={task.priority} size="xs">
                  {task.priority}
                </Badge>

                {/* Category Badge */}
                {category && (
                  <Badge 
                    size="xs"
                    className="text-white"
                    style={{ backgroundColor: category.color }}
                  >
                    {category.name}
                  </Badge>
                )}

                {/* Due Date */}
                {formattedDueDate && (
                  <div className={`flex items-center text-xs ${
                    dueDateStatus === 'overdue' ? 'text-error' :
                    dueDateStatus === 'today' ? 'text-warning' :
                    'text-gray-500'
                  }`}>
                    <ApperIcon name="Calendar" className="w-3 h-3 mr-1" />
                    {formattedDueDate}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleDelete}
                className="p-1 text-gray-400 hover:text-error rounded transition-colors"
              >
                <ApperIcon name="Trash2" className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default TaskCard