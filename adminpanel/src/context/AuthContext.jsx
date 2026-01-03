import { createContext, useContext, useReducer, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie'
import { authService } from '../services/authService'

const AuthContext = createContext()

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
}

function authReducer(state, action) {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      }
    case 'AUTH_ERROR':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      }
    case 'LOGOUT':
      return {
        ...initialState,
        isLoading: false,
      }
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      }
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      }
    default:
      return state
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)
  const navigate = useNavigate()

  // Check for existing token on mount
  useEffect(() => {
    const token = Cookies.get('admin_token')
    const userData = Cookies.get('admin_user')

    if (token && userData) {
      try {
        const user = JSON.parse(userData)
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user, token },
        })
      } catch (error) {
        console.error('Error parsing user data:', error)
        logout()
      }
    } else {
      dispatch({ type: 'AUTH_ERROR', payload: null })
    }
  }, [])

  const login = async (credentials) => {
    try {
      dispatch({ type: 'AUTH_START' })
      
      const response = await authService.login(credentials)
      
      // The API returns { message, user, token } directly
      if (response.user && response.token) {
        const { user, token } = response
        
        // Check if user is admin
        if (user.role !== 'admin') {
          throw new Error('Access denied. Admin privileges required.')
        }

        // Store in cookies
        Cookies.set('admin_token', token, { expires: 7 })
        Cookies.set('admin_user', JSON.stringify(user), { expires: 7 })

        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user, token },
        })

        toast.success(`Welcome back, ${user.firstName || user.name || 'Admin'}!`)
        navigate('/')
      } else {
        throw new Error(response.message || 'Login failed')
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed'
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage })
      toast.error(errorMessage)
      throw error
    }
  }

  const logout = () => {
    // Remove cookies
    Cookies.remove('admin_token')
    Cookies.remove('admin_user')

    dispatch({ type: 'LOGOUT' })
    toast.success('Logged out successfully')
    navigate('/auth/login')
  }

  const updateUser = (userData) => {
    dispatch({ type: 'UPDATE_USER', payload: userData })
    
    // Update cookie
    const updatedUser = { ...state.user, ...userData }
    Cookies.set('admin_user', JSON.stringify(updatedUser), { expires: 7 })
  }

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  const value = {
    ...state,
    login,
    logout,
    updateUser,
    clearError,
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

export default AuthContext