# Triggers And Scheduling

## Trigger Types In n8n

- Event triggers (webhook, SaaS events, queue/stream listeners)
- Polling triggers (scheduled fetch/check patterns)
- Manual/testing triggers
- Error/workflow triggers

## Scheduling Strategies

- `Schedule Trigger` for production recurring runs
- `Cron`/interval-style patterns for time windows
- `Wait` for pacing, delayed retries, and backoff

## Selection Rules

- Use webhook/event trigger if source can push events.
- Use schedule polling when source has no webhook/event mechanism.
- Use split batches + wait for quota-bound APIs.

For exact trigger nodes and contracts:

- `/docs/reference/indexes/trigger-nodes.json`
- `/docs/reference/indexes/schedule-nodes.json`
- `/docs/reference/node-catalog/nodes/*.md`
