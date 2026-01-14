# Environment Variables Reference

Complete reference for all environment variables in Rep Co-Pilot.

---

## Quick Setup

1. Copy the environment template:
   ```bash
   cp .env.example .env.local
   ```

2. Add your OpenRouter API key (required):
   ```bash
   OPENROUTER_API_KEY=sk-or-v1-your-key-here
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

---

## Required Variables

### `OPENROUTER_API_KEY`
**Required** for all AI functionality.

- **How to get:** https://openrouter.ai/keys
- **Format:** `sk-or-v1-...`
- **Used by:** `/api/chat`, `/api/enhance-prompt`

**Example:**
```bash
OPENROUTER_API_KEY=sk-or-v1-abc123xyz789
```

---

## Public Variables (Client-Side)

These variables are exposed to the browser and accessed via `process.env.NEXT_PUBLIC_*`.

### Application Environment

#### `NEXT_PUBLIC_APP_ENV`
**Purpose:** Control application behavior per environment

**Values:**
- `development` - Verbose logging, source maps, debug tools
- `staging` - Production-like with debugging enabled
- `production` - Optimized, error-only logging

**Default:** `development`

**Example:**
```bash
NEXT_PUBLIC_APP_ENV=production
```

---

#### `NEXT_PUBLIC_API_BASE_URL`
**Purpose:** API base URL for client-side requests

**Default:** Auto-detected from request URL

**Example:**
```bash
NEXT_PUBLIC_API_BASE_URL=https://copilot.astrazeneca.com
```

---

### Feature Flags

#### `NEXT_PUBLIC_COACHING_MODE_DEFAULT`
**Purpose:** Enable compliance coaching by default

**Values:**
- `true` - Show coaching warnings for violations
- `false` - Allow unrestricted queries

**Default:** `true`

**Example:**
```bash
NEXT_PUBLIC_COACHING_MODE_DEFAULT=true
```

---

#### `NEXT_PUBLIC_COMPLIANCE_CHECK_STRICT_MODE`
**Purpose:** Compliance enforcement strictness

**Values:**
- `strict` - Block violations completely
- `lenient` - Warn but allow submission

**Default:** `lenient`

**Example:**
```bash
NEXT_PUBLIC_COMPLIANCE_CHECK_STRICT_MODE=strict
```

---

## Private Variables (Server-Only)

These variables are **never** exposed to the browser.

### AI Configuration

#### `AI_MODEL_CHAT`
**Purpose:** Primary AI model for chat responses

**Supported models:**
- `anthropic/claude-3.5-sonnet` (recommended)
- `anthropic/claude-3-5-sonnet` (latest)
- `openai/gpt-4o`
- `google/gemini-pro-1.5`

**Default:** `anthropic/claude-3.5-sonnet`

**Example:**
```bash
AI_MODEL_CHAT=anthropic/claude-3.5-sonnet
```

---

#### `AI_MODEL_ENHANCE`
**Purpose:** Model for prompt enhancement (Magic Wand)

**Recommended:** Faster, cheaper model
- `openai/gpt-4o-mini` (recommended)
- `anthropic/claude-3-haiku`

**Default:** `openai/gpt-4o-mini`

**Example:**
```bash
AI_MODEL_ENHANCE=openai/gpt-4o-mini
```

---

#### `AI_TEMPERATURE_CHAT`
**Purpose:** Chat response creativity (0.0 - 2.0)

- `0.0` - More focused, deterministic
- `0.7` - Balanced (recommended)
- `1.0+` - More creative, varied

**Default:** `0.7`

**Example:**
```bash
AI_TEMPERATURE_CHAT=0.7
```

---

#### `AI_TEMPERATURE_ENHANCE`
**Purpose:** Enhancement prompt creativity (0.0 - 2.0)

**Default:** `0.3` (lower for consistent enhancements)

**Example:**
```bash
AI_TEMPERATURE_ENHANCE=0.3
```

---

#### `AI_MAX_TOKENS`
**Purpose:** Maximum tokens in AI response

**Range:** 1 - 8192

**Default:** `2048`

**Example:**
```bash
AI_MAX_TOKENS=4096
```

---

### API Rate Limiting

#### `API_RATE_LIMIT_MAX`
**Purpose:** Maximum requests per time window

**Default:** `100`

**Example:**
```bash
API_RATE_LIMIT_MAX=200
```

---

#### `API_RATE_LIMIT_WINDOW`
**Purpose:** Rate limit time window in milliseconds

**Defaults:**
- `900000` (15 minutes)
- `3600000` (1 hour)
- `60000` (1 minute)

**Example:**
```bash
API_RATE_LIMIT_WINDOW=900000
```

---

### Logging

#### `LOG_LEVEL`
**Purpose:** Minimum log level to output

**Values:**
- `error` - Errors only
- `warn` - Warnings and errors
- `info` - Info, warnings, errors (default)
- `debug` - All logs (verbose)

**Default:** `info`

**Example:**
```bash
LOG_LEVEL=info
```

---

#### `LOG_TO_CONSOLE`
**Purpose:** Enable console logging

**Values:**
- `true` - Log to console (default)
- `false` - Disable console logs

**Example:**
```bash
LOG_TO_CONSOLE=true
```

---

## Optional Integrations

### Snowflake Data Warehouse

Enable real-time data integration (optional).

```bash
SNOWFLAKE_ACCOUNT=your-account.snowflakecomputing.com
SNOWFLAKE_USERNAME=your-username
SNOWFLAKE_PASSWORD=your-password
SNOWFLAKE_DATABASE=astrazeneca_analytics
SNOWFLAKE_WAREHOUSE=compute_wh
```

---

### Veeva Vault CRM

Enable CRM integration (optional).

```bash
VEEVA_VAULT_URL=https://astrazeneca.vault.com
VEEVA_API_TOKEN=your-api-token
```

---

### Compliance Database

Enable compliance policy database (optional).

```bash
COMPLIANCE_DB_HOST=db.example.com
COMPLIANCE_DB_PORT=5432
COMPLIANCE_DB_NAME=compliance_db
COMPLIANCE_DB_USER=compliance_user
COMPLIANCE_DB_PASSWORD=secure-password
```

---

## Vercel-Specific Variables

These are **automatically set** by Vercel during deployment.

### `VERCEL_URL`
**Purpose:** Deployment URL

**Example:** `rep-copilot-xyz.vercel.app`

---

### `VERCEL_ENV`
**Purpose:** Deployment environment

**Values:** `production` | `preview` | `development`

---

### `VERCEL_GIT_COMMIT_SHA`
**Purpose:** Git commit SHA for tracking deployments

---

## Environment-Specific Configuration

### Development (Local)
```bash
NEXT_PUBLIC_APP_ENV=development
LOG_LEVEL=debug
LOG_TO_CONSOLE=true
```

### Staging (Vercel Preview)
```bash
NEXT_PUBLIC_APP_ENV=staging
LOG_LEVEL=info
AI_MODEL_CHAT=anthropic/claude-3.5-sonnet
NEXT_PUBLIC_COACHING_MODE_DEFAULT=true
```

### Production (Vercel Main)
```bash
NEXT_PUBLIC_APP_ENV=production
LOG_LEVEL=error
LOG_TO_CONSOLE=false
AI_MODEL_CHAT=anthropic/claude-3.5-sonnet
NEXT_PUBLIC_COACHING_MODE_DEFAULT=true
NEXT_PUBLIC_COMPLIANCE_CHECK_STRICT_MODE=strict
```

---

## Security Best Practices

### 1. Never Commit `.env.local`
The `.gitignore` already excludes `.env.local`. Never commit secrets.

### 2. Use Different Keys Per Environment
```bash
# Development
OPENROUTER_API_KEY=sk-or-v1-dev-key

