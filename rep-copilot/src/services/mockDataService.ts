/**
 * Mock Data Service
 *
 * Provides realistic mock data for development and testing.
 * In production, this will be replaced by actual API calls to:
 * - Snowflake (sales analytics)
 * - Veeva CRM (account management)
 * - Compliance Policy DB (policy data)
 *
 * @module services/mockDataService
 */

import type {
  SalesSummary,
  RegionalSales,
  ProductMetrics,
  MonthlyTrend,
  HealthcareProvider,
  ActivityRecord,
  Opportunity,
  AccountPriority,
  CompliancePolicy,
  PolicyLimit,
  PolicyUpdate,
  ComplianceCheck,
} from "./types";

/**
 * Mock regional sales data for Q3 2026
 */
const mockRegionalSales: RegionalSales[] = [
  {
    region: "North",
    revenue: 1250000,
    growth: 12,
    target: 1300000,
    prescriptions: 45230,
    marketShare: 24.5,
  },
  {
    region: "East",
    revenue: 1100000,
    growth: 8,
    target: 1150000,
    prescriptions: 38900,
    marketShare: 21.2,
  },
  {
    region: "South",
    revenue: 980000,
    growth: 3,
    target: 1000000,
    prescriptions: 35100,
    marketShare: 19.8,
  },
  {
    region: "West",
    revenue: 875000,
    growth: -8,
    target: 950000,
    prescriptions: 31200,
    marketShare: 17.3,
  },
];

/**
 * Mock product performance data
 */
const mockTopProducts: ProductMetrics[] = [
  {
    product: "Tagrisso",
    prescriptions: 12450,
    revenue: 1875000,
    growth: 15.3,
    rank: 1,
    therapeuticArea: "Oncology",
  },
  {
    product: "Lynparza",
    prescriptions: 9870,
    revenue: 1482000,
    growth: 11.7,
    rank: 2,
    therapeuticArea: "Oncology",
  },
  {
    product: "Imfinzi",
    prescriptions: 8650,
    revenue: 1298000,
    growth: 9.4,
    rank: 3,
    therapeuticArea: "Oncology",
  },
  {
    product: "Calquence",
    prescriptions: 7200,
    revenue: 1080000,
    growth: 7.8,
    rank: 4,
    therapeuticArea: "Oncology",
  },
  {
    product: "Farxiga",
    prescriptions: 6800,
    revenue: 945000,
    growth: 22.1,
    rank: 5,
    therapeuticArea: "Cardiovascular",
  },
];

/**
 * Mock monthly trends for 2026
 */
const mockMonthlyTrends: MonthlyTrend[] = [
  {
    month: "Jan",
    year: 2026,
    revenue: 3850000,
    prescriptions: 138000,
    growth: 2.1,
  },
  {
    month: "Feb",
    year: 2026,
    revenue: 3920000,
    prescriptions: 141000,
    growth: 1.8,
  },
  {
    month: "Mar",
    year: 2026,
    revenue: 4050000,
    prescriptions: 146000,
    growth: 3.3,
  },
  {
    month: "Apr",
    year: 2026,
    revenue: 3980000,
    prescriptions: 143000,
    growth: -1.7,
  },
  {
    month: "May",
    year: 2026,
    revenue: 4120000,
    prescriptions: 149000,
    growth: 3.5,
  },
  {
    month: "Jun",
    year: 2026,
    revenue: 4210000,
    prescriptions: 152000,
    growth: 2.2,
  },
];

/**
 * Mock healthcare providers
 */
