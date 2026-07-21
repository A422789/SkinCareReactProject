// cypress/support/e2e.js
// This file is processed and loaded automatically before your test files.
// You can read more here: https://on.cypress.io/configuration

// Mock/ignore uncaught exceptions from third-party scripts if they happen during testing
Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});
