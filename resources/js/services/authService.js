import api from './api'

export const authService = {
  // Login
  login: async (email, password) => {
    return api.post('/auth/login', { email, password })
  },

  // Logout
  logout: async () => {
    return api.post('/auth/logout')
  },

  // Get current user
  getCurrentUser: async () => {
    return api.get('/auth/me')
  },

  // Refresh token
  refreshToken: async () => {
    // Sanctum doesn't require token refresh, but keeping for compatibility
    return Promise.resolve({ data: { token: localStorage.getItem('auth_token') } })
  }
}

