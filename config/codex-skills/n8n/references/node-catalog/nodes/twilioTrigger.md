---
title: "Twilio Trigger"
description: "Starts the workflow on a Twilio update"
---

# Twilio Trigger
**Node Type:** nodes-base.twilioTrigger

## Description
Starts the workflow on a Twilio update

## Schema
```json
{
  "displayName": "Twilio Trigger",
  "name": "twilioTrigger",
  "icon": "file:twilio.svg",
  "group": [
    "trigger"
  ],
  "version": [
    1
  ],
  "defaultVersion": 1,
  "subtitle": "=Updates: {{$parameter[\"updates\"].join(\", \")}}",
  "description": "Starts the workflow on a Twilio update",
  "defaults": {
    "name": "Twilio Trigger"
  },
  "inputs": [],
  "outputs": [
    "main"
  ],
  "credentials": [
    {
      "name": "twilioApi",
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
      "displayName": "Trigger On",
      "name": "updates",
      "type": "multiOptions",
      "options": [
        {
          "name": "New SMS",
          "value": "com.twilio.messaging.inbound-message.received",
          "description": "When an SMS message is received"
        },
        {
          "name": "New Call",
          "value": "com.twilio.voice.insights.call-summary.complete",
          "description": "When a call is received"
        }
      ],
      "required": true,
      "default": []
    },
    {
      "displayName": "The 'New Call' event may take up to thirty minutes to be triggered",
      "name": "callTriggerNotice",
      "type": "notice",
      "default": "",
      "displayOptions": {
        "show": {
          "updates": [
            "com.twilio.voice.insights.call-summary.complete"
          ]
        }
      }
    }
  ]
}
```
