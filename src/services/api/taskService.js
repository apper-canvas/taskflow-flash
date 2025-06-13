import { format } from 'date-fns'
import tasksData from '../mockData/tasks.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class TaskService {
  constructor() {
    this.tasks = [...tasksData]
  }

  async getAll() {
    await delay(300)
    return [...this.tasks]
  }

  async getById(id) {
    await delay(200)
    const task = this.tasks.find(t => t.id === id)
    return task ? { ...task } : null
  }

  async getByCategory(categoryId) {
    await delay(250)
    return this.tasks.filter(t => t.categoryId === categoryId).map(t => ({ ...t }))
  }

  async getPending() {
    await delay(250)
    return this.tasks.filter(t => !t.completed).map(t => ({ ...t }))
  }

  async getCompleted() {
    await delay(250)
    return this.tasks.filter(t => t.completed).map(t => ({ ...t }))
  }

  async create(taskData) {
    await delay(400)
    const newTask = {
      id: Date.now().toString(),
      title: taskData.title,
      description: taskData.description || '',
      categoryId: taskData.categoryId,
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate,
      completed: false,
      createdAt: new Date().toISOString()
    }
    this.tasks.push(newTask)
    return { ...newTask }
  }

  async update(id, updates) {
    await delay(300)
    const index = this.tasks.findIndex(t => t.id === id)
    if (index === -1) {
      throw new Error('Task not found')
    }
    
    this.tasks[index] = { ...this.tasks[index], ...updates }
    return { ...this.tasks[index] }
  }

  async toggleComplete(id) {
    await delay(200)
    const index = this.tasks.findIndex(t => t.id === id)
    if (index === -1) {
      throw new Error('Task not found')
    }
    
    this.tasks[index].completed = !this.tasks[index].completed
    return { ...this.tasks[index] }
  }

  async delete(id) {
    await delay(250)
    const index = this.tasks.findIndex(t => t.id === id)
    if (index === -1) {
      throw new Error('Task not found')
    }
    
    this.tasks.splice(index, 1)
    return true
  }

  async bulkDelete(ids) {
    await delay(400)
    this.tasks = this.tasks.filter(t => !ids.includes(t.id))
    return true
  }

  async search(query) {
    await delay(300)
    const searchTerm = query.toLowerCase()
    return this.tasks
      .filter(task => 
        task.title.toLowerCase().includes(searchTerm) ||
        task.description.toLowerCase().includes(searchTerm)
      )
      .map(t => ({ ...t }))
  }

  async getStats() {
    await delay(200)
    const total = this.tasks.length
    const completed = this.tasks.filter(t => t.completed).length
    const pending = total - completed
    const overdue = this.tasks.filter(t => 
      !t.completed && t.dueDate && new Date(t.dueDate) < new Date()
    ).length
    
    return {
      total,
      completed,
      pending,
      overdue,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    }
  }
}

export default new TaskService()