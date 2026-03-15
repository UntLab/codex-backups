# Workflow Needs Playbook

Use this when starting from a business requirement instead of node names.

## Process

1. Find the closest use-case entry in `workflow-needs.json`.
2. Query candidate nodes from capability/group indexes.
3. Open each node contract in `node-catalog/nodes/*.md`.
4. Build the workflow with patterns from `/docs/patterns`.

## Example

Requirement: "Run daily and push enriched leads to CRM"

- Use-case: `lead-enrichment-pipeline`
- Query capabilities: `sales-marketing-ecommerce`, `api-integration`, `scheduling`
- Starter set: `scheduleTrigger` + enrichment API nodes + CRM node + upsert guard
