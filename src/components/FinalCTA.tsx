import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion } from "motion/react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Play } from "lucide-react";

export function FinalCTA() {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <section id="get-started" className="py-20 bg-gradient-to-br from-green-600 to-emerald-700 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1598984229931-c26188b3994a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3Jlc3QlMjB0cmVlcyUyMG5hdHVyZXxlbnwxfHx8fDE3NjA5NzgxMTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Forest background"
          className="w-full h-full object-cover"
        />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mx-auto max-w-4xl px-6 lg:px-8 text-center relative"
      >
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-6"
        >
          <span className="text-6xl">🌍💚</span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-3xl sm:text-4xl text-white mb-6"
        >
          Ready to Make a Difference?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-xl text-green-50 mb-8 max-w-2xl mx-auto"
        >
          Join our community of eco-warriors today. Start tracking your impact, earn rewards, and help build a sustainable future.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <Button size="lg" className="rounded-full bg-white text-green-700 hover:bg-green-50 px-8">
            Start Free Trial
          </Button>
          <Button 
            size="lg" 
            className="rounded-full bg-white text-green-700 hover:bg-green-50 px-8"
            onClick={() => setShowDemo(true)}
          >
            <Play className="mr-2 h-5 w-5" />
            Watch Demo
          </Button>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-green-100 text-sm mt-6"
        >
          No credit card required • 14-day free trial • Cancel anytime
        </motion.p>
      </motion.div>

      {/* Demo Video Dialog */}
      <Dialog open={showDemo} onOpenChange={setShowDemo}>
        <DialogContent className="max-w-4xl w-full p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-2xl">See Ekoliv in Action</DialogTitle>
            <DialogDescription>
              Watch how Ekoliv helps you track your sustainable journey and earn carbon credits
            </DialogDescription>
          </DialogHeader>
          <div className="relative w-full aspect-video bg-gray-100">
            {/* Replace with actual video URL */}
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
              title="Ekoliv Demo Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <h3 className="text-green-900 mb-1">Ready to get started?</h3>
                <p className="text-sm text-green-700">Join thousands making a difference today</p>
              </div>
              <Button 
                className="rounded-full bg-green-600 hover:bg-green-700 px-6"
                onClick={() => setShowDemo(false)}
              >
                Start Free Trial
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
