import { createContext, useContext, useState, ReactNode } from 'react'
import api from '../api/axios'
import { AuthUser, Role } from '../types'

interface AuthContextType {
  user: AuthUser | null
  login: (email: string, password: string) => Promise<void>
  register: (data: {
    fullName: string
    email: string
    password: string
    role: Role
    companyName?: string
  }) => Promise<void>
  logout: () => void
}

const STORAGE_KEY = 'ai-job-portal-auth'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  })

  const persist = (authUser: AuthUser) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser))
    setUser(authUser)
  }

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password })
    persist(res.data)
  }

  const register = async (data: {
    fullName: string
    email: string
    password: string
    role: Role
    companyName?: string
  }) => {
    const res = await api.post('/auth/register', data)
    persist(res.data)
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}