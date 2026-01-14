/**
 * Type definitions for Rep Co-Pilot data models
 *
 * These interfaces represent the core data structures used throughout the application.
 * They align with the PRD requirements and are designed to integrate with:
 * - Snowflake (sales analytics)
 * - Veeva CRM (account management)
 * - Compliance Policy DB (policy data)
 */

/**
 * Geographic regions for sales reporting
 */
export type Region = "North" | "East" | "South" | "West";

/**
 * Product names in the AstraZeneca portfolio
 */
export type ProductName =
  | "Tagrisso"
  | "Lynparza"
  | "Imfinzi"
  | "Calquence"
  | "Farxiga"
  | "Symbicort"
  | "Fasenra"
  | "Forxiga";

/**
 * Medical specialties for healthcare providers
 */
export type Specialty =
  | "Oncology"
  | "Cardiology"
  | "Pulmonology"
  | "Endocrinology"
  | "Neurology"
  | "Rheumatology"
  | "Gastroenterology"
  | "Primary Care";

/**
 * Opportunity stages in the sales pipeline
 */
export type OpportunityStage =
  | "Discovery"
  | "Proposal"
  | "Negotiation"
  | "Closed Won"
  | "Closed Lost";

/**
 * Compliance policy categories
 */
export type PolicyCategory =
  | "Meal Spend"
  | "Speaker Programs"
  | "Off-Label"
  | "Adverse Events"
  | "Medical Information"
  | "Sample Distribution"
  | "Gifts & Honorariums";

/**
 * Compliance severity levels
 */
export type ComplianceLevel = "warning" | "stop" | "info";

/**
 * Regional sales performance data
 */
export interface RegionalSales {
  region: Region;
  revenue: number; // in dollars
  growth: number; // percentage change
  target: number; // target revenue
  prescriptions: number; // total Rx count
  marketShare: number; // percentage
}

/**
 * Product performance metrics
 */
export interface ProductMetrics {
  product: ProductName;
  prescriptions: number; // total Rx volume
  revenue: number; // in dollars
  growth: number; // percentage change
  rank: number; // ranking in territory (1-5)
  therapeuticArea: string; // e.g., "Oncology", "Cardiovascular"
}

/**
 * Monthly sales trend data point
 */
export interface MonthlyTrend {
  month: string; // "Jan", "Feb", etc.
  year: number;
  revenue: number;
  prescriptions: number;
  growth: number; // vs. previous month
}

/**
 * Sales performance summary
 */
export interface SalesSummary {
  quarter: string;
  year: number;
  totalRevenue: number;
  targetAttainment: number; // percentage
  growth: number; // vs. previous quarter
  regionalData: RegionalSales[];
  topProducts: ProductMetrics[];
  monthlyTrends: MonthlyTrend[];
}

/**
 * Healthcare Provider (HCP) account
 */
export interface HealthcareProvider {
  id: string;
  name: string;
  specialty: Specialty;
  organization: string;
  city: string;
  state: string;
  priorityScore: number; // 1-100
  totalOpportunity: number; // in dollars
  lastVisitDate: string; // ISO date string
  nextVisitScheduled: string | null; // ISO date or null
  npiNumber: string; // National Provider Identifier
  contactInfo: {
    phone: string;
    email: string;
    address: string;
  };
}

/**
 * Account activity record
 */
export interface ActivityRecord {
  id: string;
  hcpId: string;
  hcpName: string;
  date: string; // ISO date string
  type: "Office Visit" | "Sample Drop-off" | "Lunch Meeting" | "Conference Call" | "Email";
  notes: string;
  outcome: string;
  followUpRequired: boolean;
  followUpDate: string | null;
}

/**
 * Sales opportunity
 */
export interface Opportunity {
  id: string;
  hcpId: string;
  hcpName: string;
  specialty: Specialty;
  stage: OpportunityStage;
  value: number; // in dollars
  probability: number; // percentage
  expectedCloseDate: string; // ISO date string
  products: ProductName[];
  lastActivity: string; // ISO date string
  nextAction: string;
  priority: "High" | "Medium" | "Low";
}

/**
 * Account priority ranking
 */
export interface AccountPriority {
  hcp: HealthcareProvider;
  score: number;
  ranking: number; // position in top 10
  reasons: string[]; // why this account is prioritized
  suggestedActions: string[];
  opportunityValue: number;
}

/**
 * Compliance policy limit
 */
export interface PolicyLimit {
  category: PolicyCategory;
  limitType: string; // e.g., "per HCP", "per engagement", "annual"
  amount: number; // dollar amount or count
  description: string;
  requirements: string[];
  approvalNeeded: boolean;
  referenceUrl: string;
  lastUpdated: string; // ISO date string
}

/**
 * Compliance policy
 */
export interface CompliancePolicy {
  id: string;
  category: PolicyCategory;
  title: string;
  description: string;
  level: ComplianceLevel;
  limits: PolicyLimit[];
  keyPoints: string[];
  prohibitedActions: string[];
  requiredActions: string[];
  reportingRequirements: string[];
  version: string;
  effectiveDate: string;
  lastUpdated: string;
}

/**
 * Compliance check result
 */
export interface ComplianceCheck {
  isCompliant: boolean;
  level: ComplianceLevel;
  category: PolicyCategory | null;
  violations: string[];
  warnings: string[];
  suggestedAlternatives: string[];
  policyReferences: string[];
  requiresApproval: boolean;
  approvalWorkflow: string | null;
}

/**
 * Policy update notification
 */
export interface PolicyUpdate {
  id: string;
  policyId: string;
  title: string;
  category: PolicyCategory;
  changeType: "New" | "Updated" | "Deprecated";
  summary: string;
  impact: string;
  effectiveDate: string;
  announcedDate: string;
  actionRequired: boolean;
  actions: string[];
}

/**
 * Enriched context for AI prompts
 * Combines data from multiple sources to provide rich context
 */
export interface EnrichedContext {
  tabType: "reporting" | "crm" | "compliance";
  salesData?: SalesSummary;
  accounts?: {
    topPriorities: AccountPriority[];
    recentActivities: ActivityRecord[];
    openOpportunities: Opportunity[];
  };
  compliance?: {
    relevantPolicies: CompliancePolicy[];
    recentUpdates: PolicyUpdate[];
  };
  timestamp: string;
  dataSource: "mock" | "live";
}

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
  metadata: {
    timestamp: string;
    dataSource: "mock" | "live";
    cacheHit: boolean;
    processingTimeMs: number;
  };
}

/**
 * Service configuration options
 */
export interface ServiceConfig {
  useMockData: boolean;
  cacheEnabled: boolean;
  cacheTtlMs: number;
  retryAttempts: number;
  retryDelayMs: number;
}

/**
 * Default service configuration
 */
export const DEFAULT_SERVICE_CONFIG: ServiceConfig = {
  useMockData: true,
  cacheEnabled: true,
  cacheTtlMs: 5 * 60 * 1000, // 5 minutes
  retryAttempts: 3,
  retryDelayMs: 1000,
};
