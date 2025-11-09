/**
 * Meal Plan Service
 * Handles API calls for meal plan generation and retrieval
 */

import apiClient from './api';

const API_URL = 'http://localhost:8000';

export interface MealDetail {
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  carbon_footprint: number;
  ingredients: string[];
  cooking_time: number;
  recipe_url?: string;
}

export interface DayMeals {
  day: number;
  date: string;
  breakfast: MealDetail;
  lunch: MealDetail;
  dinner: MealDetail;
  total_calories: number;
  total_carbon: number;
}

export interface MealPlan {
  id: number;
  user_id: number;
  status: string;
  task_id?: string;
  meals: DayMeals[];
  dietary_preference?: string;
  calorie_target?: number;
  created_at: string;
  completed_at?: string;
  error_message?: string;
  total_calories_week?: number;
  total_carbon_week?: number;
  avg_calories_day?: number;
}

export interface GenerateMealPlanRequest {
  dietary_preference?: string;
  calorie_target?: number;
  exclude_ingredients?: string[];
}

export interface MealPlanStatusResponse {
  id: number;
  task_id: string;
  status: string;
  message: string;
  progress?: number;
}

class MealPlanService {
  /**
   * Generate a new 7-day meal plan (async with task tracking)
   */
  async generateMealPlan(request: GenerateMealPlanRequest): Promise<MealPlanStatusResponse> {
    const response = await apiClient.post<MealPlanStatusResponse>(
      '/meal-plans/generate',
      request
    );
    return response.data;
  }

  /**
   * Regenerate a new 7-day meal plan synchronously (instant)
   */
  async regenerateMealPlan(request: GenerateMealPlanRequest): Promise<MealPlan> {
    const response = await apiClient.post<MealPlan>(
      '/meal-plans/regenerate',
      request
    );
    return response.data;
  }

  /**
   * Check the status of meal plan generation
   */
  async checkStatus(taskId: string): Promise<MealPlanStatusResponse> {
    const response = await apiClient.get<MealPlanStatusResponse>(
      `/meal-plans/status/${taskId}`
    );
    return response.data;
  }

  /**
   * Get a specific meal plan by ID
   */
  async getMealPlan(mealPlanId: number): Promise<MealPlan> {
    const response = await apiClient.get<MealPlan>(
      `/meal-plans/${mealPlanId}`
    );
    return response.data;
  }

  /**
   * Get all meal plans for the current user
   */
  async getMyMealPlans(limit = 10, offset = 0): Promise<{ meal_plans: MealPlan[]; total: number }> {
    const response = await apiClient.get<{ meal_plans: MealPlan[]; total: number }>(
      `/meal-plans/user/my-plans?limit=${limit}&offset=${offset}`
    );
    return response.data;
  }

  /**
   * Get today's meal plan (most recent completed plan)
   */
  async getTodaysMealPlan(): Promise<DayMeals | null> {
    try {
      const response = await this.getMyMealPlans(1, 0);

      if (response.meal_plans.length === 0) {
        return null;
      }

      const latestPlan = response.meal_plans[0];

      // Only return if the plan is completed
      if (latestPlan.status !== 'completed' || !latestPlan.meals) {
        return null;
      }

      // Calculate which day of the plan we're on
      const planStartDate = new Date(latestPlan.meals[0].date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      planStartDate.setHours(0, 0, 0, 0);

      const diffTime = today.getTime() - planStartDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      // If we're within the 7-day plan window
      if (diffDays >= 0 && diffDays < 7) {
        return latestPlan.meals[diffDays];
      }

      // Default to day 1 if outside window
      return latestPlan.meals[0];
    } catch (error) {
      console.error('Error fetching today\'s meal plan:', error);
      return null;
    }
  }

  /**
   * Delete a meal plan
   */
  async deleteMealPlan(mealPlanId: number): Promise<void> {
    await apiClient.delete(`/meal-plans/${mealPlanId}`);
  }

  /**
   * Update an existing meal plan with edited meals
   */
  async updateMealPlan(mealPlanId: number, updatedMeals: DayMeals[]): Promise<MealPlan> {
    const response = await apiClient.put<MealPlan>(
      `/meal-plans/${mealPlanId}`,
      { meals: updatedMeals }
    );
    return response.data;
  }

  /**
   * Swap a single meal in the meal plan
   */
  async swapMeal(
    mealPlanId: number,
    dayIndex: number,
    mealType: 'breakfast' | 'lunch' | 'dinner',
    newMeal: MealDetail
  ): Promise<MealPlan> {
    const response = await apiClient.post<MealPlan>(
      `/meal-plans/${mealPlanId}/swap-meal`,
      {
        day_index: dayIndex,
        meal_type: mealType,
        new_meal: newMeal
      }
    );
    return response.data;
  }

  /**
   * Get alternative meals for swapping
   */
  async getAlternatives(
    mealType: 'breakfast' | 'lunch' | 'dinner',
    dietaryPreference: string = 'balanced',
    excludeNames: string[] = []
  ): Promise<{ alternatives: MealDetail[]; meal_type: string; count: number }> {
    const params = new URLSearchParams({
      meal_type: mealType,
      dietary_preference: dietaryPreference,
    });

    if (excludeNames.length > 0) {
      params.append('exclude_names', excludeNames.join(','));
    }

    const response = await apiClient.get<{ alternatives: MealDetail[]; meal_type: string; count: number }>(
      `/meal-plans/alternatives?${params.toString()}`
    );
    return response.data;
  }
}

export const mealPlanService = new MealPlanService();
