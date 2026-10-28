@echo off
setlocal
cd /d "%~dp0"
node scripts\build.mjs
if errorlevel 1 exit /b %errorlevel%
echo.
echo Site ve Chrome/Firefox paketleri dist klasorunde hazir.
pause
