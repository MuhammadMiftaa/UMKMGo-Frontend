"use client";

import type React from "react";
import { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";

// ============================================
// TYPES
// ============================================

export type ApplicationType = "training" | "certification" | "funding";
export type ApplicationStatus =
  | "screening"
  | "revised"
  | "final"
  | "approved"
  | "rejected";
export type DocumentType =
  | "ktp"
  | "nib"
  | "npwp"
  | "proposal"
  | "portfolio"
  | "rekening"
  | "other";
export type ApplicationHistoryAction =
  | "submit"
  | "revise"
  | "approve_by_admin_screening"
  | "reject_by_admin_screening"
  | "approve_by_admin_vendor"
  | "reject_by_admin_vendor";

export interface ApplicationDocument {
  id?: number;
  application_id?: number;
  type: DocumentType;
  file: string;
  created_at?: string;
  updated_at?: string;
}

export interface ApplicationHistory {
  id?: number;
  application_id?: number;
  status: ApplicationHistoryAction;
  notes?: string;
  actioned_at: string;
  actioned_by: number;
  actioned_by_name: string;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id?: number;
  name?: string;
  email?: string;
}

export interface City {
  id?: number;
  name?: string;
  province_id?: number;
}

export interface Province {
  id?: number;
  name?: string;
}

export interface UMKM {
  id?: number;
  user_id?: number;
  business_name?: string;
  nik?: string;
  gender?: string;
  birth_date?: string;
  phone?: string;
  address?: string;
  province_id?: number;
  city_id?: number;
  district?: number;
  subdistrict?: number;
  postal_code?: string;
  nib?: string;
  npwp?: string;
  kartu_type?: string;
  kartu_number?: string;
  user?: User;
  city?: City;
  province?: Province;
}

export interface Program {
  id?: number;
  title?: string;
  location?: string;
  type?: ApplicationType;
}

export interface Application {
  id: number;
  umkm_id: number;
  program_id: number;
  type: ApplicationType;
  status: ApplicationStatus;
  submitted_at: string;
  expired_at: string;
  created_at: string;
  updated_at: string;
  documents?: ApplicationDocument[];
  histories?: ApplicationHistory[];
  program?: Program;
  umkm?: UMKM;
}

export interface ApplicationDecision {
  application_id: number;
  action: "approve" | "reject" | "revise";
  notes?: string;
}

interface ApiResponse<T> {
  statusCode: number;
  status: boolean;
  message: string;
  data: T;
}

interface ApplicationsContextType {
  applications: Application[];
  currentApplication: Application | null;
  isLoading: boolean;
  error: string | null;

  // Read Operations
  getAllApplications: (filterType?: ApplicationType) => Promise<void>;
  getApplicationById: (id: number) => Promise<void>;

  // Screening Decisions
  screeningApprove: (
    id: number
  ) => Promise<{ success: boolean; message?: string }>;
  screeningReject: (
    decision: ApplicationDecision
  ) => Promise<{ success: boolean; message?: string }>;
  screeningRevise: (
    decision: ApplicationDecision
  ) => Promise<{ success: boolean; message?: string }>;

  // Final Decisions
  finalApprove: (id: number) => Promise<{ success: boolean; message?: string }>;
  finalReject: (
    decision: ApplicationDecision
  ) => Promise<{ success: boolean; message?: string }>;

  // Utility
  clearError: () => void;
  clearCurrentApplication: () => void;
}

// ============================================
// API UTILITIES
// ============================================

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/v1";

async function apiCall<T>(
  endpoint: string,
  token: string | null,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok || !data.status) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

// ============================================
// CONTEXT
// ============================================

const ApplicationsContext = createContext<ApplicationsContextType | undefined>(
  undefined
);

export function ApplicationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [currentApplication, setCurrentApplication] =
    useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get all applications
  const getAllApplications = async (filterType?: ApplicationType) => {
    try {
      setIsLoading(true);
      setError(null);

      const queryParams = filterType ? `?type=${filterType}` : "";
      const response = await apiCall<Application[]>(
        `/applications/${queryParams}`,
        token,
        {
          method: "GET",
        }
      );

      setApplications(response.data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch applications";
      setError(errorMessage);
      console.error("Get all applications error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Get application by ID
  const getApplicationById = async (id: number) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiCall<Application>(
        `/applications/${id}`,
        token,
        {
          method: "GET",
        }
      );

      setCurrentApplication(response.data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch application";
      setError(errorMessage);
      console.error("Get application by ID error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Screening approve
  const screeningApprove = async (
    id: number
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiCall<Application>(
        `/applications/screening-approve/${id}`,
        token,
        {
          method: "PUT",
        }
      );

      // Refresh applications list
      await getAllApplications();

      return {
        success: true,
        message: response.message || "Application approved by screening",
      };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to approve application";
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Screening reject
  const screeningReject = async (
    decision: ApplicationDecision
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiCall<Application>(
        `/applications/screening-reject/${decision.application_id}`,
        token,
        {
          method: "PUT",
          body: JSON.stringify({ notes: decision.notes }),
        }
      );

      // Refresh applications list
      await getAllApplications();

      return {
        success: true,
        message: response.message || "Application rejected by screening",
      };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to reject application";
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Screening revise
  const screeningRevise = async (
    decision: ApplicationDecision
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiCall<Application>(
        `/applications/screening-revise/${decision.application_id}`,
        token,
        {
          method: "PUT",
          body: JSON.stringify({ notes: decision.notes }),
        }
      );

      // Refresh applications list
      await getAllApplications();

      return {
        success: true,
        message: response.message || "Application revision requested",
      };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to request revision";
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Final approve
  const finalApprove = async (
    id: number
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiCall<Application>(
        `/applications/final-approve/${id}`,
        token,
        {
          method: "PUT",
        }
      );

      // Refresh applications list
      await getAllApplications();

      return {
        success: true,
        message: response.message || "Application approved by vendor",
      };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to approve application";
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Final reject
  const finalReject = async (
    decision: ApplicationDecision
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiCall<Application>(
        `/applications/final-reject/${decision.application_id}`,
        token,
        {
          method: "PUT",
          body: JSON.stringify({ notes: decision.notes }),
        }
      );

      // Refresh applications list
      await getAllApplications();

      return {
        success: true,
        message: response.message || "Application rejected by vendor",
      };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to reject application";
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Utility functions
  const clearError = () => setError(null);
  const clearCurrentApplication = () => setCurrentApplication(null);

  return (
    <ApplicationsContext.Provider
      value={{
        applications,
        currentApplication,
        isLoading,
        error,
        getAllApplications,
        getApplicationById,
        screeningApprove,
        screeningReject,
        screeningRevise,
        finalApprove,
        finalReject,
        clearError,
        clearCurrentApplication,
      }}
    >
      {children}
    </ApplicationsContext.Provider>
  );
}

// ============================================
// CUSTOM HOOK
// ============================================

export function useApplications() {
  const context = useContext(ApplicationsContext);
  if (context === undefined) {
    throw new Error(
      "useApplications must be used within an ApplicationsProvider"
    );
  }
  return context;
}
