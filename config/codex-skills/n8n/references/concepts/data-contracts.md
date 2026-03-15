# Data Contracts

## Item Structure

Each item usually follows:

```json
{
  "json": {"field": "value"},
  "binary": {"file": {"mimeType": "..."}}
}
```

## Contract Discipline

- Document required input fields for each node boundary.
- Normalize field names early (`Set`, `Code`) and keep them stable.
- When using binary workflows, track `inputDataFieldName` explicitly.

## Validation Pattern

- Validate required fields before side-effect nodes.
- Route invalid items to error or dead-letter branch.
