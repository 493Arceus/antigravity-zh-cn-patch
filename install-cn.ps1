param(
    [string]$Action = "",
    [switch]$WithTokenRate = $false
)

# AntiGravity Client Chinese Localization & Extension Manager
$ErrorActionPreference = "Stop"

$appDir = "$env:LOCALAPPDATA\Programs\antigravity"
$resDir = Join-Path $appDir "resources"
$binDir = Join-Path $resDir "bin"
$lsExe = Join-Path $binDir "language_server.exe"
if (-not (Test-Path $lsExe)) {
    $altLs = Join-Path $resDir "app.asar.unpacked\extensions\antigravity\bin\language_server_windows_x64.exe"
    if (Test-Path $altLs) { $lsExe = $altLs }
}
$asarPath = Join-Path $resDir "app.asar"
$asarBakPath = Join-Path $resDir "app.asar.bak"
$targetWebBundle = Join-Path $resDir "web_bundle_zh"
$exePath = Join-Path $appDir "Antigravity.exe"

$sourceDir = $PSScriptRoot
$asarZhPath = Join-Path $sourceDir "app.asar.zh"
$zhJsPath = Join-Path $sourceDir "zh-CN.js"
$tokenRateJsPath = Join-Path $sourceDir "token-rate.js"

function Stop-AntiGravityProcesses {
    Write-Host "      正在关闭 AntiGravity 运行进程..." -ForegroundColor Yellow
    $procs = Get-Process | Where-Object { $_.ProcessName -match "^(Antigravity|language_server)$" }
    if ($procs) {
        $procs | Stop-Process -Force
        $procs | Wait-Process -Timeout 5 -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 1
    }
}

