@echo off
setlocal
title AntiGravity Chinese Localization Restore
echo ========================================
echo   AntiGravity Chinese Patch Restore
echo ========================================

set "PS_SCRIPT=%~dp0uninstall-cn.ps1"
if not exist "%PS_SCRIPT%" (
    set "PS_SCRIPT=%LOCALAPPDATA%\Programs\antigravity\resources\uninstall-cn.ps1"
)

if not exist "%PS_SCRIPT%" (
    echo [ERROR] Cannot find uninstall-cn.ps1!
    echo Checked:
    echo   - %~dp0uninstall-cn.ps1
    echo   - %LOCALAPPDATA%\Programs\antigravity\resources\uninstall-cn.ps1
    pause
    exit /b 1
)

echo Running: "%PS_SCRIPT%"
echo.
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%PS_SCRIPT%"
echo.
pause
