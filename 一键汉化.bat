@echo off
setlocal
title AntiGravity Chinese Localization
echo ========================================
echo   AntiGravity Chinese Patch Installer
echo ========================================

set "PS_SCRIPT=%~dp0install-cn.ps1"
if not exist "%PS_SCRIPT%" (
    set "PS_SCRIPT=%LOCALAPPDATA%\Programs\antigravity\resources\install-cn.ps1"
)

if not exist "%PS_SCRIPT%" (
    echo [ERROR] Cannot find install-cn.ps1!
    echo Checked:
    echo   - %~dp0install-cn.ps1
    echo   - %LOCALAPPDATA%\Programs\antigravity\resources\install-cn.ps1
    pause
    exit /b 1
)

echo Running: "%PS_SCRIPT%"
echo.
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%PS_SCRIPT%"
echo.
pause
