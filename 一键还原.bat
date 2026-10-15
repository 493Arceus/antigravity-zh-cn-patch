@echo off
setlocal
chcp 65001 >nul
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
if %ERRORLEVEL% EQU 0 (
    echo.
    echo [OK] Restored to official original successfully. Closing in 2 seconds...
    timeout /t 2 >nul 2>&1
    exit /b 0
) else (
    echo.
    echo [ERROR] Restore failed. Please check the error message above.
    pause
    exit /b %ERRORLEVEL%
)
