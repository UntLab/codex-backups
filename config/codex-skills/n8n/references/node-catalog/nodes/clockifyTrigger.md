---
title: "Clockify Trigger"
description: "Listens to Clockify events"
---

# Clockify Trigger
**Node Type:** nodes-base.clockifyTrigger

## Description
Listens to Clockify events

## Schema
```json
{
  "displayName": "Clockify Trigger",
  "icon": {
    "light": "file:clockify.svg",
    "dark": "file:clockify.dark.svg"
  },
  "name": "clockifyTrigger",
  "group": [
    "trigger"
  ],
  "version": 1,
  "description": "Listens to Clockify events",
  "defaults": {
    "name": "Clockify Trigger"
  },
  "inputs": [],
  "outputs": [
    "main"
  ],
  "credentials": [
    {
      "name": "clockifyApi",
      "required": true
    }
  ],
  "polling": true,
  "properties": [
    {
      "displayName": "Workspace Name or ID",
      "name": "workspaceId",
      "type": "options",
      "description": "Choose from the list, or specify an ID using an <a href=\"https://docs.n8n.io/code/expressions/\">expression</a>",
      "typeOptions": {
        "loadOptionsMethod": "listWorkspaces"
      },
      "required": true,
      "default": ""
    },
    {
      "displayName": "Trigger",
      "name": "watchField",
      "type": "options",
      "options": [
        {
          "name": "New Time Entry",
          "value": 0
        }
      ],
      "required": true,
      "default": 0
    }
  ]
}
```
