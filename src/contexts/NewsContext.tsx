"use client";

import type React from "react";
import { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";
import { API_BASE_URL } from "../lib/const";
import { startProgress, stopProgress } from "../lib/nprogress";

// ============================================
// TYPES
// ============================================

export type NewsCategory = "announcement" | "success_story" | "event" | "article";

export interface News {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  category: NewsCategory;
  is_published: boolean;
  tags: string[];
  created_by?: number;
  created_by_name?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateNewsData {
  title: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  category: NewsCategory;
  is_published: boolean;
  tags: string[];
}

export interface UpdateNewsData extends CreateNewsData {
  id: number;
}

interface ApiResponse<T> {
  statusCode: number;
  status: boolean;
  message: string;
  data: T;
}

interface NewsContextType {
  newsList: News[];
  currentNews: News | null;
  isLoading: boolean;
  error: string | null;

  // CRUD Operations
  getAllNews: () => Promise<void>;
  getNewsById: (id: number) => Promise<void>;
  createNews: (data: CreateNewsData) => Promise<{ success: boolean; message?: string }>;
  updateNews: (id: number, data: CreateNewsData) => Promise<{ success: boolean; message?: string }>;
  deleteNews: (id: number) => Promise<{ success: boolean; message?: string }>;
  publishNews: (id: number) => Promise<{ success: boolean; message?: string }>;
  unpublishNews: (id: number) => Promise<{ success: boolean; message?: string }>;

  // Utility
  clearError: () => void;
  clearCurrentNews: () => void;
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

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export function NewsProvider({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  const [newsList, setNewsList] = useState<News[]>([]);
  const [currentNews, setCurrentNews] = useState<News | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get all news
  const getAllNews = async () => {
    try {
      setIsLoading(true);
      setError(null);
      startProgress();

      const response = await apiCall<News[]>("/news/", token, {
        method: "GET",
      });

      setNewsList(response.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch news";
      setError(errorMessage);
      console.error("Get all news error:", err);
    } finally {
      setIsLoading(false);
      stopProgress();
    }
  };

  // Get news by ID
  const getNewsById = async (id: number) => {
    try {
      setIsLoading(true);
      setError(null);
      startProgress();

      const response = await apiCall<News>(`/news/${id}`, token, {
        method: "GET",
      });

      setCurrentNews(response.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch news";
      setError(errorMessage);
      console.error("Get news by ID error:", err);
    } finally {
      setIsLoading(false);
      stopProgress();
    }
  };

  // Create news
  const createNews = async (data: CreateNewsData): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsLoading(true);
      setError(null);
      startProgress();

      const response = await apiCall<News>("/news/", token, {
        method: "POST",
        body: JSON.stringify(data),
      });

      // Refresh news list
      await getAllNews();

      return {
        success: true,
        message: response.message || "Berita berhasil dibuat",
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create news";
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
      stopProgress();
    }
  };

  // Update news
  const updateNews = async (id: number, data: CreateNewsData): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsLoading(true);
      setError(null);
      startProgress();

      const response = await apiCall<News>(`/news/${id}`, token, {
        method: "PUT",
        body: JSON.stringify(data),
      });

      // Refresh news list
      await getAllNews();

      return {
        success: true,
        message: response.message || "Berita berhasil diperbarui",
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update news";
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
      stopProgress();
    }
  };

  // Delete news
  const deleteNews = async (id: number): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsLoading(true);
      setError(null);
      startProgress();

      const response = await apiCall<News>(`/news/${id}`, token, {
        method: "DELETE",
      });

      // Remove from local state
      setNewsList(prev => prev.filter(n => n.id !== id));

      return {
        success: true,
        message: response.message || "Berita berhasil dihapus",
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete news";
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
      stopProgress();
    }
  };

  // Publish news
  const publishNews = async (id: number): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsLoading(true);
      setError(null);
      startProgress();

      const response = await apiCall<News>(`/news/publish/${id}`, token, {
        method: "PUT",
      });

      // Update local state
      setNewsList(prev =>
        prev.map(n => n.id === id ? { ...n, is_published: true } : n)
      );

      return {
        success: true,
        message: response.message || "Berita berhasil dipublikasikan",
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to publish news";
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
      stopProgress();
    }
  };

  // Unpublish news
  const unpublishNews = async (id: number): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsLoading(true);
      setError(null);
      startProgress();

      const response = await apiCall<News>(`/news/unpublish/${id}`, token, {
        method: "PUT",
      });

      // Update local state
      setNewsList(prev =>
        prev.map(n => n.id === id ? { ...n, is_published: false } : n)
      );

      return {
        success: true,
        message: response.message || "Berita berhasil dibatalkan publikasinya",
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to unpublish news";
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
      stopProgress();
    }
  };

  // Utility functions
  const clearError = () => setError(null);
  const clearCurrentNews = () => setCurrentNews(null);

  return (
    <NewsContext.Provider
      value={{
        newsList,
        currentNews,
        isLoading,
        error,
        getAllNews,
        getNewsById,
        createNews,
        updateNews,
        deleteNews,
        publishNews,
        unpublishNews,
        clearError,
        clearCurrentNews,
      }}
    >
      {children}
    </NewsContext.Provider>
  );
}

// ============================================
// CUSTOM HOOK
// ============================================

export function useNews() {
  const context = useContext(NewsContext);
  if (context === undefined) {
    throw new Error("useNews must be used within a NewsProvider");
  }
  return context;
}