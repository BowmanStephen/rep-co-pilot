# Magic Wand Feature - Architecture Diagram

## System Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                              │
│                     (SmartInputDock.tsx)                            │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ 1. User types: "show me sales"
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    MAGIC WAND BUTTON                                │
│                   (Sparkles Icon in Gold)                           │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ State: IDLE                                                  │  │
│  │ - Subtle rotation animation                                 │  │
│  │ - Tooltip: "Enhance prompt with AI"                         │  │
│  │ - Disabled if input is empty                                │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ 2. User clicks Magic Wand
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    LOADING STATE                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Visual Changes:                                             │  │
│  │ - Icon changes to spinner (Loader2)                         │  │
│  │ - Tooltip: "Enhancing..."                                   │  │
│  │ - Button disabled (prevents double-click)                   │  │
│  │ - Smooth scale/rotate animation                             │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ 3. API Request: POST /api/enhance-prompt
                                  │    Body: { "prompt": "show me sales" }
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    API ROUTE                                        │
│              (/api/enhance-prompt/route.ts)                         │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Validation:                                                  │  │
│  │ - Check prompt exists and is string                         │  │
│  │ - Return 400 if invalid                                     │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                    │                                │
│                                    │ 4. Valid request               │
│                                    ▼                                │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ AI Processing:                                               │  │
│  │ - Use Vercel AI SDK                                          │  │
│  │ - Call GPT-4o-mini model                                     │  │
│  │ - System prompt: "Enhance for AZ Field Reps..."             │  │
│  │ - User prompt: "Enhance this prompt: 'show me sales'"       │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ 5. Stream response back
                                  │    (character by character)
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  STREAMING RESPONSE                                 │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Real-time Updates:                                           │  │
│  │ - Input field updates character-by-character                 │  │
│  │ - Smooth 60fps animation                                     │  │
│  │ - Original: "show me sales"                                  │  │
│  │ - Streaming: "Show me this..." → "Show me this quarter..."  │  │
│  │ - Final: "Show me this quarter's sales performance by..."    │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ 6. Enhancement complete
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   FINAL STATE                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Result:                                                      │  │
│  │ - Input field shows enhanced prompt                          │  │
│  │ - Magic Wand returns to idle state                           │  │
│  │ - User can edit or send the enhanced prompt                 │  │
│  │ - Tooltip: "Enhance prompt with AI"                          │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

## Error Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ERROR SCENARIO                                   │
│                         (Any Step Fails)                            │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ Error occurs
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   ERROR HANDLING                                    │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Frontend Actions:                                            │  │
│  │ - Catch error in try-catch block                             │  │
│  │ - Restore original prompt to input field                     │  │
│  │ - Log error to console (for debugging)                       │  │
│  │ - Return to idle state                                       │  │
│  │ - Show no error to user (seamless recovery)                  │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                    │                                │
│                                    │ Parallel                       │
│                                    ▼                                │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Backend Actions:                                             │  │
│  │ - Log error to server console                                │  │
│  │ - Return 500 with error details                              │  │
│  │ - Include error message in response                          │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

## Component Architecture

```
SmartInputDock Component
├── State
│   ├── inputValue: string (current prompt text)
│   ├── coachingOn: boolean (compliance toggle state)
│   └── isEnhancing: boolean (loading state)
│
├── Handlers
│   ├── handleSubmit() - Send prompt to parent
│   └── handleEnhancePrompt() - Call API to enhance prompt
│       │
│       ├── 1. Check if input is empty or already enhancing
│       ├── 2. Set isEnhancing = true (show loading spinner)
│       ├── 3. Store original prompt (for error recovery)
│       ├── 4. Call POST /api/enhance-prompt
│       ├── 5. Read streaming response
│       ├── 6. Update inputValue character-by-character
│       ├── 7. On error: Restore original prompt
│       └── 8. Finally: Set isEnhancing = false
│
└── UI Elements
    ├── Mic Button (voice input - future feature)
    ├── Camera Button (photo upload - future feature)
    ├── Text Input (controlled by inputValue state)
    ├── Magic Wand Button
    │   ├── Idle: Sparkles icon with rotation animation
    │   ├── Loading: Spinner icon
    │   └── Disabled: When input empty or enhancing
    ├── Coaching Toggle (compliance guardrails)
    └── Send Button (submit enhanced prompt)
```

