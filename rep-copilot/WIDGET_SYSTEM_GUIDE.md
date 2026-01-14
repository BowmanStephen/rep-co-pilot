# Conversational Widget Injection System

A Microsoft Adaptive Cards-inspired system for injecting functional UI components into chat responses in Rep Co-Pilot.

---

## Quick Start

### 1. Register Widgets (One-Time Setup)

Add this to your app initialization (e.g., `src/app/layout.tsx` or a dedicated `src/widgets/index.ts`):

```tsx
import { WidgetRegistry } from '@/widgets';

// Register all widgets
WidgetRegistry.registerAll([
  {
    type: 'chart',
    component: ChartWidget,
    expandable: true,
    defaultExpanded: true,
  },
  {
    type: 'form',
    component: FormWidget,
    expandable: true,
    defaultExpanded: true,
  },
  {
    type: 'table',
    component: TableWidget,
    expandable: true,
    defaultExpanded: false,
  },
  {
    type: 'alert',
    component: AlertWidget,
    expandable: false,
  },
]);
```

### 2. Inject Widgets into AI Response

Replace the static components in `ResponseView.tsx` with dynamic widgets:

```tsx
import { WidgetContainer, WidgetConfig } from '@/widgets';

// Define widget config (this would come from AI API)
const responseWidgets: WidgetConfig[] = [
  {
    id: 'sales-by-region',
    type: 'chart',
    title: 'Q3 SALES BY REGION',
    expanded: true,
    data: {
      chartType: 'progress',
      data: [
        { label: 'North', value: 1250000, percentage: 100, trend: '+12%' },
        { label: 'East', value: 1100000, percentage: 88, trend: '+8%' },
        { label: 'South', value: 980000, percentage: 78, trend: '+3%' },
        { label: 'West', value: 875000, percentage: 70, trend: '-8%' },
      ],
      showTrend: true,
    },
  },
  {
    id: 'compliance-warning',
    type: 'alert',
    data: {
      severity: 'warning',
      title: 'Meal Spend Approaching Limit',
      message: 'You have $45 remaining in your Q1 meal budget. This expense would exceed the limit.',
      actions: [
        { label: 'View Budget', onClick: () => {}, variant: 'outline' },
        { label: 'Adjust Expense', onClick: () => {}, variant: 'primary' },
      ],
      dismissible: true,
    },
  },
];

// Render widgets
<WidgetContainer
  widgets={responseWidgets}
  onAction={(action, data) => {
    console.log('Widget action:', action, data);
    // Handle form submissions, button clicks, etc.
  }}
/>
```

---

## Widget Types

### 1. Chart Widget

Visualizes data as progress bars, bar charts, or metrics.

```tsx
{
  id: 'regional-sales',
  type: 'chart',
  title: 'Q3 Sales by Region',
  data: {
    chartType: 'progress', // or 'bar', 'line', 'pie'
    data: [
      { label: 'North', value: 1250000, percentage: 100, trend: '+12%' },
      { label: 'East', value: 1100000, percentage: 88, trend: '+8%' },
    ],
    showTrend: true,
  },
}
```

**Example Use Cases:**
- Sales performance by territory
- Product prescription trends
- Month-over-month comparisons
- Budget utilization

### 2. Form Widget

Interactive forms for data entry.

```tsx
{
  id: 'call-log',
  type: 'form',
  title: 'Log Call with Dr. Sarah Cortez',
  data: {
    fields: [
      {
        name: 'date',
        label: 'Call Date',
        type: 'date',
        required: true,
        defaultValue: '2025-01-13',
      },
      {
        name: 'outcome',
        label: 'Call Outcome',
        type: 'select',
        required: true,
        options: [
          { value: 'positive', label: 'Positive Interest' },
          { value: 'neutral', label: 'Neutral' },
          { value: 'negative', label: 'Not Interested' },
        ],
      },
      {
        name: 'notes',
        label: 'Call Notes',
        type: 'textarea',
        placeholder: 'Key discussion points, next steps...',
        required: true,
      },
    ],
    submitLabel: 'Log Call',
    cancelLabel: 'Cancel',
  },
}
```

**Example Use Cases:**
- Call logging
- Meeting scheduling
- Expense reporting
- Feedback collection

### 3. Table Widget

Displays tabular data with sorting and export.

