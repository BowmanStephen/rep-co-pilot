# Rep Copilot - CRM ResponseView Overnight Loop

## Overview
Build complete CRM ResponseView with account prioritization, activity timeline, meeting scheduler, and opportunity pipeline.

## Phase 1: Foundation & Core Components
**Max Iterations**: 50
**Escape**: After 50 iterations if not complete

### Tasks
1. Create `CRMResponseView.tsx` main component (follow `ResponseView.tsx` pattern)
2. Build `AccountPriorityCard.tsx` - top 10 accounts with priority scoring
3. Build `ActivityTimeline.tsx` - vertical timeline with recent interactions
4. Define TypeScript interfaces for CRM data structures

### Success Criteria
- [ ] Main CRMResponseView component created with header/back button
- [ ] AccountPriorityCard displays 10 accounts (name, HCP, priority, value)
- [ ] ActivityTimeline shows last 10 interactions (calls, meetings, emails)
- [ ] TypeScript interfaces defined (CRMAccount, Activity, Opportunity)
- [ ] Components match visual quality of Reporting ResponseView

### Output
<promise>PHASE1_COMPLETE</promise>

---

## Phase 2: Advanced Features
**Max Iterations**: 50
**Escape**: After 50 iterations if not complete

### Tasks
1. Build `OpportunityPipeline.tsx` - visual 5-stage pipeline (Prospecting → Discovery → Proposal → Negotiation → Closed)
2. Build `MeetingScheduler.tsx` - calendar UI with quick-schedule functionality
3. Build `QuickActions.tsx` - Call Now, Send Email, Log Activity, View Full Profile buttons
4. Implement tap-to-advance for opportunity stages
5. Add Framer Motion animations (stagger, spring physics)

### Success Criteria
- [ ] OpportunityPipeline visual with 5 stages and value totals
- [ ] MeetingScheduler with calendar view and quick-schedule button
- [ ] QuickActions all functional (simulated)
- [ ] Framer Motion animations matching existing patterns
- [ ] Responsive design: desktop 3col → tablet 2col → mobile 1col

### Output
<promise>PHASE2_COMPLETE</promise>

---

## Phase 3: Integration & Polish
**Max Iterations**: 50
**Escape**: After 50 iterations if not complete

### Tasks
1. Update `src/app/page.tsx` routing for CRM prompts → CRMResponseView
2. Integrate SmartInputDock for follow-up queries in CRM context
3. Add loading states and error handling
4. Ensure AZ brand colors applied correctly (Mulberry, Gold, Graphite)
5. Test all navigation flows (tab switching, back button, prompt routing)
6. Verify no console errors or TypeScript warnings

### Success Criteria
- [ ] CRM preset prompts navigate to CRMResponseView
- [ ] Back button returns to prompt selection
- [ ] SmartInputDock works for CRM follow-ups
- [ ] Loading states show during data fetches
- [ ] Error handling for failed requests
- [ ] No console errors or warnings
- [ ] TypeScript compilation passes
- [ ] Development server runs without errors

### Output
<promise>PHASE3_COMPLETE</promise>
<promise>CRM_COMPLETE</promise>
<promise>ALL_PHASES_COMPLETE</promise>

---

## Technical Context

### Existing Pattern to Follow
- **Template**: `src/components/ResponseView.tsx` (Reporting view)
- **Header**: Mulberry background, white text, back button
- **Layout**: Max-width container, card-based sections
- **Animations**: Framer Motion with stagger delays (0.1s per item)
- **Fonts**: Roboto Slab (headings), Inter (body)

### Component Structure
```
src/components/
├── CRMResponseView.tsx (NEW - main container)
├── AccountPriorityCard.tsx (NEW)
├── ActivityTimeline.tsx (NEW)
├── MeetingScheduler.tsx (NEW)
├── OpportunityPipeline.tsx (NEW)
└── QuickActions.tsx (NEW)
```

### Data Structures (Mock Data)
```typescript
interface CRMAccount {
  id: string;
  hcpName: string;
  organization: string;
  priority: 'high' | 'medium' | 'low';
  lastContact: Date;
  opportunityValue: number;
  nextAction: string;
}

interface Activity {
  id: string;
  type: 'call' | 'meeting' | 'email' | 'sample';
  timestamp: Date;
  notes: string;
  outcome: string;
}

interface Opportunity {
  id: string;
  accountName: string;
  stage: 'prospecting' | 'discovery' | 'proposal' | 'negotiation' | 'closed';
  value: number;
  probability: number;
}
```

### Code Patterns (Copy from ResponseView.tsx)

```tsx
// Header pattern
<header className="bg-primary text-primary-foreground px-6 py-3 flex items-center justify-between sticky top-0 z-10">
  <Button variant="ghost" onClick={onBack}>
    <ArrowLeft className="h-5 w-5" />
    Back
  </Button>
  <h1 className="text-lg font-semibold tracking-wide">CRM</h1>
  <div className="w-20" />
</header>

// Staggered list animation
{items.map((item, index) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
  >
    {/* content */}
  </motion.div>
))}

// Button with motion
<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
  <Button className="bg-primary hover:bg-primary/90">
    {/* content */}
  </Button>
</motion.div>
```

## Design Tokens (AZ Brand)
- **Primary (Mulberry)**: `#830051` → `bg-primary text-primary-foreground`
- **Gold**: `#f0ab00` → accents, focus rings
- **Graphite**: `#3f4444` → body text
- **Platinum**: `#9db0ac` → muted text
- **Light Platinum**: `#ebefee` → backgrounds

## Progress Tracking

<!-- Ralph updates this section -->

### Phase 1 Status
- **Iteration**: TBD
- **Completed**: TBD
- **In Progress**: TBD
- **Next**: TBD

### Phase 2 Status
- **Iteration**: TBD
- **Completed**: TBD
- **In Progress**: TBD
- **Next**: TBD

### Phase 3 Status
- **Iteration**: TBD
- **Completed**: TBD
- **In Progress**: TBD
- **Next**: TBD