const mockHealthcareProviders: HealthcareProvider[] = [
  {
    id: "HCP-001",
    name: "Dr. Sarah Cortez",
    specialty: "Oncology",
    organization: "Memorial Cancer Center",
    city: "Boston",
    state: "MA",
    priorityScore: 95,
    totalOpportunity: 45000,
    lastVisitDate: "2026-01-10",
    nextVisitScheduled: "2026-01-20",
    npiNumber: "1457896325",
    contactInfo: {
      phone: "617-555-0123",
      email: "scortez@memorialcancer.org",
      address: "100 Memorial Drive, Boston, MA 02115",
    },
  },
  {
    id: "HCP-002",
    name: "Dr. Michael Chen",
    specialty: "Cardiology",
    organization: "Heart Health Associates",
    city: "New York",
    state: "NY",
    priorityScore: 88,
    totalOpportunity: 32000,
    lastVisitDate: "2026-01-08",
    nextVisitScheduled: "2026-01-22",
    npiNumber: "1789546328",
    contactInfo: {
      phone: "212-555-0456",
      email: "mchen@hearthealthny.com",
      address: "250 Park Avenue, New York, NY 10022",
    },
  },
  {
    id: "HCP-003",
    name: "Dr. Emily Watson",
    specialty: "Pulmonology",
    organization: "Respiratory Care Clinic",
    city: "Philadelphia",
    state: "PA",
    priorityScore: 82,
    totalOpportunity: 28000,
    lastVisitDate: "2026-01-05",
    nextVisitScheduled: null,
    npiNumber: "1654327891",
    contactInfo: {
      phone: "215-555-0789",
      email: "ewatson@respiratorycarepa.com",
      address: "500 Chestnut Street, Philadelphia, PA 19106",
    },
  },
  {
    id: "HCP-004",
    name: "Dr. James Rodriguez",
    specialty: "Oncology",
    organization: "Valley Cancer Institute",
    city: "Hartford",
    state: "CT",
    priorityScore: 79,
    totalOpportunity: 25000,
    lastVisitDate: "2026-01-03",
    nextVisitScheduled: "2026-01-25",
    npiNumber: "1547892635",
    contactInfo: {
      phone: "860-555-0234",
      email: "jrodriguez@valleycancerct.org",
      address: "300 Farmington Avenue, Hartford, CT 06105",
    },
  },
  {
    id: "HCP-005",
    name: "Dr. Lisa Park",
    specialty: "Endocrinology",
    organization: "Metabolic Health Center",
    city: "Providence",
    state: "RI",
    priorityScore: 75,
    totalOpportunity: 22000,
    lastVisitDate: "2026-01-02",
    nextVisitScheduled: "2026-01-28",
    npiNumber: "1897654321",
    contactInfo: {
      phone: "401-555-0567",
      email: "lpark@metabolichealthri.com",
      address: "200 Westminster Street, Providence, RI 02903",
    },
  },
];

/**
 * Mock recent activities
 */
const mockRecentActivities: ActivityRecord[] = [
  {
    id: "ACT-001",
    hcpId: "HCP-001",
    hcpName: "Dr. Sarah Cortez",
    date: "2026-01-10",
    type: "Office Visit",
    notes: "Discussed Tagrisso efficacy data. Showed real-world evidence from recent trials. HCP expressed interest in prescribing for EGFR+ NSCLC patients.",
    outcome: "HCP requested additional information on combination therapy",
    followUpRequired: true,
    followUpDate: "2026-01-20",
  },
  {
    id: "ACT-002",
    hcpId: "HCP-002",
    hcpName: "Dr. Michael Chen",
    date: "2026-01-08",
    type: "Lunch Meeting",
    notes: "Presented Farxiga cardiovascular outcomes data. Discussed patient case studies.",
    outcome: "HCP agreed to consider Farxiga for eligible HFpEF patients",
    followUpRequired: true,
    followUpDate: "2026-01-22",
  },
  {
    id: "ACT-003",
    hcpId: "HCP-003",
    hcpName: "Dr. Emily Watson",
    date: "2026-01-05",
    type: "Sample Drop-off",
    notes: "Delivered Symbicort samples. Provided updated prescribing information.",
    outcome: "Samples received successfully",
    followUpRequired: false,
    followUpDate: null,
  },
  {
    id: "ACT-004",
    hcpId: "HCP-004",
    hcpName: "Dr. James Rodriguez",
    date: "2026-01-03",
    type: "Conference Call",
    notes: "Reviewed Imfinzi trial results for Stage III NSCLC. Answered questions about adverse event management.",
    outcome: "HCP planning to present data at tumor board next week",
    followUpRequired: true,
    followUpDate: "2026-01-17",
  },
  {
    id: "ACT-005",
    hcpId: "HCP-005",
    hcpName: "Dr. Lisa Park",
    date: "2026-01-02",
    type: "Email",
    notes: "Sent Forxiga SGLT2 inhibitor comparative data. Included formulary status information.",
    outcome: "HCP acknowledged receipt, will review at next clinic meeting",
    followUpRequired: true,
    followUpDate: "2026-01-16",
  },
];