function Start-AntiGravityApp {
    param([string]$ExePath)
    if (Test-Path $ExePath) {
        Write-Host "正在启动 AntiGravity..." -ForegroundColor Cyan
        # 通过 explorer.exe 独立桌面进程唤起，彻底切断控制台句柄继承，确保安装向导控制台能按时自动关闭
        Start-Process -FilePath "explorer.exe" -ArgumentList "`"$ExePath`""
    }
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

function Install-Localization {
    param([bool]$InstallTokenRate)

    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host " AntiGravity 客户端汉化补丁安装" -ForegroundColor Green
    if ($InstallTokenRate) {
        Write-Host " [功能组件] 实时 Token 速率与缓存监控: 已启用" -ForegroundColor Magenta
    } else {
        Write-Host " [功能组件] 实时 Token 速率与缓存监控: 未安装 (纯净汉化)" -ForegroundColor Gray
    }
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ("补丁源路径: " + $sourceDir) -ForegroundColor Gray
    Write-Host ("程序安装路径: " + $appDir) -ForegroundColor Gray

    # 路径校验
    if (-not (Test-Path $appDir)) {
        Write-Host "[ERROR] 未找到 AntiGravity 安装目录: $appDir" -ForegroundColor Red
        Exit 1
    }
    if (-not (Test-Path $lsExe)) {
        Write-Host "[ERROR] 未找到 language_server.exe: $lsExe" -ForegroundColor Red
        Exit 1
    }
    if (-not (Test-Path $asarZhPath)) {
        Write-Host "[ERROR] 未找到汉化核心文件 app.asar.zh!" -ForegroundColor Red
        Exit 1
    }
    if (-not (Test-Path $zhJsPath)) {
        Write-Host "[ERROR] 未找到翻译词库文件 zh-CN.js!" -ForegroundColor Red
        Exit 1
    }

    try {
        # 1. 关闭进程
        Write-Host "[1/4] 关闭 AntiGravity 进程..." -ForegroundColor Yellow
        Stop-AntiGravityProcesses

        # 2. 提取并配置 web_bundle_zh
        Write-Host "[2/4] 部署本地化 Web 资源包..." -ForegroundColor Cyan
        $tempZip = Join-Path $env:TEMP ("ag_bundle_" + [Guid]::NewGuid().ToString("N") + ".zip")
        try {
            Write-Host "      正在从 language_server.exe 提取官方 Web 资产..." -ForegroundColor Gray
            $extracted = Extract-EmbeddedWebBundle -ExePath $lsExe -OutZipPath $tempZip
            if (-not $extracted) {
                Write-Host "[ERROR] 无法在 language_server.exe 中定位内置 Web 资源！" -ForegroundColor Red
                Exit 1
            }

            if (Test-Path $targetWebBundle) {
                Remove-Item $targetWebBundle -Recurse -Force
            }
            New-Item -ItemType Directory -Path $targetWebBundle -Force | Out-Null

            Write-Host "      解压官方 Web 资产..." -ForegroundColor Gray
            Expand-Archive -Path $tempZip -DestinationPath $targetWebBundle -Force

            # 注入 zh-CN.js
            Write-Host "      注入 zh-CN.js 汉化引擎..." -ForegroundColor Gray
            Copy-Item -Path $zhJsPath -Destination (Join-Path $targetWebBundle "zh-CN.js") -Force

            $indexPath = Join-Path $targetWebBundle "index.html"
            if (Test-Path $indexPath) {
                $html = [System.IO.File]::ReadAllText($indexPath, [System.Text.Encoding]::UTF8)
                if ($html -notmatch "zh-CN\.js") {
                    $html = $html.Replace("</body>", "    <script defer src=`"/zh-CN.js`"></script>`n  </body>")
                }

                # 注入 token-rate.js (若选择)
                if ($InstallTokenRate) {
                    if (Test-Path $tokenRateJsPath) {
                        Write-Host "      注入实时 Token 速率与缓存监控扩展..." -ForegroundColor Magenta
                        Copy-Item -Path $tokenRateJsPath -Destination (Join-Path $targetWebBundle "token-rate.js") -Force
                        $tokenRateLoader = '    <script>(() => { const s = document.createElement("script"); s.async = false; s.src = "/token-rate.js?v=" + Date.now(); document.head.appendChild(s); })();</script>'
                        $tokenRateRegex = '\s*<script[^>]*token-rate\.js[^>]*><\/script>|\s*<script[^>]*>(?:(?!<\/script>)[\s\S])*?token-rate\.js[\s\S]*?<\/script>'
                        $html = [regex]::Replace($html, $tokenRateRegex, '')
                        if ($html -match "</head>") {
                            $html = $html.Replace("</head>", "$tokenRateLoader`n  </head>")
                        } else {
                            $html = $html.Replace("</body>", "$tokenRateLoader`n  </body>")
                        }
                    }
                } else {
                    $tokenRateRegex = '\s*<script[^>]*token-rate\.js[^>]*><\/script>|\s*<script[^>]*>(?:(?!<\/script>)[\s\S])*?token-rate\.js[\s\S]*?<\/script>'
                    $html = [regex]::Replace($html, $tokenRateRegex, '')
                }

                [System.IO.File]::WriteAllText($indexPath, $html, (New-Object System.Text.UTF8Encoding($false)))
            } else {
                Write-Host "[ERROR] 提取的资源包中未找到 index.html！" -ForegroundColor Red
                Exit 1
            }
            Write-Host "      Web 资源包部署成功。" -ForegroundColor Green
        } finally {
            if (Test-Path $tempZip) {
                Remove-Item $tempZip -Force -ErrorAction SilentlyContinue
            }
        }

        # 3. 版本探测与 app.asar 备份
        $detectedVersion = $null
        if (Test-Path $asarPath) {
            try {
                $bytes = [System.IO.File]::ReadAllBytes($asarPath)
                $str = [System.Text.Encoding]::ASCII.GetString($bytes)
                $match = [regex]::Match($str, '"productName":\s*"Antigravity",\s*"version":\s*"([0-9]+\.[0-9]+\.[0-9]+)"')
                if ($match.Success) {
                    $detectedVersion = $match.Groups[1].Value
                    Write-Host ("      探测到官方应用版本号: " + $detectedVersion) -ForegroundColor Gray
                }
            } catch {}
        }

        if (-not (Test-Path $asarBakPath)) {
            Write-Host "[3/4] 备份官方原始 app.asar..." -ForegroundColor Cyan
            Copy-Item -Path $asarPath -Destination $asarBakPath -Force
            Write-Host "      备份已创建: app.asar.bak" -ForegroundColor Green
        } else {
            Write-Host "[3/4] 已存在官方备份: app.asar.bak" -ForegroundColor Gray
        }

        # 4. 应用 app.asar.zh 补丁
        Write-Host "[4/4] 应用 app.asar.zh 补丁..." -ForegroundColor Cyan
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
            Write-Host "[ERROR] 无法写入 app.asar，文件被占用！" -ForegroundColor Red
            Exit 1
        } else {
            # 同步版本号防止更新器弹窗
            if ($detectedVersion) {
                try {
                    $destBytes = [System.IO.File]::ReadAllBytes($asarPath)
                    $destStr = [System.Text.Encoding]::ASCII.GetString($destBytes)
                    $match = [regex]::Match($destStr, '"productName":\s*"Antigravity",\s*"version":\s*"([0-9]+\.[0-9]+\.[0-9]+)"')
                    if ($match.Success -and $match.Groups[1].Value -ne $detectedVersion) {
                        $oldVer = $match.Groups[1].Value
                        if ($oldVer.Length -eq $detectedVersion.Length) {
                            $newBytes = [System.Text.Encoding]::ASCII.GetBytes('"' + $detectedVersion + '"')
                            [System.Buffer]::BlockCopy($newBytes, 0, $destBytes, $match.Groups[1].Index - 1, $newBytes.Length)
                            [System.IO.File]::WriteAllBytes($asarPath, $destBytes)
                            Write-Host ("      已同步版本号至: " + $detectedVersion) -ForegroundColor Gray
                        }
                    }
                } catch {}
            }

            # 清理 updater 缓存
            $pendingDir = Join-Path $env:LOCALAPPDATA "antigravity-updater\pending"
            if (Test-Path $pendingDir) {
                Remove-Item (Join-Path $pendingDir "*") -Recurse -Force -ErrorAction SilentlyContinue
            }

            Write-Host "========================================" -ForegroundColor Cyan
            Write-Host " [SUCCESS] AntiGravity 汉化补丁安装成功！" -ForegroundColor Green
            Write-Host "========================================" -ForegroundColor Cyan
            Start-AntiGravityApp -ExePath $exePath
        }
    } catch {
        Write-Host "[ERROR] 安装过程发生异常: $_" -ForegroundColor Red
        Exit 1
    }
}

