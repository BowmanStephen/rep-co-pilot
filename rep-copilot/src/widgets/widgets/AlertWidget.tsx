/**
 * Alert Widget
 *
 * Displays compliance warnings, opportunity alerts, and important notifications.
 * Like an alert component in Figma - clear visual hierarchy with actionable buttons.
 */

'use client';

import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { WidgetProps } from '../types';

type AlertWidgetConfig = WidgetProps<{
  type: 'alert';
  data: {
    severity: 'info' | 'warning' | 'error' | 'success';
    title: string;
    message: string;
    actions?: Array<{
      label: string;
      onClick: () => void;
      variant?: 'primary' | 'secondary' | 'outline';
    }>;
    dismissible?: boolean;
  };
}>;

const alertConfig = {
  info: {
    icon: Info,
    containerClass: 'bg-blue-50 border-blue-200',
    iconClass: 'text-blue-600',
    titleClass: 'text-blue-900',
    messageClass: 'text-blue-800',
  },
  warning: {
    icon: AlertTriangle,
    containerClass: 'bg-amber-50 border-amber-200',
    iconClass: 'text-amber-600',
    titleClass: 'text-amber-900',
    messageClass: 'text-amber-800',
  },
  error: {
    icon: AlertCircle,
    containerClass: 'bg-red-50 border-red-200',
    iconClass: 'text-red-600',
    titleClass: 'text-red-900',
    messageClass: 'text-red-800',
  },
  success: {
    icon: CheckCircle,
    containerClass: 'bg-green-50 border-green-200',
    iconClass: 'text-green-600',
    titleClass: 'text-green-900',
    messageClass: 'text-green-800',
  },
};

export default function AlertWidget({ config, onAction }: AlertWidgetConfig) {
  const { severity, title, message, actions = [], dismissible = false } = config.data;
  const Icon = alertConfig[severity].icon;
  const styles = alertConfig[severity];

  return (
    <div
      className={cn(
        'rounded-lg border-l-4 p-4 relative',
        styles.containerClass
      )}
    >
      {/* Dismiss button */}
      {dismissible && (
        <button
          onClick={() => onAction?.('dismiss')}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      {/* Alert Content */}
      <div className="flex gap-3">
        {/* Icon */}
        <div className={cn('flex-shrink-0 mt-0.5', styles.iconClass)}>
          <Icon className="h-5 w-5" />
        </div>

        {/* Text Content */}
        <div className={cn('flex-1 space-y-1', dismissible && 'pr-6')}>
          <h4 className={cn('text-sm font-semibold', styles.titleClass)}>
            {title}
          </h4>
          <p className={cn('text-sm', styles.messageClass)}>
            {message}
          </p>

          {/* Action Buttons */}
          {actions.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant={action.variant === 'primary' ? 'default' : 'outline'}
                  onClick={() => {
                    action.onClick();
                    onAction?.('action-clicked', { action: action.label });
                  }}
                  className={cn(
                    action.variant === 'primary' && styles.titleClass,
                    action.variant === 'primary' && 'border-current'
                  )}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
