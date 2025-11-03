import { motion, useInView } from "motion/react";
import { useRef, useState, useEffect } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Leaf, Heart, Globe, Sparkles } from "lucide-react";

export function OurMission() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.3 });
  const [floatingLeaves, setFloatingLeaves] = useState<Array<{ id: number; x: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    // Generate floating leaves for ambient animation
    const leaves = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 15 + Math.random() * 10
    }));
    setFloatingLeaves(leaves);
  }, []);

  return (
    <section
      id="our-mission"
      ref={sectionRef}
      className="relative py-24 overflow-hidden bg-gradient-to-b from-emerald-50 via-green-50 to-teal-50"
    >
      {/* Ambient floating leaves background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingLeaves.map((leaf) => (
          <motion.div
            key={leaf.id}
            className="absolute text-green-300/30"
            style={{ left: `${leaf.x}%`, top: '-5%' }}
            animate={{
              y: ['0vh', '110vh'],
              x: [0, Math.sin(leaf.id) * 50, 0],
              rotate: [0, 360],
              opacity: [0, 0.6, 0.6, 0]
            }}
            transition={{
              duration: leaf.duration,
              delay: leaf.delay,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <Leaf className="w-6 h-6" />
          </motion.div>
        ))}
      </div>

      {/* Subtle glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-radial from-green-200/20 via-transparent to-transparent"
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center gap-2 mb-4"
            animate={{
              y: [0, -5, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Sparkles className="w-5 h-5 text-green-600" />
            <span className="text-sm tracking-wider text-green-700 uppercase" style={{ fontFamily: 'Cinzel, serif' }}>
              Our Purpose
            </span>
            <Sparkles className="w-5 h-5 text-green-600" />
          </motion.div>
          
          <motion.h2
            className="text-4xl sm:text-5xl lg:text-6xl text-green-900 mb-6"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Our Mission
          </motion.h2>
          
          <motion.p
            className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            We believe that every small action creates ripples of change. Together, we're building a movement where living sustainably isn't just a choice—it's a way of life.
          </motion.p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Left: Image with overlays */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1761107828991-f3bf76086a99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmUlMjBmb3Jlc3QlMjBzdW5saWdodCUyMHBlYWNlZnVsfGVufDF8fHx8MTc2MTU5NTE3NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Peaceful forest with sunlight filtering through trees"
                className="w-full h-[500px] object-cover"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-green-900/60 via-transparent to-transparent" />
              
              {/* Floating quote overlay */}
              <motion.div
                className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <div className="flex items-start gap-3">
                  <Heart className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <p className="text-gray-800 italic leading-relaxed">
                    "The Earth does not belong to us. We belong to the Earth. Every choice we make is a vote for the world we want to live in."
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right: Storytelling Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="space-y-8"
          >
            {/* Story paragraphs with staggered animation */}
            {[
              {
                icon: Globe,
                title: "A World in Balance",
                text: "We started with a simple question: What if sustainable living felt natural, rewarding, and joyful? What if we could help people see that caring for the planet is caring for ourselves?"
              },
              {
                icon: Heart,
                title: "Connection & Community",
                text: "Ekoliv isn't just an app—it's a global community of dreamers, doers, and Earth-lovers. Together, we're proving that small daily habits create massive collective impact."
              },
              {
                icon: Leaf,
                title: "The Future We Choose",
                text: "Every meal planned, every walk taken, every tree planted through our platform is a step toward a thriving planet. You're not just tracking habits—you're writing a new story for humanity."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.6 + index * 0.2, duration: 0.6 }}
                className="flex gap-4 group"
              >
                <motion.div
                  className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  animate={{
                    y: [0, -8, 0],
                  }}
                  transition={{
                    duration: 2.5 + index * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.3
                  }}
                >
                  <item.icon className="w-6 h-6 text-green-600" />
                </motion.div>
                <div>
                  <h3 className="text-green-900 mb-2">{item.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{item.text}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom: Visual Impact Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="grid md:grid-cols-3 gap-8"
        >
          {/* Card 1: Planting */}
          <motion.div
            className="relative rounded-2xl overflow-hidden shadow-lg group"
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="relative h-64">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1651838677683-f642527059c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kcyUyMHBsYW50aW5nJTIwdHJlZSUyMHNvaWx8ZW58MXx8fHwxNzYxNTk1MTc0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Hands planting a tree in soil"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 via-green-900/40 to-transparent" />
              <motion.div
                className="absolute inset-0 bg-green-600/0 group-hover:bg-green-600/10 transition-colors duration-300"
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h4 className="text-white mb-2">Plant Seeds of Change</h4>
              <p className="text-green-50 text-sm">Every action you track helps fund real tree planting initiatives worldwide.</p>
            </div>
          </motion.div>

          {/* Card 2: Earth */}
          <motion.div
            className="relative rounded-2xl overflow-hidden shadow-lg group"
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="relative h-64">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1632395627760-72e6eca7f9c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlYXJ0aCUyMGZyb20lMjBzcGFjZSUyMGJsdWUlMjBncmVlbnxlbnwxfHx8fDE3NjE1OTUxNzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Earth from space showing blue and green"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-900/40 to-transparent" />
              <motion.div
                className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-colors duration-300"
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h4 className="text-white mb-2">Protect Our Home</h4>
              <p className="text-blue-50 text-sm">Track your carbon footprint reduction and see your real-time impact on climate change.</p>
            </div>
          </motion.div>

          {/* Card 3: Community */}
          <motion.div
            className="relative rounded-2xl overflow-hidden shadow-lg group bg-gradient-to-br from-green-600 to-emerald-600"
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="relative h-64 flex flex-col items-center justify-center p-8 text-center">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Heart className="w-20 h-20 text-white mb-4" />
              </motion.div>
              <h4 className="text-white mb-2">Join the Movement</h4>
              <p className="text-green-50 text-sm mb-4">50,000+ eco-warriors already making a difference. Your journey starts now.</p>
              <motion.div
                className="flex gap-2"
                animate={{
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-white rounded-full" />
                ))}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Closing Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-center mt-20"
        >
          <motion.p
            className="text-2xl text-green-800 italic max-w-4xl mx-auto leading-relaxed"
            animate={{
              opacity: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            "Together, we're not just imagining a better world—we're building it, one mindful choice at a time."
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
