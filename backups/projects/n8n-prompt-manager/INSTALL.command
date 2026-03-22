#!/bin/bash
clear
cd "$(dirname "$0")"
PROJ_DIR="$(pwd)"

echo ""
echo "  ╔══════════════════════════════════════╗"
echo "  ║     n8n Prompt Manager — Install     ║"
echo "  ╚══════════════════════════════════════╝"
echo ""

# Check Python
if ! command -v python3 &>/dev/null; then
    echo "  Python 3 not found. Installing..."
    xcode-select --install 2>/dev/null
    echo ""
    echo "  A system popup will appear — click Install."
    echo "  After it finishes, double-click INSTALL again."
    read -p "  Press Enter to close..." dummy
    exit 0
fi

echo "  Python: $(python3 --version)"

# Create config if needed
if [ ! -f "$PROJ_DIR/config.json" ]; then
    cat > "$PROJ_DIR/config.json" << 'CFG'
{
  "n8n_base_url": "http://localhost:5678",
  "n8n_api_key": "",
  "workflow_id": "",
  "google_docs": []
}
CFG
fi

# Build .app on Desktop
APP_DIR="$HOME/Desktop/n8n Prompt Manager.app"
rm -rf "$APP_DIR"
mkdir -p "$APP_DIR/Contents/MacOS"
mkdir -p "$APP_DIR/Contents/Resources"

cat > "$APP_DIR/Contents/Info.plist" << PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleName</key><string>n8n Prompt Manager</string>
    <key>CFBundleDisplayName</key><string>n8n Prompt Manager</string>
    <key>CFBundleIdentifier</key><string>com.n8n.promptmanager</string>
    <key>CFBundleVersion</key><string>1.0</string>
    <key>CFBundlePackageType</key><string>APPL</string>
    <key>CFBundleExecutable</key><string>launch</string>
    <key>CFBundleIconFile</key><string>app_icon</string>
    <key>NSHighResolutionCapable</key><true/>
</dict>
</plist>
PLIST

cat > "$APP_DIR/Contents/MacOS/launch" << LAUNCHER
#!/bin/bash
cd "$PROJ_DIR"
exec /usr/bin/python3 "$PROJ_DIR/app.py"
LAUNCHER
chmod +x "$APP_DIR/Contents/MacOS/launch"

# Build icon if possible
if [ -f "$PROJ_DIR/app_icon.png" ]; then
    ICON_TMP=\$(mktemp -d)/app_icon.iconset
    mkdir -p "\$ICON_TMP"
    for s in 16 32 64 128 256 512 1024; do
        sips -z \$s \$s "$PROJ_DIR/app_icon.png" --out "\$ICON_TMP/icon_\${s}x\${s}.png" >/dev/null 2>&1
    done
    cp "\$ICON_TMP/icon_32x32.png"   "\$ICON_TMP/icon_16x16@2x.png"  2>/dev/null
    cp "\$ICON_TMP/icon_64x64.png"   "\$ICON_TMP/icon_32x32@2x.png"  2>/dev/null
    cp "\$ICON_TMP/icon_256x256.png" "\$ICON_TMP/icon_128x128@2x.png" 2>/dev/null
    cp "\$ICON_TMP/icon_512x512.png" "\$ICON_TMP/icon_256x256@2x.png" 2>/dev/null
    cp "\$ICON_TMP/icon_1024x1024.png" "\$ICON_TMP/icon_512x512@2x.png" 2>/dev/null
    rm -f "\$ICON_TMP/icon_64x64.png" "\$ICON_TMP/icon_1024x1024.png" 2>/dev/null
    iconutil -c icns "\$ICON_TMP" -o "$APP_DIR/Contents/Resources/app_icon.icns" 2>/dev/null
fi

xattr -cr "$APP_DIR" 2>/dev/null

echo ""
echo "  ✓ App installed on Desktop!"
echo ""
echo "  Double-click 'n8n Prompt Manager' on your Desktop."
echo "  On first launch — click Settings to enter your n8n details."
echo ""
read -p "  Press Enter to close..." dummy
