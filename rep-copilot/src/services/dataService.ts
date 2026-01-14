/**
 * Main Data Service
 *
 * Unified interface for all data operations in Rep Co-Pilot.
 * Orchestrates calls to Reporting, CRM, and Compliance services.
 *
 * This is the primary entry point for data access throughout the application.
 * It provides a clean abstraction layer that makes it easy to swap mock data
 * for live API connections later.
 *
 * @module services/dataService
 */

import { ReportingService } from "./reportingService";
import { CRMService } from "./crmService";
import { ComplianceService } from "./complianceService";
import type {
  EnrichedContext,
  ApiResponse,
  ServiceConfig,
  ComplianceCheck,
  SalesSummary,
  AccountPriority,
  ActivityRecord,
  Opportunity,
  CompliancePolicy,
  PolicyUpdate,
} from "./types";

/**
 * Simple request-scoped cache for deduplication
 * Cache is cleared on each new DataService instance (per-request pattern)
 */
class RequestCache {
  private cache = new Map<string, { data: unknown; timestamp: number }>();
  private readonly ttl: number;

  constructor(ttlMs: number = 5000) {
    this.ttl = ttlMs;
  }

  get(key: string): unknown | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check if entry has expired
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  set(key: string, data: unknown): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  clear(): void {
    this.cache.clear();
  }
}

/**
 * Main Data Service Class
 *
 * Provides unified access to all data sources
 */
export class DataService {
  private reportingService: ReportingService;
  private crmService: CRMService;
  private complianceService: ComplianceService;
  private config: ServiceConfig;
  private cache: RequestCache;

  constructor(config: Partial<ServiceConfig> = {}) {
    this.config = {
      useMockData: config.useMockData ?? true,
      cacheEnabled: config.cacheEnabled ?? true,
      cacheTtlMs: config.cacheTtlMs ?? 5 * 60 * 1000,
      retryAttempts: config.retryAttempts ?? 3,
      retryDelayMs: config.retryDelayMs ?? 1000,
    };

    // Initialize request-scoped cache
    this.cache = new RequestCache(this.config.cacheTtlMs);

    // Initialize specialized services
    this.reportingService = new ReportingService(this.config);
    this.crmService = new CRMService(this.config);
    this.complianceService = new ComplianceService(this.config);
  }

  /**
   * Get enriched context for AI prompts
   *
   * Combines data from multiple sources to provide rich context for the AI.
   * This is used to populate system prompts with relevant data.
   *
   * @param tabType - Current tab (reporting, crm, or compliance)
   * @returns Enriched context with relevant data from all sources
   */
  async getEnrichedContext(tabType: "reporting" | "crm" | "compliance"): Promise<EnrichedContext> {
    const startTime = Date.now();

    // Check cache first ✅
    const cacheKey = `enriched:${tabType}`;
    const cached = this.cache.get(cacheKey) as { data: EnrichedContext; timestamp: number } | undefined;
    if (cached && this.config.cacheEnabled) {
      console.log(`[DataService] Cache hit for ${cacheKey}`);
      return cached.data;
    }

    // Base context
    const context: EnrichedContext = {
      tabType,
      timestamp: new Date().toISOString(),
      dataSource: this.config.useMockData ? "mock" : "live",
    };

    // Add tab-specific data
    switch (tabType) {
      case "reporting":
        const salesResponse = await this.reportingService.getSalesSummary();
        if (salesResponse.success && salesResponse.data) {
          context.salesData = salesResponse.data;
        }
        break;

      case "crm":
        const [accountsResponse, activitiesResponse, opportunitiesResponse] =
          await Promise.all([
            this.crmService.getTopAccounts(10),
            this.crmService.getRecentActivities(20),
            this.crmService.getOpenOpportunities(),
          ]);

        context.accounts = {
          topPriorities: accountsResponse.success ? accountsResponse.data || [] : [],
          recentActivities: activitiesResponse.success ? activitiesResponse.data || [] : [],
          openOpportunities: opportunitiesResponse.success ? opportunitiesResponse.data || [] : [],
        };
        break;

      case "compliance":
        const [policiesResponse, updatesResponse] = await Promise.all([
          this.complianceService.getCompliancePolicies(),
          this.complianceService.getPolicyUpdates(),
        ]);

        context.compliance = {
          relevantPolicies: policiesResponse.success ? policiesResponse.data || [] : [],
          recentUpdates: updatesResponse.success ? updatesResponse.data || [] : [],
        };
        break;
    }

    console.log(`[DataService] Enriched context fetched in ${Date.now() - startTime}ms`);

    // Cache the result ✅
    if (this.config.cacheEnabled) {
      this.cache.set(cacheKey, context);
    }

    return context;
  }

