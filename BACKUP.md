# GitHub backup workflow

## 1) One-time setup
```bash
cd /Users/ais/GPT/progects
./scripts/setup-github-backup.sh <YOUR_GITHUB_REPO_URL> main
git add -A
git commit -m "Initial backup"
git push -u origin main
```

## 2) After each work session (backup)
```bash
cd /Users/ais/GPT/progects
./scripts/backup-push.sh main
```

## 3) Sync/restore on this or another computer
Option A (new machine):
```bash
git clone <YOUR_GITHUB_REPO_URL> /Users/ais/GPT/progects
```

Option B (existing local folder):
```bash
cd /Users/ais/GPT/progects
./scripts/restore-sync.sh main
```

## Optional hotkeys (zsh aliases)
Add to `~/.zshrc`:
```bash
alias bkup='cd /Users/ais/GPT/progects && ./scripts/backup-push.sh main'
alias bsync='cd /Users/ais/GPT/progects && ./scripts/restore-sync.sh main'
```

Then reload shell:
```bash
source ~/.zshrc
```
