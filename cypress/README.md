# Cypress E2E Tests for Recruitment Dashboard

Este directorio contiene pruebas E2E (end-to-end) para validar la funcionalidad del Recruitment Dashboard, incluyendo:
- Carga de página de posiciones
- Visualización de candidatos en sus respectivas fases
- Cambio de fase mediante drag-and-drop
- Sincronización con el backend mediante API

## Estructura

```
cypress/
├── e2e/
│   ├── positionDetails.cy.js       # Tests para carga de página y visualización de candidatos
│   └── candidateDragDrop.cy.js     # Tests para cambio de fase mediante drag-and-drop
├── support/
│   ├── commands.js                  # Custom commands para Cypress
│   └── e2e.js                      # Configuración global de E2E
└── fixtures/                        # (Directorio para datos de prueba si es necesario)
```

## Requisitos Previos

1. **Backend corriendo** en `http://localhost:3010`
2. **Frontend corriendo** en `http://localhost:3000`
3. **PostgreSQL/Base de Datos** accesible y con datos

## Instalación

```bash
# Instalar dependencias (desde la raíz del proyecto)
npm install
```

## Ejecución de Tests

### Modo Interactivo (Cypress UI)
```bash
npm run cypress:open
```

Esto abrirá la interfaz gráfica de Cypress donde puedes:
- Seleccionar tests individuales
- Ver ejecución en tiempo real
- Depurar problemas
- Revisar screenshots y videos

### Modo Headless (CLI)
```bash
npm run cypress:run
```

Ejecuta todos los tests en modo headless y genera un reporte.

### Ejecutar un archivo de test específico
```bash
npx cypress run --spec "cypress/e2e/positionDetails.cy.js"
npx cypress run --spec "cypress/e2e/candidateDragDrop.cy.js"
```

## Descripción de Tests

### 1. Position Details (positionDetails.cy.js)

**Propósito:** Validar que la página de detalles de posición se carga correctamente y muestra todos los elementos esperados.

**Scenarios:**
- ✅ Verifica que el título de la posición se muestra correctamente
- ✅ Verifica que se muestran las columnas correspondientes a cada fase del proceso de contratación
- ✅ Verifica que las tarjetas de los candidatos se muestran en la columna correcta según su fase actual

**Detalles:**
- Selecciona una posición aleatoria de la BD
- Valida la presencia del título
- Verifica que existen columnas para cada fase (Applied, Interview, Offer, etc.)
- Confirma que candidatos están en sus columnas correctas

### 2. Candidate Drag-Drop (candidateDragDrop.cy.js)

**Propósito:** Validar la funcionalidad completa de cambio de fase mediante drag-and-drop.

**Scenarios:**
- ✅ Simula el arrastre de una tarjeta de candidato de una columna a otra
- ✅ Verifica que la tarjeta del candidato se mueve a la nueva columna
- ✅ Verifica que la fase del candidato se actualiza correctamente en el backend mediante el endpoint PUT /candidate/:id

**Detalles:**
- Selecciona una posición aleatoria
- Encuentra un candidato en una fase que no sea la última
- Simula drag-and-drop a la siguiente fase
- Intercepta y valida la llamada API PUT
- Verifica que el `interviewStepId` correcto se envía
- Confirma que `applicationId` está incluido en la request

## Datos de Prueba

Para cargar múltiples posiciones y candidatos en diferentes fases:

```bash
cd backend
node prisma/seed-e2e.js
```

Esto creará:
- 3 posiciones diferentes
- ~16 aplicaciones de candidatos
- Candidatos distribuidos en las fases: Applied, Interview, Offer

## Custom Commands

Los siguientes comandos personalizados están disponibles:

### `cy.getRandomPosition()`
Obtiene una posición aleatoria de la BD
```javascript
cy.getRandomPosition().then((position) => {
  cy.visit(`/positions/${position.id}`);
});
```

### `cy.interceptCandidateUpdate()`
Configura un intercept para validar PUT requests a /candidate/:id
```javascript
cy.interceptCandidateUpdate();
// ... realizar drag-and-drop ...
cy.wait('@updateCandidate').then((interception) => {
  expect(interception.request.body).to.have.property('currentInterviewStep');
});
```

### `cy.dragCandidateToColumn(candidateName, targetColumnTitle)`
Simula drag-and-drop de un candidato
```javascript
cy.dragCandidateToColumn('John Doe', 'Interview');
```

### `cy.waitForCandidatesLoaded()`
Espera a que los candidatos se carguen
```javascript
cy.waitForCandidatesLoaded();
```

## Configuración de Cypress

La configuración está en [cypress.config.js](../../cypress.config.js):
- **baseUrl:** `http://localhost:3000`
- **viewportWidth:** 1280px
- **viewportHeight:** 720px
- **defaultCommandTimeout:** 5 segundos
- **video:** false (deshabilitar para tests más rápidos)

## Solución de Problemas

### Test falla porque no encuentra candidatos
- Verifica que el backend esté corriendo
- Verifica que la BD tiene datos de posiciones y candidatos
- Ejecuta el seed-e2e.js para agregar datos de prueba

### Test falla en drag-and-drop
- Asegúrate de que la posición tiene al menos 2 fases
- Verifica que hay candidatos en las primeras fases
- Revisa la consola del navegador para ver errores de React

### API intercepts no funcionan
- Verifica que el backend está en `http://localhost:3010`
- Confirma que los endpoints están habilitados (GET /positions, PUT /candidates/:id)

## Notas Importantes

1. **Datos persistentes:** Los tests NO restauran la BD entre ejecuciones, por lo que los cambios se mantienen
2. **Posiciones aleatorias:** Cada ejecución selecciona una posición diferente para mayor cobertura
3. **Independencia:** Los tests son independientes y pueden ejecutarse en cualquier orden

## CI/CD Integration

Para integrar en GitHub Actions o similar:

```yaml
- name: Run Cypress Tests
  run: npm run cypress:run
```

## Recursos Útiles

- [Documentación de Cypress](https://docs.cypress.io)
- [Testing Library Best Practices](https://testing-library.com)
- [react-beautiful-dnd](https://github.com/atlassian/react-beautiful-dnd)
