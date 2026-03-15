---
name: git-workflow
description: Git and GitHub workflow management. Use when working with git operations, branching, pull requests, releases, or GitHub repository management.
---

# Git & GitHub Workflow

## Commit Convention

Use Conventional Commits:

```
type(scope): short description

Optional body with details
```

Types: `feat`, `fix`, `refactor`, `docs`, `style`, `test`, `chore`, `perf`, `ci`

## Branch Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready code |
| `dev` | Development integration |
| `feat/name` | New features |
| `fix/name` | Bug fixes |
| `refactor/name` | Code refactoring |

## Workflow

1. Create feature branch from `dev`: `git checkout -b feat/feature-name dev`
2. Make changes and commit with conventional commits
3. Push and create PR: `gh pr create --base dev`
4. After review, merge PR
5. When `dev` is stable, merge to `main`

## GitHub Operations

```bash
# Create new repo
gh repo create name --private --source=. --push

# List repos
gh repo list

# Create PR
gh pr create --title "feat: description" --body "Details"

# View PR status
gh pr status

# Merge PR
gh pr merge --squash
```

## Project Sync to GitHub

When a project in `~/Cursor/projects/` is ready:

1. `cd` to project directory
2. Ensure `.gitignore` is correct
3. `git add . && git commit -m "feat: initial project setup"`
4. `gh repo create project-name --private --source=. --push`

## Safety Rules

- Never force push to `main`
- Always create `.gitignore` before first commit
- Never commit `.env`, credentials, or API keys
- Use `.env.example` for documenting required env vars
