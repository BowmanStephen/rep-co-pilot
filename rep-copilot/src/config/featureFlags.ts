/**
 * Feature Flags System
 *
 * Provides runtime feature toggling for gradual rollouts, A/B testing, and
 * experimental features.
 *
 * Usage:
 *   import { flags } from "@/config/featureFlags"
 *   if (flags.enableAdvancedAnalytics) {
 *     // Show advanced analytics
 *   }
 */

import { env } from "./env";

// ========================================
// Feature Flag Schema
// ========================================

export interface FeatureFlags {
  // Coaching & Compliance
  enableCoaching: boolean;
  enableStrictCompliance: boolean;
  enableComplianceAnalytics: boolean;

  // AI Features
  enableMagicWand: boolean;
  enableStreamingResponses: boolean;
  enableFollowUpSuggestions: boolean;
  enablePromptHistory: boolean;

  // UI Features
  enableCharts: boolean;
  enableDataVisualization: boolean;
  enableDarkMode: boolean;
  enableCompactMode: boolean;

  // Integrations
  enableSnowflakeIntegration: boolean;
  enableVeevaIntegration: boolean;
  enableComplianceDbIntegration: boolean;

  // Experimental (disabled by default)
  experimentalMultiLanguage: boolean;
  experimentalVoiceInput: boolean;
  experimentalOfflineMode: boolean;
  experimentalAdvancedAnalytics: boolean;
}

// ========================================
// Feature Flag Implementation
// ========================================

/**
 * Core feature flags derived from environment variables
 *
 * Priority:
 * 1. Environment variable (highest)
 * 2. Hardcoded default
 * 3. false (safest default for experimental features)
 */
export const flags: FeatureFlags = {
  // ========================================
  // Coaching & Compliance (from env)
  // ========================================
  enableCoaching: env.NEXT_PUBLIC_COACHING_MODE_DEFAULT,
  enableStrictCompliance:
    env.NEXT_PUBLIC_COMPLIANCE_CHECK_STRICT_MODE === "strict",
  enableComplianceAnalytics: true, // Always enabled for monitoring

  // ========================================
  // AI Features (from env + defaults)
  // ========================================
  enableMagicWand: true,
  enableStreamingResponses: true,
  enableFollowUpSuggestions: true,
  enablePromptHistory: false, // Coming soon

  // ========================================
  // UI Features (from env + defaults)
  // ========================================
  enableCharts: false, // Requires data source
  enableDataVisualization: false, // Requires data source
  enableDarkMode: false, // Coming soon
  enableCompactMode: false, // Coming soon

  // ========================================
  // Integrations (auto-detect from env)
  // ========================================
  enableSnowflakeIntegration: !!env.SNOWFLAKE_ACCOUNT,
  enableVeevaIntegration: !!env.VEEVA_VAULT_URL,
  enableComplianceDbIntegration: !!env.COMPLIANCE_DB_HOST,

  // ========================================
  // Experimental (off by default)
  // ========================================
  experimentalMultiLanguage: false,
  experimentalVoiceInput: false,
  experimentalOfflineMode: false,
  experimentalAdvancedAnalytics: false,
};

// ========================================
// Feature Flag Helpers
// ========================================

/**
 * Check if a specific feature is enabled
 *
 * @param feature - Feature flag name
 * @returns true if feature is enabled
 *
 * @example
 * isFeatureEnabled("enableMagicWand") // true
 */
export function isFeatureEnabled<K extends keyof FeatureFlags>(
  feature: K
): FeatureFlags[K] {
  return flags[feature];
}

/**
 * Enable a feature flag at runtime (useful for testing)
 *
 * WARNING: This does not persist across page reloads.
 * For production, use environment variables.
 *
 * @param feature - Feature flag name
 * @param value - New value (default: true)
 *
 * @example
 * setFeatureEnabled("enableCharts", true)
 */
