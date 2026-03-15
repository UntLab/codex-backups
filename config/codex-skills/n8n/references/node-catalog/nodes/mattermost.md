---
title: "Mattermost"
description: "Sends data to Mattermost"
---

# Mattermost
**Node Type:** nodes-base.mattermost

## Description
Sends data to Mattermost

## Schema
```json
{
  "displayName": "Mattermost",
  "name": "mattermost",
  "icon": "file:mattermost.svg",
  "group": [
    "output"
  ],
  "subtitle": "={{$parameter[\"operation\"] + \": \" + $parameter[\"resource\"]}}",
  "description": "Sends data to Mattermost",
  "defaultVersion": 1
}
```
