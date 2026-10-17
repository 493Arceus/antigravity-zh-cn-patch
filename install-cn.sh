#!/bin/bash
set -e

# AntiGravity Client Chinese Localization & Extension Manager (macOS)

APP_PATH="/Applications/Antigravity.app"
if [ ! -d "$APP_PATH" ]; then
    APP_PATH="$HOME/Applications/Antigravity.app"
fi

if [ ! -d "$APP_PATH" ]; then
    echo -e "\033[1;31m[ERROR] AntiGravity.app not found in /Applications or ~/Applications!\033[0m"
    exit 1
fi

CONTENTS_DIR="$APP_PATH/Contents"
RES_DIR="$CONTENTS_DIR/Resources"
BIN_DIR="$RES_DIR/bin"
LS_BIN="$BIN_DIR/language_server"
ASAR_PATH="$RES_DIR/app.asar"
ASAR_BAK="$RES_DIR/app.asar.bak"
TARGET_WEB_BUNDLE="$RES_DIR/web_bundle_zh"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ASAR_ZH="$SCRIPT_DIR/app.asar.zh"
ZH_JS="$SCRIPT_DIR/zh-CN.js"
TOKEN_RATE_JS="$SCRIPT_DIR/token-rate.js"

stop_antigravity() {
    echo -e "\033[1;33m      正在关闭 AntiGravity 运行进程...\033[0m"
    killall Antigravity language_server 2>/dev/null || true
    sleep 1
}

