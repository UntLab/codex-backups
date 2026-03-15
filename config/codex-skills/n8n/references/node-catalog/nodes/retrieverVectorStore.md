---
title: "Vector Store Retriever"
description: "Use a Vector Store as Retriever"
---

# Vector Store Retriever
**Node Type:** nodes-langchain.retrieverVectorStore

## Description
Use a Vector Store as Retriever

## Schema
```json
{
  "displayName": "Vector Store Retriever",
  "name": "retrieverVectorStore",
  "icon": "fa:box-open",
  "iconColor": "black",
  "group": [
    "transform"
  ],
  "version": 1,
  "description": "Use a Vector Store as Retriever",
  "defaults": {
    "name": "Vector Store Retriever"
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
          "url": "https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.retrievervectorstore/"
        }
      ]
    }
  },
  "inputs": [
    {
      "displayName": "Vector Store",
      "maxConnections": 1,
      "type": "ai_vectorStore",
      "required": true
    }
  ],
  "outputs": [
    "ai_retriever"
  ],
  "outputNames": [
    "Retriever"
  ],
  "properties": [
    {
      "displayName": "Limit",
      "name": "topK",
      "type": "number",
      "default": 4,
      "description": "The maximum number of results to return"
    }
  ]
}
```
