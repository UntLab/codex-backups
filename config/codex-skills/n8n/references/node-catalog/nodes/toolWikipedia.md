---
title: "Wikipedia"
description: "Search in Wikipedia"
---

# Wikipedia
**Node Type:** nodes-langchain.toolWikipedia

## Description
Search in Wikipedia

## Schema
```json
{
  "displayName": "Wikipedia",
  "name": "toolWikipedia",
  "icon": "file:wikipedia.svg",
  "group": [
    "transform"
  ],
  "version": 1,
  "description": "Search in Wikipedia",
  "defaults": {
    "name": "Wikipedia"
  },
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
          "url": "https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.toolwikipedia/"
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
