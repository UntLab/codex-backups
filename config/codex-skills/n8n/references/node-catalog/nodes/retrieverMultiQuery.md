---
title: "MultiQuery Retriever"
description: "Automates prompt tuning, generates diverse queries and expands document pool for enhanced retrieval."
---

# MultiQuery Retriever
**Node Type:** nodes-langchain.retrieverMultiQuery

## Description
Automates prompt tuning, generates diverse queries and expands document pool for enhanced retrieval.

## Schema
```json
{
  "displayName": "MultiQuery Retriever",
  "name": "retrieverMultiQuery",
  "icon": "fa:box-open",
  "iconColor": "black",
  "group": [
    "transform"
  ],
  "version": 1,
  "description": "Automates prompt tuning, generates diverse queries and expands document pool for enhanced retrieval.",
  "defaults": {
    "name": "MultiQuery Retriever"
  },
  "codex": {
    "categories": [
      "AI"
    ],
    "subcategories": {
      "AI": [
        "Retrievers"
      ]
    },
    "resources": {
      "primaryDocumentation": [
        {
          "url": "https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.retrievermultiquery/"
        }
      ]
    }
  },
  "inputs": [
    {
      "displayName": "Model",
      "maxConnections": 1,
      "type": "ai_languageModel",
      "required": true
    },
    {
      "displayName": "Retriever",
      "maxConnections": 1,
      "type": "ai_retriever",
      "required": true
    }
  ],
  "outputs": [
    {
      "displayName": "Retriever",
      "maxConnections": 1,
      "type": "ai_retriever"
    }
  ],
  "properties": [
    {
      "displayName": "Options",
      "name": "options",
      "placeholder": "Add Option",
      "description": "Additional options to add",
      "type": "collection",
      "default": {},
      "options": [
        {
          "displayName": "Query Count",
          "name": "queryCount",
          "default": 3,
          "typeOptions": {
            "minValue": 1
          },
          "description": "Number of different versions of the given question to generate",
          "type": "number"
        }
      ]
    }
  ]
}
```
