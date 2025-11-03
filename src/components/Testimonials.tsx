import { Card } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion } from "motion/react";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Environmental Advocate",
    image: "https://images.unsplash.com/photo-1600275669439-14e40452d20b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWlsaW5nJTIwd29tYW4lMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzYxMTE5NzQyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    quote: "Eco Life transformed how I think about daily choices. I've saved 2.5 tons of CO₂ in just 6 months!",
    stats: "2.5T CO₂ saved • 127-day streak",
    emoji: "🌟"
  },
  {
    name: "Marcus Johnson",
    role: "Tech Professional",
    image: "https://images.unsplash.com/photo-1680557345345-6f9ef109d252?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwb3J0cmFpdCUyMG91dGRvb3J8ZW58MXx8fHwxNzYxMDQ3NzE3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    quote: "The WhatsApp bot makes sustainable living so easy. I get reminders throughout the day and can log actions instantly.",
    stats: "450 carbon credits • 15 badges unlocked",
    emoji: "💪"
  },
  {
    name: "Emma Rodriguez",
    role: "Small Business Owner",
    image: "https://images.unsplash.com/photo-1656582117510-3a177bf866c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMHBlcnNvbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MTA3NzYwNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    quote: "The gamification keeps me motivated! Seeing my impact visualized on the dashboard is incredibly rewarding.",
    stats: "320 trees planted • Top 5% user",
    emoji: "🎯"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20 bg-gradient-to-b from-white to-green-50/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl text-green-900 mb-4">What Our Users Say</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real stories from people making a real difference
          </p>
        </motion.div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="p-8 h-full flex flex-col border-green-100 rounded-3xl hover:shadow-lg transition-shadow">
                <Quote className="w-10 h-10 text-green-600 mb-4" />
                <p className="text-gray-700 mb-6 flex-grow italic">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-green-200">
                    <ImageWithFallback
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <div className="text-green-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                  <span className="text-2xl">{testimonial.emoji}</span>
                </div>
                <div className="mt-4 pt-4 border-t border-green-100">
                  <div className="text-sm text-green-700">{testimonial.stats}</div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
