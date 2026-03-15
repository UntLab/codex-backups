---
name: project-scaffold
description: Scaffold new projects with proper structure, dependencies, and configuration. Use when the user wants to create a new project, start a new app, or initialize a project from scratch.
---

# Project Scaffolding

All projects are stored in `~/Cursor/projects/` organized by type.

## Directory Convention

```
~/Cursor/projects/
  frontend/       - React, Vanilla JS apps
  backend/        - API servers (Node.js, Python)
  fullstack/      - Full-stack apps (Next.js, etc.)
  n8n-workflows/  - N8N workflow exports
  automation/     - Scripts, bots, AI tools
  experiments/    - Quick prototypes, tests
```

## Scaffolding Steps

1. Create project folder in the correct category
2. Initialize git: `git init`
3. Copy shared configs from `~/Cursor/shared/configs/`
4. Create `.cursor/rules/` with project-specific rules
5. Set up dependency management
6. Create README.md with project description
7. Initial commit

## Stack Templates

### React + Vite (Frontend)
```bash
npm create vite@latest project-name -- --template react
cd project-name && npm install
```

### Next.js (Fullstack)
```bash
npx create-next-app@latest project-name --typescript --tailwind --app --src-dir
```

### Node.js + Express (Backend API)
```bash
mkdir project-name && cd project-name
npm init -y
npm install express cors dotenv
npm install -D nodemon
```

### Python + FastAPI (Backend API)
```bash
mkdir project-name && cd project-name
python -m venv venv
source venv/bin/activate
pip install fastapi uvicorn python-dotenv
pip freeze > requirements.txt
```

### Vanilla JS (Simple Frontend)
Create `index.html`, `style.css`, `script.js` with live-server.

## Post-Scaffold Checklist

- [ ] `.gitignore` created (node_modules, venv, .env, etc.)
- [ ] `.env.example` with required variables (no real values)
- [ ] `.cursor/rules/` with project-specific rules
- [ ] README.md with setup instructions
- [ ] `git init` and initial commit done

## GitHub Sync

When project is ready for sync:
```bash
gh repo create project-name --private --source=. --push
```
