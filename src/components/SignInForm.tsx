import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { X, Mail, Lock, Leaf, LogIn, AlertCircle, Loader2 } from "lucide-react";
import { authService } from "../services/auth";

interface SignInFormProps {
  onClose: () => void;
  onSignInSuccess: (userData: { name: string; email: string }) => void;
  onSignUpClick: () => void;
}

export function SignInForm({ onClose, onSignInSuccess, onSignUpClick }: SignInFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Login user with backend
      await authService.login({ email, password });

      // Get current user profile
      const userData = await authService.getCurrentUser();

      // Store user data in localStorage
      localStorage.setItem("ecolifeUser", JSON.stringify({
        name: userData.name,
        email: userData.email
      }));

      // Success - close form and notify parent
      onClose();
      onSignInSuccess({ name: userData.name, email: userData.email });
    } catch (err: any) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
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
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25 }}
        className="relative bg-gradient-to-br from-white via-green-50/30 to-emerald-50/40 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-green-600 hover:text-green-800 transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-green-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-200/30 rounded-full blur-3xl" />
        
        {/* Floating Leaves */}
        <motion.div
          className="absolute top-10 left-10"
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Leaf className="w-8 h-8 text-green-300/50" />
        </motion.div>
        <motion.div
          className="absolute bottom-20 right-10"
          animate={{
            y: [0, -15, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          <Leaf className="w-6 h-6 text-emerald-300/50" />
        </motion.div>

        {/* Content */}
        <div className="relative p-8 sm:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-block mb-4"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-4xl">🌿</span>
              </div>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl text-green-900 mb-2"
            >
              Welcome Back
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-green-700"
            >
              Continue your green journey 🌍
            </motion.p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-2"
            >
              <Label htmlFor="signin-email" className="text-green-800">
                Email or Username
              </Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
                <Input
                  id="signin-email"
                  type="text"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 rounded-full border-green-300 focus:border-green-500 bg-white/80 backdrop-blur"
                  required
                  autoFocus
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-2"
            >
              <Label htmlFor="signin-password" className="text-green-800">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
                <Input
                  id="signin-password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 rounded-full border-green-300 focus:border-green-500 bg-white/80 backdrop-blur"
                  required
                  minLength={6}
                />
              </div>
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="pt-2"
            >
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all py-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </motion.div>
          </form>

          {/* Footer Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 text-center"
          >
            <button
              type="button"
              className="text-sm text-green-600 hover:text-green-800 underline"
            >
              Forgot password?
            </button>
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-green-700">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={onSignUpClick}
                className="text-green-800 hover:text-green-900 underline"
              >
                Sign Up
              </button>
            </p>
          </motion.div>
        </div>

        {/* Planet Illustration at Bottom */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="relative pb-4"
        >
          <div className="flex justify-center">
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 60,
                repeat: Infinity,
                ease: "linear",
              }}
              className="relative"
            >
              <svg
                width="80"
                height="80"
                viewBox="0 0 120 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-lg"
              >
                <defs>
                  <radialGradient id="planetGradientSignIn" cx="35%" cy="35%">
                    <stop offset="0%" stopColor="#6ee7b7" />
                    <stop offset="30%" stopColor="#34d399" />
                    <stop offset="70%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </radialGradient>
                </defs>
                <circle cx="60" cy="60" r="45" fill="url(#planetGradientSignIn)" />
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
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
