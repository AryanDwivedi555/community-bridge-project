/// <reference types="vite/client" />

/**
 * Community Bridge - Global Type Definitions
 * This file ensures TypeScript recognizes Vite-specific properties
 * and custom environment variables used across the network.
 */

interface ImportMetaEnv {
  // Add custom environment variables here for your helping network
  // Example: readonly VITE_MAP_API_KEY: string
  readonly VITE_APP_TITLE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}