# Widget System for Rep Co-Pilot

A conversational widget injection system inspired by Microsoft Adaptive Cards, built for React 19 and shadcn/ui.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     AI API Response                          │
│  { textResponse: "...", widgets: WidgetConfig[] }           │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   ResponseView.tsx                           │
│  - Receives AI response with widget configs                 │
│  - Renders text + WidgetContainer                           │
│  - Handles widget actions (forms, buttons, etc.)            │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   WidgetContainer                            │
│  - Maps over widget configs                                 │
│  - Applies staggered animations                             │
│  - Wraps each in WidgetRenderer                             │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   WidgetRenderer                             │
│  - Looks up widget type in registry                         │
│  - Renders expandable header (if applicable)                │
│  - AnimatePresence for expand/collapse                      │
│  - Passes config to widget component                        │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Widget Component (Chart/Form/etc.)              │
│  - Receives config.data                                     │
│  - Renders UI with shadcn/ui components                    │
│  - Emits actions via onAction callback                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Design Decisions

### 1. **Why Not Use Adaptive Cards Directly?**

Adaptive Cards is great for Microsoft ecosystems, but:
- Heavy JSON schema parsing
- Limited React integration
- Not optimized for shadcn/ui
- Harder to customize animations

**Our approach**: Lighter, type-safe, fully integrated with our design system.

### 2. **Widget Registry Pattern**

Like a Figma component library:
- **Single source of truth**: One place to register all widget types
- **Type safety**: TypeScript ensures correct widget data shapes
- **Extensibility**: Easy to add custom widget types
- **Singleton**: Ensures consistency across the app

### 3. **Progressive Disclosure**

Widgets can expand/collapse to save screen real estate:
- **Expand by default**: Charts, forms (content is critical)
- **Collapse by default**: Tables (data-heavy, show on demand)
- **Non-expandable**: Alerts (always visible)

### 4. **Animation Strategy**

All animations use **Framer Motion**:
- **Staggered entry**: Widgets fade in sequentially (delay: index * 0.1)
- **Spring physics**: Natural feel for interactions
- **Layout animations**: Smooth expand/collapse with AnimatePresence
- **Performance**: 60fps with GPU acceleration

---

## Widget Type Reference

| Widget | Use Case | Expandable | Default State |
|--------|----------|------------|---------------|
| **Chart** | Sales metrics, trends, KPIs | Yes | Expanded |
| **Form** | Call logging, data entry | Yes | Expanded |
| **Table** | Account lists, data grids | Yes | Collapsed |
| **Alert** | Compliance warnings, notifications | No | Always visible |

---

## Data Flow Example

```
User asks: "Show me my top accounts and log a call"

┌─────────────────────────────────────────────────────────────┐
│ Step 1: AI generates response                                │
│                                                              │
│ {                                                            │
│   textResponse: "Here are your top 5 priority accounts...",  │
│   widgets: [                                                 │
│     { id: 'accounts-table', type: 'table', data: {...} },   │
│     { id: 'call-log-form', type: 'form', data: {...} }      │
│   ]                                                          │
│ }                                                            │
└─────────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 2: ResponseView renders widgets                         │
│                                                              │
│ <WidgetContainer widgets={response.widgets} />               │
└─────────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 3: User interacts with form                              │
│                                                              │
│ { action: 'submit', data: { account: 'cortez', ... } }      │
└─────────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 4: Action handler processes submission                   │
│                                                              │
│ POST /api/call-log → { success: true }                       │
└─────────────────────────────────────────────────────────────┘
```

---

## File Structure

```
src/widgets/
├── types.ts                    # Type definitions for all widgets
│   ├── BaseWidget              # Common properties (id, type, title)
│   ├── ChartWidgetData         # Chart-specific types
│   ├── FormWidgetData          # Form field types
│   ├── TableWidgetData         # Table column/row types
│   ├── AlertWidgetData         # Alert severity, actions
│   ├── WidgetConfig            # Union type for all widgets
│   └── WidgetRenderer          # Component props
│
├── WidgetRegistry.ts           # Singleton registry class
│   ├── register()              # Register single widget
│   ├── registerAll()           # Register multiple widgets
│   ├── get()                   # Get widget component by type
│   ├── has()                   # Check if type exists
│   └── getMetadata()           # Get widget config (expandable, etc.)
│
├── WidgetRenderer.tsx          # Container component
│   ├── WidgetRenderer          # Single widget with header + content
│   ├── WidgetContainer         # Multiple widgets with animations
│   └── AnimatePresence         # Expand/collapse transitions
│
├── index.ts                    # Registration + exports
│   └── WidgetRegistry.registerAll([...])
│
└── widgets/                    # Widget implementations
    ├── ChartWidget.tsx         # Progress bars, bar charts
    ├── FormWidget.tsx          # Interactive forms
    ├── TableWidget.tsx         # Sortable tables
    └── AlertWidget.tsx         # Compliance warnings
```

---

## Extending the System

### Adding a New Widget Type

**1. Define the widget data type:**

```tsx
// types.ts
export interface CalendarWidgetData {
  events: Array<{
    date: string;
    title: string;
    location?: string;
  }>;
  viewMode: 'month' | 'week' | 'day';
}
```

**2. Create the widget component:**

