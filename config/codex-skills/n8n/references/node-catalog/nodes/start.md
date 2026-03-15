---
title: "Start"
description: "Starts the workflow execution from this node"
---

# Start
**Node Type:** nodes-base.start

## Description
Starts the workflow execution from this node

## Schema
```json
{
  "displayName": "Start",
  "name": "start",
  "icon": "fa:play",
  "group": [
    "input"
  ],
  "version": 1,
  "description": "Starts the workflow execution from this node",
  "maxNodes": 1,
  "hidden": true,
  "defaults": {
    "name": "Start",
    "color": "#00e000"
  },
  "inputs": [],
  "outputs": [
    "main"
  ],
  "properties": [
    {
      "displayName": "This node is where a manual workflow execution starts. To make one, go back to the canvas and click ‘execute workflow’",
      "name": "notice",
      "type": "notice",
      "default": ""
    }
  ]
}
```
