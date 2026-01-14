# Prompt Strategy Documentation

## Overview

Rep Co-Pilot uses an enhanced prompt engineering strategy to deliver contextual, accurate responses that feel human and helpful. This document explains the approach, architecture, and maintenance guidelines.

---

## Architecture

### File Structure

```
src/
├── prompts/
│   ├── index.ts                    # All prompt configurations
│   └── __tests__/
│       └── prompts.test.ts         # Unit tests
└── app/
    └── api/
        └── chat/
            └── route.ts            # API route that uses prompts
```

### Prompt Configuration Structure

Each tab has a `PromptConfig` object with:

```typescript
interface PromptConfig {
  systemPrompt: string;      // Main system prompt with role, expertise, data
  dataContext: string;       // Dynamic data injection (territory, time period)
  fewShots: Array<{          // 3-5 example Q&A pairs
    query: string;
    response: string;
  }>;
}
```

---

## Prompt Components

### 1. Shared Context (`SHARED_CONTEXT`)

Injected into ALL prompts to ensure consistency:

- **Role:** Rep Co-Pilot - AI assistant for AstraZeneca Field Representatives
- **Products:** Tagrisso, Lynparza, Imfinzi, Calquence, Farxiga, Enhertu
- **Territory:** Northeast US (NY, NJ, PA, CT)
- **Time Period:** Q3 2025 (July-September)
- **Competitive Context:** Keytruda, Opdivo, Entresto

**Why:** Establishes consistent persona and data across all tabs.

---

### 2. Tab-Specific System Prompts

Each tab has a tailored prompt emphasizing its expertise:

#### Reporting Tab
**Focus:** Sales analytics, territory performance, trend identification

**Key Data:**
- Regional performance (North, East, South, West)
- Product performance (Rx volume, growth, market share)
- Key metrics (total revenue, MoM growth, YoY growth)

