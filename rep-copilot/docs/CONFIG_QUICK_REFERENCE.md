# Configuration Quick Reference

## Common Tasks

### Access Environment Variables

```typescript
import { env } from "@/config";

const apiKey = env.OPENROUTER_API_KEY;
const model = env.AI_MODEL_CHAT;
```

### Check Current Environment

```typescript
import { isDevelopment, isProduction } from "@/config";

if (isDevelopment) {
  console.log("Dev mode");
}
```

### Use Feature Flags

```typescript
import { flags } from "@/config";

if (flags.enableMagicWand) {
  // Show magic wand
}
```

### Use Constants

```typescript
import { PERFORMANCE_TARGETS, TABS } from "@/config";

const timeout = PERFORMANCE_TARGETS.freeTextResponse; // 3000ms
const tab = TABS.REPORTING;
```

---

## Environment Variables (Cheat Sheet)

### Required

```bash
OPENROUTER_API_KEY=sk-or-v1-...
```

### Common Optional

```bash
# App Environment
NEXT_PUBLIC_APP_ENV=development  # or staging, production

# AI Models
AI_MODEL_CHAT=anthropic/claude-3.5-sonnet
AI_MODEL_ENHANCE=openai/gpt-4o-mini

# Feature Flags
NEXT_PUBLIC_COACHING_MODE_DEFAULT=true
NEXT_PUBLIC_COMPLIANCE_CHECK_STRICT_MODE=lenient  # or strict

# Logging
LOG_LEVEL=info  # error, warn, info, debug
```

---

## Feature Flags Reference

| Flag | Type | Default | Description |
|------|------|---------|-------------|
| `enableCoaching` | bool | `true` | Compliance coaching |
| `enableMagicWand` | bool | `true` | Prompt enhancement |
| `enableStreamingResponses` | bool | `true` | Real-time streaming |
| `enableSnowflakeIntegration` | bool | auto | Snowflake enabled? |
| `enableVeevaIntegration` | bool | auto | Veeva enabled? |

Check: `flags.enableFeatureName`

---

## Constants Reference

### Performance Targets

```typescript
PERFORMANCE_TARGETS.initialLoadTime        // 2000ms
PERFORMANCE_TARGETS.chipPromptResponse     // 3000ms
PERFORMANCE_TARGETS.freeTextResponse       // 5000ms
PERFORMANCE_TARGETS.magicWandEnhancement   // 1000ms
PERFORMANCE_TARGETS.complianceCheck        // 500ms
```

### Tab Types

```typescript
TABS.REPORTING    // "reporting"
TABS.CRM          // "crm"
TABS.COMPLIANCE   // "compliance"
```

### Error Messages

```typescript
ERROR_MESSAGES.API_ERROR
ERROR_MESSAGES.RATE_LIMITED
ERROR_MESSAGES.TIMEOUT
ERROR_MESSAGES.COMPLIANCE_VIOLATION
```

---

## Troubleshooting

### "OPENROUTER_API_KEY is required"

**Fix:** Add to `.env.local`
```bash
OPENROUTER_API_KEY=sk-or-v1-your-key
```

### Config changes not applying

**Fix:** Restart dev server
```bash
npm run dev
```

### Type errors after adding env vars

**Fix:** Restart TypeScript server
- VS Code: `Cmd+Shift+P` → "TypeScript: Restart TS Server"

---

## File Locations

```
src/config/
├── env.ts           # Environment validation
├── constants.ts     # App constants
├── featureFlags.ts  # Feature toggles
└── index.ts         # Exports

.env.example         # Template
.env.local           # Your actual values (don't commit!)
next.config.ts       # Next.js config
```

---

## Adding New Environment Variables

1. **Add to schema** in `src/config/env.ts`:
```typescript
MY_NEW_VAR: z.string().default("hello"),
```

2. **Add to .env.example**:
```bash
MY_NEW_VAR=hello
```

3. **Use in code**:
```typescript
import { env } from "@/config";
const value = env.MY_NEW_VAR;
```

---

**Full Documentation:** See [CONFIGURATION_SYSTEM.md](CONFIGURATION_SYSTEM.md)
