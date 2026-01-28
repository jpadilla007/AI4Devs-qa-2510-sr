# 🧪 Cypress E2E Tests - Quick Reference

## ✅ Implementación Completada

### 📋 Archivos Creados

```
proyecto/
├── cypress.config.js                          # Configuración de Cypress
├── cypress/
│   ├── README.md                              # Documentación completa
│   ├── .gitignore                             # Ignorar archivos de test
│   ├── e2e/
│   │   ├── positionDetails.cy.js             # Test 1: Carga de página y visualización
│   │   └── candidateDragDrop.cy.js           # Test 2: Drag-and-drop y cambio de fase
│   └── support/
│       ├── commands.js                        # Custom commands personalizados
│       └── e2e.js                             # Configuración global
├── backend/
│   └── prisma/
│       ├── seed-e2e.ts                        # Script seed (TypeScript)
│       └── seed-e2e.js                        # Script seed (JavaScript)
└── package.json                               # Scripts npm agregados
```

### 🚀 Scripts npm Configurados

```bash
# Abrir Cypress UI (modo interactivo)
npm run cypress:open

# Ejecutar tests en modo headless
npm run cypress:run
```

---

## 📊 Test Suite 1: Position Details (`positionDetails.cy.js`)

### Propósito
Validar que la página de posición carga correctamente y muestra todos los elementos esperados.

### Escenarios Validados

#### 1. Título de la Posición
- ✅ Se muestra el título de la posición correctamente
- ✅ Aparece en elementos de heading (h1-h6)

#### 2. Columnas de Fases
- ✅ Se renderizan columnas para cada fase del flujo de entrevista
- ✅ Cada columna muestra el título de la fase correctamente
- ✅ Las columnas están en el orden correcto según `orderIndex`
- ✅ Cuenta de columnas coincide con número de fases

#### 3. Posicionamiento de Candidatos
- ✅ Candidatos aparecen en sus columnas correctas
- ✅ Candidatos están agrupados por fase (`currentInterviewStep`)
- ✅ Se muestra información de rating (puntuación)
- ✅ Posicionamiento se mantiene consistente

### Ejecución
```bash
npx cypress run --spec "cypress/e2e/positionDetails.cy.js"
```

---

## 📊 Test Suite 2: Drag-and-Drop (`candidateDragDrop.cy.js`)

### Propósito
Validar que el cambio de fase mediante drag-and-drop funciona correctamente y sincroniza con el backend.

### Escenarios Validados

#### 1. Simulación de Arrastre
- ✅ Se encuentra una tarjeta de candidato válida para arrastrar
- ✅ La acción de drag se inicia sin errores
- ✅ Se proporciona feedback visual durante drag

#### 2. Movimiento de Tarjeta
- ✅ Tarjeta se mueve a la nueva columna
- ✅ Tarjeta permanece visible en la página
- ✅ UI se actualiza sin errores

#### 3. Sincronización con Backend
- ✅ Se envía PUT request a `/candidate/:id`
- ✅ Request body incluye `applicationId` (número)
- ✅ Request body incluye `currentInterviewStep` (ID de la nueva fase)
- ✅ `currentInterviewStep` coincide con el ID de la fase destino
- ✅ Endpoint se llama con el candidateId correcto
- ✅ Response HTTP 200 se recibe
- ✅ No hay errores de consola durante operación

### Ejecución
```bash
npx cypress run --spec "cypress/e2e/candidateDragDrop.cy.js"
```

---

## 🛠️ Custom Commands

### `cy.getRandomPosition()`
Obtiene una posición aleatoria de la BD para testing distribuido.

```javascript
cy.getRandomPosition().then((position) => {
  // position.id, position.title, etc.
});
```

### `cy.interceptCandidateUpdate()`
Configura intercept para validar PUT requests a /candidate/:id

```javascript
cy.interceptCandidateUpdate();
// ... realizar acción ...
cy.wait('@updateCandidate').then((interception) => {
  expect(interception.request.body.currentInterviewStep).to.exist;
});
```

### `cy.dragCandidateToColumn(name, column)`
Simula drag-and-drop de candidato

