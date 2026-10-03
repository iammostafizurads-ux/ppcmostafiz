@echo off
title PPC Mostafiz Portfolio - Local Preview Server
echo ==============================================================
echo   PPC Mostafiz Portfolio (ppcmostafiz.com)
echo   Starting local web server at http://localhost:8080 ...
echo ==============================================================
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0serve.ps1"
pause
