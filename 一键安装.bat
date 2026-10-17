@echo off
setlocal
chcp 65001 >nul
title AntiGravity 汉化与功能扩展集成向导

set "PS_SCRIPT=%~dp0install-cn.ps1"
if not exist "%PS_SCRIPT%" (
    set "PS_SCRIPT=%LOCALAPPDATA%\Programs\antigravity\resources\install-cn.ps1"
)

if not exist "%PS_SCRIPT%" (
    echo [ERROR] 未找到安装脚本 install-cn.ps1！
    echo 请确认该文件是否位于当前目录或 resources 目录下。
    pause
    exit /b 1
)

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%PS_SCRIPT%" %*
set "EXIT_CODE=%ERRORLEVEL%"

if %EXIT_CODE% EQU 0 (
    echo.
    echo 执行完成，窗口将在 3 秒后自动关闭...
    timeout /t 3 >nul 2>&1
    exit 0
) else (
    echo.
    echo [ERROR] 执行出现异常，请查看上方提示信息。
    pause
    exit %EXIT_CODE%
)