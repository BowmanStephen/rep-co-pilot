'use client';

import { useAppContext, getGreeting, getTimePeriodLabel, formatProximity } from '@/services/contextDetection';
import { Clock, MapPin, User, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * ContextDebugPanel - Development tool for visualizing context detection
 *
 * This component displays all context detection values in real-time.
 * Useful for development and testing - remove in production.
 */
export default function ContextDebugPanel() {
  const { time, user, location, updateUser, refreshLocation } = useAppContext();

  const handleRoleToggle = () => {
    updateUser({
      role: user.role === 'field-rep' ? 'district-manager' : 'field-rep',
    });
  };

  const handleLocationRefresh = async () => {
    await refreshLocation();
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-6 space-y-4">
      <div className="bg-graphite/5 border border-border/60 rounded-lg p-4">
        <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <span>Context Detection Service</span>
          <span className="text-xs bg-gold/20 text-gold px-2 py-0.5 rounded-full">Debug</span>
        </h2>

        {/* Time Context */}
        <div className="space-y-3">
          <div className="flex items-start gap-3 pb-3 border-b border-border/40">
            <Clock className="w-4 h-4 text-primary mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Time Context
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Period:</span>{' '}
                  <span className="font-medium">{time.period}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Hour:</span>{' '}
                  <span className="font-medium">{time.hour}:00</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Label:</span>{' '}
                  <span className="font-medium">{getTimePeriodLabel(time.period)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Greeting:</span>{' '}
                  <span className="font-medium">{getGreeting(time.period)}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Next Transition:</span>{' '}
                  <span className="font-medium">{time.nextTransition.toLocaleString()}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Execution Hours:</span>{' '}
                  <span className={`font-medium ${time.isInExecutionHours ? 'text-primary' : 'text-muted-foreground'}`}>
                    {time.isInExecutionHours ? 'Yes (Field Work Mode)' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* User Context */}
          <div className="flex items-start gap-3 pb-3 border-b border-border/40">
            <User className="w-4 h-4 text-primary mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                User Context
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Name:</span>{' '}
                  <span className="font-medium">{user.name}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Role:</span>{' '}
                  <span className="font-medium capitalize">{user.role.replace('-', ' ')}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Territory:</span>{' '}
                  <span className="font-medium">{user.territory}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Email:</span>{' '}
                  <span className="font-medium text-xs">{user.email}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Targets:</span>
                  <ul className="mt-1 space-y-0.5">
                    {user.targets.map((target, idx) => (
                      <li key={idx} className="text-xs font-medium text-foreground/80">
                        • {target}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Role Toggle Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRoleToggle}
                className="mt-3 text-xs bg-secondary/50 hover:bg-secondary/70 text-foreground px-3 py-1.5 rounded-md transition-colors border border-border/40"
              >
                Toggle Role (Current: {user.role})
              </motion.button>
            </div>
          </div>

          {/* Location Context */}
          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-primary mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Location Context
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Near Account:</span>{' '}
                  <span className={`font-medium ${location.nearAccount ? 'text-primary' : 'text-muted-foreground'}`}>
                    {location.nearAccount ? 'Yes' : 'No'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Proximity:</span>{' '}
                  <span className="font-medium">
                    {location.nearAccount ? formatProximity(location.proximity) : 'N/A'}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Account:</span>{' '}
                  <span className="font-medium">
                    {location.accountName || 'None nearby'}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Last Update:</span>{' '}
                  <span className="font-medium text-xs">
                    {location.lastUpdate.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Refresh Location Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLocationRefresh}
                className="mt-3 text-xs bg-secondary/50 hover:bg-secondary/70 text-foreground px-3 py-1.5 rounded-md transition-colors border border-border/40 flex items-center gap-1.5"
              >
                <RefreshCw className="w-3 h-3" />
                Refresh Location
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Examples */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-foreground mb-2">Usage Examples</h3>
        <div className="space-y-2 text-xs text-foreground/80">
          <p><strong className="text-foreground">Time-based prompts:</strong> Show "Plan Day" in morning, "Log Call" during execution</p>
          <p><strong className="text-foreground">Role permissions:</strong> Hide district manager features from field reps</p>
          <p><strong className="text-foreground">Location awareness:</strong> Surface check-in prompt when near account</p>
          <p><strong className="text-foreground">Smart suggestions:</strong> Prioritize compliance docs during evening reporting</p>
        </div>
      </div>
    </div>
  );
}
