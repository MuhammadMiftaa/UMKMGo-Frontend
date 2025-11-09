"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import { useAuth } from "./AuthContext"

// ============================================
// TYPES
// ============================================

export interface User {
  id: number
  name: string
  email: string
  role_name: string
  last_login_at: string
  created_at: string
  updated_at: string
  is_active: boolean
}

export interface CreateUserData {
  name: string
  email: string
  password: string
  confirm_password: string
  role_id: number
}

export interface UpdateUserData {
  name: string
  email: string
  password: string
  confirm_password: string
  role_id: number
}

export interface Permission {
  id: number
  name: string
  code: string
  description: string
}

export interface RolePermission {
  role_id: number
  role_name: string
  permissions: string[] // Array of permission codes
}

export interface UpdateRolePermissionsData {
  role_id: number
  permissions: string[] // Array of permission codes
}

interface ApiResponse<T> {
  statusCode: number
  status: boolean
  message: string
  data: T
}

interface UsersManagementContextType {
  // Users State
  users: User[]
  currentUser: User | null
  isLoading: boolean
  error: string | null
  
  // Permissions & Roles State
  permissions: Permission[]
  rolePermissions: RolePermission[]
  
  // Users Operations
  getAllUsers: () => Promise<void>
  getUserById: (id: number) => Promise<void>
  createUser: (data: CreateUserData) => Promise<{ success: boolean; message?: string }>
  updateUser: (id: number, data: UpdateUserData) => Promise<{ success: boolean; message?: string }>
  deleteUser: (id: number) => Promise<{ success: boolean; message?: string }>
  
  // Permissions & Roles Operations
  getListPermissions: () => Promise<void>
  getListRolePermissions: () => Promise<void>
  updateRolePermissions: (data: UpdateRolePermissionsData) => Promise<{ success: boolean; message?: string }>
  
  // Utility
  clearError: () => void
  clearCurrentUser: () => void
}

// ============================================
// API UTILITIES
// ============================================

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/v1"

async function apiCall<T>(
  endpoint: string,
  token: string | null,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
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

const UsersManagementContext = createContext<UsersManagementContextType | undefined>(undefined)

export function UsersManagementProvider({ children }: { children: React.ReactNode }) {
  const { token } = useAuth()
  
  // Users State
  const [users, setUsers] = useState<User[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  
  // Permissions & Roles State
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([])
  
  // Common State
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ============================================
  // USERS OPERATIONS
  // ============================================

  // Get all users
  const getAllUsers = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await apiCall<User[]>('/users', token, {
        method: 'GET',
      })

      setUsers(response.data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch users'
      setError(errorMessage)
      console.error('Get all users error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Get user by ID
  const getUserById = async (id: number) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await apiCall<User>(`/users/${id}`, token, {
        method: 'GET',
      })

      setCurrentUser(response.data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user'
      setError(errorMessage)
      console.error('Get user by ID error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Create user
  const createUser = async (data: CreateUserData): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsLoading(true)
      setError(null)

      // Validate passwords match
      if (data.password !== data.confirm_password) {
        throw new Error('Passwords do not match')
      }

      const response = await apiCall<User>('/webauth/register', token, {
        method: 'POST',
        body: JSON.stringify(data),
      })

      // Refresh users list
      await getAllUsers()

      return {
        success: true,
        message: response.message || 'User created successfully',
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create user'
      setError(errorMessage)
      return {
        success: false,
        message: errorMessage,
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Update user
  const updateUser = async (id: number, data: UpdateUserData): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsLoading(true)
      setError(null)

      // Validate passwords match
      if (data.password !== data.confirm_password) {
        throw new Error('Passwords do not match')
      }

      const response = await apiCall<User>(`/users/${id}`, token, {
        method: 'PUT',
        body: JSON.stringify(data),
      })

      // Refresh users list
      await getAllUsers()

      return {
        success: true,
        message: response.message || 'User updated successfully',
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update user'
      setError(errorMessage)
      return {
        success: false,
        message: errorMessage,
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Delete user
  const deleteUser = async (id: number): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await apiCall<User>(`/users/${id}`, token, {
        method: 'DELETE',
      })

      // Remove from local state
      setUsers(prev => prev.filter(u => u.id !== id))

      return {
        success: true,
        message: response.message || 'User deleted successfully',
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete user'
      setError(errorMessage)
      return {
        success: false,
        message: errorMessage,
      }
    } finally {
      setIsLoading(false)
    }
  }

  // ============================================
  // PERMISSIONS & ROLES OPERATIONS
  // ============================================

  // Get list of permissions
  const getListPermissions = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await apiCall<Permission[]>('/permissions', token, {
        method: 'GET',
      })

      setPermissions(response.data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch permissions'
      setError(errorMessage)
      console.error('Get permissions error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Get list of role permissions
  const getListRolePermissions = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await apiCall<RolePermission[]>('/role-permissions', token, {
        method: 'GET',
      })

      setRolePermissions(response.data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch role permissions'
      setError(errorMessage)
      console.error('Get role permissions error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Update role permissions
  const updateRolePermissions = async (data: UpdateRolePermissionsData): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await apiCall<void>('/role-permissions', token, {
        method: 'POST',
        body: JSON.stringify(data),
      })

      // Refresh role permissions list
      await getListRolePermissions()

      return {
        success: true,
        message: response.message || 'Role permissions updated successfully',
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update role permissions'
      setError(errorMessage)
      return {
        success: false,
        message: errorMessage,
      }
    } finally {
      setIsLoading(false)
    }
  }

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================

  const clearError = () => setError(null)
  const clearCurrentUser = () => setCurrentUser(null)

  return (
    <UsersManagementContext.Provider
      value={{
        // Users State
        users,
        currentUser,
        isLoading,
        error,
        
        // Permissions & Roles State
        permissions,
        rolePermissions,
        
        // Users Operations
        getAllUsers,
        getUserById,
        createUser,
        updateUser,
        deleteUser,
        
        // Permissions & Roles Operations
        getListPermissions,
        getListRolePermissions,
        updateRolePermissions,
        
        // Utility
        clearError,
        clearCurrentUser,
      }}
    >
      {children}
    </UsersManagementContext.Provider>
  )
}

// ============================================
// CUSTOM HOOK
// ============================================

export function useUsersManagement() {
  const context = useContext(UsersManagementContext)
  if (context === undefined) {
    throw new Error("useUsersManagement must be used within a UsersManagementProvider")
  }
  return context
}