  /**
   * Format context as AI system prompt
   *
   * Converts enriched context into a format suitable for AI system prompts.
   * This provides the AI with relevant, up-to-date data to inform responses.
   *
   * @param context - Enriched context object
   * @returns Formatted string for system prompt
   */
  formatContextForAI(context: EnrichedContext): string {
    let formatted = "";

    switch (context.tabType) {
      case "reporting":
        if (context.salesData) {
          const sales = context.salesData;
          formatted = `
Current Sales Context (${sales.quarter} ${sales.year}):
- Total Revenue: $${(sales.totalRevenue / 1000000).toFixed(2)}M (${sales.growth > 0 ? "+" : ""}${sales.growth}% vs. prior quarter)
- Target Attainment: ${sales.targetAttainment}%
- Regional Performance:
${sales.regionalData
  .map(
    (r) =>
      `  • ${r.region}: $${(r.revenue / 1000).toFixed(0)}K (${r.growth > 0 ? "+" : ""}${r.growth}%)`
  )
  .join("\n")}
- Top Products by Prescriptions:
${sales.topProducts.map((p, i) => `  ${i + 1}. ${p.product}: ${p.prescriptions.toLocaleString()} Rx`).join("\n")}
- Monthly Trend: ${sales.monthlyTrends[sales.monthlyTrends.length - 1]?.growth > 0 ? "+" : ""}${
            sales.monthlyTrends[sales.monthlyTrends.length - 1]?.growth || 0
          }% vs. previous month
`;
        }
        break;

      case "crm":
        if (context.accounts) {
          const { topPriorities, recentActivities, openOpportunities } = context.accounts;
          formatted = `
Current CRM Context:
- Top Priority Accounts:
${topPriorities.slice(0, 5).map((ap, i) => `  ${i + 1}. ${ap.hcp.name} (${ap.hcp.specialty}) - $${ap.opportunityValue.toLocaleString()} - Score: ${ap.score}`).join("\n")}
- Recent Activities: ${recentActivities.length} interactions in the last 30 days
- Open Opportunities: ${openOpportunities.length} active deals totaling $${openOpportunities.reduce((sum, o) => sum + o.value, 0).toLocaleString()}
- High-Value Opportunities:
${openOpportunities
  .filter((o) => o.priority === "High")
  .slice(0, 3)
  .map((o) => `  • ${o.hcpName}: $${o.value.toLocaleString()} (${o.stage})`)
  .join("\n")}
`;
        }
        break;

      case "compliance":
        if (context.compliance) {
          const { relevantPolicies, recentUpdates } = context.compliance;
          formatted = `
Current Compliance Context:
- Active Policies: ${relevantPolicies.length} guidelines available
- Key Policy Areas: ${relevantPolicies.map((p) => p.category).join(", ")}
- Recent Updates: ${recentUpdates.length} policy changes
- Latest Update: ${recentUpdates[0]?.title || "None"}
${recentUpdates[0]?.actionRequired ? "⚠️ Action Required: Review recent policy updates" : ""}
`;
        }
        break;
    }

    return formatted.trim();
  }

  // ============ REPORTING METHODS ============

  /**
   * Get sales summary
   */
  async getSalesSummary(quarter?: string, year?: number): Promise<ApiResponse<SalesSummary>> {
    return this.reportingService.getSalesSummary(quarter, year);
  }

  /**
   * Get regional sales
   */
  async getRegionalSales(regions?: string[]): Promise<ApiResponse<any>> {
    return this.reportingService.getRegionalSales(regions);
  }

  /**
   * Get top products
   */
  async getTopProducts(limit?: number): Promise<ApiResponse<any>> {
    return this.reportingService.getTopProducts(limit);
  }

  /**
   * Get monthly trends
   */
  async getMonthlyTrends(months?: number): Promise<ApiResponse<any>> {
    return this.reportingService.getMonthlyTrends(months);
  }

  /**
   * Generate comparison report
   */
  async generateComparisonReport(period1: string, period2: string): Promise<ApiResponse<any>> {
    return this.reportingService.generateComparisonReport(period1, period2);
  }

