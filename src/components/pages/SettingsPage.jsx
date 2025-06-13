import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    theme: 'light',
    defaultPriority: 'medium',
    defaultCategory: '',
    notifications: true,
    autoComplete: false,
    sortBy: 'dueDate',
    language: 'en'
  })
  
  const [isLoading, setIsLoading] = useState(false)

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSaveSettings = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In a real app, this would save to backend or localStorage
      localStorage.setItem('taskflow-settings', JSON.stringify(settings))
      
      toast.success('Settings saved successfully!')
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetSettings = () => {
    const confirmReset = window.confirm('Are you sure you want to reset all settings to default?')
    if (confirmReset) {
      setSettings({
        theme: 'light',
        defaultPriority: 'medium',
        defaultCategory: '',
        notifications: true,
        autoComplete: false,
        sortBy: 'dueDate',
        language: 'en'
      })
      toast.success('Settings reset to default')
    }
  }

  const themeOptions = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System' }
  ]

  const priorityOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' }
  ]

  const sortOptions = [
    { value: 'dueDate', label: 'Due Date' },
    { value: 'priority', label: 'Priority' },
    { value: 'created', label: 'Date Created' },
    { value: 'title', label: 'Title' }
  ]

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' }
  ]

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-display mb-2">Settings</h1>
        <p className="text-gray-600">Customize your TaskFlow experience</p>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appearance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border"
        >
          <div className="flex items-center mb-4">
            <div className="p-2 bg-primary/10 rounded-lg mr-3">
              <ApperIcon name="Palette" className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Appearance</h3>
          </div>
          
          <div className="space-y-4">
            <Select
              label="Theme"
              value={settings.theme}
              onChange={(e) => handleSettingChange('theme', e.target.value)}
              options={themeOptions}
            />
            
            <Select
              label="Language"
              value={settings.language}
              onChange={(e) => handleSettingChange('language', e.target.value)}
              options={languageOptions}
            />
          </div>
        </motion.div>

        {/* Task Defaults */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border"
        >
          <div className="flex items-center mb-4">
            <div className="p-2 bg-secondary/10 rounded-lg mr-3">
              <ApperIcon name="Settings" className="w-5 h-5 text-secondary" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Task Defaults</h3>
          </div>
          
          <div className="space-y-4">
            <Select
              label="Default Priority"
              value={settings.defaultPriority}
              onChange={(e) => handleSettingChange('defaultPriority', e.target.value)}
              options={priorityOptions}
            />
            
            <Select
              label="Default Sort Order"
              value={settings.sortBy}
              onChange={(e) => handleSettingChange('sortBy', e.target.value)}
              options={sortOptions}
            />
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm border"
        >
          <div className="flex items-center mb-4">
            <div className="p-2 bg-accent/10 rounded-lg mr-3">
              <ApperIcon name="Bell" className="w-5 h-5 text-accent" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          </div>
          
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Enable notifications</span>
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
            </label>
            
            <label className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Auto-complete overdue tasks</span>
              <input
                type="checkbox"
                checked={settings.autoComplete}
                onChange={(e) => handleSettingChange('autoComplete', e.target.checked)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
            </label>
          </div>
        </motion.div>

        {/* Data Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm border"
        >
          <div className="flex items-center mb-4">
            <div className="p-2 bg-warning/10 rounded-lg mr-3">
              <ApperIcon name="Database" className="w-5 h-5 text-warning" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Data Management</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Export Data</p>
                <p className="text-xs text-gray-500">Download all your tasks and categories</p>
              </div>
              <Button variant="outline" size="sm" icon="Download">
                Export
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Import Data</p>
                <p className="text-xs text-gray-500">Import tasks from a file</p>
              </div>
              <Button variant="outline" size="sm" icon="Upload">
                Import
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex items-center justify-between pt-6 border-t border-gray-200"
      >
        <Button
          variant="outline"
          onClick={handleResetSettings}
          icon="RotateCcw"
        >
          Reset to Default
        </Button>
        
        <Button
          onClick={handleSaveSettings}
          loading={isLoading}
          icon="Save"
        >
          Save Changes
        </Button>
      </motion.div>

      {/* About Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-surface rounded-xl p-6 text-center"
      >
        <h4 className="text-lg font-semibold text-gray-900 mb-2">About TaskFlow</h4>
        <p className="text-gray-600 mb-4">
          A streamlined task management application designed to help you stay organized and productive.
        </p>
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
          <span>Version 1.0.0</span>
          <span>•</span>
          <span>Built with React</span>
          <span>•</span>
          <span>© 2024 TaskFlow</span>
        </div>
      </motion.div>
    </div>
  )
}

export default SettingsPage