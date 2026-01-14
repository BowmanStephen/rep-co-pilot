/**
 * Compliance Service
 *
 * Handles compliance policies, spending limits, and regulatory guidelines.
 * Will connect to Compliance Policy Database in production.
 *
 * Data Sources (Future):
 * - Compliance Policy DB: Policy documents, limits, requirements
 * - Learning Management: Training records, certifications
 * - Reporting Systems: Adverse event reports, MIR submissions
 *
 * @module services/complianceService
 */

import { MockDataService } from "./mockDataService";
import type {
  CompliancePolicy,
  PolicyLimit,
  PolicyUpdate,
  ComplianceCheck,
  ApiResponse,
  ServiceConfig,
} from "./types";

/**
 * Compliance Service Class
 *
 * Provides compliance checking and policy information
 */
export class ComplianceService {
  private config: ServiceConfig;

  constructor(config: Partial<ServiceConfig> = {}) {
    this.config = {
      useMockData: config.useMockData ?? true,
      cacheEnabled: config.cacheEnabled ?? true,
      cacheTtlMs: config.cacheTtlMs ?? 5 * 60 * 1000,
      retryAttempts: config.retryAttempts ?? 3,
      retryDelayMs: config.retryDelayMs ?? 1000,
    };
  }

  /**
   * Get all compliance policies
   *
   * @param category - Optional category filter
   * @returns Compliance policies with limits and requirements
   */
  async getCompliancePolicies(
    category?: string
  ): Promise<ApiResponse<CompliancePolicy[]>> {
    try {
      const startTime = Date.now();

      // TODO: In production, fetch from Compliance Policy DB
      // const data = await this.fetchFromPolicyDB(`/policies`, { category });

      let data = await MockDataService.getCompliancePolicies();

      // Apply category filter if provided
      if (category) {
        data = data.filter((policy) => policy.category === category);
      }

      return this.createSuccessResponse(data, startTime);
    } catch (error) {
      return this.createErrorResponse(error);
    }
  }

  /**
   * Get policy by category
   *
   * @param category - Policy category (e.g., "Meal Spend", "Off-Label")
   * @returns Complete policy with limits and requirements
   */
  async getPolicyByCategory(
    category: string
  ): Promise<ApiResponse<CompliancePolicy | null>> {
    try {
      const startTime = Date.now();

      // TODO: In production, fetch from Compliance Policy DB
      // const data = await this.fetchFromPolicyDB(`/policies/category/${category}`);

      const data = await MockDataService.getPolicyByCategory(category);

      return this.createSuccessResponse(data, startTime);
    } catch (error) {
      return this.createErrorResponse(error);
    }
  }

  /**
   * Check meal spend limit
   *
   * @param amount - Proposed spend amount
   * @param hcpCount - Number of HCPs attending
   * @param location - Location/venue type
   * @returns Compliance check result with warnings if exceeding limits
   */
  async checkMealSpend(
    amount: number,
    hcpCount: number = 1,
    location?: string
  ): Promise<
    ApiResponse<{
      withinLimit: boolean;
      perHcpAmount: number;
      limitPerHcp: number;
      totalSpend: number;
      warnings: string[];
      recommendations: string[];
    }>
  > {
    try {
      const startTime = Date.now();

      // Get current meal spend policy
      const policyResponse = await this.getPolicyByCategory("Meal Spend");
      if (!policyResponse.data) {
        throw new Error("Meal Spend policy not found");
      }

      const policy = policyResponse.data;
      const limitPerHcp = policy.limits[0].amount;
      const perHcpAmount = amount / hcpCount;
      const totalSpend = amount;
      const withinLimit = perHcpAmount <= limitPerHcp;

      const warnings: string[] = [];
      const recommendations: string[] = [];

      if (!withinLimit) {
        const overage = perHcpAmount - limitPerHcp;
        warnings.push(
          `Proposed spend exceeds the $${limitPerHcp} per HCP limit by $${overage.toFixed(2)}`
        );
        warnings.push("This would trigger a compliance audit");

        recommendations.push("Consider a less expensive venue");
        recommendations.push("Reduce the number of attendees if possible");
        recommendations.push("Review the policy at: " + policy.limits[0].referenceUrl);
      }

      // Check for high-end venues
      const expensiveVenues = [
        "capital grille",
        "ruth's chris",
        "morton's",
        "del frisco's",
        "prime 112",
      ];
      if (
        location &&
        expensiveVenues.some((venue) => location.toLowerCase().includes(venue))
      ) {
        warnings.push("High-end venue may exceed per-HCP limit even with modest orders");
        recommendations.push("Verify total cost per person will be under $125");
      }

      return this.createSuccessResponse(
        {
          withinLimit,
          perHcpAmount,
          limitPerHcp,
          totalSpend,
          warnings,
          recommendations,
        },
        startTime
      );
    } catch (error) {
      return this.createErrorResponse(error);
    }
  }

