import { motion } from "motion/react";
import { useState } from "react";

interface AnimatedLogoProps {
  size?: number;
  className?: string;
}

export function AnimatedLogo({ size = 40, className = "" }: AnimatedLogoProps) {
  const [animationKey, setAnimationKey] = useState(0);

  const handleHover = () => {
    setAnimationKey(prev => prev + 1);
  };

  return (
    <motion.div 
      className={`inline-block cursor-pointer ${className}`}
      onMouseEnter={handleHover}
      whileHover="hover"
    >
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        key={animationKey}
        className="drop-shadow-lg"
        variants={{
          hover: { scale: 2, rotate: 15 }
        }}
        transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
      >
        <defs>
          <radialGradient id="greenEarthGradient" cx="35%" cy="35%">
            <stop offset="0%" stopColor="#6ee7b7" />
            <stop offset="30%" stopColor="#34d399" />
            <stop offset="70%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </radialGradient>
          <radialGradient id="darkGreenGradient" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#047857" />
            <stop offset="100%" stopColor="#065f46" />
          </radialGradient>
          <filter id="greenEarthGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Base green planet */}
        <motion.circle 
          cx="60" 
          cy="60" 
          r="35" 
          fill="url(#greenEarthGradient)"
          animate={{
            filter: [
              "drop-shadow(0 0 8px rgba(16, 185, 129, 0.4))",
              "drop-shadow(0 0 16px rgba(16, 185, 129, 0.6))",
              "drop-shadow(0 0 8px rgba(16, 185, 129, 0.4))"
            ]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Darker green land patterns */}
        <path 
          d="M40 50 Q45 47, 50 51 L52 56 Q50 60, 45 61 L40 58 Q38 54, 40 50 Z" 
          fill="url(#darkGreenGradient)" 
          opacity="0.85"
        />
        <path 
          d="M55 40 Q60 38, 66 42 L70 48 Q71 54, 67 58 L62 60 Q57 58, 55 53 L54 46 Q54 43, 55 40 Z" 
          fill="url(#darkGreenGradient)" 
          opacity="0.85"
        />
        <path 
          d="M72 62 Q75 60, 78 63 L79 68 Q77 71, 73 72 L70 70 Q69 66, 72 62 Z" 
          fill="url(#darkGreenGradient)" 
          opacity="0.85"
        />
        <path 
          d="M30 65 Q33 63, 37 66 L38 72 Q35 74, 31 73 L29 69 Q28 67, 30 65 Z" 
          fill="url(#darkGreenGradient)" 
          opacity="0.8"
        />
        
        {/* Bright highlight shine */}
        <motion.ellipse
          cx="48"
          cy="48"
          rx="18"
          ry="20"
          fill="white"
          opacity="0.3"
          animate={{
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Green spiral energy on hover */}
        {[0, 120, 240].map((startAngle, i) => (
          <motion.g
            key={`spiral-${i}`}
            variants={{
              hover: { opacity: 1 }
            }}
            initial={{ opacity: 0 }}
          >
            <motion.path
              d={`M${60 + Math.cos(startAngle * Math.PI / 180) * 40} ${60 + Math.sin(startAngle * Math.PI / 180) * 40} 
                  Q${60 + Math.cos((startAngle + 80) * Math.PI / 180) * 30} ${60 + Math.sin((startAngle + 80) * Math.PI / 180) * 30}, 
                  ${60 + Math.cos((startAngle + 160) * Math.PI / 180) * 45} ${60 + Math.sin((startAngle + 160) * Math.PI / 180) * 45}`}
              stroke="#10b981"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              opacity="0.8"
              filter="url(#greenEarthGlow)"
              initial={{ pathLength: 0 }}
              animate={{
                pathLength: [0, 1],
                opacity: [0.5, 0.9, 0.5]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut"
              }}
            />
            {/* Golden sparkles on spiral */}
            {[0, 1, 2].map((s) => {
              const sparkleAngle = startAngle + s * 60;
              const sx = 60 + Math.cos(sparkleAngle * Math.PI / 180) * (40 - s * 4);
              const sy = 60 + Math.sin(sparkleAngle * Math.PI / 180) * (40 - s * 4);
              return (
                <motion.circle
                  key={`sparkle-${s}`}
                  cx={sx}
                  cy={sy}
                  r="1.5"
                  fill="#fbbf24"
                  filter="url(#greenEarthGlow)"
                  animate={{
                    scale: [0, 1.6, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.5 + s * 0.25,
                    ease: "easeInOut"
                  }}
                />
              );
            })}
          </motion.g>
        ))}
        
        {/* Floating leaves on hover */}
        {[
          { x: 40, y: 45, rotate: -15 },
          { x: 75, y: 55, rotate: 15 },
          { x: 55, y: 70, rotate: -10 }
        ].map((leaf, i) => (
          <motion.ellipse
            key={`leaf-${i}`}
            cx={leaf.x}
            cy={leaf.y}
            rx="2.5"
            ry="4"
            fill="#22c55e"
            initial={{ opacity: 0, y: 0 }}
            variants={{
              hover: {
                opacity: [0, 0.9, 0],
                y: [0, -18, -35],
                rotate: [leaf.rotate, leaf.rotate + 180, leaf.rotate + 360]
              }
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeOut"
            }}
          />
        ))}
      </motion.svg>
    </motion.div>
  );
}
