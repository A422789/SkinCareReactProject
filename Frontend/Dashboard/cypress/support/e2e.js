// cypress/support/e2e.js
// Silence uncaught exceptions from third-party scripts
Cypress.on('uncaught:exception', () => false);
