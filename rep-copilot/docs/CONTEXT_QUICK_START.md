# Context Detection Service - Quick Start

## What Was Created

A complete **Context Detection Service** for the Rep Co-Pilot app that enables adaptive, "hide and surface" interfaces based on:
- Time of day (Morning/Execution/Evening/Night)
- User role (Field Rep/District Manager)
- Location proximity to accounts

## Files Created/Modified

### New Files
1. **`/src/services/contextDetection.ts`** - Main service with React Context API
2. **`/src/components/ContextStatusBar.tsx`** - Production UI component showing adaptive status
3. **`/src/components/ContextDebugPanel.tsx`** - Development debugging tool
4. **`/docs/CONTEXT_DETECTION.md`** - Complete documentation

### Modified Files
1. **`/src/app/layout.tsx`** - Added `ContextProvider` wrapper
2. **`/src/app/page.tsx`** - Integrated context hooks and `ContextStatusBar`
3. **`/src/components/ui/textarea.tsx`** - Added missing UI component
4. **`/src/components/ui/label.tsx`** - Added missing UI component

## How to Use

### Basic Usage in Any Component

```tsx
'use client';
import { useAppContext } from '@/services/contextDetection';

export default function MyComponent() {
  const { time, user, location } = useAppContext();

  return (
    <div>
      <p>Current mode: {time.period}</p>
      <p>User role: {user.role}</p>
      {location.nearAccount && <p>Near: {location.accountName}</p>}
    </div>
  );
}
```

### Time-Based Conditional Rendering

```tsx
import { useTimeContext } from '@/services/contextDetection';

function AdaptiveButtons() {
  const time = useTimeContext();

  return (
    <>
      {time.period === 'morning' && <button>Plan Day</button>}
      {time.period === 'execution' && <button>Log Call</button>}
      {time.period === 'evening' && <button>Daily Report</button>}
    </>
  );
}
```

### Role-Based Features

```tsx
import { useUserRole } from '@/services/contextDetection';

function AdminFeatures() {
  const user = useUserRole();

  // Hide district manager features from field reps
  if (user.role !== 'district-manager') {
    return null;
  }

  return <TerritoryOverview />;
}
```

### Location-Aware UI

```tsx
import { useLocationContext } from '@/services/contextDetection';

function CheckInPrompt() {
  const location = useLocationContext();

  if (!location.nearAccount) {
    return null; // Hide when not near an account
  }

  return (
    <div className="bg-primary text-white p-4 rounded">
      <h3>Nearby: {location.accountName}</h3>
      <button>Check In</button>
    </div>
  );
}
```

## Testing the Service

### Option 1: View in Production UI

The `ContextStatusBar` component is already integrated into `page.tsx`. It shows:

- Time-based greeting and period badge
- Location proximity banner (when near account)
- User role badge (for district managers)
- Context-aware quick actions

### Option 2: Debug Panel (Development)

Add the debug panel to see all context values:

```tsx
// In page.tsx or any component
import ContextDebugPanel from '@/components/ContextDebugPanel';

<ContextDebugPanel />
```

Features:
- Real-time display of all context values
- Toggle between user roles
- Refresh location detection
- View usage examples

## Available Hooks

| Hook | Returns | Use Case |
|------|---------|----------|
| `useAppContext()` | All context + update functions | Need multiple context types |
| `useTimeContext()` | Time context only | Time-based features |
| `useUserRole()` | User context only | Role-based permissions |
| `useLocationContext()` | Location context only | Proximity features |

## Utility Functions

```tsx
import {
  getGreeting,           // "Good morning", "Hello", etc.
  getTimePeriodLabel,    // "Planning Mode", "Execution Hours"
  formatProximity,       // "500m away", "1.5km away"
  hasPermission          // Check role permissions
} from '@/services/contextDetection';
```

## Example: Adaptive Prompt Suggestions

```tsx
import { useTimeContext } from '@/services/contextDetection';

function SmartPrompts() {
  const time = useTimeContext();

  const prompts = {
    morning: ['Plan my day', 'Review targets'],
    execution: ['Log call', 'Nearby accounts'],
    evening: ['Daily report', 'Update CRM'],
  };

  return (
    <div>
      {prompts[time.period]?.map(prompt => (
        <PromptCard key={prompt} text={prompt} />
      ))}
    </div>
  );
}
```

## Next Steps

### Current Implementation
- Time detection: Fully functional (uses system time)
- User role: Default values (needs auth integration)
- Location: Mock implementation with random values

### Production TODOs
1. Integrate with authentication service
2. Implement browser Geolocation API
3. Query account database for nearby locations
4. Add more context types (device, network, activity)

## Building & Running

```bash
npm run build    # Build succeeded ✓
npm run dev      # Start dev server at http://localhost:3000
```

The app is ready to use! The ContextProvider wraps the entire app, so all components can access context detection through the hooks.
