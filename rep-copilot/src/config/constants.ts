/**
 * Application Constants
 *
 * Central location for all hardcoded values, magic numbers, and configuration
 * constants. This makes the app easier to maintain and update.
 */

import { env } from "./env";

// ========================================
// App Metadata
// ========================================

export const APP_NAME = "Rep Co-Pilot";
export const APP_VERSION = "0.1.0";
export const APP_DESCRIPTION =
  "Unified AI-powered interface for AstraZeneca Field Representatives";

// ========================================
// Tab Configuration
// ========================================

export const TABS = {
  REPORTING: "reporting",
  CRM: "crm",
  COMPLIANCE: "compliance",
} as const;

export type TabType = (typeof TABS)[keyof typeof TABS];

// ========================================
// AI Configuration
// ========================================

export const AI_CONFIG = {
  // Model settings from environment
  chatModel: env.AI_MODEL_CHAT,
  enhanceModel: env.AI_MODEL_ENHANCE,
  temperatureChat: env.AI_TEMPERATURE_CHAT,
  temperatureEnhance: env.AI_TEMPERATURE_ENHANCE,
  maxTokens: env.AI_MAX_TOKENS,

  // Response streaming
  enableStreaming: true,
  streamChunkSize: 100, // characters per chunk

  // Timeouts (in milliseconds)
  responseTimeout: 30000, // 30 seconds
  connectionTimeout: 10000, // 10 seconds

  // Retry logic
  maxRetries: 3,
  retryDelay: 1000, // ms between retries
} as const;

// ========================================
// Compliance Configuration
// ========================================

export const COMPLIANCE_CONFIG = {
  // Violation detection keywords
  mealSpendKeywords: [
    "expense",
    "$500",
    "$499",
    "$498",
    "dinner",
    "lunch",
    "capital grille",
    "capital grill",
    "meal",
    "reimbursement",
    "food",
    "restaurant",
  ],

  offLabelKeywords: [
    "off-label",
    "off label",
    "unapproved indication",
    "unapproved use",
    "draft an email",
    "write an email",
    "send an email",
    "create an email",
  ],

  // Violation types
  violationTypes: {
    WARNING: "warning", // Show warning, allow override
    STOP: "stop", // Block submission
  } as const,

  // Coaching messages
  messages: {
    mealSpendWarning:
      "This request may involve meal spend reporting. Please ensure you have proper documentation and approval before proceeding.",
    offLabelStop:
      "Off-label promotion is prohibited. This request cannot be processed. Please consult your compliance officer for guidance.",
  },
} as const;

// ========================================
// Performance Requirements
// ========================================

export const PERFORMANCE_TARGETS = {
  // From .cursorrules requirements
  initialLoadTime: 2000, // ms (95th percentile)
  chipPromptResponse: 3000, // ms (95th percentile)
  freeTextResponse: 5000, // ms (95th percentile)
  magicWandEnhancement: 1000, // ms (95th percentile)
  complianceCheck: 500, // ms (99th percentile)

  // Animation durations
  animationDuration: {
    fast: 150, // ms
    normal: 300, // ms
    slow: 500, // ms
  },
} as const;

// ========================================
// UI Configuration
// ========================================

export const UI_CONFIG = {
  // Prompt cards per section
  promptsPerSection: 5,

  // Prompts that should trigger magic wand animation
  magicWandTriggers: ["enhance", "improve", "expand", "elaborate"],

  // Input constraints
  maxPromptLength: 2000, // characters
  minPromptLength: 10, // characters

  // Debounce times (ms)
  debounce: {
    input: 300,
    search: 500,
    complianceCheck: 200,
  },

  // Toast notifications
  toast: {
    duration: 4000, // ms
    position: "bottom",
  },
} as const;

// ========================================
// API Configuration
// ========================================

export const API_CONFIG = {
  // Rate limiting
  rateLimitMax: env.API_RATE_LIMIT_MAX,
  rateLimitWindow: env.API_RATE_LIMIT_WINDOW,

  // Endpoints
  endpoints: {
    enhancePrompt: "/api/enhance-prompt",
    chat: "/api/chat",
    compliance: "/api/compliance",
    analytics: "/api/analytics",
  } as const,

  // HTTP status codes
  statusCodes: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
  } as const,
} as const;

