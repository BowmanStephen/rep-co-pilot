# Configuration System Guide

## Overview

Rep Co-Pilot uses a type-safe, validated environment configuration system built with `@t3-oss/env-nextjs` and `Zod`. This ensures:

- ✅ **Fail-fast validation** - App crashes immediately if required env vars are missing
- ✅ **Type safety** - Full TypeScript autocomplete and type checking
- ✅ **Documentation** - Every variable is documented with defaults
- ✅ **Security** - Private variables never exposed to browser

## Quick Start

### 1. Set Up Environment Variables

```bash
# Copy the template
cp .env.example .env.local

# Edit with your values (at minimum, set OPENROUTER_API_KEY)
nano .env.local
```

### 2. Required Variables

Only ONE variable is required to start:

```bash
OPENROUTER_API_KEY=sk-or-v1-your-key-here
```

Get your key at: https://openrouter.ai/keys

### 3. Start the App

```bash
npm run dev
```

If configuration is invalid, the app will crash with a clear error message.

---

## File Structure

```
src/config/
├── env.ts           # Environment variable validation (with Zod schemas)
├── constants.ts     # Application constants and configuration
├── featureFlags.ts  # Feature toggle system
└── index.ts         # Export all modules
```

---

## Usage Examples

### Using Environment Variables

```typescript
// Import the validated env object
import { env, isDevelopment, isProduction } from "@/config";

// Access variables with full type safety
const apiKey = env.OPENROUTER_API_KEY;
const model = env.AI_MODEL_CHAT;

// Check environment
if (isDevelopment) {
  console.log("Development mode");
}
```

### Using Constants

```typescript
import { CONFIG, PERFORMANCE_TARGETS, TABS } from "@/config";

// Access performance targets
const maxResponseTime = PERFORMANCE_TARGETS.freeTextResponse; // 5000ms

// Use tab constants
const activeTab = TABS.REPORTING;
```

### Using Feature Flags

```typescript
import { flags, isFeatureEnabled } from "@/config";

// Check if feature is enabled
if (flags.enableMagicWand) {
  // Show magic wand button
}

// Alternative syntax
if (isFeatureEnabled("enableMagicWand")) {
  // Show magic wand button
}
```

---

## Environment Variables Reference

### Application Environment

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `NEXT_PUBLIC_APP_ENV` | enum | `development` | Environment: `development` \| `staging` \| `production` |
| `NEXT_PUBLIC_API_BASE_URL` | URL | `http://localhost:3000` | API base URL for client-side requests |

### AI/ML Configuration

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `OPENROUTER_API_KEY` | string | **required** | OpenRouter API key for AI model access |
| `AI_MODEL_CHAT` | string | `anthropic/claude-3.5-sonnet` | Primary model for chat responses |
| `AI_MODEL_ENHANCE` | string | `openai/gpt-4o-mini` | Lighter model for prompt enhancement |
| `AI_TEMPERATURE_CHAT` | number | `0.7` | Randomness for chat (0.0-2.0) |
| `AI_TEMPERATURE_ENHANCE` | number | `0.3` | Randomness for enhancement (0.0-2.0) |
| `AI_MAX_TOKENS` | number | `2048` | Maximum response length |

### Feature Flags

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `NEXT_PUBLIC_COACHING_MODE_DEFAULT` | boolean | `true` | Enable compliance coaching by default |
| `NEXT_PUBLIC_COMPLIANCE_CHECK_STRICT_MODE` | enum | `lenient` | Compliance strictness: `strict` \| `lenient` |

### API Configuration

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `API_RATE_LIMIT_MAX` | number | `100` | Max requests per time window |
| `API_RATE_LIMIT_WINDOW` | number | `900000` | Rate limit window in milliseconds (15 min) |

### Logging

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `LOG_LEVEL` | enum | `info` | Logging level: `error` \| `warn` \| `info` \| `debug` |
| `LOG_TO_CONSOLE` | boolean | `true` | Enable console logging |

### Optional Integrations

These variables are **optional** - leave blank if not using the integration:

