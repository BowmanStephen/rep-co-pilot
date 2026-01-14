/**
 * Environment Configuration with Type-Safe Validation
 *
 * This file uses @t3-oss/env-nextjs to validate environment variables at startup.
 * The app will FAIL FAST if required variables are missing or invalid.
 *
 * Usage:
 *   import { env } from "@/config/env"
 *   const apiKey = env.OPENROUTER_API_KEY
 *
 * Environment Variables:
 * - Public (NEXT_PUBLIC_*) - Exposed to browser, used in client components
 * - Private - Server-only, never exposed to browser
 */

import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/**
 * Zod schema for environment variable validation
 *
 * Validation Rules:
 * - required() = Must be present or app crashes
 * - optional() = Can be undefined, returns undefined if missing
 * - default() = Fallback value if missing
 */
const envSchema = {
  // ========================================
  // PUBLIC: Application Environment
  // ========================================
  NEXT_PUBLIC_APP_ENV: z
    .enum(["development", "staging", "production"])
    .default("development"),

  NEXT_PUBLIC_API_BASE_URL: z
    .string()
    .url()
    .default("http://localhost:3000"),

  // ========================================
  // PUBLIC: Feature Flags (Client-Side)
  // ========================================
  NEXT_PUBLIC_COACHING_MODE_DEFAULT: z
    .enum(["true", "false"])
    .default("true")
    .transform((val) => val === "true"),

  NEXT_PUBLIC_COMPLIANCE_CHECK_STRICT_MODE: z
    .enum(["strict", "lenient"])
    .default("lenient"),

  // ========================================
  // PRIVATE: AI/ML Configuration
  // ========================================
  OPENROUTER_API_KEY: z.string().min(1, {
    message: "OPENROUTER_API_KEY is required. Get one at https://openrouter.ai/keys",
  }),

  AI_MODEL_CHAT: z
    .string()
    .default("anthropic/claude-3.5-sonnet")
    .describe("Primary model for chat responses"),

  AI_MODEL_ENHANCE: z
    .string()
    .default("openai/gpt-4o-mini")
    .describe("Lighter model for prompt enhancement"),

  AI_TEMPERATURE_CHAT: z
    .string()
    .transform((val) => parseFloat(val))
    .pipe(z.number().min(0).max(2))
    .default(0.7),

  AI_TEMPERATURE_ENHANCE: z
    .string()
    .transform((val) => parseFloat(val))
    .pipe(z.number().min(0).max(2))
    .default(0.3),

  AI_MAX_TOKENS: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().positive())
    .default(2048),

  // ========================================
  // PRIVATE: API Configuration
  // ========================================
  API_RATE_LIMIT_MAX: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().positive())
    .default(100),

  API_RATE_LIMIT_WINDOW: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().positive())
    .default(900000)
    .describe("Rate limit window in milliseconds (default: 15 minutes)"),

  // ========================================
  // PRIVATE: Logging & Observability
  // ========================================
  LOG_LEVEL: z
    .enum(["error", "warn", "info", "debug"])
    .default("info"),

  LOG_TO_CONSOLE: z
    .enum(["true", "false"])
    .transform((val) => val === "true")
    .default(true),

  // ========================================
  // PRIVATE: Future Integrations (Optional)
  // ========================================
  SNOWFLAKE_ACCOUNT: z.string().optional(),
  SNOWFLAKE_USERNAME: z.string().optional(),
  SNOWFLAKE_PASSWORD: z.string().optional(),
  SNOWFLAKE_DATABASE: z.string().optional(),
  SNOWFLAKE_WAREHOUSE: z.string().optional(),

  VEEVA_VAULT_URL: z.string().url().optional(),
  VEEVA_API_TOKEN: z.string().optional(),

  COMPLIANCE_DB_HOST: z.string().optional(),
  COMPLIANCE_DB_PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().positive())
    .optional(),
  COMPLIANCE_DB_NAME: z.string().optional(),
  COMPLIANCE_DB_USER: z.string().optional(),
  COMPLIANCE_DB_PASSWORD: z.string().optional(),
};

/**
 * Export validated environment object
 *
 * Runtime validation happens at:
 * - Build time (next build)
 * - Server startup (next start)
 * - Dev server startup (next dev)
 *
 * If validation fails, the app crashes with a clear error message.
 */
