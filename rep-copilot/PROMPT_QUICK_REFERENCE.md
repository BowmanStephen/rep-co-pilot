# Prompt Quick Reference Guide

**For:** AstraZeneca Field Representatives
**Version:** Q3 2025
**Last Updated:** January 14, 2026

---

## 🎯 Three Primary Use Cases

### 1. Reporting Tab 📊
**Use for:** Sales performance, territory analytics, prescription trends

**Example Queries:**
- "Show me this quarter's sales performance by region"
- "What are the top 5 prescribed products in my territory?"
- "What's driving the 22% growth in Imfinzi?"
- "Why is West territory down 8%?"
- "Highlight areas with below-target sales"

**What You'll Get:**
- Regional breakdown tables
- Product performance metrics
- Trend analysis with explanations
- Actionable next steps
- Related metric suggestions

---

### 2. CRM Tab 👥
**Use for:** Account prioritization, HCP relationships, scheduling

**Example Queries:**
- "Who are my top 10 accounts to prioritize this week?"
- "What is the recent activity history for Dr. Sarah Cortez?"
- "Schedule a follow-up meeting with Dr. Sarah Cortez"
- "Show me open opportunities and their stages"
- "What should I prepare for my meeting with Dr. Chen?"

**What You'll Get:**
- Prioritized account lists (with urgency indicators)
- Activity timelines
- Opportunity summaries
- Call preparation tips
- Scheduling scripts and email templates

---

### 3. Compliance Tab ⚖️
**Use for:** Policy questions, spending limits, procedures

**Example Queries:**
- "Meal Spend Limit for a lunch with HCP?"
- "What are the guidelines for off-label discussions?"
- "Explain the proper procedure for adverse event reporting"
- "What's the Speaker Chairperson Honorarium limit?"
- "View the latest Compliance Policy updates"

**What You'll Get:**
- Exact policy limits and numbers
- Clear warning signs (⚠️) and stops (🛑)
- Step-by-step procedures
- Compliant alternatives
- Documentation requirements

---

## 🚨 Quick Compliance Reference

### Spending Limits

| Category | Limit | Notes |
|----------|-------|-------|
| **Meal (HCP)** | $125/person | Includes tax & tip |
| **Meal (Non-HCP Staff)** | $75/person | Support staff only |
| **Annual HCP Cap** | $1,350/HCP/year | YTD tracking required |
| **Speaker Honorarium** | $250/engagement | CAP approval required |

### Prohibited Activities 🛑

- ❌ Off-label discussions (commercial teams)
- ❌ Remuneration for prescriptions
- ❌ Lavish entertainment (sports, concerts)
- ❌ Gifts to HCPs (pens, mugs, etc.)
- ❌ Non-educational items

### Required Reporting

| Event | Timeframe | Contact |
|-------|-----------|---------|
| **Adverse Event** | 24 hours | 1-800-AZ-SAFE |
| **Product Complaint** | 72 hours | Quality System |
| **Off-Label Inquiry** | Immediate | Medical Affairs (MIR) |
| **Compliance Concern** | Immediate | 1-800-AZ-ETHICS |

---

## 🎨 Response Formats

### Reporting Response Structure

```
## [Title]

**Executive Summary:** [2-3 sentences with key finding]

### [Section Name]

| Metric | Value | Change |
|--------|-------|--------|

### Key Insights

- **Bold metric** with context
- Another insight with explanation

### Action Items

1. 🔴 Priority item
2. ✅ Best practice to replicate
3. 📊 Metric to track

### Suggested Follow-ups

- "Related query 1"
- "Related query 2"
```

### CRM Response Structure

```
## [Account Name / Topic]

**Quick Profile:** [Specialty, practice, relationship status]

### [Section Name]

| HCP | Specialty | Opp Value | Last Contact | Urgency |
|-----|-----------|-----------|--------------|---------|
| Dr. Name | Specialty | $XX | Date | 🔴/🟡/🟢 |

### Preparation Tips

- [ ] Item to bring
- [ ] Another item
- [ ] Important data

### Suggested Actions

1. ✅ Immediate action
2. 📦 Task to complete
3. 📊 Follow-up item
```

### Compliance Response Structure

```
## [Policy Topic]

**Direct Answer:** [Clear, unambiguous statement]

### What's Included / Not Included

✅ Covers:
- Item 1
- Item 2

❌ Does NOT cover:
- Item 1
- Item 2

### Practical Examples

| Scenario | Cost | Compliant? |
|----------|------|------------|
| Example 1 | $XX | ✅/🛑 |

### Documentation Requirements

1. [Required item]
2. [Another requirement]

### Quick Reference Card

✅ COMPLIANT:
- "Example" ✅

🛑 NOT COMPLIANT:
- "Example" 🛑
```

---

## 🔧 Coaching Mode

When enabled (default), the AI will:

✅ **Detect potential compliance issues** before answering
✅ **Flag violations** with ⚠️ (warning) or 🛑 (stop)
✅ **Suggest compliant alternatives**
✅ **Provide helpful, supportive guidance** (not punitive)

**Example:**

**Query:** "Draft an email to Dr. Cortez about off-label Tagrisso use"

**Response with Coaching:**
> 🛑 COMPLIANCE ALERT: I cannot and will not help draft emails discussing off-label uses...
>
> What I CAN help with:
> - Drafting a MIR submission to Medical Affairs
> - Preparing talking points for approved indications
> - Creating follow-up emails about on-label topics

---

## 📱 Pro Tips

### Getting Better Responses

1. **Be specific:** "Show me Q3 sales by region" > "Show me sales"
2. **Include context:** "Why is West territory down 8%?" includes the metric
3. **Ask for action:** "What should I do about X?" vs just "What is X?"
4. **Use follow-ups:** AI suggests related queries at the end of responses

### Understanding the Indicators

**Urgency (CRM):**
- 🔴 **High** - Visit this week
- 🟡 **Medium** - Schedule this week
- 🟢 **Low** - Follow up when convenient

**Compliance:**
- ✅ **COMPLIANT** - You're good to go
- ⚠️ **CAUTION** - Potential issue, proceed carefully
- 🛑 **STOP** - Hard violation, must not proceed

### When in Doubt

**Compliance questions:**
- Contact: compliance@astrazeneca.com
- EthicsLine: 1-800-AZ-ETHICS (anonymous)

**Technical issues:**
- Report bugs through your manager
- Include: Query text, expected response, actual response

---

## 🔄 Quarterly Updates

This quick reference is updated **quarterly** with:

- New time periods (Q3 2025 → Q4 2025)
- Updated sales metrics
- New product additions
- Policy changes

**Next Update:** October 2025 (Q4 data)

---

## 📚 Full Documentation

For detailed information, see:
- **PROMPT_STRATEGY.md** - Technical prompt engineering details
- **Rep Copilot PRD.md** - Product requirements
- **CLAUDE.md** - Project architecture and patterns

---

**Questions?** Ask your field manager or contact the Rep Co-Pilot team.

**Version:** 1.0.0 | **Status:** Production Ready ✅
