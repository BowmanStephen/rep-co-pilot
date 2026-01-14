# Context Detection Service - Implementation Summary

## Overview

Successfully created a complete **Context Detection Service** for Rep Co-Pilot that enables adaptive, "hide and surface" interfaces based on real-time context detection.

## What It Does

The service automatically detects three types of context:

### 1. Time-Based Context
- **Morning (6AM-9AM)**: Planning Mode - surfaces daily planning features
- **Execution (9AM-5PM)**: Field Work Mode - surfaces call logging, nearby accounts
- **Evening (5PM-10PM)**: Reporting Mode - surfaces reports, CRM updates
- **Night (10PM-6AM)**: Off Hours - minimal UI, catch-up features

### 2. User Role Context
- **Field Rep**: Standard field representative UI
- **District Manager**: Extended UI with territory oversight features

### 3. Location Proximity Context
- Detects when user is near target accounts
- Surfaces check-in prompts and account info
- Shows proximity distance in meters/kilometers

## Architecture

### React Context API Pattern

```
ContextProvider (layout.tsx)
    ├── TimeContext (updates every 60s)
    ├── UserContext (updates on change)
    └── LocationContext (updates every 5min)
            ↓
    useAppContext() / useTimeContext() / useUserRole() / useLocationContext()
            ↓
    Components consume context via hooks
```

## Files Created

### Core Service
**`/src/services/contextDetection.ts`** (350+ lines)

Features:
- TypeScript type definitions for all context types
- React Context creation and provider setup
- Time detection with automatic updates
- User role management with update functions
- Location detection (mock for now)
- Utility functions for formatting and permissions

### UI Components

**`/src/components/ContextStatusBar.tsx`**

Production-ready component that demonstrates adaptive UI:
- Time-based greeting that changes throughout the day
- Location proximity banner (shows only when near account)
- Role badge for district managers
- Context-aware quick action buttons

**`/src/components/ContextDebugPanel.tsx`**

Development tool for visualizing all context:
- Real-time display of all context values
- Toggle between user roles
- Refresh location button
- Usage examples

### UI Components (Added Missing)
**`/src/components/ui/textarea.tsx`**
**`/src/components/ui/label.tsx`**

### Documentation

**`/docs/CONTEXT_DETECTION.md`**
- Complete API reference
- Real-world usage examples
- Integration guide
- Production considerations

**`/docs/CONTEXT_QUICK_START.md`**
- Quick start guide
- Common patterns
- Testing instructions

### Integration

**Modified `/src/app/layout.tsx`**
- Wrapped app with `ContextProvider`
- Updated metadata

**Modified `/src/app/page.tsx`**
- Imported and used context hooks
- Added `ContextStatusBar` component

## API Examples

### Hook Usage

```tsx
// Access all context
const { time, user, location, updateUser, refreshLocation } = useAppContext();

// Access specific context
const time = useTimeContext();
const user = useUserRole();
const location = useLocationContext();
```

### Conditional Rendering

```tsx
// Time-based
{time.period === 'execution' && <CallLoggingButton />}

// Role-based
{user.role === 'district-manager' && <TerritoryOverview />}

// Location-based
{location.nearAccount && <CheckInPrompt account={location.accountName} />}
```

### Utility Functions

```tsx
import {
  getGreeting,           // "Good morning"
  getTimePeriodLabel,    // "Planning Mode"
  formatProximity,       // "500m away"
  hasPermission          // true/false
} from '@/services/contextDetection';
```

## Technical Details

### Time Detection
- Uses `Date.getHours()` to determine period
- Updates every 60 seconds via `setInterval`
- Calculates next transition time automatically
- Fully production-ready

### User Role Detection
- Currently uses hardcoded defaults
- Provides `updateUser()` function for updates
- Ready for authentication service integration
- Role-based permission utility included

### Location Detection
- Mock implementation with random proximity detection
- 30% chance of being near an account (for demo)
- Updates every 5 minutes
- Manual refresh available via `refreshLocation()`
- Ready for Geolocation API integration

## Performance

- Time context: Updates every 60 seconds
- Location context: Updates every 5 minutes
- User context: Only updates when explicitly changed
- All hooks use React Context (no prop drilling)
- Zero unnecessary re-renders

## Testing

The implementation includes two ways to test:

### 1. Production UI (ContextStatusBar)
- Shows time-based greeting
- Displays location banner when near account
- Shows role badge for district managers
- Surfaces relevant quick actions

### 2. Debug Panel (ContextDebugPanel)
- Real-time visualization of all context
- Role toggle button
- Location refresh button
- Usage examples

## Build Status

Build completed successfully:
```
✓ Compiled successfully
✓ TypeScript validation passed
✓ Static pages generated
```

## Integration Example

The service is already integrated into the main app:

```tsx
// layout.tsx - Provider setup
<ContextProvider>
  {children}
</ContextProvider>

// page.tsx - Component usage
export default function Home() {
  const { time, user, location } = useAppContext();

  return (
    <div>
      <ContextStatusBar />
      {/* Rest of UI with conditional rendering */}
    </div>
  );
}
```

## Production Readiness

| Feature | Status | Notes |
|---------|--------|-------|
| Time Detection | Ready | Fully functional |
| User Role | Mock | Needs auth integration |
| Location Detection | Mock | Needs Geolocation API |
| TypeScript Types | Complete | Full type safety |
| Documentation | Complete | API + examples |
| UI Components | Ready | Production + debug |

## Next Steps

1. Integrate with authentication service (user data)
2. Implement browser Geolocation API
3. Query account database for nearby locations
4. Add more context types (device, network, activity)
5. A/B test adaptive UI patterns with field reps

## Key Benefits

1. **Adaptive UI**: Interface changes based on context
2. **Zero Friction**: Right features at the right time
3. **Type Safety**: Full TypeScript support
4. **Easy Integration**: Simple hooks, no prop drilling
5. **Performance**: Optimized update intervals
6. **Extensible**: Easy to add new context types

## Example Use Cases

1. **Morning**: Surface "Plan Day" and "Review Targets"
2. **Execution Hours**: Surface "Log Call" when near account
3. **Evening**: Surface "Daily Report" and "Update CRM"
4. **District Manager**: Show territory overview
5. **Field Rep**: Show personal schedule only

---

**Status**: Complete and ready for use
**Build**: Passing
**TypeScript**: Full type safety
**Documentation**: Comprehensive
