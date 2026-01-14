'use client';

import { BarChart3, Users, Shield, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TabType } from './TabBar';
import { motion, useAnimation } from 'framer-motion';
import { useEffect, useState } from 'react';

interface PromptCardProps {
  text: string;
  tabType: TabType;
  onClick: () => void;
  index: number;
}

const iconMap = {
  reporting: <BarChart3 className="h-5 w-5 text-primary flex-shrink-0" />,
  crm: <Users className="h-5 w-5 text-primary flex-shrink-0" />,
  compliance: <Shield className="h-5 w-5 text-primary flex-shrink-0" />,
};

export default function PromptCard({ text, tabType, onClick, index }: PromptCardProps) {
  const controls = useAnimation();
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.1, 0.25, 1]
      }
    });
  }, [controls, index]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Create ripple
    const newRipple = { x, y, id: Date.now() };
    setRipples([...ripples, newRipple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 600);

    // Haptic feedback simulation
    controls.start({
      scale: [1, 0.97, 1],
      transition: { duration: 0.15 }
    });

    onClick();
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      onClick={handleClick}
      className={cn(
        'w-full flex items-center gap-4 p-4 rounded-lg text-left relative overflow-hidden',
        'bg-card border border-border/60',
        'shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06)]',
        'hover:shadow-[0_4px_12px_rgba(131,0,81,0.08),0_2px_4px_rgba(131,0,81,0.04)]',
        'transition-all duration-300 ease-out',
        'hover:-translate-y-1 hover:border-primary/30',
        'active:translate-y-0 active:shadow-sm',
        'group'
      )}
    >
      {/* Ripple effects */}
      {ripples.map(ripple => (
        <motion.span
          key={ripple.id}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute rounded-full bg-primary/20 pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 20,
            height: 20,
            marginLeft: -10,
            marginTop: -10,
          }}
        />
      ))}

      {/* Subtle gradient overlay on hover */}
      <motion.div
        initial={false}
        className="absolute inset-0 bg-gradient-to-r from-primary/[0.02] to-transparent pointer-events-none"
        animate={{
          opacity: 0,
        }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />

      {/* Icon container with refined shadow */}
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 shadow-sm relative z-10"
      >
        {iconMap[tabType]}
      </motion.div>

      {/* Text with better typography */}
      <span className="flex-1 text-sm text-foreground leading-relaxed font-medium relative z-10">
        {text}
      </span>

      {/* Chevron with smooth animation */}
      <motion.div
        className="relative z-10"
        whileHover={{ x: 4 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
      </motion.div>
    </motion.button>
  );
}
