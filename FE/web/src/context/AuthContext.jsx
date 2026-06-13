import { useCallback, useEffect, useMemo, useState } from 'react'
import { authApi } from '../api/authApi'
import { AuthContext } from './authContextObject'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem('token')))

  const saveSession = useCallback(({ user, token }) => {
    localStorage.setItem('token', token)
    setUser(user)
  }, [])

  const saveUser = useCallback((user) => {
    setUser(user)
  }, [])

  const register = useCallback(async (data) => {
    const res = await authApi.register(data)
    saveSession(res.data)
  }, [saveSession])

  const login = useCallback(async (data) => {
    const res = await authApi.login(data)
    saveSession(res.data)
  }, [saveSession])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setUser(null)
  }, [])

  const updateProfile = useCallback(async (data) => {
    const res = await authApi.updateMe(data)
    saveUser(res.data.user)
    return res.data
  }, [saveUser])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }

    setLoading(true)
    authApi
      .me()
      .then((res) => {
        saveUser(res.data.user)
      })
      .catch(logout)
      .finally(() => setLoading(false))
  }, [logout, saveUser])

  const value = useMemo(
    () => ({ user, loading, register, login, logout, updateProfile }),
    [user, loading, register, login, logout, updateProfile],
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
