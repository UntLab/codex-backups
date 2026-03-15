---
title: "In Memory Vector Store Load"
description: "Load embedded data from an in-memory vector store"
---

# In Memory Vector Store Load
**Node Type:** nodes-langchain.vectorStoreInMemoryLoad

## Description
Load embedded data from an in-memory vector store

## Schema
```json
{
  "displayName": "In Memory Vector Store Load",
  "name": "vectorStoreInMemoryLoad",
  "icon": "fa:database",
  "group": [
    "transform"
  ],
  "version": 1,
  "hidden": true,
  "description": "Load embedded data from an in-memory vector store",
  "defaults": {
    "name": "In Memory Vector Store Load"
  },
  "codex": {
    "categories": [
      "AI"
    ],
    "subcategories": {
      "AI": [
        "Vector Stores"
      ]
    },
    "resources": {
      "primaryDocumentation": [
        {
          "url": "https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.vectorstoreinmemory/"
        }
      ]
    }
  },
  "inputs": [
    {
      "displayName": "Embedding",
      "maxConnections": 1,
      "type": "ai_embedding",
      "required": true
    }
  ],
  "outputs": [
    "ai_vectorStore"
  ],
  "outputNames": [
    "Vector Store"
  ],
  "properties": [
    {
      "displayName": "Memory Key",
      "name": "memoryKey",
      "type": "string",
      "default": "vector_store_key",
      "description": "The key to use to store the vector memory in the workflow data. The key will be prefixed with the workflow ID to avoid collisions."
    }
  ]
}
```
