# 🚀 Guía Paso a Paso: Ejecutar Pruebas Cypress E2E

## Prerequisitos

Antes de comenzar, asegúrate de tener:

1. **Node.js y npm** instalados
2. **Backend** corriendo en `http://localhost:3010`
3. **Frontend** corriendo en `http://localhost:3000`
4. **PostgreSQL** corriendo y accesible
5. **Base de datos** con datos

---

## ✅ Paso 1: Instalar Dependencias

```bash
# Desde la raíz del proyecto
npm install
```

Esto instala:
- ✅ Cypress (^15.9.0)
- ✅ @4tw/cypress-drag-drop (^2.2.5)

---

## ✅ Paso 2: Cargar Datos de Prueba (Opcional)

Si no tienes datos de prueba en la BD, carga el seed E2E:

```bash
cd backend
node prisma/seed-e2e.js
```

**Output esperado:**
```
🌱 Seeding database with E2E test data...
✅ E2E test data seeded successfully!
Created 3 positions with 16 applications
```

Esto crea:
- 3 posiciones diferentes
- ~16 aplicaciones de candidatos
- Candidatos en fases: Applied, Interview, Offer

---

## ✅ Paso 3: Iniciar Modo Interactivo

Para ver los tests ejecutándose en tiempo real:

```bash
npm run cypress:open
```

**Qué sucede:**
1. Se abre la interfaz gráfica de Cypress
2. Selecciona "E2E Testing"
3. Selecciona tu navegador (Chrome, Firefox, etc.)
4. Haz clic en `positionDetails.cy.js` o `candidateDragDrop.cy.js`

**En modo interactivo puedes:**
- ✅ Ver la ejecución en tiempo real
- ✅ Pausar y depurar
- ✅ Inspeccionar elementos
- ✅ Revisar comandos ejecutados

---

## ✅ Paso 4: Ejecutar Tests en CLI (Headless)

Para ejecutar sin interfaz gráfica:

```bash
npm run cypress:run
```

**Qué sucede:**
1. Ejecuta todos los tests
2. Genera reportes
3. Si hay fallos, muestra capturas de pantalla
4. Devuelve exit code (0 = éxito, 1 = fallo)

---

## ✅ Paso 5: Ejecutar Test Específico

### Solo test de Position Details:
```bash
npx cypress run --spec "cypress/e2e/positionDetails.cy.js"
```

### Solo test de Drag-Drop:
```bash
npx cypress run --spec "cypress/e2e/candidateDragDrop.cy.js"
```

---

## 📊 Entendiendo los Tests

### Test 1: Position Details (`positionDetails.cy.js`)

**¿Qué valida?**
- ✅ Título de la posición visible
- ✅ Columnas de fases renderizadas
- ✅ Candidatos en sus columnas correctas

**Tiempo de ejecución:** ~30-60 segundos

**Ejemplo de salida:**
```
✓ Should display the position title on the page
✓ Should display the position title as a heading
✓ Should render stage columns from the interview flow
✓ Should have the correct number of stage columns
✓ Should display stage columns in the correct order
✓ Should display candidates in their correct stage columns
✓ Should group candidates by stage correctly
✓ Should display candidate rating information
✓ Should maintain correct candidate positioning in their columns
```

---

### Test 2: Drag-Drop (`candidateDragDrop.cy.js`)

**¿Qué valida?**
- ✅ Drag-drop simula movimiento de candidato
- ✅ Candidato aparece en nueva columna
- ✅ API recibe PUT request correcto
- ✅ `interviewStepId` y `applicationId` se envían

**Tiempo de ejecución:** ~60-90 segundos

**Ejemplo de salida:**
```
✓ Should find a candidate card to drag
✓ Should initiate drag action on candidate card
✓ Should move candidate card to target column using drag and drop
✓ Should send PUT request with correct interviewStepId to backend
✓ Should update candidate to the correct interview step
✓ Should include applicationId in the PUT request
✓ Should send PUT request to correct endpoint with candidateId
✓ Should handle successful API response after drag and drop
✓ Should complete full drag-and-drop workflow without errors
```

---

## 🔍 Verificar que Todo Funciona

### 1. Verificar Backend está corriendo
```bash
curl http://localhost:3010/positions
```
Debe devolver un JSON con posiciones.

### 2. Verificar Frontend está corriendo
```bash
curl http://localhost:3000
```
Debe devolver HTML de la aplicación React.

### 3. Verificar BD tiene datos
```bash
# Desde PostgreSQL
SELECT COUNT(*) FROM positions;  -- Debe ser > 0
SELECT COUNT(*) FROM applications;  -- Debe ser > 0
```

---

## ⚠️ Solución de Problemas

### Problema: "Can't reach database"
```
❌ Error: Can't reach database server at `localhost:5432`
```
**Solución:** Inicia PostgreSQL o Docker
```bash
docker-compose up -d
```

### Problema: "No positions found"
```
❌ Todos los tests fallan, no hay posiciones
```
**Solución:** Ejecuta el seed
```bash
cd backend
node prisma/seed-e2e.js
```

### Problema: "Can't connect to backend"
```
❌ Error: Can't reach http://localhost:3010
```
**Solución:** Inicia el backend
```bash
cd backend
npm start
```

### Problema: "Can't connect to frontend"
```
❌ Error: Can't reach http://localhost:3000
```
**Solución:** Inicia el frontend
```bash
cd frontend
npm start
```

### Problema: Drag-Drop no funciona
```
❌ Test falla en drag operation
```
**Causas comunes:**
- La posición tiene solo 1 fase (necesita 2+)
- No hay candidatos en la primera fase
- El navegador no soporta drag-drop

---

## 📋 Checklist Final

Antes de considerar los tests como "listos":

- [ ] Backend corriendo en port 3010
- [ ] Frontend corriendo en port 3000
- [ ] PostgreSQL corriendo
- [ ] Seed-e2e.js ejecutado (si no hay datos)
- [ ] `npm install` completado
- [ ] `npm run cypress:open` abre la UI
- [ ] Tests pueden ejecutarse sin errores críticos
- [ ] Posiciones con múltiples candidatos existen

---

## 🎯 Ejemplos de Uso

### Ejecutar todo y generar reporte
```bash
npm run cypress:run -- --reporter json --reporter-options outputFile=cypress/results/results.json
```

### Ejecutar con video
```bash
npm run cypress:run -- --record
```

### Ejecutar solo tests exitosos (skip failed)
```bash
npm run cypress:run -- --headed
```

### Debug mode
```bash
npm run cypress:run -- --debug
```

---

## 📚 Recursos

- [Cypress Docs](https://docs.cypress.io)
- [API Reference](https://docs.cypress.io/api/table-of-contents)
- [Best Practices](https://docs.cypress.io/guides/references/best-practices)

---

## 🎬 Demostración Rápida

```bash
# 1. Instalar
npm install

# 2. Cargar datos
cd backend && node prisma/seed-e2e.js && cd ..

# 3. Iniciar modo interactivo
npm run cypress:open

# 4. Seleccionar y ejecutar test
# ... haz clic en positionDetails.cy.js
```

**¡Listo! Los tests deberían ejecutarse.**

---

Última actualización: 28 de Enero, 2026
