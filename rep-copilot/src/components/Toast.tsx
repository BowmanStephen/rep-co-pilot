'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: number;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onDismiss: (id: number) => void;
}

const iconMap = {
  success: <CheckCircle className="h-5 w-5 text-green-600" />,
  error: <XCircle className="h-5 w-5 text-destructive" />,
  warning: <AlertCircle className="h-5 w-5 text-gold" />,
  info: <Info className="h-5 w-5 text-primary" />,
};

const bgMap = {
  success: 'bg-green-50 border-green-200',
  error: 'bg-red-50 border-red-200',
  warning: 'bg-gold/20 border-gold/40',
  info: 'bg-primary/5 border-primary/20',
};

function ToastComponent({ toast, onDismiss }: ToastProps) {
  const { id, type, title, message, duration = 4000 } = toast;

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`
        relative overflow-hidden rounded-lg border shadow-lg
        ${bgMap[type]}
        p-4 min-w-[320px] max-w-md
      `}
    >
      {/* Progress bar */}
      <motion.div
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: duration / 1000, ease: 'linear' }}
        className={`absolute top-0 left-0 h-1 ${
          type === 'success' ? 'bg-green-400' :
          type === 'error' ? 'bg-red-400' :
          type === 'warning' ? 'bg-gold' :
          'bg-primary'
        }`}
      />

      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 mt-0.5">
          {iconMap[type]}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-foreground">{title}</h4>
          {message && (
            <p className="text-sm text-muted-foreground mt-0.5">{message}</p>
          )}
        </div>

        {/* Dismiss button */}
        <button
          onClick={() => onDismiss(id)}
          className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded hover:bg-black/5"
          aria-label="Dismiss notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: number) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastComponent toast={toast} onDismiss={onDismiss} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Hook for managing toasts
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [nextId, setNextId] = useState(1);

  const show = (
    type: ToastType,
    title: string,
    message?: string,
    duration?: number
  ) => {
    const id = nextId;
    setNextId(prev => prev + 1);

    const newToast: Toast = { id, type, title, message, duration };
    setToasts(prev => [...prev, newToast]);

    return id;
  };

  const dismiss = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Convenience methods
  const success = (title: string, message?: string) => show('success', title, message);
  const error = (title: string, message?: string) => show('error', title, message);
  const warning = (title: string, message?: string) => show('warning', title, message);
  const info = (title: string, message?: string) => show('info', title, message);

  return {
    toasts,
    show,
    dismiss,
    success,
    error,
    warning,
    info,
  };
}
