import TasksPage from '@/components/pages/TasksPage'
import CompletedPage from '@/components/pages/CompletedPage'
import SettingsPage from '@/components/pages/SettingsPage'

export const routes = {
  tasks: {
    id: 'tasks',
    label: 'Tasks',
    path: '/tasks',
    icon: 'CheckSquare',
    component: TasksPage
  },
  completed: {
    id: 'completed',
    label: 'Completed',
    path: '/completed',
    icon: 'CheckCircle',
    component: CompletedPage
  },
  settings: {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: 'Settings',
    component: SettingsPage
  }
}

export const routeArray = Object.values(routes)