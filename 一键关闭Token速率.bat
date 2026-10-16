@echo off
setlocal
chcp 65001 >nul
title AntiGravity - 关闭实时 Token 速率扩展
echo ========================================
echo   AntiGravity 关闭实时 Token 速率扩展
echo ========================================

set "PS_SCRIPT=%~dp0manage-token-rate.ps1"
if not exist "%PS_SCRIPT%" (
    echo [ERROR] Cannot find manage-token-rate.ps1!
    pause
    exit /b 1
)

echo 正在关闭实时 Token 速率扩展...
echo.
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%PS_SCRIPT%" -Action Disable
if %ERRORLEVEL% EQU 0 (
    echo.
    echo [OK] 已成功关闭实时 Token 速率扩展。
    echo 提示：若 AntiGravity 已打开，请在窗口内按下 Ctrl+R 刷新即可还原。
    echo 窗口将在 3 秒后自动关闭...
    timeout /t 3 >nul 2>&1
    exit /b 0
) else (
    echo.
    echo [ERROR] 关闭失败，请查看上方错误信息。
    pause
    exit /b %ERRORLEVEL%
)
