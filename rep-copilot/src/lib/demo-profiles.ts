/**
 * Demo User Profiles for Thursday Workshop
 *
 * These profiles simulate different Field Rep contexts to demonstrate
 * the adaptive interface functionality requested by Ajitesh Khosla.
 *
 * Each profile has:
 * - Different time context (morning, planning, execution)
 * - Different location context (near accounts, not near)
 * - Different territories and regions
 */

export interface DemoProfile {
  id: string;
  name: string;
  initials: string;
  role: string;
  territory: string;
  region: string;

  // Context simulation
  timeContext: 'morning' | 'planning' | 'execution' | 'post-call' | 'evening';
  locationContext: 'near-accounts' | 'not-near' | 'unknown';
  recentActivity: 'pre-call' | 'post-call' | 'none';

  // Display settings
  greeting: string;
  executionStatus: string;
}

export const DEMO_PROFILES: Record<string, DemoProfile> = {
  sarah: {
    id: 'sarah',
    name: 'Sarah',
    initials: 'S',
    role: 'Field Rep',
    territory: 'Northeast US',
    region: 'Boston Metro',

    // Execution hours (10am-2pm) - in the field
    timeContext: 'execution',
    locationContext: 'near-accounts',
    recentActivity: 'pre-call',

    greeting: 'Hello, Sarah!',
    executionStatus: 'Execution Hours: ACTIVE',
  },

  mike: {
    id: 'mike',
    name: 'Mike',
    initials: 'M',
    role: 'Field Rep',
    territory: 'West US',
    region: 'Los Angeles',

    // Morning planning (7am-9am) - preparing for day
    timeContext: 'planning',
    locationContext: 'not-near',
    recentActivity: 'none',

    greeting: 'Good morning, Mike!',
    executionStatus: 'Planning Time: Review schedule',
  },

  jamie: {
    id: 'jamie',
    name: 'Jamie',
    initials: 'J',
    role: 'Field Rep',
    territory: 'Midwest US',
    region: 'Chicago',

    // Early morning (before 9am) - just starting day
    timeContext: 'morning',
    locationContext: 'unknown',
    recentActivity: 'post-call',

    greeting: 'Good morning, Jamie!',
    executionStatus: 'Day Starting: Preparation time',
  },
};

/**
 * Get profile by ID
 */
export function getProfile(id: string): DemoProfile {
  return DEMO_PROFILES[id] || DEMO_PROFILES.sarah;
}

/**
 * Get all profile IDs
 */
export function getProfileIds(): string[] {
  return Object.keys(DEMO_PROFILES);
}

/**
 * Get profile display label for dropdown
 */
export function getProfileLabel(profile: DemoProfile): string {
  const timeLabel = {
    'morning': 'Early Morning',
    'planning': 'Planning Time',
    'execution': 'Execution Hours',
    'post-call': 'Post-Call',
    'evening': 'Evening Review',
  }[profile.timeContext];

  return `${profile.name} (${profile.role} - ${timeLabel})`;
}
