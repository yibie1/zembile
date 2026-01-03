import { createContext, useContext, useReducer, useEffect } from 'react'

const ThemeContext = createContext()

const initialState = {
  theme: 'light', // 'light' | 'dark'
  sidebarCollapsed: false,
  notifications: true,
  language: 'en',
  currency: 'ETB',
}

function themeReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_THEME':
      return {
        ...state,
        theme: state.theme === 'light' ? 'dark' : 'light',
      }
    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload,
      }
    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        sidebarCollapsed: !state.sidebarCollapsed,
      }
    case 'SET_SIDEBAR':
      return {
        ...state,
        sidebarCollapsed: action.payload,
      }
    case 'TOGGLE_NOTIFICATIONS':
      return {
        ...state,
        notifications: !state.notifications,
      }
    case 'SET_LANGUAGE':
      return {
        ...state,
        language: action.payload,
      }
    case 'SET_CURRENCY':
      return {
        ...state,
        currency: action.payload,
      }
    case 'RESET_SETTINGS':
      return initialState
    default:
      return state
  }
}

export function ThemeProvider({ children }) {
  const [state, dispatch] = useReducer(themeReducer, initialState)

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('admin_settings')
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings)
        Object.entries(settings).forEach(([key, value]) => {
          if (key === 'theme') {
            dispatch({ type: 'SET_THEME', payload: value })
          } else if (key === 'sidebarCollapsed') {
            dispatch({ type: 'SET_SIDEBAR', payload: value })
          } else if (key === 'language') {
            dispatch({ type: 'SET_LANGUAGE', payload: value })
          } else if (key === 'currency') {
            dispatch({ type: 'SET_CURRENCY', payload: value })
          }
        })
      } catch (error) {
        console.error('Error loading settings:', error)
      }
    }
  }, [])

  // Save settings to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('admin_settings', JSON.stringify(state))
  }, [state])

  // Apply theme to document
  useEffect(() => {
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [state.theme])

  const toggleTheme = () => {
    dispatch({ type: 'TOGGLE_THEME' })
  }

  const setTheme = (theme) => {
    dispatch({ type: 'SET_THEME', payload: theme })
  }

  const toggleSidebar = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR' })
  }

  const setSidebar = (collapsed) => {
    dispatch({ type: 'SET_SIDEBAR', payload: collapsed })
  }

  const toggleNotifications = () => {
    dispatch({ type: 'TOGGLE_NOTIFICATIONS' })
  }

  const setLanguage = (language) => {
    dispatch({ type: 'SET_LANGUAGE', payload: language })
  }

  const setCurrency = (currency) => {
    dispatch({ type: 'SET_CURRENCY', payload: currency })
  }

  const resetSettings = () => {
    dispatch({ type: 'RESET_SETTINGS' })
  }

  const value = {
    ...state,
    darkMode: state.theme === 'dark',
    sidebarCollapsed: state.sidebarCollapsed,
    setSidebarCollapsed: setSidebar,
    setDarkMode: (isDark) => setTheme(isDark ? 'dark' : 'light'),
    toggleTheme,
    setTheme,
    toggleSidebar,
    setSidebar,
    toggleNotifications,
    setLanguage,
    setCurrency,
    resetSettings,
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export default ThemeContext