/**
 * Mock open opportunities
 */
const mockOpenOpportunities: Opportunity[] = [
  {
    id: "OPP-001",
    hcpId: "HCP-001",
    hcpName: "Dr. Sarah Cortez",
    specialty: "Oncology",
    stage: "Proposal",
    value: 45000,
    probability: 75,
    expectedCloseDate: "2026-02-28",
    products: ["Tagrisso", "Imfinzi"],
    lastActivity: "2026-01-10",
    nextAction: "Schedule follow-up to discuss formulary status",
    priority: "High",
  },
  {
    id: "OPP-002",
    hcpId: "HCP-002",
    hcpName: "Dr. Michael Chen",
    specialty: "Cardiology",
    stage: "Negotiation",
    value: 32000,
    probability: 85,
    expectedCloseDate: "2026-02-15",
    products: ["Farxiga"],
    lastActivity: "2026-01-08",
    nextAction: "Provide cardiovascular outcomes trial data",
    priority: "High",
  },
  {
    id: "OPP-003",
    hcpId: "HCP-003",
    hcpName: "Dr. Emily Watson",
    specialty: "Pulmonology",
    stage: "Discovery",
    value: 28000,
    probability: 40,
    expectedCloseDate: "2026-03-31",
    products: ["Symbicort", "Fasenra"],
    lastActivity: "2026-01-05",
    nextAction: "Schedule lunch meeting to discuss severe asthma protocol",
    priority: "Medium",
  },
  {
    id: "OPP-004",
    hcpId: "HCP-004",
    hcpName: "Dr. James Rodriguez",
    specialty: "Oncology",
    stage: "Proposal",
    value: 25000,
    probability: 60,
    expectedCloseDate: "2026-02-20",
    products: ["Imfinzi", "Lynparza"],
    lastActivity: "2026-01-03",
    nextAction: "Send stage III NSCLC treatment protocol",
    priority: "Medium",
  },
  {
    id: "OPP-005",
    hcpId: "HCP-005",
    hcpName: "Dr. Lisa Park",
    specialty: "Endocrinology",
    stage: "Discovery",
    value: 22000,
    probability: 35,
    expectedCloseDate: "2026-03-15",
    products: ["Farxiga", "Forxiga"],
    lastActivity: "2026-01-02",
    nextAction: "Arrange dinner meeting with local KOL",
    priority: "Low",
  },
];

/**
 * Mock account priority rankings
 */
const mockAccountPriorities: AccountPriority[] = mockHealthcareProviders.slice(0, 10).map((hcp, index) => ({
  hcp,
  score: 95 - index * 5,
  ranking: index + 1,
  reasons: [
    `High prescription potential in ${hcp.specialty}`,
    `${hcp.totalOpportunity > 30000 ? "Large" : "Moderate"} opportunity value ($${hcp.totalOpportunity.toLocaleString()})`,
    index < 3 ? "Recent positive engagement" : "Scheduled follow-up required",
    hcp.specialty === "Oncology" ? "Key opinion leader in region" : "Growing practice",
  ],
  suggestedActions: [
    "Schedule in-person visit this month",
    "Provide latest clinical trial data",
    "Invite to upcoming speaker program",
    "Discuss formulary status at their institution",
  ],
  opportunityValue: hcp.totalOpportunity,
}));

/**
 * Mock compliance policies
 */
