---
title: "Pushcut Trigger"
description: "Starts the workflow when Pushcut events occur"
---

# Pushcut Trigger
**Node Type:** nodes-base.pushcutTrigger

## Description
Starts the workflow when Pushcut events occur

## Schema
```json
{
  "displayName": "Pushcut Trigger",
  "name": "pushcutTrigger",
  "icon": "file:pushcut.png",
  "group": [
    "trigger"
  ],
  "version": 1,
  "description": "Starts the workflow when Pushcut events occur",
  "defaults": {
    "name": "Pushcut Trigger"
  },
  "inputs": [],
  "outputs": [
    "main"
  ],
  "credentials": [
    {
      "name": "pushcutApi",
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
      "displayName": "Action Name",
      "name": "actionName",
      "type": "string",
      "description": "Choose any name you would like. It will show up as a server action in the app.",
      "default": ""
    }
  ]
}
```
