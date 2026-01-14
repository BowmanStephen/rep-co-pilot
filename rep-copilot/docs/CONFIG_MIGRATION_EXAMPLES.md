# Configuration Migration Examples

Real-world examples of migrating existing code to use the new configuration system.

---

## Example 1: API Route Migration

### Before (using process.env)

```typescript
// src/app/api/chat/route.ts
export async function POST(req: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.AI_MODEL_CHAT || "anthropic/claude-3.5-sonnet";
  
  if (!apiKey) {
    throw new Error("Missing API key");
  }
  
  // Use apiKey and model...
}
```

### After (using config system)

```typescript
// src/app/api/chat/route.ts
import { env, AI_CONFIG } from "@/config";

export async function POST(req: Request) {
  // Type-safe, validated access
  const apiKey = env.OPENROUTER_API_KEY;
  const model = env.AI_MODEL_CHAT;
  
  // Use config constants
  const timeout = AI_CONFIG.responseTimeout;
  const maxRetries = AI_CONFIG.maxRetries;
  
  // Use apiKey and model...
}
```

**Benefits:**
- ✅ No manual validation needed (handled by config system)
- ✅ Type safety (TypeScript knows `apiKey` is `string`, not `string | undefined`)
- ✅ Access to related constants (timeout, retries)
- ✅ Better error messages if config is invalid

---

## Example 2: Component Feature Flags

### Before (hardcoded flags)

```typescript
// src/components/SmartInputDock.tsx
const ENABLE_COACHING = true;
const ENABLE_MAGIC_WAND = true;

export function SmartInputDock() {
  if (ENABLE_COACHING) {
    return <CoachingToggle />;
  }
  
  if (ENABLE_MAGIC_WAND) {
    return <MagicWandButton />;
  }
}
```

### After (using feature flags)

```typescript
// src/components/SmartInputDock.tsx
import { flags } from "@/config";

export function SmartInputDock() {
  if (flags.enableCoaching) {
    return <CoachingToggle />;
  }
  
  if (flags.enableMagicWand) {
    return <MagicWandButton />;
  }
}
```

**Benefits:**
- ✅ Flags can be changed via environment variables
- ✅ No code changes needed to toggle features
- ✅ A/B testing support
- ✅ Centralized flag management

---

## Example 3: Compliance Configuration

### Before (magic numbers)

```typescript
// src/app/page.tsx
const MEAL_SPEND_KEYWORDS = [
  "expense", "$500", "dinner", "capital grille"
];

const OFF_LABEL_KEYWORDS = [
  "off-label", "unapproved indication"
];

function checkCompliance(prompt: string) {
  const lowerPrompt = prompt.toLowerCase();
  
  for (const keyword of MEAL_SPEND_KEYWORDS) {
    if (lowerPrompt.includes(keyword)) {
      return { type: "warning", message: "..." };
    }
  }
  
  for (const keyword of OFF_LABEL_KEYWORDS) {
    if (lowerPrompt.includes(keyword)) {
      return { type: "stop", message: "..." };
    }
  }
}
```

### After (using constants)

```typescript
// src/app/page.tsx
import { COMPLIANCE_CONFIG } from "@/config";

function checkCompliance(prompt: string) {
  const lowerPrompt = prompt.toLowerCase();
  
  // Meal spend violations (warning)
  for (const keyword of COMPLIANCE_CONFIG.mealSpendKeywords) {
    if (lowerPrompt.includes(keyword)) {
      return {
        type: COMPLIANCE_CONFIG.violationTypes.WARNING,
        message: COMPLIANCE_CONFIG.messages.mealSpendWarning
      };
    }
  }
  
  // Off-label violations (stop)
  for (const keyword of COMPLIANCE_CONFIG.offLabelKeywords) {
    if (lowerPrompt.includes(keyword)) {
      return {
        type: COMPLIANCE_CONFIG.violationTypes.STOP,
        message: COMPLIANCE_CONFIG.messages.offLabelStop
      };
    }
  }
}
```

**Benefits:**
- ✅ Single source of truth for keywords
- ✅ Centralized messages (easy to update)
- ✅ Type-safe violation types
- ✅ Consistent across app

---

## Example 4: Environment-Specific Logic

### Before (string comparison)

```typescript
// src/app/layout.tsx
const isDevelopment = process.env.NODE_ENV === "development";

export function Layout({ children }) {
  if (isDevelopment) {
    return (
      <>
        <DevTools />
        {children}
      </>
    );
  }
  
  return <>{children}</>;
}
```

