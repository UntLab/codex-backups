#!/bin/bash
# Creates a macOS .app bundle for n8n Prompt Manager

set -e
cd "$(dirname "$0")"

APP_NAME="n8n Prompt Manager"
APP_DIR="$(dirname "$0")/${APP_NAME}.app"

echo "Building ${APP_NAME}.app ..."

rm -rf "$APP_DIR"
mkdir -p "$APP_DIR/Contents/MacOS"
mkdir -p "$APP_DIR/Contents/Resources"

# ── Info.plist ──
cat > "$APP_DIR/Contents/Info.plist" << 'PLIST'
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
    <key>LSMinimumSystemVersion</key>
    <string>10.15</string>
    <key>NSHighResolutionCapable</key>
    <true/>
</dict>
</plist>
PLIST

# ── Launcher script ──
cat > "$APP_DIR/Contents/MacOS/launch" << LAUNCHER
#!/bin/bash
PROJ_DIR="$PWD"
export PYTHONPATH="\$PROJ_DIR/libs:\$PYTHONPATH"
cd "\$PROJ_DIR"
exec /usr/bin/python3 "\$PROJ_DIR/app.py"
LAUNCHER
chmod +x "$APP_DIR/Contents/MacOS/launch"

# ── Icon ──
if [ -f "app_icon.png" ]; then
    ICONSET_DIR=$(mktemp -d)/app_icon.iconset
    mkdir -p "$ICONSET_DIR"

    sips -z 16 16     app_icon.png --out "$ICONSET_DIR/icon_16x16.png"      >/dev/null 2>&1
    sips -z 32 32     app_icon.png --out "$ICONSET_DIR/icon_16x16@2x.png"   >/dev/null 2>&1
    sips -z 32 32     app_icon.png --out "$ICONSET_DIR/icon_32x32.png"      >/dev/null 2>&1
    sips -z 64 64     app_icon.png --out "$ICONSET_DIR/icon_32x32@2x.png"   >/dev/null 2>&1
    sips -z 128 128   app_icon.png --out "$ICONSET_DIR/icon_128x128.png"    >/dev/null 2>&1
    sips -z 256 256   app_icon.png --out "$ICONSET_DIR/icon_128x128@2x.png" >/dev/null 2>&1
    sips -z 256 256   app_icon.png --out "$ICONSET_DIR/icon_256x256.png"    >/dev/null 2>&1
    sips -z 512 512   app_icon.png --out "$ICONSET_DIR/icon_256x256@2x.png" >/dev/null 2>&1
    sips -z 512 512   app_icon.png --out "$ICONSET_DIR/icon_512x512.png"    >/dev/null 2>&1
    sips -z 1024 1024 app_icon.png --out "$ICONSET_DIR/icon_512x512@2x.png" >/dev/null 2>&1

    iconutil -c icns "$ICONSET_DIR" -o "$APP_DIR/Contents/Resources/app_icon.icns" 2>/dev/null || true
    echo "Icon created."
fi

echo ""
echo "Done! App created at:"
echo "  $APP_DIR"
echo ""
echo "You can now double-click it on your Desktop."
