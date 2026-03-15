#!/usr/bin/env bash
# Copies projects and config into the backup repo before git commit.
# Run from: /Users/ais/GPT/progects

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
HOME_DIR="${HOME:-/Users/ais}"

echo "Syncing sources into backup repo..."

# Home Assistant Dashboard
if [[ -d "${HOME_DIR}/home-assistant-dashboard" ]]; then
  mkdir -p "${ROOT}/home-assistant-dashboard"
  rsync -a --delete \
    --exclude='.git' --exclude='.DS_Store' \
    "${HOME_DIR}/home-assistant-dashboard/" "${ROOT}/home-assistant-dashboard/"
  echo "  ✓ home-assistant-dashboard"
fi

# n8n Prompt Manager (exclude large binaries)
if [[ -d "${HOME_DIR}/n8n-prompt-manager" ]]; then
  mkdir -p "${ROOT}/n8n-prompt-manager"
  rsync -a --delete \
    --exclude='.git' --exclude='.DS_Store' \
    --exclude='*.zip' --exclude='*.app' --exclude='*.dmg' \
    --exclude='app.log' --exclude='__pycache__' \
    --exclude='windows-package' \
    "${HOME_DIR}/n8n-prompt-manager/" "${ROOT}/n8n-prompt-manager/"
  echo "  ✓ n8n-prompt-manager"
fi

# Config: Codex skills
if [[ -d "${HOME_DIR}/.codex/skills" ]]; then
  mkdir -p "${ROOT}/config/codex-skills"
  rsync -a --delete \
    --exclude='.git' --exclude='.DS_Store' \
    "${HOME_DIR}/.codex/skills/" "${ROOT}/config/codex-skills/"
  echo "  ✓ config/codex-skills"
fi

# Config: Cursor skills
if [[ -d "${HOME_DIR}/.cursor/skills" ]]; then
  mkdir -p "${ROOT}/config/cursor-skills"
  rsync -a --delete \
    --exclude='.git' --exclude='.DS_Store' \
    "${HOME_DIR}/.cursor/skills/" "${ROOT}/config/cursor-skills/"
  echo "  ✓ config/cursor-skills"
fi

# Config: Cursor rules
if [[ -d "${HOME_DIR}/.cursor/rules" ]]; then
  mkdir -p "${ROOT}/config/cursor-rules"
  rsync -a --delete \
    --exclude='.git' --exclude='.DS_Store' \
    "${HOME_DIR}/.cursor/rules/" "${ROOT}/config/cursor-rules/"
  echo "  ✓ config/cursor-rules"
fi

# Cursor fullstack projects (cardsaas, pharmatech, pharmatech-mobile)
CURSOR_FULLSTACK="${HOME_DIR}/Cursor/projects/fullstack"
for proj in cardsaas pharmatech pharmatech-mobile; do
  if [[ -d "${CURSOR_FULLSTACK}/${proj}" ]]; then
    mkdir -p "${ROOT}/${proj}"
    rsync -a --delete \
      --exclude='.git' --exclude='.DS_Store' \
      --exclude='node_modules' --exclude='.next' --exclude='out' \
      --exclude='.playwright-cli' \
      "${CURSOR_FULLSTACK}/${proj}/" "${ROOT}/${proj}/"
    echo "  ✓ ${proj}"
  fi
done

echo "Sources synced."
