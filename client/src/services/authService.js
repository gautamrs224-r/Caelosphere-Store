import api from './api'

export async function register({ name, email, password }) {
  const { data } = await api.post('/auth/register', { name, email, password })
  return data
}

export async function login({ email, password }) {
  const { data } = await api.post('/auth/login', { email, password })
  return data
}

export async function getMe() {
  const { data } = await api.get('/auth/me')
  return data
}

export async function logout() {
  const { data } = await api.post('/auth/logout')
  return data
}

// Admin-only
export async function getAllUsers() {
  const { data } = await api.get('/auth/users')
  return data.users
}

export async function updateUserRole(userId, role) {
  const { data } = await api.put(`/auth/users/${userId}/role`, { role })
  return data.user
}
