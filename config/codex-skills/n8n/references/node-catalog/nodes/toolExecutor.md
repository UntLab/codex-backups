---
title: "Tool Executor"
description: "Node to execute tools without an AI Agent"
---

# Tool Executor
**Node Type:** nodes-langchain.toolExecutor

## Description
Node to execute tools without an AI Agent

## Schema
```json
{
  "displayName": "Tool Executor",
  "name": "toolExecutor",
  "version": 1,
  "defaults": {
    "name": "Tool Executor"
  },
  "hidden": true,
  "inputs": [
    "main",
    "ai_tool"
  ],
  "outputs": [
    "main"
  ],
  "properties": [
    {
      "displayName": "Query",
      "name": "query",
      "type": "json",
      "default": "{}",
      "description": "Parameters to pass to the tool as JSON or string"
    },
    {
      "displayName": "Tool Name",
      "name": "toolName",
      "type": "string",
      "default": "",
      "description": "Name of the tool to execute if the connected tool is a toolkit"
    }
  ],
  "group": [
    "transform"
  ],
  "description": "Node to execute tools without an AI Agent"
}
```
