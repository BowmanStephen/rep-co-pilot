# Context Detection Service

## Overview

The Context Detection Service powers the "hide and surface" adaptive interface for Rep Co-Pilot. It automatically detects user context (time, role, location) and provides hooks for components to adapt their UI accordingly.

## Features

### 1. Time-Based Context Detection

Automatically detects four time periods throughout the day:

- **Morning (6AM - 9AM)**: Planning Mode
- **Execution (9AM - 5PM)**: Field Work Mode
- **Evening (5PM - 10PM)**: Reporting Mode
- **Night (10PM - 6AM)**: Off Hours

**Example Usage:**
```tsx
import { useTimeContext, getGreeting } from '@/services/contextDetection';

function MyComponent() {
  const time = useTimeContext();

  return (
    <div>
      <h1>{getGreeting(time.period)}!</h1>
      <p>Current mode: {time.period}</p>

      {time.period === 'execution' && (
        <button>Log Call</button>
      )}

      {time.period === 'evening' && (
        <button>Generate Daily Report</button>
      )}
    </div>
  );
}
```

### 2. User Role Detection

Detects user role for permission-based UI:

- **Field Rep**: Standard field representative access
- **District Manager**: Extended view with territory oversight

**Example Usage:**
```tsx
import { useUserRole } from '@/services/contextDetection';

function AdminPanel() {
  const user = useUserRole();

  if (user.role !== 'district-manager') {
    return null; // Hide from field reps
  }

  return (
    <div>
      <h2>Territory Overview: {user.territory}</h2>
      {/* District manager features */}
    </div>
  );
}
```

### 3. Location Proximity Detection

Detects when user is near target accounts (mock implementation):

- **Near Account**: Shows proximity and account details
- **Not Near Account**: Standard UI

**Example Usage:**
```tsx
import { useLocationContext, formatProximity } from '@/services/contextDetection';

function LocationBanner() {
  const location = useLocationContext();

  if (!location.nearAccount) {
    return null;
  }

  return (
    <div className="bg-primary/10 p-4 rounded-lg">
      <h3>Nearby Account: {location.accountName}</h3>
      <p>{formatProximity(location.proximity)}</p>
      <button>Check In</button>
    </div>
  );
}
```

## API Reference

### Context Provider

The `ContextProvider` must wrap your app (already done in `layout.tsx`):

```tsx
import { ContextProvider } from '@/services/contextDetection';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ContextProvider initialUser={{ name: 'Custom Name' }}>
          {children}
        </ContextProvider>
      </body>
    </html>
  );
}
```

### Hooks

#### `useAppContext()`

Access all context detection services:

```tsx
const { time, user, location, updateUser, refreshLocation } = useAppContext();
```

**Returns:**
- `time`: TimeContext object
- `user`: UserContext object
- `location`: LocationContext object
- `updateUser()`: Function to update user context
- `refreshLocation()`: Function to manually refresh location

#### `useTimeContext()`

Access time context only:

```tsx
const time = useTimeContext();
// { period, hour, nextTransition, isInExecutionHours }
```

#### `useUserRole()`

Access user context only:

```tsx
const user = useUserRole();
// { role, territory, targets, name, email }
```

#### `useLocationContext()`

Access location context only:

```tsx
const location = useLocationContext();
// { nearAccount, accountName, proximity, lastUpdate }
```

### Utility Functions

#### `getGreeting(period)`

Get greeting message based on time period:

```tsx
import { getGreeting } from '@/services/contextDetection';

getGreeting('morning'); // "Good morning"
getGreeting('execution'); // "Hello"
getGreeting('evening'); // "Good evening"
getGreeting('night'); // "Working late?"
```

#### `getTimePeriodLabel(period)`

Get display label for time period:

```tsx
import { getTimePeriodLabel } from '@/services/contextDetection';

getTimePeriodLabel('execution'); // "Execution Hours"
getTimePeriodLabel('morning'); // "Planning Mode"
```

#### `formatProximity(meters)`

Format distance for display:

```tsx
import { formatProximity } from '@/services/contextDetection';

formatProximity(500); // "500m away"
formatProximity(1500); // "1.5km away"
```

#### `hasPermission(userRole, requiredRole)`

Check if user has permission:

```tsx
import { hasPermission } from '@/services/contextDetection';

const canAccess = hasPermission('district-manager', 'field-rep'); // true
const canAccess = hasPermission('field-rep', 'district-manager'); // false
```

## Real-World Examples

### Example 1: Adaptive Prompt Suggestions

