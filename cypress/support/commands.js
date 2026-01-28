/// <reference types="cypress" />

/**
 * Custom command to get a random position from the API
 * Returns a position object with id and title
 */
Cypress.Commands.add('getRandomPosition', () => {
  return cy.request('GET', 'http://localhost:3010/positions').then((response) => {
    expect(response.status).to.eq(200);
    const positions = response.body;
    expect(positions.length).to.be.greaterThan(0);
    const randomIndex = Math.floor(Math.random() * positions.length);
    return positions[randomIndex];
  });
});

/**
 * Custom command to intercept candidate stage update
 * Verifies the PUT request to /candidate/:id
 */
Cypress.Commands.add('interceptCandidateUpdate', () => {
  cy.intercept('PUT', 'http://localhost:3010/candidates/*', (req) => {
    // Log the request for debugging
    console.log('Intercepted PUT request to candidate:', req.body);
    req.reply((res) => {
      res.statusCode = 200;
      res.body = {
        message: 'Candidate stage updated successfully',
        data: {
          id: parseInt(req.url.split('/').pop()),
          ...req.body,
        },
      };
    });
  }).as('updateCandidate');
});

/**
 * Custom command to drag a candidate card to another column
 * Uses react-beautiful-dnd specific selectors
 * @param {string} candidateName - Name of the candidate to drag
 * @param {string} targetColumnTitle - Title of the target stage column
 */
Cypress.Commands.add('dragCandidateToColumn', (candidateName, targetColumnTitle) => {
  // Find the candidate card by its content
  cy.contains('[role="button"]', candidateName).within(($candidate) => {
    // Get the position and size of the draggable element
    const element = $candidate[0];
    const rect = element.getBoundingClientRect();
    
    const dataTransfer = new DataTransfer();
    const dragStartEvent = new DragEvent('dragstart', {
      bubbles: true,
      cancelable: true,
      dataTransfer,
    });
    const dragEndEvent = new DragEvent('dragend', {
      bubbles: true,
      cancelable: true,
      dataTransfer,
    });

    // Simulate drag start
    element.dispatchEvent(dragStartEvent);
    cy.wait(300);
  });

  // Find the target column
  cy.contains('h5', targetColumnTitle)
    .closest('.card')
    .within(($targetColumn) => {
      const targetElement = $targetColumn[0];
      const targetRect = targetElement.getBoundingClientRect();

      // Simulate drag over and drop
      const dragOverEvent = new DragEvent('dragover', {
        bubbles: true,
        cancelable: true,
        clientX: targetRect.x + 20,
        clientY: targetRect.y + 100,
      });

      const dropEvent = new DragEvent('drop', {
        bubbles: true,
        cancelable: true,
        clientX: targetRect.x + 20,
        clientY: targetRect.y + 100,
      });

      targetElement.dispatchEvent(dragOverEvent);
      cy.wait(150);
      targetElement.dispatchEvent(dropEvent);
    });
});

/**
 * Custom command to wait for candidates to load in all columns
 */
Cypress.Commands.add('waitForCandidatesLoaded', () => {
  // Wait for at least one candidate card to be visible
  cy.get('[role="button"]', { timeout: 5000 }).should('be.visible');
});
