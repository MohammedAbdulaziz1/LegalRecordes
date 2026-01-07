import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })
  const [isAuthenticated, setIsAuthenticated] = useState(!!user)

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
      setIsAuthenticated(true)
    } else {
      localStorage.removeItem('user')
      localStorage.removeItem('auth_token')
      setIsAuthenticated(false)
    }
  }, [user])

  // Check if user is still authenticated on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (token && user) {
      // Verify token is still valid by fetching current user
      authService.getCurrentUser()
        .then(response => {
          setUser(response.data.user)
        })
        .catch(() => {
          // Token invalid, clear everything
          setUser(null)
          localStorage.removeItem('auth_token')
        })
    }
  }, [])

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password)
      const { user: userData, token } = response.data
      
      // Store token and user
      localStorage.setItem('auth_token', token)
      setUser(userData)
      
      return { success: true, user: userData }
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      // Even if logout fails, clear local state
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      localStorage.removeItem('auth_token')
      setIsAuthenticated(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