**Snowflake Data Warehouse:**
- `SNOWFLAKE_ACCOUNT`
- `SNOWFLAKE_USERNAME`
- `SNOWFLAKE_PASSWORD`
- `SNOWFLAKE_DATABASE`
- `SNOWFLAKE_WAREHOUSE`

**Veeva Vault CRM:**
- `VEEVA_VAULT_URL`
- `VEEVA_API_TOKEN`

**Compliance Database:**
- `COMPLIANCE_DB_HOST`
- `COMPLIANCE_DB_PORT`
- `COMPLIANCE_DB_NAME`
- `COMPLIANCE_DB_USER`
- `COMPLIANCE_DB_PASSWORD`

---

## Feature Flags

### Available Flags

| Flag | Default | Description |
|------|---------|-------------|
| `enableCoaching` | `true` | Compliance coaching mode |
| `enableStrictCompliance` | `false` | Strict compliance checking |
| `enableMagicWand` | `true` | Magic Wand prompt enhancement |
| `enableStreamingResponses` | `true` | Real-time response streaming |
| `enableSnowflakeIntegration` | auto-detected | Snowflake data warehouse |
| `enableVeevaIntegration` | auto-detected | Veeva CRM integration |
| `experimentalMultiLanguage` | `false` | Multi-language support (experimental) |
| `experimentalVoiceInput` | `false` | Voice input (experimental) |

### Runtime Flag Management (Development Only)

```typescript
import { setFeatureEnabled, logFeatureFlags } from "@/config";

// Enable a feature at runtime
setFeatureEnabled("enableCharts", true);

// Log all flags to console
logFeatureFlags();
```

**Note:** Runtime changes don't persist across page reloads. Use environment variables for permanent changes.

---

## Configuration Validation

The app validates configuration at startup and will **fail fast** if:

1. **Required variables are missing**
   ```
   ❌ OPENROUTER_API_KEY is required. Get one at https://openrouter.ai/keys
   ```

2. **Variables have invalid types**
   ```
   ❌ AI_TEMPERATURE_CHAT must be a number between 0 and 2
   ```

3. **Feature flag dependencies are violated**
   ```
   ⚠️  enableCharts requires enableDataVisualization
   ```

### Validation in Development

In development, validation errors are logged to console:

```
[Next.js] Configuration
  Environment: development
  API Base URL: http://localhost:3000
  Coaching Default: true
  Compliance Mode: lenient

[Feature Flags] Current configuration:
  enableCoaching: true
  enableMagicWand: true
  enableStreamingResponses: true
  ...
```

---

## Best Practices

### 1. Security

✅ **DO:**
- Keep `.env.local` out of git (already in `.gitignore`)
- Use different API keys for dev/staging/prod
- Rotate keys if accidentally exposed
- Use environment variables in production (never commit secrets)

❌ **DON'T:**
- Commit `.env.local` to version control
- Share API keys in chat or email
- Use production keys in development
- Log sensitive data to console

### 2. Type Safety

Always import from `@/config` instead of using `process.env` directly:

```typescript
// ❌ Bad - No type safety
const apiKey = process.env.OPENROUTER_API_KEY;

// ✅ Good - Type-safe with validation
const apiKey = env.OPENROUTER_API_KEY;
```

### 3. Feature Flags

Use feature flags for gradual rollouts and A/B testing:

```typescript
// Check before showing experimental features
if (flags.experimentalAdvancedAnalytics) {
  return <AdvancedAnalyticsChart />;
}
```

### 4. Constants

Use constants instead of magic numbers:

```typescript
// ❌ Bad - Magic number
if (responseTime > 3000) {
  showError("Response too slow");
}

// ✅ Good - Named constant
if (responseTime > PERFORMANCE_TARGETS.chipPromptResponse) {
  showError(ERROR_MESSAGES.TIMEOUT);
}
```

---

## Environment-Specific Configuration

### Development

```bash
# .env.local
NEXT_PUBLIC_APP_ENV=development
LOG_LEVEL=debug
NEXT_PUBLIC_COACHING_MODE_DEFAULT=true
NEXT_PUBLIC_COMPLIANCE_CHECK_STRICT_MODE=lenient
```

