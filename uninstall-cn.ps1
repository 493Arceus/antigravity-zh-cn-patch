# AntiGravity Client Chinese Localization Uninstaller
$ErrorActionPreference = "Stop"

$appDir = "$env:LOCALAPPDATA\Programs\antigravity"
$resDir = Join-Path $appDir "resources"
$asarPath = Join-Path $resDir "app.asar"
$asarBakPath = Join-Path $resDir "app.asar.bak"
$targetWebBundle = Join-Path $resDir "web_bundle_zh"
$exePath = Join-Path $appDir "Antigravity.exe"

if (-not (Test-Path $asarBakPath)) {
    if (Test-Path (Join-Path $PSScriptRoot "app.asar.bak")) {
        $asarBakPath = Join-Path $PSScriptRoot "app.asar.bak"
    }
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " AntiGravity Chinese Localization Restore" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan

if (-not (Test-Path $asarBakPath)) {
    Write-Host "[ERROR] Original app.asar.bak not found!" -ForegroundColor Red
    Exit 1
}

try {
    # 1. Close AntiGravity processes
    Write-Host "[1/3] Closing AntiGravity processes..." -ForegroundColor Yellow
    $procs = Get-Process | Where-Object { $_.ProcessName -match "^(Antigravity|language_server)$" }
    if ($procs) {
        $procs | Stop-Process -Force
        $procs | Wait-Process -Timeout 5 -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 1
    }

    # 2. Restore original app.asar
    Write-Host "[2/3] Restoring original app.asar..." -ForegroundColor Cyan
    $copied = $false
    $attempts = 0
    while (-not $copied -and $attempts -lt 15) {
        try {
            Copy-Item -Path $asarBakPath -Destination $asarPath -Force -ErrorAction Stop
            $copied = $true
        } catch {
            $attempts++
            Start-Sleep -Milliseconds 600
        }
    }

    if (-not $copied) {
        Write-Host "[ERROR] Failed to restore app.asar, file locked!" -ForegroundColor Red
        Exit 1
    }

    # 3. Clean up web_bundle_zh directory
    Write-Host "[3/3] Cleaning up localized web bundle..." -ForegroundColor Cyan
    if (Test-Path $targetWebBundle) {
        Remove-Item $targetWebBundle -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "      web_bundle_zh removed." -ForegroundColor Green
    }

    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host " [SUCCESS] Restored to official original!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
} finally {
    Write-Host "Starting AntiGravity..." -ForegroundColor Cyan
    Start-Process -FilePath $exePath
}