  /**
   * Check for off-label discussion triggers
   *
   * @param query - Text to analyze
   * @returns Compliance check result with stop-level warnings if off-label detected
   */
  async checkOffLabel(query: string): Promise<ComplianceCheck> {
    // This uses the general compliance check
    return this.checkCompliance(query);
  }

  /**
   * Get adverse event reporting procedure
   *
   * @returns Complete AE reporting procedure with contact info
   */
  async getAdverseEventProcedure(): Promise<
    ApiResponse<{
      policy: CompliancePolicy;
      reportingHotline: string;
      timeframe: string;
      requiredInformation: string[];
      steps: string[];
      doNotDo: string[];
    }>
  > {
    try {
      const startTime = Date.now();

      const policyResponse = await this.getPolicyByCategory("Adverse Events");
      if (!policyResponse.data) {
        throw new Error("Adverse Event policy not found");
      }

      const data = {
        policy: policyResponse.data,
        reportingHotline: "1-800-AZ-SAFE (Pharmacovigilance & Safety)",
        timeframe: "Within 24 hours of becoming aware of the event",
        requiredInformation: [
          "Patient initials (or code)",
          "Age and gender",
          "Description of adverse event",
          "Product name and dose",
          "Indication for use",
          "Reporter contact information",
        ],
        steps: [
          "Call 1-800-AZ-SAFE immediately",
          "Do NOT attempt to determine if the product caused the event",
          "Provide all known information to PVCS",
          "Document the reference number provided",
          "Follow up with any additional information as it becomes available",
          "Record the report in your CRM system",
        ],
        doNotDo: [
          "Do not delay reporting",
          "Do not filter out what seems minor",
          "Do not attempt to assess causality yourself",
          "Do not provide medical advice to the patient",
          "Do not promise compensation or admit fault",
        ],
      };

      return this.createSuccessResponse(data, startTime);
    } catch (error) {
      return this.createErrorResponse(error);
    }
  }

  /**
   * Get speaker honorarium policy
   *
   * @returns Speaker program policy with approval requirements
   */
  async getSpeakerHonorariumPolicy(): Promise<
    ApiResponse<{
      policy: CompliancePolicy;
      standardHonorarium: number;
      approvalRequired: boolean;
      approvalProcess: string[];
      requirements: string[];
      prohibitedActions: string[];
    }>
  > {
    try {
      const startTime = Date.now();

      const policyResponse = await this.getPolicyByCategory("Speaker Programs");
      if (!policyResponse.data) {
        throw new Error("Speaker Programs policy not found");
      }

      const policy = policyResponse.data;

      const data = {
        policy,
        standardHonorarium: policy.limits[0].amount,
        approvalRequired: policy.limits[0].approvalNeeded,
        approvalProcess: [
          "Submit CAP (Compliance Approval Process) request",
          "Include speaker CV and expertise justification",
          "Provide event agenda and learning objectives",
          "Complete Fair Market Value assessment",
          "Wait for approval before confirming with speaker",
          "Execute speaker agreement",
        ],
        requirements: [
          "Speaker must have clinical expertise in the topic",
          "Content must be educational, not promotional",
          "Event must be documented with attendance sign-in",
          "Speaker evaluation form required",
          "Fair Market Value documentation required",
        ],
        prohibitedActions: [
          "Paying without CAP approval",
          "Exceeding Fair Market Value",
          "Payments to non-clinical speakers for clinical topics",
          "Honorariums for promotional-only events",
        ],
      };

      return this.createSuccessResponse(data, startTime);
    } catch (error) {
      return this.createErrorResponse(error);
    }
  }

  /**
   * Get recent policy updates
   *
   * @param limit - Number of updates to return
   * @returns Recent policy changes requiring attention
   */
  async getPolicyUpdates(limit: number = 10): Promise<ApiResponse<PolicyUpdate[]>> {
    try {
      const startTime = Date.now();

      // TODO: In production, fetch from Compliance Policy DB
      // const data = await this.fetchFromPolicyDB(`/updates`, { limit });

      const data = (await MockDataService.getPolicyUpdates()).slice(0, limit);

      return this.createSuccessResponse(data, startTime);
    } catch (error) {
      return this.createErrorResponse(error);
    }
  }

