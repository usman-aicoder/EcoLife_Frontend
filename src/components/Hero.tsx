import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion } from "motion/react";
import { AnimatedLogo } from "./AnimatedLogo";
import logoImage from "figma:asset/d0ceefb2b663bf010538bff38d240327026f425e.png";
import footprintIcon from "figma:asset/22f5f8eb279aea2020aaee8a503278cb9c4491f4.png";

interface HeroProps {
  onStartJourney: () => void;
}

export function Hero({ onStartJourney }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 pt-20">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col gap-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex flex-col items-start gap-3"
            >
              {/* Ekoliv branding */}
              <motion.div 
                className="flex flex-col items-center justify-center w-full gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                whileHover="hover"
              >
                {/* Ekoliv text with Earth icon */}
                <div className="relative flex items-baseline">
                  {/* "Ek" part */}
                  <motion.span
                    className="relative inline-block bg-gradient-to-r from-[#1e5a4d] via-[#2a7a68] to-[#1e5a4d] bg-clip-text text-transparent bg-[length:200%_auto] text-6xl sm:text-7xl lg:text-8xl tracking-tight"
                    animate={{
                      backgroundPosition: ['0% center', '200% center', '0% center'],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    style={{
                      fontWeight: 600,
                    }}
                  >
                    Ek
                  </motion.span>

                  {/* Green Planet Earth icon replacing "o" */}
                  <motion.div
                    className="relative inline-block mx-1 cursor-pointer"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.8, duration: 1, type: "spring", stiffness: 100 }}
                  >
                    <motion.svg 
                      width="52" 
                      height="52" 
                      viewBox="0 0 120 120" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg" 
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
                      

                      {/* Green spiral energy on hover - matching pine tree style */}
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
                          {/* Golden sparkles on spiral - matching pine tree */}
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
                      
                      {/* Floating leaves on hover - matching pine tree animation */}
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

                  {/* "liv" part */}
                  <motion.span
                    className="relative inline-block bg-gradient-to-r from-[#1e5a4d] via-[#2a7a68] to-[#1e5a4d] bg-clip-text text-transparent bg-[length:200%_auto] text-6xl sm:text-7xl lg:text-8xl tracking-tight"
                    animate={{
                      backgroundPosition: ['0% center', '200% center', '0% center'],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    style={{
                      fontWeight: 600,
                    }}
                  >
                    liv
                  </motion.span>

                  {/* Shimmer overlay effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
                    animate={{
                      x: ['-100%', '300%'],
                      opacity: [0, 0.3, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      repeatDelay: 2,
                    }}
                    style={{
                      mixBlendMode: 'overlay',
                    }}
                  />
                </div>
              </motion.div>

              {/* Tagline: LIVE LIGHT LIVE RIGHT */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="flex justify-center w-full"
              >
                <span className="relative text-[#1e5a4d] tracking-[0.35em] text-sm sm:text-base uppercase flex items-center gap-3" style={{ fontFamily: 'Cinzel, serif', fontWeight: 600, textShadow: '1px 1px 2px rgba(0,0,0,0.1), 0 0 1px rgba(255,255,255,0.5)' }}>
                  {/* Left runic ornament */}
                  <motion.span 
                    className="text-[#2a7a68] text-lg"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    ᛭
                  </motion.span>
                  
                  <span className="relative inline-block">
                    <span className="relative z-10">Live Light</span>
                    {/* Carved effect underline */}
                    <motion.span 
                      className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#2a7a68] to-transparent"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 1.3, duration: 0.8 }}
                    />
                  </span>
                  
                  {/* Center Nordic separator */}
                  <motion.span 
                    className="text-[#2a7a68] text-base"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    ◆
                  </motion.span>
                  
                  <span className="relative inline-block">
                    <span className="relative z-10">Live Right</span>
                    {/* Carved effect underline */}
                    <motion.span 
                      className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#2a7a68] to-transparent"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 1.4, duration: 0.8 }}
                    />
                  </span>
                  
                  {/* Right runic ornament */}
                  <motion.span 
                    className="text-[#2a7a68] text-lg"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                  >
                    ᛭
                  </motion.span>
                </span>
              </motion.div>
            </motion.div>
            {/* "Wellness for You. Wholeness for Earth." Headline - matching Nordic/eco aesthetic */}
            <motion.h2
              className="relative flex flex-wrap items-baseline gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              {/* Word-by-word animation */}
              {["Wellness", "for", "You.", "Wholeness", "for", "Earth."].map((word, index) => (
                <motion.span
                  key={`word-${index}`}
                  className="relative inline-block bg-gradient-to-r from-[#1e5a4d] via-[#2a7a68] to-[#1e5a4d] bg-clip-text text-transparent text-4xl sm:text-5xl lg:text-6xl tracking-tight"
                  style={{ 
                    textShadow: '0 2px 4px rgba(0,0,0,0.05)'
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: 0.4 + (index * 0.15),
                    duration: 0.6,
                    ease: [0.43, 0.13, 0.23, 0.96]
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg text-gray-700 max-w-xl"
            >
              Join thousands making sustainable choices every day. Track your eco-friendly habits, reduce your carbon footprint, and earn rewards that make a real difference.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Button 
                size="lg" 
                className="rounded-full bg-green-600 hover:bg-green-700 px-8"
                onClick={onStartJourney}
              >
                Begin Your Green Journey
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex gap-8 pt-4"
            >
              <div>
                <div className="text-2xl text-green-700">50K+</div>
                <div className="text-sm text-gray-600">Active Users</div>
              </div>
              <div>
                <div className="text-2xl text-green-700">2M+</div>
                <div className="text-sm text-gray-600">Trees Planted</div>
              </div>
              <div>
                <div className="text-2xl text-green-700">100K+</div>
                <div className="text-sm text-gray-600">Tons CO₂ Saved</div>
              </div>
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="relative"
          >
            <div className="rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1719825523711-eda3221c111c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kcyUyMGhvbGRpbmclMjBlYXJ0aCUyMHN1c3RhaW5hYmxlJTIwYWVzdGhldGljfGVufDF8fHx8MTc2MTEzODk1OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Hands holding Earth globe symbolizing sustainable living and environmental care"
                className="w-full h-auto aspect-[4/3] object-cover"
              />
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-lg p-4 border border-green-100"
            >
              <div className="flex items-center gap-3">
                <div className="bg-green-100 rounded-full p-3">
                  <span className="text-2xl">♻️</span>
                </div>
                <div>
                  <div className="text-green-700">Carbon Credits</div>
                  <div className="text-xl text-green-900">+125 this week</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
