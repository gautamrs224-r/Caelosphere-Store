import axios from 'axios'

// Axios instance wired to the Express/MongoDB backend.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('caelosphere_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Normalize error shape so callers can always read err.message.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Something went wrong. Please try again.'
    return Promise.reject(new Error(message))
  }
)

export default api
