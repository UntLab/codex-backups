---
title: "Customer Messenger (n8n training)"
description: "Dummy node used for n8n training"
---

# Customer Messenger (n8n training)
**Node Type:** nodes-base.n8nTrainingCustomerMessenger

## Description
Dummy node used for n8n training

## Schema
```json
{
  "displayName": "Customer Messenger (n8n training)",
  "name": "n8nTrainingCustomerMessenger",
  "icon": {
    "light": "file:n8nTrainingCustomerMessenger.svg",
    "dark": "file:n8nTrainingCustomerMessenger.dark.svg"
  },
  "group": [
    "transform"
  ],
  "version": 1,
  "description": "Dummy node used for n8n training",
  "defaults": {
    "name": "Customer Messenger (n8n training)"
  },
  "inputs": [
    "main"
  ],
  "outputs": [
    "main"
  ],
  "properties": [
    {
      "displayName": "Customer ID",
      "name": "customerId",
      "type": "string",
      "required": true,
      "default": ""
    },
    {
      "displayName": "Message",
      "name": "message",
      "type": "string",
      "required": true,
      "typeOptions": {
        "rows": 4
      },
      "default": ""
    }
  ]
}
```
