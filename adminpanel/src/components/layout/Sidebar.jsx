import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import {
  HomeIcon,
  ShoppingBagIcon,
  TagIcon,
  CubeIcon,
  ShoppingCartIcon,
  UsersIcon,
  CreditCardIcon,
  StarIcon,
  ChartBarIcon,
  DocumentTextIcon,
  BellIcon,
  CogIcon,
  UserIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Products', href: '/products', icon: ShoppingBagIcon },
  { name: 'Categories', href: '/categories', icon: TagIcon },
  { name: 'Inventory', href: '/inventory', icon: CubeIcon },
  { name: 'Orders', href: '/orders', icon: ShoppingCartIcon },
  { name: 'Customers', href: '/customers', icon: UsersIcon },
  { name: 'Payments', href: '/payments', icon: CreditCardIcon },
  { name: 'Reviews', href: '/reviews', icon: StarIcon },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
  { name: 'Reports', href: '/reports', icon: DocumentTextIcon },
  { name: 'Notifications', href: '/notifications', icon: BellIcon },
  { name: 'Settings', href: '/settings', icon: CogIcon },
  { name: 'Profile', href: '/profile', icon: UserIcon },
]

export default function Sidebar() {
  const { sidebarCollapsed, setSidebarCollapsed } = useTheme()
  const location = useLocation()

  return (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Logo and Toggle */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
        <AnimatePresence mode="wait">
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center space-x-2 overflow-hidden"
            >
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg">Z</span>
              </div>
              <span className="text-xl font-bold text-gray-900 whitespace-nowrap">Zembile</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
        >
          {sidebarCollapsed ? (
            <ChevronRightIcon className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href || 
                          (item.href === '/dashboard' && location.pathname === '/')
          
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive: linkActive }) => {
                const active = isActive || linkActive
                return `
                  group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
                  ${active 
                    ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }
                `
              }}
            >
              <item.icon 
                className={`
                  flex-shrink-0 w-5 h-5 transition-colors
                  ${location.pathname === item.href || (item.href === '/dashboard' && location.pathname === '/')
                    ? 'text-primary-600' 
                    : 'text-gray-400 group-hover:text-gray-600'
                  }
                `} 
              />
              <AnimatePresence mode="wait">
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.3 }}
                    className="ml-3 whitespace-nowrap overflow-hidden"
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          )
        })}
      </nav>

      {/* Footer - Fixed at bottom */}
      <div className="flex-shrink-0 border-t border-gray-200">
        <AnimatePresence mode="wait">
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="p-4 overflow-hidden"
            >
              <div className="text-xs text-gray-500 text-center">
                <p className="whitespace-nowrap">Zembile Admin Panel</p>
                <p className="mt-1 whitespace-nowrap">v1.0.0</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Collapsed state version indicator */}
        {sidebarCollapsed && (
          <div className="p-4 flex justify-center">
            <div className="w-2 h-2 bg-primary-500 rounded-full" title="v1.0.0"></div>
          </div>
        )}
      </div>
    </div>
  )
}