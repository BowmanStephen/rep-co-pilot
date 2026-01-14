/**
 * Example: Integrating Widget System into ResponseView.tsx
 *
 * This file shows how to replace the static components in ResponseView.tsx
 * with dynamic widget injection from the AI API.
 *
 * Migration steps:
 * 1. Import widget components
 * 2. Replace static data with widget configs
 * 3. Render widgets with WidgetContainer
 * 4. Handle widget actions (form submissions, button clicks)
 */

'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SmartInputDock from './SmartInputDock';
import { WidgetContainer, WidgetConfig } from '@/widgets';

/**
 * Simulated AI response with widget configs
 * In production, this comes from your AI API
 */
interface AIResponse {
  textResponse: string;
  widgets: WidgetConfig[];
}

// Example AI responses for each tab type
const exampleResponses: Record<string, AIResponse> = {
  reporting: {
    textResponse: "Here's your Q3 sales performance breakdown. The North region is leading with $1.25M in revenue (+12% vs Q2). However, the West region requires attention as it's below target.",
    widgets: [
      {
        id: 'q3-sales-chart',
        type: 'chart',
        title: 'Q3 SALES BY REGION',
        expanded: true,
        data: {
          chartType: 'progress',
          data: [
            { name: 'North', value: 1250000, percentage: 100, trend: '+12%' },
            { name: 'East', value: 1100000, percentage: 88, trend: '+8%' },
            { name: 'South', value: 980000, percentage: 78, trend: '+3%' },
            { name: 'West', value: 875000, percentage: 70, trend: '-8%' },
          ],
          showTrend: true,
        },
      },
      {
        id: 'below-target-alert',
        type: 'alert',
        data: {
          severity: 'warning',
          title: 'West Region Below Target',
          message: 'The West region is at $875K, which is 20.5% below target of $1.1M. Consider scheduling additional visits or reviewing territory allocation.',
          actions: [
            { label: 'View Territory Details', onClick: () => {}, variant: 'outline' },
            { label: 'Schedule Follow-up', onClick: () => {}, variant: 'primary' },
          ],
          dismissible: true,
        },
      },
    ],
  },
  crm: {
    textResponse: "Here are your top 5 priority accounts. Dr. Sarah Cortez shows the highest opportunity at $45K. I've included a quick call logging form for follow-ups.",
    widgets: [
      {
        id: 'top-accounts-table',
        type: 'table',
        title: 'TOP 5 PRIORITY ACCOUNTS',
        expanded: false,
        data: {
          columns: [
            { key: 'name', label: 'Account', type: 'text', sortable: true },
            { key: 'specialty', label: 'Specialty', type: 'text' },
            { key: 'priority', label: 'Priority', type: 'badge' },
            { key: 'lastContact', label: 'Last Contact', type: 'text' },
            { key: 'opportunity', label: 'Opportunity', type: 'currency' },
            { key: 'status', label: 'Status', type: 'text' },
          ],
          rows: [
            { name: 'Dr. Sarah Cortez', specialty: 'Oncology', priority: 'High', lastContact: '2 days ago', opportunity: 45000, status: 'Proposal Stage' },
            { name: 'Dr. Michael Chen', specialty: 'Cardiology', priority: 'High', lastContact: '5 days ago', opportunity: 32000, status: 'Discovery' },
            { name: 'Dr. Emily Watson', specialty: 'Pulmonology', priority: 'Medium', lastContact: '1 week ago', opportunity: 28000, status: 'Negotiation' },
            { name: 'Dr. James Wilson', specialty: 'Oncology', priority: 'Medium', lastContact: '3 days ago', opportunity: 21000, status: 'Proposal Stage' },
            { name: 'Dr. Lisa Anderson', specialty: 'Cardiology', priority: 'High', lastContact: '1 day ago', opportunity: 38000, status: 'Discovery' },
          ],
          sortable: true,
          exportable: true,
          pageSize: 5,
        },
      },
      {
        id: 'call-log-form',
        type: 'form',
        title: 'QUICK CALL LOG',
        data: {
          fields: [
            {
              name: 'account',
              label: 'Select Account',
              type: 'select',
              required: true,
              options: [
                { value: 'cortez', label: 'Dr. Sarah Cortez' },
                { value: 'chen', label: 'Dr. Michael Chen' },
                { value: 'watson', label: 'Dr. Emily Watson' },
                { value: 'wilson', label: 'Dr. James Wilson' },
                { value: 'anderson', label: 'Dr. Lisa Anderson' },
              ],
            },
            {
              name: 'date',
              label: 'Call Date',
              type: 'date',
              required: true,
              defaultValue: new Date().toISOString().split('T')[0],
            },
            {
              name: 'outcome',
              label: 'Call Outcome',
              type: 'select',
              required: true,
              options: [
                { value: 'positive', label: 'Positive Interest' },
                { value: 'neutral', label: 'Neutral / Follow-up Required' },
                { value: 'negative', label: 'Not Interested' },
              ],
            },
            {
              name: 'notes',
              label: 'Call Notes',
              type: 'textarea',
              placeholder: 'Key discussion points, next steps, concerns raised...',
              required: true,
            },
          ],
          submitLabel: 'Log Call',
          cancelLabel: 'Cancel',
        },
      },
    ],
  },
  compliance: {
    textResponse: "Here's a quick reference for compliance policies. Remember: Off-label promotion is strictly prohibited and must be routed to Medical Affairs.",
    widgets: [
      {
        id: 'compliance-policies-table',
        type: 'table',
        title: 'COMPLIANCE POLICY QUICK REFERENCE',
        expanded: false,
        data: {
          columns: [
            { key: 'category', label: 'Category', type: 'text', sortable: true },
            { key: 'limit', label: 'Limit', type: 'text' },
            { key: 'details', label: 'Details', type: 'text' },
            { key: 'lastUpdated', label: 'Last Updated', type: 'text' },
          ],
          rows: [
            { category: 'Meal Spend', limit: '$125 per HCP', details: 'Including tax and gratuity. Requires documented business purpose.', lastUpdated: 'Jan 2025' },
            { category: 'Honorarium', limit: '$250 per engagement', details: 'Speaker programs must be pre-approved through CAP system.', lastUpdated: 'Dec 2024' },
            { category: 'Off-Label', limit: 'Not permitted', details: 'Route unsolicited requests to Medical Affairs MIR process.', lastUpdated: 'Nov 2024' },
            { category: 'Adverse Events', limit: 'Report within 24h', details: 'Call PVCS hotline: 1-800-AZ-SAFE. Document in CRM.', lastUpdated: 'Jan 2025' },
          ],
          sortable: true,
          pageSize: 10,
        },
      },
      {
        id: 'off-label-warning',
        type: 'alert',
        data: {
          severity: 'error',
          title: 'Off-Label Promotion Policy',
          message: 'Promotion of off-label uses is strictly prohibited. If an HCP asks about off-label use, route the request to Medical Affairs through the MIR process. Do not provide any information about unapproved indications.',
          actions: [
            { label: 'View Full Policy', onClick: () => {}, variant: 'outline' },
            { label: 'Submit MIR Request', onClick: () => {}, variant: 'primary' },
          ],
          dismissible: false,
        },
      },
    ],
  },
};

