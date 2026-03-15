---
title: "Pinecone: Insert"
description: "Insert data into Pinecone Vector Store index"
---

# Pinecone: Insert
**Node Type:** nodes-langchain.vectorStorePineconeInsert

## Description
Insert data into Pinecone Vector Store index

## Schema
```json
{
  "displayName": "Pinecone: Insert",
  "hidden": true,
  "name": "vectorStorePineconeInsert",
  "icon": "file:pinecone.svg",
  "group": [
    "transform"
  ],
  "version": 1,
  "description": "Insert data into Pinecone Vector Store index",
  "defaults": {
    "name": "Pinecone: Insert",
    "color": "#1321A7"
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
          "url": "https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.vectorstorepinecone/"
        }
      ]
    }
  },
  "credentials": [
    {
      "name": "pineconeApi",
      "required": true
    }
  ],
  "inputs": [
    "main",
    {
      "displayName": "Document",
      "maxConnections": 1,
      "type": "ai_document",
      "required": true
    },
    {
      "displayName": "Embedding",
      "maxConnections": 1,
      "type": "ai_embedding",
      "required": true
    }
  ],
  "outputs": [
    "main"
  ],
  "properties": [
    {
      "displayName": "Pinecone Index",
      "name": "pineconeIndex",
      "type": "resourceLocator",
      "default": {
        "mode": "list",
        "value": ""
      },
      "required": true,
      "modes": [
        {
          "displayName": "From List",
          "name": "list",
          "type": "list",
          "typeOptions": {
            "searchListMethod": "pineconeIndexSearch"
          }
        },
        {
          "displayName": "ID",
          "name": "id",
          "type": "string"
        }
      ]
    },
    {
      "displayName": "Pinecone Namespace",
      "name": "pineconeNamespace",
      "type": "string",
      "default": ""
    },
    {
      "displayName": "Specify the document to load in the document loader sub-node",
      "name": "notice",
      "type": "notice",
      "default": ""
    },
    {
      "displayName": "Clear Namespace",
      "name": "clearNamespace",
      "type": "boolean",
      "default": false,
      "description": "Whether to clear the namespace before inserting new data"
    }
  ]
}
```