install_localization() {
    local install_token_rate="$1"

    echo -e "\033[1;36m========================================\033[0m"
    echo -e "\033[1;32m AntiGravity 客户端汉化补丁安装 (macOS)\033[0m"
    if [ "$install_token_rate" = true ]; then
        echo -e "\033[1;35m [功能组件] 实时 Token 速率与缓存监控: 已启用\033[0m"
    else
        echo -e "\033[0;37m [功能组件] 实时 Token 速率与缓存监控: 未安装 (纯净汉化)\033[0m"
    fi
    echo -e "\033[1;36m========================================\033[0m"
    echo -e "\033[0;37m补丁源路径: $SCRIPT_DIR\033[0m"
    echo -e "\033[0;37m程序安装路径: $APP_PATH\033[0m"

    if [ ! -f "$LS_BIN" ]; then
        echo -e "\033[1;31m[ERROR] language_server not found at: $LS_BIN\033[0m"
        exit 1
    fi
    if [ ! -f "$ASAR_ZH" ]; then
        echo -e "\033[1;31m[ERROR] app.asar.zh not found in $SCRIPT_DIR!\033[0m"
        exit 1
    fi
    if [ ! -f "$ZH_JS" ]; then
        echo -e "\033[1;31m[ERROR] zh-CN.js not found in $SCRIPT_DIR!\033[0m"
        exit 1
    fi

    # 1. 关闭进程
    echo -e "\033[1;33m[1/4] 关闭 AntiGravity 进程...\033[0m"
    stop_antigravity

    # 2. 提取并配置 web_bundle_zh
    echo -e "\033[1;36m[2/4] 部署本地化 Web 资源包...\033[0m"
    TEMP_ZIP=$(mktemp /tmp/ag_bundle_XXXXXX.zip)

    echo -e "\033[0;37m      正在从 language_server 提取官方 Web 资产...\033[0m"
    python3 -c "
import os, struct, sys

def extract_bundle(exe_path, out_zip):
    with open(exe_path, 'rb') as f:
        f.seek(0, os.SEEK_END)
        total_len = f.tell()
        search_size = min(32 * 1024 * 1024, total_len)
        start_pos = total_len - search_size
        f.seek(start_pos)
        buf = f.read(search_size)
        
        for i in range(search_size - 22, -1, -1):
            if buf[i:i+4] == b'PK\x05\x06':
                cd_size, cd_offset = struct.unpack('<II', buf[i+12:i+20])
                eocd_pos = start_pos + i
                zip_start = eocd_pos - cd_size - cd_offset
                if zip_start >= 0:
                    f.seek(zip_start)
                    if f.read(4) == b'PK\x03\x04':
                        comment_len = struct.unpack('<H', buf[i+20:i+22])[0]
                        zip_len = (eocd_pos + 22 + comment_len) - zip_start
                        f.seek(zip_start)
                        with open(out_zip, 'wb') as out_f:
                            rem = zip_len
                            while rem > 0:
                                chunk = f.read(min(65536, rem))
                                if not chunk: break
                                out_f.write(chunk)
                                rem -= len(chunk)
                        return True
    return False

if not extract_bundle(sys.argv[1], sys.argv[2]):
    sys.exit(1)
" "$LS_BIN" "$TEMP_ZIP"

    if [ ! -s "$TEMP_ZIP" ]; then
        echo -e "\033[1;31m[ERROR] 提取官方 Web 资产失败！\033[0m"
        rm -f "$TEMP_ZIP"
        exit 1
    fi

    rm -rf "$TARGET_WEB_BUNDLE"
    mkdir -p "$TARGET_WEB_BUNDLE"

    echo -e "\033[0;37m      解压官方 Web 资产...\033[0m"
    unzip -q "$TEMP_ZIP" -d "$TARGET_WEB_BUNDLE"
    rm -f "$TEMP_ZIP"

    echo -e "\033[0;37m      注入 zh-CN.js 汉化引擎...\033[0m"
    cp -f "$ZH_JS" "$TARGET_WEB_BUNDLE/zh-CN.js"

    INDEX_HTML="$TARGET_WEB_BUNDLE/index.html"
    if [ -f "$INDEX_HTML" ]; then
        python3 -c "
import re
with open('$INDEX_HTML', 'r', encoding='utf-8') as f:
    content = f.read()
if 'zh-CN.js' not in content:
    content = content.replace('</body>', '    <script defer src=\"/zh-CN.js\"></script>\n  </body>')
content = re.sub(r'\s*<script[^>]*token-rate\.js[^>]*></script>|\s*<script[^>]*>(?:(?!</script>)[\s\S])*?token-rate\.js[\s\S]*?</script>', '', content)
with open('$INDEX_HTML', 'w', encoding='utf-8') as f:
    f.write(content)
"
        if [ "$install_token_rate" = true ]; then
            if [ -f "$TOKEN_RATE_JS" ]; then
                echo -e "\033[1;35m      注入实时 Token 速率与缓存监控扩展...\033[0m"
                cp -f "$TOKEN_RATE_JS" "$TARGET_WEB_BUNDLE/token-rate.js"
                python3 -c "
with open('$INDEX_HTML', 'r', encoding='utf-8') as f:
    content = f.read()
token_loader = '    <script>(() => { const s = document.createElement(\"script\"); s.async = false; s.src = \"/token-rate.js?v=\" + Date.now(); document.head.appendChild(s); })();</script>'
if '</head>' in content:
    content = content.replace('</head>', f'{token_loader}\n  </head>')
else:
    content = content.replace('</body>', f'{token_loader}\n  </body>')
with open('$INDEX_HTML', 'w', encoding='utf-8') as f:
    f.write(content)
"
            fi
        fi
    else
        echo -e "\033[1;31m[ERROR] 资源包中未找到 index.html！\033[0m"
        exit 1
    fi
    echo -e "\033[1;32m      Web 资源包部署成功。\033[0m"

    # 3. 备份原始 app.asar
    if [ ! -f "$ASAR_BAK" ]; then
        echo -e "\033[1;36m[3/4] 备份官方原始 app.asar...\033[0m"
        cp -f "$ASAR_PATH" "$ASAR_BAK"
        echo -e "\033[1;32m      备份已创建: app.asar.bak\033[0m"
    else
        echo -e "\033[0;37m[3/4] 已存在官方备份: app.asar.bak\033[0m"
    fi

    # 4. 应用 app.asar.zh 补丁
    echo -e "\033[1;36m[4/4] 应用 app.asar.zh 补丁...\033[0m"
    cp -f "$ASAR_ZH" "$ASAR_PATH"

    # 清理 updater 缓存
    rm -rf "$HOME/Library/Caches/antigravity-updater/pending" 2>/dev/null || true

    # Gatekeeper 签名重置
    xattr -cr "$APP_PATH" 2>/dev/null || true
    codesign --force --deep --sign - "$APP_PATH" 2>/dev/null || true

    echo -e "\033[1;36m========================================\033[0m"
    echo -e "\033[1;32m [SUCCESS] AntiGravity 汉化补丁安装成功！\033[0m"
    echo -e "\033[1;36m========================================\033[0m"

    echo "正在启动 AntiGravity..."
    open -a "$APP_PATH"
}

