'use client';

import { ArrowLeft, TrendingUp, AlertTriangle, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SmartInputDock from './SmartInputDock';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ResponseViewProps {
  onBack: () => void;
  prompt?: string;
  tabType?: 'reporting' | 'crm' | 'compliance';
}

const regionData = [
  { name: 'North', value: 1250000, percentage: 100, trend: '+12%' },
  { name: 'East', value: 1100000, percentage: 88, trend: '+8%' },
  { name: 'South', value: 980000, percentage: 78, trend: '+3%' },
  { name: 'West', value: 875000, percentage: 70, trend: '-8%' },
];

// CRM account data
const crmAccounts = [
  { name: 'Dr. Sarah Cortez', specialty: 'Oncology', priority: 'High', lastContact: '2 days ago', opportunity: '$45K', status: 'Proposal Stage' },
  { name: 'Dr. Michael Chen', specialty: 'Cardiology', priority: 'High', lastContact: '5 days ago', opportunity: '$32K', status: 'Discovery' },
  { name: 'Dr. Emily Watson', specialty: 'Pulmonology', priority: 'Medium', lastContact: '1 week ago', opportunity: '$28K', status: 'Negotiation' },
  { name: 'Dr. James Wilson', specialty: 'Oncology', priority: 'Medium', lastContact: '3 days ago', opportunity: '$21K', status: 'Proposal Stage' },
  { name: 'Dr. Lisa Anderson', specialty: 'Cardiology', priority: 'High', lastContact: '1 day ago', opportunity: '$38K', status: 'Discovery' },
];

// Compliance policy data
const compliancePolicies = [
  { category: 'Meal Spend', limit: '$125 per HCP', details: 'Including tax and gratuity. Requires documented business purpose.', lastUpdated: 'Jan 2025' },
  { category: 'Honorarium', limit: '$250 per engagement', details: 'Speaker programs must be pre-approved through CAP system.', lastUpdated: 'Dec 2024' },
  { category: 'Off-Label', limit: 'Not permitted', details: 'Route unsolicited requests to Medical Affairs MIR process.', lastUpdated: 'Nov 2024' },
  { category: 'Adverse Events', limit: 'Report within 24h', details: 'Call PVCS hotline: 1-800-AZ-SAFE. Document in CRM.', lastUpdated: 'Jan 2025' },
];

// PRODUCT DATA
const productData = [
  { rank: 1, name: 'Tagrisso', prescriptions: 12450, percentage: 100, territory: '45%', growth: '+18%' },
  { rank: 2, name: 'Lynparza', prescriptions: 9870, percentage: 79, territory: '38%', growth: '+12%' },
  { rank: 3, name: 'Imfinzi', prescriptions: 8650, percentage: 69, territory: '32%', growth: '+8%' },
  { rank: 4, name: 'Calquence', prescriptions: 7200, percentage: 58, territory: '28%', growth: '+5%' },
  { rank: 5, name: 'Farxiga', prescriptions: 6800, percentage: 55, territory: '25%', growth: '+3%' },
];

// MONTHLY TREND DATA
const monthlyTrends = [
  { month: 'Jul', sales: 3800000, target: 4000000, variance: -5 },
  { month: 'Aug', sales: 4100000, target: 4000000, variance: +2.5 },
  { month: 'Sep', sales: 4350000, target: 4000000, variance: +8.75 },
  { month: 'Oct', sales: 4200000, target: 4200000, variance: 0 },
  { month: 'Nov', sales: 4450000, target: 4200000, variance: +5.95 },
  { month: 'Dec', sales: 4600000, target: 4400000, variance: +4.55 },
];

// BELOW TARGET AREAS
const belowTargetAreas = [
  { territory: 'West - Northern California', actual: 875000, target: 1100000, gap: '-20.5%', priority: 'High' },
  { territory: 'South - Florida Panhandle', actual: 620000, target: 750000, gap: '-17.3%', priority: 'High' },
  { territory: 'East - Upstate New York', actual: 580000, target: 700000, gap: '-17.1%', priority: 'Medium' },
  { territory: 'Midwest - Kansas', actual: 490000, target: 550000, gap: '-10.9%', priority: 'Medium' },
];

// MONTH OVER MONTH COMPARISON
const momComparison = {
  lastMonth: {
    period: 'December 2024',
    totalSales: 4600000,
    topProduct: 'Tagrisso',
    growth: '+5.2%',
  },
  thisMonth: {
    period: 'January 2025',
    totalSales: 4780000,
    topProduct: 'Tagrisso',
    growth: '+3.9%',
  },
};

// ACTIVITY HISTORY DATA
const activityHistory = [
  { date: 'Jan 10, 2025', activity: 'Office visit - discussed Tagriszo', outcome: 'Positive interest' },
  { date: 'Jan 8, 2025', activity: 'Sample drop-off - Lynparza', outcome: 'Sample accepted' },
  { date: 'Dec 20, 2024', activity: 'Conference call - trial data', outcome: 'Requested follow-up' },
  { date: 'Dec 15, 2024', activity: 'Lunch meeting', outcome: 'Scheduled next visit' },
];

// OPPORTUNITY DATA
const opportunities = [
  { account: 'Dr. Sarah Cortez', stage: 'Proposal', value: '$45K', probability: '75%', nextStep: 'Submit pricing' },
  { account: 'Dr. Michael Chen', stage: 'Discovery', value: '$32K', probability: '40%', nextStep: 'Schedule demo' },
  { account: 'Dr. Emily Watson', stage: 'Negotiation', value: '$28K', probability: '90%', nextStep: 'Final review' },
  { account: 'Dr. James Wilson', stage: 'Proposal', value: '$21K', probability: '60%', nextStep: 'Address concerns' },
  { account: 'Memorial Hospital', stage: 'Discovery', value: '$85K', probability: '25%', nextStep: 'Needs assessment' },
];

// HCP CONTACT DETAILS
const hcpContacts = [
  { name: 'Dr. Sarah Cortez', specialty: 'Oncology', hospital: 'City General Hospital', phone: '(555) 123-4567', email: 'cortez.s@citygeneral.com', address: '123 Medical Plaza, Suite 450, San Francisco, CA 94102' },
  { name: 'Dr. Michael Chen', specialty: 'Cardiology', hospital: 'Heart Care Center', phone: '(555) 234-5678', email: 'chen.m@heartcare.com', address: '456 Cardiology Dr, Palo Alto, CA 94301' },
];

function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`;
  }
  return `$${(value / 1000).toFixed(0)}K`;
}

// Top 5 Products Component
function TopProductsCard() {
  return (
    <Card className="border-border/50 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-center text-lg">TOP 5 PRESCRIBED PRODUCTS</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {productData.map((product, index) => (
          <motion.div
            key={product.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="p-3 rounded-lg bg-secondary/50"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-primary w-6">#{product.rank}</span>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{product.name}</h3>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                  <span>{product.prescriptions.toLocaleString()} Rx</span>
                  <span>•</span>
                  <span>{product.territory} territory</span>
                  <span>•</span>
                  <span className={product.growth.startsWith('+') ? 'text-green-600 font-medium' : 'text-destructive font-medium'}>
                    {product.growth}
                  </span>
                </div>
              </div>
              <div className="w-16 text-right">
                <div className="text-2xl font-bold text-primary">{product.percentage}%</div>
              </div>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}

// Monthly Trends Component
function MonthlyTrendsCard() {
  return (
    <Card className="border-border/50 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-center text-lg">MONTHLY PRESCRIPTION VOLUME TRENDS</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {monthlyTrends.map((trend, index) => (
          <motion.div
            key={trend.month}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="space-y-1"
          >
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-foreground w-12">{trend.month}</span>
              <span className="text-muted-foreground text-xs">{formatCurrency(trend.sales)}</span>
              <span className="text-muted-foreground text-xs">Target: {formatCurrency(trend.target)}</span>
              <span className={`text-xs font-medium ${trend.variance >= 0 ? 'text-green-600' : 'text-destructive'}`}>
                {trend.variance > 0 ? '+' : ''}{trend.variance}%
              </span>
            </div>
            <div className="h-2 bg-secondary rounded overflow-hidden">
              <motion.div
                className={`h-full rounded ${trend.variance >= 0 ? 'bg-green-500' : 'bg-destructive'}`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.abs(trend.variance) * 5 + 50}` }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
              />
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}

