/**
 * Community Bridge - Automated Testing Fixtures
 * This file extends the base testing logic to support 
 * network simulation and UI validation.
 */

import { test as base, expect } from "lovable-agent-playwright-config/fixture";

// We extend the base test to add custom "Helping Network" checks
export const test = base.extend({
  // CSE Tip: You can add custom fixtures here later
  // like 'mockVolunteer' or 'mockNeed' for automated tests
});

export { expect };