# Staging
OPENROUTER_API_KEY=sk-or-v1-staging-key

# Production
OPENROUTER_API_KEY=sk-or-v1-prod-key
```

### 3. Rotate Exposed Keys
If a key is accidentally committed or exposed:
1. Revoke the key immediately (OpenRouter dashboard)
2. Generate a new key
3. Update environment variables
4. Rotate regularly (every 90 days)

### 4. Use Vercel Environment Variables
For production deployments:
1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Add variables with "Sensitive" flag checked
3. Select appropriate environments (Production, Preview, Development)

### 5. Enable Strict Compliance in Production
```bash
NEXT_PUBLIC_COMPLIANCE_CHECK_STRICT_MODE=strict
```

---

## Validation

The app **fails fast** if required variables are missing. Check console for validation errors:

```
❌ OPENROUTER_API_KEY is required
```

**Solution:** Add the missing variable to `.env.local`

---

## Troubleshooting

### Variables Not Updating
**Symptoms:** Changes to `.env.local` not reflected

**Solution:**
```bash
# Restart dev server
npm run dev

# Or clear Next.js cache
rm -rf .next
npm run dev
```

### Type Errors After Adding Variables
**Symptoms:** TypeScript errors about missing properties

**Solution:** Restart TypeScript server in VS Code:
1. Cmd+Shift+P
2. "TypeScript: Restart TS Server"

### Variables Undefined in Production
**Symptoms:** `process.env.VAR_NAME` returns `undefined`

**Solution:**
1. Check variable name has `NEXT_PUBLIC_` prefix (if used in client code)
2. Add variable in Vercel Dashboard
3. Redeploy after adding variables

---

## Related Documentation

- **[Configuration System](CONFIGURATION_SYSTEM.md)** - Full config reference
- **[Vercel Deployment Guide](VERCEL_DEPLOYMENT_GUIDE.md)** - Deployment instructions
- **[Quick Reference](CONFIG_QUICK_REFERENCE.md)** - Cheat sheet

---

**Version:** 1.0.0
**Last Updated:** January 14, 2026
