/**
 * Meal Consumption Service
 * Handles API calls for tracking meal consumption
 */

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Get authentication token
const getAuthToken = () => {
  return localStorage.getItem('ecolife_token');
};

// Create axios instance with auth
const createAuthAxios = () => {
  const token = getAuthToken();
  return axios.create({
    baseURL: API_URL,
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    }
  });
};

export interface MealConsumptionStatus {
  date: string;
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
  total_consumed: number;
  total_meals: number;
}

export interface MarkMealRequest {
  date: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner';
  meal_plan_id?: number;
}

export interface MealConsumptionResponse {
  id: number;
  user_id: number;
  meal_plan_id?: number;
  date: string;
  meal_type: string;
  consumed: boolean;
  consumed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface MarkMealResponse {
  success: boolean;
  message: string;
  meal_consumption: MealConsumptionResponse;
}

export const mealConsumptionService = {
  /**
   * Get today's meal consumption status
   */
  async getTodayStatus(): Promise<MealConsumptionStatus> {
    const api = createAuthAxios();
    const response = await api.get('/meal-consumptions/today');
    return response.data;
  },

  /**
   * Get meal consumption status for a specific date
   */
  async getDateStatus(date: string): Promise<MealConsumptionStatus> {
    const api = createAuthAxios();
    const response = await api.get(`/meal-consumptions/date/${date}`);
    return response.data;
  },

  /**
   * Mark a meal as consumed
   */
  async markMealConsumed(request: MarkMealRequest): Promise<MarkMealResponse> {
    const api = createAuthAxios();
    const response = await api.post('/meal-consumptions/mark', request);
    return response.data;
  },

  /**
   * Unmark a meal (mark as not consumed)
   */
  async unmarkMealConsumed(request: MarkMealRequest): Promise<MarkMealResponse> {
    const api = createAuthAxios();
    const response = await api.post('/meal-consumptions/unmark', request);
    return response.data;
  },

  /**
   * Get meal consumption history
   */
  async getHistory(days: number = 7): Promise<any[]> {
    const api = createAuthAxios();
    const response = await api.get(`/meal-consumptions/history?days=${days}`);
    return response.data;
  }
};
