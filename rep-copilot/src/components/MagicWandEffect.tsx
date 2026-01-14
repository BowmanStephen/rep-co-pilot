'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

interface MagicWandEffectProps {
  trigger: boolean;
  onComplete?: () => void;
}

export default function MagicWandEffect({ trigger, onComplete }: MagicWandEffectProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    if (trigger) {
      // Create sparkle particles
      const newParticles = Array.from({ length: 12 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 200 - 100, // Random X position
        y: Math.random() * 200 - 100, // Random Y position
        delay: i * 0.03,
      }));
      setParticles(newParticles);

      // Clear particles after animation
      setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, 1500);
    }
  }, [trigger, onComplete]);

  return (
    <AnimatePresence>
      {particles.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{ scale: 0, x: 0, y: 0, opacity: 1, rotate: 0 }}
              animate={{
                scale: [0, 1.5, 0],
                x: particle.x,
                y: particle.y,
                opacity: [1, 1, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 1.2,
                delay: particle.delay,
                ease: "easeOut",
              }}
              className="absolute"
            >
              <Sparkles className="h-8 w-8 text-gold" />
            </motion.div>
          ))}

          {/* Central burst effect */}
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: [0, 2, 0], opacity: [1, 0.5, 0] }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute"
          >
            <div className="w-32 h-32 rounded-full bg-gold/20 blur-xl" />
          </motion.div>

          {/* Secondary ring */}
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: [0, 3, 0], opacity: [1, 0.3, 0] }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }}
            className="absolute"
          >
            <div className="w-48 h-48 rounded-full border-2 border-gold/30" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
