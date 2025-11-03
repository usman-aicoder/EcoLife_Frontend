import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion } from "motion/react";
import greenFootprint from "figma:asset/3d6709515c09cd8d802d8345d788dab1100e015b.png";

const stats = [
  {
    emoji: "🌱",
    value: "2,547,382",
    label: "Trees Planted",
    suffix: "and counting"
  },
  {
    emoji: "⚖️",
    value: "142,500",
    label: "Tons CO₂ Saved",
    suffix: "this year"
  },
  {
    emoji: "💚",
    value: "50,000+",
    label: "Active Users",
    suffix: "worldwide"
  },
  {
    emoji: "🏅",
    value: "1.2M",
    label: "Carbon Credits Earned",
    suffix: "collectively"
  }
];

export function ImpactStats() {
  return (
    <section id="impact" className="py-20 bg-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlYXJ0aCUyMGZyb20lMjBzcGFjZXxlbnwxfHx8fDE3NjA4OTAxMjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Earth background"
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl text-green-900 mb-4">Our Collective Impact 🌍</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Together, we're making a real difference for our planet
          </p>
        </motion.div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <motion.div
                whileHover={{ scale: 1.2, rotate: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="mb-4 flex items-center justify-center min-h-[160px]"
              >
                {stat.label === "Trees Planted" ? (
                  <ImageWithFallback 
                    src={greenFootprint}
                    alt="Green footprint"
                    className="w-40 h-40 object-contain mx-auto"
                  />
                ) : (
                  <span className="text-5xl">{stat.emoji}</span>
                )}
              </motion.div>
              <div className="text-3xl text-green-700 mb-2">{stat.value}</div>
              <div className="text-green-900 mb-1">{stat.label === "Trees Planted" ? "Green Footprint Together" : stat.label}</div>
              <div className="text-sm text-gray-500">{stat.suffix}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
