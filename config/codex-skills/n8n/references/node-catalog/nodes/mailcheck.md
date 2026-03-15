---
title: "Mailcheck"
description: "Consume Mailcheck API"
---

# Mailcheck
**Node Type:** nodes-base.mailcheck

## Description
Consume Mailcheck API

## Schema
```json
{
  "displayName": "Mailcheck",
  "name": "mailcheck",
  "icon": "file:mailcheck.svg",
  "group": [
    "transform"
  ],
  "version": 1,
  "subtitle": "={{$parameter[\"operation\"] + \": \" + $parameter[\"resource\"]}}",
  "description": "Consume Mailcheck API",
  "defaults": {
    "name": "Mailcheck"
  },
  "usableAsTool": true,
  "inputs": [
    "main"
  ],
  "outputs": [
    "main"
  ],
  "credentials": [
    {
      "name": "mailcheckApi",
      "required": true
    }
  ],
  "properties": [
    {
      "displayName": "Resource",
      "name": "resource",
      "type": "options",
      "noDataExpression": true,
      "options": [
        {
          "name": "Email",
          "value": "email"
        }
      ],
      "default": "email"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "noDataExpression": true,
      "displayOptions": {
        "show": {
          "resource": [
            "email"
          ]
        }
      },
      "options": [
        {
          "name": "Check",
          "value": "check",
          "action": "Check an email"
        }
      ],
      "default": "check"
    },
    {
      "displayName": "Email",
      "name": "email",
      "type": "string",
      "placeholder": "name@email.com",
      "displayOptions": {
        "show": {
          "resource": [
            "email"
          ],
          "operation": [
            "check"
          ]
        }
      },
      "default": "",
      "description": "Email address to check"
    }
  ]
}
```
