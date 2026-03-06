#!/usr/bin/env bash
set -euo pipefail

BRANCH="${1:-$(git branch --show-current 2>/dev/null || echo main)}"
MSG="${2:-backup: $(date '+%Y-%m-%d %H:%M:%S')}"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Not a git repository. Run scripts/setup-github-backup.sh first."
  exit 1
fi

if ! git remote get-url origin >/dev/null 2>&1; then
  echo "Remote 'origin' is not configured. Run scripts/setup-github-backup.sh first."
  exit 1
fi

git add -A

if git diff --cached --quiet; then
  echo "No changes to commit. Pushing latest ${BRANCH}..."
else
  git commit -m "${MSG}"
fi

git push origin "${BRANCH}"
echo "Backup pushed to GitHub (${BRANCH})."
