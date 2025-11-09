import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Progress } from "./ui/progress";
import { X, ArrowRight, ArrowLeft, Sparkles, Leaf, TreePine, Globe, Loader2, AlertCircle } from "lucide-react";
import { onboardingService } from "../services/onboarding";

interface OnboardingFormProps {
  onClose: () => void;
  onComplete?: (formData?: FormData) => void;
}

interface FormData {
  // Lifestyle & Eco Habits (Section 1)
  transportation: string;
  meatDairy: string;
  shopping: string;
  recycling: string;
  reusables: string;
  homeEnergy: string;
  paperDigital: string;
  planeTravel: string;

  // Health & Wellness (Section 2)
  firstName: string;
  gender: string;
  age: string;
  height: string;
  weight: string;
  wellnessGoal: string;
  activityLevel: string;
  dietPreference: string;

  // Meal Planning (Section 3)
  allergies: string;
  medicalConditions: string;
  mealFrequency: string;
  cookingSkill: string;
  timeAvailable: string;
  budget: string;

  email: string;
}

export function OnboardingForm({ onClose, onComplete }: OnboardingFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<FormData>({
    transportation: "",
    meatDairy: "",
    shopping: "",
    recycling: "",
    reusables: "",
    homeEnergy: "",
    paperDigital: "",
    planeTravel: "",
    firstName: "",
    gender: "",
    age: "",
    height: "",
    weight: "",
    wellnessGoal: "",
    activityLevel: "",
    dietPreference: "",
    allergies: "",
    medicalConditions: "",
    mealFrequency: "",
    cookingSkill: "",
    timeAvailable: "",
    budget: "",
    email: "",
  });

  const totalSteps = 23; // 22 questions + 1 final screen (8 lifestyle + 7 health + 6 meal planning + 1 email)
  const progress = (currentStep / totalSteps) * 100;

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    switch (currentStep) {
      // Section 1: Lifestyle & Eco Habits (Steps 1-8)
      case 1: return formData.transportation !== "";
      case 2: return formData.meatDairy !== "";
      case 3: return formData.shopping !== "";
      case 4: return formData.recycling !== "";
      case 5: return formData.reusables !== "";
      case 6: return formData.homeEnergy !== "";
      case 7: return formData.paperDigital !== "";
      case 8: return formData.planeTravel !== "";

      // Section 2: Health & Wellness (Steps 9-16)
      case 9: return formData.firstName.trim() !== "";
      case 10: return formData.gender !== "";
      case 11: return formData.age !== "" && parseInt(formData.age) > 0;
      case 12: return formData.height !== "" && formData.weight !== "";
      case 13: return formData.wellnessGoal !== "";
      case 14: return formData.activityLevel !== "";
      case 15: return formData.dietPreference !== "";

      // Section 3: Meal Planning (Steps 16-21)
      case 16: return true; // Allergies optional
      case 17: return true; // Medical conditions optional
      case 18: return formData.mealFrequency !== "";
      case 19: return formData.cookingSkill !== "";
      case 20: return formData.timeAvailable !== "";
      case 21: return formData.budget !== "";

      // Step 22: Email
      case 22: return true; // Email optional

      // Step 23: Final screen
      case 23: return true;

      default: return false;
    }
  };

  const handleNext = async () => {
    if (currentStep === 22) {
      // Step 22 is email, which triggers submission before moving to final screen
      // Check if user is authenticated
      const token = localStorage.getItem("ecolife_token");

      // Only submit to backend if user is authenticated
      if (token) {
        setIsLoading(true);
        setError("");

        try {
          // Prepare lifestyle data
          const lifestyleData = {
            transportation_mode: formData.transportation,
            diet_type: formData.meatDairy,
            shopping_pattern: formData.shopping,
            recycling_habits: formData.recycling,
            reusable_items: formData.reusables === "always" || formData.reusables === "often",
            energy_source: formData.homeEnergy,
            travel_frequency: formData.planeTravel,
            paper_preference: formData.paperDigital,
          };

          // Prepare health data
          const healthData = {
            gender: formData.gender,
            age: parseInt(formData.age),
            height: parseFloat(formData.height),
            weight: parseFloat(formData.weight),
            activity_level: formData.activityLevel,
            wellness_goal: formData.wellnessGoal,
            dietary_preference: formData.dietPreference,
            allergies: formData.allergies ? [formData.allergies] : [],
            medical_conditions: formData.medicalConditions ? [formData.medicalConditions] : [],
            meal_frequency: formData.mealFrequency,
            cooking_skill: formData.cookingSkill,
            time_available: formData.timeAvailable,
            budget: formData.budget,
          };

          // Submit both lifestyle and health data
          await onboardingService.submitLifestyle(lifestyleData);
          await onboardingService.submitHealth(healthData);

          // Success - move to final screen
          setCurrentStep((prev) => prev + 1);
        } catch (err: any) {
          setError(err.message || "Failed to save your data. Please try again.");
        } finally {
          setIsLoading(false);
        }
      } else {
        // Guest user - skip backend submission, just move to final screen
        setCurrentStep((prev) => prev + 1);
      }
    } else if (currentStep < 23) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1 && currentStep < 23) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleComplete = () => {
    console.log("Form completed:", formData);
    if (onComplete) {
      onComplete(formData);
    }
    onClose();
  };

  // Floating leaves animation
  const FloatingLeaves = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`leaf-${i}`}
          className="absolute text-green-300/30"
          style={{
            left: `${15 + i * 20}%`,
            top: `-10%`,
          }}
          animate={{
            y: ["0vh", "110vh"],
            x: [0, Math.sin(i) * 40, 0],
            rotate: [0, 360],
            opacity: [0, 0.6, 0.6, 0],
          }}
          transition={{
            duration: 18 + i * 3,
            delay: i * 2,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Leaf className="w-5 h-5" />
        </motion.div>
      ))}
    </div>
  );

  // Section header
  const renderSectionHeader = () => {
    if (currentStep <= 8) {
      return (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-6 pb-3 border-b border-green-200"
        >
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Globe className="w-7 h-7 text-green-600" />
          </motion.div>
          <div>
            <div className="text-xs text-green-600 uppercase tracking-wider">Section 1 of 3</div>
            <h4 className="text-green-900 text-sm">Lifestyle & Eco Habits</h4>
          </div>
        </motion.div>
      );
    } else if (currentStep <= 15) {
      return (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-6 pb-3 border-b border-emerald-200"
        >
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Leaf className="w-7 h-7 text-emerald-600" />
          </motion.div>
          <div>
            <div className="text-xs text-emerald-600 uppercase tracking-wider">Section 2 of 3</div>
            <h4 className="text-emerald-900 text-sm">Health & Wellness</h4>
          </div>
        </motion.div>
      );
    } else if (currentStep <= 21) {
      return (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-6 pb-3 border-b border-teal-200"
        >
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Sparkles className="w-7 h-7 text-teal-600" />
          </motion.div>
          <div>
            <div className="text-xs text-teal-600 uppercase tracking-wider">Section 3 of 3</div>
            <h4 className="text-teal-900 text-sm">Meal Planning Preferences</h4>
          </div>
        </motion.div>
      );
    }
    return null;
  };

  const renderStep = () => {
    const stepVariants = {
      hidden: { opacity: 0, x: 50 },
      visible: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -50 },
    };

    const cardClasses = "bg-gradient-to-br from-white via-green-50/20 to-emerald-50/20 rounded-3xl p-8 shadow-lg border border-green-100/50";

    switch (currentStep) {
      // SECTION 1: LIFESTYLE & ECO HABITS
      
      case 1:
        return (
          <motion.div key="step1" variants={stepVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.3 }} className="space-y-6">
            {renderSectionHeader()}
            <div className={cardClasses}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", bounce: 0.5 }} className="text-5xl mb-4 text-center">
                🚲
              </motion.div>
              <h3 className="text-green-900 text-center mb-2">How do you usually get around?</h3>
              <p className="text-sm text-gray-500 text-center mb-6 italic">Every step counts — even small choices add up!</p>
              
              <RadioGroup value={formData.transportation} onValueChange={(value) => updateFormData("transportation", value)} className="space-y-3">
                {[
                  { value: "walk", label: "🚶 Walk or cycle" },
                  { value: "public", label: "🚌 Public transport" },
                  { value: "drive", label: "🚗 Drive a car" },
                  { value: "fly", label: "✈️ Fly often for travel" },
                ].map((option, index) => (
                  <motion.div key={option.value} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + index * 0.05 }} whileHover={{ scale: 1.02, x: 5 }} whileTap={{ scale: 0.98 }}>
                    <Label htmlFor={option.value} className={`flex items-center space-x-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${formData.transportation === option.value ? "border-green-500 bg-green-100 shadow-md" : "border-green-200/50 hover:border-green-400 bg-white/80"}`}>
                      <RadioGroupItem value={option.value} id={option.value} />
                      <span className="flex-1">{option.label}</span>
                    </Label>
                  </motion.div>
                ))}
              </RadioGroup>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div key="step2" variants={stepVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.3 }} className="space-y-6">
            {renderSectionHeader()}
            <div className={cardClasses}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", bounce: 0.5 }} className="text-5xl mb-4 text-center">
                🥦
              </motion.div>
              <h3 className="text-green-900 text-center mb-2">How often do you eat meat or dairy?</h3>
              <p className="text-sm text-gray-500 text-center mb-6 italic">Your plate tells your planet story.</p>
              
              <RadioGroup value={formData.meatDairy} onValueChange={(value) => updateFormData("meatDairy", value)} className="space-y-3">
                {[
                  { value: "never", label: "🥦 Never" },
                  { value: "occasionally", label: "🍗 Occasionally" },
                  { value: "few-times", label: "🍕 A few times a week" },
                  { value: "daily", label: "🍔 Daily" },
                ].map((option, index) => (
                  <motion.div key={option.value} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + index * 0.05 }} whileHover={{ scale: 1.02, x: 5 }} whileTap={{ scale: 0.98 }}>
                    <Label htmlFor={option.value} className={`flex items-center space-x-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${formData.meatDairy === option.value ? "border-green-500 bg-green-100 shadow-md" : "border-green-200/50 hover:border-green-400 bg-white/80"}`}>
                      <RadioGroupItem value={option.value} id={option.value} />
                      <span className="flex-1">{option.label}</span>
                    </Label>
                  </motion.div>
                ))}
              </RadioGroup>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div key="step3" variants={stepVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.3 }} className="space-y-6">
            {renderSectionHeader()}
            <div className={cardClasses}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", bounce: 0.5 }} className="text-5xl mb-4 text-center">
                👕
              </motion.div>
              <h3 className="text-green-900 text-center mb-2">How do you usually shop for clothes?</h3>
              <p className="text-sm text-gray-500 text-center mb-6 italic">Sustainable fashion makes a big difference.</p>
              
              <RadioGroup value={formData.shopping} onValueChange={(value) => updateFormData("shopping", value)} className="space-y-3">
                {[
                  { value: "thrift", label: "♻️ Thrift or reuse items" },
                  { value: "occasional", label: "👕 Occasionally buy new" },
                  { value: "regular", label: "🛍️ Shop regularly" },
                  { value: "premium", label: "💎 Buy premium/fashion items often" },
                ].map((option, index) => (
                  <motion.div key={option.value} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + index * 0.05 }} whileHover={{ scale: 1.02, x: 5 }} whileTap={{ scale: 0.98 }}>
                    <Label htmlFor={option.value} className={`flex items-center space-x-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${formData.shopping === option.value ? "border-green-500 bg-green-100 shadow-md" : "border-green-200/50 hover:border-green-400 bg-white/80"}`}>
                      <RadioGroupItem value={option.value} id={option.value} />
                      <span className="flex-1">{option.label}</span>
                    </Label>
                  </motion.div>
                ))}
              </RadioGroup>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div key="step4" variants={stepVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.3 }} className="space-y-6">
            {renderSectionHeader()}
            <div className={cardClasses}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", bounce: 0.5 }} className="text-5xl mb-4 text-center">
                ♻️
              </motion.div>
              <h3 className="text-green-900 text-center mb-2">Do you recycle or compost at home?</h3>
              <p className="text-sm text-gray-500 text-center mb-6 italic">Even tiny habits create cleaner communities.</p>
              
              <RadioGroup value={formData.recycling} onValueChange={(value) => updateFormData("recycling", value)} className="space-y-3">
                {[
                  { value: "always", label: "✅ Always" },
                  { value: "sometimes", label: "🔄 Sometimes" },
                  { value: "rarely", label: "🚫 Rarely" },
                  { value: "never", label: "❌ Never" },
                ].map((option, index) => (
                  <motion.div key={option.value} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + index * 0.05 }} whileHover={{ scale: 1.02, x: 5 }} whileTap={{ scale: 0.98 }}>
                    <Label htmlFor={option.value} className={`flex items-center space-x-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${formData.recycling === option.value ? "border-green-500 bg-green-100 shadow-md" : "border-green-200/50 hover:border-green-400 bg-white/80"}`}>
                      <RadioGroupItem value={option.value} id={option.value} />
                      <span className="flex-1">{option.label}</span>
                    </Label>
                  </motion.div>
                ))}
              </RadioGroup>
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div key="step5" variants={stepVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.3 }} className="space-y-6">
            {renderSectionHeader()}
            <div className={cardClasses}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", bounce: 0.5 }} className="text-5xl mb-4 text-center">
                🌿
              </motion.div>
              <h3 className="text-green-900 text-center mb-2">How often do you use reusable bottles or bags?</h3>
              <p className="text-sm text-gray-500 text-center mb-6 italic">Simple swaps, lasting impact.</p>
              
              <RadioGroup value={formData.reusables} onValueChange={(value) => updateFormData("reusables", value)} className="space-y-3">
                {[
                  { value: "always", label: "🌿 Always" },
                  { value: "often", label: "🙂 Often" },
                  { value: "sometimes", label: "😅 Sometimes" },
                  { value: "rarely", label: "🙈 Rarely" },
                ].map((option, index) => (
                  <motion.div key={option.value} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + index * 0.05 }} whileHover={{ scale: 1.02, x: 5 }} whileTap={{ scale: 0.98 }}>
                    <Label htmlFor={option.value} className={`flex items-center space-x-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${formData.reusables === option.value ? "border-green-500 bg-green-100 shadow-md" : "border-green-200/50 hover:border-green-400 bg-white/80"}`}>
                      <RadioGroupItem value={option.value} id={option.value} />
                      <span className="flex-1">{option.label}</span>
                    </Label>
                  </motion.div>
                ))}
              </RadioGroup>
            </div>
          </motion.div>
        );

      case 6:
        return (
          <motion.div key="step6" variants={stepVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.3 }} className="space-y-6">
            {renderSectionHeader()}
            <div className={cardClasses}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", bounce: 0.5 }} className="text-5xl mb-4 text-center">
                ☀️
              </motion.div>
              <h3 className="text-green-900 text-center mb-2">How do you power your home?</h3>
              <p className="text-sm text-gray-500 text-center mb-6 italic">Energy awareness starts right at home.</p>
              
              <RadioGroup value={formData.homeEnergy} onValueChange={(value) => updateFormData("homeEnergy", value)} className="space-y-3">
                {[
                  { value: "renewable", label: "☀️ Mostly renewable (solar/wind)" },
                  { value: "mixed", label: "💡 Mix of renewable and grid" },
                  { value: "grid", label: "⚡ Mainly grid electricity" },
                  { value: "unknown", label: "🔌 Don't know / not sure" },
                ].map((option, index) => (
                  <motion.div key={option.value} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + index * 0.05 }} whileHover={{ scale: 1.02, x: 5 }} whileTap={{ scale: 0.98 }}>
                    <Label htmlFor={option.value} className={`flex items-center space-x-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${formData.homeEnergy === option.value ? "border-green-500 bg-green-100 shadow-md" : "border-green-200/50 hover:border-green-400 bg-white/80"}`}>
                      <RadioGroupItem value={option.value} id={option.value} />
                      <span className="flex-1">{option.label}</span>
                    </Label>
                  </motion.div>
                ))}
              </RadioGroup>
            </div>
          </motion.div>
        );

      case 7:
        return (
          <motion.div key="step7" variants={stepVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.3 }} className="space-y-6">
            {renderSectionHeader()}
            <div className={cardClasses}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", bounce: 0.5 }} className="text-5xl mb-4 text-center">
                💻
              </motion.div>
              <h3 className="text-green-900 text-center mb-2">Do you prefer digital or paper for notes & bills?</h3>
              <p className="text-sm text-gray-500 text-center mb-6 italic">Small steps toward less waste.</p>
              
              <RadioGroup value={formData.paperDigital} onValueChange={(value) => updateFormData("paperDigital", value)} className="space-y-3">
                {[
                  { value: "fully-digital", label: "💻 Fully digital" },
                  { value: "mostly-digital", label: "📲 Mostly digital" },
                  { value: "both", label: "🧾 Use both equally" },
                  { value: "mostly-paper", label: "📄 Mostly paper" },
                ].map((option, index) => (
                  <motion.div key={option.value} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + index * 0.05 }} whileHover={{ scale: 1.02, x: 5 }} whileTap={{ scale: 0.98 }}>
                    <Label htmlFor={option.value} className={`flex items-center space-x-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${formData.paperDigital === option.value ? "border-green-500 bg-green-100 shadow-md" : "border-green-200/50 hover:border-green-400 bg-white/80"}`}>
                      <RadioGroupItem value={option.value} id={option.value} />
                      <span className="flex-1">{option.label}</span>
                    </Label>
                  </motion.div>
                ))}
              </RadioGroup>
            </div>
          </motion.div>
        );

      case 8:
        return (
          <motion.div key="step8" variants={stepVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.3 }} className="space-y-6">
            {renderSectionHeader()}
            <div className={cardClasses}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", bounce: 0.5 }} className="text-5xl mb-4 text-center">
                ✈️
              </motion.div>
              <h3 className="text-green-900 text-center mb-2">How often do you travel by plane?</h3>
              <p className="text-sm text-gray-500 text-center mb-6 italic">Travel consciously, tread lightly.</p>
              
              <RadioGroup value={formData.planeTravel} onValueChange={(value) => updateFormData("planeTravel", value)} className="space-y-3">
                {[
                  { value: "never", label: "✈️ Never" },
                  { value: "once", label: "🧳 Once a year" },
                  { value: "few-times", label: "🌍 A few times a year" },
                  { value: "frequently", label: "🚀 Frequently" },
                ].map((option, index) => (
                  <motion.div key={option.value} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + index * 0.05 }} whileHover={{ scale: 1.02, x: 5 }} whileTap={{ scale: 0.98 }}>
                    <Label htmlFor={option.value} className={`flex items-center space-x-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${formData.planeTravel === option.value ? "border-green-500 bg-green-100 shadow-md" : "border-green-200/50 hover:border-green-400 bg-white/80"}`}>
                      <RadioGroupItem value={option.value} id={option.value} />
                      <span className="flex-1">{option.label}</span>
                    </Label>
                  </motion.div>
                ))}
              </RadioGroup>
            </div>
          </motion.div>
        );

      // SECTION 2: HEALTH & WELLNESS

      case 9:
        return (
          <motion.div key="step9" variants={stepVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.3 }} className="space-y-6">
            {renderSectionHeader()}
            <div className={cardClasses}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", bounce: 0.5 }} className="text-5xl mb-4 text-center">
                ✍️
              </motion.div>
              <h3 className="text-emerald-900 text-center mb-2">What's your first name?</h3>
              <p className="text-sm text-gray-500 text-center mb-6 italic">We'll personalize your journey with it!</p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={(e) => updateFormData("firstName", e.target.value)}
                  className="rounded-2xl border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500 text-lg p-6 text-center bg-white/80"
                  autoFocus
                />
              </motion.div>
            </div>
          </motion.div>
        );

      case 10:
        return (
          <motion.div key="step10" variants={stepVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.3 }} className="space-y-6">
            {renderSectionHeader()}
            <div className={cardClasses}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", bounce: 0.5 }} className="text-5xl mb-4 text-center">
                ⚧️
              </motion.div>
              <h3 className="text-emerald-900 text-center mb-2">What is your biological sex?</h3>
              <p className="text-sm text-gray-500 text-center mb-6 italic">This helps us calculate your personalized calorie needs accurately.</p>

              <RadioGroup value={formData.gender} onValueChange={(value) => updateFormData("gender", value)} className="space-y-3">
                {[
                  { value: "male", label: "♂️ Male" },
                  { value: "female", label: "♀️ Female" },
                  { value: "non-binary", label: "⚧️ Non-binary / Other" },
                  { value: "prefer-not-to-say", label: "🙊 Prefer not to say" },
                ].map((option, index) => (
                  <motion.div key={option.value} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + index * 0.05 }} whileHover={{ scale: 1.02, x: 5 }} whileTap={{ scale: 0.98 }}>
                    <Label htmlFor={option.value} className={`flex items-center space-x-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${formData.gender === option.value ? "border-emerald-500 bg-emerald-100 shadow-md" : "border-emerald-200/50 hover:border-emerald-400 bg-white/80"}`}>
                      <RadioGroupItem value={option.value} id={option.value} />
                      <span className="flex-1">{option.label}</span>
                    </Label>
                  </motion.div>
                ))}
              </RadioGroup>
            </div>
          </motion.div>
        );

      case 11:
        return (
          <motion.div key="step11" variants={stepVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.3 }} className="space-y-6">
            {renderSectionHeader()}
            <div className={cardClasses}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", bounce: 0.5 }} className="text-5xl mb-4 text-center">
                📅
              </motion.div>
              <h3 className="text-emerald-900 text-center mb-2">How old are you?</h3>
              <p className="text-sm text-gray-500 text-center mb-6 italic">Age helps us tailor your wellness plan.</p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter your age"
                  value={formData.age}
                  onChange={(e) => updateFormData("age", e.target.value)}
                  className="rounded-2xl border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500 text-lg p-6 text-center bg-white/80"
                  min="1"
                  max="120"
                  autoFocus
                />
              </motion.div>
            </div>
          </motion.div>
        );

      case 12:
        return (
          <motion.div key="step12" variants={stepVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.3 }} className="space-y-6">
            {renderSectionHeader()}
            <div className={cardClasses}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", bounce: 0.5 }} className="text-5xl mb-4 text-center">
                📏
              </motion.div>
              <h3 className="text-emerald-900 text-center mb-2">What's your height & weight?</h3>
              <p className="text-sm text-gray-500 text-center mb-6 italic">We use this to calculate healthy goals — no one sees it but you.</p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-4">
                <div>
                  <Label htmlFor="height" className="text-sm text-gray-600 mb-2 block text-center">📏 Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="e.g., 170"
                    value={formData.height}
                    onChange={(e) => updateFormData("height", e.target.value)}
                    className="rounded-2xl border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500 text-lg p-6 text-center bg-white/80"
                    min="1"
                    step="0.1"
                  />
                </div>
                <div>
                  <Label htmlFor="weight" className="text-sm text-gray-600 mb-2 block text-center">⚖️ Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="e.g., 70"
                    value={formData.weight}
                    onChange={(e) => updateFormData("weight", e.target.value)}
                    className="rounded-2xl border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500 text-lg p-6 text-center bg-white/80"
                    min="1"
                    step="0.1"
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        );

      case 13:
        return (
          <motion.div key="step13" variants={stepVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.3 }} className="space-y-6">
            {renderSectionHeader()}
            <div className={cardClasses}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", bounce: 0.5 }} className="text-5xl mb-4 text-center">
                🎯
              </motion.div>
              <h3 className="text-emerald-900 text-center mb-2">What's your main wellness goal?</h3>
              <p className="text-sm text-gray-500 text-center mb-6 italic">Your goal, your pace — we'll walk with you.</p>

              <RadioGroup value={formData.wellnessGoal} onValueChange={(value) => updateFormData("wellnessGoal", value)} className="space-y-3">
                {[
                  { value: "lose-weight", label: "💪 Lose weight" },
                  { value: "get-fit", label: "🏃‍♀️ Get fit" },
                  { value: "destress", label: "🧘‍♀️ De-stress" },
                  { value: "balance", label: "🌿 Maintain balance" },
                ].map((option, index) => (
                  <motion.div key={option.value} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + index * 0.05 }} whileHover={{ scale: 1.02, x: 5 }} whileTap={{ scale: 0.98 }}>
                    <Label htmlFor={option.value} className={`flex items-center space-x-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${formData.wellnessGoal === option.value ? "border-emerald-500 bg-emerald-100 shadow-md" : "border-emerald-200/50 hover:border-emerald-400 bg-white/80"}`}>
                      <RadioGroupItem value={option.value} id={option.value} />
                      <span className="flex-1">{option.label}</span>
                    </Label>
                  </motion.div>
                ))}
              </RadioGroup>
            </div>
          </motion.div>
        );

      case 14:
        return (
          <motion.div key="step14" variants={stepVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.3 }} className="space-y-6">
            {renderSectionHeader()}
            <div className={cardClasses}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", bounce: 0.5 }} className="text-5xl mb-4 text-center">
                🏃
              </motion.div>
              <h3 className="text-emerald-900 text-center mb-2">How active are you in a normal day?</h3>
              <p className="text-sm text-gray-500 text-center mb-6 italic">Every movement matters!</p>

              <RadioGroup value={formData.activityLevel} onValueChange={(value) => updateFormData("activityLevel", value)} className="space-y-3">
                {[
                  { value: "sedentary", label: "🛋️ Mostly sitting" },
                  { value: "lightly-active", label: "🚶 Lightly active" },
                  { value: "moderately-active", label: "🏋️ Moderately active" },
                  { value: "very-active", label: "🏃‍♂️ Very active" },
                ].map((option, index) => (
                  <motion.div key={option.value} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + index * 0.05 }} whileHover={{ scale: 1.02, x: 5 }} whileTap={{ scale: 0.98 }}>
                    <Label htmlFor={option.value} className={`flex items-center space-x-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${formData.activityLevel === option.value ? "border-emerald-500 bg-emerald-100 shadow-md" : "border-emerald-200/50 hover:border-emerald-400 bg-white/80"}`}>
                      <RadioGroupItem value={option.value} id={option.value} />
                      <span className="flex-1">{option.label}</span>
                    </Label>
                  </motion.div>
                ))}
              </RadioGroup>
            </div>
          </motion.div>
        );

      case 15:
        return (
          <motion.div key="step15" variants={stepVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.3 }} className="space-y-6">
            {renderSectionHeader()}
            <div className={cardClasses}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", bounce: 0.5 }} className="text-5xl mb-4 text-center">
                🥗
              </motion.div>
              <h3 className="text-emerald-900 text-center mb-2">Any dietary preferences?</h3>
              <p className="text-sm text-gray-500 text-center mb-6 italic">We'll use this to suggest your 7-day eco-meal plan.</p>

              <RadioGroup value={formData.dietPreference} onValueChange={(value) => updateFormData("dietPreference", value)} className="space-y-3">
                {[
                  { value: "vegan", label: "🥗 Vegan" },
                  { value: "vegetarian", label: "🌾 Vegetarian" },
                  { value: "non-vegetarian", label: "🍗 Non-vegetarian" },
                  { value: "other", label: "🧩 Other / custom diet" },
                ].map((option, index) => (
                  <motion.div key={option.value} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + index * 0.05 }} whileHover={{ scale: 1.02, x: 5 }} whileTap={{ scale: 0.98 }}>
                    <Label htmlFor={option.value} className={`flex items-center space-x-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${formData.dietPreference === option.value ? "border-emerald-500 bg-emerald-100 shadow-md" : "border-emerald-200/50 hover:border-emerald-400 bg-white/80"}`}>
                      <RadioGroupItem value={option.value} id={option.value} />
                      <span className="flex-1">{option.label}</span>
                    </Label>
                  </motion.div>
                ))}
              </RadioGroup>
            </div>
          </motion.div>
        );

      // SECTION 3: MEAL PLANNING PREFERENCES

      case 16:
        return (
          <motion.div key="step16" variants={stepVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.3 }} className="space-y-6">
            {renderSectionHeader()}
            <div className={cardClasses}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", bounce: 0.5 }} className="text-5xl mb-4 text-center">
                🚫
              </motion.div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <h3 className="text-teal-900 text-center">Do you have any food allergies?</h3>
                <span className="text-xs text-teal-600 bg-teal-100 px-2 py-1 rounded-full">Optional</span>
              </div>
              <p className="text-sm text-gray-500 text-center mb-6 italic">We'll make sure your meal plan avoids these!</p>

              <RadioGroup value={formData.allergies} onValueChange={(value) => updateFormData("allergies", value)} className="space-y-3">
                {[
                  { value: "none", label: "✅ None" },
                  { value: "dairy-eggs", label: "🥛 Dairy / Eggs" },
                  { value: "nuts-soy", label: "🥜 Nuts / Soy" },
                  { value: "gluten-shellfish", label: "🌾 Gluten / Shellfish" },
                ].map((option, index) => (
                  <motion.div key={option.value} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + index * 0.05 }} whileHover={{ scale: 1.02, x: 5 }} whileTap={{ scale: 0.98 }}>
                    <Label htmlFor={option.value} className={`flex items-center space-x-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${formData.allergies === option.value ? "border-teal-500 bg-teal-100 shadow-md" : "border-teal-200/50 hover:border-teal-400 bg-white/80"}`}>
                      <RadioGroupItem value={option.value} id={option.value} />
                      <span className="flex-1">{option.label}</span>
                    </Label>
                  </motion.div>
                ))}
              </RadioGroup>
            </div>
          </motion.div>
        );

      case 17:
        return (
          <motion.div key="step17" variants={stepVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.3 }} className="space-y-6">
            {renderSectionHeader()}
            <div className={cardClasses}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", bounce: 0.5 }} className="text-5xl mb-4 text-center">
                🏥
              </motion.div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <h3 className="text-teal-900 text-center">Any medical conditions we should know about?</h3>
                <span className="text-xs text-teal-600 bg-teal-100 px-2 py-1 rounded-full">Optional</span>
              </div>
              <p className="text-sm text-gray-500 text-center mb-6 italic">Helps us provide safer, more personalized recommendations.</p>

              <RadioGroup value={formData.medicalConditions} onValueChange={(value) => updateFormData("medicalConditions", value)} className="space-y-3">
                {[
                  { value: "none", label: "✅ None" },
                  { value: "diabetes-bp", label: "💉 Diabetes / High BP" },
                  { value: "heart-kidney", label: "❤️ Heart / Kidney issues" },
                  { value: "digestive-celiac", label: "🩺 Digestive / Celiac issues" },
                ].map((option, index) => (
                  <motion.div key={option.value} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + index * 0.05 }} whileHover={{ scale: 1.02, x: 5 }} whileTap={{ scale: 0.98 }}>
                    <Label htmlFor={option.value} className={`flex items-center space-x-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${formData.medicalConditions === option.value ? "border-teal-500 bg-teal-100 shadow-md" : "border-teal-200/50 hover:border-teal-400 bg-white/80"}`}>
                      <RadioGroupItem value={option.value} id={option.value} />
                      <span className="flex-1">{option.label}</span>
                    </Label>
                  </motion.div>
                ))}
              </RadioGroup>
            </div>
          </motion.div>
        );

      case 18:
        return (
          <motion.div key="step18" variants={stepVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.3 }} className="space-y-6">
            {renderSectionHeader()}
            <div className={cardClasses}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", bounce: 0.5 }} className="text-5xl mb-4 text-center">
                🍽️
              </motion.div>
              <h3 className="text-teal-900 text-center mb-2">How many meals do you prefer per day?</h3>
              <p className="text-sm text-gray-500 text-center mb-6 italic">We'll plan accordingly!</p>

              <RadioGroup value={formData.mealFrequency} onValueChange={(value) => updateFormData("mealFrequency", value)} className="space-y-3">
                {[
                  { value: "2-meals", label: "🍴 2 meals" },
                  { value: "3-meals", label: "🍽️ 3 meals" },
                  { value: "4-5-meals", label: "🥘 4–5 small meals" },
                  { value: "flexible", label: "🧃 Flexible / varies daily" },
                ].map((option, index) => (
                  <motion.div key={option.value} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + index * 0.05 }} whileHover={{ scale: 1.02, x: 5 }} whileTap={{ scale: 0.98 }}>
                    <Label htmlFor={option.value} className={`flex items-center space-x-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${formData.mealFrequency === option.value ? "border-teal-500 bg-teal-100 shadow-md" : "border-teal-200/50 hover:border-teal-400 bg-white/80"}`}>
                      <RadioGroupItem value={option.value} id={option.value} />
                      <span className="flex-1">{option.label}</span>
                    </Label>
                  </motion.div>
                ))}
              </RadioGroup>
            </div>
          </motion.div>
        );

      case 19:
        return (
          <motion.div key="step19" variants={stepVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.3 }} className="space-y-6">
            {renderSectionHeader()}
            <div className={cardClasses}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", bounce: 0.5 }} className="text-5xl mb-4 text-center">
                👨‍🍳
              </motion.div>
              <h3 className="text-teal-900 text-center mb-2">What's your cooking skill level?</h3>
              <p className="text-sm text-gray-500 text-center mb-6 italic">No judgment — we'll match your comfort zone!</p>

              <RadioGroup value={formData.cookingSkill} onValueChange={(value) => updateFormData("cookingSkill", value)} className="space-y-3">
                {[
                  { value: "beginner", label: "🥄 Beginner" },
                  { value: "intermediate", label: "🔪 Intermediate" },
                  { value: "advanced", label: "👨‍🍳 Advanced" },
                  { value: "prefer-takeout", label: "🍕 Prefer takeout" },
                ].map((option, index) => (
                  <motion.div key={option.value} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + index * 0.05 }} whileHover={{ scale: 1.02, x: 5 }} whileTap={{ scale: 0.98 }}>
                    <Label htmlFor={option.value} className={`flex items-center space-x-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${formData.cookingSkill === option.value ? "border-teal-500 bg-teal-100 shadow-md" : "border-teal-200/50 hover:border-teal-400 bg-white/80"}`}>
                      <RadioGroupItem value={option.value} id={option.value} />
                      <span className="flex-1">{option.label}</span>
                    </Label>
                  </motion.div>
                ))}
              </RadioGroup>
            </div>
          </motion.div>
        );

      case 20:
        return (
          <motion.div key="step20" variants={stepVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.3 }} className="space-y-6">
            {renderSectionHeader()}
            <div className={cardClasses}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", bounce: 0.5 }} className="text-5xl mb-4 text-center">
                ⏱️
              </motion.div>
              <h3 className="text-teal-900 text-center mb-2">How much time can you spend cooking?</h3>
              <p className="text-sm text-gray-500 text-center mb-6 italic">We'll suggest quick or elaborate recipes accordingly.</p>

              <RadioGroup value={formData.timeAvailable} onValueChange={(value) => updateFormData("timeAvailable", value)} className="space-y-3">
                {[
                  { value: "under-30", label: "⚡ Under 30 mins" },
                  { value: "30-60", label: "⏱️ 30–60 mins" },
                  { value: "over-60", label: "🕐 Over 1 hour" },
                  { value: "quick-prep", label: "🍴 Prefer quick prep meals" },
                ].map((option, index) => (
                  <motion.div key={option.value} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + index * 0.05 }} whileHover={{ scale: 1.02, x: 5 }} whileTap={{ scale: 0.98 }}>
                    <Label htmlFor={option.value} className={`flex items-center space-x-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${formData.timeAvailable === option.value ? "border-teal-500 bg-teal-100 shadow-md" : "border-teal-200/50 hover:border-teal-400 bg-white/80"}`}>
                      <RadioGroupItem value={option.value} id={option.value} />
                      <span className="flex-1">{option.label}</span>
                    </Label>
                  </motion.div>
                ))}
              </RadioGroup>
            </div>
          </motion.div>
        );

      case 21:
        return (
          <motion.div key="step21" variants={stepVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.3 }} className="space-y-6">
            {renderSectionHeader()}
            <div className={cardClasses}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", bounce: 0.5 }} className="text-5xl mb-4 text-center">
                💰
              </motion.div>
              <h3 className="text-teal-900 text-center mb-2">What's your meal budget range?</h3>
              <p className="text-sm text-gray-500 text-center mb-6 italic">Affordable & eco-friendly can go hand in hand!</p>

              <RadioGroup value={formData.budget} onValueChange={(value) => updateFormData("budget", value)} className="space-y-3">
                {[
                  { value: "low", label: "💵 Budget-friendly" },
                  { value: "medium", label: "💰 Moderate" },
                  { value: "high", label: "💎 Premium" },
                  { value: "flexible", label: "🧾 Flexible / no fixed budget" },
                ].map((option, index) => (
                  <motion.div key={option.value} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + index * 0.05 }} whileHover={{ scale: 1.02, x: 5 }} whileTap={{ scale: 0.98 }}>
                    <Label htmlFor={option.value} className={`flex items-center space-x-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${formData.budget === option.value ? "border-teal-500 bg-teal-100 shadow-md" : "border-teal-200/50 hover:border-teal-400 bg-white/80"}`}>
                      <RadioGroupItem value={option.value} id={option.value} />
                      <span className="flex-1">{option.label}</span>
                    </Label>
                  </motion.div>
                ))}
              </RadioGroup>
            </div>
          </motion.div>
        );

      case 22:
        return (
          <motion.div key="step22" variants={stepVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.3 }} className="space-y-6">
            <div className={cardClasses}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", bounce: 0.5 }} className="text-5xl mb-4 text-center">
                📧
              </motion.div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <h3 className="text-teal-900 text-center">Want to save your plan & progress?</h3>
                <span className="text-xs text-teal-600 bg-teal-100 px-2 py-1 rounded-full">Optional</span>
              </div>
              <p className="text-sm text-gray-500 text-center mb-6 italic">So you can get your plan and access your dashboard later!</p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email (optional)"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  className="rounded-2xl border-teal-300 focus:border-teal-500 focus:ring-teal-500 text-lg p-6 text-center bg-white/80"
                />
              </motion.div>
            </div>
          </motion.div>
        );

      // FINAL SUCCESS SCREEN

      case 23:
        return (
          <motion.div
            key="step16"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12 space-y-8 px-4"
          >
            {/* Success animation */}
            <motion.div
              className="relative inline-block"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                scale: { duration: 0.7, type: "spring", bounce: 0.6 },
                rotate: { duration: 1 }
              }}
            >
              <motion.div
                className="absolute inset-0 bg-green-400/30 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.4, 0.7, 0.4]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <TreePine className="w-40 h-40 text-green-600 relative z-10" />
            </motion.div>

            {/* Sparkles and leaves around */}
            {[...Array(16)].map((_, i) => {
              const angle = (i * 360) / 16;
              const radius = 120;
              const x = Math.cos((angle * Math.PI) / 180) * radius;
              const y = Math.sin((angle * Math.PI) / 180) * radius;
              const isLeaf = i % 2 === 0;
              
              return (
                <motion.div
                  key={`particle-${i}`}
                  className={`absolute ${isLeaf ? 'text-green-400' : 'text-yellow-400'}`}
                  style={{ left: "50%", top: "25%" }}
                  animate={{
                    x: [0, x * 0.7, x, x * 0.7, 0],
                    y: [0, y * 0.7, y, y * 0.7, 0],
                    opacity: [0, 0.8, 1, 0.8, 0],
                    scale: [0, 1.2, 1.5, 1.2, 0],
                    rotate: isLeaf ? [0, 180, 360] : [0, 90, 180, 270, 360]
                  }}
                  transition={{
                    duration: 3,
                    delay: 0.5 + i * 0.08,
                    repeat: Infinity,
                    repeatDelay: 2
                  }}
                >
                  {isLeaf ? <Leaf className="w-6 h-6" /> : <Sparkles className="w-5 h-5" />}
                </motion.div>
              );
            })}

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.7 }}
              className="space-y-4 relative z-10"
            >
              <motion.h2
                className="text-4xl sm:text-5xl text-green-900"
                animate={{
                  textShadow: [
                    "0 0 20px rgba(34, 197, 94, 0)",
                    "0 0 30px rgba(34, 197, 94, 0.3)",
                    "0 0 20px rgba(34, 197, 94, 0)"
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                🎉 Your Green Wellness Plan is Ready!
              </motion.h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                You've taken the first step toward a healthier you — and a greener Earth. {formData.firstName && `Welcome aboard, ${formData.firstName}!`}
              </p>
            </motion.div>

            {/* Summary cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.7 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto relative z-10"
            >
              {[
                { icon: "🌍", label: "Carbon Footprint", value: "Analyzed" },
                { icon: "💚", label: "Wellness Plan", value: "Created" },
                { icon: "🍽️", label: "Meal Plan", value: "Ready" },
                { icon: "🎯", label: "Goals", value: "Locked In" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.5, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ 
                    delay: 1.5 + i * 0.1, 
                    duration: 0.5,
                    type: "spring",
                    bounce: 0.5
                  }}
                  className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-5 border-2 border-green-200 hover:border-green-400 transition-all shadow-md hover:shadow-xl"
                  whileHover={{ scale: 1.08, y: -8, rotate: 2 }}
                >
                  <motion.div 
                    className="text-4xl mb-2"
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 2, 
                      delay: 2 + i * 0.2, 
                      repeat: Infinity, 
                      repeatDelay: 3 
                    }}
                  >
                    {stat.icon}
                  </motion.div>
                  <div className="text-xs text-gray-600 mb-1">{stat.label}</div>
                  <div className="text-green-700">{stat.value}</div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2, duration: 0.7 }}
              className="pt-6 relative z-10"
            >
              <Button
                onClick={handleComplete}
                className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 hover:from-green-700 hover:via-emerald-700 hover:to-green-700 text-white rounded-full px-16 py-7 text-xl shadow-2xl hover:shadow-green-500/50 transition-all bg-[length:200%_auto] hover:bg-right"
                style={{ backgroundSize: "200% auto" }}
              >
                <span className="flex items-center gap-3">
                  Continue to Dashboard 🌿
                  <motion.div
                    animate={{ x: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-6 h-6" />
                  </motion.div>
                </span>
              </Button>
            </motion.div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-green-900/60 via-emerald-800/60 to-teal-900/60 backdrop-blur-lg z-50 flex items-center justify-center p-4"
      onClick={currentStep === 16 ? undefined : onClose}
    >
      <FloatingLeaves />
      
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 60 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 60 }}
        transition={{ type: "spring", damping: 30, stiffness: 250 }}
        className="bg-white/95 backdrop-blur-sm rounded-[2rem] shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Only show for steps 1-22 */}
        {currentStep < 23 && (
          <div className="sticky top-0 bg-gradient-to-r from-green-100/90 via-emerald-100/90 to-green-100/90 backdrop-blur-md border-b border-green-200/50 p-6 rounded-t-[2rem] z-20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.15, 1]
                  }}
                  transition={{
                    rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  <Sparkles className="w-6 h-6 text-green-600" />
                </motion.div>
                <div>
                  <div className="text-green-800">Question {currentStep} of 22</div>
                  <div className="text-xs text-green-600">Begin Your Green Journey</div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-green-700 hover:text-green-900 hover:bg-green-200 rounded-full p-2 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Smooth animated progress bar */}
            <motion.div className="relative h-3 bg-green-200/50 rounded-full overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-green-500 via-emerald-500 to-green-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          </div>
        )}

        {/* Content */}
        <div className={currentStep === 23 ? "p-8" : "p-8 pb-32"}>
          <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
        </div>

        {/* Footer - Only show for steps 1-22 */}
        {currentStep < 23 && (
          <div className="sticky bottom-0 bg-white/95 backdrop-blur-md border-t border-green-100/50 rounded-b-[2rem] shadow-2xl z-20">
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-4 mx-6 mt-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <div className="p-6 flex justify-between gap-4">
              <Button
                onClick={handleBack}
                variant="outline"
                className="rounded-full border-2 border-green-300 text-green-700 hover:bg-green-50 hover:border-green-500 px-7 py-6 transition-all"
                disabled={currentStep === 1 || isLoading}
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </Button>

              <Button
                onClick={handleNext}
                disabled={((!canProceed() && currentStep !== 22) || isLoading)}
                className="rounded-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed px-10 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    {currentStep === 22 ? "Finish" : "Next"}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
