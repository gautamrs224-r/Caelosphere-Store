import { createContext, useContext, useState, useEffect } from 'react'
import * as authService from '../services/authService'

const AuthContext = createContext(null)

const TOKEN_KEY = 'caelosphere_token'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // On mount, if a token exists, verify it against the backend and load the user.
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) {
      setLoading(false)
      return
    }

    authService
      .getMe()
      .then((data) => setUser(data.user))
      .catch(() => {
        // Token expired/invalid — clear it silently.
        localStorage.removeItem(TOKEN_KEY)
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = async ({ email, password }) => {
    setError(null)
    try {
      const data = await authService.login({ email, password })
      localStorage.setItem(TOKEN_KEY, data.token)
      setUser(data.user)
      return data.user
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const register = async ({ firstName, lastName, email, password }) => {
    setError(null)
    try {
      const name = `${firstName} ${lastName}`.trim()
      const data = await authService.register({ name, email, password })
      localStorage.setItem(TOKEN_KEY, data.token)
      setUser(data.user)
      return data.user
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch {
      // Even if the server call fails, still clear local state.
    }
    localStorage.removeItem(TOKEN_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
