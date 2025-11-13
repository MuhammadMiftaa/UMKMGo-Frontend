"use client";

import type React from "react";
import { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";
import { API_BASE_URL } from "../lib/const";

// ============================================
// TYPES
// ============================================

export interface CardTypeData {
  name: string;
  count: number;
}

export interface StatusSummary {
  total_applications: number;
  in_process: number;
  approved: number;
  rejected: number;
}

export interface StatusDetail {
  screening: number;
  revised: number;
  final: number;
  approved: number;
  rejected: number;
}

export interface ApplicationByType {
  funding: number;
  certification: number;
  training: number;
}

interface ApiResponse<T> {
  statusCode: number;
  status: boolean;
  message: string;
  data: T;
}

interface DashboardContextType {
  // State
  cardTypeData: CardTypeData[];
  statusSummary: StatusSummary | null;
  statusDetail: StatusDetail | null;
  applicationByType: ApplicationByType | null;
  isLoading: boolean;
  error: string | null;

  // Operations
  fetchCardTypeData: () => Promise<void>;
  fetchStatusSummary: () => Promise<void>;
  fetchStatusDetail: () => Promise<void>;
  fetchApplicationByType: () => Promise<void>;
  fetchAllDashboardData: () => Promise<void>;

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

// ============================================
// CONTEXT
// ============================================

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();

  // State
  const [cardTypeData, setCardTypeData] = useState<CardTypeData[]>([]);
  const [statusSummary, setStatusSummary] = useState<StatusSummary | null>(
    null
  );
  const [statusDetail, setStatusDetail] = useState<StatusDetail | null>(null);
  const [applicationByType, setApplicationByType] =
    useState<ApplicationByType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch Card Type Data
  const fetchCardTypeData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiCall<CardTypeData[]>(
        "/dashboard/umkm-by-card-type",
        token,
        { method: "GET" }
      );

      setCardTypeData(response.data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch card type data";
      setError(errorMessage);
      console.error("Fetch card type data error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Status Summary
  const fetchStatusSummary = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiCall<StatusSummary[]>(
        "/dashboard/application-status-summary",
        token,
        { method: "GET" }
      );

      // Convert array to single object
      const summary = response.data.reduce((acc, item) => {
        return { ...acc, ...item };
      }, {} as StatusSummary);

      setStatusSummary(summary);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch status summary";
      setError(errorMessage);
      console.error("Fetch status summary error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Status Detail
  const fetchStatusDetail = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiCall<StatusDetail[]>(
        "/dashboard/application-status-detail",
        token,
        { method: "GET" }
      );

      // Convert array to single object
      const detail = response.data.reduce((acc, item) => {
        return { ...acc, ...item };
      }, {} as StatusDetail);

      setStatusDetail(detail);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch status detail";
      setError(errorMessage);
      console.error("Fetch status detail error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Application By Type
  const fetchApplicationByType = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiCall<ApplicationByType[]>(
        "/dashboard/application-by-type",
        token,
        { method: "GET" }
      );

      // Convert array to single object
      const byType = response.data.reduce((acc, item) => {
        return { ...acc, ...item };
      }, {} as ApplicationByType);

      setApplicationByType(byType);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to fetch application by type";
      setError(errorMessage);
      console.error("Fetch application by type error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch All Dashboard Data
  const fetchAllDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      await Promise.all([
        fetchCardTypeData(),
        fetchStatusSummary(),
        fetchStatusDetail(),
        fetchApplicationByType(),
      ]);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch dashboard data";
      setError(errorMessage);
      console.error("Fetch all dashboard data error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Utility functions
  const clearError = () => setError(null);

  return (
    <DashboardContext.Provider
      value={{
        cardTypeData,
        statusSummary,
        statusDetail,
        applicationByType,
        isLoading,
        error,
        fetchCardTypeData,
        fetchStatusSummary,
        fetchStatusDetail,
        fetchApplicationByType,
        fetchAllDashboardData,
        clearError,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

// ============================================
// CUSTOM HOOK
// ============================================

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
