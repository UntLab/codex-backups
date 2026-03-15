#!/usr/bin/env python3
"""
n8n Prompt Manager — update AI node prompts without opening n8n UI.

Usage:
    python3 n8n_prompts.py list                     # list all AI nodes
    python3 n8n_prompts.py show <node_name>          # show current prompt
    python3 n8n_prompts.py update <node_name> <file> # update prompt from file
    python3 n8n_prompts.py pull                      # save all prompts to ./prompts/
    python3 n8n_prompts.py push                      # push all ./prompts/ back to n8n
    python3 n8n_prompts.py workflows                 # list all workflows
"""

import json
import os
import sys
import urllib.request
import urllib.error
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent
CONFIG_PATH = SCRIPT_DIR / "config.json"
PROMPTS_DIR = SCRIPT_DIR / "prompts"

AI_NODE_TYPES = [
    "openAi",
    "@n8n/n8n-nodes-langchain.openAi",
    "@n8n/n8n-nodes-langchain.lmChatOpenAi",
    "@n8n/n8n-nodes-langchain.chainLlm",
    "@n8n/n8n-nodes-langchain.agent",
    "@n8n/n8n-nodes-langchain.chainSummarization",
    "n8n-nodes-base.openAi",
]

PROMPT_FIELDS = [
    "text", "prompt", "messages", "systemMessage",
    "instructions", "content", "inputText",
]


def load_config():
    if not CONFIG_PATH.exists():
        print(f"ERROR: config.json not found at {CONFIG_PATH}")
        print("Copy config.json.example and fill in your values.")
        sys.exit(1)

    with open(CONFIG_PATH) as f:
        cfg = json.load(f)

    if cfg.get("n8n_api_key", "").startswith("YOUR_"):
        print("ERROR: Please set your actual n8n API key in config.json")
        print(f"  File: {CONFIG_PATH}")
        sys.exit(1)

    return cfg


def api_request(method, path, data=None):
    cfg = load_config()
    url = cfg["n8n_base_url"].rstrip("/") + "/api/v1" + path

    headers = {
        "Accept": "application/json",
        "X-N8N-API-KEY": cfg["n8n_api_key"],
    }

    body = None
    if data is not None:
        headers["Content-Type"] = "application/json"
        body = json.dumps(data).encode("utf-8")

    req = urllib.request.Request(url, data=body, headers=headers, method=method)

    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8") if e.fp else ""
        print(f"API Error {e.code}: {e.reason}")
        if error_body:
            print(f"  {error_body[:500]}")
        sys.exit(1)
    except urllib.error.URLError as e:
        print(f"Connection Error: {e.reason}")
        print(f"  Is n8n running at {cfg['n8n_base_url']}?")
        sys.exit(1)


def get_workflow():
    cfg = load_config()
    wf_id = cfg.get("workflow_id", "")
    if not wf_id or wf_id.startswith("YOUR_"):
        print("ERROR: Set workflow_id in config.json")
        print("  Run: python3 n8n_prompts.py workflows")
        sys.exit(1)
    return api_request("GET", f"/workflows/{wf_id}")


def save_workflow(workflow):
    cfg = load_config()
    wf_id = cfg["workflow_id"]
    return api_request("PUT", f"/workflows/{wf_id}", workflow)


def find_ai_nodes(workflow):
    """Find all AI/LLM nodes and their prompt fields."""
    nodes = workflow.get("nodes", [])
    ai_nodes = []

    for node in nodes:
        node_type = node.get("type", "")
        is_ai = any(ai_type in node_type for ai_type in AI_NODE_TYPES)

        found_prompts = {}
        params = node.get("parameters", {})
        _find_prompts_recursive(params, "", found_prompts)

        if is_ai or found_prompts:
            ai_nodes.append({
                "name": node.get("name", "unnamed"),
                "type": node_type,
                "prompts": found_prompts,
                "node_ref": node,
            })

    return ai_nodes


