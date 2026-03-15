# AI Workflow Patterns

## Design Rules

- Separate retrieval, prompt construction, and generation steps.
- Limit model input size early to control cost/latency.
- Capture prompt/version metadata for auditability.
- Add deterministic fallback paths when model output is missing/invalid.

## Typical Node Stack

- Trigger -> Retrieval -> Transform -> LLM -> Validation -> Action
