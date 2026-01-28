@echo off
REM Iniciar backend en background
start "Backend Server" cmd /k "cd /d C:\Users\jose.padilla\Desktop\AI4Devs-qa-2510-sr\backend && npm start"

REM Esperar 5 segundos
timeout /t 5

REM Iniciar frontend en background
start "Frontend Server" cmd /k "cd /d C:\Users\jose.padilla\Desktop\AI4Devs-qa-2510-sr\frontend && npm start"

REM Esperar 30 segundos para que ambos se inicialicen
timeout /t 30

REM Ejecutar tests
cd /d C:\Users\jose.padilla\Desktop\AI4Devs-qa-2510-sr
npx cypress run

pause