### After (using helper functions)

```typescript
// src/app/layout.tsx
import { isDevelopment, isProduction } from "@/config";

export function Layout({ children }) {
  if (isDevelopment) {
    return (
      <>
        <DevTools />
        {children}
      </>
    );
  }
  
  if (isProduction) {
    return (
      <>
        <Analytics />
        {children}
      </>
    );
  }
  
  return <>{children}</>;
}
```

**Benefits:**
- ✅ Clearer intent (function vs string comparison)
- ✅ Consistent across app
- ✅ Supports staging (not just dev/prod)

---

## Example 5: Performance Monitoring

### Before (magic numbers in code)

```typescript
// src/app/api/chat/route.ts
async function measurePerformance(fn: () => Promise<void>) {
  const start = Date.now();
  await fn();
  const duration = Date.now() - start;
  
  if (duration > 3000) {
    console.warn("Slow response:", duration);
  }
}
```

### After (using performance targets)

```typescript
// src/app/api/chat/route.ts
import { PERFORMANCE_TARGETS, LOG_CONFIG } from "@/config";

async function measurePerformance(
  fn: () => Promise<void>,
  metric: keyof typeof PERFORMANCE_TARGETS
) {
  const start = Date.now();
  await fn();
  const duration = Date.now() - start;
  
  const threshold = PERFORMANCE_TARGETS[metric];
  
  if (duration > threshold) {
    if (LOG_CONFIG.level === "debug") {
      console.debug(`Performance warning: ${metric} took ${duration}ms (target: ${threshold}ms)`);
    } else {
      console.warn(`Performance warning: ${metric} exceeded threshold`);
    }
  }
}

// Usage
await measurePerformance(
  () => fetchChatResponse(prompt),
  "chipPromptResponse" // Uses PERFORMANCE_TARGETS.chipPromptResponse (3000ms)
);
```

**Benefits:**
- ✅ Configurable thresholds
- ✅ Named constants (self-documenting)
- ✅ Consistent with .cursorrules requirements
- ✅ Logging level aware

---

## Example 6: Error Messages

### Before (duplicate strings)

```typescript
// src/components/SmartInputDock.tsx
if (error) {
  toast.error("Something went wrong. Please try again.");
}

// src/app/api/chat/route.ts
if (!apiKey) {
  return new Response("API error occurred", { status: 500 });
}
```

### After (using error constants)

```typescript
// src/components/SmartInputDock.tsx
import { ERROR_MESSAGES } from "@/config";

if (error) {
  toast.error(ERROR_MESSAGES.API_ERROR);
}

// src/app/api/chat/route.ts
import { ERROR_MESSAGES, API_CONFIG } from "@/config";

if (!apiKey) {
  return new Response(ERROR_MESSAGES.API_ERROR, { 
    status: API_CONFIG.statusCodes.INTERNAL_ERROR 
  });
}
```

**Benefits:**
- ✅ Consistent messaging across app
- ✅ Easy to update all error messages
- ✅ Centralized status codes
- ✅ Better for internationalization (future)

---

## Example 7: Tab Configuration

### Before (string literals)

```typescript
// src/app/page.tsx
type TabType = "reporting" | "crm" | "compliance";

const [activeTab, setActiveTab] = useState<TabType>("reporting");

function getPrompts(tab: TabType) {
  if (tab === "reporting") {
    return REPORTING_PROMPTS;
  }
  if (tab === "crm") {
    return CRM_PROMPTS;
  }
  if (tab === "compliance") {
    return COMPLIANCE_PROMPTS;
  }
}
```

### After (using tab constants)

```typescript
// src/app/page.tsx
import { TABS } from "@/config";
import type { TabType } from "@/config";

const [activeTab, setActiveTab] = useState<TabType>(TABS.REPORTING);

function getPrompts(tab: TabType) {
  const promptsMap = {
    [TABS.REPORTING]: REPORTING_PROMPTS,
    [TABS.CRM]: CRM_PROMPTS,
    [TABS.COMPLIANCE]: COMPLIANCE_PROMPTS,
  };
  
  return promptsMap[tab];
}
```

**Benefits:**
- ✅ Type-safe tab values
- ✅ Single source of truth
- ✅ Prevents typos
- ✅ Easier to add new tabs

---

## Example 8: Analytics Events

### Before (string literals)

