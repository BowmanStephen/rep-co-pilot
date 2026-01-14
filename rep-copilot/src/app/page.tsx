'use client';

import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Header from '@/components/Header';
import TabBar, { TabType } from '@/components/TabBar';
import PromptCard from '@/components/PromptCard';
import SmartInputDock from '@/components/SmartInputDock';
import StreamingResponseView from '@/components/StreamingResponseView';
import CoachingCard, { CoachingCardProps } from '@/components/CoachingCard';
import ContextStatusBar from '@/components/ContextStatusBar';
import { useAppContext } from '@/services/contextDetection';

// Compliance trigger words (module-level constants, created once) ✅
const MEAL_SPEND_TRIGGERS = ['expense', '$500', 'dinner', 'capital grille', 'lunch with', 'take dr'] as const;
const OFF_LABEL_TRIGGERS = ['off-label', 'unapproved indication', 'unapproved tumor', 'draft an email', 'draft email'] as const;

// Compliance detection result type
interface CoachingResult {
  type: 'warning' | 'stop';
  header: string;
  body: string;
  suggestion: string;
  actions: CoachingCardProps['actions'];
}

// Detects compliance violations in user queries
function checkCompliance(query: string): CoachingResult | null {
  const lowerQuery = query.toLowerCase();

  // Scenario A: Meal spend triggers (uses module-level constants) ✅
  const hasMealSpendViolation = MEAL_SPEND_TRIGGERS.some(trigger => lowerQuery.includes(trigger));

  if (hasMealSpendViolation && (lowerQuery.includes('$') || lowerQuery.includes('expense'))) {
    return {
      type: 'warning',
      header: 'Spend Limit Alert',
      body: 'A $500 expense exceeds the allowable Meal Cap for an individual HCP interaction (currently $125.00 per person including tax & tip). Submitting this would trigger a compliance audit.',
      suggestion: 'Would you like to see a list of nearby restaurants rated \'$$\' that typically fall within the approved spend limit?',
      actions: [
        { label: 'Find Compliant Venues', variant: 'primary' },
        { label: 'View Global T&E Policy', variant: 'secondary' },
      ],
    };
  }

  // Scenario B: Off-label triggers (uses module-level constants) ✅
  const hasOffLabelViolation = OFF_LABEL_TRIGGERS.some(trigger => lowerQuery.includes(trigger));

  if (hasOffLabelViolation) {
    return {
      type: 'stop',
      header: 'Off-Label Discussion Guardrail',
      body: 'You are initiating a conversation regarding an unapproved indication. Commercial teams cannot proactively share off-label data.',
      suggestion: 'If Dr. Cortez specifically asked for this data, this must be handled as an Unsolicited Medical Information Request (MIR) and routed to the Medical Affairs team.',
      actions: [
        { label: 'Log as Medical Request (MIR)', variant: 'primary' },
        { label: 'Cancel Draft', variant: 'secondary' },
      ],
    };
  }

  return null;
}

const prompts: Record<TabType, string[]> = {
  reporting: [
    "Show me this quarter's sales performance by region.",
    'Provide the top 5 prescribed products in my territory.',
    'What are the monthly trends in prescription volumes?',
    "Generate a report comparing last month's and this month's sales.",
    'Highlight areas with below-target sales.',
  ],
  crm: [
    'Who are my top 10 accounts to prioritize this week?',
    'What is the recent activity history for Dr. John Doe?',
    'Schedule a follow-up meeting with Dr. John Doe.',
    'Show me open opportunities and their stages.',
    'Provide contact details and notes for healthcare providers in my region.',
  ],
  compliance: [
    'What are the guidelines for off-label discussions?',
    'Meal Spend Limit for a lunch with HCP?',
    'What is the Speaker Chairperson Honorarium limit?',
    'Explain the proper procedure for adverse event reporting.',
    'View the latest Compliance Policy updates.',
  ],
};

const sectionDescriptions: Record<TabType, string> = {
  reporting: 'Sales analytics, performance metrics, and territory insights',
  crm: 'Account management, scheduling, and relationship tracking',
  compliance: 'Policy guidelines, spending limits, and procedures',
};