const mockCompliancePolicies: CompliancePolicy[] = [
  {
    id: "POL-001",
    category: "Meal Spend",
    title: "Meal Spend Limit Policy",
    description: "Specifies the maximum allowable spend for meals with Healthcare Providers during business interactions.",
    level: "warning",
    limits: [
      {
        category: "Meal Spend",
        limitType: "per HCP",
        amount: 125,
        description: "Maximum spend per HCP per educational event, including tax and gratuity",
        requirements: [
          "Meal must be educational in nature",
          "Documentation of attendees and topics discussed required",
          "Receipt must be retained for 3 years",
          "Alcohol is strictly prohibited",
        ],
        approvalNeeded: false,
        referenceUrl: "https://astraZeneca.policies.com/meal-spend",
        lastUpdated: "2025-11-15",
      },
    ],
    keyPoints: [
      "$125 limit per HCP per event (including tax and tip)",
      "Educational content must be presented during meal",
      "No alcohol allowed",
      "Must maintain detailed records for 3 years",
    ],
    prohibitedActions: [
      "Exceeding $125 per HCP without prior approval",
      "Providing meals without educational content",
      "Including alcohol in meal expenses",
      "Meals for family members or guests",
    ],
    requiredActions: [
      "Document all attendees (name, credentials, signature)",
      "Record educational topics discussed",
      "Keep itemized receipts with restaurant details",
      "Report in expense system within 30 days",
    ],
    reportingRequirements: [
      "Submit expense report within 30 days",
      "Include educational agenda and attendee list",
      "Retain records for minimum 3 years",
    ],
    version: "3.2",
    effectiveDate: "2024-01-01",
    lastUpdated: "2025-11-15",
  },
  {
    id: "POL-002",
    category: "Speaker Programs",
    title: "Speaker Chairperson Honorarium Policy",
    description: "Guidelines for compensation to HCPs serving as speakers at AZ-sponsored events.",
    level: "warning",
    limits: [
      {
        category: "Speaker Programs",
        limitType: "per engagement",
        amount: 250,
        description: "Standard honorarium for speaker chairpersons per engagement",
        requirements: [
          "Speaker must have clinical expertise in the topic",
          "Pre-approval from CAP required",
          "Fair Market Value documentation required",
          "Speaker agreement must be signed prior to event",
        ],
        approvalNeeded: true,
        referenceUrl: "https://astraZeneca.policies.com/speaker-programs",
        lastUpdated: "2025-10-20",
      },
    ],
    keyPoints: [
      "$250 honorarium per speaking engagement",
      "Requires CAP (Compliance Approval Process) approval",
      "Fair Market Value assessment required",
      "Speaker expertise must align with topic",
    ],
    prohibitedActions: [
      "Paying honorariums without CAP approval",
      "Exceeding Fair Market Value without justification",
      "Payments to speakers without relevant expertise",
      "Honorariums for promotional activities only",
    ],
    requiredActions: [
      "Submit CAP request 30 days prior to event",
      "Complete FMV assessment documentation",
      "Execute speaker agreement",
      "Retain event materials and evaluation forms",
    ],
    reportingRequirements: [
      "Report payment within 7 days of event",
      "Include CAP approval reference",
      "Submit speaker evaluation form",
      "Maintain records for 5 years",
    ],
    version: "4.1",
    effectiveDate: "2024-06-01",
    lastUpdated: "2025-10-20",
  },
  {
    id: "POL-003",
    category: "Off-Label",
    title: "Off-Label Discussion Policy",
    description: "Prohibits commercial teams from discussing off-label uses of AZ products.",
    level: "stop",
    limits: [],
    keyPoints: [
      "Commercial teams CANNOT discuss off-label uses",
      "Off-label information requests must be routed to Medical Affairs",
      "Unsolicited requests require MIR (Medical Information Request) process",
      "No promotional materials for off-label indications",
    ],
    prohibitedActions: [
      "Initiating discussions about unapproved indications",
      "Providing off-label data or studies",
      "Suggesting off-label use to HCPs",
      "Creating or distributing off-label promotional materials",
    ],
    requiredActions: [
      "Immediately route off-label requests to Medical Affairs",
      "Document the request as an MIR",
      "Do not provide any clinical information yourself",
      "Inform HCP of the proper channel",
    ],
    reportingRequirements: [
      "Log all unsolicited medical requests",
      "Submit MIR form within 24 hours",
      "Track outcome of Medical Affairs follow-up",
    ],
    version: "5.0",
    effectiveDate: "2023-01-01",
    lastUpdated: "2025-09-10",
  },
  {
    id: "POL-004",
    category: "Adverse Events",
    title: "Adverse Event Reporting Policy",
    description: "Mandates immediate reporting of adverse events related to AZ products.",
    level: "stop",
    limits: [],
    keyPoints: [
      "ALL adverse events must be reported within 24 hours",
      "Call PVCS (Pharmacovigilance & Safety) at 1-800-AZ-SAFE",
      "Do NOT attempt to determine causality yourself",
      "Complete AE reporting form with patient details",
    ],
    prohibitedActions: [
      "Delaying adverse event reporting",
      "Filtering out what seems minor",
      "Attempting to assess causality before reporting",
      "Disclosing confidential patient information unnecessarily",
    ],
    requiredActions: [
      "Report within 24 hours to PVCS",
      "Provide patient initials, age, gender, and event description",
      "Include product name, dose, and indication if known",
      "Document report reference number",
    ],
    reportingRequirements: [
      "Initial report within 24 hours",
      "Follow-up information as it becomes available",
      "Maintain documentation for 15 years",
    ],
    version: "6.2",
    effectiveDate: "2024-01-01",
    lastUpdated: "2025-12-01",
  },
  {
    id: "POL-005",
    category: "Medical Information",
    title: "Unsolicited Medical Request Policy",
    description: "Process for handling unsolicited requests for off-label or medical information.",
    level: "info",
    limits: [],
    keyPoints: [
      "Route all unsolicited medical requests to Medical Affairs",
      "Do NOT provide off-label information yourself",
      "Use MIR (Medical Information Request) process",
      "Medical Affairs will respond directly to HCP",
    ],
    prohibitedActions: [
      "Answering off-label questions directly",
      "Providing medical advice or interpretations",
      "Sharing clinical data without Medical Affairs review",
    ],
    requiredActions: [
      "Document the request in MIR system",
      "Confirm request is truly unsolicited",
      "Provide HCP with expected response timeframe",
      "Follow up to ensure Medical Affairs contacted them",
    ],
    reportingRequirements: [
      "Submit MIR form within 24 hours",
      "Track request status in CRM",
      "Close loop when HCP receives response",
    ],
    version: "3.1",
    effectiveDate: "2024-03-01",
    lastUpdated: "2025-08-15",
  },
];