export const env = createEnv({
  server: {
    // Extract server-side variables from envSchema
    OPENROUTER_API_KEY: envSchema.OPENROUTER_API_KEY,
    AI_MODEL_CHAT: envSchema.AI_MODEL_CHAT,
    AI_MODEL_ENHANCE: envSchema.AI_MODEL_ENHANCE,
    AI_TEMPERATURE_CHAT: envSchema.AI_TEMPERATURE_CHAT,
    AI_TEMPERATURE_ENHANCE: envSchema.AI_TEMPERATURE_ENHANCE,
    AI_MAX_TOKENS: envSchema.AI_MAX_TOKENS,
    API_RATE_LIMIT_MAX: envSchema.API_RATE_LIMIT_MAX,
    API_RATE_LIMIT_WINDOW: envSchema.API_RATE_LIMIT_WINDOW,
    LOG_LEVEL: envSchema.LOG_LEVEL,
    LOG_TO_CONSOLE: envSchema.LOG_TO_CONSOLE,
    SNOWFLAKE_ACCOUNT: envSchema.SNOWFLAKE_ACCOUNT,
    SNOWFLAKE_USERNAME: envSchema.SNOWFLAKE_USERNAME,
    SNOWFLAKE_PASSWORD: envSchema.SNOWFLAKE_PASSWORD,
    SNOWFLAKE_DATABASE: envSchema.SNOWFLAKE_DATABASE,
    SNOWFLAKE_WAREHOUSE: envSchema.SNOWFLAKE_WAREHOUSE,
    VEEVA_VAULT_URL: envSchema.VEEVA_VAULT_URL,
    VEEVA_API_TOKEN: envSchema.VEEVA_API_TOKEN,
    COMPLIANCE_DB_HOST: envSchema.COMPLIANCE_DB_HOST,
    COMPLIANCE_DB_PORT: envSchema.COMPLIANCE_DB_PORT,
    COMPLIANCE_DB_NAME: envSchema.COMPLIANCE_DB_NAME,
    COMPLIANCE_DB_USER: envSchema.COMPLIANCE_DB_USER,
    COMPLIANCE_DB_PASSWORD: envSchema.COMPLIANCE_DB_PASSWORD,
  },
  client: {
    // Extract client-side variables (exposed to browser)
    NEXT_PUBLIC_APP_ENV: envSchema.NEXT_PUBLIC_APP_ENV,
    NEXT_PUBLIC_API_BASE_URL: envSchema.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_COACHING_MODE_DEFAULT: envSchema.NEXT_PUBLIC_COACHING_MODE_DEFAULT,
    NEXT_PUBLIC_COMPLIANCE_CHECK_STRICT_MODE: envSchema.NEXT_PUBLIC_COMPLIANCE_CHECK_STRICT_MODE,
  },
  // TypeScript will infer these types for you
  experimental__runtimeEnv: {
    // Client-side (from window.env or Next.js injects)
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_COACHING_MODE_DEFAULT: process.env.NEXT_PUBLIC_COACHING_MODE_DEFAULT,
    NEXT_PUBLIC_COMPLIANCE_CHECK_STRICT_MODE: process.env.NEXT_PUBLIC_COMPLIANCE_CHECK_STRICT_MODE,
    // Server-side (from process.env)
    ...({
      OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
      AI_MODEL_CHAT: process.env.AI_MODEL_CHAT,
      AI_MODEL_ENHANCE: process.env.AI_MODEL_ENHANCE,
      AI_TEMPERATURE_CHAT: process.env.AI_TEMPERATURE_CHAT,
      AI_TEMPERATURE_ENHANCE: process.env.AI_TEMPERATURE_ENHANCE,
      AI_MAX_TOKENS: process.env.AI_MAX_TOKENS,
      API_RATE_LIMIT_MAX: process.env.API_RATE_LIMIT_MAX,
      API_RATE_LIMIT_WINDOW: process.env.API_RATE_LIMIT_WINDOW,
      LOG_LEVEL: process.env.LOG_LEVEL,
      LOG_TO_CONSOLE: process.env.LOG_TO_CONSOLE,
      SNOWFLAKE_ACCOUNT: process.env.SNOWFLAKE_ACCOUNT,
      SNOWFLAKE_USERNAME: process.env.SNOWFLAKE_USERNAME,
      SNOWFLAKE_PASSWORD: process.env.SNOWFLAKE_PASSWORD,
      SNOWFLAKE_DATABASE: process.env.SNOWFLAKE_DATABASE,
      SNOWFLAKE_WAREHOUSE: process.env.SNOWFLAKE_WAREHOUSE,
      VEEVA_VAULT_URL: process.env.VEEVA_VAULT_URL,
      VEEVA_API_TOKEN: process.env.VEEVA_API_TOKEN,
      COMPLIANCE_DB_HOST: process.env.COMPLIANCE_DB_HOST,
      COMPLIANCE_DB_PORT: process.env.COMPLIANCE_DB_PORT,
      COMPLIANCE_DB_NAME: process.env.COMPLIANCE_DB_NAME,
      COMPLIANCE_DB_USER: process.env.COMPLIANCE_DB_USER,
      COMPLIANCE_DB_PASSWORD: process.env.COMPLIANCE_DB_PASSWORD,
    } as const),
  },
});

/**
 * Type exports for use throughout the app
 */
export type Env = typeof env;

/**
 * Helper to check if we're in development
 */
export const isDevelopment = env.NEXT_PUBLIC_APP_ENV === "development";

/**
 * Helper to check if we're in production
 */
export const isProduction = env.NEXT_PUBLIC_APP_ENV === "production";

/**
 * Helper to check if we're in staging
 */
export const isStaging = env.NEXT_PUBLIC_APP_ENV === "staging";

/**
 * Helper to check if strict compliance mode is enabled
 */
export const isStrictComplianceMode =
  env.NEXT_PUBLIC_COMPLIANCE_CHECK_STRICT_MODE === "strict";