```javascript
cy.dragCandidateToColumn('John Doe', 'Interview');
```

### `cy.waitForCandidatesLoaded()`
Espera a que los candidatos carguen

```javascript
cy.waitForCandidatesLoaded();
```

---

## 📝 Datos de Prueba

### Cargar datos E2E en la BD
```bash
cd backend
node prisma/seed-e2e.js
```

**Crea:**
- 3 posiciones diferentes
- ~16 aplicaciones de candidatos
- Candidatos distribuidos: Applied, Interview, Offer

### Estructura de datos
```javascript
Position 1: "Senior Full-Stack Engineer - E2E Test"
  ├─ Applied: 2 candidatos
  ├─ Interview: 2 candidatos
  └─ Offer: 2 candidatos

Position 2: "Data Scientist - E2E Test"
  ├─ Applied: 2 candidatos
  ├─ Interview: 2 candidatos
  └─ Offer: 1 candidato

Position 3: "Product Manager - E2E Test"
  ├─ Applied: 2 candidatos
  ├─ Interview: 2 candidatos
  └─ Offer: 1 candidato
```

---

## ⚙️ Configuración

**Archivo:** `cypress.config.js`

```javascript
{
  baseUrl: 'http://localhost:3000',           // Frontend
  viewportWidth: 1280,
  viewportHeight: 720,
  defaultCommandTimeout: 5000,                // 5 segundos
  requestTimeout: 10000,
  responseTimeout: 10000,
  video: false,                               // Deshabilitar videos
  screenshotOnRunFailure: true
}
```

**Backend API Base:** `http://localhost:3010`

---

## 🔍 Endpoints API Utilizados

### GET `/positions`
Obtiene lista de posiciones
```json
Response: [{ id: 1, title: "...", ... }, ...]
```

### GET `/positions/:id/interviewFlow`
Obtiene flujo de entrevista con fases
```json
Response: {
  interviewFlow: {
    interviewFlow: {
      interviewSteps: [
        { id: 101, name: "Applied", orderIndex: 1 },
        { id: 102, name: "Interview", orderIndex: 2 },
        { id: 103, name: "Offer", orderIndex: 3 }
      ]
    },
    positionName: "..."
  }
}
```

### GET `/positions/:id/candidates`
Obtiene candidatos de una posición
```json
Response: [
  {
    candidateId: 1,
    fullName: "Engineer1 Test1",
    currentInterviewStep: "Applied",
    applicationId: 100,
    averageScore: 4
  },
  ...
]
```

### PUT `/candidate/:id`
Actualiza fase del candidato
```json
Request: {
  applicationId: 100,
  currentInterviewStep: 102
}

Response: {
  message: "Candidate stage updated successfully",
  data: { id: 1, ... }
}
```

---

## 🎯 Requisitos para Ejecutar

✅ Backend corriendo en `http://localhost:3010`  
✅ Frontend corriendo en `http://localhost:3000`  
✅ PostgreSQL/BD accessible  
✅ Datos cargados (ejecutar seed-e2e.js)  
✅ Node.js y npm instalados  
✅ Dependencias Cypress instaladas (`npm install`)  

---

## 📖 Documentación Completa

Ver [cypress/README.md](../cypress/README.md) para información detallada, solución de problemas y ejemplos.

---

## ✨ Características de los Tests

- **Aleatorios:** Seleccionan una posición diferente cada vez para cobertura completa
- **Independientes:** No restauran BD entre ejecuciones
- **Robustos:** Manejo de errores y timeouts configurables
- **Integrales:** Validan tanto UI como API backend
- **Documentados:** Comentarios detallados en el código

---

## 🚦 Estado Actual

| Task | Status |
|------|--------|
| Cypress Config | ✅ Completado |
| Estructura de carpetas | ✅ Completado |
| Custom commands | ✅ Completado |
| Test Suite 1: Position Details | ✅ Completado |
| Test Suite 2: Drag-Drop | ✅ Completado |
| Seed data script | ✅ Completado |
| npm scripts | ✅ Completado |
| Documentación | ✅ Completado |

---

Última actualización: 28 de Enero, 2026
