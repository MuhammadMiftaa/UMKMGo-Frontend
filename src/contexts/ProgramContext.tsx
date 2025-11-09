"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import { useAuth } from "./AuthContext"

// ============================================
// TYPES
// ============================================

export type ProgramType = "training" | "certification" | "funding"
export type TrainingType = "online" | "offline" | "hybrid"

export interface Program {
  id: number
  title: string
  description: string
  banner?: string
  provider?: string
  provider_logo?: string
  type: ProgramType
  training_type?: TrainingType
  batch?: number
  batch_start_date?: string
  batch_end_date?: string
  location?: string
  min_amount?: number
  max_amount?: number
  interest_rate?: number
  max_tenure_months?: number
  application_deadline: string
  is_active: boolean
  created_by?: number
  created_by_name?: string
  created_at?: string
  updated_at?: string
  benefits?: string[]
  requirements?: string[]
}

export interface CreateProgramData {
  title: string
  description?: string
  banner?: string
  provider?: string
  provider_logo?: string
  is_active?: boolean
  type: ProgramType
  training_type?: TrainingType
  batch?: number
  batch_start_date?: string
  batch_end_date?: string
  location?: string
  min_amount?: number
  max_amount?: number
  interest_rate?: number
  max_tenure_months?: number
  application_deadline: string
  benefits?: string[]
  requirements?: string[]
}

export interface UpdateProgramData extends CreateProgramData {
  id: number
}

interface ApiResponse<T> {
  statusCode: number
  status: boolean
  message: string
  data: T
}

interface ProgramsContextType {
  programs: Program[]
  currentProgram: Program | null
  isLoading: boolean
  error: string | null
  
  // CRUD Operations
  getAllPrograms: () => Promise<void>
  getProgramById: (id: number) => Promise<void>
  createProgram: (data: CreateProgramData) => Promise<{ success: boolean; message?: string }>
  updateProgram: (id: number, data: CreateProgramData) => Promise<{ success: boolean; message?: string }>
  deleteProgram: (id: number) => Promise<{ success: boolean; message?: string }>
  activateProgram: (id: number) => Promise<{ success: boolean; message?: string }>
  deactivateProgram: (id: number) => Promise<{ success: boolean; message?: string }>
  
  // Utility
  clearError: () => void
  clearCurrentProgram: () => void
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

const ProgramsContext = createContext<ProgramsContextType | undefined>(undefined)

export function ProgramsProvider({ children }: { children: React.ReactNode }) {
  const { token } = useAuth()
  const [programs, setPrograms] = useState<Program[]>([])
  const [currentProgram, setCurrentProgram] = useState<Program | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get all programs
  const getAllPrograms = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await apiCall<Program[]>('/programs/', token, {
        method: 'GET',
      })

      setPrograms(response.data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch programs'
      setError(errorMessage)
      console.error('Get all programs error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Get program by ID
  const getProgramById = async (id: number) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await apiCall<Program>(`/programs/${id}`, token, {
        method: 'GET',
      })

      setCurrentProgram(response.data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch program'
      setError(errorMessage)
      console.error('Get program by ID error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Create program
  const createProgram = async (data: CreateProgramData): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await apiCall<Program>('/programs/', token, {
        method: 'POST',
        body: JSON.stringify(data),
      })

      // Refresh programs list
      await getAllPrograms()

      return {
        success: true,
        message: response.message || 'Program created successfully',
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create program'
      setError(errorMessage)
      return {
        success: false,
        message: errorMessage,
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Update program
  const updateProgram = async (id: number, data: CreateProgramData): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await apiCall<Program>(`/programs/${id}`, token, {
        method: 'PUT',
        body: JSON.stringify(data),
      })

      // Refresh programs list
      await getAllPrograms()

      return {
        success: true,
        message: response.message || 'Program updated successfully',
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update program'
      setError(errorMessage)
      return {
        success: false,
        message: errorMessage,
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Delete program
  const deleteProgram = async (id: number): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await apiCall<Program>(`/programs/${id}`, token, {
        method: 'DELETE',
      })

      // Remove from local state
      setPrograms(prev => prev.filter(p => p.id !== id))

      return {
        success: true,
        message: response.message || 'Program deleted successfully',
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete program'
      setError(errorMessage)
      return {
        success: false,
        message: errorMessage,
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Activate program
  const activateProgram = async (id: number): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await apiCall<Program>(`/programs/activate/${id}`, token, {
        method: 'PUT',
      })

      // Update local state
      setPrograms(prev => 
        prev.map(p => p.id === id ? { ...p, is_active: true } : p)
      )

      return {
        success: true,
        message: response.message || 'Program activated successfully',
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to activate program'
      setError(errorMessage)
      return {
        success: false,
        message: errorMessage,
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Deactivate program
  const deactivateProgram = async (id: number): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await apiCall<Program>(`/programs/deactivate/${id}`, token, {
        method: 'PUT',
      })

      // Update local state
      setPrograms(prev => 
        prev.map(p => p.id === id ? { ...p, is_active: false } : p)
      )

      return {
        success: true,
        message: response.message || 'Program deactivated successfully',
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to deactivate program'
      setError(errorMessage)
      return {
        success: false,
        message: errorMessage,
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Utility functions
  const clearError = () => setError(null)
  const clearCurrentProgram = () => setCurrentProgram(null)

  return (
    <ProgramsContext.Provider
      value={{
        programs,
        currentProgram,
        isLoading,
        error,
        getAllPrograms,
        getProgramById,
        createProgram,
        updateProgram,
        deleteProgram,
        activateProgram,
        deactivateProgram,
        clearError,
        clearCurrentProgram,
      }}
    >
      {children}
    </ProgramsContext.Provider>
  )
}

// ============================================
// CUSTOM HOOK
// ============================================

export function usePrograms() {
  const context = useContext(ProgramsContext)
  if (context === undefined) {
    throw new Error("usePrograms must be used within a ProgramsProvider")
  }
  return context
}