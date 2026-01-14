/**
 * Widget Type Definitions
 *
 * Like Figma component properties - defines what data each widget needs
 * and how it should behave in the chat interface.
 */

import { ReactNode } from 'react';

// Base widget interface - all widgets implement this
export interface BaseWidget {
  id: string;
  type: string;
  title?: string;
  expanded?: boolean;
  expandable?: boolean;
}

// Chart widget data structures
export interface ChartDataPoint {
  label?: string;
  name?: string; // Alias for label, used in some response views
  value: number;
  percentage?: number;
  trend?: string;
  color?: string;
}

export interface ChartWidgetData {
  chartType: 'bar' | 'line' | 'pie' | 'progress';
  data: ChartDataPoint[];
  xAxisLabel?: string;
  yAxisLabel?: string;
  showLegend?: boolean;
  showTrend?: boolean;
}

// Form widget structures
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'date' | 'number';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  defaultValue?: string | number;
}

export interface FormWidgetData {
  fields: FormField[];
  submitLabel?: string;
  cancelLabel?: string;
  onSubmit?: (data: Record<string, any>) => void;
  onCancel?: () => void;
}

// Data table widget structures
export interface TableColumn {
  key: string;
  label: string;
  type: 'text' | 'number' | 'currency' | 'percentage' | 'badge' | 'date';
  sortable?: boolean;
  width?: string;
}

export interface TableWidgetData {
  columns: TableColumn[];
  rows: Record<string, any>[];
  sortable?: boolean;
  filterable?: boolean;
  exportable?: boolean;
  pageSize?: number;
}

// Alert widget structures
export interface AlertWidgetData {
  severity: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
  }>;
  dismissible?: boolean;
  onDismiss?: () => void;
}

// Widget union type - all possible widget configurations
export type WidgetConfig =
  | (BaseWidget & { type: 'chart'; data: ChartWidgetData })
  | (BaseWidget & { type: 'form'; data: FormWidgetData })
  | (BaseWidget & { type: 'table'; data: TableWidgetData })
  | (BaseWidget & { type: 'alert'; data: AlertWidgetData });

// Widget component props
export interface WidgetProps<T = any> {
  config: T;
  onAction?: (action: string, data?: any) => void;
  onExpand?: (widgetId: string, expanded: boolean) => void;
}

// Widget renderer function signature
export type WidgetRenderer<T = any> = React.ComponentType<WidgetProps<T>>;

// Widget registration entry
export interface WidgetRegistration {
  type: string;
  component: WidgetRenderer;
  defaultExpanded?: boolean;
  expandable?: boolean;
}
