#!/usr/bin/env bash
set -euo pipefail

BRANCH="${1:-$(git branch --show-current 2>/dev/null || echo main)}"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Not a git repository in current directory."
  exit 1
fi

if ! git remote get-url origin >/dev/null 2>&1; then
  echo "Remote 'origin' is not configured."
  exit 1
fi

if [[ -n "$(git status --porcelain)" ]]; then
  echo "You have local changes or untracked files. Commit/stash them before sync."
  exit 1
fi

git fetch origin "${BRANCH}"
git pull --ff-only origin "${BRANCH}"
echo "Repository synced from GitHub (${BRANCH})."
