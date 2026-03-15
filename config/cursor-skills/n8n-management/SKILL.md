---
name: n8n-management
description: Manage n8n workflows, credentials, and executions via REST API. Use when the user mentions n8n, workflows, automation, triggers, or wants to create/edit/debug n8n workflows.
---

# N8N Server Management

## Connection

Read the credentials file to get current n8n connection details:
- Config: `~/Cursor/shared/configs/n8n-config.json`

The config file contains `baseUrl` and `apiKey`.

## API Reference

Base: `{baseUrl}/api/v1`
Auth header: `X-N8N-API-KEY: {apiKey}`

### Core Endpoints

| Action | Method | Endpoint |
|--------|--------|----------|
| List workflows | GET | `/workflows` |
| Get workflow | GET | `/workflows/{id}` |
| Create workflow | POST | `/workflows` |
| Update workflow | PUT | `/workflows/{id}` |
| Activate workflow | POST | `/workflows/{id}/activate` |
| Deactivate workflow | POST | `/workflows/{id}/deactivate` |
| Delete workflow | DELETE | `/workflows/{id}` |
| List executions | GET | `/executions` |
| Get execution | GET | `/executions/{id}` |
| List credentials | GET | `/credentials` |

### Workflow Operations via Shell

```bash
# List all workflows
curl -s -H "X-N8N-API-KEY: $API_KEY" "$BASE_URL/api/v1/workflows" | python -m json.tool

# Get specific workflow
curl -s -H "X-N8N-API-KEY: $API_KEY" "$BASE_URL/api/v1/workflows/{id}"

# Create workflow from JSON file
curl -s -X POST -H "X-N8N-API-KEY: $API_KEY" -H "Content-Type: application/json" -d @workflow.json "$BASE_URL/api/v1/workflows"

# Activate workflow
curl -s -X POST -H "X-N8N-API-KEY: $API_KEY" "$BASE_URL/api/v1/workflows/{id}/activate"
```

## Workflow Export/Import

Export workflows to `~/Cursor/projects/n8n-workflows/` for version control.

## Common Patterns

- **Webhook trigger**: Use "Webhook" node as trigger, returns URL for external calls
- **Schedule trigger**: Use "Schedule Trigger" for cron-based execution
- **Error handling**: Always add "Error Trigger" workflow for monitoring
- **Subroutines**: Use "Execute Workflow" node to call other workflows

## Debugging

1. Check execution history: GET `/executions?workflowId={id}`
2. Check specific execution data for error details
3. Test webhook URLs with curl before connecting external services
