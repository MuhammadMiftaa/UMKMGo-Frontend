"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { API_BASE_URL } from "../lib/const"

// ============================================
// TYPES
// ============================================

export type UserRole = "superadmin" | "admin_screening" | "admin_vendor" | "pelaku_usaha"

export interface User {
  id: number
  name: string
  email: string
  role: number
  role_name: string
  permissions: string[]
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<boolean>
  register: (data: RegisterData) => Promise<{ success: boolean; message?: string }>
  logout: () => void
  isLoading: boolean
}

interface RegisterData {
  name: string
  email: string
  password: string
  confirm_password: string
  role_id: number
}

interface LoginResponse {
  statusCode: number
  status: boolean
  message: string
  data: string // JWT token
}

interface RegisterResponse {
  statusCode: number
  status: boolean
  message: string
  data: {
    id: number
    name: string
    email: string
  }
}

interface ErrorResponse {
  statusCode: number
  status: boolean
  message: string
}

// ============================================
// API UTILITIES
// ============================================

// Helper function to parse JWT token
function parseJwt(token: string): User | null {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Error parsing JWT:', error)
    return null
  }
}

// API call wrapper with error handling
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  const data = await response.json()

  if (!response.ok || !data.status) {
    throw new Error(data.message || 'Something went wrong')
  }

  return data
}

// ============================================
// CONTEXT
// ============================================

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize - check for existing session
  useEffect(() => {
    const initAuth = () => {
      try {
        const savedToken = localStorage.getItem("token")
        const savedUser = localStorage.getItem("user")

        if (savedToken && savedUser) {
          setToken(savedToken)
          setUser(JSON.parse(savedUser))
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        // Clear corrupted data
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)

      const response = await apiCall<LoginResponse>('/webauth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })

      if (response.status && response.data) {
        const jwtToken = response.data
        
        // Parse JWT to get user data
        const userData = parseJwt(jwtToken)
        
        if (userData) {
          // Save to state
          setToken(jwtToken)
          setUser(userData)

          // Persist to localStorage
          localStorage.setItem("token", jwtToken)
          localStorage.setItem("user", JSON.stringify(userData))
          localStorage.setItem("permissions", JSON.stringify(userData.permissions))

          return true
        }
      }

      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: RegisterData): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsLoading(true)

      const response = await apiCall<RegisterResponse>('/webauth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      })

      if (response.status) {
        return {
          success: true,
          message: response.message || 'Registration successful',
        }
      }

      return {
        success: false,
        message: response.message || 'Registration failed',
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed'
      return {
        success: false,
        message: errorMessage,
      }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

// ============================================
// CUSTOM HOOK
// ============================================

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