**Features:**
- Verbose logging
- Source maps enabled
- Hot reload
- Debug tools

### Staging

```bash
# .env.staging
NEXT_PUBLIC_APP_ENV=staging
LOG_LEVEL=info
NEXT_PUBLIC_COACHING_MODE_DEFAULT=true
NEXT_PUBLIC_COMPLIANCE_CHECK_STRICT_MODE=strict
```

**Features:**
- Production-like configuration
- Debug logging available
- Source maps enabled
- Testing integrations

### Production

```bash
# Set in hosting platform (Vercel, AWS, etc.)
NEXT_PUBLIC_APP_ENV=production
LOG_LEVEL=error
NEXT_PUBLIC_COACHING_MODE_DEFAULT=true
NEXT_PUBLIC_COMPLIANCE_CHECK_STRICT_MODE=strict
```

**Features:**
- Error-only logging
- Optimized bundles
- No source maps
- Strict compliance

---

## Troubleshooting

### App Crashes on Startup

**Problem:** App fails with validation error

```bash
Error: OPENROUTER_API_KEY is required
```

**Solution:** Set the required variable in `.env.local`

```bash
echo "OPENROUTER_API_KEY=sk-or-v1-your-key" >> .env.local
```

### Wrong Environment Detected

**Problem:** App thinks it's production when it's development

**Solution:** Check `.env.local`:

```bash
NEXT_PUBLIC_APP_ENV=development
```

### Feature Flag Not Working

**Problem:** Feature flag changes don't take effect

**Solution:**
1. Restart dev server: `npm run dev`
2. Check `.env.local` for typos
3. Clear Next.js cache: `rm -rf .next`

### Integration Not Enabled

**Problem:** Snowflake/Veeva integration not working

**Solution:** Check that all required variables are set:

```bash
# For Snowflake
SNOWFLAKE_ACCOUNT=xy12345.us-east-1
SNOWFLAKE_USERNAME=admin
SNOWFLAKE_PASSWORD=your-password
```

The system auto-detects integrations based on these variables.

---

## Advanced Usage

### Custom Configuration Modules

Add your own configuration in `src/config/`:

```typescript
// src/config/myConfig.ts
export const MY_CONFIG = {
  maxRetries: 3,
  timeout: 5000,
} as const;

// Export from index.ts
export { MY_CONFIG } from "./myConfig";
```

### Environment-Specific Logic

```typescript
import { isDevelopment, isProduction } from "@/config";

if (isDevelopment) {
  // Enable debug features
  enableDebugMode();
}

if (isProduction) {
  // Enable analytics
  initAnalytics();
}
```

### Type-Safe Environment Checks

```typescript
import { env, isDevelopment } from "@/config";

// TypeScript knows the type
const model: string = env.AI_MODEL_CHAT; // ✅ Type: string

const wrong = env.AI_MODEL_CHAT * 2; // ❌ Type error!
```

---

## Migration Guide

### From `process.env` to Config System

**Before:**
```typescript
const apiKey = process.env.OPENROUTER_API_KEY;
const isDev = process.env.NODE_ENV === "development";
```

**After:**
```typescript
import { env, isDevelopment } from "@/config";

const apiKey = env.OPENROUTER_API_KEY;
const isDev = isDevelopment;
```

### Adding New Environment Variables

1. Add to `src/config/env.ts` schema
2. Add to `.env.example` template
3. Document in this guide
4. Update types as needed

**Example:**
```typescript
// src/config/env.ts
MY_NEW_VAR: z.string().default("hello"),

// .env.example
MY_NEW_VAR=hello
```

---

## Resources

- [Zod Documentation](https://zod.dev/)
- [@t3-oss/env-nextjs](https://env.t3.gg/)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [OpenRouter API](https://openrouter.ai/docs)

---

## Support

If you encounter issues:

1. Check the console for validation errors
2. Verify `.env.local` has all required variables
3. Try clearing Next.js cache: `rm -rf .next`
4. Check this guide's troubleshooting section
5. Open an issue on GitHub

---

**Last Updated:** January 14, 2026
