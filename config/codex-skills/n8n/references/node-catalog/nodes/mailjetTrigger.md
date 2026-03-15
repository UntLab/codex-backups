---
title: "Mailjet Trigger"
description: "Handle Mailjet events via webhooks"
---

# Mailjet Trigger
**Node Type:** nodes-base.mailjetTrigger

## Description
Handle Mailjet events via webhooks

## Schema
```json
{
  "displayName": "Mailjet Trigger",
  "name": "mailjetTrigger",
  "icon": "file:mailjet.svg",
  "group": [
    "trigger"
  ],
  "version": 1,
  "description": "Handle Mailjet events via webhooks",
  "defaults": {
    "name": "Mailjet Trigger"
  },
  "inputs": [],
  "outputs": [
    "main"
  ],
  "credentials": [
    {
      "name": "mailjetEmailApi",
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
      "displayName": "Event",
      "name": "event",
      "type": "options",
      "required": true,
      "default": "open",
      "options": [
        {
          "name": "email.blocked",
          "value": "blocked"
        },
        {
          "name": "email.bounce",
          "value": "bounce"
        },
        {
          "name": "email.open",
          "value": "open"
        },
        {
          "name": "email.sent",
          "value": "sent"
        },
        {
          "name": "email.spam",
          "value": "spam"
        },
        {
          "name": "email.unsub",
          "value": "unsub"
        }
      ],
      "description": "Determines which resource events the webhook is triggered for"
    }
  ]
}
```
