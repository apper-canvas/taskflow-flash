import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import QuickAddTask from '@/components/molecules/QuickAddTask'
import TaskList from '@/components/organisms/TaskList'
import FilterBar from '@/components/molecules/FilterBar'
import StatsCard from '@/components/molecules/StatsCard'
import { taskService, categoryService } from '@/services'

const TasksPage = () => {
  const [tasks, setTasks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    overdue: 0
  })
  const [filters, setFilters] = useState({
    status: 'all',
    priority: '',
    sortBy: 'dueDate',
    sortOrder: 'asc'
  })

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    loadStats()
  }, [tasks])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ])
      setTasks(tasksData)
      setCategories(categoriesData)
    } catch (err) {
      setError(err.message || 'Failed to load data')
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const taskStats = await taskService.getStats()
      setStats(taskStats)
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }

  const handleTaskAdded = (newTask) => {
    setTasks([newTask, ...tasks])
  }

  const handleTaskUpdate = (updatedTask) => {
    setTasks(tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ))
  }

  const handleTaskDelete = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId))
  }

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters)
  }

  const handleClearFilters = () => {
    setFilters({
      status: 'all',
      priority: '',
      sortBy: 'dueDate',
      sortOrder: 'asc'
    })
  }

  const getFilteredTasks = () => {
    let filtered = [...tasks]

    // Filter by status
    if (filters.status === 'pending') {
      filtered = filtered.filter(task => !task.completed)
    } else if (filters.status === 'completed') {
      filtered = filtered.filter(task => task.completed)
    } else if (filters.status === 'overdue') {
      filtered = filtered.filter(task => 
        !task.completed && task.dueDate && new Date(task.dueDate) < new Date()
      )
    }

    // Filter by priority
    if (filters.priority) {
      filtered = filtered.filter(task => task.priority === filters.priority)
    }

    // Sort tasks
    filtered.sort((a, b) => {
      let comparison = 0
      
      switch (filters.sortBy) {
        case 'dueDate':
          const dateA = a.dueDate ? new Date(a.dueDate) : new Date('2999-12-31')
          const dateB = b.dueDate ? new Date(b.dueDate) : new Date('2999-12-31')
          comparison = dateA - dateB
          break
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          comparison = priorityOrder[b.priority] - priorityOrder[a.priority]
          break
        case 'created':
          comparison = new Date(a.createdAt) - new Date(b.createdAt)
          break
        case 'title':
          comparison = a.title.localeCompare(b.title)
          break
        default:
          break
      }

      return filters.sortOrder === 'desc' ? -comparison : comparison
    })

    return filtered
  }

  const filteredTasks = getFilteredTasks()
  const pendingTasks = filteredTasks.filter(task => !task.completed)

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load tasks</h3>
          <p className="text-gray-500 mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadData}
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-display mb-2">My Tasks</h1>
        <p className="text-gray-600">Manage and track your daily tasks</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="Total Tasks"
          value={stats.total}
          icon="CheckSquare"
          color="primary"
        />
        <StatsCard
          title="Pending"
          value={stats.pending}
          icon="Clock"
          color="warning"
        />
        <StatsCard
          title="Completed"
          value={stats.completed}
          icon="CheckCircle"
          color="success"
        />
        <StatsCard
          title="Progress"
          value={`${stats.completionRate}%`}
          icon="TrendingUp"
          color="accent"
          showProgress
          percentage={stats.completionRate}
        />
      </div>

      {/* Quick Add Task */}
      <QuickAddTask
        categories={categories}
        onTaskAdded={handleTaskAdded}
      />

      {/* Filters */}
      <FilterBar
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
      />

      {/* Task List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {filters.status === 'pending' ? 'Pending Tasks' :
             filters.status === 'completed' ? 'Completed Tasks' :
             filters.status === 'overdue' ? 'Overdue Tasks' :
             'All Tasks'} ({filteredTasks.length})
          </h2>
        </div>
        
        <TaskList
          tasks={filteredTasks}
          loading={loading}
          onTaskUpdate={handleTaskUpdate}
          onTaskDelete={handleTaskDelete}
        />
      </div>
    </div>
  )
}

export default TasksPage