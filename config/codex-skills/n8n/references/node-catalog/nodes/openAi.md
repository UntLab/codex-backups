---
title: "OpenAI"
description: "Message an assistant or GPT, analyze images, generate audio, etc."
---

# OpenAI
**Node Type:** nodes-langchain.openAi

## Description
Message an assistant or GPT, analyze images, generate audio, etc.

## Schema
```json
{
  "displayName": "OpenAI",
  "name": "openAi",
  "icon": {
    "light": "file:openAi.svg",
    "dark": "file:openAi.dark.svg"
  },
  "group": [
    "transform"
  ],
  "defaultVersion": 2.1,
  "subtitle": "={{((resource, operation) => {\n  if (operation === \"deleteAssistant\") {\n    return \"Delete Assistant\";\n  }\n  if (operation === \"deleteFile\") {\n    return \"Delete File\";\n  }\n  if (operation === \"classify\") {\n    return \"Classify Text\";\n  }\n  if (operation === \"message\" && resource === \"text\") {\n    return \"Message Model\";\n  }\n  const capitalize = (str) => {\n    const chars = str.split(\"\");\n    chars[0] = chars[0].toUpperCase();\n    return chars.join(\"\");\n  };\n  if ([\"transcribe\", \"translate\"].includes(operation)) {\n    resource = \"recording\";\n  }\n  if (operation === \"list\") {\n    resource = resource + \"s\";\n  }\n  return `${capitalize(operation)} ${capitalize(resource)}`;\n})($parameter.resource, $parameter.operation)}}",
  "description": "Message an assistant or GPT, analyze images, generate audio, etc.",
  "codex": {
    "alias": [
      "LangChain",
      "ChatGPT",
      "Sora",
      "DallE",
      "whisper",
      "audio",
      "transcribe",
      "tts",
      "assistant"
    ],
    "categories": [
      "AI"
    ],
    "subcategories": {
      "AI": [
        "Agents",
        "Miscellaneous",
        "Root Nodes"
      ]
    },
    "resources": {
      "primaryDocumentation": [
        {
          "url": "https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-langchain.openai/"
        }
      ]
    }
  }
}
```
