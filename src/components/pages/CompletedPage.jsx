import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import TaskList from '@/components/organisms/TaskList'
import StatsCard from '@/components/molecules/StatsCard'
import Button from '@/components/atoms/Button'
import { taskService } from '@/services'

const CompletedPage = () => {
  const [completedTasks, setCompletedTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    totalCompleted: 0,
    completedToday: 0,
    completedThisWeek: 0,
    completionRate: 0
  })

  useEffect(() => {
    loadCompletedTasks()
  }, [])

  const loadCompletedTasks = async () => {
    setLoading(true)
    setError(null)
    try {
      const tasks = await taskService.getCompleted()
      setCompletedTasks(tasks)
      calculateStats(tasks)
    } catch (err) {
      setError(err.message || 'Failed to load completed tasks')
      toast.error('Failed to load completed tasks')
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (tasks) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

    const completedToday = tasks.filter(task => {
      const taskDate = new Date(task.createdAt)
      return taskDate >= today
    }).length

    const completedThisWeek = tasks.filter(task => {
      const taskDate = new Date(task.createdAt)
      return taskDate >= weekAgo
    }).length

    setStats({
      totalCompleted: tasks.length,
      completedToday,
      completedThisWeek,
      completionRate: 100 // Since these are all completed
    })
  }

  const handleTaskUpdate = (updatedTask) => {
    if (updatedTask.completed) {
      setCompletedTasks(completedTasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      ))
    } else {
      // Task was marked as incomplete, remove from completed list
      setCompletedTasks(completedTasks.filter(task => task.id !== updatedTask.id))
      toast.success('Task moved back to pending')
    }
  }

  const handleTaskDelete = (taskId) => {
    setCompletedTasks(completedTasks.filter(task => task.id !== taskId))
  }

  const handleClearCompleted = async () => {
    if (completedTasks.length === 0) return
    
    const confirmDelete = window.confirm(
      `Are you sure you want to delete all ${completedTasks.length} completed tasks? This action cannot be undone.`
    )

    if (confirmDelete) {
      try {
        const taskIds = completedTasks.map(task => task.id)
        await taskService.bulkDelete(taskIds)
        setCompletedTasks([])
        toast.success('All completed tasks deleted')
      } catch (error) {
        toast.error('Failed to delete completed tasks')
      }
    }
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load completed tasks</h3>
          <p className="text-gray-500 mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadCompletedTasks}
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:brightness-110 transition-all"
          >
            Try Again
          </motion.button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-display mb-2">Completed Tasks</h1>
          <p className="text-gray-600">Review your accomplishments and achievements</p>
        </div>
        
        {completedTasks.length > 0 && (
          <Button
            variant="outline"
            onClick={handleClearCompleted}
            icon="Trash2"
            className="text-error border-error hover:bg-error hover:text-white"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="Total Completed"
          value={stats.totalCompleted}
          icon="CheckCircle"
          color="success"
        />
        <StatsCard
          title="Completed Today"
          value={stats.completedToday}
          icon="Calendar"
          color="primary"
        />
        <StatsCard
          title="This Week"
          value={stats.completedThisWeek}
          icon="TrendingUp"
          color="accent"
        />
        <StatsCard
          title="Streak"
          value="5 days"
          icon="Zap"
          color="warning"
        />
      </div>

      {/* Completed Tasks List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Completed Tasks ({completedTasks.length})
          </h2>
        </div>
        
        {completedTasks.length === 0 && !loading ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-12"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </motion.div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No completed tasks yet</h3>
            <p className="text-gray-500 mb-6">
              Start completing tasks to see them here and track your progress
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:brightness-110 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create a task to get started
            </motion.div>
          </motion.div>
        ) : (
          <TaskList
            tasks={completedTasks}
            loading={loading}
            onTaskUpdate={handleTaskUpdate}
            onTaskDelete={handleTaskDelete}
          />
        )}
      </div>
    </div>
  )
}

export default CompletedPage