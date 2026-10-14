#!/bin/bash
set -e

# AntiGravity Client Chinese Localization Uninstaller (macOS)

echo -e "\033[1;36m========================================\033[0m"
echo -e "\033[1;33m AntiGravity Patch Restore (macOS)\033[0m"
echo -e "\033[1;36m========================================\033[0m"

APP_PATH="/Applications/Antigravity.app"
if [ ! -d "$APP_PATH" ]; then
    APP_PATH="$HOME/Applications/Antigravity.app"
fi

if [ ! -d "$APP_PATH" ]; then
    echo -e "\033[1;31m[ERROR] AntiGravity.app not found in /Applications or ~/Applications!\033[0m"
    exit 1
fi

RES_DIR="$APP_PATH/Contents/Resources"
ASAR_PATH="$RES_DIR/app.asar"
ASAR_BAK="$RES_DIR/app.asar.bak"
TARGET_WEB_BUNDLE="$RES_DIR/web_bundle_zh"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ ! -f "$ASAR_BAK" ] && [ -f "$SCRIPT_DIR/app.asar.bak" ]; then
    ASAR_BAK="$SCRIPT_DIR/app.asar.bak"
fi

if [ ! -f "$ASAR_BAK" ]; then
    echo -e "\033[1;31m[ERROR] Original app.asar.bak not found!\033[0m"
    exit 1
fi

echo -e "\033[1;33m[1/3] Closing AntiGravity processes...\033[0m"
killall Antigravity language_server 2>/dev/null || true
sleep 1

echo -e "\033[1;36m[2/3] Restoring original app.asar...\033[0m"
cp -f "$ASAR_BAK" "$ASAR_PATH"

echo -e "\033[1;36m[3/3] Cleaning up localized web bundle...\033[0m"
rm -rf "$TARGET_WEB_BUNDLE"

xattr -cr "$APP_PATH" 2>/dev/null || true
codesign --force --deep --sign - "$APP_PATH" 2>/dev/null || true

echo -e "\033[1;36m========================================\033[0m"
echo -e "\033[1;32m [SUCCESS] Restored to official original!\033[0m"
echo -e "\033[1;36m========================================\033[0m"

echo "Starting AntiGravity..."
open -a "$APP_PATH"
