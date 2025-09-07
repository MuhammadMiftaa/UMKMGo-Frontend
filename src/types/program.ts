export type ProgramType = "TRAINING" | "CERTIFICATION" | "FUNDING"
export type TrainingType = "Basic" | "Intermediate" | "Advanced" | "Professional"

export interface ProgramBenefit {
  id: number
  program_id: number
  name: string
  created_at: string
  updated_at: string
  deleted_at?: string
}

export interface ProgramRequirement {
  id: number
  program_id: number
  name: string
  created_at: string
  updated_at: string
  deleted_at?: string
}

export interface Program {
  id: number
  title: string
  description: string
  banner: string
  provider: string
  provider_logo: string
  type: ProgramType

  // Training & Certification specific fields
  training_type?: TrainingType
  batch?: number
  batch_start_date?: string
  batch_end_date?: string
  location?: string

  // Funding specific fields
  min_amount?: number
  max_amount?: number
  interest_rate?: number
  max_tenure_months?: number

  application_deadline: string
  is_active: boolean
  created_by: number
  created_at: string
  updated_at: string
  deleted_at?: string

  // Relations
  benefits: ProgramBenefit[]
  requirements: ProgramRequirement[]
  created_by_name?: string
}

export interface CreateProgramData {
  title: string
  description: string
  banner: File | string
  provider: string
  provider_logo: File | string
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
  benefits: { name: string }[]
  requirements: { name: string }[]
}
