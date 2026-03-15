---
title: "n8n Trigger"
description: "Handle events and perform actions on your n8n instance"
---

# n8n Trigger
**Node Type:** nodes-base.n8nTrigger

## Description
Handle events and perform actions on your n8n instance

## Schema
```json
{
  "displayName": "n8n Trigger",
  "name": "n8nTrigger",
  "icon": "file:n8nTrigger.svg",
  "group": [
    "trigger"
  ],
  "version": 1,
  "description": "Handle events and perform actions on your n8n instance",
  "eventTriggerDescription": "",
  "mockManualExecution": true,
  "defaults": {
    "name": "n8n Trigger"
  },
  "inputs": [],
  "outputs": [
    "main"
  ],
  "properties": [
    {
      "displayName": "Events",
      "name": "events",
      "type": "multiOptions",
      "required": true,
      "default": [],
      "description": "Specifies under which conditions an execution should happen:\n\t\t\t\t<ul>\n\t\t\t\t\t<li><b>Active Workflow Updated</b>: Triggers when this workflow is updated</li>\n\t\t\t\t\t<li><b>Instance Started</b>:  Triggers when this n8n instance is started or re-started</li>\n\t\t\t\t\t<li><b>Workflow Activated</b>: Triggers when this workflow is activated</li>\n\t\t\t\t</ul>",
      "options": [
        {
          "name": "Active Workflow Updated",
          "value": "update",
          "description": "Triggers when this workflow is updated"
        },
        {
          "name": "Instance Started",
          "value": "init",
          "description": "Triggers when this n8n instance is started or re-started"
        },
        {
          "name": "Workflow Activated",
          "value": "activate",
          "description": "Triggers when this workflow is activated"
        }
      ]
    }
  ]
}
```
