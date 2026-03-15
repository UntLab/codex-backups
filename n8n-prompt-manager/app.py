#!/usr/bin/env python3
"""
n8n Prompt Manager — Web GUI (zero dependencies, pure Python 3)
Opens in your default browser. Works on any OS.
"""

import json
import os
import sys
import webbrowser
import urllib.request
import urllib.error
import threading
from http.server import HTTPServer, BaseHTTPRequestHandler
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent
CONFIG_PATH = SCRIPT_DIR / "config.json"
PORT = 9184

AI_NODE_TYPES = [
    "openAi", "@n8n/n8n-nodes-langchain.openAi",
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
        return {"n8n_base_url": "http://localhost:5678", "n8n_api_key": "", "workflow_id": "", "google_docs": []}
    with open(CONFIG_PATH) as f:
        cfg = json.load(f)
    if "google_docs" not in cfg:
        cfg["google_docs"] = []
    return cfg


def save_config_file(cfg):
    with open(CONFIG_PATH, "w") as f:
        json.dump(cfg, f, indent=2)


def n8n_api(cfg, method, path, data=None):
    base = cfg["n8n_base_url"].rstrip("/")
    if base.startswith("http://") and "localhost" not in base and "127.0.0.1" not in base:
        base = base.replace("http://", "https://", 1)
    url = base + "/api/v1" + path
    headers = {"Accept": "application/json", "X-N8N-API-KEY": cfg["n8n_api_key"]}
    body = None
    if data is not None:
        headers["Content-Type"] = "application/json"
        body = json.dumps(data).encode("utf-8")

    for _ in range(3):
        req = urllib.request.Request(url, data=body, headers=headers, method=method)
        try:
            with urllib.request.urlopen(req, timeout=15) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            if e.code in (301, 302, 307, 308):
                new_url = e.headers.get("Location", "")
                if new_url:
                    url = new_url
                    continue
            raise
    raise Exception("Too many redirects")


def find_prompts_recursive(obj, prefix, results):
    if isinstance(obj, dict):
        for key, val in obj.items():
            full_key = f"{prefix}.{key}" if prefix else key
            if key in PROMPT_FIELDS and isinstance(val, str) and len(val) > 20:
                results[full_key] = val
            else:
                find_prompts_recursive(val, full_key, results)
    elif isinstance(obj, list):
        for i, item in enumerate(obj):
            find_prompts_recursive(item, f"{prefix}[{i}]", results)


def set_nested(obj, path, value):
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


def find_ai_nodes(workflow):
    nodes = workflow.get("nodes", [])
    result = []
    for node in nodes:
        node_type = node.get("type", "")
        is_ai = any(t in node_type for t in AI_NODE_TYPES)
        found = {}
        find_prompts_recursive(node.get("parameters", {}), "", found)
        if is_ai or found:
            result.append({
                "name": node.get("name", "unnamed"),
                "type": node_type,
                "prompts": found,
                "node_ref": node,
            })
    return result


# ── Global state ──
g_workflow = None
g_ai_nodes = []

HTML_PAGE = r"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>n8n Prompt Manager</title>
<style>
  :root {
    --bg: #0f1117; --bg2: #1a1d27; --bg3: #232733;
    --border: #2d3140; --text: #e1e4ed; --text2: #8b90a0;
    --accent: #3b82f6; --accent2: #2563eb;
    --green: #22c55e; --green2: #16a34a;
    --red: #ef4444; --yellow: #eab308;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    background: var(--bg); color: var(--text); height: 100vh; display: flex; flex-direction: column; }

  /* ── Top bar ── */
  .topbar { background: var(--bg2); border-bottom: 1px solid var(--border);
    padding: 12px 20px; display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
  .topbar h1 { font-size: 17px; font-weight: 700; flex: 1; }
  .topbar .status { font-size: 13px; color: var(--text2); margin-right: 8px; }
  .topbar .status.ok { color: var(--green); }
  .topbar .status.err { color: var(--red); }

  button { background: var(--bg3); color: var(--text); border: 1px solid var(--border);
    padding: 7px 16px; border-radius: 8px; font-size: 13px; cursor: pointer;
    transition: all .15s; font-family: inherit; }
  button:hover { background: var(--border); }
  button.primary { background: var(--accent); border-color: var(--accent); }
  button.primary:hover { background: var(--accent2); }
  button.green { background: var(--green2); border-color: var(--green2); font-weight: 600; }
  button.green:hover { background: var(--green); }

  /* ── Main layout ── */
  .main { display: flex; flex: 1; overflow: hidden; }

  /* ── Sidebar ── */
  .sidebar { width: 280px; min-width: 280px; background: var(--bg2); border-right: 1px solid var(--border);
    display: flex; flex-direction: column; }
  .sidebar h2 { font-size: 13px; color: var(--text2); text-transform: uppercase;
    letter-spacing: 1px; padding: 16px 16px 8px; }
  .node-list { flex: 1; overflow-y: auto; padding: 0 8px 8px; }
  .node-btn { display: block; width: 100%; text-align: left; padding: 12px 14px;
    margin-bottom: 4px; border-radius: 8px; border: 1px solid transparent;
    background: transparent; color: var(--text); cursor: pointer; transition: all .15s; }
  .node-btn:hover { background: var(--bg3); }
  .node-btn.active { background: var(--accent); border-color: var(--accent); }
  .node-btn .name { font-size: 14px; font-weight: 600; display: block; }
  .node-btn .meta { font-size: 12px; color: var(--text2); margin-top: 2px; }
  .node-btn.active .meta { color: rgba(255,255,255,.7); }

  /* ── Editor panel ── */
  .editor-panel { flex: 1; display: flex; flex-direction: column; padding: 16px; gap: 12px; }
  .editor-header { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
  .editor-header h2 { font-size: 16px; flex: 1; }
  .editor-header select { background: var(--bg3); color: var(--text); border: 1px solid var(--border);
    padding: 6px 12px; border-radius: 8px; font-size: 13px; font-family: inherit; }

  .editor-wrap { flex: 1; position: relative; }
  textarea { width: 100%; height: 100%; background: var(--bg2); color: var(--text);
    border: 1px solid var(--border); border-radius: 10px; padding: 16px;
    font-family: 'SF Mono', 'Fira Code', 'Menlo', monospace; font-size: 13px;
    line-height: 1.6; resize: none; outline: none; transition: border-color .2s; }
  textarea:focus { border-color: var(--accent); }

  .editor-footer { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
  .editor-footer .info { flex: 1; font-size: 12px; color: var(--text2); }

  /* ── Settings modal ── */
  .modal-bg { position: fixed; inset: 0; background: rgba(0,0,0,.6); display: none;
    align-items: center; justify-content: center; z-index: 100; }
  .modal-bg.open { display: flex; }
  .modal { background: var(--bg2); border: 1px solid var(--border); border-radius: 16px;
    padding: 28px; width: 480px; max-width: 90vw; }
  .modal h2 { font-size: 18px; margin-bottom: 20px; }
  .modal label { display: block; font-size: 13px; color: var(--text2); margin-bottom: 4px; margin-top: 14px; }
  .modal input { width: 100%; background: var(--bg3); color: var(--text); border: 1px solid var(--border);
    padding: 10px 14px; border-radius: 8px; font-size: 14px; font-family: inherit; outline: none; }
  .modal input:focus { border-color: var(--accent); }
  .modal .actions { margin-top: 24px; display: flex; justify-content: flex-end; gap: 10px; }

  .empty-state { display: flex; align-items: center; justify-content: center;
    flex: 1; color: var(--text2); font-size: 15px; }

  /* ── Google Docs section ── */
  .docs-section { border-top: 1px solid var(--border); padding-top: 4px; flex-shrink: 0; }
  .docs-header { display: flex; align-items: center; padding: 8px 16px 4px; }
  .docs-header h2 { flex: 1; font-size: 13px; color: var(--text2); text-transform: uppercase; letter-spacing: 1px; }
  .docs-header button { padding: 2px 10px; font-size: 18px; line-height: 1; border: none; background: transparent;
    color: var(--text2); cursor: pointer; }
  .docs-header button:hover { color: var(--text); background: transparent; }
  .docs-list { padding: 0 8px 12px; max-height: 200px; overflow-y: auto; }
  .doc-item { display: flex; align-items: center; gap: 8px; padding: 8px 10px;
    border-radius: 8px; cursor: pointer; transition: all .15s; }
  .doc-item:hover { background: var(--bg3); }
  .doc-item .doc-icon { font-size: 18px; flex-shrink: 0; width: 24px; text-align: center; }
  .doc-item .doc-info { flex: 1; min-width: 0; }
  .doc-item .doc-name { font-size: 13px; font-weight: 600; white-space: nowrap;
    overflow: hidden; text-overflow: ellipsis; display: block; }
  .doc-item .doc-url { font-size: 11px; color: var(--text2); white-space: nowrap;
    overflow: hidden; text-overflow: ellipsis; display: block; }
  .doc-item .doc-del { padding: 2px 6px; font-size: 11px; border: none; background: transparent;
    color: var(--text2); cursor: pointer; opacity: 0; transition: opacity .15s; flex-shrink: 0; }
  .doc-item:hover .doc-del { opacity: 1; }
  .doc-item .doc-del:hover { color: var(--red); background: transparent; }

  /* ── Add doc modal ── */
  .modal.wide { width: 520px; }
  .modal .row { display: flex; gap: 10px; }
  .modal .row input:first-child { width: 35%; }
  .modal .row input:last-child { width: 65%; }

  @media (max-width: 700px) {
    .sidebar { width: 200px; min-width: 200px; }
  }
</style>
</head>
<body>

<div class="topbar">
  <h1>n8n Prompt Manager</h1>
  <span class="status" id="status">Not connected</span>
  <button onclick="connect()">Refresh</button>
  <button onclick="openSettings()">Settings</button>
</div>

<div class="main">
  <div class="sidebar">
    <h2>AI Nodes</h2>
    <div class="node-list" id="nodeList">
      <div class="empty-state" style="padding:40px 16px;font-size:13px;text-align:center">
        Click <b>Settings</b> to configure your n8n connection, then <b>Refresh</b>
      </div>
    </div>
    <div class="docs-section">
      <div class="docs-header">
        <h2>Google Docs</h2>
        <button onclick="openAddDoc()" title="Add document">+</button>
      </div>
      <div class="docs-list" id="docsList"></div>
    </div>
  </div>

  <div class="editor-panel" id="editorPanel">
    <div class="editor-header">
      <h2 id="editorTitle">Select a node to edit</h2>
      <select id="fieldSelect" onchange="onFieldChange()" style="display:none"></select>
    </div>
    <div class="editor-wrap">
      <textarea id="editor" placeholder="Select an AI node from the sidebar..." disabled></textarea>
    </div>
    <div class="editor-footer">
      <span class="info" id="charInfo"></span>
      <button onclick="revertPrompt()">Revert</button>
      <button class="green" onclick="pushPrompt()" id="pushBtn" disabled>Push to n8n</button>
    </div>
  </div>
</div>

<!-- Settings modal -->
<div class="modal-bg" id="settingsModal">
  <div class="modal">
    <h2>n8n Connection Settings</h2>
    <label>n8n Base URL</label>
    <input id="cfgUrl" placeholder="https://your-name.app.n8n.cloud">
    <label>API Key</label>
    <input id="cfgKey" type="password" placeholder="n8n_api_...">
    <label>Workflow ID</label>
    <input id="cfgWfId" placeholder="abc123xyz">
    <div class="actions">
      <button onclick="closeSettings()">Cancel</button>
      <button class="primary" onclick="saveSettings()">Save & Connect</button>
    </div>
  </div>
</div>

<!-- Add Doc modal -->
<div class="modal-bg" id="addDocModal">
  <div class="modal wide">
    <h2>Add Google Document</h2>
    <label>Document name</label>
    <input id="docName" placeholder="e.g. LinkedIn Prompts, Content Plan...">
    <label>Google Docs URL</label>
    <input id="docUrl" placeholder="https://docs.google.com/document/d/...">
    <div class="actions">
      <button onclick="closeAddDoc()">Cancel</button>
      <button class="primary" onclick="saveDoc()">Add</button>
    </div>
  </div>
</div>

<script>
let nodes = [];
let currentIdx = -1;
let currentField = '';
let originalText = '';

const $ = id => document.getElementById(id);

function setStatus(text, level) {
  const el = $('status');
  el.textContent = text;
  el.className = 'status' + (level === 'ok' ? ' ok' : level === 'err' ? ' err' : '');
}

async function api(path, method, body) {
  const opts = { method: method || 'GET', headers: {'Content-Type':'application/json'} };
  if (body) opts.body = JSON.stringify(body);
  const r = await fetch('/api' + path, opts);
  return r.json();
}

async function connect() {
  setStatus('Connecting...', '');
  try {
    const res = await api('/connect');
    if (res.error) { setStatus(res.error, 'err'); return; }
    nodes = res.nodes;
    setStatus(res.workflow + ' — ' + nodes.length + ' node(s)', 'ok');
    renderNodes();
  } catch(e) { setStatus('Connection failed', 'err'); }
}

function renderNodes() {
  const list = $('nodeList');
  list.innerHTML = '';
  nodes.forEach((n, i) => {
    const btn = document.createElement('button');
    btn.className = 'node-btn' + (i === currentIdx ? ' active' : '');
    btn.innerHTML = '<span class="name">' + esc(n.name) + '</span><span class="meta">' +
      Object.keys(n.prompts).length + ' prompt field(s)</span>';
    btn.onclick = () => selectNode(i);
    list.appendChild(btn);
  });
}

function selectNode(i) {
  currentIdx = i;
  renderNodes();
  const node = nodes[i];
  $('editorTitle').textContent = node.name;
  const sel = $('fieldSelect');
  const fields = Object.keys(node.prompts);
  sel.innerHTML = '';
  fields.forEach(f => { const o = document.createElement('option'); o.value = f; o.textContent = f; sel.appendChild(o); });
  sel.style.display = fields.length > 1 ? '' : 'none';
  if (fields.length) { currentField = fields[0]; loadPrompt(); }
}

function onFieldChange() {
  currentField = $('fieldSelect').value;
  loadPrompt();
}

function loadPrompt() {
  const text = nodes[currentIdx].prompts[currentField] || '';
  $('editor').value = text;
  $('editor').disabled = false;
  $('pushBtn').disabled = false;
  originalText = text;
  updateInfo();
}

function revertPrompt() {
  if (currentIdx < 0) return;
  $('editor').value = originalText;
  updateInfo();
}

async function pushPrompt() {
  if (currentIdx < 0) return;
  const text = $('editor').value;
  setStatus('Pushing...', '');
  $('pushBtn').disabled = true;
  try {
    const res = await api('/push', 'POST', { nodeIdx: currentIdx, field: currentField, text: text });
    if (res.error) { setStatus('Push failed: ' + res.error, 'err'); }
    else if (res.warning) {
      setStatus('⚠ ' + res.warning, 'err');
    } else {
      nodes[currentIdx].prompts[currentField] = text;
      originalText = text;
      setStatus('Pushed & verified in n8n ✓', 'ok');
    }
  } catch(e) { setStatus('Push failed', 'err'); }
  $('pushBtn').disabled = false;
}

$('editor').addEventListener('input', updateInfo);
function updateInfo() {
  const t = $('editor').value;
  const lines = t.split('\n').length;
  const chars = t.length;
  const changed = t !== originalText;
  $('charInfo').textContent = chars.toLocaleString() + ' chars  |  ' + lines + ' lines' + (changed ? '  |  modified' : '');
}

function openSettings() {
  api('/config').then(r => {
    $('cfgUrl').value = r.n8n_base_url || '';
    $('cfgKey').value = r.n8n_api_key || '';
    $('cfgWfId').value = r.workflow_id || '';
  });
  $('settingsModal').classList.add('open');
}
function closeSettings() { $('settingsModal').classList.remove('open'); }
function saveSettings() {
  api('/config', 'POST', {
    n8n_base_url: $('cfgUrl').value, n8n_api_key: $('cfgKey').value, workflow_id: $('cfgWfId').value
  }).then(() => { closeSettings(); connect(); });
}

function esc(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

// ── Google Docs ──
let docs = [];

async function loadDocs() {
  const cfg = await api('/config');
  docs = cfg.google_docs || [];
  renderDocs();
}

function renderDocs() {
  const list = $('docsList');
  list.innerHTML = '';
  if (!docs.length) {
    list.innerHTML = '<div style="padding:8px 14px;font-size:12px;color:var(--text2)">Click + to add a document</div>';
    return;
  }
  docs.forEach((d, i) => {
    const item = document.createElement('div');
    item.className = 'doc-item';
    item.innerHTML =
      '<span class="doc-icon">&#128196;</span>' +
      '<div class="doc-info" onclick="openDoc(' + i + ')">' +
        '<span class="doc-name">' + esc(d.name) + '</span>' +
        '<span class="doc-url">' + esc(d.url.substring(0, 50)) + '...</span>' +
      '</div>' +
      '<button class="doc-del" onclick="deleteDoc(' + i + ')" title="Remove">&times;</button>';
    list.appendChild(item);
  });
}

function openDoc(i) { window.open(docs[i].url, '_blank'); }

function openAddDoc() {
  $('docName').value = '';
  $('docUrl').value = '';
  $('addDocModal').classList.add('open');
  $('docName').focus();
}
function closeAddDoc() { $('addDocModal').classList.remove('open'); }

async function saveDoc() {
  const name = $('docName').value.trim();
  const url = $('docUrl').value.trim();
  if (!name || !url) { alert('Please fill in both fields'); return; }
  docs.push({ name, url });
  await api('/docs', 'POST', docs);
  closeAddDoc();
  renderDocs();
}

async function deleteDoc(i) {
  if (!confirm('Remove "' + docs[i].name + '"?')) return;
  docs.splice(i, 1);
  await api('/docs', 'POST', docs);
  renderDocs();
}

// Auto-connect on load
setTimeout(() => { connect(); loadDocs(); }, 300);
</script>
</body>
</html>"""


class Handler(BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        pass

    def _json(self, data, code=200):
        body = json.dumps(data).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", len(body))
        self.end_headers()
        self.wfile.write(body)

    def _html(self, html):
        body = html.encode()
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", len(body))
        self.end_headers()
        self.wfile.write(body)

    def _read_body(self):
        length = int(self.headers.get("Content-Length", 0))
        return json.loads(self.rfile.read(length)) if length else {}

    def do_GET(self):
        global g_workflow, g_ai_nodes

        if self.path == "/":
            self._html(HTML_PAGE)

        elif self.path == "/api/config":
            self._json(load_config())

        elif self.path == "/api/connect":
            try:
                cfg = load_config()
                if not cfg.get("n8n_api_key") or cfg["n8n_api_key"].startswith("YOUR_"):
                    self._json({"error": "Set API key in Settings"})
                    return
                wf_id = cfg.get("workflow_id", "")
                if not wf_id or wf_id.startswith("YOUR_"):
                    self._json({"error": "Set Workflow ID in Settings"})
                    return
                g_workflow = n8n_api(cfg, "GET", f"/workflows/{wf_id}")
                g_ai_nodes = find_ai_nodes(g_workflow)
                nodes_data = [{"name": n["name"], "type": n["type"], "prompts": n["prompts"]} for n in g_ai_nodes]
                self._json({"workflow": g_workflow.get("name", "?"), "nodes": nodes_data})
            except urllib.error.HTTPError as e:
                if e.code == 401 or e.code == 403:
                    self._json({"error": "Auth failed — check API Key"})
                elif e.code == 404:
                    self._json({"error": "Workflow not found — check ID"})
                else:
                    self._json({"error": f"n8n error {e.code}"})
            except Exception as e:
                self._json({"error": str(e)[:100]})
        else:
            self.send_error(404)

    def do_POST(self):
        global g_workflow, g_ai_nodes

        if self.path == "/api/config":
            new_cfg = self._read_body()
            existing = load_config()
            existing["n8n_base_url"] = new_cfg.get("n8n_base_url", existing.get("n8n_base_url", ""))
            existing["n8n_api_key"] = new_cfg.get("n8n_api_key", existing.get("n8n_api_key", ""))
            existing["workflow_id"] = new_cfg.get("workflow_id", existing.get("workflow_id", ""))
            save_config_file(existing)
            self._json({"ok": True})

        elif self.path == "/api/docs":
            try:
                docs = self._read_body()
                cfg = load_config()
                cfg["google_docs"] = docs
                save_config_file(cfg)
                self._json({"ok": True})
            except Exception as e:
                self._json({"error": str(e)[:100]})

        elif self.path == "/api/push":
            try:
                body = self._read_body()
                idx = body["nodeIdx"]
                field = body["field"]
                text = body["text"]

                node = g_ai_nodes[idx]
                set_nested(node["node_ref"]["parameters"], field, text)

                cfg = load_config()
                wf_id = cfg["workflow_id"]

                fresh_wf = n8n_api(cfg, "GET", f"/workflows/{wf_id}")

                for fresh_node in fresh_wf.get("nodes", []):
                    if fresh_node.get("name") == node["name"]:
                        set_nested(fresh_node.get("parameters", {}), field, text)
                        break

                ALLOWED_SETTINGS = {
                    "saveManualExecutions", "callerPolicy", "errorWorkflow",
                    "timezone", "executionOrder", "saveExecutionProgress",
                    "executionTimeout",
                }
                raw_settings = fresh_wf.get("settings", {})
                clean_settings = {k: v for k, v in raw_settings.items() if k in ALLOWED_SETTINGS}

                clean_wf = {"name": fresh_wf["name"],
                            "nodes": fresh_wf["nodes"],
                            "connections": fresh_wf["connections"],
                            "settings": clean_settings}
                if fresh_wf.get("versionId"):
                    clean_wf["versionId"] = fresh_wf["versionId"]

                result = n8n_api(cfg, "PUT", f"/workflows/{wf_id}", clean_wf)

                was_active = fresh_wf.get("active", False)
                if was_active:
                    try:
                        n8n_api(cfg, "POST", f"/workflows/{wf_id}/deactivate")
                        n8n_api(cfg, "POST", f"/workflows/{wf_id}/activate")
                    except Exception:
                        pass

                g_workflow = n8n_api(cfg, "GET", f"/workflows/{wf_id}")
                g_ai_nodes = find_ai_nodes(g_workflow)

                verify_node = next((n for n in g_ai_nodes if n["name"] == node["name"]), None)
                if verify_node and verify_node["prompts"].get(field) == text:
                    self._json({"ok": True, "verified": True})
                else:
                    self._json({"ok": True, "verified": False,
                                "warning": "Push sent but change not confirmed in n8n"})
            except urllib.error.HTTPError as e:
                err_body = ""
                try:
                    err_body = e.read().decode("utf-8")[:200]
                except Exception:
                    pass
                msg = f"n8n error {e.code}"
                if err_body:
                    try:
                        detail = json.loads(err_body).get("message", err_body)
                        msg = f"{e.code}: {detail}"
                    except Exception:
                        msg = f"{e.code}: {err_body[:150]}"
                self._json({"error": msg})
            except Exception as e:
                self._json({"error": str(e)[:150]})
        else:
            self.send_error(404)


def kill_old_process():
    """Kill any previous instance using our port."""
    import subprocess
    try:
        result = subprocess.run(["lsof", "-ti", f":{PORT}"], capture_output=True, text=True, timeout=3)
        pids = result.stdout.strip().split()
        for pid in pids:
            if pid:
                subprocess.run(["kill", "-9", pid], capture_output=True, timeout=3)
        if pids and pids[0]:
            import time
            time.sleep(0.5)
    except Exception:
        pass


def main():
    kill_old_process()

    try:
        server = HTTPServer(("127.0.0.1", PORT), Handler)
    except OSError:
        import time
        kill_old_process()
        time.sleep(1)
        server = HTTPServer(("127.0.0.1", PORT), Handler)

    url = f"http://127.0.0.1:{PORT}"
    print(f"n8n Prompt Manager running at {url}")
    print("Press Ctrl+C to stop.\n")

    threading.Timer(0.5, lambda: webbrowser.open(url)).start()

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")
        server.server_close()


if __name__ == "__main__":
    main()
