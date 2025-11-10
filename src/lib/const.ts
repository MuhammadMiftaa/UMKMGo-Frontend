export const Permissions = {
  SCREENING_TRAINING: "SCREENING_TRAINING",
  MANAGE_TRAINING_PROGRAMS: "MANAGE_TRAINING_PROGRAMS",
  FINAL_TRAINING: "FINAL_TRAINING",
  VIEW_TRAINING: "VIEW_TRAINING",
  SCREENING_CERTIFICATION: "SCREENING_CERTIFICATION",
  MANAGE_CERTIFICATION_PROGRAMS: "MANAGE_CERTIFICATION_PROGRAMS",
  FINAL_CERTIFICATION: "FINAL_CERTIFICATION",
  VIEW_CERTIFICATION: "VIEW_CERTIFICATION",
  SCREENING_FUNDING: "SCREENING_FUNDING",
  MANAGE_FUNDING_PROGRAMS: "MANAGE_FUNDING_PROGRAMS",
  FINAL_FUNDING: "FINAL_FUNDING",
  VIEW_FUNDING: "VIEW_FUNDING",
  USER_MANAGEMENT: "USER_MANAGEMENT",
  ROLE_PERMISSIONS_MANAGEMENT: "ROLE_PERMISSIONS_MANAGEMENT",
  GENERATE_REPORT: "GENERATE_REPORT",
  SLA_CONFIGURATION: "SLA_CONFIGURATION",
} as const;

export const RoleConstants = {
  SUPERADMIN: "superadmin",
  ADMIN_VENDER: "admin_vendor",
  ADMIN_SCREENING: "admin_screening",
  UMKM: "pelaku_usaha",
} as const;

export const RoleConstantsMap = {
  superadmin: "Super Admin",
  admin_vendor: "Admin Vendor",
  admin_screening: "Admin Screening",
  pelaku_usaha: "Pelaku Usaha",
};

export const Programs = {
  TRAINING: "training",
  CERTIFICATION: "certification",
  FUNDING: "funding",
};

export const ProgramsMap = {
  training: "Pelatihan",
  certification: "Sertifikasi",
  funding: "Pendanaan",
};

export const Documents = {
  KTP: "ktp",
  NIB: "nib",
  NPWP: "npwp",
  PROPOSAL: "proposal",
  PORTFOLIO: "portfolio",
  REKENING: "rekening",
  OTHER: "other",
};

export const DocumentsMap = {
  ktp: "KTP",
  nib: "NIB",
  npwp: "NPWP",
  proposal: "Proposal",
  portfolio: "Portofolio",
  rekening: "Rekening",
  other: "Lainnya",
};

export const Status = {
  SCREENING: "screening",
  REVISED: "revised",
  FINAL: "final",
  APPROVED: "approved",
  REJECTED: "rejected",
};

export const StatusMap = {
  screening: "Screening",
  revised: "Revisi",
  final: "Final",
  approved: "Disetujui",
  rejected: "Ditolak",
};

export const HistoryAction = {
  SUBMIT: "submit",
  REVISE: "revise",
  APPROVE_BY_ADMIN_SCREENING: "approve_by_admin_screening",
  REJECT_BY_ADMIN_SCREENING: "reject_by_admin_screening",
  APPROVE_BY_ADMIN_VENDOR: "approve_by_admin_vendor",
  REJECT_BY_ADMIN_VENDOR: "reject_by_admin_vendor",
};

export const HistoryActionMap = {
  submit: "Diajukan",
  revise: "Direvisi",
  approve_by_admin_screening: "Disetujui oleh Admin Screening",
  reject_by_admin_screening: "Ditolak oleh Admin Screening",
  approve_by_admin_vendor: "Disetujui oleh Admin Vendor",
  reject_by_admin_vendor: "Ditolak oleh Admin Vendor",
};

export const TrainingTypes = {
  ONLINE: "online",
  OFFLINE: "offline",
  HYBRID: "hybrid",
};

export const TrainingTypesMap = {
  online: "Online",
  offline: "Offline",
  hybrid: "Hybrid",
};
