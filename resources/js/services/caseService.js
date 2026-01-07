import api from './api'

export const caseService = {
  // Primary Cases
  getPrimaryCases: async (params = {}) => {
    return api.get('/cases/primary', { params })
  },

  getPrimaryCase: async (id) => {
    return api.get(`/cases/primary/${id}`)
  },

  createPrimaryCase: async (data) => {
    return api.post('/cases/primary', data)
  },

  updatePrimaryCase: async (id, data) => {
    return api.put(`/cases/primary/${id}`, data)
  },

  deletePrimaryCase: async (id) => {
    return api.delete(`/cases/primary/${id}`)
  },

  // Appeal Cases
  getAppealCases: async (params = {}) => {
    return api.get('/cases/appeal', { params })
  },

  getAppealCase: async (id) => {
    return api.get(`/cases/appeal/${id}`)
  },

  createAppealCase: async (data) => {
    return api.post('/cases/appeal', data)
  },

  updateAppealCase: async (id, data) => {
    return api.put(`/cases/appeal/${id}`, data)
  },

  deleteAppealCase: async (id) => {
    return api.delete(`/cases/appeal/${id}`)
  },

  // Supreme Court Cases
  getSupremeCourtCases: async (params = {}) => {
    return api.get('/cases/supreme', { params })
  },

  getSupremeCourtCase: async (id) => {
    return api.get(`/cases/supreme/${id}`)
  },

  createSupremeCourtCase: async (data) => {
    return api.post('/cases/supreme', data)
  },

  updateSupremeCourtCase: async (id, data) => {
    return api.put(`/cases/supreme/${id}`, data)
  },

  deleteSupremeCourtCase: async (id) => {
    return api.delete(`/cases/supreme/${id}`)
  },

  // Dashboard Statistics
  getDashboardStatistics: async () => {
    return api.get('/dashboard/statistics')
  }
}

