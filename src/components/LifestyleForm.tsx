import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { X, ArrowRight, ArrowLeft, Check } from "lucide-react";

interface LifestyleFormProps {
  onClose: () => void;
}

interface FormData {
  dietPreference: string;
  activityGoal: string;
}

const dietOptions = [
  { id: "veg", label: "Veg", icon: "🥗", description: "Plant-based with dairy" },
  { id: "non-veg", label: "Non-Veg", icon: "🍖", description: "Includes meat & fish" },
  { id: "vegan", label: "Vegan", icon: "🌱", description: "100% plant-based" },
  { id: "custom", label: "Custom", icon: "🍽️", description: "Mix & match" },
];

const activityOptions = [
  { id: "5k-steps", label: "5k Steps", icon: "👟", description: "Daily walking goal" },
  { id: "30-mins", label: "30 Minutes", icon: "⏱️", description: "Active time per day" },
  { id: "none", label: "None", icon: "🧘", description: "Start slow & steady" },
];

export function LifestyleForm({ onClose }: LifestyleFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    dietPreference: "",
    activityGoal: "",
  });

  const totalSteps = 2;
  const progress = (currentStep / totalSteps) * 100;

  const canProceed = () => {
    if (currentStep === 1) {
      return formData.dietPreference !== "" && formData.activityGoal !== "";
    }
    return true;
  };

  const handleNext = () => {
    if (canProceed() && currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (canProceed()) {
      console.log("Lifestyle preferences submitted:", formData);
      // Here you would typically send the data to your backend
      onClose();
    }
  };

  const renderStep = () => {
    const stepVariants = {
      hidden: { opacity: 0, x: 20 },
      visible: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -20 },
    };

    if (currentStep === 1) {
      return (
        <motion.div
          key="step1"
          variants={stepVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="space-y-8"
        >
          <div className="text-center space-y-2">
            <h3 className="text-3xl text-green-800">Tell us a bit about your lifestyle 🌿</h3>
            <p className="text-green-600">We'll personalize your 7-day meal and activity plan.</p>
          </div>

          {/* Diet Preferences */}
          <div className="space-y-4">
            <h4 className="text-green-900">Diet Preferences</h4>
            <div className="grid grid-cols-2 gap-4">
              {dietOptions.map((option) => (
                <motion.button
                  key={option.id}
                  onClick={() => setFormData((prev) => ({ ...prev, dietPreference: option.id }))}
                  className={`relative p-6 rounded-2xl border-2 transition-all ${
                    formData.dietPreference === option.id
                      ? "border-green-500 bg-green-50 shadow-lg"
                      : "border-green-200 bg-white hover:border-green-300 hover:shadow-md"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {formData.dietPreference === option.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-3 right-3 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                    >
                      <Check className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                  <div className="text-4xl mb-2">{option.icon}</div>
                  <div className="text-green-900 mb-1">{option.label}</div>
                  <div className="text-sm text-green-600">{option.description}</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Activity Goals */}
          <div className="space-y-4">
            <h4 className="text-green-900">Activity Goals</h4>
            <div className="grid grid-cols-3 gap-4">
              {activityOptions.map((option) => (
                <motion.button
                  key={option.id}
                  onClick={() => setFormData((prev) => ({ ...prev, activityGoal: option.id }))}
                  className={`relative p-6 rounded-2xl border-2 transition-all ${
                    formData.activityGoal === option.id
                      ? "border-green-500 bg-green-50 shadow-lg"
                      : "border-green-200 bg-white hover:border-green-300 hover:shadow-md"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {formData.activityGoal === option.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-3 right-3 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                    >
                      <Check className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                  <div className="text-4xl mb-2">{option.icon}</div>
                  <div className="text-green-900 mb-1">{option.label}</div>
                  <div className="text-xs text-green-600">{option.description}</div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      );
    }

    if (currentStep === 2) {
      return (
        <motion.div
          key="step2"
          variants={stepVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="space-y-8"
        >
          <div className="text-center space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="inline-block"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-5xl">✨</span>
              </div>
            </motion.div>
            <h3 className="text-3xl text-green-800">Your plan is ready! 🎉</h3>
            <p className="text-green-600 max-w-md mx-auto">
              We've created a personalized 7-day meal and activity plan based on your preferences. Get ready to start your eco-friendly journey!
            </p>
          </div>

          <div className="bg-green-50 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-green-200">
              <span className="text-green-700">Diet Preference</span>
              <span className="text-green-900">
                {dietOptions.find((opt) => opt.id === formData.dietPreference)?.label}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-green-700">Activity Goal</span>
              <span className="text-green-900">
                {activityOptions.find((opt) => opt.id === formData.activityGoal)?.label}
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl p-6 text-center">
            <div className="text-green-800 mb-2">Your Impact Potential</div>
            <div className="text-4xl text-green-700 mb-1">-2.5 kg</div>
            <div className="text-sm text-green-600">CO₂ saved per week</div>
          </div>
        </motion.div>
      );
    }

    return null;
  };

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
        transition={{ type: "spring", damping: 20 }}
        className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-green-100 p-6 rounded-t-3xl z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-700">🌍</span>
              </div>
              <span className="text-green-700">Step {currentStep} of {totalSteps}</span>
            </div>
            <button
              onClick={onClose}
              className="text-green-600 hover:text-green-800 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Content */}
        <div className="p-8">
          <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-green-100 p-6 rounded-b-3xl flex justify-between gap-4">
          <Button
            onClick={handleBack}
            variant="outline"
            className="rounded-full border-green-300 text-green-700 hover:bg-green-50"
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {currentStep < totalSteps ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="rounded-full bg-green-600 hover:bg-green-700 disabled:opacity-50 px-8"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="rounded-full bg-green-600 hover:bg-green-700 px-8"
            >
              Start My Journey 🌿
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
