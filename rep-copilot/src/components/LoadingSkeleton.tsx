'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface LoadingSkeletonProps {
  className?: string;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

// Shimmer effect component
const Shimmer = ({ delay = 0 }: { delay?: number }) => (
  <motion.div
    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
    animate={{
      x: ['-100%', '200%'],
    }}
    transition={{
      duration: 1.5,
      repeat: Infinity,
      ease: "linear",
      delay,
    }}
  />
);

export default function LoadingSkeleton({ className }: LoadingSkeletonProps) {
  return (
    <div className={cn('min-h-screen pb-24', className)}>
      {/* Response header skeleton */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-primary text-primary-foreground px-6 py-3 flex items-center justify-between sticky top-0 z-10"
      >
        <div className="h-9 w-20 bg-primary-foreground/10 rounded" />
        <div className="h-6 w-32 bg-primary-foreground/10 rounded" />
        <div className="w-20" />
      </motion.div>

      <div className="max-w-3xl mx-auto p-6 space-y-6">
        {/* Query echo skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm bg-secondary rounded-lg px-4 py-3 relative overflow-hidden"
        >
          <Shimmer delay={0.5} />
          <div className="h-4 bg-muted/30 rounded w-2/3" />
        </motion.div>

        {/* Chart card skeleton */}
        <Card className="border-border/50 shadow-md p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Title */}
            <div className="h-6 bg-muted/30 rounded w-48 mx-auto relative overflow-hidden">
              <Shimmer delay={0.3} />
            </div>

            {/* Bars */}
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-14 h-4 bg-muted/30 rounded relative overflow-hidden">
                    <Shimmer delay={i * 0.2} />
                  </div>
                  <div className="flex-1 h-6 bg-muted/20 rounded overflow-hidden relative">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary/30 to-magenta/30"
                      initial={{ width: 0 }}
                      animate={{ width: `${60 + i * 10}%` }}
                      transition={{
                        duration: 0.8,
                        delay: i * 0.15,
                        ease: "easeOut"
                      }}
                    />
                  </div>
                  <div className="w-16 h-4 bg-muted/30 rounded relative overflow-hidden">
                    <Shimmer delay={i * 0.25} />
                  </div>
                  <div className="w-12 h-4 bg-muted/20 rounded relative overflow-hidden">
                    <Shimmer delay={i * 0.3} />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Card>

        {/* Summary card skeleton */}
        <Card className="bg-secondary border-0 p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            {/* Title */}
            <div className="h-5 bg-muted/30 rounded w-24 relative overflow-hidden">
              <Shimmer delay={0.6} />
            </div>

            {/* List items */}
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      delay: 0.7 + i * 0.1,
                      type: "spring",
                      stiffness: 200,
                      damping: 15
                    }}
                    className="w-4 h-4 bg-muted/30 rounded mt-0.5"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted/30 rounded w-3/4 relative overflow-hidden">
                      <Shimmer delay={0.8 + i * 0.1} />
                    </div>
                    <div className="h-3 bg-muted/20 rounded w-full relative overflow-hidden">
                      <Shimmer delay={0.9 + i * 0.1} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Card>

        {/* Follow-up chips skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="space-y-2"
        >
          <div className="h-4 bg-muted/20 rounded w-32" />
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 1.1 + i * 0.1,
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }}
                className="h-8 w-40 bg-muted/20 rounded-full relative overflow-hidden"
              >
                <Shimmer delay={1.2 + i * 0.1} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