enable_token_rate() {
    echo -e "\033[1;36m========================================\033[0m"
    echo -e "\033[1;35m 开启实时 Token 速率与缓存监控扩展 (macOS)\033[0m"
    echo -e "\033[1;36m========================================\033[0m"

    if [ ! -d "$TARGET_WEB_BUNDLE" ]; then
        echo -e "\033[1;33m[INFO] 尚未检测到已安装的汉化包，将自动执行完整安装并开启 Token 速率监控...\033[0m"
        install_localization true
        return
    fi
    if [ ! -f "$TOKEN_RATE_JS" ]; then
        echo -e "\033[1;31m[ERROR] 未找到 token-rate.js 扩展源文件！\033[0m"
        return
    fi

    cp -f "$TOKEN_RATE_JS" "$TARGET_WEB_BUNDLE/token-rate.js"
    INDEX_HTML="$TARGET_WEB_BUNDLE/index.html"
    if [ -f "$INDEX_HTML" ]; then
        python3 -c "
import re
with open('$INDEX_HTML', 'r', encoding='utf-8') as f:
    content = f.read()
token_loader = '    <script>(() => { const s = document.createElement(\"script\"); s.async = false; s.src = \"/token-rate.js?v=\" + Date.now(); document.head.appendChild(s); })();</script>'
content = re.sub(r'\s*<script[^>]*token-rate\.js[^>]*></script>|\s*<script[^>]*>(?:(?!</script>)[\s\S])*?token-rate\.js[\s\S]*?</script>', '', content)
if '</head>' in content:
    content = content.replace('</head>', f'{token_loader}\n  </head>')
else:
    content = content.replace('</body>', f'{token_loader}\n  </body>')
with open('$INDEX_HTML', 'w', encoding='utf-8') as f:
    f.write(content)
"
    fi

    echo -e "\033[1;36m========================================\033[0m"
    echo -e "\033[1;32m [SUCCESS] Token 速率扩展已成功开启！\033[0m"
    echo -e "\033[1;36m 提示：若 AntiGravity 已打开，在窗口内按 Command+R 刷新即可直接生效。\033[0m"
    echo -e "\033[1;36m========================================\033[0m"
}

disable_token_rate() {
    echo -e "\033[1;36m========================================\033[0m"
    echo -e "\033[1;33m 关闭实时 Token 速率与缓存监控扩展 (macOS)\033[0m"
    echo -e "\033[1;36m========================================\033[0m"

    rm -f "$TARGET_WEB_BUNDLE/token-rate.js"

    INDEX_HTML="$TARGET_WEB_BUNDLE/index.html"
    if [ -f "$INDEX_HTML" ]; then
        python3 -c "
import re
with open('$INDEX_HTML', 'r', encoding='utf-8') as f:
    content = f.read()
content = re.sub(r'\s*<script[^>]*token-rate\.js[^>]*></script>|\s*<script[^>]*>(?:(?!</script>)[\s\S])*?token-rate\.js[\s\S]*?</script>', '', content)
with open('$INDEX_HTML', 'w', encoding='utf-8') as f:
    f.write(content)
"
    fi

    echo -e "\033[1;36m========================================\033[0m"
    echo -e "\033[1;33m [SUCCESS] Token 速率扩展已关闭！\033[0m"
    echo -e "\033[1;36m 提示：若 AntiGravity 已打开，在窗口内按 Command+R 刷新即可还原。\033[0m"
    echo -e "\033[1;36m========================================\033[0m"
}