```tsx
{
  id: 'crm-accounts',
  type: 'table',
  title: 'Top 5 Priority Accounts',
  expanded: false, // Start collapsed
  data: {
    columns: [
      { key: 'name', label: 'Account', type: 'text', sortable: true },
      { key: 'specialty', label: 'Specialty', type: 'text' },
      { key: 'priority', label: 'Priority', type: 'badge' },
      { key: 'opportunity', label: 'Opportunity', type: 'currency' },
      { key: 'lastContact', label: 'Last Contact', type: 'text' },
    ],
    rows: [
      { name: 'Dr. Sarah Cortez', specialty: 'Oncology', priority: 'High', opportunity: 45000, lastContact: '2 days ago' },
      { name: 'Dr. Michael Chen', specialty: 'Cardiology', priority: 'High', opportunity: 32000, lastContact: '5 days ago' },
    ],
    sortable: true,
    exportable: true,
    pageSize: 10,
  },
}
```

**Example Use Cases:**
- CRM account lists
- Territory performance metrics
- Product catalogs
- Activity history

### 4. Alert Widget

Displays important notifications with actions.

```tsx
{
  id: 'compliance-alert',
  type: 'alert',
  data: {
    severity: 'warning', // 'info' | 'warning' | 'error' | 'success'
    title: 'Off-Label Promotion Detected',
    message: 'The proposed message discusses off-label use. This requires Medical Affairs review before distribution.',
    actions: [
      { label: 'Request Review', onClick: () => {}, variant: 'primary' },
      { label: 'Revise Message', onClick: () => {}, variant: 'outline' },
    ],
    dismissible: true,
  },
}
```

**Example Use Cases:**
- Compliance warnings
- Opportunity alerts
- Policy reminders
- Error notifications

---

## AI Integration Pattern

### Backend Response Format

The AI API should return widget configurations in the response:

```json
{
  "textResponse": "Here's your Q3 sales performance breakdown. The North region is leading with $1.25M.",
  "widgets": [
    {
      "id": "q3-sales-chart",
      "type": "chart",
      "title": "Q3 Sales by Region",
      "data": {
        "chartType": "progress",
        "data": [
          { "label": "North", "value": 1250000, "percentage": 100, "trend": "+12%" }
        ]
      }
    }
  ]
}
```

### Frontend Integration

```tsx
// In ResponseView.tsx
import { WidgetContainer, WidgetConfig } from '@/widgets';

interface AIResponse {
  textResponse: string;
  widgets?: WidgetConfig[];
}

export default function ResponseView({ aiResponse }: { aiResponse: AIResponse }) {
  return (
    <div>
      {/* Text response */}
      <p>{aiResponse.textResponse}</p>

      {/* Injected widgets */}
      {aiResponse.widgets && (
        <WidgetContainer
          widgets={aiResponse.widgets}
          onAction={(action, data) => {
            // Handle widget interactions
            if (action === 'submit') {
              // Submit form data to backend
              submitForm(data);
            }
          }}
        />
      )}
    </div>
  );
}
```

---

## Widget Actions

All widgets emit actions through the `onAction` callback:

```tsx
onAction={(action, data) => {
  switch (action) {
    case 'submit': // Form submitted
      console.log('Form data:', data);
      break;

    case 'cancel': // Form cancelled
      console.log('Form cancelled');
      break;

    case 'toggle-expand': // Widget expanded/collapsed
      console.log('Widget expanded:', data.expanded);
      break;

    case 'export': // Table export requested
      console.log('Exporting data:', data.data);
      break;

    case 'action-clicked': // Alert button clicked
      console.log('Button clicked:', data.action);
      break;

    case 'dismiss': // Alert dismissed
      console.log('Alert dismissed');
      break;
  }
}}
```

---

## Progressive Disclosure

Widgets can be **expandable** - they show a header and collapse content to save space:

```tsx
{
  id: 'detailed-metrics',
  type: 'table',
  title: 'Detailed Territory Metrics', // Header always visible
  expanded: false, // Start collapsed
  data: { /* ... */ },
}

// User clicks header to expand/collapse
```

**Best Practices:**
- **Expand by default**: Charts, forms, alerts (content is important)
- **Collapse by default**: Tables, detailed metrics (save space)
- **Non-expandable**: Simple alerts (always show full content)

---

## Creating Custom Widgets

### 1. Define Widget Data Type

```tsx
// types.ts
export interface CustomWidgetData {
  // Your widget-specific properties
}
```

### 2. Create Widget Component

```tsx
// widgets/CustomWidget.tsx
'use client';

import { WidgetProps } from '../types';

type CustomWidgetConfig = WidgetProps<{
  type: 'custom';
  data: CustomWidgetData;
}>;

export default function CustomWidget({ config, onAction }: CustomWidgetConfig) {
  return (
    <div>
      {/* Your widget UI */}
    </div>
  );
}
```

