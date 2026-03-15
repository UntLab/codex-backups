# Contributing to n8n-skill

Thank you for your interest in making AI agents better at n8n! 

As this project focuses on providing an Open Standard format for AI consumption, contributions generally fall into two categories:

1. **Knowledge Base Updates**: We derive our knowledge directly from `n8n-workflows`. If you are fixing node properties, doing so via the core generation scripts of the `n8n-nodes-base` is preferred. When the `n8n-workflows/docs` are built, you can submit a PR to port those generated markdown files here to the `references/` folder.
2. **Agent Prompts & Integration**: If you have a highly effective system prompt for a specific AI tool (e.g., Copilot, specific MCP clients, auto-gpt, Windsurf), please submit a Pull Request to the `.agents/` folder, or add an integration card to the `website/index.html`.