```tsx
// widgets/CalendarWidget.tsx
'use client';

import { WidgetProps } from '../types';

type CalendarWidgetConfig = WidgetProps<{
  type: 'calendar';
  data: CalendarWidgetData;
}>;

export default function CalendarWidget({ config, onAction }: CalendarWidgetConfig) {
  const { events, viewMode } = config.data;

  return (
    <div>
      {/* Calendar UI implementation */}
      {events.map(event => (
        <div key={event.date}>{event.title}</div>
      ))}
    </div>
  );
}
```

**3. Register the widget:**

```tsx
// index.ts
import CalendarWidget from './widgets/CalendarWidget';

WidgetRegistry.register({
  type: 'calendar',
  component: CalendarWidget,
  expandable: true,
  defaultExpanded: true,
});
```

**4. Use in AI response:**

```tsx
const aiResponse = {
  textResponse: "Here's your schedule for this week:",
  widgets: [
    {
      id: 'weekly-calendar',
      type: 'calendar',
      title: 'This Week\'s Schedule',
      data: {
        events: [
          { date: '2025-01-15', title: 'Dr. Cortez Visit', location: 'City General' },
        ],
        viewMode: 'week',
      },
    },
  ],
};
```

---

## Performance Optimizations

1. **Code Splitting**: Widgets load on-demand
2. **Memoization**: Widget data is memoized to prevent re-renders
3. **Virtual Scrolling**: Tables use pagination for large datasets
4. **Animation Optimization**: Framer Motion uses GPU acceleration
5. **Lazy Evaluation**: WidgetContainer only renders visible widgets

---

## Testing Strategy

### Unit Tests

```tsx
// __tests__/ChartWidget.test.tsx
import { render, screen } from '@testing-library/react';
import ChartWidget from '../widgets/ChartWidget';

test('renders progress bars correctly', () => {
  const config = {
    id: 'test-chart',
    type: 'chart',
    data: {
      chartType: 'progress',
      data: [
        { label: 'North', value: 1000000, percentage: 100 },
      ],
    },
  };

  render(<ChartWidget config={config} />);
  expect(screen.getByText('North')).toBeInTheDocument();
  expect(screen.getByText('$1.00M')).toBeInTheDocument();
});
```

### Integration Tests

```tsx
// __tests__/WidgetContainer.test.tsx
import { render, screen } from '@testing-library/react';
import { WidgetContainer } from '../WidgetRenderer';

test('renders multiple widgets with staggered animations', () => {
  const widgets = [
    { id: '1', type: 'chart', data: {...} },
    { id: '2', type: 'table', data: {...} },
  ];

  const { container } = render(
    <WidgetContainer widgets={widgets} />
  );

  expect(container.querySelectorAll('.rounded-lg')).toHaveLength(2);
});
```

---

## Accessibility

All widgets are WCAG 2.1 AA compliant:

- **Keyboard Navigation**: Tab, Enter, Space, Arrow keys
- **Focus Indicators**: 2px gold outline on focus
- **ARIA Labels**: Via Radix UI primitives
- **Screen Reader**: VoiceOver support (iOS), NVDA (Windows)
- **Color Contrast**: 4.5:1 minimum (AZ brand colors)

---

## Design Integration

### AZ Brand Colors

Widgets use tokens from `globals.css`:

```css
--color-mulberry: hsl(323 100% 26%);    /* Primary actions */
--color-gold: hsl(43 100% 47%);         /* Focus states */
--color-graphite: hsl(180 4% 26%);      /* Body text */
--color-platinum: hsl(167 13% 65%);     /* Muted text */
```

### shadcn/ui Components

Widgets are built from:
- `Button` - Form submissions, action buttons
- `Input` - Text, number, date inputs
- `Textarea` - Multi-line text input
- `Label` - Form field labels
- `Card` - Widget containers (optional)

---

## Troubleshooting

### Widget not rendering

**Problem**: Widget shows nothing, console warns "Widget type not found"

**Solution**: Ensure widget is registered in `src/widgets/index.ts`:

```tsx
WidgetRegistry.register({
  type: 'your-widget-type',
  component: YourWidgetComponent,
});
```

### Form not submitting

**Problem**: Clicking submit does nothing

**Solution**: Ensure `onAction` handler is passed to `WidgetContainer`:

```tsx
<WidgetContainer
  widgets={widgets}
  onAction={(action, data) => {
    if (action === 'submit') {
      console.log('Form data:', data);
    }
  }}
/>
```

### Table not sorting

**Problem**: Clicking column headers doesn't sort

**Solution**: Ensure column has `sortable: true`:

```tsx
columns: [
  { key: 'name', label: 'Name', type: 'text', sortable: true },
  //                                              ^^^^^^^^^^^^
]
```

---

## FAQ

**Q: Can I nest widgets inside widgets?**

A: Not currently. Each widget is self-contained. For complex layouts, use multiple widgets in sequence.

**Q: How do I add custom animations?**

A: Modify the `motion.div` props in `WidgetRenderer.tsx`. For widget-specific animations, add Framer Motion to the widget component.

**Q: Can widgets communicate with each other?**

A: Not directly. Use the `onAction` callback to update parent state, then re-render with new widget configs.

**Q: How do I handle widget state persistence?**

A: Store widget state in parent component or use a state management solution (Zustand, Jotai). Pass updated configs to `WidgetContainer`.

---

## Resources

- **Microsoft Adaptive Cards**: https://adaptivecards.io/
- **Framer Motion**: https://www.framer.com/motion/
- **shadcn/ui**: https://ui.shadcn.com/
- **Radix UI**: https://www.radix-ui.com/

---

**Last updated**: January 13, 2026