function Enable-TokenRate {
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host " 开启实时 Token 速率与缓存监控扩展" -ForegroundColor Magenta
    Write-Host "========================================" -ForegroundColor Cyan

    if (-not (Test-Path $targetWebBundle)) {
        Write-Host "[INFO] 尚未检测到已安装的汉化包，将自动执行完整安装并开启 Token 速率监控..." -ForegroundColor Yellow
        Install-Localization -InstallTokenRate $true
        return
    }
    if (-not (Test-Path $tokenRateJsPath)) {
        Write-Host "[ERROR] 未找到 token-rate.js 扩展源文件！" -ForegroundColor Red
        return
    }

    Copy-Item -Path $tokenRateJsPath -Destination (Join-Path $targetWebBundle "token-rate.js") -Force

    $indexPath = Join-Path $targetWebBundle "index.html"
    if (Test-Path $indexPath) {
        $html = [System.IO.File]::ReadAllText($indexPath, [System.Text.Encoding]::UTF8)
        $tokenRateLoader = '    <script>(() => { const s = document.createElement("script"); s.async = false; s.src = "/token-rate.js?v=" + Date.now(); document.head.appendChild(s); })();</script>'
        $tokenRateRegex = '\s*<script[^>]*token-rate\.js[^>]*><\/script>|\s*<script[^>]*>(?:(?!<\/script>)[\s\S])*?token-rate\.js[\s\S]*?<\/script>'
        $html = [regex]::Replace($html, $tokenRateRegex, '')
        if ($html -match "</head>") {
            $html = $html.Replace("</head>", "$tokenRateLoader`n  </head>")
        } else {
            $html = $html.Replace("</body>", "$tokenRateLoader`n  </body>")
        }
        [System.IO.File]::WriteAllText($indexPath, $html, (New-Object System.Text.UTF8Encoding($false)))
    }

    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host " [SUCCESS] Token 速率扩展已成功开启！" -ForegroundColor Green
    Write-Host " 提示：若 AntiGravity 已打开，在窗口内按 Ctrl+R 刷新即可直接生效。" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
}

