import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  X, 
  Sparkles, 
  MessageCircle, 
  Bell, 
  Target,
  Lightbulb,
  Calendar,
  TrendingUp,
  Heart,
  Leaf,
  CheckCircle2,
  Crown,
  Zap,
  ArrowLeft
} from "lucide-react";

interface AssistantSubscriptionProps {
  onClose: () => void;
}

export function AssistantSubscription({ onClose }: AssistantSubscriptionProps) {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("monthly");

  const chatMessages = [
    {
      type: "assistant",
      message: "Good morning! 🌅 Ready to start your day with a healthy breakfast?",
      time: "9:00 AM"
    },
    {
      type: "user",
      message: "Yes! What do you suggest?"
    },
    {
      type: "assistant",
      message: "How about avocado toast with poached eggs? It's high in protein and saves 0.3kg CO₂ compared to processed breakfast! 🥑",
      time: "9:01 AM"
    },
    {
      type: "user",
      message: "Perfect! 💚"
    }
  ];

  const benefits = [
    {
      icon: Lightbulb,
      title: "Personalized Meal Tips",
      description: "Get daily eco-friendly meal suggestions based on your preferences",
      color: "from-yellow-100 to-amber-100"
    },
    {
      icon: Bell,
      title: "Smart Reminders",
      description: "Never miss your daily activities with gentle, timely nudges",
      color: "from-blue-100 to-cyan-100"
    },
    {
      icon: Target,
      title: "Eco Challenges",
      description: "Fun weekly challenges to boost your carbon credits",
      color: "from-green-100 to-emerald-100"
    },
    {
      icon: TrendingUp,
      title: "Progress Insights",
      description: "Weekly reports on your environmental impact and health",
      color: "from-purple-100 to-pink-100"
    },
    {
      icon: Heart,
      title: "Wellness Support",
      description: "24/7 guidance for sustainable living and healthy habits",
      color: "from-rose-100 to-red-100"
    },
    {
      icon: Calendar,
      title: "Meal Planning",
      description: "Auto-generate weekly meal plans that save carbon",
      color: "from-teal-100 to-cyan-100"
    }
  ];

  const plans = [
    {
      id: "monthly",
      name: "Monthly",
      price: "$4.99",
      period: "/month",
      description: "Perfect for getting started",
      features: [
        "Unlimited chat messages",
        "Daily meal suggestions",
        "Smart reminders",
        "Weekly eco challenges",
        "Progress tracking"
      ]
    },
    {
      id: "yearly",
      name: "Yearly",
      price: "$49.99",
      period: "/year",
      savings: "Save 17%",
      description: "Best value for committed users",
      features: [
        "Everything in Monthly",
        "Priority support",
        "Advanced analytics",
        "Custom challenges",
        "Early access to features"
      ],
      popular: true
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto"
      onClick={onClose}
    >
      <div className="min-h-screen flex items-center justify-center p-4 py-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25 }}
          className="relative bg-gradient-to-br from-white via-green-50/30 to-emerald-50/40 rounded-3xl shadow-2xl max-w-6xl w-full overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-green-700 hover:bg-white hover:text-green-900 transition-all shadow-lg hover:shadow-xl z-20 group"
            aria-label="Close"
          >
            <X className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-200/30 rounded-full blur-3xl" />

          <div className="relative z-10 p-6 md:p-12 pt-16 md:pt-12">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full mb-6"
            >
              <MessageCircle className="w-10 h-10 text-green-600" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl text-green-900 mb-3"
            >
              Meet Your Eco Life Assistant 🌿
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-green-700 max-w-2xl mx-auto"
            >
              Your personal AI companion for sustainable living and wellness
            </motion.p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Chat Preview */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="p-6 bg-white/80 backdrop-blur-sm border-green-100 h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl text-green-900">Live Chat Preview</h3>
                    <p className="text-sm text-green-600">See how I can help you</p>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="space-y-4 mb-6">
                  {chatMessages.map((msg, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.2 }}
                      className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          msg.type === "user"
                            ? "bg-green-600 text-white rounded-br-sm"
                            : "bg-gray-100 text-gray-900 rounded-bl-sm"
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                        {msg.time && (
                          <p
                            className={`text-xs mt-1 ${
                              msg.type === "user" ? "text-green-100" : "text-gray-500"
                            }`}
                          >
                            {msg.time}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Typing Indicator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4 }}
                  className="flex items-center gap-2 text-green-600"
                >
                  <div className="flex gap-1">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                      className="w-2 h-2 bg-green-600 rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                      className="w-2 h-2 bg-green-600 rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                      className="w-2 h-2 bg-green-600 rounded-full"
                    />
                  </div>
                  <span className="text-sm">Assistant is typing...</span>
                </motion.div>

                {/* Feature Badge */}
                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100">
                  <div className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-green-900 mb-1">Powered by AI</p>
                      <p className="text-xs text-green-600">
                        Get instant, personalized responses based on your goals and preferences
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Benefits Grid */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-4"
            >
              <h3 className="text-2xl text-green-900 mb-6">What You'll Get</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    <Card className={`p-4 bg-gradient-to-br ${benefit.color} border-none h-full hover:scale-105 transition-transform`}>
                      <benefit.icon className="w-8 h-8 text-green-700 mb-3" />
                      <h4 className="text-green-900 mb-1">{benefit.title}</h4>
                      <p className="text-sm text-green-700">{benefit.description}</p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Pricing Plans */}
          <div className="mb-8">
            <h3 className="text-2xl text-green-900 text-center mb-8">Choose Your Plan</h3>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                  className="relative"
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                      <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-1">
                        <Crown className="w-3 h-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <Card
                    className={`p-8 cursor-pointer transition-all ${
                      selectedPlan === plan.id
                        ? "border-green-500 border-2 bg-gradient-to-br from-green-50 to-emerald-50 scale-105"
                        : "border-green-200 hover:border-green-300 bg-white/80 backdrop-blur-sm"
                    } ${plan.popular ? "pt-10" : ""}`}
                    onClick={() => setSelectedPlan(plan.id as "monthly" | "yearly")}
                  >
                    <div className="text-center mb-6">
                      <h4 className="text-2xl text-green-900 mb-2">{plan.name}</h4>
                      <p className="text-sm text-green-600 mb-4">{plan.description}</p>
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-4xl text-green-900">{plan.price}</span>
                        <span className="text-green-600">{plan.period}</span>
                      </div>
                      {plan.savings && (
                        <Badge className="mt-2 bg-green-100 text-green-700 hover:bg-green-100">
                          {plan.savings}
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-3 mb-6">
                      {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-green-800">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {selectedPlan === plan.id && (
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                      >
                        <CheckCircle2 className="w-6 h-6 text-green-600 mx-auto" />
                      </motion.div>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="text-center"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                variant="outline"
                size="lg"
                onClick={onClose}
                className="border-green-200 text-green-700 hover:bg-green-50 rounded-full px-8 py-6"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Dashboard
              </Button>
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-12 py-6 rounded-full text-lg shadow-lg hover:shadow-xl transition-all"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Subscribe Now
                <span className="ml-2">
                  {selectedPlan === "monthly" ? "$4.99/mo" : "$49.99/yr"}
                </span>
              </Button>
            </div>
            <p className="text-sm text-green-600 mt-4">
              Cancel anytime • 7-day money-back guarantee • Secure payment
            </p>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            className="mt-8 flex flex-wrap justify-center gap-8 text-green-600"
          >
            <div className="flex items-center gap-2">
              <Leaf className="w-5 h-5" />
              <span className="text-sm">Carbon Neutral</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              <span className="text-sm">10k+ Happy Users</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm">AI-Powered</span>
            </div>
          </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
