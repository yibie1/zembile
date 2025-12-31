import React, { createContext, useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)
const STORAGE_KEY = 'zembile_auth_v1'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize auth state from localStorage
  useEffect(() => {
    try {
      const storedAuth = localStorage.getItem(STORAGE_KEY)
      if (storedAuth) {
        const { user: storedUser, token: storedToken } = JSON.parse(storedAuth)
        
        // Verify token is still valid
        if (storedToken && storedUser) {
          setUser(storedUser)
          setToken(storedToken)
          
          // Optional: Verify token with backend
          verifyToken(storedToken)
        }
      }
    } catch (error) {
      console.error('Failed to load auth from localStorage:', error)
      localStorage.removeItem(STORAGE_KEY)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Verify token with backend
  const verifyToken = async (authToken) => {
    try {
      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      })

      if (!response.ok) {
        // Token is invalid, logout user
        logout()
      }
    } catch (error) {
      console.error('Token verification failed:', error)
      // Don't logout on network errors, just log the error
    }
  }

  // Save auth data to localStorage
  const saveAuthData = (userData, authToken) => {
    try {
      const authData = {
        user: userData,
        token: authToken,
        timestamp: new Date().toISOString()
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authData))
    } catch (error) {
      console.error('Failed to save auth to localStorage:', error)
    }
  }

  // Login function
  const login = (userData, authToken) => {
    setUser(userData)
    setToken(authToken)
    saveAuthData(userData, authToken)
  }

  // Logout function
  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem(STORAGE_KEY)
    toast.success('Logged out successfully')
  }

  // Update user profile
  const updateUser = (updatedUserData) => {
    const newUserData = { ...user, ...updatedUserData }
    setUser(newUserData)
    saveAuthData(newUserData, token)
  }

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!(user && token)
  }

  // Get user role (if implementing role-based access)
  const getUserRole = () => {
    return user?.role || 'customer'
  }

  // Check if user has specific permission
  const hasPermission = (permission) => {
    if (!user) return false
    
    // Admin has all permissions
    if (user.role === 'admin') return true
    
    // Check user permissions array
    return user.permissions?.includes(permission) || false
  }

  // API request helper with auth token
  const authenticatedFetch = async (url, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(url, {
      ...options,
      headers
    })

    // Handle unauthorized responses
    if (response.status === 401) {
      logout()
      throw new Error('Session expired. Please login again.')
    }

    return response
  }

  const value = {
    // State
    user,
    token,
    isLoading,
    
    // Actions
    login,
    logout,
    updateUser,
    
    // Helpers
    isAuthenticated,
    getUserRole,
    hasPermission,
    authenticatedFetch
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Higher-order component for protected routes
export function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, isLoading } = useAuth()

    if (isLoading) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-zembile-yellow border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      )
    }

    if (!isAuthenticated()) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
            <p className="text-gray-600 mb-6">Please sign in to access this page.</p>
            <a
              href="/auth/login"
              className="bg-zembile-yellow text-zembile-gray px-6 py-3 rounded-full font-semibold hover:bg-yellow-400 transition-colors"
            >
              Sign In
            </a>
          </div>
        </div>
      )
    }

    return <Component {...props} />
  }
}