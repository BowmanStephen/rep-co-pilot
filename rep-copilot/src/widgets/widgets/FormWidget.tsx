/**
 * Form Widget
 *
 * Interactive forms for call logging, meeting scheduling, etc.
 * Like a form component in Figma - structured input with validation.
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { WidgetProps } from '../types';

type FormWidgetConfig = WidgetProps<{
  type: 'form';
  data: {
    fields: Array<{
      name: string;
      label: string;
      type: 'text' | 'textarea' | 'select' | 'date' | 'number';
      placeholder?: string;
      required?: boolean;
      options?: { value: string; label: string }[];
      defaultValue?: string | number;
    }>;
    submitLabel?: string;
    cancelLabel?: string;
  };
}>;

export default function FormWidget({ config, onAction }: FormWidgetConfig) {
  const { fields, submitLabel = 'Submit', cancelLabel = 'Cancel' } = config.data;
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    const initialData: Record<string, any> = {};
    fields.forEach(field => {
      if (field.defaultValue !== undefined) {
        initialData[field.name] = field.defaultValue;
      }
    });
    return initialData;
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    const requiredFields = fields.filter(f => f.required);
    const missingFields = requiredFields.filter(f => !formData[f.name]);

    if (missingFields.length > 0) {
      onAction?.('validation-error', {
        message: `Please fill in all required fields`,
        fields: missingFields.map(f => f.name)
      });
      return;
    }

    setIsSubmitting(true);
    onAction?.('submit', formData);
    setIsSubmitting(false);
  };

  const handleCancel = () => {
    onAction?.('cancel');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.name} className="space-y-2">
          <Label htmlFor={field.name} className={cn(field.required && 'text-foreground')}>
            {field.label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </Label>

          {field.type === 'textarea' ? (
            <Textarea
              id={field.name}
              placeholder={field.placeholder}
              value={formData[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              required={field.required}
              className="resize-none"
              rows={3}
            />
          ) : field.type === 'select' ? (
            <select
              id={field.name}
              value={formData[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              required={field.required}
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select an option</option>
              {field.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : field.type === 'date' ? (
            <Input
              id={field.name}
              type="date"
              value={formData[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              required={field.required}
            />
          ) : field.type === 'number' ? (
            <Input
              id={field.name}
              type="number"
              placeholder={field.placeholder}
              value={formData[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              required={field.required}
            />
          ) : (
            <Input
              id={field.name}
              type="text"
              placeholder={field.placeholder}
              value={formData[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              required={field.required}
            />
          )}
        </div>
      ))}

      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? 'Submitting...' : submitLabel}
        </Button>
        {cancelLabel && (
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="flex-1"
          >
            {cancelLabel}
          </Button>
        )}
      </div>
    </form>
  );
}
