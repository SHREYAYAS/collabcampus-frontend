import axios from 'axios'

// Create a central axios instance
const baseURL = import.meta.env.VITE_API_URL || '/api'

const client = axios.create({
  baseURL,
})

// Attach token on each request
client.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 globally
client.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status
    if (status === 401) {
      // Clear token and bounce to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        // Avoid infinite loops: only redirect if not already on /login
        const isOnLogin = window.location.pathname.startsWith('/login')
        if (!isOnLogin) {
          window.location.assign('/login')
        }
      }
    }
    return Promise.reject(error)
  }
)

export default client

// Helpers for auth token and current user caching
export function getToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('token')
}

export function setToken(token) {
  if (typeof window === 'undefined') return
  if (token) localStorage.setItem('token', token)
  else localStorage.removeItem('token')
}

// Fetch current user and cache in localStorage for quick access
export async function fetchCurrentUser(force = false) {
  if (typeof window === 'undefined') return null
  if (!force) {
    try {
      const raw = localStorage.getItem('auth_user')
      if (raw) return JSON.parse(raw)
    } catch {
      // If cache is corrupt, clear and proceed to fetch fresh user
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_user')
      }
    }
  }
  try {
    const { data } = await client.get('/auth/me')
    const user = data?.user || data
    localStorage.setItem('auth_user', JSON.stringify(user))
    return user
  } catch {
    return null
  }
}