/**
 * Mock recent policy updates
 */
const mockPolicyUpdates: PolicyUpdate[] = [
  {
    id: "UPD-001",
    policyId: "POL-001",
    title: "Meal Spend Limit Adjustment",
    category: "Meal Spend",
    changeType: "Updated",
    summary: "Meal spend limit increased from $120 to $125 per HCP to align with inflation and industry standards.",
    impact: "Allows slightly higher meal expenses while maintaining compliance. Documentation requirements unchanged.",
    effectiveDate: "2025-11-15",
    announcedDate: "2025-11-01",
    actionRequired: true,
    actions: [
      "Review new limit before scheduling meals",
      "Update expense reporting templates",
      "Acknowledge policy update in compliance training",
    ],
  },
  {
    id: "UPD-002",
    policyId: "POL-004",
    title: "Adverse Event Reporting Timeline Clarification",
    category: "Adverse Events",
    changeType: "Updated",
    summary: "Clarified that 24-hour reporting window is measured from when the field rep becomes aware of the event, not when it occurred.",
    impact: "Provides clearer guidance on reporting timeline. No change to the 24-hour requirement itself.",
    effectiveDate: "2025-12-01",
    announcedDate: "2025-11-15",
    actionRequired: true,
    actions: [
      "Complete updated compliance training module",
      "Review AE reporting procedure",
      "Update documentation practices",
    ],
  },
  {
    id: "UPD-003",
    policyId: "POL-006",
    title: "Virtual Meeting Guidelines",
    category: "Meal Spend",
    changeType: "New",
    summary: "New policy establishing guidelines for virtual meetings and meals, including limits on food delivery during virtual educational sessions.",
    impact: "Provides framework for compliant virtual engagement. Limits food delivery to $25 per HCP for virtual events.",
    effectiveDate: "2026-01-15",
    announcedDate: "2025-12-20",
    actionRequired: true,
    actions: [
      "Review virtual meeting policy before scheduling",
      "Update virtual event planning process",
      "Complete virtual compliance training",
    ],
  },
];

