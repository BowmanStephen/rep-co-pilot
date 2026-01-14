'use client';

import { Shield, AlertTriangle, XOctagon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CoachingAction {
  label: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

export interface CoachingCardProps {
  type: 'warning' | 'stop';
  header: string;
  body: string;
  suggestion: string;
  actions: CoachingAction[];
  onDismiss?: () => void;
}

export default function CoachingCard({
  type,
  header,
  body,
  suggestion,
  actions,
  onDismiss,
}: CoachingCardProps) {
  const isWarning = type === 'warning';
  
  const Icon = isWarning ? AlertTriangle : XOctagon;
  const iconColor = isWarning ? 'text-gold' : 'text-destructive';
  const borderColor = isWarning ? 'border-l-gold' : 'border-l-destructive';
  const bgGradient = isWarning 
    ? 'from-gold/5 to-transparent' 
    : 'from-destructive/5 to-transparent';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ 
        duration: 0.4, 
        ease: [0.25, 0.1, 0.25, 1],
        scale: { type: "spring", stiffness: 300, damping: 25 }
      }}
    >
      <Card className={cn(
        'border-l-4 shadow-lg overflow-hidden',
        borderColor,
        `bg-gradient-to-r ${bgGradient}`
      )}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3 text-lg">
            <motion.div
              initial={{ rotate: -15, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ 
                delay: 0.2, 
                type: "spring", 
                stiffness: 400, 
                damping: 15 
              }}
            >
              <div className={cn(
                'p-2 rounded-full',
                isWarning ? 'bg-gold/20' : 'bg-destructive/20'
              )}>
                <Icon className={cn('h-5 w-5', iconColor)} />
              </div>
            </motion.div>
            <span className="font-semibold">{header}</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Body Text */}
          <motion.p 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="text-sm text-foreground leading-relaxed"
          >
            {body}
          </motion.p>

          {/* Coaching Suggestion */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className={cn(
              'p-3 rounded-lg border',
              isWarning 
                ? 'bg-gold/5 border-gold/20' 
                : 'bg-destructive/5 border-destructive/20'
            )}
          >
            <div className="flex items-start gap-2">
              <Shield className={cn('h-4 w-4 mt-0.5 flex-shrink-0', iconColor)} />
              <p className="text-sm text-foreground/90 italic">
                {suggestion}
              </p>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="flex flex-wrap gap-2 pt-2"
          >
            {actions.map((action, index) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant={action.variant === 'secondary' ? 'outline' : 'default'}
                  size="sm"
                  onClick={action.onClick || onDismiss}
                  className={cn(
                    'text-xs font-medium',
                    action.variant !== 'secondary' && isWarning && 
                      'bg-gold hover:bg-gold/90 text-foreground',
                    action.variant !== 'secondary' && !isWarning && 
                      'bg-destructive hover:bg-destructive/90'
                  )}
                >
                  {action.label}
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