// Below Target Areas Component
function BelowTargetAreasCard() {
  return (
    <Card className="border-border/50 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-center text-lg">AREAS REQUIRING ATTENTION</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {belowTargetAreas.map((area, index) => (
          <motion.div
            key={area.territory}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className={`p-3 rounded-lg border-l-4 ${area.priority === 'High' ? 'border-l-destructive bg-destructive/5' : 'border-l-gold bg-gold/5'}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground text-sm">{area.territory}</h3>
                <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                  <span>Actual: {formatCurrency(area.actual)}</span>
                  <span>Target: {formatCurrency(area.target)}</span>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-lg font-bold ${parseFloat(area.gap) < -15 ? 'text-destructive' : 'text-gold'}`}>
                  {area.gap}
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${area.priority === 'High' ? 'bg-destructive/20 text-destructive' : 'bg-gold/20 text-gold'}`}>
                  {area.priority}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}

// Month Over Month Comparison Component
function MonthComparisonCard() {
  return (
    <Card className="border-border/50 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-center text-lg">MONTH-OVER-MONTH SALES COMPARISON</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Last Month */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="p-4 rounded-lg bg-secondary/50"
          >
            <h3 className="text-xs text-muted-foreground mb-2">LAST MONTH</h3>
            <p className="text-sm font-medium text-foreground mb-1">{momComparison.lastMonth.period}</p>
            <p className="text-2xl font-bold text-primary">{formatCurrency(momComparison.lastMonth.totalSales)}</p>
            <p className="text-xs text-muted-foreground mt-1">Top: {momComparison.lastMonth.topProduct}</p>
            <p className="text-xs text-green-600 mt-1">Growth: {momComparison.lastMonth.growth}</p>
          </motion.div>

          {/* This Month */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="p-4 rounded-lg bg-primary/10 border border-primary/30"
          >
            <h3 className="text-xs text-muted-foreground mb-2">THIS MONTH</h3>
            <p className="text-sm font-medium text-foreground mb-1">{momComparison.thisMonth.period}</p>
            <p className="text-2xl font-bold text-primary">{formatCurrency(momComparison.thisMonth.totalSales)}</p>
            <p className="text-xs text-muted-foreground mt-1">Top: {momComparison.thisMonth.topProduct}</p>
            <p className="text-xs text-green-600 mt-1">Growth: {momComparison.thisMonth.growth}</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-3 rounded-lg bg-green-50 border border-green-200"
        >
          <p className="text-sm text-foreground">
            <span className="font-semibold">+3.9% month-over-month growth</span> - Strong performance driven by Tagrisso adoption in oncology accounts.
          </p>
        </motion.div>
      </CardContent>
    </Card>
  );
}

// Activity History Component
function ActivityHistoryCard() {
  return (
    <Card className="border-border/50 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-center text-lg">RECENT ACTIVITY - DR. JOHN DOE</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {activityHistory.map((activity, index) => (
          <motion.div
            key={activity.date}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50"
          >
            <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-medium text-muted-foreground">{activity.date}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  activity.outcome.includes('Positive') || activity.outcome.includes('accepted')
                    ? 'bg-green-100 text-green-700'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {activity.outcome}
                </span>
              </div>
              <p className="text-sm text-foreground">{activity.activity}</p>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}

// Opportunities Component
function OpportunitiesCard() {
  return (
    <Card className="border-border/50 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-center text-lg">OPEN OPPORTUNITIES</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {opportunities.map((opp, index) => (
          <motion.div
            key={opp.account}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="p-3 rounded-lg bg-secondary/50 border-l-4 border-primary"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground text-sm">{opp.account}</h3>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span className="px-2 py-0.5 rounded bg-primary/10 text-primary">{opp.stage}</span>
                  <span>{opp.value}</span>
                  <span>{opp.probability} probability</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Next: {opp.nextStep}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}

// HCP Contact Card Component
function HCPContactCard() {
  return (
    <Card className="border-border/50 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-center text-lg">HEALTHCARE PROVIDER CONTACTS</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {hcpContacts.map((hcp, index) => (
          <motion.div
            key={hcp.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="p-4 rounded-lg bg-secondary/50"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-bold text-primary">{hcp.name.split(' ').map(n => n[0]).join('')}</span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{hcp.name}</h3>
                <p className="text-sm text-muted-foreground">{hcp.specialty} • {hcp.hospital}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="w-4">📞</span>
                <span>{hcp.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="w-4">✉️</span>
                <span>{hcp.email}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="w-4">📍</span>
                <span className="text-xs">{hcp.address}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}

// CRM Accounts List Component
function CRMAccountsList() {
  return (
    <Card className="border-border/50 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-center text-lg">TOP 5 PRIORITY ACCOUNTS</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {crmAccounts.map((account, index) => (
          <motion.div
            key={account.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground">{account.name}</h3>
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded-full font-medium",
                    account.priority === 'High'
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  )}>
                    {account.priority} Priority
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{account.specialty}</p>
                <div className="flex gap-4 mt-2 text-xs">
                  <span className="text-muted-foreground">Last contact: {account.lastContact}</span>
                  <span className="text-primary font-medium">{account.opportunity} opportunity</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground mb-1">Status</div>
                <div className="text-sm font-medium text-primary">{account.status}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}

// Compliance Policies List Component
function CompliancePoliciesList() {
  return (
    <Card className="border-border/50 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-center text-lg">COMPLIANCE POLICY QUICK REFERENCE</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {compliancePolicies.map((policy, index) => (
          <motion.div
            key={policy.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="p-4 rounded-lg bg-secondary/50 border-l-4 border-primary"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">{policy.category}</h3>
                <p className="text-sm text-muted-foreground mb-2">{policy.details}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-primary">Limit: {policy.limit}</span>
                  <span className="text-xs text-muted-foreground">• Updated: {policy.lastUpdated}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}

// Prompt to component mapping
function getResponseComponents(prompt: string, tabType: 'reporting' | 'crm' | 'compliance') {
  const normalizedPrompt = prompt.toLowerCase().trim();

  // Reporting prompts
  if (tabType === 'reporting') {
    if (normalizedPrompt.includes("top 5") || normalizedPrompt.includes("top five")) {
      return [TopProductsCard];
    }
    if (normalizedPrompt.includes("monthly trends") || normalizedPrompt.includes("trends")) {
      return [MonthlyTrendsCard];
    }
    if (normalizedPrompt.includes("below-target") || normalizedPrompt.includes("below target")) {
      return [BelowTargetAreasCard];
    }
    if (normalizedPrompt.includes("comparing last month") || normalizedPrompt.includes("month's and this month's")) {
      return [MonthComparisonCard];
    }
    // Default: Show region chart for "quarter's sales performance by region"
    return [RegionChartCard, SummaryCard];
  }

  // CRM prompts
  if (tabType === 'crm') {
    if (normalizedPrompt.includes("activity history") || normalizedPrompt.includes("dr. john doe")) {
      return [ActivityHistoryCard];
    }
    if (normalizedPrompt.includes("open opportunities") || normalizedPrompt.includes("opportunities")) {
      return [OpportunitiesCard];
    }
    if (normalizedPrompt.includes("contact details") || normalizedPrompt.includes("healthcare providers")) {
      return [HCPContactCard];
    }
    // Default: Show CRM accounts list for "top 10 accounts"
    return [CRMAccountsList];
  }

  // Compliance prompts - always show policy list
  return [CompliancePoliciesList];
}

// Region Chart Component (extracted for reusability)
function RegionChartCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <Card className="border-border/50 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-center text-lg">Q3 SALES BY REGION</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {regionData.map((region, index) => (
            <motion.div
              key={region.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="flex items-center gap-3"
            >
              <span className="w-14 text-sm font-medium text-foreground">
                {region.name}
              </span>
              <div className="flex-1 h-6 bg-secondary rounded overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-magenta rounded"
                  initial={{ width: 0 }}
                  animate={{ width: `${region.percentage}%` }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.8, ease: "easeOut" }}
                />
              </div>
              <span className="w-16 text-right text-sm font-semibold text-foreground">
                {formatCurrency(region.value)}
              </span>
              <span
                className={`w-12 text-right text-xs font-medium ${
                  region.trend.startsWith('+')
                    ? 'text-green-600'
                    : 'text-destructive'
                }`}
              >
                {region.trend}
              </span>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Summary Card Component (extracted for reusability)
function SummaryCard() {
  return (
    <Card className="bg-secondary border-0">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <TrendingUp className="h-5 w-5 text-primary" />
          Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3 text-sm text-foreground">
          <li className="flex items-start gap-3">
            <Target className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
            <span>
              <strong>North region leads</strong> with $1.25M (+12% vs Q2)
            </span>
          </li>
          <li className="flex items-start gap-3">
            <TrendingUp className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <span>
              <strong>Total Q3 revenue:</strong> $4.21M (98% to target)
            </span>
          </li>
          <li className="flex items-start gap-3">
            <AlertTriangle className="h-4 w-4 text-gold mt-0.5 flex-shrink-0" />
            <span>
              <strong>West region</strong> requires attention (-8% vs target)
            </span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}

export default function ResponseView({ onBack, prompt, tabType = 'reporting' }: ResponseViewProps) {
  const tabConfig = {
    reporting: { label: 'REPORTING', color: 'bg-primary' },
    crm: { label: 'CRM', color: 'bg-primary' },
    compliance: { label: 'COMPLIANCE', color: 'bg-primary' },
  };

  const currentTab = tabConfig[tabType];
  const responseComponents = getResponseComponents(prompt || '', tabType);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Response Header */}
      <header className={`${currentTab.color} text-primary-foreground px-6 py-3 flex items-center justify-between sticky top-0 z-10`}>
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-primary-foreground hover:bg-dark-mulberry hover:text-primary-foreground gap-2"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </Button>
        <h1 className="text-lg font-semibold tracking-wide">{currentTab.label}</h1>
        <div className="w-20" />
      </header>

      {/* Content */}
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        {/* User Query Echo */}
        {prompt && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-muted-foreground bg-secondary rounded-lg px-4 py-3"
          >
            <span className="font-medium text-foreground">You asked:</span> {prompt}
          </motion.div>
        )}

        {/* Dynamic Response Components based on prompt */}
        {responseComponents.map((Component, index) => (
          <Component key={index} />
        ))}

        {/* Suggested Follow-ups */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="space-y-2"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-xs font-medium text-muted-foreground uppercase tracking-wide"
          >
            Suggested follow-ups
          </motion.p>
          <div className="flex flex-wrap gap-2">
            {(tabType === 'reporting'
              ? ['Break down West region by territory', 'Compare to Q2 performance', 'Show top products in North']
              : tabType === 'crm'
              ? ['Schedule follow-up with Dr. Cortez', 'View contact history for Dr. Chen', 'Export account list to calendar']
              : ['Download full T&E policy guide', 'Report adverse event', 'Submit speaker program request']
            ).map((suggestion, index) => (
              <motion.div
                key={suggestion}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.8 + index * 0.1,
                  type: "spring",
                  stiffness: 400,
                  damping: 20
                }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground hover:shadow-md transition-all"
                >
                  {suggestion}
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <SmartInputDock onSubmit={(text) => console.log('Follow-up:', text)} />
    </div>
  );
}