  /**
   * Perform comprehensive compliance check on a query
   *
   * @param query - Text to analyze for compliance concerns
   * @returns Detailed compliance check with violations, warnings, and recommendations
   */
  async checkCompliance(query: string): Promise<ComplianceCheck> {
    try {
      // TODO: In production, use NLP service for more sophisticated analysis
      // const result = await this.fetchFromNLPService('/compliance/analyze', { query });

      const result = await MockDataService.checkCompliance(query);

      return result;
    } catch (error) {
      return {
        isCompliant: false,
        level: "warning",
        category: null,
        violations: [],
        warnings: ["Unable to perform compliance check"],
        suggestedAlternatives: ["Please try again or contact compliance team"],
        policyReferences: [],
        requiresApproval: false,
        approvalWorkflow: null,
      };
    }
  }

  /**
   * Get unsolicited medical request (MIR) procedure
   *
   * @returns MIR process steps and requirements
   */
  async getMIRProcedure(): Promise<
    ApiResponse<{
      description: string;
      whenToUse: string[];
      steps: string[];
      doNotDo: string[];
      expectedResponseTime: string;
    }>
  > {
    try {
      const startTime = Date.now();

      const data = {
        description:
          "Unsolicited Medical Information Request (MIR) process for handling HCP inquiries about off-label uses or unpublished clinical data",
        whenToUse: [
          "HCP asks about off-label indications",
          "Request for unpublished clinical trial data",
          "Questions about comparator studies",
          "Mechanism of action inquiries beyond approved labeling",
          "Requests for medical vs. promotional information",
        ],
        steps: [
          "Confirm the request is truly unsolicited (not prompted by field rep)",
          "Do NOT provide any medical information yourself",
          "Log the request in the MIR system immediately",
          "Provide HCP with expected response timeframe (usually 3-5 business days)",
          "Medical Affairs will respond directly to the HCP",
          "Document the MIR reference number in your CRM",
          "Follow up to ensure HCP received Medical Affairs response",
        ],
        doNotDo: [
          "Do not attempt to answer off-label questions",
          "Do not provide clinical trial data yourself",
          "Do not interpret study results for the HCP",
          "Do not forward published materials without Medical Affairs review",
          "Do not promise that Medical Affairs will provide specific information",
        ],
        expectedResponseTime: "3-5 business days from MIR submission",
      };

      return this.createSuccessResponse(data, startTime);
    } catch (error) {
      return this.createErrorResponse(error);
    }
  }

  /**
   * Log a compliance concern for review
   *
   * @param concern - Details of the compliance concern
   * @returns Logged concern with tracking number
   */
  async logComplianceConcern(concern: {
    type: string;
    description: string;
    severity: "low" | "medium" | "high";
    relatedQuery?: string;
  }): Promise<
    ApiResponse<{
      id: string;
      submittedAt: string;
      status: string;
      expectedResponse: string;
    }>
  > {
    try {
      const startTime = Date.now();

      // TODO: In production, submit to compliance management system
      // const data = await this.fetchFromPolicyDB(`/concerns/log`, { concern });

      const data = {
        id: `CONCERN-${Date.now()}`,
        submittedAt: new Date().toISOString(),
        status: "Under Review",
        expectedResponse: "Compliance team will respond within 1-2 business days",
      };

      return this.createSuccessResponse(data, startTime);
    } catch (error) {
      return this.createErrorResponse(error);
    }
  }

  /**
   * Fetch data from Compliance Policy DB (TODO: Implementation)
   *
   * @param endpoint - API endpoint
   * @param params - Query parameters
   * @returns Promise with data from Policy DB
   */
  private async fetchFromPolicyDB(
    endpoint: string,
    params?: Record<string, any>
  ): Promise<any> {
    // TODO: Implement Compliance Policy DB connection
    // This will use a REST API or direct database connection
    throw new Error("Compliance Policy DB connection not yet implemented");
  }

  /**
   * Create success response
   */
  private createSuccessResponse<T>(data: T, startTime: number): ApiResponse<T> {
    return {
      success: true,
      data,
      error: null,
      metadata: {
        timestamp: new Date().toISOString(),
        dataSource: this.config.useMockData ? "mock" : "live",
        cacheHit: false,
        processingTimeMs: Date.now() - startTime,
      },
    };
  }

  /**
   * Create error response
   */
  private createErrorResponse<T>(error: unknown): ApiResponse<T> {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
      metadata: {
        timestamp: new Date().toISOString(),
        dataSource: this.config.useMockData ? "mock" : "live",
        cacheHit: false,
        processingTimeMs: 0,
      },
    };
  }
}

export default ComplianceService;
