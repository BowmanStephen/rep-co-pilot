'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock } from 'lucide-react';
import type { DemoProfile } from '@/lib/demo-profiles';
import {
  getQuickActions,
  getTimeStatusLabel,
  getTimeStatusColor,
  type QuickAction,
} from '@/lib/quick-actions';

/**
 * ContextStatusBar - Shows adaptive status based on demo profile
 *
 * This component demonstrates the "hide and surface" adaptive interface:
 * - Shows greeting based on selected profile
 * - Displays time context status (Execution Hours, Planning Time, etc.)
 * - Surfaces relevant quick actions based on profile context
 * - Updates automatically when profile changes
 */
export default function ContextStatusBar() {
  const [profile, setProfile] = useState<DemoProfile | null>(null);
  const [quickActions, setQuickActions] = useState<QuickAction[]>([]);

  // Listen for profile changes from Header dropdown
  useEffect(() => {
    // Import here to avoid circular dependency
    import('@/lib/demo-profiles').then(({ getProfile }) => {
      const initialProfile = getProfile('sarah');
      setProfile(initialProfile);
      setQuickActions(getQuickActions(initialProfile));
    });

    const handleProfileChange = (event: CustomEvent) => {
      const newProfile = event.detail as DemoProfile;
      setProfile(newProfile);
      setQuickActions(getQuickActions(newProfile));
    };

    window.addEventListener('profile-change', handleProfileChange as EventListener);

    return () => {
      window.removeEventListener('profile-change', handleProfileChange as EventListener);
    };
  }, []);

  if (!profile) {
    return null; // Loading state
  }

  const timeLabel = getTimeStatusLabel(profile);
  const timeColor = getTimeStatusColor(profile);

  return (
    <div className="max-w-3xl mx-auto px-6 py-4 space-y-3">
      {/* Profile-based Greeting */}
      <motion.div
        key={`greeting-${profile.id}-${profile.timeContext}`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">
            {profile.greeting}
          </span>
        </div>
        <div className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-full font-medium border ${timeColor}`}>
          {timeLabel}
        </div>
      </motion.div>

      {/* Location-based Banner (shows when near accounts) */}
      <AnimatePresence>
        {profile.locationContext === 'near-accounts' && (
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
                  Near Target Accounts
                </p>
                <p className="text-sm text-foreground mb-1">
                  {profile.region} Territory
                </p>
                <p className="text-xs text-muted-foreground">
                  Quick actions below are optimized for your current location
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Context-aware Quick Actions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`actions-${profile.id}-${profile.timeContext}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-2 overflow-x-auto pb-2"
        >
          {quickActions.map((action, index) => (
            <motion.button
              key={`${profile.id}-${action.label}-${index}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={action.onClick}
              className={`flex items-center gap-1.5 bg-card border border-border/60 hover:border-primary/40 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                action.primary
                  ? 'bg-primary/10 border-primary/30 hover:bg-primary/15'
                  : ''
              }`}
            >
              <span>{action.icon}</span>
              <span>{action.label}</span>
            </motion.button>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
