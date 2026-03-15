---
title: "crowd.dev Trigger"
description: "Starts the workflow when crowd.dev events occur."
---

# crowd.dev Trigger
**Node Type:** nodes-base.crowdDevTrigger

## Description
Starts the workflow when crowd.dev events occur.

## Schema
```json
{
  "displayName": "crowd.dev Trigger",
  "name": "crowdDevTrigger",
  "icon": {
    "light": "file:crowdDev.svg",
    "dark": "file:crowdDev.dark.svg"
  },
  "group": [
    "trigger"
  ],
  "version": 1,
  "description": "Starts the workflow when crowd.dev events occur.",
  "defaults": {
    "name": "crowd.dev Trigger"
  },
  "inputs": [],
  "outputs": [
    "main"
  ],
  "credentials": [
    {
      "name": "crowdDevApi",
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
      "displayName": "Trigger",
      "name": "trigger",
      "description": "What will trigger an automation",
      "type": "options",
      "required": true,
      "default": "new_activity",
      "options": [
        {
          "name": "New Activity",
          "value": "new_activity"
        },
        {
          "name": "New Member",
          "value": "new_member"
        }
      ]
    }
  ]
}
```
