"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export type UserRole = "superadmin" | "admin_kementrian"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication
    if (email === "superadmin@umkm.go.id" && password === "admin123") {
      const userData = {
        id: "1",
        name: "Super Administrator",
        email: "superadmin@umkm.go.id",
        role: "superadmin" as UserRole,
      }
      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))
      return true
    } else if (email === "admin@umkm.go.id" && password === "admin123") {
      const userData = {
        id: "2",
        name: "Admin Kementrian",
        email: "admin@umkm.go.id",
        role: "admin_kementrian" as UserRole,
      }
      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
