/**
 * Configuration System Entry Point
 *
 * Exports all configuration modules for easy importing.
 *
 * Usage:
 *   import { env, isDevelopment, isProduction } from "@/config"
 *   import { CONFIG, PERFORMANCE_TARGETS } from "@/config"
 *   import { flags, isFeatureEnabled } from "@/config"
 */

// Export environment configuration
export { env, isDevelopment, isProduction, isStaging, isStrictComplianceMode } from "./env";
export type { Env } from "./env";

// Export constants
export { CONFIG } from "./constants";
export {
  APP_NAME,
  APP_VERSION,
  APP_DESCRIPTION,
  TABS,
  AI_CONFIG,
  COMPLIANCE_CONFIG,
  PERFORMANCE_TARGETS,
  UI_CONFIG,
  API_CONFIG,
  LOG_CONFIG,
  FEATURE_FLAGS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  ANALYTICS_EVENTS,
} from "./constants";
export type { TabType } from "./constants";

// Export feature flags
export {
  flags,
  isFeatureEnabled,
  setFeatureEnabled,
  getAllFlags,
  logFeatureFlags,
  getEnabledIntegrations,
  getExperimentalFlags,
  hasExperimentalFeatures,
  validateFeatureFlagDependencies,
  validateFeatureFlags,
} from "./featureFlags";
export type { FeatureFlags, FeatureFlagName } from "./featureFlags";
