import { Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from '@/components/organisms/Header'
import CategorySidebar from '@/components/organisms/CategorySidebar'

const Layout = () => {
  const location = useLocation()

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <CategorySidebar />
        
        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  )
}

export default Layout