import { useState } from "react";
import { Button } from "./ui/button";
import { Leaf, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AnimatedLogo } from "./AnimatedLogo";

const navLinks = [
  { name: "Our Mission", href: "#our-mission" },
  { name: "Impact", href: "#impact" },
  { name: "Testimonials", href: "#testimonials" }
];

interface HeaderProps {
  onSignInClick: () => void;
}

export function Header({ onSignInClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-green-100">
      <nav className="mx-auto max-w-7xl px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-end gap-1">
            {/* "Eko" - Letter by letter animation */}
            <div className="flex leading-none">
              {["E", "k", "o"].map((letter, index) => (
                <motion.span
                  key={`eko-${index}`}
                  className="text-2xl bg-gradient-to-br from-green-900 via-emerald-800 to-green-950 bg-clip-text text-transparent tracking-tight"
                  style={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    duration: 0.5,
                    delay: index * 0.15,
                    ease: [0.43, 0.13, 0.23, 0.96]
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>
            
            {/* Pine Tree - Grows in after "Eko" */}
            <motion.div 
              className="relative" 
              style={{ marginBottom: '2px' }}
              initial={{ opacity: 0, scale: 0, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ 
                duration: 0.6,
                delay: 0.6,
                ease: [0.34, 1.56, 0.64, 1],
                type: "spring",
                stiffness: 200
              }}
            >
              <AnimatedLogo size={32} />
            </motion.div>
            
            {/* "liv" - Letter by letter animation after tree */}
            <div className="flex leading-none">
              {["l", "i", "v"].map((letter, index) => (
                <motion.span
                  key={`liv-${index}`}
                  className="text-2xl bg-gradient-to-br from-green-900 via-emerald-800 to-green-950 bg-clip-text text-transparent tracking-tight"
                  style={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    duration: 0.5,
                    delay: 1.0 + (index * 0.15),
                    ease: [0.43, 0.13, 0.23, 0.96]
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-700 hover:text-green-600 transition-colors text-sm"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Button
              onClick={onSignInClick}
              className="bg-green-600 hover:bg-green-700 rounded-full"
            >
              Sign In
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-green-900"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden"
            >
              <div className="pt-4 pb-2 space-y-2">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="block py-2 text-gray-700 hover:text-green-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}
                <div className="pt-4 space-y-2">
                  <Button
                    onClick={() => {
                      onSignInClick();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Sign In
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