```typescript
// src/components/SmartInputDock.tsx
function trackEvent(event: string, data: any) {
  analytics.track(event, data);
}

trackEvent("magic_wand_used", { model: "gpt-4o-mini" });
trackEvent("coaching_toggled", { enabled: true });
```

### After (using analytics constants)

```typescript
// src/components/SmartInputDock.tsx
import { ANALYTICS_EVENTS } from "@/config";

function trackEvent(event: keyof typeof ANALYTICS_EVENTS, data: any) {
  analytics.track(event, data);
}

trackEvent(ANALYTICS_EVENTS.MAGIC_WAND_USED, { 
  model: env.AI_MODEL_ENHANCE 
});

trackEvent(ANALYTICS_EVENTS.COACHING_TOGGLED, { 
  enabled: coachingEnabled 
});
```

**Benefits:**
- ✅ Type-safe event names
- ✅ Centralized event catalog
- ✅ Prevents typos
- ✅ Easy to discover all events

---

## Example 9: API Endpoints

### Before (hardcoded strings)

```typescript
// src/services/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

async function enhancePrompt(prompt: string) {
  const response = await fetch(`${API_BASE}/api/enhance-prompt`, {
    method: "POST",
    body: JSON.stringify({ prompt }),
  });
  
  return response.json();
}
```

### After (using API config)

```typescript
// src/services/api.ts
import { env, API_CONFIG } from "@/config";

async function enhancePrompt(prompt: string) {
  const response = await fetch(
    `${env.NEXT_PUBLIC_API_BASE_URL}${API_CONFIG.endpoints.enhancePrompt}`,
    {
      method: "POST",
      body: JSON.stringify({ prompt }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  
  if (!response.ok) {
    throw new Error(API_CONFIG.statusCodes.BAD_REQUEST);
  }
  
  return response.json();
}
```

**Benefits:**
- ✅ Centralized endpoint paths
- ✅ Type-safe status codes
- ✅ Consistent API base URL
- ✅ Better error handling

---

## Example 10: Debounce Times

### Before (magic numbers)

```typescript
// src/components/SmartInputDock.tsx
useEffect(() => {
  const timer = setTimeout(() => {
    onSearch(query);
  }, 300); // What is 300? Why 300?
  
  return () => clearTimeout(timer);
}, [query, onSearch]);
```

### After (using UI config)

```typescript
// src/components/SmartInputDock.tsx
import { UI_CONFIG } from "@/config";

useEffect(() => {
  const timer = setTimeout(() => {
    onSearch(query);
  }, UI_CONFIG.debounce.search); // Clear: debounce for search
  
  return () => clearTimeout(timer);
}, [query, onSearch]);
```

**Benefits:**
- ✅ Self-documenting code
- ✅ Consistent debounce times
- ✅ Easy to tune (one place to change)
- ✅ Different debounce for different use cases

---

## Migration Checklist

For each file that uses `process.env`:

- [ ] Import from `@/config`
- [ ] Replace `process.env.VAR` with `env.VAR`
- [ ] Replace magic numbers with constants
- [ ] Add feature flags where appropriate
- [ ] Test in development
- [ ] Test in staging (if available)
- [ ] Verify TypeScript types

---

## Tips for Migration

### 1. Start Small
Migrate one file at a time, starting with the simplest ones.

### 2. Use TypeScript
Let TypeScript guide you - it will show type errors if you miss something.

### 3. Test Frequently
Run `npm run dev` after each migration to catch issues early.

### 4. Use Git
Commit after each successful migration so you can revert if needed.

### 5. Ask for Help
Check `docs/CONFIGURATION_SYSTEM.md` if you're unsure how to use something.

---

## Common Pitfalls

### ❌ Don't Mix Patterns
```typescript
// Bad: Mixing old and new
const apiKey = env.OPENROUTER_API_KEY;
const timeout = process.env.TIMEOUT || 5000;
```

### ✅ Use Config System Consistently
```typescript
// Good: All from config
const apiKey = env.OPENROUTER_API_KEY;
const timeout = AI_CONFIG.responseTimeout;
```

### ❌ Don't Duplicate Constants
```typescript
// Bad: Creating local copy
const TIMEOUT = 5000;
```

### ✅ Import From Config
```typescript
// Good: Using existing constant
import { PERFORMANCE_TARGETS } from "@/config";
const timeout = PERFORMANCE_TARGETS.magicWandEnhancement;
```

---

**Need Help?** See [CONFIGURATION_SYSTEM.md](CONFIGURATION_SYSTEM.md) for complete documentation.
