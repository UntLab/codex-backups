# Branching And Merging

## Branch Design

- Use `IF` for binary decisions.
- Use `Switch` for multi-path routing.
- Keep branch outputs schema-compatible if they will merge.

## Merge Design

- Prefer explicit merge strategy and expected cardinality.
- Validate joined records before write operations.
