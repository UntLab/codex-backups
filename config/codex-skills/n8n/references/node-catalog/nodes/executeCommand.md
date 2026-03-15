---
title: "Execute Command"
description: "Executes a command on the host"
---

# Execute Command
**Node Type:** nodes-base.executeCommand

## Description
Executes a command on the host

## Schema
```json
{
  "displayName": "Execute Command",
  "name": "executeCommand",
  "icon": "fa:terminal",
  "iconColor": "crimson",
  "group": [
    "transform"
  ],
  "version": 1,
  "description": "Executes a command on the host",
  "defaults": {
    "name": "Execute Command",
    "color": "#886644"
  },
  "usableAsTool": true,
  "inputs": [
    "main"
  ],
  "outputs": [
    "main"
  ],
  "properties": [
    {
      "displayName": "Execute Once",
      "name": "executeOnce",
      "type": "boolean",
      "default": true,
      "description": "Whether to execute only once instead of once for each entry"
    },
    {
      "displayName": "Command",
      "name": "command",
      "typeOptions": {
        "rows": 5
      },
      "type": "string",
      "default": "",
      "placeholder": "echo \"test\"",
      "description": "The command to execute",
      "required": true
    }
  ]
}
```