export function setFeatureEnabled<K extends keyof FeatureFlags>(
  feature: K,
  value: FeatureFlags[K] = true as FeatureFlags[K]
): void {
  // Only allow in development
  if (env.NEXT_PUBLIC_APP_ENV !== "development") {
    console.warn(
      `[Feature Flags] Cannot modify flags in ${env.NEXT_PUBLIC_APP_ENV} environment`
    );
    return;
  }

  (flags as FeatureFlags)[feature] = value;
  console.log(`[Feature Flags] ${feature} = ${value}`);
}

/**
 * Get all feature flags as an object
 *
 * Useful for debugging or displaying flag status
 *
 * @returns Copy of all feature flags
 */
export function getAllFlags(): Readonly<FeatureFlags> {
  return { ...flags };
}

/**
 * Log all feature flags (development only)
 *
 * @example
 * logFeatureFlags()
 * // Output:
 * // [Feature Flags] Current configuration:
 * //   enableCoaching: true
 * //   enableMagicWand: true
 * //   ...
 */
export function logFeatureFlags(): void {
  if (env.NEXT_PUBLIC_APP_ENV !== "development") {
    return;
  }

  console.group("[Feature Flags] Current configuration:");
  Object.entries(flags).forEach(([key, value]) => {
    console.log(`  ${key}: ${value}`);
  });
  console.groupEnd();
}

// ========================================
// Feature Flag Groups
// ========================================

/**
 * Get all enabled integration flags
 */
export function getEnabledIntegrations(): string[] {
  return Object.entries(flags)
    .filter(([key, value]) => key.startsWith("enable") && key.includes("Integration") && value)
    .map(([key]) => key.replace("enable", "").replace(/([A-Z])/g, " $1").trim());
}

/**
 * Get all experimental flags
 */
export function getExperimentalFlags(): Partial<FeatureFlags> {
  return Object.entries(flags)
    .filter(([key]) => key.startsWith("experimental"))
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
}

/**
 * Check if ANY experimental features are enabled
 */
export function hasExperimentalFeatures(): boolean {
  return Object.values(getExperimentalFlags()).some((value) => value === true);
}

// ========================================
// Feature Flag Validation
// ========================================

/**
 * Validate feature flag dependencies
 *
 * Ensures that features with dependencies are only enabled when their
 * dependencies are also enabled.
 *
 * @returns Array of validation errors (empty if valid)
 */
export function validateFeatureFlagDependencies(): string[] {
  const errors: string[] = [];

  // Charts require data visualization
  if (flags.enableCharts && !flags.enableDataVisualization) {
    errors.push(
      "enableCharts requires enableDataVisualization to be enabled"
    );
  }

  // Compliance analytics requires compliance DB integration
  if (flags.enableComplianceAnalytics && !flags.enableComplianceDbIntegration) {
    console.warn(
      "[Feature Flags] enableComplianceAnalytics requires compliance database"
    );
  }

  // Advanced analytics requires Snowflake integration
  if (flags.experimentalAdvancedAnalytics && !flags.enableSnowflakeIntegration) {
    errors.push(
      "experimentalAdvancedAnalytics requires enableSnowflakeIntegration"
    );
  }

  return errors;
}

/**
 * Validate feature flags on startup
 *
 * Logs warnings for misconfigured flags in development
 */
export function validateFeatureFlags(): void {
  const errors = validateFeatureFlagDependencies();

  if (errors.length > 0) {
    console.group("[Feature Flags] Configuration errors detected:");
    errors.forEach((error) => console.error(`  ❌ ${error}`));
    console.groupEnd();
  }

  // Log experimental features in development
  if (env.NEXT_PUBLIC_APP_ENV === "development" && hasExperimentalFeatures()) {
    console.warn(
      "[Feature Flags] Experimental features enabled:",
      getExperimentalFlags()
    );
  }
}

// Run validation on module load (development only)
if (env.NEXT_PUBLIC_APP_ENV === "development") {
  validateFeatureFlags();
  logFeatureFlags();
}

// ========================================
// Export Types
// ========================================

export type FeatureFlagName = keyof FeatureFlags;
