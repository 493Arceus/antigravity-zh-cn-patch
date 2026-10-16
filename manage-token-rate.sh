#!/bin/bash
set -e

ACTION="${1:-enable}"

APP_PATH="/Applications/Antigravity.app"
if [ ! -d "$APP_PATH" ]; then
    APP_PATH="$HOME/Applications/Antigravity.app"
fi

CONTENTS_DIR="$APP_PATH/Contents"
RES_DIR="$CONTENTS_DIR/Resources"
TARGET_WEB_BUNDLE="$RES_DIR/web_bundle_zh"
INDEX_HTML="$TARGET_WEB_BUNDLE/index.html"
INSTALLED_TOKEN_RATE_JS="$TARGET_WEB_BUNDLE/token-rate.js"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_TOKEN_RATE_JS="$SCRIPT_DIR/token-rate.js"

echo -e "\033[1;36m========================================\033[0m"
echo -e "\033[1;32m AntiGravity Token Rate Extension Manager\033[0m"
echo -e "\033[1;35m Action: $ACTION\033[0m"
echo -e "\033[1;36m========================================\033[0m"

if [ ! -d "$TARGET_WEB_BUNDLE" ] || [ ! -f "$INDEX_HTML" ]; then
    echo -e "\033[1;33m[INFO] Chinese patch is not installed yet. Running installer with Token Rate...\033[0m"
    "$SCRIPT_DIR/install-cn.sh" --with-token-rate
    exit 0
fi

if [ "$ACTION" == "enable" ] || [ "$ACTION" == "Enable" ]; then
    if [ ! -f "$SOURCE_TOKEN_RATE_JS" ]; then
        echo -e "\033[1;31m[ERROR] Cannot find token-rate.js in $SCRIPT_DIR!\033[0m"
        exit 1
    fi

    cp -f "$SOURCE_TOKEN_RATE_JS" "$INSTALLED_TOKEN_RATE_JS"
    python3 -c "
import re, time
with open('$INDEX_HTML', 'r', encoding='utf-8') as f:
    content = f.read()
ts = int(time.time())
content = re.sub(r'\s*<script(?: defer)? src=\"/token-rate\.js(?:\?[^\"]*)?\"></script>', '', content)
if '</head>' in content:
    content = content.replace('</head>', f'    <script src=\"/token-rate.js?v={ts}\"></script>\n  </head>')
else:
    content = content.replace('</body>', f'    <script src=\"/token-rate.js?v={ts}\"></script>\n  </body>')
with open('$INDEX_HTML', 'w', encoding='utf-8') as f:
    f.write(content)
"

    echo -e "\033[1;32m========================================\033[0m"
    echo -e "\033[1;32m [SUCCESS] Token Rate extension ENABLED!\033[0m"
    echo -e "\033[1;36m Tip: In AntiGravity, press Cmd+R to reload immediately.\033[0m"
    echo -e "\033[1;32m========================================\033[0m"
else
    rm -f "$INSTALLED_TOKEN_RATE_JS"
    if grep -q "token-rate.js" "$INDEX_HTML"; then
        python3 -c "
import re
with open('$INDEX_HTML', 'r', encoding='utf-8') as f:
    content = f.read()
content = re.sub(r'\s*<script(?: defer)? src=\"/token-rate\.js(?:\?[^\"]*)?\"></script>', '', content)
with open('$INDEX_HTML', 'w', encoding='utf-8') as f:
    f.write(content)
"
    fi

    echo -e "\033[1;33m========================================\033[0m"
    echo -e "\033[1;33m [SUCCESS] Token Rate extension DISABLED!\033[0m"
    echo -e "\033[1;36m Tip: In AntiGravity, press Cmd+R to reload immediately.\033[0m"
    echo -e "\033[1;33m========================================\033[0m"
fi
