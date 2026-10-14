# AntiGravity Client Chinese Localization Installer
$ErrorActionPreference = "Stop"

$appDir = "$env:LOCALAPPDATA\Programs\antigravity"
$resDir = Join-Path $appDir "resources"
$binDir = Join-Path $resDir "bin"
$lsExe = Join-Path $binDir "language_server.exe"
$asarPath = Join-Path $resDir "app.asar"
$asarBakPath = Join-Path $resDir "app.asar.bak"
$targetWebBundle = Join-Path $resDir "web_bundle_zh"
$exePath = Join-Path $appDir "Antigravity.exe"

$sourceDir = $PSScriptRoot
$asarZhPath = Join-Path $sourceDir "app.asar.zh"
$zhJsPath = Join-Path $sourceDir "zh-CN.js"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " AntiGravity Client Chinese Localization" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ("Patch source: " + $sourceDir) -ForegroundColor Gray
Write-Host ("App path:     " + $appDir) -ForegroundColor Gray

# Validation
if (-not (Test-Path $appDir)) {
    Write-Host "[ERROR] AntiGravity installation not found at: $appDir" -ForegroundColor Red
    Exit 1
}

if (-not (Test-Path $lsExe)) {
    Write-Host "[ERROR] language_server.exe not found at: $lsExe" -ForegroundColor Red
    Exit 1
}

if (-not (Test-Path $asarZhPath)) {
    Write-Host "[ERROR] Cannot find app.asar.zh!" -ForegroundColor Red
    Exit 1
}

if (-not (Test-Path $zhJsPath)) {
    Write-Host "[ERROR] Cannot find zh-CN.js!" -ForegroundColor Red
    Exit 1
}

function Extract-EmbeddedWebBundle {
    param([string]$ExePath, [string]$OutZipPath)
    
    $fs = [System.IO.File]::OpenRead($ExePath)
    try {
        $length = $fs.Length
        $searchSize = [Math]::Min(32 * 1024 * 1024, $length)
        $startPos = $length - $searchSize
        $fs.Seek($startPos, [System.IO.SeekOrigin]::Begin) | Out-Null
        $buf = New-Object byte[] $searchSize
        $read = $fs.Read($buf, 0, $searchSize)

        for ($i = $searchSize - 22; $i -ge 0; $i--) {
            if ($buf[$i] -eq 0x50 -and $buf[$i+1] -eq 0x4b -and $buf[$i+2] -eq 0x05 -and $buf[$i+3] -eq 0x06) {
                $cdSize = [System.BitConverter]::ToUInt32($buf, $i + 12)
                $cdOffset = [System.BitConverter]::ToUInt32($buf, $i + 16)
                $eocdOffset = $startPos + $i
                $zipStart = $eocdOffset - $cdSize - $cdOffset
                if ($zipStart -ge 0) {
                    $fs.Seek($zipStart, [System.IO.SeekOrigin]::Begin) | Out-Null
                    $magic = New-Object byte[] 4
                    $fs.Read($magic, 0, 4) | Out-Null
                    if ($magic[0] -eq 0x50 -and $magic[1] -eq 0x4b -and $magic[2] -eq 0x03 -and $magic[3] -eq 0x04) {
                        $commentLen = [System.BitConverter]::ToUInt16($buf, $i + 20)
                        $zipLen = ($eocdOffset + 22 + $commentLen) - $zipStart
                        
                        $fs.Seek($zipStart, [System.IO.SeekOrigin]::Begin) | Out-Null
                        $outFs = [System.IO.File]::Create($OutZipPath)
                        try {
                            $copyBuf = New-Object byte[] 65536
                            $rem = $zipLen
                            while ($rem -gt 0) {
                                $toRead = [Math]::Min(65536, $rem)
                                $numRead = $fs.Read($copyBuf, 0, $toRead)
                                if ($numRead -le 0) { break }
                                $outFs.Write($copyBuf, 0, $numRead)
                                $rem -= $numRead
                            }
                        } finally {
                            $outFs.Close()
                        }
                        return $true
                    }
                }
            }
        }
        return $false
    } finally {
        $fs.Close()
    }
}