/**
 * Simulate network delay for realistic API behavior
 */
async function simulateDelay(minMs = 100, maxMs = 500): Promise<void> {
  const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  await new Promise((resolve) => setTimeout(resolve, delay));
}

/**
 * Mock Data Service Class
 *
 * Provides methods to fetch all types of mock data with simulated delays
 */
export class MockDataService {
  /**
   * Get complete sales summary
   */
  static async getSalesSummary(): Promise<SalesSummary> {
    await simulateDelay(150, 400);

    return {
      quarter: "Q3",
      year: 2026,
      totalRevenue: 4205000,
      targetAttainment: 98,
      growth: 3.9,
      regionalData: mockRegionalSales,
      topProducts: mockTopProducts,
      monthlyTrends: mockMonthlyTrends,
    };
  }

  /**
   * Get regional sales breakdown
   */
  static async getRegionalSales(): Promise<RegionalSales[]> {
    await simulateDelay(100, 300);
    return mockRegionalSales;
  }

  /**
   * Get top performing products
   */
  static async getTopProducts(): Promise<ProductMetrics[]> {
    await simulateDelay(100, 300);
    return mockTopProducts;
  }

  /**
   * Get monthly sales trends
   */
  static async getMonthlyTrends(): Promise<MonthlyTrend[]> {
    await simulateDelay(100, 300);
    return mockMonthlyTrends;
  }

  /**
   * Get top priority accounts
   */
  static async getTopAccounts(limit: number = 10): Promise<AccountPriority[]> {
    await simulateDelay(150, 400);
    return mockAccountPriorities.slice(0, limit);
  }

  /**
   * Get healthcare provider by ID
   */
  static async getHealthcareProvider(hcpId: string): Promise<HealthcareProvider | null> {
    await simulateDelay(100, 250);
    return mockHealthcareProviders.find((hcp) => hcp.id === hcpId) || null;
  }

  /**
   * Get recent activities
   */
  static async getRecentActivities(limit: number = 20): Promise<ActivityRecord[]> {
    await simulateDelay(100, 300);
    return mockRecentActivities.slice(0, limit);
  }

  /**
   * Get activities for specific HCP
   */
  static async getActivitiesForHCP(hcpId: string): Promise<ActivityRecord[]> {
    await simulateDelay(100, 250);
    return mockRecentActivities.filter((act) => act.hcpId === hcpId);
  }

  /**
   * Get open opportunities
   */
  static async getOpenOpportunities(): Promise<Opportunity[]> {
    await simulateDelay(150, 400);
    return mockOpenOpportunities;
  }

  /**
   * Get opportunities for specific HCP
   */
  static async getOpportunitiesForHCP(hcpId: string): Promise<Opportunity[]> {
    await simulateDelay(100, 250);
    return mockOpenOpportunities.filter((opp) => opp.hcpId === hcpId);
  }

  /**
   * Get all compliance policies
   */
  static async getCompliancePolicies(): Promise<CompliancePolicy[]> {
    await simulateDelay(100, 300);
    return mockCompliancePolicies;
  }

  /**
   * Get policy by category
   */
  static async getPolicyByCategory(
    category: string
  ): Promise<CompliancePolicy | null> {
    await simulateDelay(100, 250);
    return (
      mockCompliancePolicies.find((policy) => policy.category === category) || null
    );
  }

