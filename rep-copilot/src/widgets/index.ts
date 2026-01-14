/**
 * Widget Registration
 *
 * This file registers all available widgets with the WidgetRegistry.
 * Import this in your app initialization to register all widget types.
 */

import { WidgetRegistry } from './WidgetRegistry';
import ChartWidget from './widgets/ChartWidget';
import FormWidget from './widgets/FormWidget';
import TableWidget from './widgets/TableWidget';
import AlertWidget from './widgets/AlertWidget';

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
    defaultExpanded: false, // Tables start collapsed by default
  },
  {
    type: 'alert',
    component: AlertWidget,
    expandable: false, // Alerts are always fully visible
    defaultExpanded: true,
  },
]);

// Export for convenience
export { WidgetRegistry } from './WidgetRegistry';
export { WidgetRenderer, WidgetContainer } from './WidgetRenderer';
export * from './types';

// Export individual widgets
export { default as ChartWidget } from './widgets/ChartWidget';
export { default as FormWidget } from './widgets/FormWidget';
export { default as TableWidget } from './widgets/TableWidget';
export { default as AlertWidget } from './widgets/AlertWidget';
