---
name: n8n-skill
description: The official knowledge base for building, debugging, and understanding n8n workflows. Contains exact node schemas, expressions rules, and use-case mappings.
---

# n8n-skill

This is the primary instruction manual and capability map for building n8n workflows.

## How to use this skill
1. **Understand the Goal**: Read `assets/workflow-needs.json` to understand how human intents map to specific n8n nodes.
2. **Find the Nodes**: Locate the required nodes within the `references/indexes/nodes-by-capability.json` file.
3. **Read the Schemas**: Navigate to the `references/node-catalog/nodes/` directory and read the specific markdown file for the node you need to build.
4. **Read the Rules**: Review any necessary concepts in `references/concepts/` (e.g., n8n JavaScript syntax, expression mapping).
5. **Generate the Workflow**: Once you have read the precise JSON schemas from the node reference files, construct the final code.

## Critical Rules for AI Agents:
- **NEVER** guess or hallucinate n8n node parameters, typings, or version numbers.
- **ALWAYS** read the markdown file for a node in `references/node-catalog/nodes/` before writing its JSON structure. n8n nodes use very specific parameter IDs that cannot be guessed from the UI names.
