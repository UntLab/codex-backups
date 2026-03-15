---
title: "Google Drive"
description: "Access data on Google Drive"
---

# Google Drive
**Node Type:** nodes-base.googleDrive

## Description
Access data on Google Drive

## Schema
```json
{
  "displayName": "Google Drive",
  "name": "googleDrive",
  "icon": "file:googleDrive.svg",
  "group": [
    "input"
  ],
  "subtitle": "={{$parameter[\"operation\"] + \": \" + $parameter[\"resource\"]}}",
  "description": "Access data on Google Drive",
  "defaultVersion": 3
}
```
