---
title: "X (Formerly Twitter)"
description: "Consume the X API"
---

# X (Formerly Twitter)
**Node Type:** nodes-base.twitter

## Description
Consume the X API

## Schema
```json
{
  "displayName": "X (Formerly Twitter)",
  "name": "twitter",
  "icon": {
    "light": "file:x.svg",
    "dark": "file:x.dark.svg"
  },
  "group": [
    "output"
  ],
  "subtitle": "={{$parameter[\"operation\"] + \": \" + $parameter[\"resource\"]}}",
  "description": "Consume the X API",
  "defaultVersion": 2
}
```