interface ResponseViewWithWidgetsProps {
  onBack: () => void;
  prompt?: string;
  tabType?: 'reporting' | 'crm' | 'compliance';
}

export default function ResponseViewWithWidgets({ onBack, prompt, tabType = 'reporting' }: ResponseViewWithWidgetsProps) {
  const [aiResponse] = useState<AIResponse>(exampleResponses[tabType]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle widget actions (form submissions, button clicks, etc.)
  const handleWidgetAction = async (action: string, data?: any) => {
    console.log('Widget action:', action, data);

    switch (action) {
      case 'submit':
        // Handle form submission
        setIsSubmitting(true);
        try {
          // TODO: Submit to backend API
          console.log('Submitting form data:', data);
          alert('Call logged successfully!');
        } catch (error) {
          console.error('Error submitting form:', error);
          alert('Failed to log call. Please try again.');
        } finally {
          setIsSubmitting(false);
        }
        break;

      case 'export':
        // Handle table export
        console.log('Exporting data:', data);
        alert('Exporting data...');
        break;

      case 'action-clicked':
        // Handle alert button clicks
        console.log('Button clicked:', data.action);
        alert(`${data.action} action triggered`);
        break;

      case 'dismiss':
        // Handle alert dismissal
        console.log('Alert dismissed');
        break;

      default:
        console.log('Unknown action:', action);
    }
  };

  const tabConfig = {
    reporting: { label: 'REPORTING', color: 'bg-primary' },
    crm: { label: 'CRM', color: 'bg-primary' },
    compliance: { label: 'COMPLIANCE', color: 'bg-primary' },
  };

  const currentTab = tabConfig[tabType];

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
          <div className="text-sm text-muted-foreground bg-secondary rounded-lg px-4 py-3">
            <span className="font-medium text-foreground">You asked:</span> {prompt}
          </div>
        )}

        {/* AI Text Response */}
        <div className="text-foreground leading-relaxed">
          {aiResponse.textResponse}
        </div>

        {/* Injected Widgets */}
        <WidgetContainer
          widgets={aiResponse.widgets}
          onAction={handleWidgetAction}
        />
      </div>

      <SmartInputDock
        onSubmit={(text) => console.log('Follow-up:', text)}
        disabled={isSubmitting}
      />
    </div>
  );
}

/**
 * MIGRATION CHECKLIST:
 *
 * To migrate from static ResponseView.tsx to this widget-based version:
 *
 * ✅ 1. Import widget components: import { WidgetContainer } from '@/widgets'
 * ✅ 2. Define AI response type with widgets array
 * ✅ 3. Replace static components with widget configs
 * ✅ 4. Add widget action handler
 * ✅ 5. Replace static component renders with <WidgetContainer>
 * ✅ 6. Remove old component files (TopProductsCard, CRMAccountsList, etc.)
 *
 * NEXT STEPS:
 * - Connect to real AI API endpoint
 * - Add loading/skeleton states
 * - Handle widget validation errors
 * - Add analytics tracking for widget interactions
 */
