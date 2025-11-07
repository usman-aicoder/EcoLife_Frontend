import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Activity, Utensils, Flame, TrendingUp, Calendar, Award } from 'lucide-react';
import { healthInsightsService, DailyInsights, WeeklyInsights } from '../services/healthInsights';

interface HealthInsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HealthInsightsModal({ isOpen, onClose }: HealthInsightsModalProps) {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly'>('daily');
  const [dailyInsights, setDailyInsights] = useState<DailyInsights | null>(null);
  const [weeklyInsights, setWeeklyInsights] = useState<WeeklyInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadInsights();
    }
  }, [isOpen]);

  const loadInsights = async () => {
    try {
      setLoading(true);
      setError(null);
      const [daily, weekly] = await Promise.all([
        healthInsightsService.getDailyInsights(),
        healthInsightsService.getWeeklyInsights()
      ]);
      setDailyInsights(daily);
      setWeeklyInsights(weekly);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load health insights');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
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
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">Health Insights</h2>
                  <p className="text-green-100 mt-0.5 text-xs">Your personalized health analysis</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => setActiveTab('daily')}
                  className={`px-4 py-1.5 rounded-lg font-medium text-sm transition-all ${
                    activeTab === 'daily'
                      ? 'bg-white text-green-600 shadow-lg'
                      : 'bg-green-600/30 text-white hover:bg-green-600/50'
                  }`}
                >
                  Today
                </button>
                <button
                  onClick={() => setActiveTab('weekly')}
                  className={`px-4 py-1.5 rounded-lg font-medium text-sm transition-all ${
                    activeTab === 'weekly'
                      ? 'bg-white text-green-600 shadow-lg'
                      : 'bg-green-600/30 text-white hover:bg-green-600/50'
                  }`}
                >
                  This Week
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 overflow-y-auto flex-1">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-600 font-medium">{error}</p>
                  <button
                    onClick={loadInsights}
                    className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Retry
                  </button>
                </div>
              ) : activeTab === 'daily' && dailyInsights ? (
                <DailyInsightsView insights={dailyInsights} />
              ) : activeTab === 'weekly' && weeklyInsights ? (
                <WeeklyInsightsView insights={weeklyInsights} />
              ) : null}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DailyInsightsView({ insights }: { insights: DailyInsights }) {
  return (
    <div className="space-y-3">
      {/* Activity Section */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 bg-blue-500 rounded-lg">
            <Activity className="text-white" size={18} />
          </div>
          <h3 className="text-base font-bold text-gray-800">Activity Progress</h3>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium text-sm">Steps</span>
            <span className="text-base font-bold text-blue-600">
              {insights.activity.steps.toLocaleString()} / {insights.activity.steps_goal.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(insights.activity.percentage, 100)}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-600">{insights.activity.percentage}% Complete</span>
            {insights.activity.goal_achieved && (
              <span className="text-green-600 font-semibold">Goal Achieved!</span>
            )}
          </div>
          <div className="mt-2 pt-2 border-t border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 text-sm">Calories Burned</span>
              <span className="text-base font-bold text-orange-600">
                {insights.activity.calories_burned} kcal
              </span>
            </div>
          </div>
          <p className="text-gray-600 italic text-xs mt-2">{insights.activity.message}</p>
        </div>
      </div>

      {/* Meals Section */}
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 bg-purple-500 rounded-lg">
            <Utensils className="text-white" size={18} />
          </div>
          <h3 className="text-base font-bold text-gray-800">Meal Tracking</h3>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium text-sm">Meals Logged</span>
            <span className="text-base font-bold text-purple-600">
              {insights.meals.meals_consumed} / {insights.meals.total_meals}
            </span>
          </div>
          <div className="w-full bg-purple-200 rounded-full h-2.5">
            <div
              className="bg-purple-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${insights.meals.percentage}%` }}
            />
          </div>
          <div className="flex gap-2 mt-2">
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                insights.meals.breakfast
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              Breakfast
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                insights.meals.lunch ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              Lunch
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                insights.meals.dinner ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              Dinner
            </span>
          </div>
          <p className="text-gray-600 italic text-xs mt-2">{insights.meals.message}</p>
        </div>
      </div>

      {/* Calories Section */}
      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 bg-orange-500 rounded-lg">
            <Flame className="text-white" size={18} />
          </div>
          <h3 className="text-base font-bold text-gray-800">Calorie Balance</h3>
        </div>
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-gray-600 text-xs">Consumed</p>
              <p className="text-xl font-bold text-orange-600">{insights.calories.consumed}</p>
            </div>
            <div>
              <p className="text-gray-600 text-xs">Target</p>
              <p className="text-xl font-bold text-gray-700">{insights.calories.target}</p>
            </div>
          </div>
          <div className="w-full bg-orange-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full transition-all duration-500 ${
                insights.calories.status === 'over' ? 'bg-red-500' : 'bg-orange-600'
              }`}
              style={{ width: `${Math.min(insights.calories.percentage, 100)}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-600">{insights.calories.percentage}% of target</span>
            <span
              className={`font-semibold ${
                insights.calories.status === 'on_track' ? 'text-green-600' : 'text-orange-600'
              }`}
            >
              {insights.calories.difference > 0 ? '+' : ''}
              {insights.calories.difference} kcal
            </span>
          </div>
          <p className="text-gray-600 italic text-xs mt-2">{insights.calories.message}</p>
        </div>
      </div>

      {/* Recommendations */}
      {insights.recommendations.length > 0 && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-green-500 rounded-lg">
              <TrendingUp className="text-white" size={18} />
            </div>
            <h3 className="text-base font-bold text-gray-800">Recommendations</h3>
          </div>
          <ul className="space-y-1.5">
            {insights.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5 text-sm">•</span>
                <span className="text-gray-700 text-sm">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function WeeklyInsightsView({ insights }: { insights: WeeklyInsights }) {
  return (
    <div className="space-y-3">
      {/* Streak & Consistency */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-orange-500 rounded-lg">
              <Flame className="text-white" size={18} />
            </div>
            <h3 className="text-sm font-bold text-gray-800">Streak</h3>
          </div>
          <p className="text-2xl font-bold text-orange-600 mt-1">{insights.streak}</p>
          <p className="text-gray-600 text-xs mt-0.5">days active</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-green-500 rounded-lg">
              <Award className="text-white" size={18} />
            </div>
            <h3 className="text-sm font-bold text-gray-800">Consistency</h3>
          </div>
          <p className="text-2xl font-bold text-green-600 mt-1">{insights.consistency_score}%</p>
          <p className="text-gray-600 text-xs mt-0.5">overall score</p>
        </div>
      </div>

      {/* Activity Summary */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 bg-blue-500 rounded-lg">
            <Activity className="text-white" size={18} />
          </div>
          <h3 className="text-base font-bold text-gray-800">Activity Summary</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-gray-600 text-xs">Total Steps</p>
            <p className="text-lg font-bold text-blue-600">
              {insights.activity_summary.total_steps.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-xs">Avg Steps/Day</p>
            <p className="text-lg font-bold text-blue-600">
              {insights.activity_summary.avg_steps.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-xs">Total Calories</p>
            <p className="text-lg font-bold text-orange-600">
              {insights.activity_summary.total_calories.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-xs">Goal Days</p>
            <p className="text-lg font-bold text-green-600">
              {insights.activity_summary.goal_days} / {insights.activity_summary.days_active}
            </p>
          </div>
        </div>
        <p className="text-gray-600 italic text-xs mt-2">{insights.activity_summary.message}</p>
      </div>

      {/* Meal Summary */}
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 bg-purple-500 rounded-lg">
            <Utensils className="text-white" size={18} />
          </div>
          <h3 className="text-base font-bold text-gray-800">Meal Summary</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-gray-600 text-xs">Meals Logged</p>
            <p className="text-lg font-bold text-purple-600">
              {insights.meal_summary.meals_logged} / {insights.meal_summary.total_possible}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-xs">Completion Rate</p>
            <p className="text-lg font-bold text-purple-600">{insights.meal_summary.percentage}%</p>
          </div>
          <div>
            <p className="text-gray-600 text-xs">Breakfast</p>
            <p className="text-lg font-bold text-yellow-600">
              {insights.meal_summary.breakfast_count}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-xs">Lunch</p>
            <p className="text-lg font-bold text-orange-600">{insights.meal_summary.lunch_count}</p>
          </div>
          <div>
            <p className="text-gray-600 text-xs">Dinner</p>
            <p className="text-lg font-bold text-red-600">{insights.meal_summary.dinner_count}</p>
          </div>
        </div>
        <p className="text-gray-600 italic text-xs mt-2">{insights.meal_summary.message}</p>
      </div>

      {/* Week Range */}
      <div className="bg-gray-50 rounded-xl p-3 flex items-center justify-center gap-2">
        <Calendar size={16} className="text-gray-600" />
        <span className="text-gray-700 text-sm font-medium">
          {new Date(insights.week_start).toLocaleDateString()} -{' '}
          {new Date(insights.week_end).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}
