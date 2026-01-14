/**
 * Services Module - Exports
 *
 * Central export point for all service modules.
 * Use this file to import services throughout the application.
 *
 * @example
 * ```typescript
 * import { getDataService } from '@/services';
 * import { ReportingService, CRMService, ComplianceService } from '@/services';
 * import type { SalesSummary, HealthcareProvider } from '@/services';
 * ```
 */

// Main data service (unified interface)
export { getDataService } from "./dataService";

// Specialized services
export { ReportingService } from "./reportingService";
export { CRMService } from "./crmService";
export { ComplianceService } from "./complianceService";
export { MockDataService } from "./mockDataService";

// Type definitions
export type {
  // Core types
  Region,
  ProductName,
  Specialty,
  OpportunityStage,
  PolicyCategory,
  ComplianceLevel,

  // Reporting types
  RegionalSales,
  ProductMetrics,
  MonthlyTrend,
  SalesSummary,

  // CRM types
  HealthcareProvider,
  ActivityRecord,
  Opportunity,
  AccountPriority,

  // Compliance types
  PolicyLimit,
  CompliancePolicy,
  ComplianceCheck,
  PolicyUpdate,

  // Context types
  EnrichedContext,
  ApiResponse,
  ServiceConfig,
} from "./types";

// Re-export default config
export { DEFAULT_SERVICE_CONFIG } from "./types";

/**
 * Quick access to singleton instance
 *
 * @example
 * ```typescript
 * import { dataService } from '@/services';
 *
 * const sales = await dataService.getSalesSummary();
 * ```
 */
export { default as DataService } from "./dataService";