uninstall_localization() {
    echo -e "\033[1;36m========================================\033[0m"
    echo -e "\033[1;33m AntiGravity 还原官方英文原版 (macOS)\033[0m"
    echo -e "\033[1;36m========================================\033[0m"

    if [ ! -f "$ASAR_BAK" ] && [ -f "$SCRIPT_DIR/app.asar.bak" ]; then
        ASAR_BAK="$SCRIPT_DIR/app.asar.bak"
    fi

    if [ ! -f "$ASAR_BAK" ]; then
        echo -e "\033[1;31m[ERROR] 未找到官方原始备份 app.asar.bak！\033[0m"
        exit 1
    fi

    echo -e "\033[1;33m[1/3] 关闭 AntiGravity 进程...\033[0m"
    stop_antigravity

    echo -e "\033[1;36m[2/3] 还原官方原始 app.asar...\033[0m"
    cp -f "$ASAR_BAK" "$ASAR_PATH"

    echo -e "\033[1;36m[3/3] 清理汉化资源 web_bundle_zh...\033[0m"
    rm -rf "$TARGET_WEB_BUNDLE"

    xattr -cr "$APP_PATH" 2>/dev/null || true
    codesign --force --deep --sign - "$APP_PATH" 2>/dev/null || true

    echo -e "\033[1;36m========================================\033[0m"
    echo -e "\033[1;32m [SUCCESS] 已成功还原官方英文原版！\033[0m"
    echo -e "\033[1;36m========================================\033[0m"

    echo "正在启动 AntiGravity..."
    open -a "$APP_PATH"
}

# ==========================================
# 参数解析与交互菜单
# ==========================================
ACTION=""
WITH_TOKEN_RATE=false

for arg in "$@"; do
    case "$arg" in
        --with-token-rate|-2)
            ACTION="install"
            WITH_TOKEN_RATE=true
            ;;
        --standard|-1)
            ACTION="install"
            WITH_TOKEN_RATE=false
            ;;
        --enable-token-rate|-3)
            ACTION="enable-token-rate"
            ;;
        --disable-token-rate|-4)
            ACTION="disable-token-rate"
            ;;
        --uninstall|--restore|-5)
            ACTION="uninstall"
            ;;
        --help|-h)
            echo "用法: ./install-cn.sh [选项]"
            echo "  --standard, -1           安装完整汉化（标准纯净版）"
            echo "  --with-token-rate, -2    安装完整汉化 + 实时 Token 速率与缓存监控扩展 (推荐)"
            echo "  --enable-token-rate, -3  单独开启 Token 速率监控扩展"
            echo "  --disable-token-rate, -4 单独关闭 Token 速率监控扩展"
            echo "  --uninstall, -5          一键卸载汉化，还原官方英文原版"
            exit 0
            ;;
    esac
done

if [ -z "$ACTION" ]; then
    echo ""
    echo -e "\033[1;36m========================================================\033[0m"
    echo -e "\033[1;32m    🚀 AntiGravity 汉化补丁与功能扩展集成向导 (macOS)   \033[0m"
    echo -e "\033[1;36m========================================================\033[0m"
    echo -e "\033[1;33m 请选择您要执行的操作：\033[0m"
    echo ""
    echo -e "  [1] 安装完整汉化（标准纯净版）"
    echo -e "  [2] 安装完整汉化 + 实时 Token 速率与缓存监控扩展 (推荐)"
    echo -e "  \033[0;37m------------------------------------------------------\033[0m"
    echo -e "  [3] 单独开启 Token 速率监控扩展（需已安装汉化）"
    echo -e "  [4] 单独关闭 Token 速率监控扩展"
    echo -e "  [5] 一键卸载汉化，还原官方英文原版"
    echo -e "  [0] 退出"
    echo ""
    echo -e "\033[0;37m--------------------------------------------------------\033[0m"
    read -p " 请输入选项数字 [0-5] (直接回车默认 [2]): " choice
    choice="${choice:-2}"
    case "$choice" in
        1) ACTION="install"; WITH_TOKEN_RATE=false ;;
        2) ACTION="install"; WITH_TOKEN_RATE=true ;;
        3) ACTION="enable-token-rate" ;;
        4) ACTION="disable-token-rate" ;;
        5) ACTION="uninstall" ;;
        0) echo "已退出。"; exit 0 ;;
        *) echo "输入无效，默认执行推荐安装（汉化 + Token 速率）。"; ACTION="install"; WITH_TOKEN_RATE=true ;;
    esac
fi

case "$ACTION" in
    install)
        install_localization "$WITH_TOKEN_RATE"
        ;;
    enable-token-rate)
        enable_token_rate
        ;;
    disable-token-rate)
        disable_token_rate
        ;;
    uninstall)
        uninstall_localization
        ;;
    *)
        echo -e "\033[1;31m[ERROR] 未知操作指令: $ACTION\033[0m"
        exit 1
        ;;
esac
