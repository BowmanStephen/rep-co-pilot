# Rep Co-Pilot

A unified AI-powered interface for AstraZeneca Field Representatives that consolidates Reporting, CRM, and Compliance workflows.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

```bash
# Copy the environment template
cp .env.example .env.local

# Edit .env.local and add your OpenRouter API key
# At minimum, you need:
# OPENROUTER_API_KEY=sk-or-v1-your-key-here
```

**Get your OpenRouter API key:** https://openrouter.ai/keys

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### 4. Validate Configuration

The app will **fail fast** if required environment variables are missing. Check the console for validation errors.

---

## Environment Setup

### Required Variables

Only ONE variable is required to start:

```bash
OPENROUTER_API_KEY=sk-or-v1-your-key-here
```

### Optional Variables

See `.env.example` for all available configuration options:

- `AI_MODEL_CHAT` - Primary AI model (default: `anthropic/claude-3.5-sonnet`)
- `AI_MODEL_ENHANCE` - Model for prompt enhancement (default: `openai/gpt-4o-mini`)
- `NEXT_PUBLIC_COACHING_MODE_DEFAULT` - Enable compliance coaching (default: `true`)
- `NEXT_PUBLIC_COMPLIANCE_CHECK_STRICT_MODE` - Compliance strictness (default: `lenient`)
- Snowflake, Veeva, and Compliance DB integration variables

### Environment-Specific Configuration

The app supports three environments:

- **Development** - Verbose logging, source maps, debug tools
- **Staging** - Production-like with debugging
- **Production** - Optimized, error-only logging

Set via `NEXT_PUBLIC_APP_ENV` in `.env.local` or hosting platform.

---

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Configuration System

The app uses a type-safe, validated configuration system:

```typescript
import { env, isDevelopment, flags } from "@/config";

// Access environment variables
const apiKey = env.OPENROUTER_API_KEY;
const model = env.AI_MODEL_CHAT;

// Check environment
if (isDevelopment) {
  console.log("Development mode");
}

// Use feature flags
if (flags.enableMagicWand) {
  // Show magic wand button
}
```

**Full documentation:** See [docs/CONFIGURATION_SYSTEM.md](docs/CONFIGURATION_SYSTEM.md)

---

## Project Structure

```
rep-copilot/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   ├── config/           # Environment & configuration
│   │   ├── env.ts        # Environment variable validation
│   │   ├── constants.ts  # Application constants
│   │   ├── featureFlags.ts # Feature toggles
│   │   └── index.ts      # Export all modules
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   ├── services/         # API services
│   ├── types/            # TypeScript types
│   └── widgets/          # Feature widgets
├── docs/                 # Documentation
├── .env.example          # Environment template
└── next.config.ts        # Next.js configuration
```

---

## Key Features

### 1. AI-Powered Interface

- **Natural Language Queries** - Ask questions in plain English
- **Magic Wand** - AI-powered prompt enhancement
- **Streaming Responses** - Real-time AI responses
- **Follow-Up Suggestions** - Contextual next questions

### 2. Compliance Guardrails

- **Coaching Mode** - Real-time compliance guidance
- **Violation Detection** - Automatic keyword monitoring
- **Strict/Lenient Modes** - Configurable enforcement
- **Meal Spend Tracking** - Expense policy warnings
- **Off-Label Prevention** - Promotion blocking

### 3. Multi-Tab Workflow

- **Reporting** - Sales reports and analytics
- **CRM** - Customer relationship management
- **Compliance** - Policy and procedure guidance

### 4. Enterprise Integrations (Optional)

- **Snowflake** - Data warehouse integration
- **Veeva Vault** - CRM system integration
- **Compliance Database** - Policy enforcement

---

## Tech Stack

- **Framework:** Next.js 16.1.1 (App Router)
- **UI:** React 19.2.3
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion 12
- **Components:** Radix UI (accessible primitives)
- **AI:** OpenRouter API (multi-model support)
- **Validation:** Zod + @t3-oss/env-nextjs
- **TypeScript:** Full type safety

---

## Performance Requirements

From `.cursorrules`:

- Initial app load: <2 seconds (95th percentile)
- Chip prompt response: <3 seconds (95th percentile)
- Free-text query response: <5 seconds (95th percentile)
- Magic Wand enhancement: <1 second (95th percentile)
- Compliance check: <500ms (99th percentile)

---

## Security Best Practices

1. **Never commit `.env.local`** - Already in `.gitignore`
2. **Use different API keys** for dev/staging/prod
3. **Rotate keys** if accidentally exposed
4. **Enable strict compliance** in production
5. **Monitor logs** for suspicious activity

---

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

**Required environment variables in Vercel:**
- `OPENROUTER_API_KEY`

### Other Platforms

Set environment variables in your hosting platform's dashboard.

**Build command:**
```bash
npm run build
```

**Start command:**
```bash
npm run start
```

---

## Troubleshooting

### App Crashes on Startup

**Error:** `OPENROUTER_API_KEY is required`

**Solution:** Add to `.env.local`:
```bash
OPENROUTER_API_KEY=sk-or-v1-your-key-here
```

### Configuration Not Updating

**Solution:**
1. Restart dev server: `npm run dev`
2. Clear Next.js cache: `rm -rf .next`
3. Check `.env.local` for typos

### Type Errors After Adding Variables

**Solution:** Restart TypeScript server in your IDE (VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server")

---

## Documentation

- **[Configuration System](docs/CONFIGURATION_SYSTEM.md)** - Environment variables and feature flags
- **[CLAUDE.md](CLAUDE.md)** - Project-specific guidance for AI development
- **[.cursorrules](.cursorrules)** - Development rules and performance requirements

---

## Contributing

This is a client project for AstraZeneca. For questions or issues, contact the project maintainers.

---

## License

Proprietary - AstraZeneca Internal Use Only

---

**Version:** 0.1.0
**Last Updated:** January 14, 2026
