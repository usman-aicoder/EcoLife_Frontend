import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { AssistantSubscription } from "./AssistantSubscription";
import { WeeklyDietChart } from "./WeeklyDietChart";
import HealthInsightsModal from "./HealthInsightsModal";
import {
  Leaf,
  Heart,
  Footprints,
  Utensils,
  Dumbbell,
  Award,
  TrendingUp,
  Sparkles,
  ChevronRight,
  Calendar,
  Target,
  Sun,
  Moon,
  CheckCircle2,
  Circle,
  LogOut,
  MessageCircle,
  Zap,
  Loader2,
  AlertCircle
} from "lucide-react";
import { dashboardService } from "../services/dashboard";
import { mealPlanService, DayMeals } from "../services/mealPlan";
import { mealConsumptionService, MealConsumptionStatus } from "../services/mealConsumption";
import { activityService, ActivityData } from "../services/activity";

interface DashboardProps {
  userName: string;
  onLogout: () => void;
}

export function Dashboard({ userName, onLogout }: DashboardProps) {
  const currentDay = 1;
  const totalDays = 7;
  const [mealChecked, setMealChecked] = useState([false, false, false]);
  const [activityComplete, setActivityComplete] = useState(false);
  const [showAssistantSubscription, setShowAssistantSubscription] = useState(false);
  const [showWeeklyDietChart, setShowWeeklyDietChart] = useState(false);
  const [showHealthInsights, setShowHealthInsights] = useState(false);

  // Backend integration states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [scoresData, setScoresData] = useState<any>(null);

  // Meal plan state
  const [todaysMealPlan, setTodaysMealPlan] = useState<DayMeals | null>(null);
  const [mealPlanLoading, setMealPlanLoading] = useState(false);

  // Meal consumption state
  const [mealConsumptionStatus, setMealConsumptionStatus] = useState<MealConsumptionStatus | null>(null);

  // Activity/Steps state
  const [todayActivity, setTodayActivity] = useState<ActivityData | null>(null);
  const [stepsInput, setStepsInput] = useState<string>("");
  const [durationInput, setDurationInput] = useState<string>("");
  const [activityType, setActivityType] = useState<string>("walking");
  const [isSavingSteps, setIsSavingSteps] = useState(false);

  // Check if current activity is time-based (not step-based)
  const isTimeBased = ["cycling", "gym", "swimming", "football", "other_sports"].includes(activityType);

  // Fetch dashboard data from backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError("");

        // Fetch dashboard and scores data in parallel
        const [dashboard, scores] = await Promise.all([
          dashboardService.getDashboard(),
          dashboardService.getScores()
        ]);

        setDashboardData(dashboard);
        setScoresData(scores);
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard data");
        console.error("Dashboard load error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Fetch today's meal plan
  useEffect(() => {
    const fetchMealPlan = async () => {
      try {
        setMealPlanLoading(true);
        const token = localStorage.getItem('ecolife_token');
        console.log("Token exists:", !!token);
        console.log("Fetching meal plan...");
        const mealPlan = await mealPlanService.getTodaysMealPlan();
        console.log("Meal plan received:", mealPlan);
        setTodaysMealPlan(mealPlan);
      } catch (err: any) {
        console.error("Failed to fetch meal plan:", err);
        console.error("Error details:", err.response?.data || err.message);
      } finally {
        setMealPlanLoading(false);
      }
    };

    fetchMealPlan();
  }, []);

  // Fetch today's meal consumption status
  useEffect(() => {
    const fetchMealConsumptionStatus = async () => {
      try {
        const status = await mealConsumptionService.getTodayStatus();
        setMealConsumptionStatus(status);
        // Update mealChecked state based on API data
        setMealChecked([
          status.breakfast,
          status.lunch,
          status.dinner
        ]);
      } catch (err: any) {
        console.error("Failed to fetch meal consumption status:", err);
        // If error, keep default state (all unchecked)
      }
    };

    fetchMealConsumptionStatus();
  }, []);

  // Fetch today's activity data
  useEffect(() => {
    const fetchTodayActivity = async () => {
      try {
        const activity = await activityService.getTodayActivity();
        setTodayActivity(activity);
        // Set the input field to current steps if they exist
        if (activity && activity.steps !== null && activity.steps > 0) {
          setStepsInput(activity.steps.toString());
        }
        // Set the duration field if it exists
        if (activity && activity.duration_minutes !== null && activity.duration_minutes > 0) {
          setDurationInput(activity.duration_minutes.toString());
        }
        // Set activity type if it exists
        if (activity && activity.activity_type) {
          setActivityType(activity.activity_type);
        }
      } catch (err: any) {
        console.error("Failed to fetch today's activity:", err);
        // If error, keep default state
      }
    };

    fetchTodayActivity();
  }, []);

  // Handler for saving activity
  const handleSaveSteps = async () => {
    const isTimeBased = ["cycling", "gym", "swimming", "football", "other_sports"].includes(activityType);

    if (isTimeBased) {
      // Handle time-based activities
      const duration = parseInt(durationInput);
      if (isNaN(duration) || duration < 0) {
        alert("Please enter a valid duration in minutes");
        return;
      }

      setIsSavingSteps(true);
      try {
        const today = new Date().toISOString().split('T')[0];

        // Use the activity endpoint with duration for time-based activities
        const response = await activityService.addSteps({
          date: today,
          steps: 0, // Set steps to 0 for time-based activities
          activity_type: activityType,
          duration_minutes: duration
        });

        setTodayActivity(response.activity);
        console.log("Activity saved successfully");
      } catch (err: any) {
        console.error("Failed to save activity:", err);
        alert("Failed to save activity. Please try again.");
      } finally {
        setIsSavingSteps(false);
      }
    } else {
      // Handle step-based activities
      const steps = parseInt(stepsInput);
      if (isNaN(steps) || steps < 0) {
        alert("Please enter a valid number of steps");
        return;
      }

      setIsSavingSteps(true);
      try {
        const today = new Date().toISOString().split('T')[0];

        const response = await activityService.addSteps({
          date: today,
          steps: steps,
          activity_type: activityType
        });

        setTodayActivity(response.activity);
        console.log(response.message);
      } catch (err: any) {
        console.error("Failed to save steps:", err);
        alert("Failed to save steps. Please try again.");
      } finally {
        setIsSavingSteps(false);
      }
    }
  };

  // Handler for marking/unmarking meals
  const handleMealToggle = async (index: number) => {
    const mealTypes: ('breakfast' | 'lunch' | 'dinner')[] = ['breakfast', 'lunch', 'dinner'];
    const mealType = mealTypes[index];
    const isCurrentlyChecked = mealChecked[index];

    // Optimistically update UI
    const newChecked = [...mealChecked];
    newChecked[index] = !isCurrentlyChecked;
    setMealChecked(newChecked);

    try {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

      if (isCurrentlyChecked) {
        // Unmark the meal
        await mealConsumptionService.unmarkMealConsumed({
          date: today,
          meal_type: mealType
        });
      } else {
        // Mark the meal as consumed
        await mealConsumptionService.markMealConsumed({
          date: today,
          meal_type: mealType
        });
      }

      // Refresh meal consumption status
      const status = await mealConsumptionService.getTodayStatus();
      setMealConsumptionStatus(status);
    } catch (err: any) {
      console.error("Failed to update meal consumption:", err);
      // Revert optimistic update on error
      const revertedChecked = [...mealChecked];
      revertedChecked[index] = isCurrentlyChecked;
      setMealChecked(revertedChecked);
    }
  };

  // Build meals array from today's meal plan or use defaults
  const meals = todaysMealPlan ? [
    {
      name: todaysMealPlan.breakfast.name,
      description: todaysMealPlan.breakfast.description,
      icon: "☀️",
      calories: todaysMealPlan.breakfast.calories,
      carbon: todaysMealPlan.breakfast.carbon_footprint,
      protein: todaysMealPlan.breakfast.protein,
      carbs: todaysMealPlan.breakfast.carbs,
      fats: todaysMealPlan.breakfast.fats,
      ingredients: todaysMealPlan.breakfast.ingredients,
      cookingTime: todaysMealPlan.breakfast.cooking_time
    },
    {
      name: todaysMealPlan.lunch.name,
      description: todaysMealPlan.lunch.description,
      icon: "🌤️",
      calories: todaysMealPlan.lunch.calories,
      carbon: todaysMealPlan.lunch.carbon_footprint,
      protein: todaysMealPlan.lunch.protein,
      carbs: todaysMealPlan.lunch.carbs,
      fats: todaysMealPlan.lunch.fats,
      ingredients: todaysMealPlan.lunch.ingredients,
      cookingTime: todaysMealPlan.lunch.cooking_time
    },
    {
      name: todaysMealPlan.dinner.name,
      description: todaysMealPlan.dinner.description,
      icon: "🌙",
      calories: todaysMealPlan.dinner.calories,
      carbon: todaysMealPlan.dinner.carbon_footprint,
      protein: todaysMealPlan.dinner.protein,
      carbs: todaysMealPlan.dinner.carbs,
      fats: todaysMealPlan.dinner.fats,
      ingredients: todaysMealPlan.dinner.ingredients,
      cookingTime: todaysMealPlan.dinner.cooking_time
    }
  ] : [
    { name: "Breakfast", description: "Start your day right", icon: "☀️", calories: 350, carbon: 0.5, protein: 12, carbs: 45, fats: 10, ingredients: [], cookingTime: 10 },
    { name: "Lunch", description: "Midday fuel", icon: "🌤️", calories: 450, carbon: 0.7, protein: 18, carbs: 55, fats: 12, ingredients: [], cookingTime: 20 },
    { name: "Dinner", description: "Evening meal", icon: "🌙", calories: 500, carbon: 0.6, protein: 24, carbs: 60, fats: 15, ingredients: [], cookingTime: 30 }
  ];

  const stats = {
    carbonCredits: dashboardData?.total_carbon_savings || 0,
    treesEquivalent: Math.round((dashboardData?.total_carbon_savings || 0) / 20), // 1 tree ≈ 20kg CO2 per year
    streak: dashboardData?.streak_days || 0,
    totalImpact: Math.round((scoresData?.eco_score || 0) + (scoresData?.wellness_score || 0)) / 2
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-green-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center"
              >
                <Leaf className="w-5 h-5 text-green-600" />
              </motion.div>
              <div>
                <h1 className="text-xl text-green-900">Eco Life</h1>
                <p className="text-sm text-green-600">Your Green Journey</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className="text-sm text-green-600">Total Credits</div>
                <div className="text-xl text-green-700">🌱 {stats.carbonCredits}</div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="text-green-600 hover:text-green-700 hover:bg-green-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
            <p className="text-green-700 text-lg">Loading your dashboard...</p>
          </motion.div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="max-w-2xl mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-2xl p-6"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-red-900 font-semibold mb-2">Failed to Load Dashboard</h3>
                <p className="text-red-700 text-sm">{error}</p>
                <Button
                  onClick={() => window.location.reload()}
                  className="mt-4 bg-red-600 hover:bg-red-700 text-white rounded-full"
                >
                  Retry
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Dashboard Content */}
      {!isLoading && !error && (
        <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-8 mb-8 text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-3xl mb-2">Welcome back, {userName}! 🌿</h2>
                <p className="text-green-100">Day {currentDay} of your {totalDays}-day journey</p>
              </div>
              <div className="text-right">
                <div className="text-4xl mb-1">{stats.streak}</div>
                <div className="text-sm text-green-100">Day Streak 🔥</div>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-green-100">Overall Progress</span>
                <span className="text-sm text-green-100">{Math.round((currentDay / totalDays) * 100)}%</span>
              </div>
              <Progress value={(currentDay / totalDays) * 100} className="h-2 bg-white/20" />
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Meals */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6 bg-white/80 backdrop-blur-sm border-green-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Utensils className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl text-green-900">
                        {todaysMealPlan ? `Day ${todaysMealPlan.day} Meal Plan` : "Today's Meal Plan"}
                      </h3>
                      <p className="text-sm text-green-600">
                        {todaysMealPlan ? todaysMealPlan.date : "Track your eco-friendly meals"}
                      </p>
                    </div>
                  </div>
                  {!todaysMealPlan && !mealPlanLoading && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-green-600 border-green-300 hover:bg-green-50"
                      onClick={async () => {
                        try {
                          setMealPlanLoading(true);
                          // Regenerate meal plan synchronously
                          const newPlan = await mealPlanService.regenerateMealPlan({});
                          console.log("Meal plan generated:", newPlan);
                          // Fetch today's meal plan
                          const mealPlan = await mealPlanService.getTodaysMealPlan();
                          setTodaysMealPlan(mealPlan);
                        } catch (err: any) {
                          console.error("Failed to generate meal plan:", err);
                          alert("Failed to generate meal plan. Please try again.");
                        } finally {
                          setMealPlanLoading(false);
                        }
                      }}
                    >
                      <Sparkles className="w-4 h-4 mr-1" />
                      Generate Plan
                    </Button>
                  )}
                </div>

                {mealPlanLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      {meals.map((meal, index) => (
                        <motion.div
                          key={meal.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + index * 0.1 }}
                          className="p-4 bg-green-50/50 rounded-2xl hover:bg-green-50 transition-colors"
                        >
                          <div className="flex items-start gap-4">
                            <div className="text-3xl">{meal.icon}</div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <h4 className="text-green-900 font-semibold">{meal.name}</h4>
                                  <p className="text-sm text-green-600">{meal.description}</p>
                                </div>
                                <button
                                  onClick={() => handleMealToggle(index)}
                                  className="w-8 h-8 rounded-full border-2 border-green-300 flex items-center justify-center hover:bg-green-100 transition-colors"
                                >
                                  {mealChecked[index] ? (
                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                  ) : (
                                    <Circle className="w-5 h-5 text-green-300" />
                                  )}
                                </button>
                              </div>

                              {/* Nutrition info */}
                              <div className="flex flex-wrap items-center gap-4 mt-2 mb-3">
                                <span className="text-xs bg-white px-2 py-1 rounded-full text-green-700">
                                  {meal.calories} cal
                                </span>
                                <span className="text-xs bg-white px-2 py-1 rounded-full text-green-700">
                                  {meal.protein}g protein
                                </span>
                                <span className="text-xs bg-white px-2 py-1 rounded-full text-green-700">
                                  {meal.carbs}g carbs
                                </span>
                                <span className="text-xs bg-white px-2 py-1 rounded-full text-green-700">
                                  {meal.fats}g fats
                                </span>
                                <span className="text-xs bg-emerald-100 px-2 py-1 rounded-full text-emerald-700">
                                  🌱 {meal.carbon}kg CO₂
                                </span>
                                <span className="text-xs bg-blue-100 px-2 py-1 rounded-full text-blue-700">
                                  ⏱️ {meal.cookingTime} min
                                </span>
                              </div>

                              {/* Ingredients (only show if meal plan exists) */}
                              {todaysMealPlan && meal.ingredients.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-xs text-green-600 mb-1">Ingredients:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {meal.ingredients.slice(0, 5).map((ingredient, i) => (
                                      <span key={i} className="text-xs bg-white px-2 py-0.5 rounded-full text-green-600">
                                        {ingredient}
                                      </span>
                                    ))}
                                    {meal.ingredients.length > 5 && (
                                      <span className="text-xs text-green-600">
                                        +{meal.ingredients.length - 5} more
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Summary */}
                    <div className="mt-6 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                      {todaysMealPlan ? (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-emerald-700">
                            <Sparkles className="w-5 h-5" />
                            <span className="text-sm font-semibold">Today's Total</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-emerald-700">
                              {todaysMealPlan.total_calories} calories
                            </span>
                            <span className="text-emerald-700">
                              🌱 {todaysMealPlan.total_carbon.toFixed(2)}kg CO₂
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-emerald-700">
                          <Sparkles className="w-5 h-5" />
                          <span className="text-sm">Complete all meals to earn 3 carbon credits! 🌿</span>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </Card>
            </motion.div>

            {/* Activity Tracker */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6 bg-white/80 backdrop-blur-sm border-green-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Dumbbell className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl text-green-900">Daily Activity</h3>
                    <p className="text-sm text-green-600">Track your daily activity</p>
                  </div>
                </div>

                {/* Activity Type Selector */}
                <div className="mb-4">
                  <label className="block text-sm text-green-700 mb-2 font-medium">
                    Activity Type
                  </label>
                  <select
                    value={activityType}
                    onChange={(e) => setActivityType(e.target.value)}
                    className="w-full px-4 py-3 border border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-green-900 bg-white"
                  >
                    <option value="walking">🚶 Walking</option>
                    <option value="running">🏃 Running</option>
                    <option value="jogging">🏃‍♂️ Jogging</option>
                    <option value="cycling">🚴 Cycling</option>
                    <option value="gym">💪 Gym Exercise</option>
                    <option value="swimming">🏊 Swimming</option>
                    <option value="football">⚽ Football</option>
                    <option value="other_sports">🏅 Other Sports</option>
                  </select>
                </div>

                {/* Activity Input Field - Steps or Duration */}
                <div className="mb-6">
                  <label className="block text-sm text-green-700 mb-2 font-medium">
                    {isTimeBased ? "Duration (minutes)" : "Steps Count"}
                  </label>
                  <div className="flex gap-2">
                    {isTimeBased ? (
                      <input
                        type="number"
                        value={durationInput}
                        onChange={(e) => setDurationInput(e.target.value)}
                        placeholder="Enter duration in minutes"
                        className="flex-1 px-4 py-3 border border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-green-900"
                        min="0"
                        max="1440"
                      />
                    ) : (
                      <input
                        type="number"
                        value={stepsInput}
                        onChange={(e) => setStepsInput(e.target.value)}
                        placeholder="Enter your steps"
                        className="flex-1 px-4 py-3 border border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-green-900"
                        min="0"
                        max="100000"
                      />
                    )}
                    <Button
                      onClick={handleSaveSteps}
                      disabled={isSavingSteps || (isTimeBased ? !durationInput : !stepsInput)}
                      className="px-6 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                    >
                      {isSavingSteps ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        "Update"
                      )}
                    </Button>
                  </div>
                </div>

                {/* Steps Progress Display */}
                {todayActivity && todayActivity.steps !== null && todayActivity.steps > 0 && (
                  <>
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Footprints className="w-5 h-5 text-green-600" />
                          <span className="text-sm text-green-700">Today's Steps</span>
                        </div>
                        <span className="text-sm text-green-700 font-semibold">
                          {todayActivity.steps.toLocaleString()} steps
                        </span>
                      </div>
                      <Progress
                        value={Math.min((todayActivity.steps / 10000) * 100, 100)}
                        className="h-3 bg-green-100"
                      />
                      <p className="text-xs text-green-600 mt-1 text-center">
                        Goal: 10,000 steps
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50 rounded-2xl p-4 text-center">
                        <div className="text-2xl text-green-700 mb-1">
                          {Math.round((todayActivity.steps / 10000) * 100)}%
                        </div>
                        <div className="text-sm text-green-600">Complete</div>
                      </div>
                      <div className="bg-emerald-50 rounded-2xl p-4 text-center">
                        <div className="text-2xl text-emerald-700 mb-1">
                          🔥 {todayActivity.calories_burned?.toFixed(0) || 0}
                        </div>
                        <div className="text-sm text-emerald-600">Calories</div>
                      </div>
                    </div>
                  </>
                )}
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Impact Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-6 bg-white/80 backdrop-blur-sm border-green-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-xl text-green-900">Your Impact</h3>
                    <p className="text-sm text-green-600">Keep going!</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-green-700">Carbon Credits</span>
                      <Leaf className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-3xl text-green-900 mb-1">{stats.carbonCredits}</div>
                    <div className="text-xs text-green-600">🌱 Growing daily</div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-blue-700">Trees Planted</span>
                      <span className="text-2xl">🌳</span>
                    </div>
                    <div className="text-3xl text-blue-900 mb-1">{stats.treesEquivalent}</div>
                    <div className="text-xs text-blue-600">Equivalent impact</div>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-orange-700">Total Impact</span>
                      <Award className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="text-3xl text-orange-900 mb-1">{stats.totalImpact}%</div>
                    <div className="text-xs text-orange-600">Above average</div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* AI Assistant Promo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="p-6 bg-gradient-to-br from-green-600 to-emerald-600 border-none text-white overflow-hidden relative">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl">AI Assistant</h3>
                      <div className="flex items-center gap-1 text-green-100 text-sm">
                        <Zap className="w-3 h-3" />
                        <span>Premium Feature</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-green-50 text-sm mb-6">
                    Get personalized meal tips, smart reminders, and eco challenges with your AI companion! 🌿
                  </p>
                  
                  <Button
                    onClick={() => setShowAssistantSubscription(true)}
                    className="w-full bg-white text-green-700 hover:bg-green-50 rounded-full"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Unlock Assistant
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="p-6 bg-white/80 backdrop-blur-sm border-green-100">
                <h3 className="text-xl text-green-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start rounded-full border-green-200 hover:bg-green-50"
                    onClick={() => setShowWeeklyDietChart(true)}
                  >
                    <Calendar className="w-5 h-5 mr-2 text-green-600" />
                    View Full Week
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start rounded-full border-green-200 hover:bg-green-50"
                    onClick={() => setShowHealthInsights(true)}
                  >
                    <Heart className="w-5 h-5 mr-2 text-green-600" />
                    Health Insights
                  </Button>
                  <Button variant="outline" className="w-full justify-start rounded-full border-green-200 hover:bg-green-50">
                    <Award className="w-5 h-5 mr-2 text-green-600" />
                    My Achievements
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Tip of the Day */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="p-6 bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-100">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">💡</div>
                  <div>
                    <h4 className="text-green-900 mb-2">Tip of the Day</h4>
                    <p className="text-sm text-green-700">
                      Bring a reusable water bottle everywhere! This simple habit can save up to 167 plastic bottles per year per person.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
        </div>
      )}

      {/* Assistant Subscription Modal */}
      <AnimatePresence>
        {showAssistantSubscription && (
          <AssistantSubscription onClose={() => setShowAssistantSubscription(false)} />
        )}
      </AnimatePresence>

      {/* Weekly Diet Chart Modal */}
      <AnimatePresence>
        {showWeeklyDietChart && (
          <WeeklyDietChart onClose={() => setShowWeeklyDietChart(false)} />
        )}
      </AnimatePresence>

      {/* Health Insights Modal */}
      <AnimatePresence>
        {showHealthInsights && (
          <HealthInsightsModal
            isOpen={showHealthInsights}
            onClose={() => setShowHealthInsights(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
