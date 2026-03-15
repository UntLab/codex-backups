---
title: "SeaTable"
description: "Read, update, write and delete data from SeaTable"
---

# SeaTable
**Node Type:** nodes-base.seaTable

## Description
Read, update, write and delete data from SeaTable

## Schema
```json
{
  "displayName": "SeaTable",
  "name": "seaTable",
  "icon": "file:seaTable.svg",
  "group": [
    "output"
  ],
  "subtitle": "={{$parameter[\"resource\"] + \": \" + $parameter[\"operation\"]}}",
  "description": "Read, update, write and delete data from SeaTable",
  "defaultVersion": 2,
  "usableAsTool": true
}
```