### 3. Register Widget

```tsx
WidgetRegistry.register({
  type: 'custom',
  component: CustomWidget,
  expandable: true,
  defaultExpanded: true,
});
```

---

## File Structure

```
src/widgets/
├── types.ts              # Type definitions for all widgets
├── WidgetRegistry.ts     # Singleton registry for widget types
├── WidgetRenderer.tsx    # Component that renders widgets with animations
├── index.ts              # Widget registration and exports
└── widgets/
    ├── ChartWidget.tsx   # Progress bars, bar charts, metrics
    ├── FormWidget.tsx    # Interactive forms
    ├── TableWidget.tsx   # Sortable, paginated tables
    └── AlertWidget.tsx   # Compliance warnings, notifications
```

---

## Migration Guide: ResponseView.tsx

### Before (Static Components)

```tsx
// Hard-coded components in ResponseView.tsx
<TopProductsCard />
<MonthlyTrendsCard />
<CRMAccountsList />
```

### After (Dynamic Widgets)

```tsx
// AI-driven widget injection
const widgets: WidgetConfig[] = [
  {
    id: 'top-products',
    type: 'chart',
    title: 'Top 5 Prescribed Products',
    data: { /* chart data */ },
  },
  {
    id: 'crm-accounts',
    type: 'table',
    title: 'Top 5 Priority Accounts',
    data: { /* table data */ },
  },
];

<WidgetContainer widgets={widgets} onAction={handleWidgetAction} />
```

**Benefits:**
- AI decides which widgets to show
- Widget data comes from backend
- Single source of truth for UI
- Consistent animations and styling

---

## Performance Considerations

1. **Lazy Loading**: Widgets only render when visible
2. **Pagination**: Tables use pagination for large datasets
3. **Memoization**: Widget data is memoized to prevent re-renders
4. **Animations**: Framer Motion provides smooth 60fps animations

---

## Accessibility

All widgets follow WCAG 2.1 AA standards:
- Keyboard navigation (Tab, Enter, Space)
- Focus indicators (2px gold outline)
- ARIA labels via Radix UI components
- VoiceOver support (iOS)

---

## Design Tokens

Widgets use AZ brand colors from `globals.css`:

- **Mulberry** (primary): `bg-primary text-white`
- **Gold** (accent): `text-gold bg-gold/10`
- **Graphite** (text): `text-foreground`
- **Platinum** (muted): `text-muted-foreground`
- **Destructive** (error): `text-destructive bg-destructive/10`

---

## Next Steps

1. **Register widgets** in `src/app/layout.tsx`
2. **Update API** to return widget configurations
3. **Replace static components** in `ResponseView.tsx`
4. **Test interactions** (form submissions, table sorting, alerts)
5. **Add custom widgets** as needed

---

## Example: Complete Widget Response

```tsx
// Example AI response for "Show me my top accounts and call logging form"
const aiResponse = {
  text: "Here are your top 5 priority accounts. I've also prepared a call logging form for quick follow-ups.",
  widgets: [
    {
      id: 'top-accounts-table',
      type: 'table',
      title: 'Top 5 Priority Accounts',
      data: {
        columns: [
          { key: 'name', label: 'Account', type: 'text', sortable: true },
          { key: 'specialty', label: 'Specialty', type: 'text' },
          { key: 'priority', label: 'Priority', type: 'badge' },
          { key: 'opportunity', label: 'Opportunity', type: 'currency' },
        ],
        rows: [
          { name: 'Dr. Sarah Cortez', specialty: 'Oncology', priority: 'High', opportunity: 45000 },
          { name: 'Dr. Michael Chen', specialty: 'Cardiology', priority: 'High', opportunity: 32000 },
        ],
        sortable: true,
        exportable: true,
      },
    },
    {
      id: 'quick-call-log',
      type: 'form',
      title: 'Quick Call Log',
      data: {
        fields: [
          { name: 'account', label: 'Account', type: 'select', required: true, options: [
            { value: 'cortez', label: 'Dr. Sarah Cortez' },
            { value: 'chen', label: 'Dr. Michael Chen' },
          ]},
          { name: 'outcome', label: 'Outcome', type: 'select', required: true, options: [
            { value: 'positive', label: 'Positive' },
            { value: 'neutral', label: 'Neutral' },
          ]},
          { name: 'notes', label: 'Notes', type: 'textarea', required: true },
        ],
        submitLabel: 'Log Call',
      },
    },
  ],
};

// Render in UI
<WidgetContainer widgets={aiResponse.widgets} />
```

---

**Questions?** Check the widget source code in `src/widgets/` for implementation details.
