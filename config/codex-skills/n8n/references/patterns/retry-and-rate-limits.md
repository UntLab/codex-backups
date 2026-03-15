# Retry And Rate Limits

## Recommended Controls

- Exponential backoff for transient HTTP failures.
- Wait/sleep nodes between batch calls.
- Batch sizing (`Split In Batches`) to avoid API bursts.
- Respect provider-specific quotas and retry-after headers.

## Anti-patterns

- Tight retry loops with no delay
- Unlimited parallel fan-out to strict APIs