function Disable-TokenRate {
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host " 关闭实时 Token 速率与缓存监控扩展" -ForegroundColor Yellow
    Write-Host "========================================" -ForegroundColor Cyan

    if (-not (Test-Path $targetWebBundle)) {
        Write-Host "[INFO] 未检测到 web_bundle_zh，扩展未在运行。" -ForegroundColor Yellow
        return
    }

    $installedTokenRateJs = Join-Path $targetWebBundle "token-rate.js"
    if (Test-Path $installedTokenRateJs) {
        Remove-Item -Path $installedTokenRateJs -Force -ErrorAction SilentlyContinue
    }

    $indexPath = Join-Path $targetWebBundle "index.html"
    if (Test-Path $indexPath) {
        $html = [System.IO.File]::ReadAllText($indexPath, [System.Text.Encoding]::UTF8)
        if ($html -match "token-rate\.js") {
            $tokenRateRegex = '\s*<script[^>]*token-rate\.js[^>]*><\/script>|\s*<script[^>]*>(?:(?!<\/script>)[\s\S])*?token-rate\.js[\s\S]*?<\/script>'
            $html = [regex]::Replace($html, $tokenRateRegex, '')
            [System.IO.File]::WriteAllText($indexPath, $html, (New-Object System.Text.UTF8Encoding($false)))
        }
    }

    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host " [SUCCESS] Token 速率扩展已关闭！" -ForegroundColor Yellow
    Write-Host " 提示：若 AntiGravity 已打开，在窗口内按 Ctrl+R 刷新即可还原。" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
}

function Uninstall-Localization {
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host " AntiGravity 还原官方英文原版" -ForegroundColor Yellow
    Write-Host "========================================" -ForegroundColor Cyan

    if (-not (Test-Path $asarBakPath)) {
        if (Test-Path (Join-Path $sourceDir "app.asar.bak")) {
            $asarBakPath = Join-Path $sourceDir "app.asar.bak"
        }
    }

    if (-not (Test-Path $asarBakPath)) {
        Write-Host "[ERROR] 未找到官方原始备份 app.asar.bak！" -ForegroundColor Red
        Exit 1
    }

    try {
        Write-Host "[1/3] 关闭 AntiGravity 进程..." -ForegroundColor Yellow
        Stop-AntiGravityProcesses

        Write-Host "[2/3] 还原官方原始 app.asar..." -ForegroundColor Cyan
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
            Write-Host "[ERROR] 无法还原 app.asar，文件被占用！" -ForegroundColor Red
            Exit 1
        }

        Write-Host "[3/3] 清理汉化资源 web_bundle_zh..." -ForegroundColor Cyan
        if (Test-Path $targetWebBundle) {
            Remove-Item $targetWebBundle -Recurse -Force -ErrorAction SilentlyContinue
            Write-Host "      web_bundle_zh 已删除。" -ForegroundColor Green
        }

        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host " [SUCCESS] 已成功还原官方英文原版！" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Cyan
        Start-AntiGravityApp -ExePath $exePath
    } catch {
        Write-Host "[ERROR] 还原过程发生异常: $_" -ForegroundColor Red
        Exit 1
    }
}

