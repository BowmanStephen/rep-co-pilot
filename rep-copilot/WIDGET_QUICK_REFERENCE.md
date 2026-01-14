# Widget System Quick Reference

Cheat sheet for the Conversational Widget Injection System in Rep Co-Pilot.

---

## Widget Types at a Glance

| Widget | When to Use | Key Props | Actions |
|--------|------------|-----------|---------|
| **Chart** | Visualize metrics, trends, KPIs | `chartType`, `data[]`, `showTrend` | `toggle-expand` |
| **Form** | Collect user input (call logs, feedback) | `fields[]`, `submitLabel` | `submit`, `cancel`, `validation-error` |
| **Table** | Display tabular data with sorting | `columns[]`, `rows[]`, `pageSize` | `export`, `sort` |
| **Alert** | Compliance warnings, notifications | `severity`, `message`, `actions[]` | `action-clicked`, `dismiss` |

---

## Common Widget Patterns

### Sales Performance Chart

```tsx
{
  id: 'q3-sales',
  type: 'chart',
  title: 'Q3 Sales by Region',
  data: {
    chartType: 'progress',
    data: [
      { label: 'North', value: 1250000, percentage: 100, trend: '+12%' },
      { label: 'East', value: 1100000, percentage: 88, trend: '+8%' },
    ],
    showTrend: true,
  },
}
```

### CRM Accounts Table

```tsx
{
  id: 'accounts',
  type: 'table',
  title: 'Top 5 Priority Accounts',
  expanded: false,
  data: {
    columns: [
      { key: 'name', label: 'Account', type: 'text', sortable: true },
      { key: 'specialty', label: 'Specialty', type: 'text' },
      { key: 'priority', label: 'Priority', type: 'badge' },
      { key: 'opportunity', label: 'Opportunity', type: 'currency' },
    ],
    rows: [
      { name: 'Dr. Sarah Cortez', specialty: 'Oncology', priority: 'High', opportunity: 45000 },
    ],
    sortable: true,
    exportable: true,
  },
}
```

### Call Logging Form

```tsx
{
  id: 'call-log',
  type: 'form',
  title: 'Log Call',
  data: {
    fields: [
      { name: 'account', label: 'Account', type: 'select', required: true, options: [
        { value: 'cortez', label: 'Dr. Sarah Cortez' },
      ]},
      { name: 'outcome', label: 'Outcome', type: 'select', required: true, options: [
        { value: 'positive', label: 'Positive' },
        { value: 'neutral', label: 'Neutral' },
      ]},
      { name: 'notes', label: 'Notes', type: 'textarea', required: true },
    ],
    submitLabel: 'Log Call',
  },
}
```

### Compliance Warning Alert

```tsx
{
  id: 'compliance-warning',
  type: 'alert',
  data: {
    severity: 'warning',
    title: 'Meal Spend Approaching Limit',
    message: 'You have $45 remaining. This expense would exceed your budget.',
    actions: [
      { label: 'View Budget', onClick: () => {}, variant: 'outline' },
      { label: 'Adjust Expense', onClick: () => {}, variant: 'primary' },
    ],
    dismissible: true,
  },
}
```

---

## Form Field Types

| Type | Example | Use Case |
|------|---------|----------|
| `text` | Input with placeholder | Short text input (name, subject) |
| `textarea` | Multi-line input | Long text (notes, feedback) |
| `select` | Dropdown menu | Choose from options (outcome, account) |
| `date` | Date picker | Scheduling (call date, meeting time) |
| `number` | Number input | Numeric values (budget, quantity) |

---

## Table Column Types

| Type | Format | Example |
|------|--------|---------|
| `text` | Plain text | Account names, specialties |
| `number` | Comma-separated | 1,234 |
| `currency` | Dollar values | $45K, $1.25M |
| `badge` | Pill badge | High, Medium, Low |
| `date` | Date format | Jan 13, 2025 |
| `percentage` | Percent suffix | 75% |

---

## Alert Severities

| Severity | Icon | Color | Use Case |
|----------|------|-------|----------|
| `info` | ℹ️ Info | Blue | General information |
| `warning` | ⚠️ Warning | Amber | Caution required (budget limits) |
| `error` | ❌ Error | Red | Block action (off-label detected) |
| `success` | ✓ Success | Green | Confirmation (action completed) |

---

## Widget Actions Reference

### Action Types

```tsx
onAction={(action, data) => {
  switch (action) {
    case 'submit':
      // Form submitted with data
      console.log('Form data:', data);
      break;

    case 'cancel':
      // Form cancelled
      break;

    case 'toggle-expand':
      // Widget expanded/collapsed
      console.log('Expanded:', data.expanded);
      break;

    case 'export':
      // Table export requested
      console.log('Export data:', data.data);
      break;

    case 'action-clicked':
      // Alert button clicked
      console.log('Button:', data.action);
      break;

    case 'dismiss':
      // Alert dismissed
      break;

    case 'validation-error':
      // Form validation failed
      console.log('Errors:', data.fields);
      break;
  }
}}
```

---

## Chart Data Formatting

### Currency Values

```tsx
// Automatic formatting
value: 1250000      // Displays: $1.25M
value: 875000       // Displays: $875K
value: 45000        // Displays: $45K
```

