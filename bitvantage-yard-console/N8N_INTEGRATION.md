# BitVantage n8n Integration

## Production site

- `https://bitvantage.online`

The frontend expects the API on the same origin under `/api`.

## Webhook

The backend sends one unified movement event to n8n:

- Base URL: `N8N_WEBHOOK_URL_BASE`
- Endpoint: `N8N_MOVEMENT_ENDPOINT`
- Default full URL: `http://localhost:5678/webhook-test/terminal-movement`

```bash
export N8N_WEBHOOK_URL_BASE="https://your-n8n-host/webhook"
export N8N_MOVEMENT_ENDPOINT="terminal-movement"
```

## Event model

- `event_type = "terminal.container.moved"`
- `operation_type = STACK_IN | RESTOW | STACK_OUT`

## Useful API endpoints

- `POST /api/notifications/preview`
- `GET /api/notifications/logs`
- `GET /api/containers/logs`
- `GET /api/yard/snapshot`
