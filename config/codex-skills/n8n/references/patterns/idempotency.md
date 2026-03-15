# Idempotency

## Goal

Ensure retries/re-runs do not create duplicate side effects.

## Practical Tactics

- Prefer upsert APIs over create-only APIs.
- Use deterministic keys (slug, external ID, hash of business key).
- Check-before-write for systems that lack upsert.
- Persist de-dup state in DB/Sheet/Data Store when needed.