// ========================================
// Logging Configuration
// ========================================

export const LOG_CONFIG = {
  level: env.LOG_LEVEL,
  logToConsole: env.LOG_TO_CONSOLE,

  // Log levels in order of severity
  levels: {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    DEBUG: 3,
  } as const,

  // Whether to include stack traces
  includeStackTraces: env.NEXT_PUBLIC_APP_ENV === "development",
} as const;

// ========================================
// Feature Flag Defaults (Fallback)
// ========================================

export const FEATURE_FLAGS = {
  // Coaching mode (can be overridden by env)
  coachingEnabled: env.NEXT_PUBLIC_COACHING_MODE_DEFAULT,

  // Strict compliance mode
  strictCompliance: env.NEXT_PUBLIC_COMPLIANCE_CHECK_STRICT_MODE === "strict",

  // Experimental features (disabled by default)
  experimentalCharts: false,
  advancedAnalytics: false,
  multiLanguageSupport: false,

  // Integrations (optional features)
  snowflakeIntegration: !!env.SNOWFLAKE_ACCOUNT,
  veevaIntegration: !!env.VEEVA_VAULT_URL,
  complianceDbIntegration: !!env.COMPLIANCE_DB_HOST,
} as const;

// ========================================
// Error Messages
// ========================================

export const ERROR_MESSAGES = {
  // API errors
  API_ERROR: "Something went wrong. Please try again.",
  RATE_LIMITED: "Too many requests. Please wait a moment.",
  UNAUTHORIZED: "You're not authorized to perform this action.",

  // Validation errors
  PROMPT_TOO_SHORT: `Prompt must be at least ${UI_CONFIG.minPromptLength} characters.`,
  PROMPT_TOO_LONG: `Prompt must be less than ${UI_CONFIG.maxPromptLength} characters.`,
  INVALID_INPUT: "Please check your input and try again.",

  // Network errors
  NETWORK_ERROR: "Network error. Please check your connection.",
  TIMEOUT: "Request timed out. Please try again.",

  // Compliance errors
  COMPLIANCE_VIOLATION: "This request violates compliance policy.",
} as const;

// ========================================
// Success Messages
// ========================================

export const SUCCESS_MESSAGES = {
  PROMPT_ENHANCED: "Prompt enhanced successfully!",
  FEEDBACK_SUBMITTED: "Thank you for your feedback!",
  SETTINGS_SAVED: "Settings saved successfully.",
} as const;

// ========================================
// Analytics Events
// ========================================

export const ANALYTICS_EVENTS = {
  // User interactions
  TAB_SELECTED: "tab_selected",
  PROMPT_CLICKED: "prompt_clicked",
  PROMPT_SUBMITTED: "prompt_submitted",

  // AI features
  MAGIC_WAND_USED: "magic_wand_used",
  RESPONSE_RECEIVED: "response_received",
  FOLLOW_UP_SUBMITTED: "follow_up_submitted",

  // Compliance
  COMPLIANCE_CHECK_TRIGGERED: "compliance_check_triggered",
  COMPLIANCE_VIOLATION_DETECTED: "compliance_violation_detected",
  COACHING_TOGGLED: "coaching_toggled",

  // Errors
  ERROR_OCCURRED: "error_occurred",
} as const;

// ========================================
// Export all as a single object for convenience
// ========================================

export const CONFIG = {
  app: {
    name: APP_NAME,
    version: APP_VERSION,
    description: APP_DESCRIPTION,
  },
  tabs: TABS,
  ai: AI_CONFIG,
  compliance: COMPLIANCE_CONFIG,
  performance: PERFORMANCE_TARGETS,
  ui: UI_CONFIG,
  api: API_CONFIG,
  logging: LOG_CONFIG,
  features: FEATURE_FLAGS,
  errors: ERROR_MESSAGES,
  success: SUCCESS_MESSAGES,
  analytics: ANALYTICS_EVENTS,
} as const;