  /**
   * Get below-target areas
   */
  async getBelowTargetAreas(): Promise<ApiResponse<any>> {
    return this.reportingService.getBelowTargetAreas();
  }

  // ============ CRM METHODS ============

  /**
   * Get top accounts
   */
  async getTopAccounts(limit?: number): Promise<ApiResponse<AccountPriority[]>> {
    return this.crmService.getTopAccounts(limit);
  }

  /**
   * Get healthcare provider
   */
  async getHealthcareProvider(hcpId: string): Promise<ApiResponse<any>> {
    return this.crmService.getHealthcareProvider(hcpId);
  }

  /**
   * Get activity history
   */
  async getActivityHistory(hcpId: string, limit?: number): Promise<ApiResponse<ActivityRecord[]>> {
    return this.crmService.getActivityHistory(hcpId, limit);
  }

  /**
   * Get recent activities
   */
  async getRecentActivities(limit?: number): Promise<ApiResponse<ActivityRecord[]>> {
    return this.crmService.getRecentActivities(limit);
  }

  /**
   * Get open opportunities
   */
  async getOpenOpportunities(stage?: string, hcpId?: string): Promise<ApiResponse<Opportunity[]>> {
    return this.crmService.getOpenOpportunities(stage, hcpId);
  }

  /**
   * Search healthcare providers
   */
  async searchHealthcareProviders(query: string, filters?: any): Promise<ApiResponse<any>> {
    return this.crmService.searchHealthcareProviders(query, filters);
  }

  /**
   * Get HCP contacts by region
   */
  async getHCPContactsByRegion(region: string, specialty?: string): Promise<ApiResponse<any>> {
    return this.crmService.getHCPContactsByRegion(region, specialty);
  }

  /**
   * Schedule follow-up
   */
  async scheduleFollowUp(
    hcpId: string,
    scheduledDate: string,
    meetingType: string,
    agenda: string[]
  ): Promise<ApiResponse<any>> {
    return this.crmService.scheduleFollowUp(hcpId, scheduledDate, meetingType, agenda);
  }

  // ============ COMPLIANCE METHODS ============

  /**
   * Get compliance policies
   */
  async getCompliancePolicies(category?: string): Promise<ApiResponse<CompliancePolicy[]>> {
    return this.complianceService.getCompliancePolicies(category);
  }

  /**
   * Get policy by category
   */
  async getPolicyByCategory(category: string): Promise<ApiResponse<CompliancePolicy | null>> {
    return this.complianceService.getPolicyByCategory(category);
  }

  /**
   * Check meal spend
   */
  async checkMealSpend(amount: number, hcpCount?: number, location?: string): Promise<ApiResponse<any>> {
    return this.complianceService.checkMealSpend(amount, hcpCount, location);
  }

  /**
   * Check off-label
   */
  async checkOffLabel(query: string): Promise<ComplianceCheck> {
    return this.complianceService.checkOffLabel(query);
  }

  /**
   * Get adverse event procedure
   */
  async getAdverseEventProcedure(): Promise<ApiResponse<any>> {
    return this.complianceService.getAdverseEventProcedure();
  }

  /**
   * Get speaker honorarium policy
   */
  async getSpeakerHonorariumPolicy(): Promise<ApiResponse<any>> {
    return this.complianceService.getSpeakerHonorariumPolicy();
  }

  /**
   * Get policy updates
   */
  async getPolicyUpdates(limit?: number): Promise<ApiResponse<PolicyUpdate[]>> {
    return this.complianceService.getPolicyUpdates(limit);
  }

  /**
   * Check compliance (general)
   */
  async checkCompliance(query: string): Promise<ComplianceCheck> {
    return this.complianceService.checkCompliance(query);
  }

  /**
   * Get MIR procedure
   */
  async getMIRProcedure(): Promise<ApiResponse<any>> {
    return this.complianceService.getMIRProcedure();
  }

  /**
   * Log compliance concern
   */
  async logComplianceConcern(concern: any): Promise<ApiResponse<any>> {
    return this.complianceService.logComplianceConcern(concern);
  }
}

/**
 * Singleton instance for easy importing
 */
let dataServiceInstance: DataService | null = null;

export function getDataService(config?: Partial<ServiceConfig>): DataService {
  if (!dataServiceInstance) {
    dataServiceInstance = new DataService(config);
  }
  return dataServiceInstance;
}

export default DataService;
