# Querying The Node Catalog

Use these commands to answer workflow design questions quickly.

## Query CLI

```bash
python3 scripts/n8n/query_node_catalog.py --capability api-integration --limit 30
python3 scripts/n8n/query_node_catalog.py --group trigger
python3 scripts/n8n/query_node_catalog.py --credential slackApi --json
python3 scripts/n8n/query_node_catalog.py --use-case ai-content-workflow --limit 25
```

## List all capabilities

```bash
jq -r 'keys[]' docs/reference/indexes/nodes-by-capability.json
```

## Find candidate nodes for one capability

```bash
jq -r '."notifications-and-messaging"[]' docs/reference/indexes/nodes-by-capability.json
```

## Find all nodes that require a credential

```bash
jq -r '."googleSheetsOAuth2Api"[]' docs/reference/indexes/nodes-by-credential.json
```

## List all trigger nodes

```bash
jq -r '.[].name' docs/reference/indexes/trigger-nodes.json
```

## Find nodes supporting a specific resource operation

```bash
jq -r '.[] | select(.resource=="file" and .operation=="upload") | .node'   docs/reference/indexes/resource-operation-index.json
```

## Open full contract for one node

```bash
sed -n '1,220p' docs/reference/node-catalog/nodes/googleDrive.md
```
