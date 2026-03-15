# Execution Model

## Core Mechanics

- n8n executes node-by-node, passing an array of items.
- Each item is an object under `json`; optional binaries live under `binary`.
- Branching nodes (`IF`, `Switch`) split item streams; merge nodes reconcile streams.

## Determinism Rules

- Prefer explicit item access (`$json.field`) over implicit assumptions.
- Avoid stateful side effects in `Code` unless idempotency controls exist.
- Keep external writes behind guards (`IF`, de-dup keys, upsert APIs).

## Common Failure Modes

- Missing fields from upstream shape changes
- Mismatched item counts across merge branches
- Non-idempotent writes on retries