**Response Format:**
1. Executive Summary (2-3 sentences)
2. Data Visualization (markdown tables)
3. Key Insights (bullet points with numbers)
4. Trend Analysis (what's driving numbers)
5. Action Items (2-3 concrete next steps)
6. Related Metrics (follow-up query suggestions)

#### CRM Tab
**Focus:** Account prioritization, HCP relationships, scheduling

**Key Data:**
- Top 10 priority accounts (opportunity value, last contact, urgency)
- Activity tracking (office visits, samples, lunch meetings)
- Opportunity pipeline (Discovery → Closing stages)

**Response Format:**
1. Quick Answer (direct response)
2. Account Details (HCP profile)
3. Activity Timeline (chronological)
4. Opportunity Summary (stage, value, next steps)
5. Preparation Tips (talking points, materials)
6. Suggested Actions (urgency indicators: 🔴 High, 🟡 Medium, 🟢 Low)

#### Compliance Tab
**Focus:** Policy guidance, spending limits, procedures

**Key Data:**
- Spending limits ($125/HCP meal, $1,350 annual cap)
- Prohibited activities (off-label, kickbacks, gifts)
- Required reporting (24h AE reporting, MIR process)
- Policy documents and contacts

**Response Format:**
1. Direct Answer (unambiguous policy statement)
2. Warnings/Stops (⚠️ CAUTION, 🛑 STOP, ✅ COMPLIANT)
3. Specific Limits (exact dollar amounts, timeframes)
4. Scenarios/Examples (real-world applications)
5. Compliant Alternatives (what to do instead)
6. Documentation Requirements (what to record)
7. Related Policies (cross-references)
8. Questions? (escalation guidance)

---

### 3. Few-Shot Examples

Each tab includes 3-5 carefully crafted examples showing:

- **Query → Response format**
- **Tone and style** (professional, empathetic, data-driven)
- **Structure** (headings, tables, bullet points)
- **Specific numbers** (no vague statements)
- **Edge cases** (errors, missing data, violations)

**Example Structure:**

```typescript
{
  query: "Show me this quarter's sales performance by region",
  response: `## Q3 2025 Regional Performance

**Executive Summary:** Strong quarter overall with North region leading at **102% of target**...

### Regional Breakdown

| Region | Revenue | Target | Gap | WoW Change |
|--------|---------|--------|-----|------------|
...`
}
```

**Why Few-Shot?**
- Provides clear pattern for AI to follow
- Ensures consistent formatting across responses
- Shows edge case handling
- Reduces hallucination (AI sticks to pattern)

---

### 4. Coaching Mode

When enabled, adds compliance guardrail analysis:

**🛑 STOP Signals:**
- Off-label discussion requests
- Drafting documents with off-label content
- Attempts to bypass compliance policies

**⚠️ WARNING Signals:**
- Spending exceeding $125 per HCP
- Expensive venue requests (Capital Grill, steakhouses)
- Non-educational entertainment
- Gifts or personal items

**Detection Protocol:**
1. If STOP → Begin response with "🛑 COMPLIANCE ALERT:"
2. If WARNING → Begin response with "⚠️ CAUTION:"
3. Provide compliant alternatives
4. When in doubt, recommend compliance team

**Coaching Tone:**
- Supportive, not punitive
- Partnership framing ("I'm here to help")
- Celebrate compliant choices ("Great question asking this upfront!")

---

## Token Management

### Target Limits

- **System Prompt:** < 2000 tokens per tab
- **Few-Shot Examples:** ~1500 tokens per tab
- **Coaching Context:** ~300 tokens
- **Total Budget:** ~4000 tokens per request

**Why:** Llama 3.2 3B has context limits - staying under budget ensures responses don't get cut off.

### Optimization Strategies

1. **Use tables instead of prose** - More data, fewer tokens
2. **Avoid repetition** - State rules once, reference by name
3. **Prioritize quality over quantity** - 3 great examples > 5 mediocre ones
4. **Dynamic data injection** - Territory/time period added at runtime

---

## Data Injection Strategy

### Static vs Dynamic Data

**Static (in prompts):**
- Product names and indications
- Compliance policy limits
- Response formats and style guidelines

**Dynamic (injected at runtime):**
- Territory (Northeast US)
- Time period (Q3 2025)
- HCP count (342 engaged HCPs)
- Sample inventory status

**Future Enhancement:**
- Connect to real CRM (Veeva)
- Pull live sales data from Snowflake
- Fetch actual compliance policy updates
- Integrate with sample inventory system

---

## Style Guidelines

### Tone Principles

1. **Be Direct but Empathetic**
   - "I see West territory is struggling" (empathy)
   - "Here's what's driving it" (direct)

2. **Celebrate Wins**
   - "Great work on Tagrisso growth!"
   - "You're handling this exactly right" (compliance)

3. **Show, Don't Just Tell**
   - Use tables for data visualization
   - Include specific numbers (not "some growth")
   - Provide concrete action items

4. **Avoid Jargon**
   - Explain metrics if unclear
   - Use analogies (Figma/Sketch for design patterns)
   - Check understanding often

### Formatting Rules

- **Bold key metrics:** **+12% growth**
- **Use urgency emojis:** 🔴 High, 🟡 Medium, 🟢 Low
- **Tables for comparisons:** Products, regions, HCPs
- **Bullet points for clarity:** 3-7 items max
- **Sections with H2 headings:** ## Executive Summary

---

## Testing Strategy

### Unit Tests (`prompts.test.ts`)

```bash
npm test -- prompts.test.ts
```

**Tests cover:**
- Required context present (products, territory, time period)
- Response format guidelines included
- 3 few-shot examples per tab
- Specific numbers in examples (not placeholders)
- Token limits respected (<2000 tokens)
- Empathy markers present
- Compliance warnings included

### Manual Testing Queries

**Reporting:**
1. "Show me this quarter's sales performance by region"
2. "What's driving the 22% growth in Imfinzi?"
3. "Why is West territory down 8%?"

**CRM:**
1. "Who are my top 10 accounts to prioritize this week?"
2. "What is the recent activity history for Dr. Sarah Cortez?"
3. "Schedule a follow-up meeting with Dr. Sarah Cortez"

**Compliance:**
1. "Meal Spend Limit for a lunch with HCP?"
2. "What are the guidelines for off-label discussions?"
3. "Explain the proper procedure for adverse event reporting"
4. "Draft an email to Dr. Cortez about off-label Tagrisso use" (STOP test)

---

## Maintenance Guidelines

### When to Update Prompts

**Quarterly:**
- Update time period (Q3 2025 → Q4 2025)
- Refresh sales data (actual numbers from Snowflake)
- Adjust competitive intelligence (market share changes)

**As Needed:**
- Add new products to portfolio (Enhertu added 9/2025)
- Update compliance policies (policy revision 08/2025)
- Incorporate user feedback (responses not helpful)
- Fix hallucinations (AI making up numbers)

### Update Process

1. **Update `src/prompts/index.ts`**
   - Edit system prompts
   - Replace few-shot examples
   - Update data context

2. **Run tests**
   ```bash
   npm test -- prompts.test.ts
   ```

3. **Manual testing**
   - Use test queries above
   - Verify responses in dev environment
   - Check token counts

4. **Deploy changes**
   ```bash
   npm run build
   npm run start
   ```

5. **Monitor in production**
   - Watch for error spikes
   - Collect user feedback
   - Track response quality

---

## Performance Optimization

### Current Bottlenecks

1. **Token limits:** Llama 3.2 3B has small context window
2. **Mock data:** Using fake data, not live CRM
3. **Response time:** ~3-5 seconds per query (target: <3s)

### Future Enhancements

**Short-term (Q4 2025):**
- [ ] Connect to live Snowflake data
- [ ] Cache frequently asked questions
- [ ] Add prompt versioning (A/B testing)
- [ ] Implement response quality metrics

**Long-term (2026):**
- [ ] Switch to larger model (Llama 3.2 70B or GPT-4)
- [ ] Fine-tune on pharma-specific data
- [ ] Add RAG (Retrieval Augmented Generation)
- [ ] Multi-language support (Spanish for Puerto Rico)

---

## Troubleshooting

### Common Issues

**Issue 1: AI is making up numbers**
- **Cause:** Prompt not specific enough about data constraints
- **Fix:** Add "NEVER make up numbers" to critical rules
- **Prevention:** Include "This data isn't available" fallback

**Issue 2: Responses are too generic**
- **Cause:** Few-shot examples not specific enough
- **Fix:** Add more detailed examples with real numbers
- **Prevention:** Test each example manually

**Issue 3: Compliance warnings not triggering**
- **Cause:** Coaching context not being applied
- **Fix:** Check `coachingMode` parameter in API call
- **Prevention:** Add test case for stop signals

**Issue 4: Responses cut off mid-sentence**
- **Cause:** Exceeding token limit
- **Fix:** Reduce prompt length or remove examples
- **Prevention:** Monitor token count in development

---

## Related Documentation

- **PRD:** `/Users/stephen_bowman/Documents/GitHub/_work/rep-race-engineer/Rep Copilot PRD.md`
- **Cursor Rules:** `/Users/stephen_bowman/Documents/GitHub/_work/rep-race-engineer/rep-copilot/.cursorrules`
- **Project CLAUDE.md:** `/Users/stephen_bowman/Documents/GitHub/_work/rep-race-engineer/rep-copilot/CLAUDE.md`

---

## Contact & Support

**Developer:** Stephen Bowman
**Role:** UX Designer learning to code with AI
**Communication:** Voice-first (SuperWhisper transcription)

**When working with Stephen:**
- Use design analogies (Figma/Sketch patterns)
- Show results first, then explain
- Celebrate small wins
- Check understanding often
- Keep explanations jargon-free

---

**Last Updated:** January 14, 2026
**Version:** 1.0.0
**Status:** Production Ready ✅
