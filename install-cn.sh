#!/bin/bash
set -e

# AntiGravity Client Chinese Localization Installer (macOS)

echo -e "\033[1;36m========================================\033[0m"
echo -e "\033[1;32m AntiGravity Chinese Patch (macOS)\033[0m"
echo -e "\033[1;36m========================================\033[0m"

# 1. Locate Application
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

echo -e "\033[0;37mPatch source: $SCRIPT_DIR\033[0m"
echo -e "\033[0;37mApp path:     $APP_PATH\033[0m"

# Validation
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

# 1. Terminate AntiGravity processes
echo -e "\033[1;33m[1/4] Closing AntiGravity processes...\033[0m"
killall Antigravity language_server 2>/dev/null || true
sleep 1

# 2. Extract official web_bundle and inject zh-CN
echo -e "\033[1;36m[2/4] Deploying localized web bundle...\033[0m"
TEMP_ZIP=$(mktemp /tmp/ag_bundle_XXXXXX.zip)

echo -e "\033[0;37m      Extracting official web assets from language_server...\033[0m"
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
    echo -e "\033[1;31m[ERROR] Failed to extract web assets from language_server!\033[0m"
    rm -f "$TEMP_ZIP"
    exit 1
fi

rm -rf "$TARGET_WEB_BUNDLE"
mkdir -p "$TARGET_WEB_BUNDLE"

echo -e "\033[0;37m      Unpacking web assets...\033[0m"
unzip -q "$TEMP_ZIP" -d "$TARGET_WEB_BUNDLE"
rm -f "$TEMP_ZIP"

echo -e "\033[0;37m      Injecting zh-CN.js localization engine...\033[0m"
cp -f "$ZH_JS" "$TARGET_WEB_BUNDLE/zh-CN.js"

INDEX_HTML="$TARGET_WEB_BUNDLE/index.html"
if [ -f "$INDEX_HTML" ]; then
    if ! grep -q "zh-CN.js" "$INDEX_HTML"; then
        python3 -c "
with open('$INDEX_HTML', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace('</body>', '    <script defer src=\"/zh-CN.js\"></script>\n  </body>')
with open('$INDEX_HTML', 'w', encoding='utf-8') as f:
    f.write(content)
"
    fi
else
    echo -e "\033[1;31m[ERROR] index.html not found in extracted bundle!\033[0m"
    exit 1
fi
echo -e "\033[1;32m      Web bundle deployed successfully.\033[0m"

# 3. Backup original app.asar
if [ ! -f "$ASAR_BAK" ]; then
    echo -e "\033[1;36m[3/4] Backing up original app.asar...\033[0m"
    cp -f "$ASAR_PATH" "$ASAR_BAK"
    echo -e "\033[1;32m      Backup created: app.asar.bak\033[0m"
else
    echo -e "\033[0;37m[3/4] Backup already exists: app.asar.bak\033[0m"
fi

# 4. Apply app.asar.zh patch & remove quarantine
echo -e "\033[1;36m[4/4] Applying app.asar.zh patch...\033[0m"
cp -f "$ASAR_ZH" "$ASAR_PATH"

# macOS Gatekeeper fix
xattr -cr "$APP_PATH" 2>/dev/null || true
codesign --force --deep --sign - "$APP_PATH" 2>/dev/null || true

echo -e "\033[1;36m========================================\033[0m"
echo -e "\033[1;32m [SUCCESS] Chinese localization applied!\033[0m"
echo -e "\033[1;36m========================================\033[0m"

echo "Starting AntiGravity..."
open -a "$APP_PATH"
