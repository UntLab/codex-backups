---
title: "Wolfram|Alpha"
description: "Connects to WolframAlpha's computational intelligence engine."
---

# Wolfram|Alpha
**Node Type:** nodes-langchain.toolWolframAlpha

## Description
Connects to WolframAlpha's computational intelligence engine.

## Schema
```json
{
  "displayName": "Wolfram|Alpha",
  "name": "toolWolframAlpha",
  "icon": "file:wolfram-alpha.svg",
  "group": [
    "transform"
  ],
  "version": 1,
  "description": "Connects to WolframAlpha's computational intelligence engine.",
  "defaults": {
    "name": "Wolfram Alpha"
  },
  "credentials": [
    {
      "name": "wolframAlphaApi",
      "required": true
    }
  ],
  "codex": {
    "categories": [
      "AI"
    ],
    "subcategories": {
      "AI": [
        "Tools"
      ],
      "Tools": [
        "Other Tools"
      ]
    },
    "resources": {
      "primaryDocumentation": [
        {
          "url": "https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.toolwolframalpha/"
        }
      ]
    }
  },
  "inputs": [],
  "outputs": [
    "ai_tool"
  ],
  "outputNames": [
    "Tool"
  ],
  "properties": [
    {
      "displayName": "This node must be connected to an AI agent. <a data-action='openSelectiveNodeCreator' data-action-parameter-creatorview='AI'>Insert one</a>",
      "name": "notice",
      "type": "notice",
      "default": "",
      "typeOptions": {
        "containerClass": "ndv-connection-hint-notice"
      }
    }
  ]
}
```