def _find_prompts_recursive(obj, prefix, results):
    if isinstance(obj, dict):
        for key, val in obj.items():
            full_key = f"{prefix}.{key}" if prefix else key
            if key in PROMPT_FIELDS and isinstance(val, str) and len(val) > 30:
                results[full_key] = val
            else:
                _find_prompts_recursive(val, full_key, results)
    elif isinstance(obj, list):
        for i, item in enumerate(obj):
            _find_prompts_recursive(item, f"{prefix}[{i}]", results)


def _set_nested(obj, path, value):
    """Set a value in a nested dict/list using dot.bracket notation."""
    parts = []
    for part in path.replace("[", ".[").split("."):
        if not part:
            continue
        if part.startswith("[") and part.endswith("]"):
            parts.append(int(part[1:-1]))
        else:
            parts.append(part)

    current = obj
    for p in parts[:-1]:
        current = current[p]
    current[parts[-1]] = value


def safe_filename(name):
    return name.replace(" ", "_").replace("/", "_").replace("\\", "_")


# ── Commands ──

def cmd_workflows():
    print("Fetching workflows...\n")
    result = api_request("GET", "/workflows")
    workflows = result.get("data", result) if isinstance(result, dict) else result

    if isinstance(workflows, dict) and "id" in workflows:
        workflows = [workflows]

    if not workflows:
        print("No workflows found.")
        return

    print(f"{'ID':<12} {'Active':<8} {'Name'}")
    print("-" * 60)
    for wf in workflows:
        wf_id = wf.get("id", "?")
        active = "YES" if wf.get("active") else "no"
        name = wf.get("name", "unnamed")
        print(f"{wf_id:<12} {active:<8} {name}")

    print(f"\nSet workflow_id in config.json to manage a workflow's prompts.")


def cmd_list():
    print("Fetching workflow...\n")
    wf = get_workflow()
    ai_nodes = find_ai_nodes(wf)

    if not ai_nodes:
        print("No AI nodes found in this workflow.")
        return

    print(f"Found {len(ai_nodes)} AI node(s) in '{wf.get('name', '?')}':\n")
    for node in ai_nodes:
        print(f"  Node: {node['name']}")
        print(f"  Type: {node['type']}")
        if node["prompts"]:
            for field, val in node["prompts"].items():
                preview = val[:80].replace("\n", " ") + ("..." if len(val) > 80 else "")
                print(f"    -> {field}: {preview}")
        else:
            print("    (no prompt fields detected)")
        print()


def cmd_show(node_name):
    wf = get_workflow()
    ai_nodes = find_ai_nodes(wf)

    for node in ai_nodes:
        if node["name"].lower() == node_name.lower():
            print(f"Node: {node['name']}")
            print(f"Type: {node['type']}\n")
            for field, val in node["prompts"].items():
                print(f"── {field} ──")
                print(val)
                print()
            return

    print(f"Node '{node_name}' not found. Available nodes:")
    for node in ai_nodes:
        print(f"  - {node['name']}")


def cmd_update(node_name, filepath):
    filepath = Path(filepath)
    if not filepath.exists():
        print(f"ERROR: File not found: {filepath}")
        sys.exit(1)

    new_prompt = filepath.read_text(encoding="utf-8")
    wf = get_workflow()
    ai_nodes = find_ai_nodes(wf)

    target = None
    for node in ai_nodes:
        if node["name"].lower() == node_name.lower():
            target = node
            break

    if not target:
        print(f"Node '{node_name}' not found. Available:")
        for n in ai_nodes:
            print(f"  - {n['name']}")
        sys.exit(1)

    if not target["prompts"]:
        print(f"No prompt fields found in node '{node_name}'.")
        sys.exit(1)

    prompt_keys = list(target["prompts"].keys())
    if len(prompt_keys) == 1:
        field = prompt_keys[0]
    else:
        print(f"Multiple prompt fields in '{node_name}':")
        for i, k in enumerate(prompt_keys):
            print(f"  [{i}] {k}")
        choice = input("Which field to update? [0]: ").strip()
        idx = int(choice) if choice else 0
        field = prompt_keys[idx]

    _set_nested(target["node_ref"]["parameters"], field, new_prompt)

    print(f"Updating '{node_name}' -> {field}...")
    save_workflow(wf)
    print("Done. Prompt updated in n8n.")


