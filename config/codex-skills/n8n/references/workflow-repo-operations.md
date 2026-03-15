# Workflow Repo Operations

Operational commands for syncing local workflow files with n8n.

## Prerequisites

- `.env` in repo root with `N8N_BASE_URL` and `N8N_API_KEY`
- Python 3.10+

## Core Commands

```bash
python3 scripts/n8n_cli.py list --dotenv .env
python3 scripts/n8n_cli.py pull --name "Workflow Name" --dotenv .env
python3 scripts/n8n_cli.py push --name "Workflow Name" --dotenv .env
python3 scripts/n8n_cli.py sync --layout n8n-folders --reorganize --dotenv .env
```

## Node Docs Regeneration

```bash
node scripts/n8n/generate_node_reference.js
```

Regenerates:

- `/docs/reference/node-catalog/*`
- `/docs/reference/indexes/*`
