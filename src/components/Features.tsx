import { Card } from "./ui/card";
import { Flame, Award, BarChart3, MessageCircle } from "lucide-react";
import { motion } from "motion/react";

const features = [
  {
    icon: Flame,
    emoji: "🔥",
    title: "Daily Streaks",
    description: "Build momentum with daily challenges. Maintain your streak and watch your eco-habits become second nature.",
    color: "from-orange-100 to-red-100"
  },
  {
    icon: Award,
    emoji: "🏆",
    title: "Achievement Badges",
    description: "Unlock exclusive badges as you hit milestones. Show off your commitment to sustainable living.",
    color: "from-yellow-100 to-amber-100"
  },
  {
    icon: BarChart3,
    emoji: "📈",
    title: "Impact Dashboard",
    description: "Visualize your environmental impact with beautiful charts. See your CO₂ savings grow week by week.",
    color: "from-green-100 to-emerald-100"
  },
  {
    icon: MessageCircle,
    emoji: "💬",
    title: "WhatsApp Bot",
    description: "Get daily reminders and log activities right from WhatsApp. Sustainability made convenient.",
    color: "from-blue-100 to-cyan-100"
  }
];

export function Features() {
  return (
    <section id="features" className="py-20 bg-gradient-to-b from-green-50/50 to-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl text-green-900 mb-4">Powerful Features</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to make sustainable living easy and rewarding
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="p-8 hover:shadow-lg transition-shadow border-green-100 rounded-3xl h-full">
                <motion.div
                  whileHover={{ rotate: 5, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6`}
                >
                  <span className="text-3xl">{feature.emoji}</span>
                </motion.div>
                <h3 className="text-green-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