# ==========================================
# 交互式菜单处理 (当无参数调用时自动展示)
# ==========================================
if ([string]::IsNullOrWhiteSpace($Action) -and -not $WithTokenRate) {
    try { Clear-Host } catch {}
    Write-Host "========================================================" -ForegroundColor Cyan
    Write-Host "    🚀 AntiGravity 汉化补丁与功能扩展集成向导           " -ForegroundColor Green
    Write-Host "========================================================" -ForegroundColor Cyan
    Write-Host " 请选择您要执行的操作：" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  [1] 安装完整汉化（标准纯净版）" -ForegroundColor White
    Write-Host "  [2] 安装完整汉化 + 实时 Token 速率与缓存监控扩展 (推荐)" -ForegroundColor Magenta
    Write-Host "  ------------------------------------------------------" -ForegroundColor DarkGray
    Write-Host "  [3] 单独开启 Token 速率监控扩展（需已安装汉化）" -ForegroundColor Cyan
    Write-Host "  [4] 单独关闭 Token 速率监控扩展" -ForegroundColor Gray
    Write-Host "  [5] 一键卸载汉化，还原官方英文原版" -ForegroundColor Red
    Write-Host "  [0] 退出" -ForegroundColor DarkGray
    Write-Host ""
    Write-Host "--------------------------------------------------------" -ForegroundColor DarkGray
    try {
        $choice = Read-Host " 请输入选项数字 [0-5] (直接回车默认 [2])"
    } catch {
        $choice = "2"
    }
    if ([string]::IsNullOrWhiteSpace($choice)) { $choice = "2" }

    switch ($choice.Trim()) {
        "1" { $Action = "Install"; $WithTokenRate = $false }
        "2" { $Action = "Install"; $WithTokenRate = $true }
        "3" { $Action = "EnableTokenRate" }
        "4" { $Action = "DisableTokenRate" }
        "5" { $Action = "Uninstall" }
        "0" { Write-Host "已退出。"; Exit 0 }
        default {
            Write-Host "输入无效，默认执行推荐安装（汉化 + Token 速率）。" -ForegroundColor Yellow
            $Action = "Install"
            $WithTokenRate = $true
        }
    }
} elseif ([string]::IsNullOrWhiteSpace($Action) -and $WithTokenRate) {
    $Action = "Install"
}

# ==========================================
# 执行分发
# ==========================================
switch ($Action.ToLower()) {
    "install" {
        Install-Localization -InstallTokenRate $WithTokenRate
    }
    "enabletokenrate" {
        Enable-TokenRate
    }
    "disabletokenrate" {
        Disable-TokenRate
    }
    "uninstall" {
        Uninstall-Localization
    }
    "restore" {
        Uninstall-Localization
    }
    { $_ -in "help", "-help", "--help", "h", "-h", "/?" } {
        Write-Host "用法: powershell.exe -File install-cn.ps1 [-Action <操作>] [-WithTokenRate]"
        Write-Host "  -Action Install -WithTokenRate       安装汉化 + Token 速率监控扩展 (推荐)"
        Write-Host "  -Action Install                      安装纯净汉化"
        Write-Host "  -Action EnableTokenRate              单独开启 Token 速率监控"
        Write-Host "  -Action DisableTokenRate             单独关闭 Token 速率监控"
        Write-Host "  -Action Uninstall                    卸载汉化，还原官方英文原版"
        Exit 0
    }
    default {
        Write-Host "[ERROR] 未知操作指令: $Action" -ForegroundColor Red
        Exit 1
    }
}
