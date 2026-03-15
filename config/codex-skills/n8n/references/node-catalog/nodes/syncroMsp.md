---
title: "SyncroMSP"
description: "Manage contacts, tickets and more from Syncro MSP"
---

# SyncroMSP
**Node Type:** nodes-base.syncroMsp

## Description
Manage contacts, tickets and more from Syncro MSP

## Schema
```json
{
  "displayName": "SyncroMSP",
  "name": "syncroMsp",
  "icon": "file:syncromsp.png",
  "group": [
    "output"
  ],
  "subtitle": "={{$parameter[\"operation\"] + \": \" + $parameter[\"resource\"]}}",
  "description": "Manage contacts, tickets and more from Syncro MSP",
  "defaultVersion": 1
}
```
