---
title: "Flow Trigger"
description: "Handle Flow events via webhooks"
---

# Flow Trigger
**Node Type:** nodes-base.flowTrigger

## Description
Handle Flow events via webhooks

## Schema
```json
{
  "displayName": "Flow Trigger",
  "name": "flowTrigger",
  "icon": "file:flow.svg",
  "group": [
    "trigger"
  ],
  "version": 1,
  "description": "Handle Flow events via webhooks",
  "defaults": {
    "name": "Flow Trigger"
  },
  "inputs": [],
  "outputs": [
    "main"
  ],
  "credentials": [
    {
      "name": "flowApi",
      "required": true
    }
  ],
  "webhooks": [
    {
      "name": "default",
      "httpMethod": "POST",
      "responseMode": "onReceived",
      "path": "webhook"
    }
  ],
  "properties": [
    {
      "displayName": "Resource",
      "name": "resource",
      "type": "options",
      "noDataExpression": true,
      "default": "",
      "options": [
        {
          "name": "Project",
          "value": "list"
        },
        {
          "name": "Task",
          "value": "task"
        }
      ],
      "description": "Resource that triggers the webhook"
    },
    {
      "displayName": "Project ID",
      "name": "listIds",
      "type": "string",
      "required": true,
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "list"
          ]
        },
        "hide": {
          "resource": [
            "task"
          ]
        }
      },
      "description": "Lists IDs, perhaps known better as \"Projects\" separated by a comma (,)"
    },
    {
      "displayName": "Task ID",
      "name": "taskIds",
      "type": "string",
      "required": true,
      "default": "",
      "displayOptions": {
        "show": {
          "resource": [
            "task"
          ]
        },
        "hide": {
          "resource": [
            "list"
          ]
        }
      },
      "description": "Task IDs separated by a comma (,)"
    }
  ]
}
```
