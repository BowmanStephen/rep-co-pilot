'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext, getGreeting, getTimePeriodLabel, formatProximity } from '@/services/contextDetection';
import { MapPin, Clock, Shield, User } from 'lucide-react';

/**
 * ContextStatusBar - Shows dynamic status based on detected context
 *
 * This component demonstrates the "hide and surface" adaptive interface:
 * - Changes greeting based on time of day
 * - Shows location proximity banner when near an account
 * - Displays role badge for district managers
 * - Surfaces relevant actions based on current context
 */
export default function ContextStatusBar() {
  const { time, user, location } = useAppContext();

  return (
    <div className="max-w-3xl mx-auto px-6 py-4 space-y-3">
      {/* Time-based Greeting */}
      <motion.div
        key={`greeting-${time.period}`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">
            {getGreeting(time.period)}, {user.name.split(' ')[0]}!
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
            time.period === 'execution'
              ? 'bg-primary/10 text-primary'
              : 'bg-secondary/50 text-muted-foreground'
          }`}>
            {getTimePeriodLabel(time.period)}
          </span>
        </div>
      </motion.div>

      {/* Location-based Banner (surfaces only when near account) */}
      <AnimatePresence>
        {location.nearAccount && location.accountName && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-3"
          >
            <div className="flex items-start gap-3">
              <div className="bg-primary/20 rounded-full p-2 mt-0.5">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-primary mb-0.5">
                  Nearby Account Detected
                </p>
                <p className="text-sm text-foreground mb-1">
                  {location.accountName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatProximity(location.proximity)} • Last updated: {location.lastUpdate.toLocaleTimeString()}
                </p>
              </div>
              <button className="text-xs bg-primary text-white px-3 py-1.5 rounded-md hover:bg-primary/90 transition-colors">
                Check In
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Role Badge (shows for district managers) */}
      <AnimatePresence>
        {user.role === 'district-manager' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-lg px-3 py-2"
          >
            <Shield className="w-4 h-4 text-gold" />
            <span className="text-xs font-medium text-gold">
              District Manager View • Territory: {user.territory}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Context-aware Quick Actions */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {time.period === 'morning' && (
          <>
            <QuickAction icon="📋" label="Plan Day" />
            <QuickAction icon="🎯" label="Top Targets" />
            <QuickAction icon="📊" label="Review Targets" />
          </>
        )}
        {time.period === 'execution' && (
          <>
            <QuickAction icon="📍" label="Nearby" />
            <QuickAction icon="📝" label="Log Call" />
            <QuickAction icon="💊" label="Product Info" />
          </>
        )}
        {time.period === 'evening' && (
          <>
            <QuickAction icon="📈" label="Daily Report" />
            <QuickAction icon="✅" label="Update CRM" />
            <QuickAction icon="📅" label="Schedule Tomorrow" />
          </>
        )}
        {time.period === 'night' && (
          <>
            <QuickAction icon="🌙" label="Off Hours" />
            <QuickAction icon="📧" label="Catch-up Email" />
          </>
        )}
      </div>
    </div>
  );
}

interface QuickActionProps {
  icon: string;
  label: string;
}

function QuickAction({ icon, label }: QuickActionProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center gap-1.5 bg-card border border-border/60 hover:border-primary/40 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
    >
      <span>{icon}</span>
      <span>{label}</span>
    </motion.button>
  );
}
