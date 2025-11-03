import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Sparkles, Leaf, ArrowRight } from "lucide-react";

interface WelcomeScreenProps {
  userName: string;
  onClose: () => void;
}

export function WelcomeScreen({ userName, onClose }: WelcomeScreenProps) {
  const currentDay = 1;
  const totalDays = 7;
  const progressPercentage = (currentDay / totalDays) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 z-50 flex items-center justify-center p-4 overflow-hidden"
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-green-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-emerald-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-200/10 rounded-full blur-3xl" />
      </div>

      {/* Floating Leaves */}
      <motion.div
        className="absolute top-1/4 left-1/4"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 10, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Leaf className="w-12 h-12 text-green-300/40" />
      </motion.div>
      <motion.div
        className="absolute top-1/3 right-1/4"
        animate={{
          y: [0, -15, 0],
          rotate: [0, -8, 0],
          x: [0, -8, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      >
        <Leaf className="w-10 h-10 text-emerald-300/40" />
      </motion.div>
      <motion.div
        className="absolute bottom-1/3 left-1/3"
        animate={{
          y: [0, -18, 0],
          rotate: [0, 12, 0],
          x: [0, 12, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      >
        <Leaf className="w-8 h-8 text-teal-300/40" />
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ 
          type: "spring", 
          damping: 20,
          stiffness: 100,
          delay: 0.2 
        }}
        className="relative bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl max-w-2xl w-full p-8 sm:p-12 text-center"
      >
        {/* Sparkle Effect */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
          className="inline-block mb-6"
        >
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto">
              <Sparkles className="w-8 h-8 text-green-600" />
            </div>
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 bg-gradient-to-br from-green-200 to-emerald-200 rounded-full blur-xl -z-10"
            />
          </div>
        </motion.div>

        {/* Welcome Message */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-4xl sm:text-5xl text-green-900 mb-4"
        >
          Welcome, {userName}! 🌿
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-xl text-green-700 mb-8"
        >
          Your 7-day free meal and activity plan is ready!
        </motion.p>

        {/* Circular Progress Indicator */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.7, type: "spring", stiffness: 150 }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            {/* Background Circle */}
            <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r="85"
                stroke="#d1fae5"
                strokeWidth="12"
                fill="none"
              />
              {/* Progress Circle */}
              <motion.circle
                cx="100"
                cy="100"
                r="85"
                stroke="url(#progressGradient)"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                initial={{ strokeDasharray: "0 534" }}
                animate={{ 
                  strokeDasharray: `${(progressPercentage / 100) * 534} 534` 
                }}
                transition={{ 
                  duration: 1.5, 
                  delay: 0.9,
                  ease: "easeOut" 
                }}
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="50%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#6ee7b7" />
                </linearGradient>
              </defs>
            </svg>

            {/* Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
                className="text-center"
              >
                <div className="text-5xl text-green-700 mb-1">Day {currentDay}</div>
                <div className="text-sm text-green-600">of {totalDays}</div>
              </motion.div>
            </div>

            {/* Planet Decoration */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 1.3, type: "spring", stiffness: 150 }}
              className="absolute -top-4 -right-4"
            >
              <motion.div
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 40,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <svg
                  width="60"
                  height="60"
                  viewBox="0 0 120 120"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="drop-shadow-lg"
                >
                  <defs>
                    <radialGradient id="planetWelcomeGradient" cx="35%" cy="35%">
                      <stop offset="0%" stopColor="#6ee7b7" />
                      <stop offset="30%" stopColor="#34d399" />
                      <stop offset="70%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#059669" />
                    </radialGradient>
                  </defs>
                  <circle cx="60" cy="60" r="45" fill="url(#planetWelcomeGradient)" />
                  <path
                    d="M30 50 Q45 45, 60 50 T90 50"
                    stroke="#047857"
                    strokeWidth="3"
                    fill="none"
                    opacity="0.4"
                  />
                  <circle cx="40" cy="45" r="8" fill="#047857" opacity="0.3" />
                  <circle cx="70" cy="55" r="6" fill="#047857" opacity="0.3" />
                  <circle cx="55" cy="70" r="10" fill="#047857" opacity="0.3" />
                </svg>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Features List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-green-50 rounded-2xl p-4">
            <div className="text-3xl mb-2">🥗</div>
            <div className="text-sm text-green-800">Meal Plans</div>
          </div>
          <div className="bg-emerald-50 rounded-2xl p-4">
            <div className="text-3xl mb-2">👟</div>
            <div className="text-sm text-green-800">Activities</div>
          </div>
          <div className="bg-teal-50 rounded-2xl p-4">
            <div className="text-3xl mb-2">🌱</div>
            <div className="text-sm text-green-800">Impact Track</div>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          <Button
            onClick={onClose}
            className="w-full sm:w-auto rounded-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all py-6 px-12"
          >
            Open My Dashboard
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>

        {/* Footer Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="text-sm text-green-600 mt-6"
        >
          Let's start your journey towards a sustainable lifestyle 🌍💚
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
