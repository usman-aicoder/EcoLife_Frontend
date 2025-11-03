/**
 * Activity Service
 * Handles API calls for tracking daily activities and steps
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

export interface ActivityData {
  id: number;
  user_id: number;
  steps: number | null;
  duration_minutes: number | null;
  activity_type: string | null;
  calories_burned: number | null;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface AddStepsRequest {
  date: string;
  steps: number;
  activity_type?: string;
}

export interface AddStepsResponse {
  success: boolean;
  message: string;
  activity: ActivityData;
}

export const activityService = {
  /**
   * Get today's activity data
   */
  async getTodayActivity(): Promise<ActivityData> {
    const api = createAuthAxios();
    const response = await api.get('/activities/today');
    return response.data;
  },

  /**
   * Add or update daily steps
   */
  async addSteps(request: AddStepsRequest): Promise<AddStepsResponse> {
    const api = createAuthAxios();
    const response = await api.post('/activities/steps', request);
    return response.data;
  },

  /**
   * Get activity data for a specific date
   */
  async getActivityByDate(date: string): Promise<ActivityData> {
    const api = createAuthAxios();
    const response = await api.get(`/activities/date/${date}`);
    return response.data;
  },

  /**
   * Get activity history
   */
  async getHistory(days: number = 7): Promise<ActivityData[]> {
    const api = createAuthAxios();
    const response = await api.get(`/activities/history?days=${days}`);
    return response.data;
  }
};
