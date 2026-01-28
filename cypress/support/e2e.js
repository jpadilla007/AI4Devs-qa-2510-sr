// Import commands.js
import './commands';

// Import cypress-drag-drop for drag and drop support
import '@4tw/cypress-drag-drop';

// Disable uncaught exception handling for test stability
Cypress.on('uncaught:exception', (err, runnable) => {
  // Return false to prevent Cypress from failing the test
  // Helpful for handling React errors during navigation
  return false;
});

// Set viewport for all tests
beforeEach(() => {
  cy.viewport(1280, 720);
});
