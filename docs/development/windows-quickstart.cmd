@echo off
setlocal

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed or is not available in PATH.
  echo Install Node.js LTS, reopen Command Prompt, and run this file again.
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo npm is not installed or is not available in PATH.
  exit /b 1
)

echo Node version:
node --version
echo npm version:
npm --version

echo.
echo Installing project dependencies...
call npm install
if errorlevel 1 exit /b 1

echo.
echo Starting the BEE Organization development server...
call npm run dev
