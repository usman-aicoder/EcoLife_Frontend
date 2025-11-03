/**
 * Onboarding service
 * Handles lifestyle and health data submission
 */

import apiClient from "./api";

// Types
export interface LifestyleData {
  transportation_mode?: string;
  diet_type?: string;
  shopping_pattern?: string;
  recycling_habits?: string;
  reusable_items?: boolean;
  energy_source?: string;
  travel_frequency?: string;
  paper_preference?: string;
}

export interface HealthData {
  age?: number;
  height?: number; // in cm
  weight?: number; // in kg
  activity_level?: string;
  wellness_goal?: string;
  dietary_preference?: string;
}

export interface OnboardingSummary {
  user_id: number;
  lifestyle: LifestyleData | null;
  health: HealthData | null;
  eco_score: number;
  wellness_score: number;
}

// Onboarding API calls
export const onboardingService = {
  /**
   * Submit or update lifestyle data
   */
  submitLifestyle: async (data: LifestyleData): Promise<any> => {
    const response = await apiClient.post("/onboarding/lifestyle", data);
    return response.data;
  },

  /**
   * Submit or update health data
   */
  submitHealth: async (data: HealthData): Promise<any> => {
    const response = await apiClient.post("/onboarding/health", data);
    return response.data;
  },

  /**
   * Get onboarding summary with scores
   */
  getSummary: async (): Promise<OnboardingSummary> => {
    const response = await apiClient.get<OnboardingSummary>("/onboarding/summary");
    return response.data;
  },

  /**
   * Get onboarding summary for specific user
   */
  getUserSummary: async (userId: number): Promise<OnboardingSummary> => {
    const response = await apiClient.get<OnboardingSummary>(`/onboarding/summary/${userId}`);
    return response.data;
  },
};

export default onboardingService;