  /**
   * Get recent policy updates
   */
  static async getPolicyUpdates(): Promise<PolicyUpdate[]> {
    await simulateDelay(100, 250);
    return mockPolicyUpdates;
  }

  /**
   * Perform compliance check on a query
   *
   * Analyzes text for potential compliance issues
   */
  static async checkCompliance(query: string): Promise<ComplianceCheck> {
    await simulateDelay(200, 500);

    const lowerQuery = query.toLowerCase();
    const violations: string[] = [];
    const warnings: string[] = [];
    const policyReferences: string[] = [];
    let category: ComplianceCheck["category"] = null;
    let level: ComplianceCheck["level"] = "info";

    // Check for off-label discussions
    const offLabelKeywords = [
      "off-label",
      "unapproved indication",
      "off label",
      "unapproved use",
    ];
    if (offLabelKeywords.some((keyword) => lowerQuery.includes(keyword))) {
      violations.push(
        "Query contains references to off-label discussions or unapproved indications"
      );
      policyReferences.push("POL-003: Off-Label Discussion Policy");
      category = "Off-Label";
      level = "stop";
    }

    // Check for adverse events
    const adverseEventKeywords = [
      "adverse event",
      "side effect",
      "reaction",
      "patient died",
      "hospitalization",
    ];
    if (adverseEventKeywords.some((keyword) => lowerQuery.includes(keyword))) {
      warnings.push(
        "Query may reference an adverse event requiring immediate reporting"
      );
      policyReferences.push("POL-004: Adverse Event Reporting Policy");
      if (level !== "stop") {
        category = "Adverse Events";
        level = "warning";
      }
    }

    // Check for meal spend concerns
    const mealSpendKeywords = [
      "expens",
      "capital grille",
      "$500",
      "dinner",
      "high-end restaurant",
      "luxury",
    ];
    if (mealSpendKeywords.some((keyword) => lowerQuery.includes(keyword))) {
      warnings.push(
        "Query mentions spending that may exceed the $125 per HCP meal limit"
      );
      policyReferences.push("POL-001: Meal Spend Limit Policy");
      if (level !== "stop") {
        category = "Meal Spend";
        level = "warning";
      }
    }

    // Check for speaker program references
    const speakerKeywords = ["speaker", "honorarium", "chairperson", "presentation fee"];
    if (speakerKeywords.some((keyword) => lowerQuery.includes(keyword))) {
      warnings.push(
        "Query references speaker programs which require CAP approval"
      );
      policyReferences.push("POL-002: Speaker Chairperson Honorarium Policy");
      if (level === "info") {
        category = "Speaker Programs";
        level = "warning";
      }
    }

    // Check for unsolicited medical requests
    const medicalRequestKeywords = [
      "medical information request",
      "mir",
      "unpublished data",
      "clinical study",
    ];
    if (medicalRequestKeywords.some((keyword) => lowerQuery.includes(keyword))) {
      warnings.push(
        "Query may require routing to Medical Affairs via MIR process"
      );
      policyReferences.push("POL-005: Unsolicited Medical Request Policy");
      if (level === "info") {
        category = "Medical Information";
      }
    }

    const isCompliant = violations.length === 0 && warnings.length === 0;

    return {
      isCompliant,
      level,
      category,
      violations,
      warnings,
      suggestedAlternatives: level === "stop"
        ? [
            "Route this request to Medical Affairs via MIR process",
            "Inform HCP that off-label discussions require medical expertise",
            "Do not provide any clinical information yourself",
          ]
        : level === "warning"
        ? [
            "Review relevant policy before proceeding",
            "Consult compliance team if uncertain",
            "Document all interactions thoroughly",
          ]
        : [],
      policyReferences,
      requiresApproval: level === "stop" || (level === "warning" && category === "Speaker Programs"),
      approvalWorkflow: level === "stop"
        ? "MIR Process: Log request → Medical Affairs review → Direct response to HCP"
        : level === "warning" && category === "Speaker Programs"
        ? "CAP Process: Submit request 30 days prior → Compliance review → Approval required"
        : null,
    };
  }
}

export default MockDataService;
