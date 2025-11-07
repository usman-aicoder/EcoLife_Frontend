/**
 * Health Insights Service
 * Handles API calls for health insights and recommendations
 */

import apiClient from './api';

export interface ActivityInsight {
  steps: number;
  steps_goal: number;
  percentage: number;
  calories_burned: number;
  activity_type?: string;
  duration_minutes?: number;
  goal_achieved: boolean;
  message: string;
}

export interface MealInsight {
  meals_consumed: number;
  total_meals: number;
  percentage: number;
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
  message: string;
}

export interface CalorieInsight {
  consumed: number;
  target: number;
  difference: number;
  percentage: number;
  status: string;
  message: string;
}

export interface DailyInsights {
  date: string;
  activity: ActivityInsight;
  meals: MealInsight;
  calories: CalorieInsight;
  recommendations: string[];
}

export interface ActivitySummary {
  total_steps: number;
  avg_steps: number;
  total_calories: number;
  days_active: number;
  goal_days: number;
  message: string;
}

export interface MealSummary {
  meals_logged: number;
  total_possible: number;
  percentage: number;
  breakfast_count: number;
  lunch_count: number;
  dinner_count: number;
  message: string;
}

export interface WeeklyInsights {
  week_start: string;
  week_end: string;
  activity_summary: ActivitySummary;
  meal_summary: MealSummary;
  streak: number;
  consistency_score: number;
}

class HealthInsightsService {
  /**
   * Get today's health insights
   */
  async getDailyInsights(): Promise<DailyInsights> {
    const response = await apiClient.get<DailyInsights>('/health-insights/daily');
    return response.data;
  }

  /**
   * Get this week's health insights
   */
  async getWeeklyInsights(): Promise<WeeklyInsights> {
    const response = await apiClient.get<WeeklyInsights>('/health-insights/weekly');
    return response.data;
  }
}

export const healthInsightsService = new HealthInsightsService();
