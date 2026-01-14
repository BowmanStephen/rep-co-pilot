# Magic Wand Feature - Implementation Guide

## Overview

The Magic Wand button allows users to enhance their prompts with AI, making them more specific, detailed, and effective for the AstraZeneca Field Representative context.

## How It Works

1. **User types a basic prompt** (e.g., "show me sales")
2. **Clicks the Magic Wand button** (Sparkles icon in gold)
3. **AI enhances the prompt** in real-time with streaming response
4. **Enhanced prompt appears** in the input field (e.g., "Show me this quarter's sales performance by region, including top 5 prescribed products and monthly trends in prescription volumes for my territory")

## Architecture

### Backend: `/src/app/api/enhance-prompt/route.ts`

**Technology Stack:**
- Vercel AI SDK (`ai` package v6.0.33)
- OpenAI SDK (`@ai-sdk/openai`)
- GPT-4o-mini model (fast, cost-effective)

**Key Features:**
- Streaming responses for real-time feedback
- 30-second timeout (configurable)
- Error handling with detailed messages
- Specialized system prompt for pharmaceutical context

**API Endpoint:**
```
POST /api/enhance-prompt
Content-Type: application/json

{
  "prompt": "show me sales"
}

Response: Streaming text (plain text stream)
```

### Frontend: `/src/components/SmartInputDock.tsx`

**Key Features:**
- Loading state with spinner animation
- Disabled state when input is empty or enhancing
- Smooth transitions using Framer Motion
- Error recovery (restores original prompt on failure)
- Real-time streaming text updates

**Visual States:**
1. **Idle:** Sparkles icon with subtle rotation animation
2. **Hover:** Slight scale + rotation (5 degrees)
3. **Loading:** Spinner icon with scale/rotate transition
4. **Disabled:** 50% opacity, not clickable

## Setup Instructions

### 1. Install Dependencies

All dependencies are already installed:
```bash
# Already installed
npm install ai@6.0.33
npm install @ai-sdk/openai
```

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
# Copy the example file
cp .env.example .env.local
```

Edit `.env.local`:
```bash
OPENAI_API_KEY=sk-your-actual-api-key-here
```

**Get your API key from:** https://platform.openai.com/api-keys

### 3. Test the Feature

Start the development server:
```bash
npm run dev
```

Test cases to try:
1. **Basic sales query:**
   - Input: "show me sales"
   - Expected: Enhanced with territory, time period, metrics

2. **CRM query:**
   - Input: "who should I visit"
   - Expected: Enhanced with prioritization criteria

3. **Compliance query:**
   - Input: "meal limits"
   - Expected: Enhanced with HCP context and documentation

## Design Decisions

### Why GPT-4o-mini?
- **Fast:** Sub-second response time for most prompts
- **Cost-effective:** ~$0.15 per 1M tokens (input), $0.60 per 1M tokens (output)
- **Smart enough:** Handles prompt engineering well
- **Production-ready:** Stable API with good uptime

### Why Streaming?
- **Better UX:** Users see text appearing in real-time
- **Perceived performance:** Feels faster even if same latency
- **Allows cancellation:** Can implement cancel functionality later

### Why Restore on Error?
- **No data loss:** User doesn't lose their original prompt
- **Better UX:** Can try again or edit manually
- **Transparent:** Error logged to console for debugging

## Customization

### Change the AI Model

Edit `/src/app/api/enhance-prompt/route.ts`:
```typescript
const result = streamText({
  model: openai('gpt-4o-mini'), // Change to 'gpt-4o', 'gpt-3.5-turbo', etc.
  // ...
});
```

### Adjust System Prompt

Edit the system prompt in `/src/app/api/enhance-prompt/route.ts`:
```typescript
system: `You are an AI assistant that enhances prompts...
// Add your custom instructions here
`,
```

### Modify Visual Design

Edit `/src/components/SmartInputDock.tsx`:
```typescript
// Change loading animation
<Loader2 className="h-5 w-5 animate-spin" />

// Change colors
className="h-10 w-10 rounded-lg text-gold hover:bg-gold/10"

// Adjust animations
whileHover={{ scale: 1.05, rotate: 5 }}
whileTap={{ scale: 0.95 }}
```

## Performance Targets

| Interaction | Target | Actual (Expected) |
|-------------|--------|-------------------|
| API response start | <500ms | ~300ms |
| Full enhancement | <2s | ~1s |
| UI update | 60fps | 60fps (streaming) |
| Error recovery | Instant | Instant |

## Error Handling

### API Errors
- **Network timeout:** Restores original prompt, logs error
- **Invalid API key:** Returns 500 with error message
- **Rate limiting:** Handled by OpenAI SDK with retry

### Client Errors
- **Empty input:** Button disabled, tooltip shows "Enhance prompt with AI"
- **Multiple clicks:** Button disabled during enhancement
- **Stream failure:** Try-catch restores original prompt

## Future Enhancements

### Potential Improvements
1. **Undo/Redo:** Keep history of enhanced prompts
2. **Multiple variants:** Offer 2-3 enhancement options
3. **Custom instructions:** User can specify enhancement style
4. **Keyboard shortcut:** Cmd/Ctrl + E to enhance
5. **Enhancement preview:** Show diff between original and enhanced

### Advanced Features
1. **Learn from usage:** Track which enhancements users accept
2. **Context-aware:** Use current tab (Reporting/CRM/Compliance)
3. **Multi-language:** Support for different languages
4. **Voice enhancement:** Enhance voice input transcripts

## Troubleshooting

### Issue: Magic Wand button doesn't respond
**Solution:**
1. Check browser console for errors
2. Verify `.env.local` has `OPENAI_API_KEY`
3. Check API is running: `npm run dev`

### Issue: Enhancement is slow
**Solution:**
1. Check network connection
2. Try faster model (gpt-4o-mini is fastest)
3. Check OpenAI API status: https://status.openai.com

### Issue: Enhancement quality is poor
**Solution:**
1. Improve system prompt with more examples
2. Add context about current tab/section
3. Use smarter model (gpt-4o instead of gpt-4o-mini)

## Files Modified

| File | Changes |
|------|---------|
| `src/app/api/enhance-prompt/route.ts` | Created - API endpoint |
| `src/components/SmartInputDock.tsx` | Modified - Added Magic Wand handler |
| `.env.example` | Created - Environment variable template |

## Testing Checklist

- [ ] Magic Wand button is disabled when input is empty
- [ ] Clicking Magic Wand shows loading spinner
- [ ] Enhanced prompt streams into input field in real-time
- [ ] Button tooltip changes to "Enhancing..." during enhancement
- [ ] Error recovery restores original prompt
- [ ] Can edit enhanced prompt before sending
- [ ] Enhancement maintains original intent
- [ ] Enhancement adds relevant business context
- [ ] API endpoint handles invalid requests (400 error)
- [ ] API endpoint handles missing API key (500 error)

## Additional Resources

- [Vercel AI SDK Documentation](https://sdk.vercel.ai/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [AstraZeneca Brand Guidelines](Internal link)

---

**Implementation Date:** January 13, 2026
**Developer:** Stephen Bowman (with AI assistance)
**Status:** Production-ready for workshop demo
