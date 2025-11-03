/**
 * Authentication service
 * Handles user registration, login, and authentication
 */

import apiClient, { tokenManager } from "./api";

// Types
export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

// Authentication API calls
export const authService = {
  /**
   * Register a new user
   */
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/auth/register", data);

    // Store token
    tokenManager.set(response.data.access_token);

    return response.data;
  },

  /**
   * Login existing user
   */
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/auth/login", data);

    // Store token
    tokenManager.set(response.data.access_token);

    return response.data;
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async (): Promise<UserResponse> => {
    const response = await apiClient.get<UserResponse>("/auth/me");
    return response.data;
  },

  /**
   * Logout user
   */
  logout: (): void => {
    tokenManager.remove();
    localStorage.removeItem("ecolifeUser");
    localStorage.removeItem("ecolifeSeenWelcome");
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return tokenManager.get() !== null;
  },
};

export default authService;
