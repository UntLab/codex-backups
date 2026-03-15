---
name: ai-automation
description: AI-powered automation patterns using n8n, APIs, and scripting. Use when the user wants to build AI automations, integrate AI models, create bots, or set up automated pipelines.
---

# AI Automation Patterns

## Architecture Overview

```
[Triggers] -> [N8N Workflows] -> [AI Processing] -> [Actions]
     |              |                    |               |
  Webhooks      Orchestration      OpenAI/Claude     Send email
  Schedule      Data transform     Image gen         Update DB
  API calls     Error handling     Embeddings        Notify
```

## N8N + AI Integration

### Common AI Nodes in N8N
- **OpenAI** — Chat completions, embeddings, image generation
- **HTTP Request** — Call any AI API (Claude, Groq, local LLMs)
- **Code** — Pre/post-process data with JS or Python
- **Webhook** — Receive triggers from external services

### Pattern: AI Chatbot Pipeline
1. Webhook receives message
2. Code node formats prompt with context
3. OpenAI node generates response
4. HTTP Request sends reply back

### Pattern: Content Processing
1. Schedule trigger (or webhook)
2. Fetch content from source (RSS, API, scrape)
3. AI summarizes/translates/categorizes
4. Store results in DB or send notification

### Pattern: Document Processing
1. Upload triggers workflow
2. Extract text from document
3. AI analyzes and extracts structured data
4. Store in database, notify user

## Local AI Scripts

Store automation scripts in `~/Cursor/projects/automation/`:

```python
# Template: AI processing script
import os
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def process(text: str) -> str:
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": text}]
    )
    return response.choices[0].message.content
```

## Connecting Services

Store API keys and service configs in environment variables or `~/Cursor/shared/configs/` (never commit to git).

## Useful Libraries

| Library | Purpose |
|---------|---------|
| `openai` | OpenAI API client |
| `anthropic` | Claude API client |
| `langchain` | LLM orchestration |
| `chromadb` | Vector database (local) |
| `playwright` | Web scraping/automation |
| `python-telegram-bot` | Telegram bots |
