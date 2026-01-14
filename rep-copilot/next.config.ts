import type { NextConfig } from "next";

/**
 * Next.js Configuration
 *
 * Environment-specific settings for development, staging, and production.
 * Reads from process.env to determine the current environment.
 */

// Get environment from variable (default to development)
const appEnv = process.env.NEXT_PUBLIC_APP_ENV || "development";

// ========================================
// Base Configuration
// ========================================

const baseConfig: NextConfig = {
  // Enable React strict mode for better error detection
  reactStrictMode: true,

  // Optimize package imports for smaller bundle size
  experimental: {
    optimizePackageImports: [
      "@radix-ui/react-avatar",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-hover-card",
      "@radix-ui/react-label",
      "@radix-ui/react-popover",
      "@radix-ui/react-scroll-area",
      "@radix-ui/react-select",
      "@radix-ui/react-tabs",
      "@radix-ui/react-toggle",
      "@radix-ui/react-tooltip",
      "lucide-react",
      "framer-motion",
    ],
    // Enable optimizeCss for Vercel Edge Runtime
    optimizeCss: true,
  },

  // Image optimization (if you add images later)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // Turbopack configuration (Next.js 16+)
  turbopack: {
    // Allow importing from @/ prefix
    resolveAlias: {
      "@": "./src",
    },
  },

  // Vercel Edge Runtime for API routes (better performance)
  output: 'standalone',

  // Bundle size optimization
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}',
    },
  },

  // Performance optimization
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

// ========================================
// Environment-Specific Configuration
// ========================================

const envSpecificConfig: Record<string, Partial<NextConfig>> = {
  development: {
    // Disable source map obfuscation for easier debugging
    productionBrowserSourceMaps: true,
  },

  staging: {
    // Staging behaves like production but with debug features

    // Enable source maps for debugging
    productionBrowserSourceMaps: true,
  },

  production: {
    // Production optimizations

    // Disable source maps to reduce bundle size
    productionBrowserSourceMaps: false,

    // Enable compression
    compress: true,
  },
};

// ========================================
// Merge Configurations
// ========================================

const currentEnvConfig = envSpecificConfig[appEnv] || envSpecificConfig.development;

const nextConfig: NextConfig = {
  ...baseConfig,
  ...currentEnvConfig,
};

// ========================================
// Export
// ========================================

export default nextConfig;

// ========================================
// Runtime Configuration Helpers
// ========================================

/**
 * Log the current environment configuration (development only)
 */
if (appEnv === "development") {
  console.group("[Next.js] Configuration");
  console.log("Environment:", appEnv);
  console.log("Node Env:", process.env.NODE_ENV);
  console.log("API Base URL:", process.env.NEXT_PUBLIC_API_BASE_URL);
  console.log("Coaching Default:", process.env.NEXT_PUBLIC_COACHING_MODE_DEFAULT);
  console.log("Compliance Mode:", process.env.NEXT_PUBLIC_COMPLIANCE_CHECK_STRICT_MODE);
  console.groupEnd();
}
