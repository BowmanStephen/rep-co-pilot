# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Rep Co-Pilot** - A unified AI-powered interface for AstraZeneca Field Representatives that consolidates Reporting, CRM, and Compliance workflows.

**Client:** Ajitesh Khosla (AstraZeneca)
**Designer/Developer:** Stephen Bowman (UX Designer learning to code with AI)

**Location:** `rep-copilot/` subdirectory

---

## Quick Start

```bash
cd rep-copilot/
npm run dev          # Start dev server at http://localhost:3000
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

---

## Architecture Overview

### State Management Pattern (4 Primary Views)

The app uses **conditional rendering** in `rep-copilot/src/app/page.tsx` to manage four distinct view states:

```
1. Prompt Selection View (default)
   ├── Header + TabBar (3 tabs: Reporting, CRM, Compliance)
   ├── Section description + 5 prompt cards
   └── SmartInputDock (always visible)

2. Coaching/Compliance View
   ├── Shows when coaching enabled + violation detected
   ├── Displays CoachingCard with warning/stop message
   └── Blocks submission until user dismisses or takes action

3. Response View
   ├── Full-screen results display
   ├── Back button returns to Prompt Selection
   └── Includes SmartInputDock for follow-up queries

4. Loading Skeleton
   ├── Shows during simulated AI response delay
   └── Returns to Response View when complete
```

### Compliance Detection System

**Location:** `rep-copilot/src/app/page.tsx:checkCompliance()`

The app includes client-side compliance guardrails that detect violations before submission:

- **Meal Spend Violations** (warning): Triggers on keywords like "expense", "$500", "dinner", "capital grille"
- **Off-Label Violations** (stop): Triggers on "off-label", "unapproved indication", "draft an email"

When `coachingEnabled=true`, the `checkCompliance()` function runs on every prompt. If a violation is found:
1. `coachingResult` state is set with the violation type
2. App re-renders to Coaching View
3. User must dismiss or take corrective action

---

## Component Structure

```
rep-copilot/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout (no fonts yet - metadata only)
│   │   ├── page.tsx            # Main page: tab state, compliance logic, view routing
│   │   └── globals.css         # Tailwind v4 + AZ brand colors via @theme
│   │
│   ├── components/
│   │   ├── Header.tsx          # Top bar with Mulberry gradient, logo, user avatar
│   │   ├── TabBar.tsx          # 3 tabs with animated active indicator (Framer Motion)
│   │   ├── PromptCard.tsx      # Clickable prompts with ripple effects and staggered animations
│   │   ├── SmartInputDock.tsx  # Bottom dock: text, mic, camera, wand, coaching toggle
│   │   ├── ResponseView.tsx    # AI response display with chart cards and follow-ups
│   │   ├── CoachingCard.tsx    # Compliance warning/stop UI
│   │   ├── LoadingSkeleton.tsx # Loading state during AI response
│   │   ├── TypingIndicator.tsx # Animated dots for streaming responses
│   │   ├── MagicWandEffect.tsx  # Sparkle animation for prompt enhancement
│   │   └── ui/                 # shadcn/ui components (Button, Input, Card, etc.)
│   │
│   └── lib/
│       └── utils.ts            # cn() helper for Tailwind class merging
│
├── package.json                # Dependencies and scripts
└── tsconfig.json               # TypeScript configuration
```

---

## Design Tokens (AZ Brand)

### Colors (defined in `rep-copilot/src/app/globals.css`)

| Token | HSL Value | Usage |
|-------|-----------|-------|
| **Primary (Mulberry)** | `323 100% 26%` | Buttons, active tabs, header |
| **Gold** | `43 100% 47%` | Magic Wand icon, focus rings |
| **Graphite** | `180 4% 26%` | Body text, icons |
| **Platinum** | `167 13% 65%` | Muted text, Coaching OFF |
| **Light Platinum** | `160 9% 93%` | Backgrounds, inactive tabs |

### Typography

- **Heading Font:** Roboto Slab (serif) - applied to `h1-h6` via `@layer base`
- **Body Font:** Inter (sans-serif) - default for everything else

### Tailwind v4 Pattern

The project uses **Tailwind CSS v4** with the `@theme` directive:

```css
@theme inline {
  --color-mulberry: hsl(var(--mulberry));
  --color-gold: hsl(var(--gold));
  --color-graphite: hsl(var(--graphite));
}
```

Usage: `className="bg-mulberry text-white"`

---

## Key Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.1.1 | React framework with App Router |
| **React** | 19.2.3 | UI library |
| **Tailwind CSS** | v4 | Styling with @theme for custom colors |
| **Framer Motion** | 12.26.2 | Animations (spring physics, stagger effects) |
| **Radix UI** | Latest | Accessible primitives (tabs, toggle, tooltip, avatar) |
| **Lucide React** | 0.562.0 | Icon library |
| **AI SDK (Vercel)** | 6.0.33 | `/api/enhance-prompt` endpoint for Magic Wand |
| **OpenRouter** | 1.5.4 | AI provider integration |
| **class-variance-authority** | 0.7.1 | Component variant patterns |
| **clsx + tailwind-merge** | Latest | `cn()` helper for class merging |

---

## Common Patterns

### The `cn()` Helper

**Location:** `rep-copilot/src/lib/utils.ts`

```tsx
import { cn } from "@/lib/utils"

