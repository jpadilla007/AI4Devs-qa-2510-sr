# Cypress Custom Commands Documentation

## Overview
Custom Cypress commands extend the test capabilities with application-specific helpers. Located in `cypress/support/commands.js`.

---

## Available Commands

### 1. `cy.getRandomPosition()`

**Purpose**: Fetches a random position from the API to use as test data.

**Usage**:
```javascript
cy.getRandomPosition().then((position) => {
  console.log(position.id);    // Position ID
  console.log(position.title); // Position title
});
```

**Returns**: Position object
```javascript
{
  id: 1,
  title: "Senior Full-Stack Engineer",
  // ... other fields
}
```

**Benefits**:
- Avoids test data dependencies
- Each run uses different positions (better test coverage)
- Ensures seeded data is actually used

**Implementation**:
```javascript
Cypress.Commands.add('getRandomPosition', () => {
  return cy.request('GET', 'http://localhost:3010/positions').then((response) => {
    expect(response.status).to.eq(200);
    const positions = response.body;
    expect(positions.length).to.be.greaterThan(0);
    const randomIndex = Math.floor(Math.random() * positions.length);
    return positions[randomIndex];
  });
});
```

---

### 2. `cy.interceptCandidateUpdate()`

**Purpose**: Sets up an intercept for PUT requests to the candidate update endpoint and aliases them for verification.

**Usage**:
```javascript
cy.interceptCandidateUpdate();
// ... perform action that triggers PUT request ...
cy.wait('@updateCandidate').then((interception) => {
  console.log(interception.request.body);
  console.log(interception.response.statusCode);
});
```

**Intercepts**: `PUT http://localhost:3010/candidates/*`

**Alias**: `@updateCandidate` (used with `cy.wait()`)

**Available Properties**:
- `interception.request.method` - "PUT"
- `interception.request.url` - Full URL
- `interception.request.body` - Request payload
- `interception.response.statusCode` - Response status
- `interception.response.body` - Response data

**Benefits**:
- Verifies API calls happen as expected
- Captures request/response for assertions
- No actual backend call needed for verification

**Implementation**:
```javascript
Cypress.Commands.add('interceptCandidateUpdate', () => {
  cy.intercept('PUT', 'http://localhost:3010/candidates/*', (req) => {
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
```

---

### 3. `cy.dragCandidateToColumn(candidateName, targetColumnTitle)`

**Purpose**: Simulates dragging a candidate card to a different stage column.

**Usage**:
```javascript
cy.dragCandidateToColumn('John Doe', 'Interview');
```

**Parameters**:
- `candidateName` (string) - Name of the candidate to drag
- `targetColumnTitle` (string) - Name of target stage column

**Benefits**:
- Encapsulates drag-and-drop complexity
- Reusable across multiple tests
- Handles react-beautiful-dnd specifics

**Note**: Currently implemented as helper but primary tests use API-based validation instead of DOM drag simulation for stability.

**Implementation**:
```javascript
Cypress.Commands.add('dragCandidateToColumn', (candidateName, targetColumnTitle) => {
  // Finds candidate and target column, performs drag simulation
  cy.contains('[role="button"]', candidateName)
    .parents('[style*="transform"]')
    .trigger('mousedown', { button: 0 })
    .trigger('dragstart');

  cy.contains('h5', targetColumnTitle)
    .closest('.card')
    .trigger('dragover')
    .trigger('drop')
    .trigger('dragend');
});
```

---

### 4. `cy.waitForCandidatesLoaded()`

**Purpose**: Waits for candidate cards to load and be visible on the page.

**Usage**:
```javascript
cy.visit('/positions/1');
cy.waitForCandidatesLoaded(); // Waits for candidates to render
// ... perform tests ...
```

**Benefits**:
- Ensures page is fully loaded before testing
- Prevents race conditions
- Replaces arbitrary wait times

**Implementation**:
```javascript
Cypress.Commands.add('waitForCandidatesLoaded', () => {
  cy.get('[role="button"]', { timeout: 10000 }).should('be.visible');
});
```

