/**
 * Base API client with axios
 * Handles JWT token management and API requests
 */

import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";

// Get API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds
});

// Token management
const TOKEN_KEY = "ecolife_token";

export const tokenManager = {
  get: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },
  set: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },
  remove: (): void => {
    localStorage.removeItem(TOKEN_KEY);
  },
};

// Request interceptor - Add JWT token to requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenManager.get();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;

      if (status === 401) {
        // Unauthorized - clear token and redirect to login
        tokenManager.remove();
        // Could dispatch a logout action here if using Redux/Context
      }

      // Extract error message from response
      const errorData = error.response.data as any;
      const errorMessage = errorData?.detail || errorData?.message || "An error occurred";

      return Promise.reject(new Error(errorMessage));
    } else if (error.request) {
      // Request was made but no response received
      return Promise.reject(new Error("No response from server. Please check your connection."));
    } else {
      // Something else happened
      return Promise.reject(new Error(error.message || "An unexpected error occurred"));
    }
  }
);

export default apiClient;
