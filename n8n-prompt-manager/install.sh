#!/bin/bash
# Installs n8n Prompt Manager to Desktop
set -e
cd "$(dirname "$0")"
PROJ_DIR="$(pwd)"
APP_NAME="n8n Prompt Manager"

echo ""
echo "=================================="
echo "  Installing $APP_NAME"
echo "=================================="
echo ""

# ── Build .app ──
APP_DIR="$HOME/Desktop/${APP_NAME}.app"
rm -rf "$APP_DIR"
mkdir -p "$APP_DIR/Contents/MacOS"
mkdir -p "$APP_DIR/Contents/Resources"

# Info.plist
cat > "$APP_DIR/Contents/Info.plist" << PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleName</key>
    <string>n8n Prompt Manager</string>
    <key>CFBundleDisplayName</key>
    <string>n8n Prompt Manager</string>
    <key>CFBundleIdentifier</key>
    <string>com.n8n.promptmanager</string>
    <key>CFBundleVersion</key>
    <string>1.0</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleExecutable</key>
    <string>launch</string>
    <key>CFBundleIconFile</key>
    <string>app_icon</string>
    <key>NSHighResolutionCapable</key>
    <true/>
</dict>
</plist>
PLIST

# Launcher
cat > "$APP_DIR/Contents/MacOS/launch" << LAUNCHER
#!/bin/bash
cd "$PROJ_DIR"
exec /usr/bin/python3 "$PROJ_DIR/app.py"
LAUNCHER
chmod +x "$APP_DIR/Contents/MacOS/launch"

# Icon
if [ -f "$PROJ_DIR/app_icon.png" ]; then
    ICON_TMP=$(mktemp -d)/app_icon.iconset
    mkdir -p "$ICON_TMP"
    sips -z 16 16     "$PROJ_DIR/app_icon.png" --out "$ICON_TMP/icon_16x16.png"      >/dev/null 2>&1
    sips -z 32 32     "$PROJ_DIR/app_icon.png" --out "$ICON_TMP/icon_16x16@2x.png"   >/dev/null 2>&1
    sips -z 32 32     "$PROJ_DIR/app_icon.png" --out "$ICON_TMP/icon_32x32.png"      >/dev/null 2>&1
    sips -z 64 64     "$PROJ_DIR/app_icon.png" --out "$ICON_TMP/icon_32x32@2x.png"   >/dev/null 2>&1
    sips -z 128 128   "$PROJ_DIR/app_icon.png" --out "$ICON_TMP/icon_128x128.png"    >/dev/null 2>&1
    sips -z 256 256   "$PROJ_DIR/app_icon.png" --out "$ICON_TMP/icon_128x128@2x.png" >/dev/null 2>&1
    sips -z 256 256   "$PROJ_DIR/app_icon.png" --out "$ICON_TMP/icon_256x256.png"    >/dev/null 2>&1
    sips -z 512 512   "$PROJ_DIR/app_icon.png" --out "$ICON_TMP/icon_256x256@2x.png" >/dev/null 2>&1
    sips -z 512 512   "$PROJ_DIR/app_icon.png" --out "$ICON_TMP/icon_512x512.png"    >/dev/null 2>&1
    sips -z 1024 1024 "$PROJ_DIR/app_icon.png" --out "$ICON_TMP/icon_512x512@2x.png" >/dev/null 2>&1
    iconutil -c icns "$ICON_TMP" -o "$APP_DIR/Contents/Resources/app_icon.icns" 2>/dev/null || true
fi

# Remove quarantine
xattr -cr "$APP_DIR" 2>/dev/null || true

echo "  App installed to Desktop!"
echo ""
echo "  Double-click 'n8n Prompt Manager' on your Desktop to launch."
echo ""

# Create config if not exists
if [ ! -f "$PROJ_DIR/config.json" ] || grep -q "YOUR_" "$PROJ_DIR/config.json" 2>/dev/null; then
    echo "  NOTE: First launch will ask for your n8n settings."
    echo "    - n8n URL (e.g. https://your-name.app.n8n.cloud)"
    echo "    - API Key (Settings → API in n8n)"
    echo "    - Workflow ID (from URL bar in n8n)"
    echo ""
fi
