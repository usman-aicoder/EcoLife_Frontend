import { motion } from "motion/react";
import { Leaf, Heart, TrendingUp, Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";

interface ResultsSummaryProps {
  onContinue: () => void;
  onBack: () => void;
  formData?: any;
}

export function ResultsSummary({ onContinue, onBack, formData }: ResultsSummaryProps) {
  // Calculate scores based on form data (mock calculation)
  const calculateScores = () => {
    // Carbon Footprint Score (0-100, lower is better for carbon)
    let carbonScore = 70;
    if (formData?.transportation === "bike" || formData?.transportation === "walk") {
      carbonScore -= 20;
    }
    if (formData?.diet === "vegan" || formData?.diet === "vegetarian") {
      carbonScore -= 15;
    }
    if (formData?.energySource === "renewable") {
      carbonScore -= 10;
    }

    // Wellness Score (0-100, higher is better)
    let wellnessScore = 65;
    if (formData?.exercise === "daily" || formData?.exercise === "frequently") {
      wellnessScore += 15;
    }
    if (formData?.sleep && parseInt(formData.sleep) >= 7) {
      wellnessScore += 10;
    }
    if (formData?.diet === "balanced") {
      wellnessScore += 10;
    }

    return {
      carbon: Math.max(20, Math.min(90, carbonScore)),
      wellness: Math.max(40, Math.min(95, wellnessScore)),
    };
  };

  const scores = calculateScores();

  // Generate personalized tips based on scores
  const getTips = () => {
    const tips = [];
    
    if (scores.carbon > 50) {
      tips.push({
        icon: "🚲",
        title: "Switch to Green Transport",
        description: "Try biking or walking for short trips to reduce carbon emissions.",
      });
    } else {
      tips.push({
        icon: "🌱",
        title: "Keep Up the Green Commute",
        description: "Your eco-friendly transportation choices are making a difference!",
      });
    }

    if (scores.wellness < 70) {
      tips.push({
        icon: "🧘",
        title: "Boost Your Daily Movement",
        description: "Add 15 minutes of stretching or yoga to your morning routine.",
      });
    } else {
      tips.push({
        icon: "💪",
        title: "Maintain Your Active Lifestyle",
        description: "Your commitment to wellness is inspiring—keep it up!",
      });
    }

    tips.push({
      icon: "💧",
      title: "Stay Hydrated",
      description: "Aim for 8 glasses of water daily to support your wellness journey.",
    });

    return tips;
  };

  const tips = getTips();

  const ProgressRing = ({ score, color }: { score: number; color: string }) => {
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
      <div className="relative w-40 h-40">
        <svg className="transform -rotate-90 w-40 h-40">
          {/* Background circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
            className="text-green-100"
          />
          {/* Progress circle */}
          <motion.circle
            cx="80"
            cy="80"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            className={color}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
            style={{
              strokeDasharray: circumference,
            }}
          />
        </svg>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-3xl text-green-900"
            >
              {score}
            </motion.div>
            <div className="text-xs text-green-600">/ 100</div>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 z-50 overflow-y-auto"
    >
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">

          {/* Floating Leaves Background */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{ opacity: 0, y: -20 }}
              animate={{
                opacity: [0.2, 0.4, 0.2],
                y: [0, -30, 0],
                x: [0, Math.random() * 20 - 10, 0],
                rotate: [0, 360],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5,
              }}
              style={{
                left: `${10 + i * 15}%`,
                top: `${20 + (i % 3) * 20}%`,
              }}
            >
              <Leaf className="w-8 h-8 text-green-300" />
            </motion.div>
          ))}

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="inline-block mb-4"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl sm:text-5xl text-green-900 mb-3"
            >
              Your Green Wellness Snapshot
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-lg text-green-700 max-w-2xl mx-auto"
            >
              Based on your responses, here's your personalized eco-impact and wellness overview
            </motion.p>
          </motion.div>

          {/* Result Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {/* Carbon Footprint Card */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, type: "spring" }}
              className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl border border-green-100 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-100/50 rounded-full blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
                    <Leaf className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl text-green-900">Carbon Footprint</h3>
                    <p className="text-sm text-green-600">Eco Impact Score</p>
                  </div>
                </div>
                <div className="flex justify-center mb-4">
                  <ProgressRing score={100 - scores.carbon} color="text-green-500" />
                </div>
                <p className="text-center text-green-700">
                  {100 - scores.carbon >= 70
                    ? "Excellent! You're making a positive impact on the planet."
                    : 100 - scores.carbon >= 50
                    ? "Good progress! A few changes can boost your eco-score."
                    : "Great start! Small steps lead to big environmental changes."}
                </p>
              </div>
            </motion.div>

            {/* Wellness Score Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, type: "spring" }}
              className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-xl border border-emerald-100 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/50 rounded-full blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-xl text-green-900">Wellness Score</h3>
                    <p className="text-sm text-green-600">Health & Vitality</p>
                  </div>
                </div>
                <div className="flex justify-center mb-4">
                  <ProgressRing score={scores.wellness} color="text-emerald-500" />
                </div>
                <p className="text-center text-green-700">
                  {scores.wellness >= 80
                    ? "Outstanding! Your wellness habits are thriving."
                    : scores.wellness >= 60
                    ? "Solid foundation! Keep nurturing your health journey."
                    : "You're on the right path! Consistency brings transformation."}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Improvement Tips */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white/80 backdrop-blur rounded-3xl p-8 shadow-lg border border-green-100 mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-green-600" />
              <h3 className="text-2xl text-green-900">Your Personalized Tips</h3>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {tips.map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.15 }}
                  className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-100 hover:shadow-md transition-shadow"
                >
                  <div className="text-3xl mb-3">{tip.icon}</div>
                  <h4 className="text-green-900 mb-2">{tip.title}</h4>
                  <p className="text-sm text-green-600">{tip.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.3 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Button
                onClick={onBack}
                variant="outline"
                className="rounded-full border-2 border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400 px-8 py-7 text-lg shadow-md hover:shadow-lg transition-all"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Questions
              </Button>
              <Button
                onClick={onContinue}
                className="rounded-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-10 py-7 text-lg shadow-xl hover:shadow-2xl transition-all"
              >
                Open My Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="mt-4 text-sm text-green-600"
            >
              Your personalized wellness plan awaits! 🌿
            </motion.p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
