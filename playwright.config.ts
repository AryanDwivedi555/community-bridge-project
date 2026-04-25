import { createLovableConfig } from "lovable-agent-playwright-config/config";

/**
 * Community Bridge - Automated Test Configuration
 * Optimized for local development on port 8080.
 */
export default createLovableConfig({
  // Adjusted timeout for local E: drive performance
  timeout: 60000,
  
  use: {
    // Syncing with your actual local server port
    baseURL: 'http://localhost:8080',
    
    // Professional Trace: Helps you see a video of what went wrong if a test fails
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  // Ensure tests don't interfere with each other
  fullyParallel: true,
  
  // Suppress browser windows during tests for speed
  headless: true,
});