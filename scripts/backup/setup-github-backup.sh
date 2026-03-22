#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <github_repo_url> [branch]"
  echo "Example: $0 git@github.com:YOUR_USER/progects-backup.git main"
  exit 1
fi

REPO_URL="$1"
BRANCH="${2:-main}"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  git init
fi

CURRENT_BRANCH="$(git branch --show-current || true)"
if [[ -z "${CURRENT_BRANCH}" ]]; then
  git checkout -b "${BRANCH}" >/dev/null 2>&1 || git checkout "${BRANCH}"
elif [[ "${CURRENT_BRANCH}" != "${BRANCH}" ]]; then
  git checkout -b "${BRANCH}" >/dev/null 2>&1 || git checkout "${BRANCH}"
fi

if git remote get-url origin >/dev/null 2>&1; then
  git remote set-url origin "${REPO_URL}"
else
  git remote add origin "${REPO_URL}"
fi

echo "GitHub backup is configured."
echo "origin = ${REPO_URL}"
echo "branch = ${BRANCH}"
echo
echo "Next:"
echo "1) git add -A && git commit -m \"Initial backup\""
echo "2) git push -u origin ${BRANCH}"
