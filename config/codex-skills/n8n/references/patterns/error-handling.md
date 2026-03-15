# Error Handling

## Minimum Standard

- Separate success and failure branches.
- Capture error payload and original business key.
- Notify (Slack/Email) with actionable context.
- Include retry policy and final dead-letter handling.

## Operational Signals

- Node where failure occurred
- Correlation ID / entity ID
- Retry count and timestamp
