/**
 * Dashboard and Analytics service
 * Handles dashboard metrics, scores, and progress data
 */

import apiClient from "./api";

// Types
export interface DashboardData {
  eco_score: number;
  wellness_score: number;
  total_carbon_savings: number;
  total_calories_burned: number;
  streak_days: number;
  last_updated: string | null;
}

export interface ScoreData {
  eco_score: number;
  wellness_score: number;
  co2_saved: number;
}

export interface ProgressDataPoint {
  date: string;
  eco_score: number;
  wellness_score: number;
  steps: number;
  calories_burned: number;
}

export interface AnalyticsData {
  wellness_score: number;
  eco_score: number;
  co2_saved: number;
  health_progress_over_time: ProgressDataPoint[];
}

// Dashboard API calls
export const dashboardService = {
  /**
   * Get dashboard summary for current user
   */
  getDashboard: async (): Promise<DashboardData> => {
    const response = await apiClient.get<DashboardData>("/dashboard");
    return response.data;
  },

  /**
   * Get dashboard summary for specific user
   */
  getUserDashboard: async (userId: number): Promise<DashboardData> => {
    const response = await apiClient.get<DashboardData>(`/dashboard/${userId}`);
    return response.data;
  },

  /**
   * Get scores for current user
   */
  getScores: async (): Promise<ScoreData> => {
    const response = await apiClient.get<ScoreData>("/analytics/score");
    return response.data;
  },

  /**
   * Get scores for specific user
   */
  getUserScores: async (userId: number): Promise<ScoreData> => {
    const response = await apiClient.get<ScoreData>(`/analytics/score/${userId}`);
    return response.data;
  },

  /**
   * Get progress data for current user
   */
  getProgress: async (days: number = 30): Promise<AnalyticsData> => {
    const response = await apiClient.get<AnalyticsData>(`/analytics/progress?days=${days}`);
    return response.data;
  },

  /**
   * Get progress data for specific user
   */
  getUserProgress: async (userId: number, days: number = 30): Promise<AnalyticsData> => {
    const response = await apiClient.get<AnalyticsData>(
      `/analytics/progress/${userId}?days=${days}`
    );
    return response.data;
  },
};

export default dashboardService;
