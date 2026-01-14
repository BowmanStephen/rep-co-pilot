/**
 * Chart Widget
 *
 * Visualizes data as progress bars, bar charts, or simple metrics.
 * Like a chart component in Figma - data-driven visualization with animations.
 */

'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WidgetProps } from '../types';

type ChartWidgetConfig = WidgetProps<{
  type: 'chart';
  data: {
    chartType: 'bar' | 'line' | 'pie' | 'progress';
    data: Array<{
      label: string;
      value: number;
      percentage?: number;
      trend?: string;
      color?: string;
    }>;
    xAxisLabel?: string;
    yAxisLabel?: string;
    showLegend?: boolean;
    showTrend?: boolean;
  };
}>;

function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`;
  }
  return `$${(value / 1000).toFixed(0)}K`;
}

export default function ChartWidget({ config, onAction }: ChartWidgetConfig) {
  const { chartType, data, showTrend = true } = config.data;

  // Progress Bar Chart (like the current Q3 Sales visualization)
  if (chartType === 'progress' || chartType === 'bar') {
    return (
      <div className="space-y-3">
        {data.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-3"
          >
            <span className="w-16 text-sm font-medium text-foreground truncate">
              {item.label}
            </span>
            <div className="flex-1 h-6 bg-secondary rounded overflow-hidden">
              <motion.div
                className={cn(
                  'h-full rounded',
                  item.color || 'bg-gradient-to-r from-primary to-magenta'
                )}
                initial={{ width: 0 }}
                animate={{ width: `${item.percentage || 0}%` }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.8, ease: 'easeOut' }}
              />
            </div>
            <span className="w-20 text-right text-sm font-semibold text-foreground">
              {formatCurrency(item.value)}
            </span>
            {showTrend && item.trend && (
              <span
                className={cn(
                  'flex items-center gap-1 w-16 text-right text-xs font-medium',
                  item.trend.startsWith('+') && 'text-green-600',
                  item.trend.startsWith('-') && 'text-destructive',
                  !item.trend.startsWith('+') && !item.trend.startsWith('-') && 'text-muted-foreground'
                )}
              >
                {item.trend.startsWith('+') && <TrendingUp className="h-3 w-3" />}
                {item.trend.startsWith('-') && <TrendingDown className="h-3 w-3" />}
                {!item.trend.startsWith('+') && !item.trend.startsWith('-') && <Minus className="h-3 w-3" />}
                {item.trend}
              </span>
            )}
          </motion.div>
        ))}
      </div>
    );
  }

  // Simple Metric Display (for single data points)
  if (data.length === 1) {
    const item = data[0];
    return (
      <div className="text-center py-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="text-4xl font-bold text-primary mb-2"
        >
          {formatCurrency(item.value)}
        </motion.div>
        <p className="text-sm text-muted-foreground">{item.label}</p>
        {showTrend && item.trend && (
          <div
            className={cn(
              'inline-flex items-center gap-1 mt-2 text-sm font-medium',
              item.trend.startsWith('+') && 'text-green-600',
              item.trend.startsWith('-') && 'text-destructive'
            )}
          >
            {item.trend.startsWith('+') && <TrendingUp className="h-4 w-4" />}
            {item.trend.startsWith('-') && <TrendingDown className="h-4 w-4" />}
            {item.trend} vs last period
          </div>
        )}
      </div>
    );
  }

  // Fallback: Simple list view
  return (
    <div className="space-y-2">
      {data.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
        >
          <span className="text-sm font-medium text-foreground">{item.label}</span>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-foreground">
              {formatCurrency(item.value)}
            </span>
            {showTrend && item.trend && (
              <span
                className={cn(
                  'text-xs font-medium',
                  item.trend.startsWith('+') && 'text-green-600',
                  item.trend.startsWith('-') && 'text-destructive'
                )}
              >
                {item.trend}
              </span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
