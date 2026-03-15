# Expressions

## Safe Patterns

- Use fallbacks: `{{ $json.email || "" }}`
- Use optional access in code nodes when shape is uncertain.
- Avoid hidden coupling to node names that may change.

## Recommended Checks

- Ensure every downstream expression can handle missing data.
- Guard list access with length checks.
- Prefer explicit casting before arithmetic/comparisons.
