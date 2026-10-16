param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("Enable", "Disable")]
    [string]$Action = "Enable"
)

$ErrorActionPreference = "Stop"

$appDir = "$env:LOCALAPPDATA\Programs\antigravity"
$resDir = Join-Path $appDir "resources"
$targetWebBundle = Join-Path $resDir "web_bundle_zh"
$indexPath = Join-Path $targetWebBundle "index.html"
$installedTokenRateJs = Join-Path $targetWebBundle "token-rate.js"
$sourceDir = $PSScriptRoot
$sourceTokenRateJs = Join-Path $sourceDir "token-rate.js"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " AntiGravity Token Rate Extension Manager" -ForegroundColor Green
Write-Host " Action: $Action" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Cyan

if (-not (Test-Path $targetWebBundle) -or -not (Test-Path $indexPath)) {
    Write-Host "[INFO] Chinese patch is not installed yet." -ForegroundColor Yellow
    Write-Host "Running full installation with Token Rate enabled..." -ForegroundColor Cyan
    & (Join-Path $sourceDir "install-cn.ps1") -WithTokenRate
    Exit 0
}

if ($Action -eq "Enable") {
    if (-not (Test-Path $sourceTokenRateJs)) {
        Write-Host "[ERROR] Cannot find token-rate.js in source directory: $sourceTokenRateJs" -ForegroundColor Red
        Exit 1
    }

    Copy-Item -Path $sourceTokenRateJs -Destination $installedTokenRateJs -Force
    $html = [System.IO.File]::ReadAllText($indexPath, [System.Text.Encoding]::UTF8)
    $cacheBuster = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
    # Remove any existing token-rate.js script tag
    $html = [regex]::Replace($html, '\s*<script(?: defer)? src="/token-rate\.js(?:\?[^"]*)?"></script>', '')
    # Inject into <head> before </head> to intercept __asu / fetch prior to main.js
    if ($html -match "</head>") {
        $html = $html.Replace("</head>", "    <script src=""/token-rate.js?v=$cacheBuster""></script>`n  </head>")
    } else {
        $html = $html.Replace("</body>", "    <script src=""/token-rate.js?v=$cacheBuster""></script>`n  </body>")
    }
    [System.IO.File]::WriteAllText($indexPath, $html, (New-Object System.Text.UTF8Encoding($false)))

    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host " [SUCCESS] Token Rate extension ENABLED!" -ForegroundColor Green
    Write-Host " Tip: In AntiGravity, press Ctrl+R to reload and activate immediately." -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
} else {
    # Disable
    if (Test-Path $installedTokenRateJs) {
        Remove-Item -Path $installedTokenRateJs -Force -ErrorAction SilentlyContinue
    }

    if (Test-Path $indexPath) {
        $html = [System.IO.File]::ReadAllText($indexPath, [System.Text.Encoding]::UTF8)
        if ($html -match "token-rate\.js") {
            $html = [regex]::Replace($html, '\s*<script(?: defer)? src="/token-rate\.js(?:\?[^"]*)?"></script>', '')
            [System.IO.File]::WriteAllText($indexPath, $html, (New-Object System.Text.UTF8Encoding($false)))
        }
    }

    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host " [SUCCESS] Token Rate extension DISABLED!" -ForegroundColor Yellow
    Write-Host " Tip: In AntiGravity, press Ctrl+R to reload and revert." -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
}
