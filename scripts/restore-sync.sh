#!/usr/bin/env bash
set -euo pipefail

BRANCH="${1:-$(git branch --show-current 2>/dev/null || echo main)}"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Not a git repository in current directory."
  echo "Use: git clone <github_repo_url> <folder>"
  exit 1
fi

if ! git remote get-url origin >/dev/null 2>&1; then
  echo "Remote 'origin' is not configured."
  exit 1
fi

if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "You have local changes. Commit/stash them before sync."
  exit 1
fi

git fetch origin "${BRANCH}"
git pull --rebase origin "${BRANCH}"
echo "Repository synced from GitHub (${BRANCH})."
