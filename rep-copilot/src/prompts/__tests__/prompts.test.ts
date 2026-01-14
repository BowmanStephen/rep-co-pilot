/**
 * Test file to verify prompt enhancements
 *
 * Run with: npm test -- prompts.test.ts
 */

import { PROMPT_CONFIGS } from '../index';

describe('Prompt Configurations', () => {
  describe('Reporting Prompts', () => {
    const config = PROMPT_CONFIGS.reporting;

    test('should have system prompt with required context', () => {
      expect(config.systemPrompt).toContain('Tagrisso');
      expect(config.systemPrompt).toContain('Lynparza');
      expect(config.systemPrompt).toContain('Q3 2025');
      expect(config.systemPrompt).toContain('Northeast US');
    });

    test('should include response format guidelines', () => {
      expect(config.systemPrompt).toContain('Executive Summary');
      expect(config.systemPrompt).toContain('Action Items');
      expect(config.systemPrompt).toContain('Key Insights');
    });

    test('should have 3 few-shot examples', () => {
      expect(config.fewShots).toHaveLength(3);
      expect(config.fewShots[0].query).toBeDefined();
      expect(config.fewShots[0].response).toBeDefined();
    });

    test('few-shot examples should include specific numbers', () => {
      const examples = config.fewShots.join(' ');
      expect(examples).toContain('$1.25M');
      expect(examples).toContain('+12%');
      expect(examples).toContain('98%');
    });
  });

  describe('CRM Prompts', () => {
    const config = PROMPT_CONFIGS.crm;

    test('should have system prompt with HCP context', () => {
      expect(config.systemPrompt).toContain('Dr. Sarah Cortez');
      expect(config.systemPrompt).toContain('Dr. Michael Chen');
      expect(config.systemPrompt).toContain('$45K');
      expect(config.systemPrompt).toContain('Opportunity Pipeline');
    });

    test('should include relationship tracking guidance', () => {
      expect(config.systemPrompt).toContain('Last Contact');
      expect(config.systemPrompt).toContain('Preparation Tips');
      expect(config.systemPrompt).toContain('Suggested Actions');
    });

    test('should have 3 few-shot examples', () => {
      expect(config.fewShots).toHaveLength(3);
      expect(config.fewShots[0].query).toContain('prioritize');
      expect(config.fewShots[1].query).toContain('Cortez');
    });

    test('few-shot examples should include account details', () => {
      const examples = config.fewShots.join(' ');
      expect(examples).toContain('Oncology');
      expect(examples).toContain('Cardiology');
      expect(examples).toContain('Memorial Sloan Kettering');
    });
  });

  describe('Compliance Prompts', () => {
    const config = PROMPT_CONFIGS.compliance;

    test('should have system prompt with spending limits', () => {
      expect(config.systemPrompt).toContain('$125');
      expect(config.systemPrompt).toContain('Meal Spend');
      expect(config.systemPrompt).toContain('Off-Label');
      expect(config.systemPrompt).toContain('Adverse Event');
    });

    test('should include reporting requirements', () => {
      expect(config.systemPrompt).toContain('24 hours');
      expect(config.systemPrompt).toContain('PVCS');
      expect(config.systemPrompt).toContain('1-800-AZ-SAFE');
    });

    test('should have 3 few-shot examples', () => {
      expect(config.fewShots).toHaveLength(3);
      expect(config.fewShots[0].query).toContain('Meal Spend');
      expect(config.fewShots[1].query).toContain('off-label');
      expect(config.fewShots[2].query).toContain('Adverse Event');
    });

    test('few-shot examples should include warnings and stops', () => {
      const examples = config.fewShots.join(' ');
      expect(examples).toContain('⚠️');
      expect(examples).toContain('🛑');
      expect(examples).toContain('Capital Grill');
      expect(examples).toContain('COMPLIANCE ALERT');
    });
  });

  describe('Token Limits', () => {
    test('all prompts should be under 2000 tokens', () => {
      Object.values(PROMPT_CONFIGS).forEach((config) => {
        // Rough estimate: 1 token ≈ 4 characters
        const estimatedTokens = config.systemPrompt.length / 4;
        expect(estimatedTokens).toBeLessThan(2000);
      });
    });
  });

  describe('Data Context', () => {
    test('all configs should have dataContext', () => {
      Object.values(PROMPT_CONFIGS).forEach((config) => {
        expect(config.dataContext).toBeDefined();
        expect(config.dataContext.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Style Guidelines', () => {
    test('prompts should include empathy markers', () => {
      expect(PROMPT_CONFIGS.reporting.systemPrompt).toContain('empathy');
      expect(PROMPT_CONFIGS.crm.systemPrompt).toContain('relationship');
      expect(PROMPT_CONFIGS.compliance.systemPrompt).toContain('education');
    });

    test('compliance prompt should be authoritative but supportive', () => {
      const compliance = PROMPT_CONFIGS.compliance.systemPrompt;
      expect(compliance).toContain('guardrail');
      expect(compliance).toContain('caution');
      expect(compliance).toContain('celebrate');
    });
  });
});

/**
 * Manual Test Queries for Each Tab
 *
 * REPORTING:
 * 1. "Show me this quarter's sales performance by region"
 * 2. "What's driving the 22% growth in Imfinzi?"
 * 3. "Why is West territory down 8%?"
 *
 * CRM:
 * 1. "Who are my top 10 accounts to prioritize this week?"
 * 2. "What is the recent activity history for Dr. Sarah Cortez?"
 * 3. "Schedule a follow-up meeting with Dr. Sarah Cortez"
 *
 * COMPLIANCE:
 * 1. "Meal Spend Limit for a lunch with HCP?"
 * 2. "What are the guidelines for off-label discussions?"
 * 3. "Explain the proper procedure for adverse event reporting"
 * 4. "Draft an email to Dr. Cortez about off-label Tagrisso use" (STOP test)
 */