**Timeout**: 10 seconds (configurable in call)

---

## Usage Examples

### Example 1: Testing Random Position
```javascript
cy.getRandomPosition().then((position) => {
  cy.visit(`/positions/${position.id}`);
  cy.waitForCandidatesLoaded();
  cy.contains(position.title).should('be.visible');
});
```

### Example 2: Verifying API Call
```javascript
cy.interceptCandidateUpdate();

// Trigger update through UI or API
cy.request('PUT', `http://localhost:3010/candidates/1`, {
  applicationId: 1,
  currentInterviewStep: 2
});

// Verify the call happened
cy.wait('@updateCandidate', { timeout: 5000 }).then((interception) => {
  expect(interception.request.body.applicationId).to.equal(1);
  expect(interception.response.statusCode).to.equal(200);
});
```

### Example 3: Complete Test Flow
```javascript
describe('My Test', () => {
  before(() => {
    cy.getRandomPosition().then((position) => {
      cy.visit(`/positions/${position.id}`);
    });
  });

  it('Should update candidate', () => {
    cy.waitForCandidatesLoaded();
    cy.interceptCandidateUpdate();
    
    // Perform action...
    
    cy.wait('@updateCandidate').then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
    });
  });
});
```

---

## Best Practices

1. **Always use `cy.getRandomPosition()` for position selection**
   ```javascript
   // ✅ Good - Uses random position
   cy.getRandomPosition().then((pos) => cy.visit(`/positions/${pos.id}`));
   
   // ❌ Avoid - Hardcoded position
   cy.visit('/positions/1');
   ```

2. **Wait for candidates before testing**
   ```javascript
   // ✅ Good
   cy.visit('/positions/1');
   cy.waitForCandidatesLoaded();
   cy.contains('John').should('exist');
   
   // ❌ Avoid - Race condition possible
   cy.visit('/positions/1');
   cy.contains('John').should('exist');
   ```

3. **Use intercept for API verification**
   ```javascript
   // ✅ Good - Verifies API was called
   cy.interceptCandidateUpdate();
   cy.wait('@updateCandidate').then((int) => {
     expect(int.request.body).to.exist;
   });
   
   // ❌ Avoid - No verification
   cy.request('PUT', url, data); // Fire and forget
   ```

4. **Chain commands for clarity**
   ```javascript
   // ✅ Good - Clear flow
   cy.getRandomPosition()
     .then(pos => cy.visit(`/positions/${pos.id}`))
     .then(() => cy.waitForCandidatesLoaded());
   
   // ❌ Avoid - Nested callbacks
   cy.getRandomPosition().then((pos) => {
     cy.visit(`/positions/${pos.id}`);
   });
   ```

---

## Troubleshooting

### Command Not Found Error
**Problem**: "cy.xxx is not a function"

**Solution**: Ensure `cypress/support/commands.js` is imported in `cypress/support/e2e.js`:
```javascript
import './commands';
```

### Timeout Errors
**Problem**: "Timed out retrying after 5000ms"

**Solution**: Increase timeout or verify selectors:
```javascript
cy.get('element', { timeout: 10000 }); // Increase timeout
cy.waitForCandidatesLoaded(); // Uses 10s timeout by default
```

### API Intercept Not Working
**Problem**: "cy.wait('@updateCandidate') timeout"

**Solution**: Verify intercept is set up before action:
```javascript
cy.interceptCandidateUpdate(); // Must be BEFORE action
// ... trigger the PUT request ...
cy.wait('@updateCandidate');
```

---

## Creating New Custom Commands

Template for adding new commands:

```javascript
Cypress.Commands.add('myCommand', (param1, param2) => {
  // Your command logic
  return cy.get('selector').then(($el) => {
    // Do something...
    return $el;
  });
});
```

Then use in tests:
```javascript
cy.myCommand('value1', 'value2');
```

---

## Related Files

- **Definition**: `cypress/support/commands.js`
- **Configuration**: `cypress/support/e2e.js`
- **Tests Using Commands**: `cypress/e2e/*.cy.js`