// Merges Tailwind classes intelligently (prevents conflicts)
cn("px-4 py-2", isActive && "bg-mulberry", className)
```

### Radix UI + Tailwind Pattern

**Example from TabBar.tsx:**

```tsx
import * as Tabs from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

<Tabs.Trigger
  className={cn(
    "base-styles",
    "data-[state=active]:bg-mulberry data-[state=active]:text-white",
    "data-[state=inactive]:bg-light-platinum"
  )}
>
```

Radix uses `data-[state=*]` attributes - Tailwind targets these for styling.

### Framer Motion Pattern

**Staggered list animations (PromptCard.tsx):**

```tsx
const controls = useAnimation()

useEffect(() => {
  controls.start({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: index * 0.1 }
  })
}, [controls, index])

<motion.button animate={controls}>
```

**Layout animations (TabBar.tsx):**

```tsx
<motion.div layoutId="activeTab" />  // Smoothly moves between tabs
```

---

## Important Implementation Notes

### 1. Preset Prompts Configuration

**Location:** `rep-copilot/src/app/page.tsx` (top of file)

The 15 prompts (5 per section) are defined in a `Record<TabType, string[]>` object. When adding new prompts, update both:
- `prompts` object (the prompt text)
- `sectionDescriptions` (subtitle below tabs)

### 2. Coaching Toggle State

The `coachingEnabled` state is managed in `page.tsx` but can be controlled locally in `SmartInputDock.tsx` if not passed as a prop.

When `coachingEnabled=false`, compliance checks are skipped and queries submit immediately.

### 3. Response View Data

**Location:** `rep-copilot/src/components/ResponseView.tsx`

Currently uses mock `regionData` array. In production, this will be replaced with actual AI API responses.

### 4. Magic Wand API Endpoint

**Location:** Called in `SmartInputDock.tsx:handleEnhancePrompt()`

Makes a `POST` request to `/api/enhance-prompt`. This endpoint does not exist yet - needs implementation.

---

## Cursor Rules Integration

Important rules from `.cursorrules`:

### Design Principles
1. **Speed First:** Every interaction <3 seconds
2. **Zero Friction:** Maximum 2 taps for high-frequency tasks
3. **Compliance by Default:** Guardrails invisible until needed
4. **Conversational Intelligence:** Natural language as primary interface

### Performance Requirements
- Initial app load: <2 seconds (95th percentile)
- Chip prompt response: <3 seconds (95th percentile)
- Free-text query response: <5 seconds (95th percentile)
- Magic Wand enhancement: <1 second (95th percentile)
- Compliance check: <500ms (99th percentile)

---

## Backend (Planned - Not Implemented)

The `.cursorrules` file specifies a backend architecture that doesn't exist yet:

- **API:** Node.js / TypeScript
- **API Gateway:** AWS API Gateway
- **AI Services:** Azure OpenAI Service
- **Data Sources:** Snowflake (Data Lake), Veeva (CRM), Compliance Policy DB

Current implementation uses mock data and simulated delays for demonstration purposes.

---

## Accessibility Notes

The app targets **WCAG 2.1 AA** compliance with:
- Radix UI primitives (built-in keyboard navigation)
- Focus indicators: `*:focus-visible` with 2px gold outline
- Proper ARIA labels via Radix components
- VoiceOver support (iOS)

---

## Common Tailwind Class Patterns

```tsx
// Active tab
className="bg-mulberry text-white font-semibold text-sm"

// Inactive tab
className="text-foreground/70 hover:text-foreground hover:bg-white/50"

// Prompt card
className="bg-card border border-border/60 hover:shadow-[0_4px_12px_rgba(131,0,81,0.08)] hover:-translate-y-1"

// Input dock
className="bg-card border border-border/60 shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
```

---

## When Working With Stephen

- **He's a UX Designer learning to code** - prefers design analogies over jargon
- **Voice-first workflow** - uses SuperWhisper for transcription
- **Show first, then explain** - he learns by seeing results
- **Use Figma/Sketch analogies** - explain technical concepts using design patterns he knows
- **Celebrate small wins** - acknowledge progress as you go
- **Check understanding** - ask "Does that make sense?" often

---

## Related Documents

- **PRD:** `Rep Copilot PRD.md` - Original product requirements and wireframes
- **Cursor Rules:** `.cursorrules` - Technical specifications and performance requirements

---

**Last updated:** January 14, 2026
