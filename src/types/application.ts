export type ApplicationStatus =
  | "draft"
  | "masuk"
  | "screening"
  | "revisi"
  | "penilaian"
  | "keputusan"
  | "disetujui"
  | "ditolak"
  | "dibatalkan"

export type ApplicationType = "pelatihan" | "sertifikasi" | "pendanaan"

export interface ScoringCriteria {
  kategoriAfirmatif: boolean
  wilayah3T: boolean
  kepemilikanNIB: boolean
  omzetSkalaUsaha: boolean
}

export interface Application {
  id: string
  type: ApplicationType
  applicantName: string
  applicantNik: string
  businessName: string
  status: ApplicationStatus
  submittedAt: string
  updatedAt: string
  score?: number
  scoringCriteria?: ScoringCriteria
  region: string
  amount?: number
  trainingType?: string
  certificationScheme?: string
  fundingPurpose?: string
  slaDeadline: string
  assignedTo?: string
  notes: string[]
}

export interface StatusTransition {
  from: ApplicationStatus
  to: ApplicationStatus
  timestamp: string
  userId: string
  reason: string
  documents?: string[]
}