try {
    # 1. Close AntiGravity processes
    Write-Host "[1/4] Closing AntiGravity processes..." -ForegroundColor Yellow
    $procs = Get-Process | Where-Object { $_.ProcessName -match "^(Antigravity|language_server)$" }
    if ($procs) {
        $procs | Stop-Process -Force
        $procs | Wait-Process -Timeout 5 -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 1
    }

    # 2. Extract official web_bundle and inject zh-CN
    Write-Host "[2/4] Deploying localized web bundle..." -ForegroundColor Cyan
    $tempZip = Join-Path $env:TEMP ("ag_bundle_" + [Guid]::NewGuid().ToString("N") + ".zip")
    try {
        Write-Host "      Extracting official web assets from language_server.exe..." -ForegroundColor Gray
        $extracted = Extract-EmbeddedWebBundle -ExePath $lsExe -OutZipPath $tempZip
        if (-not $extracted) {
            Write-Host "[ERROR] Failed to locate embedded web bundle in language_server.exe!" -ForegroundColor Red
            Exit 1
        }

        if (Test-Path $targetWebBundle) {
            Remove-Item $targetWebBundle -Recurse -Force
        }
        New-Item -ItemType Directory -Path $targetWebBundle -Force | Out-Null

        Write-Host "      Unpacking web assets..." -ForegroundColor Gray
        Expand-Archive -Path $tempZip -DestinationPath $targetWebBundle -Force

        # Copy zh-CN.js
        Write-Host "      Injecting zh-CN.js localization engine..." -ForegroundColor Gray
        Copy-Item -Path $zhJsPath -Destination (Join-Path $targetWebBundle "zh-CN.js") -Force

        # Inject script tag into index.html
        $indexPath = Join-Path $targetWebBundle "index.html"
        if (Test-Path $indexPath) {
            $html = [System.IO.File]::ReadAllText($indexPath, [System.Text.Encoding]::UTF8)
            if ($html -notmatch "zh-CN\.js") {
                $html = $html.Replace("</body>", "    <script defer src=""/zh-CN.js""></script>`n  </body>")
                [System.IO.File]::WriteAllText($indexPath, $html, [System.Text.Encoding]::UTF8)
            }
        } else {
            Write-Host "[ERROR] index.html not found in extracted bundle!" -ForegroundColor Red
            Exit 1
        }
        Write-Host "      Web bundle deployed successfully." -ForegroundColor Green
    } finally {
        if (Test-Path $tempZip) {
            Remove-Item $tempZip -Force -ErrorAction SilentlyContinue
        }
    }

    # 3. Backup original app.asar
    if (-not (Test-Path $asarBakPath)) {
        Write-Host "[3/4] Backing up original app.asar..." -ForegroundColor Cyan
        Copy-Item -Path $asarPath -Destination $asarBakPath -Force
        Write-Host "      Backup created: app.asar.bak" -ForegroundColor Green
    } else {
        Write-Host "[3/4] Backup already exists: app.asar.bak" -ForegroundColor Gray
    }

    # 4. Apply app.asar.zh patch
    Write-Host "[4/4] Applying app.asar.zh patch..." -ForegroundColor Cyan
    $copied = $false
    $attempts = 0
    while (-not $copied -and $attempts -lt 15) {
        try {
            Copy-Item -Path $asarZhPath -Destination $asarPath -Force -ErrorAction Stop
            $copied = $true
        } catch {
            $attempts++
            Start-Sleep -Milliseconds 600
        }
    }

    if (-not $copied) {
        Write-Host "[ERROR] Failed to overwrite app.asar, file locked!" -ForegroundColor Red
        Exit 1
    } else {
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host " [SUCCESS] Chinese localization applied!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Cyan
    }
} finally {
    Write-Host "Starting AntiGravity..." -ForegroundColor Cyan
    Start-Process -FilePath $exePath
}
