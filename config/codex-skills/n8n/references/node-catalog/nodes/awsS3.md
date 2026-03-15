---
title: "AwsS3"
description: "Sends data to AWS S3"
---

# AwsS3
**Node Type:** nodes-base.awsS3

## Description
Sends data to AWS S3

## Schema
```json
{
  "displayName": "AwsS3",
  "name": "awsS3",
  "icon": "file:s3.svg",
  "group": [
    "output"
  ],
  "subtitle": "={{$parameter[\"operation\"] + \": \" + $parameter[\"resource\"]}}",
  "description": "Sends data to AWS S3",
  "defaultVersion": 2
}
```
