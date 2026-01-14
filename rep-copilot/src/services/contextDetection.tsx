'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// ========================================
// TYPE DEFINITIONS
// ========================================

/**
 * Time periods that map to different app modes
 * - morning: Planning mode (6AM - 9AM)
 * - execution: Field work mode (9AM - 5PM)
 * - evening: Reporting mode (5PM - 10PM)
 * - night: Off hours (10PM - 6AM)
 */
export type TimePeriod = 'morning' | 'execution' | 'evening' | 'night';

export interface TimeContext {
  period: TimePeriod;
  hour: number;
  nextTransition: Date;
  isInExecutionHours: boolean;
}

/**
 * User roles that determine app permissions and UI
 */
export type UserRole = 'field-rep' | 'district-manager';

export interface UserContext {
  role: UserRole;
  territory: string;
  targets: string[];
  name: string;
  email: string;
}

/**
 * Location proximity for account-based features
 */
export interface LocationContext {
  nearAccount: boolean;
  accountName: string | null;
  proximity: number; // meters
  lastUpdate: Date;
}

/**
 * Combined app context for all detection services
 */
export interface AppContext {
  time: TimeContext;
  user: UserContext;
  location: LocationContext;
  updateUser: (updates: Partial<UserContext>) => void;
  refreshLocation: () => Promise<void>;
}

// ========================================
// CONTEXT CREATION
// ========================================

const ContextDetectionContext = createContext<AppContext | undefined>(undefined);

// ========================================
// TIME DETECTION HELPERS
// ========================================

/**
 * Determines the current time period based on hour of day
 */
function getTimePeriod(hour: number): TimePeriod {
  if (hour >= 6 && hour < 9) return 'morning';
  if (hour >= 9 && hour < 17) return 'execution';
  if (hour >= 17 && hour < 22) return 'evening';
  return 'night';
}

/**
 * Calculates when the next time period transition will occur
 */
function getNextTransition(currentPeriod: TimePeriod): Date {
  const now = new Date();
  const next = new Date(now);

  switch (currentPeriod) {
    case 'morning':
      next.setHours(9, 0, 0, 0); // Transition to execution at 9AM
      break;
    case 'execution':
      next.setHours(17, 0, 0, 0); // Transition to evening at 5PM
      break;
    case 'evening':
      next.setHours(22, 0, 0, 0); // Transition to night at 10PM
      break;
    case 'night':
      // If before 6AM, next transition is 6AM today
      // If after 10PM, next transition is 6AM tomorrow
      if (now.getHours() < 6) {
        next.setHours(6, 0, 0, 0);
      } else {
        next.setDate(next.getDate() + 1);
        next.setHours(6, 0, 0, 0);
      }
      break;
  }

  return next;
}

/**
 * Creates the initial time context based on current time
 */
function createInitialTimeContext(): TimeContext {
  const now = new Date();
  const hour = now.getHours();
  const period = getTimePeriod(hour);

  return {
    period,
    hour,
    nextTransition: getNextTransition(period),
    isInExecutionHours: period === 'execution',
  };
}

// ========================================
// USER DETECTION HELPERS
// ========================================

/**
 * Creates initial user context
 * In production, this would come from authentication service
 * For now, we default to field-rep role
 */
function createInitialUserContext(): UserContext {
  return {
    role: 'field-rep',
    territory: 'Northeast Region',
    targets: [
      'Dr. Sarah Johnson - Cardiology',
      'Dr. Michael Chen - Oncology',
      'Metro General Hospital',
    ],
    name: 'Jamie Rivera',
    email: 'jamie.rivera@astraZeneca.com',
  };
}

// ========================================
// LOCATION DETECTION HELPERS (MOCK)
// ========================================

/**
 * Mock location detection for development
 * In production, this would use Geolocation API + account database
 */