## Data Flow Diagram

```
┌──────────────┐
│   Browser    │
│  (Client)    │
└──────┬───────┘
       │
       │ HTTP POST
       │ /api/enhance-prompt
       │ { "prompt": "show me sales" }
       ▼
┌──────────────────┐
│  Next.js API     │
│  Route Handler   │
└──────┬───────────┘
       │
       │ streamText()
       │ Vercel AI SDK
       ▼
┌──────────────────┐
│   OpenAI API     │
│   GPT-4o-mini    │
└──────┬───────────┘
       │
       │ Streaming Response
       │ (text chunks)
       ▼
┌──────────────────┐
│  Next.js API     │
│  toTextStream()  │
└──────┬───────────┘
       │
       │ Server-Sent Events
       │ (text/plain stream)
       ▼
┌──────────────┐
│   Browser    │
│  Readable    │
│  Stream API  │
└──────┬───────┘
       │
       │ reader.read()
       │ decoder.decode()
       ▼
┌──────────────┐
│   React      │
│  setInputValue()
│  (UI updates)
└──────────────┘
```

## Animation Timeline

```
User Clicks Magic Wand
    │
    ├─ 0ms: Button disabled (prevent double-click)
    ├─ 0ms: isEnhancing = true
    ├─ 0ms: Tooltip changes to "Enhancing..."
    ├─ 200ms: Sparkles icon scales down, rotates -180°
    ├─ 200ms: Spinner icon scales up, rotates to 0°
    │
    ├─ 300ms: API response starts (first chunk)
    ├─ 300ms-1000ms: Text streams character-by-character
    │    └─ Each chunk: setInputValue(enhancedText)
    │
    ├─ 1000ms: Enhancement complete
    ├─ 1000ms: isEnhancing = false
    ├─ 1200ms: Spinner scales down, rotates 180°
    └─ 1200ms: Sparkles scales up, returns to idle animation

Total Duration: ~1.2 seconds (perceived as smooth, responsive)
```

## Technology Stack

```
Frontend:
├── React 19.2.3
├── Framer Motion 12.26.2
│   └── AnimatePresence, motion components
├── Lucide React (icons)
│   ├── Sparkles (Magic Wand icon)
│   └── Loader2 (Loading spinner)
└── TypeScript 5

Backend:
├── Next.js 16.1.1 (App Router)
├── Vercel AI SDK 6.0.33
│   ├── streamText()
│   ├── openai() provider
│   └── toTextStreamResponse()
├── @ai-sdk/openai (OpenAI integration)
└── GPT-4o-mini (AI model)

Development:
├── Node.js 22.16.0
├── npm 10.9.2
└── TypeScript 5
```

## Key Design Patterns

### 1. Controlled Component
```typescript
<Input
  value={inputValue}           // Controlled by state
  onChange={setInputValue}     // Single source of truth
/>
```

### 2. Optimistic UI Updates
```typescript
// Update UI immediately while streaming
enhancedText += chunk;
setInputValue(enhancedText);  // Real-time feedback
```

### 3. Error Recovery
```typescript
try {
  // ... enhance prompt
} catch (error) {
  setInputValue(originalPrompt);  // Restore on error
}
```

### 4. Streaming Pattern
```typescript
const reader = response.body?.getReader();
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  // Process chunk...
}
```

### 5. Animation States
```typescript
<AnimatePresence mode="wait">
  {isEnhancing ? (
    <motion.div key="loading" />  // Enter animation
  ) : (
    <motion.div key="sparkles" />  // Exit animation
  )}
</AnimatePresence>
```

---

**Last Updated:** January 13, 2026
**Purpose:** Visual reference for Magic Wand feature architecture
