---
title: "Data table"
description: "Permanently save data across workflow executions in a table"
---

# Data table
**Node Type:** nodes-base.dataTable

## Description
Permanently save data across workflow executions in a table

## Schema
```json
{
  "displayName": "Data table",
  "name": "dataTable",
  "icon": "fa:table",
  "iconColor": "orange-red",
  "group": [
    "input",
    "transform"
  ],
  "version": 1,
  "subtitle": "={{$parameter[\"action\"]}}",
  "description": "Permanently save data across workflow executions in a table",
  "defaults": {
    "name": "Data table"
  },
  "usableAsTool": true,
  "inputs": [
    "main"
  ],
  "outputs": [
    "main"
  ],
  "hints": [
    {
      "message": "The selected data table has no columns.",
      "displayCondition": "={{ $parameter.dataTableId !== \"\" && $parameter?.columns?.mappingMode === \"defineBelow\" && !$parameter?.columns?.schema?.length }}",
      "whenToDisplay": "beforeExecution",
      "location": "ndv",
      "type": "info"
    }
  ],
  "properties": [
    {
      "displayName": "Resource",
      "name": "resource",
      "type": "options",
      "noDataExpression": true,
      "options": [
        {
          "name": "Row",
          "value": "row"
        }
      ],
      "default": "row"
    },
    {
      "displayName": "Operation",
      "name": "operation",
      "type": "options",
      "noDataExpression": true,
      "displayOptions": {
        "show": {
          "resource": [
            "row"
          ]
        }
      },
      "options": [
        {
          "name": "Delete",
          "value": "deleteRows",
          "description": "Delete row(s)",
          "action": "Delete row(s)"
        },
        {
          "name": "Get",
          "value": "get",
          "description": "Get row(s)",
          "action": "Get row(s)"
        },
        {
          "name": "If Row Exists",
          "value": "rowExists",
          "description": "Match input items that are in the data table",
          "action": "If row exists"
        },
        {
          "name": "If Row Does Not Exist",
          "value": "rowNotExists",
          "description": "Match input items that are not in the data table",
          "action": "If row does not exist"
        },
        {
          "name": "Insert",
          "value": "insert",
          "description": "Insert a new row",
          "action": "Insert row"
        },
        {
          "name": "Update",
          "value": "update",
          "description": "Update row(s) matching certain fields",
          "action": "Update row(s)"
        },
        {
          "name": "Upsert",
          "value": "upsert",
          "description": "Update row(s), or insert if there is no match",
          "action": "Upsert row(s)"
        }
      ],
      "default": "insert"
    },
    {
      "displayName": "Data table",
      "name": "dataTableId",
      "type": "resourceLocator",
      "default": {
        "mode": "list",
        "value": ""
      },
      "required": true,
      "modes": [
        {
          "displayName": "From List",
          "name": "list",
          "type": "list",
          "typeOptions": {
            "searchListMethod": "tableSearch",
            "searchable": true,
            "allowNewResource": {
              "label": "resourceLocator.dataTable.createNew",
              "url": "/projects/{{$projectId}}/datatables/new"
            }
          }
        },
        {
          "displayName": "ID",
          "name": "id",
          "type": "string"
        }
      ],
      "displayOptions": {
        "show": {
          "resource": [
            "row"
          ]
        }
      }
    },
    {
      "displayName": "Must Match",
      "name": "matchType",
      "type": "options",
      "options": [
        {
          "name": "Any Condition",
          "value": "anyCondition"
        },
        {
          "name": "All Conditions",
          "value": "allConditions"
        }
      ],
      "displayOptions": {
        "show": {
          "resource": [
            "row"
          ],
          "operation": [
            "deleteRows"
          ]
        }
      },
      "default": "anyCondition"
    },
    {
      "displayName": "Conditions",
      "name": "filters",
      "type": "fixedCollection",
      "typeOptions": {
        "multipleValues": true,
        "minRequiredFields": 0
      },
      "displayOptions": {
        "show": {
          "resource": [
            "row"
          ],
          "operation": [
            "deleteRows"
          ]
        }
      },
      "default": {},
      "placeholder": "Add Condition",
      "options": [
        {
          "displayName": "Conditions",
          "name": "conditions",
          "values": [
            {
              "displayName": "Column",
              "name": "keyName",
              "type": "options",
              "description": "Choose from the list, or specify using an <a href=\"https://docs.n8n.io/code/expressions/\">expression</a>",
              "typeOptions": {
                "loadOptionsDependsOn": [
                  "dataTableId.value"
                ],
                "loadOptionsMethod": "getDataTableColumns"
              },
              "default": "id"
            },
            {
              "displayName": "Condition",
              "name": "condition",
              "type": "options",
              "typeOptions": {
                "loadOptionsDependsOn": [
                  "&keyName"
                ],
                "loadOptionsMethod": "getConditionsForColumn"
              },
              "default": "eq"
            },
            {
              "displayName": "Value",
              "name": "keyValue",
              "type": "string",
              "default": "",
              "displayOptions": {
                "hide": {
                  "condition": [
                    "isEmpty",
                    "isNotEmpty",
                    "isTrue",
                    "isFalse"
                  ]
                }
              }
            }
          ]
        }
      ],
      "description": "Filter to decide which rows get"
    },
    {
      "displayName": "Options",
      "name": "options",
      "type": "collection",
      "default": {},
      "placeholder": "Add option",
      "options": [
        {
          "displayName": "Dry Run",
          "name": "dryRun",
          "type": "boolean",
          "default": false,
          "description": "Whether the operation simulates and returns affected rows in their \"before\" and \"after\" states"
        }
      ],
      "displayOptions": {
        "show": {
          "resource": [
            "row"
          ],
          "operation": [
            "deleteRows"
          ]
        }
      }
    },
    {
      "displayName": "Columns",
      "name": "columns",
      "type": "resourceMapper",
      "default": {
        "mappingMode": "defineBelow",
        "value": null
      },
      "noDataExpression": true,
      "required": true,
      "typeOptions": {
        "loadOptionsDependsOn": [
          "dataTableId.value"
        ],
        "resourceMapper": {
          "valuesLabel": "Values to insert",
          "resourceMapperMethod": "getDataTables",
          "mode": "add",
          "fieldWords": {
            "singular": "column",
            "plural": "columns"
          },
          "addAllFields": true,
          "multiKeyMatch": true,
          "hideNoDataError": true
        }
      },
      "displayOptions": {
        "show": {
          "resource": [
            "row"
          ],
          "operation": [
            "insert"
          ]
        }
      }
    },
    {
      "displayName": "Options",
      "name": "options",
      "type": "collection",
      "placeholder": "Add Option",
      "default": {},
      "options": [
        {
          "displayName": "Optimize Bulk",
          "name": "optimizeBulk",
          "type": "boolean",
          "default": false,
          "noDataExpression": true,
          "description": "Whether to improve bulk insert performance 5x by not returning inserted data"
        }
      ],
      "displayOptions": {
        "show": {
          "resource": [
            "row"
          ],
          "operation": [
            "insert"
          ]
        }
      }
    },
    {
      "displayName": "Must Match",
      "name": "matchType",
      "type": "options",
      "options": [
        {
          "name": "Any Condition",
          "value": "anyCondition"
        },
        {
          "name": "All Conditions",
          "value": "allConditions"
        }
      ],
      "displayOptions": {
        "show": {
          "resource": [
            "row"
          ],
          "operation": [
            "get"
          ]
        }
      },
      "default": "anyCondition"
    },
    {
      "displayName": "Conditions",
      "name": "filters",
      "type": "fixedCollection",
      "typeOptions": {
        "multipleValues": true,
        "minRequiredFields": 0
      },
      "displayOptions": {
        "show": {
          "resource": [
            "row"
          ],
          "operation": [
            "get"
          ]
        }
      },
      "default": {},
      "placeholder": "Add Condition",
      "options": [
        {
          "displayName": "Conditions",
          "name": "conditions",
          "values": [
            {
              "displayName": "Column",
              "name": "keyName",
              "type": "options",
              "description": "Choose from the list, or specify using an <a href=\"https://docs.n8n.io/code/expressions/\">expression</a>",
              "typeOptions": {
                "loadOptionsDependsOn": [
                  "dataTableId.value"
                ],
                "loadOptionsMethod": "getDataTableColumns"
              },
              "default": "id"
            },
            {
              "displayName": "Condition",
              "name": "condition",
              "type": "options",
              "typeOptions": {
                "loadOptionsDependsOn": [
                  "&keyName"
                ],
                "loadOptionsMethod": "getConditionsForColumn"
              },
              "default": "eq"
            },
            {
              "displayName": "Value",
              "name": "keyValue",
              "type": "string",
              "default": "",
              "displayOptions": {
                "hide": {
                  "condition": [
                    "isEmpty",
                    "isNotEmpty",
                    "isTrue",
                    "isFalse"
                  ]
                }
              }
            }
          ]
        }
      ],
      "description": "Filter to decide which rows get"
    },
    {
      "displayName": "Return All",
      "name": "returnAll",
      "type": "boolean",
      "displayOptions": {
        "show": {
          "resource": [
            "row"
          ],
          "operation": [
            "get"
          ]
        }
      },
      "default": false,
      "description": "Whether to return all results or only up to a given limit"
    },
    {
      "displayName": "Limit",
      "name": "limit",
      "type": "number",
      "displayOptions": {
        "show": {
          "resource": [
            "row"
          ],
          "operation": [
            "get"
          ],
          "returnAll": [
            false
          ]
        }
      },
      "typeOptions": {
        "minValue": 1
      },
      "default": 50,
      "description": "Max number of results to return"
    },
    {
      "displayName": "Must Match",
      "name": "matchType",
      "type": "options",
      "options": [
        {
          "name": "Any Condition",
          "value": "anyCondition"
        },
        {
          "name": "All Conditions",
          "value": "allConditions"
        }
      ],
      "displayOptions": {
        "show": {
          "resource": [
            "row"
          ],
          "operation": [
            "rowExists"
          ]
        }
      },
      "default": "anyCondition"
    },
    {
      "displayName": "Conditions",
      "name": "filters",
      "type": "fixedCollection",
      "typeOptions": {
        "multipleValues": true,
        "minRequiredFields": 1
      },
      "displayOptions": {
        "show": {
          "resource": [
            "row"
          ],
          "operation": [
            "rowExists"
          ]
        }
      },
      "default": {},
      "placeholder": "Add Condition",
      "options": [
        {
          "displayName": "Conditions",
          "name": "conditions",
          "values": [
            {
              "displayName": "Column",
              "name": "keyName",
              "type": "options",
              "description": "Choose from the list, or specify using an <a href=\"https://docs.n8n.io/code/expressions/\">expression</a>",
              "typeOptions": {
                "loadOptionsDependsOn": [
                  "dataTableId.value"
                ],
                "loadOptionsMethod": "getDataTableColumns"
              },
              "default": "id"
            },
            {
              "displayName": "Condition",
              "name": "condition",
              "type": "options",
              "typeOptions": {
                "loadOptionsDependsOn": [
                  "&keyName"
                ],
                "loadOptionsMethod": "getConditionsForColumn"
              },
              "default": "eq",
              "displayOptions": {
                "show": {
                  "@version": [
                    {
                      "_cnd": {
                        "lt": 0
                      }
                    }
                  ]
                }
              }
            },
            {
              "displayName": "Value",
              "name": "keyValue",
              "type": "string",
              "default": "",
              "displayOptions": {
                "hide": {
                  "condition": [
                    "isEmpty",
                    "isNotEmpty",
                    "isTrue",
                    "isFalse"
                  ]
                }
              }
            }
          ]
        }
      ],
      "description": "Filter to decide which rows get"
    },
    {
      "displayName": "Must Match",
      "name": "matchType",
      "type": "options",
      "options": [
        {
          "name": "Any Condition",
          "value": "anyCondition"
        },
        {
          "name": "All Conditions",
          "value": "allConditions"
        }
      ],
      "displayOptions": {
        "show": {
          "resource": [
            "row"
          ],
          "operation": [
            "rowNotExists"
          ]
        }
      },
      "default": "anyCondition"
    },
    {
      "displayName": "Conditions",
      "name": "filters",
      "type": "fixedCollection",
      "typeOptions": {
        "multipleValues": true,
        "minRequiredFields": 1
      },
      "displayOptions": {
        "show": {
          "resource": [
            "row"
          ],
          "operation": [
            "rowNotExists"
          ]
        }
      },
      "default": {},
      "placeholder": "Add Condition",
      "options": [
        {
          "displayName": "Conditions",
          "name": "conditions",
          "values": [
            {
              "displayName": "Column",
              "name": "keyName",
              "type": "options",
              "description": "Choose from the list, or specify using an <a href=\"https://docs.n8n.io/code/expressions/\">expression</a>",
              "typeOptions": {
                "loadOptionsDependsOn": [
                  "dataTableId.value"
                ],
                "loadOptionsMethod": "getDataTableColumns"
              },
              "default": "id"
            },
            {
              "displayName": "Condition",
              "name": "condition",
              "type": "options",
              "typeOptions": {
                "loadOptionsDependsOn": [
                  "&keyName"
                ],
                "loadOptionsMethod": "getConditionsForColumn"
              },
              "default": "eq",
              "displayOptions": {
                "show": {
                  "@version": [
                    {
                      "_cnd": {
                        "lt": 0
                      }
                    }
                  ]
                }
              }
            },
            {
              "displayName": "Value",
              "name": "keyValue",
              "type": "string",
              "default": "",
              "displayOptions": {
                "hide": {
                  "condition": [
                    "isEmpty",
                    "isNotEmpty",
                    "isTrue",
                    "isFalse"
                  ]
                }
              }
            }
          ]
        }
      ],
      "description": "Filter to decide which rows get"
    },
    {
      "displayName": "Must Match",
      "name": "matchType",
      "type": "options",
      "options": [
        {
          "name": "Any Condition",
          "value": "anyCondition"
        },
        {
          "name": "All Conditions",
          "value": "allConditions"
        }
      ],
      "displayOptions": {
        "show": {
          "resource": [
            "row"
          ],
          "operation": [
            "update"
          ]
        }
      },
      "default": "anyCondition"
    },
    {
      "displayName": "Conditions",
      "name": "filters",
      "type": "fixedCollection",
      "typeOptions": {
        "multipleValues": true,
        "minRequiredFields": 0
      },
      "displayOptions": {
        "show": {
          "resource": [
            "row"
          ],
          "operation": [
            "update"
          ]
        }
      },
      "default": {},
      "placeholder": "Add Condition",
      "options": [
        {
          "displayName": "Conditions",
          "name": "conditions",
          "values": [
            {
              "displayName": "Column",
              "name": "keyName",
              "type": "options",
              "description": "Choose from the list, or specify using an <a href=\"https://docs.n8n.io/code/expressions/\">expression</a>",
              "typeOptions": {
                "loadOptionsDependsOn": [
                  "dataTableId.value"
                ],
                "loadOptionsMethod": "getDataTableColumns"
              },
              "default": "id"
            },
            {
              "displayName": "Condition",
              "name": "condition",
              "type": "options",
              "typeOptions": {
                "loadOptionsDependsOn": [
                  "&keyName"
                ],
                "loadOptionsMethod": "getConditionsForColumn"
              },
              "default": "eq"
            },
            {
              "displayName": "Value",
              "name": "keyValue",
              "type": "string",
              "default": "",
              "displayOptions": {
                "hide": {
                  "condition": [
                    "isEmpty",
                    "isNotEmpty",
                    "isTrue",
                    "isFalse"
                  ]
                }
              }
            }
          ]
        }
      ],
      "description": "Filter to decide which rows get"
    },
    {
      "displayName": "Columns",
      "name": "columns",
      "type": "resourceMapper",
      "default": {
        "mappingMode": "defineBelow",
        "value": null
      },
      "noDataExpression": true,
      "required": true,
      "typeOptions": {
        "loadOptionsDependsOn": [
          "dataTableId.value"
        ],
        "resourceMapper": {
          "valuesLabel": "Values to update",
          "resourceMapperMethod": "getDataTables",
          "mode": "add",
          "fieldWords": {
            "singular": "column",
            "plural": "columns"
          },
          "addAllFields": true,
          "multiKeyMatch": true,
          "hideNoDataError": true
        }
      },
      "displayOptions": {
        "show": {
          "resource": [
            "row"
          ],
          "operation": [
            "update"
          ]
        }
      }
    },
    {
      "displayName": "Options",
      "name": "options",
      "type": "collection",
      "default": {},
      "placeholder": "Add option",
      "options": [
        {
          "displayName": "Dry Run",
          "name": "dryRun",
          "type": "boolean",
          "default": false,
          "description": "Whether the operation simulates and returns affected rows in their \"before\" and \"after\" states"
        }
      ],
      "displayOptions": {
        "show": {
          "resource": [
            "row"
          ],
          "operation": [
            "update"
          ]
        }
      }
    },
    {
      "displayName": "Must Match",
      "name": "matchType",
      "type": "options",
      "options": [
        {
          "name": "Any Condition",
          "value": "anyCondition"
        },
        {
          "name": "All Conditions",
          "value": "allConditions"
        }
      ],
      "displayOptions": {
        "show": {
          "resource": [
            "row"
          ],
          "operation": [
            "upsert"
          ]
        }
      },
      "default": "anyCondition"
    },
    {
      "displayName": "Conditions",
      "name": "filters",
      "type": "fixedCollection",
      "typeOptions": {
        "multipleValues": true,
        "minRequiredFields": 0
      },
      "displayOptions": {
        "show": {
          "resource": [
            "row"
          ],
          "operation": [
            "upsert"
          ]
        }
      },
      "default": {},
      "placeholder": "Add Condition",
      "options": [
        {
          "displayName": "Conditions",
          "name": "conditions",
          "values": [
            {
              "displayName": "Column",
              "name": "keyName",
              "type": "options",
              "description": "Choose from the list, or specify using an <a href=\"https://docs.n8n.io/code/expressions/\">expression</a>",
              "typeOptions": {
                "loadOptionsDependsOn": [
                  "dataTableId.value"
                ],
                "loadOptionsMethod": "getDataTableColumns"
              },
              "default": "id"
            },
            {
              "displayName": "Condition",
              "name": "condition",
              "type": "options",
              "typeOptions": {
                "loadOptionsDependsOn": [
                  "&keyName"
                ],
                "loadOptionsMethod": "getConditionsForColumn"
              },
              "default": "eq"
            },
            {
              "displayName": "Value",
              "name": "keyValue",
              "type": "string",
              "default": "",
              "displayOptions": {
                "hide": {
                  "condition": [
                    "isEmpty",
                    "isNotEmpty",
                    "isTrue",
                    "isFalse"
                  ]
                }
              }
            }
          ]
        }
      ],
      "description": "Filter to decide which rows get"
    },
    {
      "displayName": "Columns",
      "name": "columns",
      "type": "resourceMapper",
      "default": {
        "mappingMode": "defineBelow",
        "value": null
      },
      "noDataExpression": true,
      "required": true,
      "typeOptions": {
        "loadOptionsDependsOn": [
          "dataTableId.value"
        ],
        "resourceMapper": {
          "valuesLabel": "Values to upsert",
          "resourceMapperMethod": "getDataTables",
          "mode": "add",
          "fieldWords": {
            "singular": "column",
            "plural": "columns"
          },
          "addAllFields": true,
          "multiKeyMatch": true,
          "hideNoDataError": true
        }
      },
      "displayOptions": {
        "show": {
          "resource": [
            "row"
          ],
          "operation": [
            "upsert"
          ]
        }
      }
    },
    {
      "displayName": "Options",
      "name": "options",
      "type": "collection",
      "default": {},
      "placeholder": "Add option",
      "options": [
        {
          "displayName": "Dry Run",
          "name": "dryRun",
          "type": "boolean",
          "default": false,
          "description": "Whether the operation simulates and returns affected rows in their \"before\" and \"after\" states"
        }
      ],
      "displayOptions": {
        "show": {
          "resource": [
            "row"
          ],
          "operation": [
            "upsert"
          ]
        }
      }
    }
  ]
}
```
