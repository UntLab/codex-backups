# n8n Prompt Manager

Update AI node prompts in your n8n workflows from the terminal — no need to open the n8n UI.

## Setup

### 1. Get your n8n API key

- Open n8n → Settings → API → Create API Key
- Copy the key

### 2. Configure

Edit `config.json`:

```json
{
  "n8n_base_url": "http://localhost:5678",
  "n8n_api_key": "your-actual-api-key",
  "workflow_id": "your-workflow-id"
}
```

- `n8n_base_url` — your n8n instance URL (use `https://your-instance.app.n8n.cloud` for n8n Cloud)
- `n8n_api_key` — the API key from step 1
- `workflow_id` — set after running `workflows` command below

### 3. No dependencies needed

Uses only Python 3 standard library. No `pip install` required.

## Commands

### List all workflows (to find your workflow ID)

```bash
python3 n8n_prompts.py workflows
```

### List AI nodes in your workflow

```bash
python3 n8n_prompts.py list
```

### Show a node's current prompt

```bash
python3 n8n_prompts.py show "OpenAI Chat"
```

### Pull all prompts to local files

```bash
python3 n8n_prompts.py pull
```

This saves each prompt as a `.txt` file in the `prompts/` folder.

### Edit prompts locally, then push back

```bash
# Edit any .txt file in prompts/ with your editor
nano prompts/OpenAI_Chat__text.txt

# Push changes back to n8n
python3 n8n_prompts.py push
```

### Update a single node from a file

```bash
python3 n8n_prompts.py update "OpenAI Chat" my_new_prompt.txt
```

## Typical Workflow

```bash
# 1. Find your workflow
python3 n8n_prompts.py workflows

# 2. Set workflow_id in config.json

# 3. Pull all current prompts
python3 n8n_prompts.py pull

# 4. Edit the .txt files in prompts/

# 5. Push changes back
python3 n8n_prompts.py push
```

## File Structure

```
n8n-prompt-manager/
├── config.json              # your n8n connection settings
├── n8n_prompts.py           # the CLI tool
├── prompts/                 # auto-created by "pull" command
│   ├── NodeName__field.txt  # one file per prompt field
│   └── ...
└── README.md
```
