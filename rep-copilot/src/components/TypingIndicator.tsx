'use client';

import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-3 px-6 py-4">
      {/* Bot Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10"
      >
        <Bot className="h-4 w-4 text-primary" />
      </motion.div>

      {/* Typing Animation */}
      <div className="flex items-center gap-2 px-4 py-3 bg-card rounded-2xl rounded-tl-none border border-border/60 shadow-sm">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-primary rounded-full"
              animate={{
                y: [0, -8, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
        <span className="text-xs text-muted-foreground ml-2">AI is thinking...</span>
      </div>
    </div>
  );
}
