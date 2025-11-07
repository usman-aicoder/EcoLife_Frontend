import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  X,
  Calendar,
  Edit2,
  Save,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Utensils,
  RefreshCw,
} from "lucide-react";
import { mealPlanService, MealPlan, DayMeals, MealDetail } from "../services/mealPlan";

interface WeeklyDietChartProps {
  onClose: () => void;
}

export function WeeklyDietChart({ onClose }: WeeklyDietChartProps) {
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [editedMealPlan, setEditedMealPlan] = useState<DayMeals[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);

  // Swap meal states
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [swapContext, setSwapContext] = useState<{dayIndex: number, mealType: 'breakfast' | 'lunch' | 'dinner'} | null>(null);

  // Fetch the full week's meal plan
  useEffect(() => {
    const fetchWeeklyMealPlan = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await mealPlanService.getMyMealPlans(1, 0);

        if (response.meal_plans.length === 0) {
          setError("No meal plan found. Please generate one first.");
          setIsLoading(false);
          return;
        }

        const latestPlan = response.meal_plans[0];

        if (latestPlan.status !== 'completed' || !latestPlan.meals) {
          setError("Meal plan is not ready yet. Please wait for generation to complete.");
          setIsLoading(false);
          return;
        }

        setMealPlan(latestPlan);
        setEditedMealPlan(JSON.parse(JSON.stringify(latestPlan.meals))); // Deep copy
      } catch (err: any) {
        setError(err.message || "Failed to load meal plan");
        console.error("Error fetching weekly meal plan:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeeklyMealPlan();
  }, []);

  // Handle meal detail edit
  const handleMealEdit = (
    dayIndex: number,
    mealType: 'breakfast' | 'lunch' | 'dinner',
    field: keyof MealDetail,
    value: string | number
  ) => {
    const updated = [...editedMealPlan];
    (updated[dayIndex][mealType] as any)[field] = value;
    setEditedMealPlan(updated);
  };

  // Handle save changes
  const handleSave = async () => {
    if (!mealPlan) return;

    setIsSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      // Call real API to update meal plan
      const updatedMealPlan = await mealPlanService.updateMealPlan(
        mealPlan.id,
        editedMealPlan
      );

      setSuccessMessage("Meal plan updated successfully!");
      setIsEditMode(false);

      // Update the original meal plan with server response
      setMealPlan(updatedMealPlan);
      setEditedMealPlan(JSON.parse(JSON.stringify(updatedMealPlan.meals)));

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || "Failed to save changes");
      console.error("Error saving meal plan:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    if (mealPlan) {
      setEditedMealPlan(JSON.parse(JSON.stringify(mealPlan.meals)));
    }
    setIsEditMode(false);
  };

  // Handle opening swap modal
  const handleOpenSwapModal = (dayIndex: number, mealType: 'breakfast' | 'lunch' | 'dinner') => {
    if (!mealPlan) return;
    setSwapContext({ dayIndex, mealType });
    setShowSwapModal(true);
    setError("");
  };

  // Handle meal swap between days
  const handleSwapMealWithDay = async (targetDayIndex: number) => {
    if (!mealPlan || !swapContext) return;

    setIsSaving(true);
    setError("");

    try {
      const { dayIndex: sourceDayIndex, mealType } = swapContext;

      // Create a copy of the meal plan
      const updatedMeals = [...editedMealPlan];

      // Get both meals
      const sourceMeal = updatedMeals[sourceDayIndex][mealType];
      const targetMeal = updatedMeals[targetDayIndex][mealType];

      // Swap the meals
      updatedMeals[sourceDayIndex][mealType] = targetMeal;
      updatedMeals[targetDayIndex][mealType] = sourceMeal;

      // Recalculate totals for both days
      for (const dayIdx of [sourceDayIndex, targetDayIndex]) {
        const day = updatedMeals[dayIdx];
        day.total_calories = day.breakfast.calories + day.lunch.calories + day.dinner.calories;
        day.total_carbon = parseFloat((day.breakfast.carbon_footprint + day.lunch.carbon_footprint + day.dinner.carbon_footprint).toFixed(2));
      }

      // Update via API
      const updatedMealPlan = await mealPlanService.updateMealPlan(
        mealPlan.id,
        updatedMeals
      );

      // Update local state
      setMealPlan(updatedMealPlan);
      setEditedMealPlan(JSON.parse(JSON.stringify(updatedMealPlan.meals)));

      // Close modal and show success
      setShowSwapModal(false);
      setSwapContext(null);
      setSuccessMessage(`${mealType.charAt(0).toUpperCase() + mealType.slice(1)} swapped with Day ${targetDayIndex + 1} successfully!`);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || "Failed to swap meal");
      console.error("Error swapping meal:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // Navigation
  const goToPreviousDay = () => {
    setCurrentDayIndex((prev) => Math.max(0, prev - 1));
  };

  const goToNextDay = () => {
    setCurrentDayIndex((prev) => Math.min(6, prev + 1));
  };

  const getMealIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast':
        return '☀️';
      case 'lunch':
        return '🌤️';
      case 'dinner':
        return '🌙';
      default:
        return '🍽️';
    }
  };

  const renderMealCard = (
    meal: MealDetail,
    mealType: 'breakfast' | 'lunch' | 'dinner',
    dayIndex: number
  ) => {
    const mealTypeCapitalized = mealType.charAt(0).toUpperCase() + mealType.slice(1);

    return (
      <div className="bg-white rounded-2xl p-6 border-2 border-green-100 hover:border-green-300 transition-all">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-4xl">{getMealIcon(mealType)}</div>
          <div className="flex-1">
            <h4 className="text-lg text-green-900 font-semibold">{mealTypeCapitalized}</h4>
          </div>
        </div>

        {isEditMode ? (
          <div className="space-y-3">
            <div>
              <Label className="text-sm text-green-700 mb-1 block">Meal Name</Label>
              <Input
                value={meal.name}
                onChange={(e) => handleMealEdit(dayIndex, mealType, 'name', e.target.value)}
                className="rounded-xl border-green-200"
              />
            </div>
            <div>
              <Label className="text-sm text-green-700 mb-1 block">Description</Label>
              <Input
                value={meal.description}
                onChange={(e) => handleMealEdit(dayIndex, mealType, 'description', e.target.value)}
                className="rounded-xl border-green-200"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm text-green-700 mb-1 block">Calories</Label>
                <Input
                  type="number"
                  value={meal.calories}
                  onChange={(e) => handleMealEdit(dayIndex, mealType, 'calories', parseFloat(e.target.value))}
                  className="rounded-xl border-green-200"
                />
              </div>
              <div>
                <Label className="text-sm text-green-700 mb-1 block">Protein (g)</Label>
                <Input
                  type="number"
                  value={meal.protein}
                  onChange={(e) => handleMealEdit(dayIndex, mealType, 'protein', parseFloat(e.target.value))}
                  className="rounded-xl border-green-200"
                />
              </div>
              <div>
                <Label className="text-sm text-green-700 mb-1 block">Carbs (g)</Label>
                <Input
                  type="number"
                  value={meal.carbs}
                  onChange={(e) => handleMealEdit(dayIndex, mealType, 'carbs', parseFloat(e.target.value))}
                  className="rounded-xl border-green-200"
                />
              </div>
              <div>
                <Label className="text-sm text-green-700 mb-1 block">Fats (g)</Label>
                <Input
                  type="number"
                  value={meal.fats}
                  onChange={(e) => handleMealEdit(dayIndex, mealType, 'fats', parseFloat(e.target.value))}
                  className="rounded-xl border-green-200"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h5 className="text-green-900 font-semibold">{meal.name}</h5>
                <p className="text-sm text-green-600 mt-1">{meal.description}</p>
              </div>
              <Button
                onClick={() => handleOpenSwapModal(dayIndex, mealType)}
                variant="outline"
                size="sm"
                className="ml-2 shrink-0 rounded-full border-green-300 text-green-700 hover:bg-green-50"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Swap
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-green-50 px-3 py-1 rounded-full text-green-700 border border-green-100">
                {meal.calories} cal
              </span>
              <span className="text-xs bg-blue-50 px-3 py-1 rounded-full text-blue-700 border border-blue-100">
                {meal.protein}g protein
              </span>
              <span className="text-xs bg-orange-50 px-3 py-1 rounded-full text-orange-700 border border-orange-100">
                {meal.carbs}g carbs
              </span>
              <span className="text-xs bg-purple-50 px-3 py-1 rounded-full text-purple-700 border border-purple-100">
                {meal.fats}g fats
              </span>
              <span className="text-xs bg-emerald-50 px-3 py-1 rounded-full text-emerald-700 border border-emerald-100">
                🌱 {meal.carbon_footprint}kg CO₂
              </span>
            </div>
            {meal.ingredients && meal.ingredients.length > 0 && (
              <div>
                <p className="text-xs text-green-600 mb-1">Ingredients:</p>
                <div className="flex flex-wrap gap-1">
                  {meal.ingredients.slice(0, 6).map((ingredient, i) => (
                    <span key={i} className="text-xs bg-white px-2 py-0.5 rounded-full text-green-600 border border-green-100">
                      {ingredient}
                    </span>
                  ))}
                  {meal.ingredients.length > 6 && (
                    <span className="text-xs text-green-600">
                      +{meal.ingredients.length - 6} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-3xl p-12 text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-green-700 text-lg">Loading your meal plan...</p>
        </motion.div>
      </motion.div>
    );
  }

  const currentDay = editedMealPlan[currentDayIndex];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 50 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 sticky top-0 z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">Weekly Diet Chart</h2>
                <p className="text-green-100 text-sm">View and edit your 7-day meal plan</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Day Navigation */}
          <div className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-2xl p-4">
            <button
              onClick={goToPreviousDay}
              disabled={currentDayIndex === 0}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="text-center">
              <div className="text-2xl font-semibold">Day {currentDay?.day || currentDayIndex + 1}</div>
              <div className="text-sm text-green-100">{currentDay?.date || 'Loading...'}</div>
            </div>
            <button
              onClick={goToNextDay}
              disabled={currentDayIndex === 6}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 280px)' }}>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-900 font-semibold">Error</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 flex items-start gap-3"
            >
              <div className="text-2xl">✅</div>
              <div>
                <p className="text-green-900 font-semibold">Success!</p>
                <p className="text-green-700 text-sm">{successMessage}</p>
              </div>
            </motion.div>
          )}

          {currentDay && (
            <div className="space-y-6">
              {/* Breakfast */}
              {renderMealCard(currentDay.breakfast, 'breakfast', currentDayIndex)}

              {/* Lunch */}
              {renderMealCard(currentDay.lunch, 'lunch', currentDayIndex)}

              {/* Dinner */}
              {renderMealCard(currentDay.dinner, 'dinner', currentDayIndex)}

              {/* Daily Summary */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border-2 border-emerald-200">
                <h4 className="text-lg text-emerald-900 font-semibold mb-4 flex items-center gap-2">
                  <Utensils className="w-5 h-5" />
                  Daily Summary
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-4 border border-emerald-100">
                    <p className="text-sm text-emerald-600 mb-1">Total Calories</p>
                    <p className="text-2xl text-emerald-900 font-semibold">{currentDay.total_calories}</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-emerald-100">
                    <p className="text-sm text-emerald-600 mb-1">Carbon Footprint</p>
                    <p className="text-2xl text-emerald-900 font-semibold">🌱 {currentDay.total_carbon.toFixed(2)}kg</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-white/80 backdrop-blur-sm border-t border-green-200 p-6 sticky bottom-0">
          <div className="flex items-center justify-between gap-4">
            {isEditMode ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                  className="rounded-full border-green-300 text-green-700 hover:bg-green-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="rounded-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-8"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </>
            ) : (
              <>
                <div className="text-sm text-green-600">
                  {editedMealPlan.length} days in your meal plan
                </div>
                <Button
                  onClick={() => setIsEditMode(true)}
                  className="rounded-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-8"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Meal Plan
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Swap Meal Modal */}
        <AnimatePresence>
          {showSwapModal && swapContext && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowSwapModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-green-900">
                    Swap Day {swapContext.dayIndex + 1} {swapContext.mealType} with...
                  </h3>
                  <button
                    onClick={() => setShowSwapModal(false)}
                    className="w-8 h-8 rounded-full bg-green-50 hover:bg-green-100 flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4 text-green-700" />
                  </button>
                </div>

                <p className="text-sm text-green-600 mb-4">
                  Current meal: <span className="font-semibold">{editedMealPlan[swapContext.dayIndex][swapContext.mealType].name}</span>
                </p>

                <div className="space-y-3">
                  {editedMealPlan.map((day, dayIndex) => {
                    // Don't show the current day
                    if (dayIndex === swapContext.dayIndex) return null;

                    const meal = day[swapContext.mealType];

                    return (
                      <div
                        key={dayIndex}
                        className="border-2 border-green-100 rounded-xl p-4 hover:border-green-300 transition-all cursor-pointer"
                        onClick={() => !isSaving && handleSwapMealWithDay(dayIndex)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                Day {day.day}
                              </span>
                              <span className="text-xs text-green-600">{day.date}</span>
                            </div>
                            <h4 className="text-green-900 font-semibold">{meal.name}</h4>
                            <p className="text-sm text-green-600 mt-1">{meal.description}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <span className="text-xs bg-green-50 px-2 py-1 rounded-full text-green-700 border border-green-100">
                                {meal.calories} cal
                              </span>
                              <span className="text-xs bg-blue-50 px-2 py-1 rounded-full text-blue-700 border border-blue-100">
                                {meal.protein}g protein
                              </span>
                              <span className="text-xs bg-orange-50 px-2 py-1 rounded-full text-orange-700 border border-orange-100">
                                {meal.carbs}g carbs
                              </span>
                              <span className="text-xs bg-purple-50 px-2 py-1 rounded-full text-purple-700 border border-purple-100">
                                {meal.fats}g fats
                              </span>
                              <span className="text-xs bg-emerald-50 px-2 py-1 rounded-full text-emerald-700 border border-emerald-100">
                                🌱 {meal.carbon_footprint}kg CO₂
                              </span>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            disabled={isSaving}
                            className="ml-3 shrink-0 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                          >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Swap'}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