Show different prompts based on time of day:

```tsx
import { useTimeContext } from '@/services/contextDetection';

function AdaptivePrompts() {
  const time = useTimeContext();

  const morningPrompts = [
    'Plan my day',
    'Review top targets',
    'Check weather for calls'
  ];

  const executionPrompts = [
    'Log call with Dr. Smith',
    'Find nearby accounts',
    'Product information for Tagrisso'
  ];

  const eveningPrompts = [
    'Generate daily report',
    'Update CRM',
    'Schedule tomorrow'
  ];

  const prompts = time.period === 'morning' ? morningPrompts :
                  time.period === 'execution' ? executionPrompts :
                  eveningPrompts;

  return (
    <div>
      {prompts.map(prompt => (
        <PromptCard key={prompt} text={prompt} />
      ))}
    </div>
  );
}
```

### Example 2: Location-Aware Notifications

Surface check-in prompt when near account:

```tsx
import { useLocationContext } from '@/services/contextDetection';

function CheckInPrompt() {
  const location = useLocationContext();

  if (!location.nearAccount) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-primary text-white p-4 rounded-lg"
    >
      <h3>You're near {location.accountName}</h3>
      <p>{formatProximity(location.proximity)}</p>
      <button>Check In Now</button>
    </motion.div>
  );
}
```

### Example 3: Role-Based Features

Hide district manager features from field reps:

```tsx
import { useUserRole } from '@/services/contextDetection';

function Dashboard() {
  const user = useUserRole();

  return (
    <div>
      <h1>Welcome, {user.name}</h1>

      {/* Available to everyone */}
      <MyTerritory />

      {/* District managers only */}
      {user.role === 'district-manager' && (
        <TerritoryComparison />
      )}

      {/* Field reps only */}
      {user.role === 'field-rep' && (
        <TodaySchedule />
      )}
    </div>
  );
}
```

### Example 4: Smart Compliance Coaching

Prioritize compliance prompts during reporting hours:

```tsx
import { useTimeContext } from '@/services/contextDetection';

function ComplianceAssistant() {
  const time = useTimeContext();

  const isReportingTime = time.period === 'evening';

  return (
    <div>
      {/* Always show compliance check */}
      <ComplianceCheck />

      {/* Surface compliance docs during evening reporting */}
      {isReportingTime && (
        <ComplianceDocsQuickAccess />
      )}
    </div>
  );
}
```

## Integration with Existing State

The context service works seamlessly with existing `page.tsx` state management:

```tsx
export default function Home() {
  // Existing state
  const [activeTab, setActiveTab] = useState<TabType>('reporting');
  const [showResponse, setShowResponse] = useState(false);

  // Context detection (new!)
  const { time, user, location } = useAppContext();

  // Use context to adapt UI
  const showPlanningFeatures = time.period === 'morning';
  const showCheckInPrompt = location.nearAccount;

  return (
    // ...existing JSX with conditional rendering based on context
  );
}
```

## Production Considerations

### Time Detection
- Already production-ready (uses system time)
- Updates every minute automatically
- Calculates transition times accurately

### User Role Detection
- Currently uses hardcoded default values
- **TODO**: Integrate with authentication service
- **TODO**: Fetch from user profile API

### Location Detection
- Currently uses mock implementation with random values
- **TODO**: Integrate with browser Geolocation API
- **TODO**: Query account database for nearby locations
- **TODO**: Handle permission requests properly

## Testing

The `ContextDebugPanel` component shows all context values in real-time:

```tsx
import ContextDebugPanel from '@/components/ContextDebugPanel';

// Add to page for development
<ContextDebugPanel />
```

Features:
- Displays all time, user, and location context
- Toggle between field-rep and district-manager roles
- Refresh location detection manually
- Shows usage examples

## File Structure

```
src/
├── services/
│   └── contextDetection.ts        # Main service file
├── components/
│   ├── ContextStatusBar.tsx        # Production UI component
│   └── ContextDebugPanel.tsx       # Development debugging tool
└── app/
    ├── layout.tsx                   # Wraps app with ContextProvider
    └── page.tsx                     # Uses context hooks
```

## Performance

- Time context updates every 60 seconds
- Location context updates every 5 minutes
- User context only updates when explicitly changed
- All hooks use React Context (no prop drilling needed)

## Next Steps

1. Integrate with authentication service for real user data
2. Implement Geolocation API for actual proximity detection
3. Add account database lookup for location-aware features
4. Consider adding more context types (device, network, previous activity)
5. A/B test different adaptive UI patterns with field reps
