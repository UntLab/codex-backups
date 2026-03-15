---
title: "Respond to Chat"
description: "Send a message to a chat"
---

# Respond to Chat
**Node Type:** nodes-langchain.chat

## Description
Send a message to a chat

## Schema
```json
{
  "usableAsTool": true,
  "displayName": "Respond to Chat",
  "name": "chat",
  "icon": "fa:comments",
  "iconColor": "black",
  "group": [
    "input"
  ],
  "version": 1,
  "description": "Send a message to a chat",
  "defaults": {
    "name": "Respond to Chat"
  },
  "codex": {
    "categories": [
      "Core Nodes",
      "HITL"
    ],
    "subcategories": {
      "HITL": [
        "Human in the Loop"
      ]
    },
    "alias": [
      "human",
      "wait",
      "hitl"
    ],
    "resources": {
      "primaryDocumentation": [
        {
          "url": "https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-langchain.respondtochat/"
        }
      ]
    }
  },
  "inputs": "={{ ((parameters) => {\n  const inputs = [\n    {\n      type: \"main\",\n      displayName: \"User Response\"\n    }\n  ];\n  if (parameters.options?.memoryConnection) {\n    return [\n      ...inputs,\n      {\n        type: \"ai_memory\",\n        displayName: \"Memory\",\n        maxConnections: 1\n      }\n    ];\n  }\n  return inputs;\n})($parameter) }}",
  "outputs": [
    "main"
  ],
  "properties": [
    {
      "displayName": "Verify you're using a chat trigger with the 'Response Mode' option set to 'Using Response Nodes'",
      "name": "generalNotice",
      "type": "notice",
      "default": ""
    },
    {
      "displayName": "Message",
      "name": "message",
      "type": "string",
      "default": "",
      "required": true,
      "typeOptions": {
        "rows": 6
      }
    },
    {
      "displayName": "Wait for User Reply",
      "name": "waitUserReply",
      "type": "boolean",
      "default": true,
      "noDataExpression": true
    },
    {
      "displayName": "Options",
      "name": "options",
      "type": "collection",
      "placeholder": "Add Option",
      "default": {},
      "displayOptions": {
        "hide": {
          "@tool": [
            true
          ]
        }
      },
      "options": [
        {
          "displayName": "Add Memory Input Connection",
          "name": "memoryConnection",
          "type": "boolean",
          "default": false
        },
        {
          "displayName": "Limit Wait Time",
          "name": "limitWaitTime",
          "type": "fixedCollection",
          "description": "Whether to limit the time this node should wait for a user response before execution resumes",
          "default": {
            "values": {
              "limitType": "afterTimeInterval",
              "resumeAmount": 45,
              "resumeUnit": "minutes"
            }
          },
          "options": [
            {
              "displayName": "Values",
              "name": "values",
              "values": [
                {
                  "displayName": "Limit Type",
                  "name": "limitType",
                  "type": "options",
                  "default": "afterTimeInterval",
                  "description": "Sets the condition for the execution to resume. Can be a specified date or after some time.",
                  "options": [
                    {
                      "name": "After Time Interval",
                      "description": "Waits for a certain amount of time",
                      "value": "afterTimeInterval"
                    },
                    {
                      "name": "At Specified Time",
                      "description": "Waits until the set date and time to continue",
                      "value": "atSpecifiedTime"
                    }
                  ]
                },
                {
                  "displayName": "Amount",
                  "name": "resumeAmount",
                  "type": "number",
                  "displayOptions": {
                    "show": {
                      "limitType": [
                        "afterTimeInterval"
                      ]
                    }
                  },
                  "typeOptions": {
                    "minValue": 0,
                    "numberPrecision": 2
                  },
                  "default": 1,
                  "description": "The time to wait"
                },
                {
                  "displayName": "Unit",
                  "name": "resumeUnit",
                  "type": "options",
                  "displayOptions": {
                    "show": {
                      "limitType": [
                        "afterTimeInterval"
                      ]
                    }
                  },
                  "options": [
                    {
                      "name": "Minutes",
                      "value": "minutes"
                    },
                    {
                      "name": "Hours",
                      "value": "hours"
                    },
                    {
                      "name": "Days",
                      "value": "days"
                    }
                  ],
                  "default": "hours",
                  "description": "Unit of the interval value"
                },
                {
                  "displayName": "Max Date and Time",
                  "name": "maxDateAndTime",
                  "type": "dateTime",
                  "displayOptions": {
                    "show": {
                      "limitType": [
                        "atSpecifiedTime"
                      ]
                    }
                  },
                  "default": "",
                  "description": "Continue execution after the specified date and time"
                }
              ]
            }
          ],
          "displayOptions": {
            "show": {
              "/waitUserReply": [
                true
              ]
            }
          }
        }
      ]
    },
    {
      "displayName": "Options",
      "name": "options",
      "type": "collection",
      "placeholder": "Add Option",
      "default": {},
      "options": [
        {
          "displayName": "Limit Wait Time",
          "name": "limitWaitTime",
          "type": "fixedCollection",
          "description": "Whether to limit the time this node should wait for a user response before execution resumes",
          "default": {
            "values": {
              "limitType": "afterTimeInterval",
              "resumeAmount": 45,
              "resumeUnit": "minutes"
            }
          },
          "options": [
            {
              "displayName": "Values",
              "name": "values",
              "values": [
                {
                  "displayName": "Limit Type",
                  "name": "limitType",
                  "type": "options",
                  "default": "afterTimeInterval",
                  "description": "Sets the condition for the execution to resume. Can be a specified date or after some time.",
                  "options": [
                    {
                      "name": "After Time Interval",
                      "description": "Waits for a certain amount of time",
                      "value": "afterTimeInterval"
                    },
                    {
                      "name": "At Specified Time",
                      "description": "Waits until the set date and time to continue",
                      "value": "atSpecifiedTime"
                    }
                  ]
                },
                {
                  "displayName": "Amount",
                  "name": "resumeAmount",
                  "type": "number",
                  "displayOptions": {
                    "show": {
                      "limitType": [
                        "afterTimeInterval"
                      ]
                    }
                  },
                  "typeOptions": {
                    "minValue": 0,
                    "numberPrecision": 2
                  },
                  "default": 1,
                  "description": "The time to wait"
                },
                {
                  "displayName": "Unit",
                  "name": "resumeUnit",
                  "type": "options",
                  "displayOptions": {
                    "show": {
                      "limitType": [
                        "afterTimeInterval"
                      ]
                    }
                  },
                  "options": [
                    {
                      "name": "Minutes",
                      "value": "minutes"
                    },
                    {
                      "name": "Hours",
                      "value": "hours"
                    },
                    {
                      "name": "Days",
                      "value": "days"
                    }
                  ],
                  "default": "hours",
                  "description": "Unit of the interval value"
                },
                {
                  "displayName": "Max Date and Time",
                  "name": "maxDateAndTime",
                  "type": "dateTime",
                  "displayOptions": {
                    "show": {
                      "limitType": [
                        "atSpecifiedTime"
                      ]
                    }
                  },
                  "default": "",
                  "description": "Continue execution after the specified date and time"
                }
              ]
            }
          ],
          "displayOptions": {
            "show": {
              "/waitUserReply": [
                true
              ]
            }
          }
        }
      ],
      "displayOptions": {
        "show": {
          "@tool": [
            true
          ],
          "/waitUserReply": [
            true
          ]
        }
      }
    }
  ]
}
```
