---
title: "Manual Trigger"
description: "Runs the flow on clicking a button in n8n"
---

# Manual Trigger
**Node Type:** nodes-base.manualTrigger

## Description
Runs the flow on clicking a button in n8n

## Schema
```json
{
  "displayName": "Manual Trigger",
  "name": "manualTrigger",
  "icon": "fa:mouse-pointer",
  "group": [
    "trigger"
  ],
  "version": 1,
  "description": "Runs the flow on clicking a button in n8n",
  "eventTriggerDescription": "",
  "maxNodes": 1,
  "defaults": {
    "name": "When clicking ‘Execute workflow’",
    "color": "#909298"
  },
  "inputs": [],
  "outputs": [
    "main"
  ],
  "properties": [
    {
      "displayName": "This node is where the workflow execution starts (when you click the ‘test’ button on the canvas).<br><br> <a data-action=\"showNodeCreator\">Explore other ways to trigger your workflow</a> (e.g on a schedule, or a webhook)",
      "name": "notice",
      "type": "notice",
      "default": ""
    }
  ]
}
```