### Trend Indicators

```tsx
trend: '+12%'   // Green, up arrow
trend: '-8%'    // Red, down arrow
trend: '0%'     // Gray, minus icon
```

### Chart Types

- `progress`: Horizontal progress bars (default for Q3 Sales)
- `bar`: Vertical bar chart
- `line`: Line chart with dots
- `pie`: Pie chart (future)

---

## Progressive Disclosure

### Expandable Widgets

```tsx
{
  id: 'detailed-table',
  type: 'table',
  title: 'Detailed Metrics',
  expanded: false,  // Start collapsed
  data: { /* ... */ },
}
```

**Best Practices:**
- ✅ **Expand by default**: Charts, forms, alerts (content is critical)
- ✅ **Collapse by default**: Tables, detailed metrics (save space)
- ✅ **Non-expandable**: Simple alerts (always show full content)

### Expand/Collapse Behavior

1. User clicks widget header
2. `onAction('toggle-expand', { widgetId, expanded })`
3. Widget animates open/closed (200ms)
4. Parent can track expanded state

---

## Styling with AZ Brand Colors

### Widget Container

```tsx
// Uses shadcn/ui Card styles
className="rounded-lg border border-border/60 bg-card shadow-sm"
```

### Widget Header

```tsx
// Hover effect
className="flex items-center justify-between px-4 py-3 bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
```

### Chart Bars

```tsx
// Mulberry gradient
className="bg-gradient-to-r from-primary to-magenta"

// Custom color
color: 'bg-green-500'  // For trends
```

### Alert Containers

```tsx
// Warning (amber)
className="bg-amber-50 border-amber-200 border-l-4"

// Error (red)
className="bg-red-50 border-red-200 border-l-4"
```

---

## Import Paths

```tsx
// Core widgets
import { WidgetContainer, WidgetRenderer } from '@/widgets';
import { WidgetConfig, WidgetRegistry } from '@/widgets';

// Individual widgets (if needed)
import ChartWidget from '@/widgets/widgets/ChartWidget';
import FormWidget from '@/widgets/widgets/FormWidget';
import TableWidget from '@/widgets/widgets/TableWidget';
import AlertWidget from '@/widgets/widgets/AlertWidget';

// Types
import type { WidgetConfig, ChartWidgetData, FormWidgetData } from '@/widgets';
```

---

## Common Use Cases

### 1. Sales Dashboard

```tsx
const widgets: WidgetConfig[] = [
  { type: 'chart', title: 'Regional Sales', data: { /* ... */ } },
  { type: 'chart', title: 'Product Performance', data: { /* ... */ } },
  { type: 'alert', data: { severity: 'warning', message: 'West region below target' } },
];
```

### 2. CRM Workflow

```tsx
const widgets: WidgetConfig[] = [
  { type: 'table', title: 'Priority Accounts', data: { /* ... */ } },
  { type: 'form', title: 'Log Call', data: { /* ... */ } },
];
```

### 3. Compliance Check

```tsx
const widgets: WidgetConfig[] = [
  { type: 'table', title: 'Policy Reference', data: { /* ... */ } },
  { type: 'alert', data: { severity: 'error', message: 'Off-label detected' } },
];
```

---

## Testing Snippets

### Render Widget

```tsx
import { render, screen } from '@testing-library/react';
import { WidgetRenderer } from '@/widgets';

test('renders chart widget', () => {
  const config = {
    id: 'test',
    type: 'chart',
    data: {
      chartType: 'progress',
      data: [{ label: 'North', value: 1000000, percentage: 100 }],
    },
  };

  render(<WidgetRenderer config={config} />);
  expect(screen.getByText('North')).toBeInTheDocument();
});
```

### Handle Widget Action

```tsx
test('handles form submission', () => {
  const handleAction = jest.fn();
  const { container } = render(
    <WidgetContainer
      widgets={[formConfig]}
      onAction={handleAction}
    />
  );

  // Submit form
  fireEvent.click(screen.getByText('Submit'));
  expect(handleAction).toHaveBeenCalledWith('submit', expect.any(Object));
});
```

---

## Debugging Tips

### Widget Not Rendering

1. Check console for "Widget type not found"
2. Verify widget is registered in `src/widgets/index.ts`
3. Check `type` matches registration exactly

### Form Not Validating

1. Ensure `required: true` on fields
2. Check field names are unique
3. Verify `onAction` handler is passed

### Table Not Sorting

1. Check column has `sortable: true`
2. Ensure column `key` matches row keys
3. Verify data types are consistent

---

## Performance Tips

1. **Paginate large tables**: Use `pageSize: 10` for 100+ rows
2. **Collapse by default**: Tables start collapsed to save render time
3. **Limit animations**: Use fewer than 10 widgets per response
4. **Memoize data**: Wrap widget configs in `useMemo` if regenerated

---

## Accessibility Checklist

- ✅ Keyboard navigation (Tab, Enter, Space)
- ✅ Focus indicators (2px gold outline)
- ✅ ARIA labels (via Radix UI)
- ✅ Screen reader support (VoiceOver, NVDA)
- ✅ Color contrast (4.5:1 minimum)
- ✅ Touch targets (44x44px minimum)

---

**Last updated**: January 13, 2026
