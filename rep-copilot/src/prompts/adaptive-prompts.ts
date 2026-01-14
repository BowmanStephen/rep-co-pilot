/**
 * Adaptive Prompts for Context-Aware Interface
 *
 * Generates different prompt suggestions based on:
 * - Time of day (morning planning, execution hours, evening review)
 * - Location context (near accounts, not near)
 * - Recent activity (pre-call, post-call, none)
 * - User profile (name, territory, region)
 */

import type { DemoProfile } from '@/lib/demo-profiles';

export type PromptTabType = 'reporting' | 'crm' | 'compliance';

/**
 * Time context definitions
 */
export type TimeContext =
  | 'morning-planning'  // 7am-9am: Before execution hours
  | 'execution'          // 9am-2pm: In field, visiting accounts
  | 'post-call'          // 2pm-5pm: After visits, wrap-up
  | 'evening-review'     // 5pm+: End of day review
  | 'morning';           // Early morning (before 7am)

/**
 * Location context definitions
 */
export type LocationContext = 'near-accounts' | 'not-near' | 'unknown';

/**
 * Adaptive prompt configuration
 */
export interface AdaptivePromptConfig {
  prompts: string[];
  description: string;
  timeLabel: string;
}

/**
 * Get adaptive prompts based on profile context
 *
 * This function returns different prompt suggestions based on the user's
 * current situation (time of day, location, recent activity).
 */
export function getAdaptivePrompts(
  profile: DemoProfile,
  tabType: PromptTabType = 'reporting'
): AdaptivePromptConfig {
  // Map profile timeContext to TimeContext
  const timeContext = mapProfileTimeToTimeContext(profile.timeContext);

  // Get prompts for the specific tab and context
  const prompts = getPromptsByContext(
    tabType,
    timeContext,
    profile.locationContext,
    profile.recentActivity
  );

  // Get description for this context
  const description = getContextDescription(
    tabType,
    timeContext,
    profile.locationContext
  );

  // Get time label for UI
  const timeLabel = getTimeLabel(timeContext);

  return {
    prompts,
    description,
    timeLabel,
  };
}

/**
 * Map profile time context to adaptive prompts time context
 */
function mapProfileTimeToTimeContext(
  profileTime: DemoProfile['timeContext']
): TimeContext {
  const mapping: Record<string, TimeContext> = {
    'morning': 'morning',
    'planning': 'morning-planning',
    'execution': 'execution',
    'post-call': 'post-call',
    'evening': 'evening-review',
  };

  return mapping[profileTime] || 'execution';
}

/**
 * Get prompts based on context
 */
function getPromptsByContext(
  tab: PromptTabType,
  time: TimeContext,
  location: LocationContext,
  activity: string
): string[] {
  // REPORTING TAB PROMPTS
  if (tab === 'reporting') {
    return getReportingPrompts(time, location, activity);
  }

  // CRM TAB PROMPTS
  if (tab === 'crm') {
    return getCRMPrompts(time, location, activity);
  }

  // COMPLIANCE TAB PROMPTS
  if (tab === 'compliance') {
    return getCompliancePrompts(time, location, activity);
  }

  // Default fallback
  return getDefaultPrompts(tab);
}

/**
 * REPORTING: Adaptive prompts based on context
 */
function getReportingPrompts(
  time: TimeContext,
  location: LocationContext,
  activity: string
): string[] {
  // MORNING PLANNING (7am-9am)
  if (time === 'morning-planning') {
    return [
      "Show me today's scheduled calls and route",
      "What samples should I bring today?",
      "Review yesterday's logged calls summary",
      "Any compliance issues requiring attention?",
      "Territory performance vs. target this week",
    ];
  }

  // EXECUTION HOURS - NEAR ACCOUNTS
  if (time === 'execution' && location === 'near-accounts') {
    return [
      "Accounts near me right now",
      "Quick prep for next call: talking points",
      "Last interaction with nearby HCPs",
      "Best route to my next 3 meetings",
      "Log quick call note",
    ];
  }

  // EXECUTION HOURS - NOT NEAR
  if (time === 'execution' && location !== 'near-accounts') {
    return [
      "Show me this quarter's sales performance by region",
      "Provide the top 5 prescribed products in my territory",
      "What are the monthly trends in prescription volumes?",
      "Generate a report comparing last month's and this month's sales",
      "Highlight areas with below-target sales",
    ];
  }

  // POST-CALL (2pm-5pm)
  if (time === 'post-call') {
    return [
      "Today's call summary and outcomes",
      "Samples dropped vs. inventory check",
      "Follow-up tasks from today's visits",
      "Update opportunity pipeline status",
      "Tomorrow's route optimization suggestions",
    ];
  }

  // EVENING REVIEW
  if (time === 'evening-review') {
    return [
      "Today's performance summary",
      "HCPs engaged vs. target",
      "Any missed follow-ups from today?",
      "Prepare tomorrow's schedule",
      "Weekly progress check-in",
    ];
  }

  // EARLY MORNING
  if (time === 'morning') {
    return [
      "Good morning! Show me today's priorities",
      "What's on the schedule for today?",
      "Check sample inventory for today",
      "Review overnight messages",
      "Morning briefing: top 3 focus areas",
    ];
  }

  // Default fallback
  return [
    "Show me this quarter's sales performance by region",
    "Provide the top 5 prescribed products in my territory",
    "What are the monthly trends in prescription volumes?",
    "Generate a report comparing last month's and this month's sales",
    "Highlight areas with below-target sales",
  ];
}

/**
 * CRM: Adaptive prompts based on context
 */
