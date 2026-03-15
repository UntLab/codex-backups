---
title: "LoneScale Trigger"
description: "Trigger LoneScale Workflow"
---

# LoneScale Trigger
**Node Type:** nodes-base.loneScaleTrigger

## Description
Trigger LoneScale Workflow

## Schema
```json
{
  "displayName": "LoneScale Trigger",
  "name": "loneScaleTrigger",
  "icon": {
    "light": "file:loneScale.svg",
    "dark": "file:loneScale.dark.svg"
  },
  "group": [
    "trigger"
  ],
  "version": 1,
  "description": "Trigger LoneScale Workflow",
  "defaults": {
    "name": "LoneScale Trigger"
  },
  "inputs": [],
  "outputs": [
    "main"
  ],
  "credentials": [
    {
      "name": "loneScaleApi",
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
      "displayName": "Workflow Name",
      "name": "workflow",
      "type": "options",
      "noDataExpression": true,
      "typeOptions": {
        "loadOptionsMethod": "getWorkflows"
      },
      "default": "",
      "description": "Select one workflow. Choose from the list",
      "required": true
    }
  ]
}
```
