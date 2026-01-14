/**
 * Context-Aware Quick Actions
 *
 * Dynamic action buttons that change based on:
 * - Time of day (morning planning, execution hours, etc.)
 * - Location context (near accounts, not near)
 * - Recent activity (pre-call, post-call)
 *
 * This implements the "hide and surface" pattern from Digibot:
 * Only show relevant actions based on current context.
 */

import type { DemoProfile } from '@/lib/demo-profiles';
import type { TimeContext } from '@/prompts/adaptive-prompts';

export interface QuickAction {
  icon: string;
  label: string;
  primary?: boolean;
  onClick?: () => void;
}

/**
 * Get quick actions based on profile context
 */
export function getQuickActions(profile: DemoProfile): QuickAction[] {
  const { timeContext, locationContext, recentActivity } = profile;

  // Map profile timeContext to TimeContext type
  const time = mapProfileTimeToTimeContext(profile.timeContext);

  if (time === 'morning-planning') {
    return getMorningPlanningActions();
  }

  if (time === 'execution') {
    if (locationContext === 'near-accounts') {
      return getExecutionNearActions();
    }
    return getExecutionActions();
  }

  if (time === 'post-call') {
    return getPostCallActions();
  }

  if (time === 'evening-review') {
    return getEveningReviewActions();
  }

  if (time === 'morning') {
    return getEarlyMorningActions();
  }

  // Default fallback
  return getExecutionActions();
}

/**
 * Morning planning actions (7am-9am)
 */
function getMorningPlanningActions(): QuickAction[] {
  return [
    {
      icon: '📅',
      label: "Today's Schedule",
      primary: true,
      onClick: () => console.log('Viewing today\'s schedule'),
    },
    {
      icon: '🗺️',
      label: 'Route Planning',
      primary: false,
      onClick: () => console.log('Planning route'),
    },
    {
      icon: '📋',
      label: 'Prep Notes',
      primary: false,
      onClick: () => console.log('Viewing prep notes'),
    },
    {
      icon: '💊',
      label: 'Check Samples',
      primary: false,
      onClick: () => console.log('Checking sample inventory'),
    },
  ];
}

/**
 * Execution hours - near accounts (9am-2pm)
 */
function getExecutionNearActions(): QuickAction[] {
  return [
    {
      icon: '📍',
      label: 'Nearby Accounts',
      primary: true,
      onClick: () => console.log('Showing nearby accounts'),
    },
    {
      icon: '📝',
      label: 'Quick Log',
      primary: false,
      onClick: () => console.log('Quick call logging'),
    },
    {
      icon: '👥',
      label: 'HCP Lookup',
      primary: false,
      onClick: () => console.log('Looking up HCP'),
    },
    {
      icon: '🧭',
      label: 'Navigation',
      primary: false,
      onClick: () => console.log('Opening navigation'),
    },
  ];
}

/**
 * Execution hours - general (9am-2pm)
 */
function getExecutionActions(): QuickAction[] {
  return [
    {
      icon: '📍',
      label: 'Nearby Accounts',
      primary: true,
      onClick: () => console.log('Showing nearby accounts'),
    },
    {
      icon: '📝',
      label: 'Log Call',
      primary: false,
      onClick: () => console.log('Logging call'),
    },
    {
      icon: '👥',
      label: 'HCP Lookup',
      primary: false,
      onClick: () => console.log('Looking up HCP'),
    },
  ];
}

/**
 * Post-call actions (2pm-5pm)
 */
function getPostCallActions(): QuickAction[] {
  return [
    {
      icon: '✅',
      label: 'Log Call Notes',
      primary: true,
      onClick: () => console.log('Logging call notes'),
    },
    {
      icon: '📦',
      label: 'Sample Drop',
      primary: false,
      onClick: () => console.log('Recording sample drop'),
    },
    {
      icon: '📋',
      label: 'Follow-up Tasks',
      primary: false,
      onClick: () => console.log('Viewing follow-up tasks'),
    },
    {
      icon: '📊',
      label: "Today's Summary",
      primary: false,
      onClick: () => console.log('Viewing daily summary'),
    },
  ];
}

/**
 * Evening review actions (5pm+)
 */
function getEveningReviewActions(): QuickAction[] {
  return [
    {
      icon: '📊',
      label: 'Today\'s Summary',
      primary: true,
      onClick: () => console.log('Viewing today\'s summary'),
    },
    {
      icon: '📅',
      label: 'Tomorrow\'s Plan',
      primary: true,
      onClick: () => console.log('Planning tomorrow'),
    },
    {
      icon: '📋',
      label: 'Compliance Check',
      primary: false,
      onClick: () => console.log('Checking compliance status'),
    },
    {
      icon: '📝',
      label: 'Update CRM',
      primary: false,
      onClick: () => console.log('Updating CRM'),
    },
  ];
}

/**
 * Early morning actions (before 7am)
 */
function getEarlyMorningActions(): QuickAction[] {
  return [
    {
      icon: '☀️',
      label: 'Good Morning!',
      primary: true,
      onClick: () => console.log('Opening daily briefing'),
    },
    {
      icon: '📅',
      label: 'Today\'s Plan',
      primary: false,
      onClick: () => console.log('Viewing today\'s plan'),
    },
    {
      icon: '🔔',
      label: 'Reminders',
      primary: false,
      onClick: () => console.log('Viewing reminders'),
    },
  ];
}

/**
 * Map profile time context to adaptive prompts time context
 */
function mapProfileTimeToTimeContext(
  profileTime: DemoProfile['timeContext']
): TimeContext {
  const mapping = {
    'morning': 'morning',
    'planning': 'morning-planning',
    'execution': 'execution',
    'post-call': 'post-call',
    'evening': 'evening-review',
  };

  return (mapping[profileTime] || 'execution') as TimeContext;
}

/**
 * Get time status label for UI
 */
export function getTimeStatusLabel(profile: DemoProfile): string {
  const labels: Record<string, string> = {
    'morning-planning': 'Planning Time',
    'planning': 'Planning Time',
    'execution': 'Execution Hours',
    'post-call': 'Wrap-Up Time',
    'evening': 'Evening Review',
    'evening-review': 'Evening Review',
    'morning': 'Early Morning',
  };

  return labels[profile.timeContext] || labels.execution;
}

/**
 * Get time status color class
 */
export function getTimeStatusColor(profile: DemoProfile): string {
  const colors: Record<string, string> = {
    'morning-planning': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    'planning': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    'execution': 'bg-green-500/10 text-green-500 border-green-500/20',
    'post-call': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    'evening': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    'evening-review': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    'morning': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  };

  return colors[profile.timeContext] || colors.execution;
}
