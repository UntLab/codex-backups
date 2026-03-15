---
title: "HTTP Request"
description: "Makes an HTTP request and returns the response data"
---

# HTTP Request
**Node Type:** nodes-base.httpRequest

## Description
Makes an HTTP request and returns the response data

## Schema
```json
{
  "displayName": "HTTP Request",
  "name": "httpRequest",
  "icon": {
    "light": "file:httprequest.svg",
    "dark": "file:httprequest.dark.svg"
  },
  "group": [
    "output"
  ],
  "subtitle": "={{$parameter[\"requestMethod\"] + \": \" + $parameter[\"url\"]}}",
  "description": "Makes an HTTP request and returns the response data",
  "defaultVersion": 4.3
}
```