def cmd_pull():
    wf = get_workflow()
    ai_nodes = find_ai_nodes(wf)

    if not ai_nodes:
        print("No AI nodes found.")
        return

    PROMPTS_DIR.mkdir(exist_ok=True)

    count = 0
    for node in ai_nodes:
        for field, val in node["prompts"].items():
            fname = f"{safe_filename(node['name'])}__{safe_filename(field)}.txt"
            out = PROMPTS_DIR / fname
            out.write_text(val, encoding="utf-8")
            print(f"  Saved: {out.name}")
            count += 1

    print(f"\nPulled {count} prompt(s) to {PROMPTS_DIR}/")
    print("Edit the .txt files, then run: python3 n8n_prompts.py push")


def cmd_push():
    if not PROMPTS_DIR.exists():
        print(f"No prompts/ directory found. Run 'pull' first.")
        sys.exit(1)

    txt_files = list(PROMPTS_DIR.glob("*.txt"))
    if not txt_files:
        print("No .txt files in prompts/. Run 'pull' first.")
        sys.exit(1)

    wf = get_workflow()
    ai_nodes = find_ai_nodes(wf)
    node_map = {safe_filename(n["name"]): n for n in ai_nodes}

    updated = 0
    for txt in txt_files:
        parts = txt.stem.split("__", 1)
        if len(parts) != 2:
            print(f"  Skipping {txt.name} (unexpected filename format)")
            continue

        node_key, field_key = parts
        field_key = field_key.replace("_", ".")

        node = node_map.get(node_key)
        if not node:
            for nk, nv in node_map.items():
                if node_key.lower() in nk.lower():
                    node = nv
                    break

        if not node:
            print(f"  Skipping {txt.name} — node not found in workflow")
            continue

        matched_field = None
        for f in node["prompts"]:
            if safe_filename(f) == parts[1] or f == field_key:
                matched_field = f
                break

        if not matched_field:
            first_field = list(node["prompts"].keys())[0] if node["prompts"] else None
            if first_field:
                matched_field = first_field
            else:
                print(f"  Skipping {txt.name} — field not matched")
                continue

        new_val = txt.read_text(encoding="utf-8")
        old_val = node["prompts"].get(matched_field, "")

        if new_val.strip() == old_val.strip():
            print(f"  Unchanged: {node['name']} -> {matched_field}")
            continue

        _set_nested(node["node_ref"]["parameters"], matched_field, new_val)
        print(f"  Updated: {node['name']} -> {matched_field}")
        updated += 1

    if updated > 0:
        save_workflow(wf)
        print(f"\nPushed {updated} prompt(s) to n8n.")
    else:
        print("\nNo changes detected.")


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(0)

    cmd = sys.argv[1].lower()

    if cmd == "workflows":
        cmd_workflows()
    elif cmd == "list":
        cmd_list()
    elif cmd == "show":
        if len(sys.argv) < 3:
            print("Usage: python3 n8n_prompts.py show <node_name>")
            sys.exit(1)
        cmd_show(" ".join(sys.argv[2:]))
    elif cmd == "update":
        if len(sys.argv) < 4:
            print("Usage: python3 n8n_prompts.py update <node_name> <file.txt>")
            sys.exit(1)
        cmd_update(" ".join(sys.argv[2:-1]), sys.argv[-1])
    elif cmd == "pull":
        cmd_pull()
    elif cmd == "push":
        cmd_push()
    else:
        print(f"Unknown command: {cmd}")
        print(__doc__)
        sys.exit(1)


if __name__ == "__main__":
    main()
