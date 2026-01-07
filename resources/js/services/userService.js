import api from './api'

export const userService = {
  // Get all users
  getUsers: async (params = {}) => {
    // TODO: Replace with actual API call when backend is ready
    // return api.get('/users', { params })
    return Promise.resolve({
      data: {
        data: [],
        meta: {
          current_page: 1,
          total: 24,
          per_page: 10
        }
      }
    })
  },

  // Get user by ID
  getUser: async (id) => {
    // TODO: Replace with actual API call when backend is ready
    // return api.get(`/users/${id}`)
    return Promise.resolve({ data: { id } })
  },

  // Create user
  createUser: async (data) => {
    // TODO: Replace with actual API call when backend is ready
    // return api.post('/users', data)
    return Promise.resolve({ data: { id: Date.now(), ...data } })
  },

  // Update user
  updateUser: async (id, data) => {
    // TODO: Replace with actual API call when backend is ready
    // return api.put(`/users/${id}`, data)
    return Promise.resolve({ data: { id, ...data } })
  },

  // Delete user
  deleteUser: async (id) => {
    // TODO: Replace with actual API call when backend is ready
    // return api.delete(`/users/${id}`)
    return Promise.resolve({ data: { success: true } })
  },

  // Get user permissions
  getUserPermissions: async (id) => {
    return api.get(`/users/${id}/permissions`)
  },

  // Update user permissions
  updateUserPermissions: async (id, permissions) => {
    return api.put(`/users/${id}/permissions`, { permissions })
  }
}

