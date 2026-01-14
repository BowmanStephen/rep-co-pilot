/**
 * Widget Registry
 *
 * Like a Figma component library - registers all available widgets
 * and provides lookups by type. Singleton pattern ensures one source of truth.
 */

import { WidgetRegistration, WidgetRenderer } from './types';

class WidgetRegistryClass {
  private widgets: Map<string, WidgetRegistration> = new Map();

  /**
   * Register a new widget type
   * Like adding a component to your Figma library
   */
  register(registration: WidgetRegistration): void {
    if (this.widgets.has(registration.type)) {
      console.warn(`Widget type "${registration.type}" is already registered. Overwriting.`);
    }
    this.widgets.set(registration.type, registration);
  }

  /**
   * Register multiple widgets at once
   */
  registerAll(registrations: WidgetRegistration[]): void {
    registrations.forEach(reg => this.register(reg));
  }

  /**
   * Get a widget component by type
   */
  get(type: string): WidgetRenderer | undefined {
    const registration = this.widgets.get(type);
    return registration?.component;
  }

  /**
   * Check if a widget type exists
   */
  has(type: string): boolean {
    return this.widgets.has(type);
  }

  /**
   * Get all registered widget types
   */
  getTypes(): string[] {
    return Array.from(this.widgets.keys());
  }

  /**
   * Get widget metadata (expandable, defaultExpanded, etc.)
   */
  getMetadata(type: string): Omit<WidgetRegistration, 'component'> | undefined {
    const registration = this.widgets.get(type);
    if (!registration) return undefined;

    const { component, ...metadata } = registration;
    return metadata;
  }

  /**
   * Unregister a widget type
   */
  unregister(type: string): boolean {
    return this.widgets.delete(type);
  }

  /**
   * Clear all registered widgets
   */
  clear(): void {
    this.widgets.clear();
  }
}

// Export singleton instance
export const WidgetRegistry = new WidgetRegistryClass();
