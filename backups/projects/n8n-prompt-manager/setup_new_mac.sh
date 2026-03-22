#!/bin/bash
# First-time setup on a new Mac
# Run: bash setup_new_mac.sh
set -e
cd "$(dirname "$0")"

echo ""
echo "=================================="
echo "  n8n Prompt Manager — Setup"
echo "=================================="
echo ""

# Check Python
if ! command -v python3 &>/dev/null; then
    echo "ERROR: Python 3 not found."
    echo "Install Xcode Command Line Tools:"
    echo "  xcode-select --install"
    exit 1
fi

echo "  Python: $(python3 --version)"

# Reset config for new machine
cat > config.json << 'CFG'
{
  "n8n_base_url": "http://localhost:5678",
  "n8n_api_key": "",
  "workflow_id": ""
}
CFG
echo "  Config reset (will ask for settings on first launch)"

# Remove old prompts if any
rm -rf prompts/

# Install to Desktop
bash install.sh

echo ""
echo "  All done! Open the app from your Desktop."
echo ""
