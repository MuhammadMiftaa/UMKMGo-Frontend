"use client";

import type React from "react";
import { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";
import { API_BASE_URL } from "../lib/const";

// ============================================
// TYPES
// ============================================

export interface SLAConfig {
  max_days: number;
  description: string;
}

export interface UpdateProfileData {
  name: string;
  email: string;
}

export interface ExportDataParams {
  file_type: "pdf" | "excel";
  application_type: "all" | "training" | "certification" | "funding";
}

interface ApiResponse<T> {
  statusCode: number;
  status: boolean;
  message: string;
  data: T;
}

interface SettingsContextType {
  // State
  screeningSLA: SLAConfig | null;
  finalSLA: SLAConfig | null;
  isLoading: boolean;
  error: string | null;

  // Operations
  getScreeningSLA: () => Promise<void>;
  getFinalSLA: () => Promise<void>;
  updateScreeningSLA: (
    data: SLAConfig
  ) => Promise<{ success: boolean; message?: string }>;
  updateFinalSLA: (
    data: SLAConfig
  ) => Promise<{ success: boolean; message?: string }>;
  updateProfile: (
    data: UpdateProfileData
  ) => Promise<{ success: boolean; message?: string }>;
  exportApplications: (
    params: ExportDataParams
  ) => Promise<{ success: boolean; message?: string; data?: Blob }>;
  exportPrograms: (
    params: ExportDataParams
  ) => Promise<{ success: boolean; message?: string; data?: Blob }>;

  // Utility
  clearError: () => void;
}

// ============================================
// API UTILITIES
// ============================================

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

// Special function for file downloads
async function apiCallFile(
  endpoint: string,
  token: string | null,
  options: RequestInit = {}
): Promise<Blob> {
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

  if (!response.ok) {
    throw new Error("Failed to download file");
  }

  return await response.blob();
}

// ============================================
// CONTEXT
// ============================================

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();

  // State
  const [screeningSLA, setScreeningSLA] = useState<SLAConfig | null>(null);
  const [finalSLA, setFinalSLA] = useState<SLAConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get Screening SLA
  const getScreeningSLA = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiCall<SLAConfig>("/sla/screening", token, {
        method: "GET",
      });

      setScreeningSLA(response.data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch screening SLA";
      setError(errorMessage);
      console.error("Get screening SLA error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Get Final SLA
  const getFinalSLA = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiCall<SLAConfig>("/sla/final", token, {
        method: "GET",
      });

      setFinalSLA(response.data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch final SLA";
      setError(errorMessage);
      console.error("Get final SLA error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Update Screening SLA
  const updateScreeningSLA = async (
    data: SLAConfig
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiCall<SLAConfig>("/sla/screening", token, {
        method: "PUT",
        body: JSON.stringify(data),
      });

      setScreeningSLA(response.data);

      return {
        success: true,
        message: response.message || "Screening SLA updated successfully",
      };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update screening SLA";
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Update Final SLA
  const updateFinalSLA = async (
    data: SLAConfig
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiCall<SLAConfig>("/sla/final", token, {
        method: "PUT",
        body: JSON.stringify(data),
      });

      setFinalSLA(response.data);

      return {
        success: true,
        message: response.message || "Final SLA updated successfully",
      };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update final SLA";
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Update Profile
  const updateProfile = async (
    data: UpdateProfileData
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiCall<any>("/profile", token, {
        method: "PUT",
        body: JSON.stringify(data),
      });

      return {
        success: true,
        message: response.message || "Profile updated successfully",
      };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update profile";
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Export Applications
  const exportApplications = async (
    params: ExportDataParams
  ): Promise<{ success: boolean; message?: string; data?: Blob }> => {
    try {
      setIsLoading(true);
      setError(null);

      const blob = await apiCallFile("/sla/export-applications", token, {
        method: "POST",
        body: JSON.stringify(params),
      });

      return {
        success: true,
        message: "Applications exported successfully",
        data: blob,
      };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to export applications";
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Export Programs
  const exportPrograms = async (
    params: ExportDataParams
  ): Promise<{ success: boolean; message?: string; data?: Blob }> => {
    try {
      setIsLoading(true);
      setError(null);

      const blob = await apiCallFile("/sla/export-programs", token, {
        method: "POST",
        body: JSON.stringify(params),
      });

      return {
        success: true,
        message: "Programs exported successfully",
        data: blob,
      };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to export programs";
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

  return (
    <SettingsContext.Provider
      value={{
        screeningSLA,
        finalSLA,
        isLoading,
        error,
        getScreeningSLA,
        getFinalSLA,
        updateScreeningSLA,
        updateFinalSLA,
        updateProfile,
        exportApplications,
        exportPrograms,
        clearError,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

// ============================================
// CUSTOM HOOK
// ============================================

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
