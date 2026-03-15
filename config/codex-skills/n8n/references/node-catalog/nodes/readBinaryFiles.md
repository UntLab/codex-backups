---
title: "Read Binary Files"
description: "Reads binary files from disk"
---

# Read Binary Files
**Node Type:** nodes-base.readBinaryFiles

## Description
Reads binary files from disk

## Schema
```json
{
  "hidden": true,
  "displayName": "Read Binary Files",
  "name": "readBinaryFiles",
  "icon": "fa:file-import",
  "group": [
    "input"
  ],
  "version": 1,
  "description": "Reads binary files from disk",
  "defaults": {
    "name": "Read Binary Files",
    "color": "#44AA44"
  },
  "inputs": [
    "main"
  ],
  "outputs": [
    "main"
  ],
  "properties": [
    {
      "displayName": "File Selector",
      "name": "fileSelector",
      "type": "string",
      "default": "",
      "required": true,
      "placeholder": "*.jpg",
      "description": "Pattern for files to read"
    },
    {
      "displayName": "Property Name",
      "name": "dataPropertyName",
      "type": "string",
      "default": "data",
      "required": true,
      "description": "Name of the binary property to which to write the data of the read files"
    }
  ]
}
```
