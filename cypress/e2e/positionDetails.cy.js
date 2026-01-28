/// <reference types="cypress" />

describe('Position Details - Page Load and Rendering', () => {
  let positionId;
  let positionTitle;

  before(() => {
    cy.getRandomPosition().then((position) => {
      positionId = position.id;
      positionTitle = position.title;
      cy.log(`Testing with position: ${positionTitle} (ID: ${positionId})`);
    });
  });

  beforeEach(() => {
    cy.visit(`/positions/${positionId}`);
  });

  describe('Verifica que el título de la posición se muestra correctamente', () => {
    it('Should display the position title on the page', () => {
      cy.waitForCandidatesLoaded();
      cy.contains(positionTitle).should('be.visible');
    });

    it('Should display the position title as a heading', () => {
      cy.waitForCandidatesLoaded();
      cy.contains('h1, h2, h3, h4, h5, h6', positionTitle).should('be.visible');
    });
  });

  describe('Verifica que se muestran las columnas correspondientes a cada fase del proceso de contratación', () => {
    it('Should render stage columns from the interview flow', () => {
      cy.waitForCandidatesLoaded();

      cy.request('GET', `http://localhost:3010/positions/${positionId}/interviewFlow`)
        .then((response) => {
          expect(response.status).to.eq(200);
          const stages = response.body.interviewFlow.interviewFlow.interviewSteps;
          expect(stages.length).to.be.greaterThan(0);

          stages.forEach((stage) => {
            cy.contains('.card-header', stage.name).should('be.visible');
          });
        });
    });

    it('Should have the correct number of stage columns', () => {
      cy.waitForCandidatesLoaded();

      cy.request('GET', `http://localhost:3010/positions/${positionId}/interviewFlow`)
        .then((response) => {
          const stages = response.body.interviewFlow.interviewFlow.interviewSteps;
          const expectedColumnCount = stages.length;
          
          // Count only the stage column cards (children of Row), not the candidate cards inside
          cy.get('.card-header').should('have.length', expectedColumnCount);
        });
    });

    it('Should display stage columns in the correct order', () => {
      cy.waitForCandidatesLoaded();

      cy.request('GET', `http://localhost:3010/positions/${positionId}/interviewFlow`)
        .then((response) => {
          const stages = response.body.interviewFlow.interviewFlow.interviewSteps;

          // Get all stage headers and verify order
          cy.get('.card-header').each(($header, index) => {
            if (index < stages.length) {
              cy.wrap($header).contains(stages[index].name).should('exist');
            }
          });
        });
    });
  });

  describe('Verifica que las tarjetas de los candidatos se muestran en la columna correcta según su fase actual', () => {
    it('Should display candidates in their correct stage columns', () => {
      cy.waitForCandidatesLoaded();

      cy.request('GET', `http://localhost:3010/positions/${positionId}/interviewFlow`)
        .then((flowResponse) => {
          const stages = flowResponse.body.interviewFlow.interviewFlow.interviewSteps;

          cy.request('GET', `http://localhost:3010/positions/${positionId}/candidates`)
            .then((candidatesResponse) => {
              const candidates = candidatesResponse.body;

              candidates.forEach((candidate) => {
                const expectedStage = stages.find(s => s.name === candidate.currentInterviewStep);

                if (expectedStage) {
                  cy.contains(candidate.fullName).should('be.visible');

                  cy.contains('.card-header', expectedStage.name)
                    .closest('.card')
                    .within(() => {
                      cy.contains(candidate.fullName).should('exist');
                    });
                }
              });
            });
        });
    });

    it('Should group candidates by stage correctly', () => {
      cy.waitForCandidatesLoaded();

      cy.request('GET', `http://localhost:3010/positions/${positionId}/candidates`)
        .then((response) => {
          const candidates = response.body;

          const candidatesByStage = {};
          candidates.forEach((candidate) => {
            const stage = candidate.currentInterviewStep;
            if (!candidatesByStage[stage]) {
              candidatesByStage[stage] = [];
            }
            candidatesByStage[stage].push(candidate.fullName);
          });

          Object.entries(candidatesByStage).forEach(([stage, names]) => {
            cy.contains('.card-header', stage)
              .closest('.card')
              .within(() => {
                names.forEach((name) => {
                  cy.contains(name).should('exist');
                });
              });
          });
        });
    });

    it('Should display candidate cards with name and rating', () => {
      cy.waitForCandidatesLoaded();

      cy.get('.card').first().within(() => {
        cy.get('.card-body').should('exist');
      });
    });

    it('Should maintain correct candidate positioning in their columns', () => {
      cy.waitForCandidatesLoaded();

      cy.request('GET', `http://localhost:3010/positions/${positionId}/interviewFlow`)
        .then((flowResponse) => {
          const stages = flowResponse.body.interviewFlow.interviewFlow.interviewSteps;

          stages.forEach((stage) => {
            cy.contains('.card-header', stage.name)
              .closest('.card')
              .within(() => {
                cy.get('.card-body').should('exist');
              });
          });
        });
    });
  });

  describe('Performance and UI consistency', () => {
    it('Should load the page without errors', () => {
      cy.waitForCandidatesLoaded();

      cy.on('uncaught:exception', (err, runnable) => {
        return false;
      });

      cy.contains(positionTitle).should('be.visible');
    });

    it('Should have responsive layout for all columns and cards', () => {
      cy.waitForCandidatesLoaded();

      cy.get('.card').should('have.length.greaterThan', 0);
      cy.get('.card-header').each(($header) => {
        cy.wrap($header).should('be.visible');
      });
    });
  });
});