export default function Home() {
  // Context detection service is available but not currently displayed
  useAppContext();

  const [activeTab, setActiveTab] = useState<TabType>('reporting');
  const [showResponse, setShowResponse] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<string>('');
  const [coachingEnabled, setCoachingEnabled] = useState(true);
  const [coachingResult, setCoachingResult] = useState<CoachingResult | null>(null);

  // Memoize prompt list to reduce re-renders on tab change ✅
  const currentPrompts = useMemo(() => {
    return prompts[activeTab].map((prompt, index) => ({
      text: prompt,
      tabType: activeTab,
      index,
      key: `${activeTab}-${index}`
    }));
  }, [activeTab]); // Only recompute when tab changes

  const handlePromptClick = (prompt: string) => {
    setSelectedPrompt(prompt);
    
    // Check compliance if coaching is enabled
    if (coachingEnabled) {
      const result = checkCompliance(prompt);
      if (result) {
        setCoachingResult(result);
        return;
      }
    }
    
    // Navigate to streaming response view immediately
    setShowResponse(true);
  };

  const handleSubmit = (text: string) => {
    setSelectedPrompt(text);
    
    // Check compliance if coaching is enabled
    if (coachingEnabled) {
      const result = checkCompliance(text);
      if (result) {
        setCoachingResult(result);
        return;
      }
    }
    
    // Navigate to streaming response view immediately
    setShowResponse(true);
  };

  const handleDismissCoaching = () => {
    setCoachingResult(null);
    setSelectedPrompt('');
  };

  if (showResponse) {
    return (
      <StreamingResponseView
        onBack={() => {
          setShowResponse(false);
          setSelectedPrompt('');
        }}
        initialPrompt={selectedPrompt}
        tabType={activeTab}
        coachingEnabled={coachingEnabled}
        onCoachingChange={setCoachingEnabled}
      />
    );
  }

  // Coaching Mode - Show coaching card when compliance violation detected
  if (coachingResult) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-background pb-28">
        <Header />
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

        <main className="max-w-3xl mx-auto px-6 py-8">
          {/* User Query Echo */}
          {selectedPrompt && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-muted-foreground bg-secondary rounded-lg px-4 py-3 mb-6"
            >
              <span className="font-medium text-foreground">You asked:</span> {selectedPrompt}
            </motion.div>
          )}

          <CoachingCard
            type={coachingResult.type}
            header={coachingResult.header}
            body={coachingResult.body}
            suggestion={coachingResult.suggestion}
            actions={coachingResult.actions}
            onDismiss={handleDismissCoaching}
          />
        </main>

        <SmartInputDock 
          onSubmit={handleSubmit}
          coachingEnabled={coachingEnabled}
          onCoachingChange={setCoachingEnabled}
        />
      </div>
    );
  }

  // Note: Loading state is now handled within StreamingResponseView

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/30 to-background pb-28">
      <Header />
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Context Status Bar - Shows dynamic content based on context */}
      <ContextStatusBar />

      {/* Section Description with animation */}
      <motion.div
        key={`description-${activeTab}`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-3xl mx-auto px-6 mb-2"
      >
        <p className="text-sm text-muted-foreground text-center">
          {sectionDescriptions[activeTab]}
        </p>
      </motion.div>

      {/* Prompts List with staggered animation */}
      <main className="max-w-3xl mx-auto px-6 py-4 space-y-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
              >
                Quick prompts
              </motion.p>
              <motion.span
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xs text-muted-foreground"
              >
                {prompts[activeTab].length} suggestions
              </motion.span>
            </div>
            <div className="space-y-3">
              {currentPrompts.map((props) => (
                <PromptCard
                  key={props.key}
                  text={props.text}
                  tabType={props.tabType}
                  index={props.index}
                  onClick={() => handlePromptClick(props.text)}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      <SmartInputDock
        onSubmit={handleSubmit}
        coachingEnabled={coachingEnabled}
        onCoachingChange={setCoachingEnabled}
      />
    </div>
  );
}
