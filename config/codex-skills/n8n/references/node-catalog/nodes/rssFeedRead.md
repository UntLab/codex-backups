---
title: "RSS Read"
description: "Reads data from an RSS Feed"
---

# RSS Read
**Node Type:** nodes-base.rssFeedRead

## Description
Reads data from an RSS Feed

## Schema
```json
{
  "displayName": "RSS Read",
  "name": "rssFeedRead",
  "icon": "fa:rss",
  "iconColor": "orange-red",
  "group": [
    "input"
  ],
  "version": [
    1,
    1.1,
    1.2
  ],
  "description": "Reads data from an RSS Feed",
  "defaults": {
    "name": "RSS Read",
    "color": "#b02020"
  },
  "usableAsTool": true,
  "inputs": [
    "main"
  ],
  "outputs": [
    "main"
  ],
  "properties": [
    {
      "displayName": "URL",
      "name": "url",
      "type": "string",
      "default": "",
      "required": true,
      "description": "URL of the RSS feed"
    },
    {
      "displayName": "Options",
      "name": "options",
      "type": "collection",
      "placeholder": "Add option",
      "default": {},
      "options": [
        {
          "displayName": "Custom Fields",
          "name": "customFields",
          "type": "string",
          "default": "",
          "description": "A comma-separated list of custom fields to include in the output. For example, \"author, contentSnippet\"."
        },
        {
          "displayName": "Ignore SSL Issues (Insecure)",
          "name": "ignoreSSL",
          "type": "boolean",
          "default": false,
          "description": "Whether to ignore SSL/TLS certificate issues or not"
        }
      ]
    }
  ]
}
```
