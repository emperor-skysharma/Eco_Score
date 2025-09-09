import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  changePassword: (currentPassword, newPassword) => 
    api.put('/auth/change-password', { currentPassword, newPassword })
}

// Modules API
export const modulesAPI = {
  getAll: (params) => api.get('/modules', { params }),
  getById: (id) => api.get(`/modules/${id}`),
  getCategories: () => api.get('/modules/categories/list'),
  getDifficulties: () => api.get('/modules/difficulties/list')
}

// Challenges API
export const challengesAPI = {
  getAll: (params) => api.get('/challenges', { params }),
  getById: (id) => api.get(`/challenges/${id}`),
  getCategories: () => api.get('/challenges/categories/list'),
  getTypes: () => api.get('/challenges/types/list'),
  getUserSubmissions: (id, params) => api.get(`/challenges/${id}/submissions`, { params })
}

// Submissions API
export const submissionsAPI = {
  create: (formData) => api.post('/submissions', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getMySubmissions: (params) => api.get('/submissions/my-submissions', { params }),
  getAll: (params) => api.get('/submissions', { params }),
  getById: (id) => api.get(`/submissions/${id}`),
  updateStatus: (id, status, feedback, points) => 
    api.put(`/submissions/${id}/status`, { status, feedback, points })
}

// Portfolio API
export const portfolioAPI = {
  generatePDF: (userId) => api.post('/portfolio/generate', { userId }, {
    responseType: 'blob'
  })
}

export default api