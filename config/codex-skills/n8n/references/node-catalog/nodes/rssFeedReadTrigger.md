---
title: "RSS Feed Trigger"
description: "Starts a workflow when an RSS feed is updated"
---

# RSS Feed Trigger
**Node Type:** nodes-base.rssFeedReadTrigger

## Description
Starts a workflow when an RSS feed is updated

## Schema
```json
{
  "displayName": "RSS Feed Trigger",
  "name": "rssFeedReadTrigger",
  "icon": "fa:rss",
  "iconColor": "orange-red",
  "group": [
    "trigger"
  ],
  "version": 1,
  "description": "Starts a workflow when an RSS feed is updated",
  "subtitle": "={{$parameter[\"event\"]}}",
  "defaults": {
    "name": "RSS Feed Trigger",
    "color": "#b02020"
  },
  "polling": true,
  "inputs": [],
  "outputs": [
    "main"
  ],
  "properties": [
    {
      "displayName": "Feed URL",
      "name": "feedUrl",
      "type": "string",
      "default": "https://blog.n8n.io/rss/",
      "required": true,
      "description": "URL of the RSS feed to poll"
    }
  ]
}
```
