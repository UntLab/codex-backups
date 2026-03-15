---
title: "Keap Trigger"
description: "Starts the workflow when Infusionsoft events occur"
---

# Keap Trigger
**Node Type:** nodes-base.keapTrigger

## Description
Starts the workflow when Infusionsoft events occur

## Schema
```json
{
  "displayName": "Keap Trigger",
  "name": "keapTrigger",
  "icon": "file:keap.png",
  "group": [
    "trigger"
  ],
  "version": 1,
  "subtitle": "={{$parameter[\"eventId\"]}}",
  "description": "Starts the workflow when Infusionsoft events occur",
  "defaults": {
    "name": "Keap Trigger"
  },
  "inputs": [],
  "outputs": [
    "main"
  ],
  "credentials": [
    {
      "name": "keapOAuth2Api",
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
      "displayName": "Event Name or ID",
      "name": "eventId",
      "type": "options",
      "description": "Choose from the list, or specify an ID using an <a href=\"https://docs.n8n.io/code/expressions/\">expression</a>",
      "typeOptions": {
        "loadOptionsMethod": "getEvents"
      },
      "default": "",
      "required": true
    },
    {
      "displayName": "RAW Data",
      "name": "rawData",
      "type": "boolean",
      "default": false,
      "description": "Whether to return the data exactly in the way it got received from the API"
    }
  ]
}
```
