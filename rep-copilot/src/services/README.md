# Data Service Layer

Comprehensive data access layer for Rep Co-Pilot application.

## Overview

This service layer provides a clean abstraction for all data operations in the Rep Co-Pilot application. It's designed to make it easy to swap mock data for real API connections when you're ready to integrate with:

- **Snowflake** - Sales analytics and territory performance
- **Veeva CRM** - Account management and HCP relationships
- **Compliance Policy DB** - Policies, spending limits, and regulations

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Application Layer                        │
│                   (React Components)                         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   API Routes (/api/*)                       │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  chat/route.ts - Uses getDataService() to fetch data  │  │
│  └───────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  DataService (Main Interface)                │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  - getEnrichedContext(tabType)                        │  │
│  │  - formatContextForAI(context)                        │  │
│  │  - Delegates to specialized services                  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────┬───────────────────┬───────────────────────┘
                    │                   │
        ┌───────────┴───────┐   ┌─────┴────────┐
        │                    │                │
        ▼                    ▼                ▼
┌──────────────┐    ┌──────────────┐  ┌──────────────┐
│ Reporting    │    │    CRM       │  │ Compliance   │
│ Service      │    │ Service      │  │ Service      │
│              │    │              │  │              │
│ - getSales   │    │ - getTop    │  │ - getPolicies │
│   Summary    │    │   Accounts   │  │ - checkMeal  │
│ - getTop     │    │ - getHCP     │  │   Spend      │
│   Products   │    │   Details    │  │ - checkAE    │
│              │    │              │  │              │
└──────┬───────┘    └──────┬───────┘  └──────┬───────┘
       │                   │                 │
       └───────────────────┴─────────────────┘
                           │
                           ▼
                ┌──────────────────────┐
                │  MockDataService     │
                │  (Development)       │
                │                      │
                │ - Realistic mock data│
                │ - Simulated delays   │
                │ - Compliance checks  │
                └──────────────────────┘
```

## File Structure

```
src/services/
├── index.ts              # Main exports
├── dataService.ts        # Unified data access interface
├── reportingService.ts   # Sales analytics
├── crmService.ts         # Account & HCP management
├── complianceService.ts  # Policy & compliance
├── mockDataService.ts    # Mock data for development
├── types/
│   └── index.ts         # TypeScript type definitions
└── README.md            # This file
```

## Quick Start

### Using the Main Data Service

```typescript
import { getDataService } from '@/services';

// Get the singleton instance
const dataService = getDataService();

// Fetch sales data
const salesResponse = await dataService.getSalesSummary();
if (salesResponse.success) {
  console.log(salesResponse.data.totalRevenue);
}

// Fetch top accounts
const accountsResponse = await dataService.getTopAccounts(10);

// Check compliance
const complianceResult = await dataService.checkCompliance("I want to take Dr. Chen to Capital Grill");
```

### Using Specialized Services

```typescript
import { ReportingService, CRMService, ComplianceService } from '@/services';

// Reporting
const reporting = new ReportingService({ useMockData: true });
const sales = await reporting.getSalesSummary();

// CRM
const crm = new CRMService();
const accounts = await crm.getTopAccounts(10);

// Compliance
const compliance = new ComplianceService();
const policies = await compliance.getCompliancePolicies();
const mealCheck = await compliance.checkMealSpend(150, 1, "Capital Grill");
```

## Service Configuration

All services accept a configuration object:

```typescript
interface ServiceConfig {
  useMockData: boolean;        // Use mock data (true) or live APIs (false)
  cacheEnabled: boolean;       // Enable response caching
  cacheTtlMs: number;          // Cache duration (default: 5 minutes)
  retryAttempts: number;       // Number of retries on failure (default: 3)
  retryDelayMs: number;        // Delay between retries (default: 1000ms)
}

// Example: Create a service with custom config
const service = new ReportingService({
  useMockData: false,
  cacheEnabled: true,
  cacheTtlMs: 10 * 60 * 1000, // 10 minutes
  retryAttempts: 5,
  retryDelayMs: 2000,
});
```

## API Reference

### DataService (Main Interface)

#### `getEnrichedContext(tabType)`
Fetches context data for AI prompts based on tab type.

```typescript
const context = await dataService.getEnrichedContext('reporting');
// Returns: { salesData, timestamp, dataSource }
```

#### `formatContextForAI(context)`
Formats enriched context for AI consumption.

```typescript
const formatted = dataService.formatContextForAI(context);
// Returns: String formatted for system prompt
```

### ReportingService

#### `getSalesSummary(quarter?, year?)`
Get complete sales summary for a quarter.

```typescript
const response = await reporting.getSalesSummary('Q3', 2026);
// Returns: { totalRevenue, regionalData, topProducts, monthlyTrends }
```

#### `getTopProducts(limit?, therapeuticArea?)`
Get top performing products by prescription volume.

```typescript
const response = await reporting.getTopProducts(5, 'Oncology');
// Returns: Array of ProductMetrics
```

#### `getMonthlyTrends(months?, year?)`
Get monthly sales trends.

```typescript
const response = await reporting.getMonthlyTrends(6, 2026);
// Returns: Array of MonthlyTrend
```

### CRMService

#### `getTopAccounts(limit?, territory?)`
Get priority-ranked accounts.

```typescript
const response = await crm.getTopAccounts(10, 'Northeast');
// Returns: Array of AccountPriority
```

#### `getHealthcareProvider(hcpId)`
Get complete HCP profile.

```typescript
const response = await crm.getHealthcareProvider('HCP-001');
// Returns: HealthcareProvider with contact info
```

#### `getActivityHistory(hcpId, limit?)`
Get activity history for an HCP.

```typescript
const response = await crm.getActivityHistory('HCP-001', 20);
// Returns: Array of ActivityRecord
```

#### `scheduleFollowUp(hcpId, scheduledDate, meetingType, agenda)`
Schedule a follow-up meeting.

```typescript
const response = await crm.scheduleFollowUp(
  'HCP-001',
  '2026-01-20',
  'Office Visit',
  ['Discuss Tagrisso formulary', 'Review Q3 performance']
);
```

### ComplianceService

#### `getCompliancePolicies(category?)`
Get all compliance policies or filter by category.

```typescript
const response = await compliance.getCompliancePolicies('Meal Spend');
// Returns: Array of CompliancePolicy
```

#### `checkMealSpend(amount, hcpCount?, location?)`
Check if meal spend is within limits.

```typescript
const response = await compliance.checkMealSpend(150, 1, 'Capital Grill');
// Returns: { withinLimit: false, warnings: [], recommendations: [] }
```

#### `checkCompliance(query)`
Perform comprehensive compliance check on a query.

```typescript
const result = await compliance.checkCompliance("Draft an email about off-label use");
// Returns: { isCompliant: false, level: 'stop', violations: [], warnings: [] }
```

#### `getPolicyUpdates(limit?)`
Get recent policy changes.

```typescript
const response = await compliance.getPolicyUpdates(10);
// Returns: Array of PolicyUpdate
```

## Data Models

### Sales Data

```typescript
interface SalesSummary {
  quarter: string;
  year: number;
  totalRevenue: number;
  targetAttainment: number;
  growth: number;
  regionalData: RegionalSales[];
  topProducts: ProductMetrics[];
  monthlyTrends: MonthlyTrend[];
}
```

### CRM Data

```typescript
interface HealthcareProvider {
  id: string;
  name: string;
  specialty: Specialty;
  organization: string;
  city: string;
  state: string;
  priorityScore: number;
  totalOpportunity: number;
  lastVisitDate: string;
  nextVisitScheduled: string | null;
  contactInfo: {
    phone: string;
    email: string;
    address: string;
  };
}
```

### Compliance Data

```typescript
interface CompliancePolicy {
  id: string;
  category: PolicyCategory;
  title: string;
  description: string;
  level: ComplianceLevel;
  limits: PolicyLimit[];
  keyPoints: string[];
  prohibitedActions: string[];
  requiredActions: string[];
}
```

## Integration with API Routes

The service layer is integrated into `/api/chat/route.ts`:

```typescript
import { getDataService } from '@/services/dataService';

export async function POST(req: Request) {
  const dataService = getDataService();

  // Fetch enriched context based on tab type
  const context = await dataService.getEnrichedContext(tabType);

  // Format for AI consumption
  const formattedContext = dataService.formatContextForAI(context);

  // Pass to AI model
  const result = streamText({
    system: systemPrompt + formattedContext,
    prompt: userPrompt,
  });

  return result.toTextStreamResponse();
}
```

## Switching from Mock to Live Data

When you're ready to integrate with real data sources:

### Step 1: Update Configuration

```typescript
// In dataService.ts or individual services
const dataService = new DataService({
  useMockData: false,  // ← Switch to live data
});
```

### Step 2: Implement API Connections

Each service has TODO comments where you need to implement the real API calls:

**ReportingService (`reportingService.ts`):**
```typescript
private async fetchFromSnowflake(endpoint: string, params?: any) {
  // TODO: Implement Snowflake connection
  // Use Snowflake SDK or REST API
}
```

**CRMService (`crmService.ts`):**
```typescript
private async fetchFromVeeva(endpoint: string, params?: any) {
  // TODO: Implement Veeva CRM connection
  // Use Veeva REST API
}
```

**ComplianceService (`complianceService.ts`):**
```typescript
private async fetchFromPolicyDB(endpoint: string, params?: any) {
  // TODO: Implement Compliance Policy DB connection
  // Use REST API or direct database connection
}
```

### Step 3: Update Environment Variables

```bash
# .env.local
SNOWFLAKE_ACCOUNT=your-account
SNOWFLAKE_USERNAME=your-username
SNOWFLAKE_PASSWORD=your-password
SNOWFLAKE_WAREHOUSE=your-warehouse

VEEVA_INSTANCE_URL=https://your-instance.vault.com
VEEVA_API_VERSION=v56.0

COMPLIANCE_DB_URL=https://your-policy-db.com
```

## Error Handling

All service methods return an `ApiResponse<T>` wrapper:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
  metadata: {
    timestamp: string;
    dataSource: 'mock' | 'live';
    cacheHit: boolean;
    processingTimeMs: number;
  };
}
```

Usage:

```typescript
const response = await dataService.getSalesSummary();

if (response.success) {
  // Access data
  const revenue = response.data.totalRevenue;
} else {
  // Handle error
  console.error(response.error);
}
```

## Best Practices

1. **Use the main DataService** for most cases - it provides a unified interface
2. **Check response.success** before accessing data
3. **Log processingTimeMs** for performance monitoring
4. **Use specialized services** directly when you need fine-grained control
5. **Keep mock data realistic** - it helps with development and testing
6. **Document API integrations** when implementing live connections

## Testing

The service layer is designed to be easily testable:

```typescript
import { MockDataService } from '@/services';

// In tests, use MockDataService directly
const mockData = await MockDataService.getSalesSummary();

// Or use service with useMockData: true
const service = new ReportingService({ useMockData: true });
const data = await service.getSalesSummary();
```

## Future Enhancements

- [ ] Implement caching layer (Redis)
- [ ] Add request batching for efficiency
- [ ] Implement real-time data subscriptions
- [ ] Add request deduplication
- [ ] Implement circuit breaker pattern for API failures
- [ ] Add metrics and observability

## Support

For questions or issues:
- Check this README first
- Review JSDoc comments in source files
- Check type definitions in `types/index.ts`
- Review example usage in API routes
