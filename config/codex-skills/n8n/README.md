<div align="center">
  <img src="https://raw.githubusercontent.com/n8n-io/n8n/master/assets/n8n-logo.png" alt="n8n Logo" width="120" />

  <h1>n8n-skill</h1>

  <p><strong>The Open Standard n8n Skill Knowledge Base for AI Agents</strong></p>

  <p>
    <a href="https://xlogix.github.io/n8n-skill/">
      <img src="https://img.shields.io/badge/Website-Live-brightgreen.svg?style=for-the-badge" alt="Website Live" />
    </a>
    <a href="https://agentskills.io/">
      <img src="https://img.shields.io/badge/AgentSkills-Compatible-blueviolet.svg?style=for-the-badge" alt="AgentSkills Compatible" />
    </a>
    <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="License MIT" />
  </p>
</div>

<br />

This repository is a **custom skill** designed specifically for AI Agents (like Codex, Antigravity, Cursor, Windsurf, ChatGPT, and Claude). It is built to strictly adhere to the [AgentSkills Open Format](https://agentskills.io) specification.

By giving your AI agent this skill, it learns exactly how to build, debug, and design [n8n](https://n8n.io) workflows perfectly.

<br />

## ✨ Why do you need this?
n8n has over 500+ built-in nodes. When you ask an AI to build a workflow, it usually guesses how the nodes work, which leads to broken code and frustration.

### The Solution
**n8n-skill** fixes this by giving the AI the actual instruction manual for every single n8n node. Instead of guessing, the AI reads the exact node requirements directly from this repository and builds the workflow exactly as you intended.

<br />

## 🚀 How to add this skill to your AI

I've made it effortless to make your AI an n8n expert.

### Step 0: Get the Instruction Manual
Before giving the skill to your AI, you need to save it to your computer:
1. Scroll to the top of this GitHub page and click the green **"<> Code"** button.
2. Click **"Download ZIP"**.
3. Find the ZIP file in your `Downloads` folder and double-click it to unzip it. You should now have a folder called `n8n-skill-main`.

<hr />

### 1. For IDEs (Cursor / Windsurf)

Open the `n8n-skill-main` folder you just unzipped. Inside, you will see a file named `.cursorrules`. Drag and drop that file directly into whatever project folder you are working in. That's it. The IDE will now automatically read the n8n knowledge base whenever you ask it to build something.

### 2. For Claude Desktop

You can configure your Claude Desktop app to use the `mcp-manifest.json` file inside the downloaded folder so it can natively read the n8n manual directly from your computer. If you unzipped the folder into your Downloads directory, your config path to the knowledge base will look like this: `/Users/your-username/Downloads/n8n-skill-main/knowledge`

### 3. For Autonomous Agents (Codex / Antigravity)

For autonomous coding agents like Codex, you provide them a text prompt that points them exactly to where you unzipped the folder:
> *"I want you to use the local `n8n-skill-main` folder in my Downloads directory as your main knowledge base. Read the `SKILL.md` file inside it to understand how to navigate the documentation, then read the node rules in `references/node-catalog/nodes/` before you write any code."*

<br />

## 📂 What is inside?

- `SKILL.md`: The official instruction manual teaching AI agents how to use this skill.
- `/references/`: The actual instruction manuals for how all the nodes work.
  - `/concepts/`: Basic n8n rules.
  - `/patterns/`: Common, reusable workflow designs.
  - `/node-catalog/`: The catalog of every single n8n node.
- `/assets/`: Supporting files, like `workflow-needs.json` mapping.
- `/docs/`: The source code for the landing page.

<br />

## 📄 License

MIT License. See `LICENSE` for details.