async function detectNearbyAccount(): Promise<LocationContext> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Mock implementation: randomly detect proximity for demo
  const isNearAccount = Math.random() > 0.7; // 30% chance of being near an account

  if (isNearAccount) {
    return {
      nearAccount: true,
      accountName: 'Metro General Hospital - Cardiology Wing',
      proximity: Math.floor(Math.random() * 200) + 50, // 50-250 meters
      lastUpdate: new Date(),
    };
  }

  return {
    nearAccount: false,
    accountName: null,
    proximity: 0,
    lastUpdate: new Date(),
  };
}

function createInitialLocationContext(): LocationContext {
  return {
    nearAccount: false,
    accountName: null,
    proximity: 0,
    lastUpdate: new Date(),
  };
}

// ========================================
// PROVIDER COMPONENT
// ========================================

interface ContextProviderProps {
  children: ReactNode;
  initialUser?: Partial<UserContext>;
}

export function ContextProvider({ children, initialUser }: ContextProviderProps) {
  const [timeContext, setTimeContext] = useState<TimeContext>(createInitialTimeContext);
  const [userContext, setUserContext] = useState<UserContext>(() => ({
    ...createInitialUserContext(),
    ...initialUser,
  }));
  const [locationContext, setLocationContext] = useState<LocationContext>(
    createInitialLocationContext
  );

  // Update time context every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const newContext = createInitialTimeContext();
      setTimeContext(newContext);
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Update location context every 5 minutes (or when manually triggered)
  useEffect(() => {
    const interval = setInterval(() => {
      detectNearbyAccount().then(setLocationContext);
    }, 300000); // Update every 5 minutes

    // Initial detection
    detectNearbyAccount().then(setLocationContext);

    return () => clearInterval(interval);
  }, []);

  const updateUser = (updates: Partial<UserContext>) => {
    setUserContext(prev => ({ ...prev, ...updates }));
  };

  const refreshLocation = async () => {
    const newLocation = await detectNearbyAccount();
    setLocationContext(newLocation);
  };

  const contextValue: AppContext = {
    time: timeContext,
    user: userContext,
    location: locationContext,
    updateUser,
    refreshLocation,
  };

  return (
    <ContextDetectionContext.Provider value={contextValue}>
      {children}
    </ContextDetectionContext.Provider>
  );
}

// ========================================
// CUSTOM HOOKS
// ========================================

/**
 * Main hook to access all context detection services
 * @throws Error if used outside of ContextProvider
 */
export function useAppContext(): AppContext {
  const context = useContext(ContextDetectionContext);
  if (!context) {
    throw new Error('useAppContext must be used within a ContextProvider');
  }
  return context;
}

/**
 * Hook for time-based context only
 */
export function useTimeContext(): TimeContext {
  const { time } = useAppContext();
  return time;
}

/**
 * Hook for user context only
 */
export function useUserRole(): UserContext {
  const { user } = useAppContext();
  return user;
}

/**
 * Hook for location context only
 */
export function useLocationContext(): LocationContext {
  const { location } = useAppContext();
  return location;
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Get greeting message based on time period
 */
export function getGreeting(period: TimePeriod): string {
  switch (period) {
    case 'morning':
      return 'Good morning';
    case 'execution':
      return 'Hello';
    case 'evening':
      return 'Good evening';
    case 'night':
      return 'Working late?';
  }
}

/**
 * Get time period display name
 */
export function getTimePeriodLabel(period: TimePeriod): string {
  switch (period) {
    case 'morning':
      return 'Planning Mode';
    case 'execution':
      return 'Execution Hours';
    case 'evening':
      return 'Reporting Mode';
    case 'night':
      return 'Off Hours';
  }
}

/**
 * Check if user has permission for a feature
 */
export function hasPermission(userRole: UserRole, requiredRole: UserRole): boolean {
  // District managers have all permissions
  if (userRole === 'district-manager') return true;
  // Field reps only have access to field-rep features
  return userRole === requiredRole;
}

/**
 * Format proximity distance for display
 */
export function formatProximity(meters: number): string {
  if (meters < 1000) {
    return `${meters}m away`;
  }
  return `${(meters / 1000).toFixed(1)}km away`;
}
