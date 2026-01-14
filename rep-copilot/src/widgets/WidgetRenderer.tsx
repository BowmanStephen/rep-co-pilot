/**
 * Widget Renderer Component
 *
 * Like an Auto Layout frame in Figma - takes a widget config
 * and renders the appropriate component with proper layout and animations.
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WidgetConfig } from './types';
import { WidgetRegistry } from './WidgetRegistry';
import { useState, useEffect } from 'react';

interface WidgetRendererProps {
  config: WidgetConfig;
  onAction?: (action: string, data?: any) => void;
  className?: string;
}

export function WidgetRenderer({ config, onAction, className }: WidgetRendererProps) {
  const [isExpanded, setIsExpanded] = useState(config.expanded ?? false);
  const [isVisible, setIsVisible] = useState(false);

  const WidgetComponent = WidgetRegistry.get(config.type);
  const metadata = WidgetRegistry.getMetadata(config.type);

  // Fade in animation on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (!WidgetComponent) {
    console.warn(`Widget type "${config.type}" not found in registry`);
    return null;
  }

  const isExpandable = metadata?.expandable ?? config.expandable ?? false;
  const defaultExpanded = metadata?.defaultExpanded ?? false;

  // Handle expand/collapse
  const handleToggleExpand = () => {
    if (isExpandable) {
      const newState = !isExpanded;
      setIsExpanded(newState);
      onAction?.('toggle-expand', { widgetId: config.id, expanded: newState });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: isVisible ? 1 : 0, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'rounded-lg border border-border/60 bg-card shadow-sm overflow-hidden',
        className
      )}
    >
      {/* Widget Header - Always visible */}
      {(config.title || isExpandable) && (
        <motion.div
          className={cn(
            'flex items-center justify-between px-4 py-3 bg-muted/30',
            isExpandable && 'cursor-pointer hover:bg-muted/50 transition-colors'
          )}
          onClick={handleToggleExpand}
          whileHover={isExpandable ? { x: 2 } : {}}
        >
          {config.title && (
            <h3 className="text-sm font-semibold text-foreground">{config.title}</h3>
          )}
          {isExpandable && (
            <motion.button
              className="text-muted-foreground hover:text-foreground transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </motion.button>
          )}
        </motion.div>
      )}

      {/* Widget Content - Expandable */}
      <AnimatePresence>
        {(!isExpandable || isExpanded || defaultExpanded) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4">
              <WidgetComponent
                config={config}
                onAction={onAction}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * WidgetContainer - Renders multiple widgets in a stream
 * Like a vertical auto-layout with spacing between components
 */
interface WidgetContainerProps {
  widgets: WidgetConfig[];
  onAction?: (action: string, data?: any) => void;
  className?: string;
}

export function WidgetContainer({ widgets, onAction, className }: WidgetContainerProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {widgets.map((widget, index) => (
        <motion.div
          key={widget.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
        >
          <WidgetRenderer
            config={widget}
            onAction={onAction}
          />
        </motion.div>
      ))}
    </div>
  );
}
