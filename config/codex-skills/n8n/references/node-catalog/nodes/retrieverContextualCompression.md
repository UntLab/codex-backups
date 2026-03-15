---
title: "Contextual Compression Retriever"
description: "Enhances document similarity search by contextual compression."
---

# Contextual Compression Retriever
**Node Type:** nodes-langchain.retrieverContextualCompression

## Description
Enhances document similarity search by contextual compression.

## Schema
```json
{
  "displayName": "Contextual Compression Retriever",
  "name": "retrieverContextualCompression",
  "icon": "fa:box-open",
  "iconColor": "black",
  "group": [
    "transform"
  ],
  "version": 1,
  "description": "Enhances document similarity search by contextual compression.",
  "defaults": {
    "name": "Contextual Compression Retriever"
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
          "url": "https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.retrievercontextualcompression/"
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
  "properties": []
}
```