function getCRMPrompts(
  time: TimeContext,
  location: LocationContext,
  activity: string
): string[] {
  // MORNING PLANNING
  if (time === 'morning-planning') {
    return [
      "Who are my top 10 accounts to prioritize this week?",
      "Show me today's scheduled calls with preparation notes",
      "Any HCP birthdays or special occasions this week?",
      "Check sample inventory for today's route",
      "Review pending follow-ups from yesterday",
    ];
  }

  // EXECUTION HOURS - NEAR ACCOUNTS
  if (time === 'execution' && location === 'near-accounts') {
    return [
      "Accounts near me right now",
      "Quick profile: next HCP on my route",
      "Recent interactions with nearby HCPs",
      "Open opportunities nearby",
      "Log call with current HCP",
    ];
  }

  // POST-CALL
  if (time === 'post-call') {
    return [
      "Log call notes from today's visits",
      "Update follow-up tasks from calls",
      "Sample drop-off summary today",
      "Schedule follow-up meetings",
      "Accounts needing attention this week",
    ];
  }

  // Default CRM prompts
  return [
    "Who are my top 10 accounts to prioritize this week?",
    "What is the recent activity history for Dr. John Doe?",
    "Schedule a follow-up meeting with Dr. John Doe",
    "Show me open opportunities and their stages",
    "Provide contact details and notes for healthcare providers",
  ];
}

/**
 * COMPLIANCE: Adaptive prompts based on context
 */
function getCompliancePrompts(
  time: TimeContext,
  location: LocationContext,
  activity: string
): string[] {
  // MORNING PLANNING
  if (time === 'morning-planning') {
    return [
      "Any compliance alerts for today's scheduled calls?",
      "Check meal spend status for upcoming lunches",
      "Review compliance checklist for today",
      "Upcoming policy changes I should know about",
      "Annual spend tracking: approaching limits?",
    ];
  }

  // POST-CALL
  if (time === 'post-call') {
    return [
      "Check meal spend after today's lunch",
      "Document sample drops from today",
      "Any compliance concerns from today's calls?",
      "Log compliance documentation for today",
      "Review tomorrow's compliance requirements",
    ];
  }

  // Default compliance prompts
  return [
    "What are the guidelines for off-label discussions?",
    "Meal Spend Limit for a lunch with HCP?",
    "What is the Speaker Chairperson Honorarium limit?",
    "Explain the proper procedure for adverse event reporting",
    "Am I approaching any annual spending limits?",
  ];
}

/**
 * Get default prompts (fallback)
 */
function getDefaultPrompts(tab: PromptTabType): string[] {
  const defaults: Record<PromptTabType, string[]> = {
    reporting: [
      "Show me this quarter's sales performance by region",
      "Provide the top 5 prescribed products in my territory",
      "What are the monthly trends in prescription volumes?",
      "Generate a report comparing last month's and this month's sales",
      "Highlight areas with below-target sales",
    ],
    crm: [
      "Who are my top 10 accounts to prioritize this week?",
      "What is the recent activity history for Dr. John Doe?",
      "Schedule a follow-up meeting with Dr. John Doe",
      "Show me open opportunities and their stages",
      "Provide contact details and notes for healthcare providers",
    ],
    compliance: [
      "What are the guidelines for off-label discussions?",
      "Meal Spend Limit for a lunch with HCP?",
      "What is the Speaker Chairperson Honorarium limit?",
      "Explain the proper procedure for adverse event reporting",
      "What are the documentation requirements for samples?",
    ],
  };

  return defaults[tab] || defaults.reporting;
}

/**
 * Get context description for UI
 */
function getContextDescription(
  tab: PromptTabType,
  time: TimeContext,
  location: LocationContext
): string {
  const descriptions: Record<string, string> = {
    'reporting-morning-planning': 'Start your day with territory insights and planning',
    'reporting-execution-near-accounts': 'Quick data for your current location',
    'reporting-execution-not-near': 'Performance metrics and trends',
    'reporting-post-call': 'End-of-day summary and tomorrow prep',
    'reporting-evening-review': 'Daily performance review',

    'crm-morning-planning': 'Today\'s priorities and route planning',
    'crm-execution-near-accounts': 'Nearby accounts and quick access',
    'crm-post-call': 'Log today\'s activities and follow-ups',

    'compliance-morning-planning': 'Compliance check for today\'s schedule',
    'compliance-post-call': 'Log compliance documentation',
  };

  const key = `${tab}-${time}-${location}`;
  return descriptions[key] || getDefaultDescription(tab);
}

/**
 * Get default description
 */
function getDefaultDescription(tab: PromptTabType): string {
  const defaults: Record<PromptTabType, string> = {
    reporting: 'Sales analytics, performance metrics, and territory insights',
    crm: 'Account management, activities, and scheduling',
    compliance: 'Policy guidance, spending limits, and procedures',
  };

  return defaults[tab];
}

/**
 * Get time label for UI display
 */
function getTimeLabel(time: TimeContext): string {
  const labels: Record<TimeContext, string> = {
    'morning-planning': 'Planning Time',
    'execution': 'Execution Hours',
    'post-call': 'Wrap-Up Time',
    'evening-review': 'Evening Review',
    'morning': 'Early Morning',
  };

  return labels[time];
}

/**
 * Detect current time context from actual time
 * (Used if profile doesn't specify time context)
 */
export function detectTimeContext(): TimeContext {
  const hour = new Date().getHours();

  if (hour >= 7 && hour < 9) return 'morning-planning';
  if (hour >= 9 && hour < 14) return 'execution';
  if (hour >= 14 && hour < 17) return 'post-call';
  if (hour >= 17 || hour < 7) return 'evening-review';

  return 'morning-planning';
}
