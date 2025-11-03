import { motion } from "motion/react";

export function FootprintIcon() {
  return (
    <motion.svg
      width="40"
      height="40"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-sm"
      whileHover={{ scale: 1.1 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <defs>
        <linearGradient id="footprintGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="50%" stopColor="#059669" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
        <filter id="footprintGlow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Main footprint sole/heel */}
      <motion.ellipse
        cx="50"
        cy="65"
        rx="22"
        ry="28"
        fill="url(#footprintGradient)"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      />
      
      {/* Big toe */}
      <motion.ellipse
        cx="45"
        cy="25"
        rx="10"
        ry="13"
        fill="url(#footprintGradient)"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      />
      
      {/* Second toe */}
      <motion.ellipse
        cx="54"
        cy="18"
        rx="8"
        ry="11"
        fill="url(#footprintGradient)"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.3 }}
      />
      
      {/* Third toe */}
      <motion.ellipse
        cx="63"
        cy="16"
        rx="7"
        ry="10"
        fill="url(#footprintGradient)"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      />
      
      {/* Fourth toe */}
      <motion.ellipse
        cx="71"
        cy="18"
        rx="6"
        ry="9"
        fill="url(#footprintGradient)"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.3 }}
      />
      
      {/* Small toe */}
      <motion.ellipse
        cx="77"
        cy="23"
        rx="5"
        ry="7"
        fill="url(#footprintGradient)"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.3 }}
      />
      
      {/* Eco streak lines - animated */}
      {[
        { x1: 30, y1: 70, x2: 20, y2: 85, delay: 0.5 },
        { x1: 40, y1: 75, x2: 32, y2: 92, delay: 0.6 },
        { x1: 50, y1: 78, x2: 45, y2: 96, delay: 0.7 }
      ].map((line, i) => (
        <motion.line
          key={`streak-${i}`}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke="#10b981"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.7"
          filter="url(#footprintGlow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.7 }}
          transition={{ delay: line.delay, duration: 0.4 }}
        />
      ))}
      
      {/* Sparkle effects */}
      {[
        { cx: 25, cy: 30, delay: 0.8 },
        { cx: 70, cy: 50, delay: 1.0 }
      ].map((sparkle, i) => (
        <motion.circle
          key={`sparkle-${i}`}
          cx={sparkle.cx}
          cy={sparkle.cy}
          r="2"
          fill="#6ee7b7"
          animate={{
            scale: [0, 1.5, 0],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: sparkle.delay,
            ease: "easeInOut"
          }}
        />
      ))}
    </motion.svg>
  );
}
