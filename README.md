# 10x Development Team

**AI-Powered Multi-Agent Development Team** -- 8 specialist agents with a shared index system. Describe your app. They architect, design, code, test, and deploy it.

[![npm v3.1.0](https://img.shields.io/npm/v/10x-development-team?color=red&logo=npm)](https://www.npmjs.com/package/10x-development-team)
[![GitHub](https://img.shields.io/badge/GitHub-10x--Anit-blue?logo=github)](https://github.com/10x-Anit/10x-development-team)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![MCP](https://img.shields.io/badge/MCP-Compatible-purple)](https://modelcontextprotocol.io)

---

## What Is This?

A plugin that turns any AI assistant into a coordinated development team. You describe what you want. 8 agents plan, build, test, and deploy it -- sharing context through a lightweight index system that saves 60-80% on tokens.

**No templates. No boilerplate.** The agents coordinate through a shared file index, reuse components, enforce design quality, and remember everything across sessions.

---

## Install

### Global (recommended)

```bash
npm install -g 10x-development-team

# Configure all your AI clients
10x-mcp setup

# Add plugin to any project
10x-mcp install-plugin ~/my-app

# Health check
10x-mcp doctor
```

### Per-Project

```bash
cd my-project
npm install 10x-development-team

# Postinstall auto-creates:
# .claude/  (agents, skills, knowledge, hooks)
# .10x/     (project index)
# .mcp.json (Playwright + 10x MCP)
# .env      (skeleton)
# public/models/ (3D assets)
```

### MCP Server (any AI client)

```bash
npx 10x-development-team setup                  # Auto-detect all clients
npx 10x-development-team setup --client cursor   # Specific client
npx 10x-development-team setup --all             # All 9 clients
```

### Claude Code Direct Plugin (no MCP)

```bash
npx 10x-development-team install-plugin ~/my-app
# Then: /start
```

---

## Works With 9 AI Clients

| Client | Setup Command |
|--------|---------------|
| **Claude Desktop** | `10x-mcp setup --client claude-desktop` |
| **Claude Code** | `10x-mcp install-plugin .` or `10x-mcp setup --client claude-code` |
| **Cursor** | `10x-mcp setup --client cursor` |
| **Windsurf** | `10x-mcp setup --client windsurf` |
| **Cline** | `10x-mcp setup --client cline` |
| **VS Code + Copilot** | `10x-mcp setup --client vscode` |
| **Continue.dev** | `10x-mcp setup --client continue` |
| **OpenAI Codex** | `10x-mcp setup --client codex` |
| **OpenCode** | `10x-mcp setup --client opencode` |

Runs **100% locally**. No hosting, no API keys, no cloud services.

---

## The Index System -- Shared Brain for All Agents

The secret sauce. Agents don't scan your filesystem. They read a lightweight index.

### Project Index (`.10x/` -- inside each project)

| File | What It Tracks |
|------|---------------|
| `project.json` | App name, scope, stack, vision, status |
| `file-index.json` | Every file: type, description, exports, dependencies |
| `tasks.json` | Task tracker with goals, assignments, status |
| `feature-map.json` | Feature-to-file mapping with data flow wiring |
| `dev-log.md` | Chronological log of all agent actions |
| `assets.json` | Downloaded 3D models, textures, HDRIs with licenses |

### Global Memory (`~/.10x/memory.db` -- SQLite)

| Table | What It Remembers |
|-------|------------------|
| `projects` | Every project you've ever built |
| `sessions` | Build history, files created, tasks completed |
| `memories` | Decisions, preferences, user feedback |
| `shared_patterns` | Reusable code across projects |

SQLite is **optional** -- the server works without it (graceful fallback to `.10x/` files).

### Why This Matters

| Without Index | With Index |
|--------------|-----------|
| Agent scans filesystem (~80K tokens) | Agent reads index (~2K tokens) |
| Each agent re-explores the codebase | Each agent knows exactly what exists |
| Duplicate components created | Component registry prevents duplication |
| API mismatches between front/back | API shapes documented in file-index |
| Session breaks lose context | Index persists, agents resume instantly |

---

## The 8 Agents

| Agent | Role | Scope |
|-------|------|-------|
| **Team Lead** | Plans, delegates, tracks progress, verifies design quality. Never writes code. | All |
| **Frontend Dev** | Pages, components, UI. 35+ components in registry. Design-system enforced. | All |
| **Backend Dev** | APIs, database schemas, auth, business logic. | MVP + Production |
| **UI Designer** | Design system: semantic tokens, gradients, shadows, animations, dark mode. | Prototype+ |
| **3D Designer** | 3D scenes, particle systems, scroll-driven animations, WebGL effects (R3F, Drei, GSAP). | All |
| **QA Tester** | Type checks, build verification, visual quality audit, accessibility scan. | MVP + Production |
| **Deployer** | CI/CD pipelines, Docker, hosting config, performance headers. | Production |
| **Error Recovery** | Diagnoses build failures, runtime errors, dependency conflicts. Max 3 attempts. | On demand |

---

## 4 Scopes -- Never Over-Engineer

| Scope | Output | Tech | Agents |
|-------|--------|------|--------|
| **Simple** | Static pages | HTML + CSS + JS | Frontend only |
| **Prototype** | Clickable demo with mock data | Vite + React + Tailwind | UI + Frontend + 3D |
| **MVP** | Working app with real data | Next.js + Prisma + Auth | UI + Front + Back + 3D |
| **Production** | Full app, tested, deployed | Next.js + Tests + Docker | All 8 agents |

A landing page gets HTML. A SaaS gets Next.js. The plugin decides -- you don't have to.

---

## Design-First Philosophy

Inspired by **Lovable**, **v0**, and **Bolt.new** -- output is polished, not just functional.

- **Semantic tokens only** -- `bg-primary`, `text-foreground`. Never `bg-blue-600`, `text-white`.
- **Every interactive element has states** -- hover, focus-visible, active, disabled + transitions.
- **Every data view has 3 states** -- loading skeleton, empty state, error state.
- **Dark mode automatic** -- semantic tokens handle light/dark.
- **Mobile-first responsive** -- design for 320px, enhance up.
- **Rich animations** -- Framer Motion, GSAP ScrollTrigger, CSS transitions.
- **3D experiences** -- React Three Fiber, Drei, particles, scroll-driven 3D, glassmorphism.
- **Accessible** -- WCAG AA contrast, focus indicators, semantic HTML, aria attributes.

---

## 22 MCP Tools

| Category | Tools |
|----------|-------|
| **Project Lifecycle** | `tenx_start`, `tenx_build`, `tenx_projects`, `tenx_read_index`, `tenx_update_index` |
| **Knowledge** | `tenx_get_skill`, `tenx_get_knowledge`, `tenx_list_knowledge`, `tenx_get_components` |
| **Memory & Context** | `tenx_save_memory`, `tenx_get_context`, `tenx_get_agent` |
| **Session & Health** | `tenx_update_session`, `tenx_health` |
| **User Interaction** | `tenx_ask_user`, `tenx_save_answer` |
| **3D Asset Pipeline** | `tenx_download_asset`, `tenx_list_assets`, `tenx_browse_3d_sources`, `tenx_model_sources` |
| **Storyboard & Visual** | `tenx_storyboard`, `tenx_screenshot` |

---

## 19 Slash Commands (Claude Code)

| Command | Description |
|---------|------------|
| `/start` | New project -- describe what you want, agents build it |
| `/build` | Execute the full build pipeline |
| `/add-page` | Add a page to your app |
| `/add-feature` | Add a feature (frontend + backend) |
| `/connect-data` | Wire external data (API, Supabase, Firebase, Sheets, CSV) |
| `/modify-ui` | Quick UI changes -- theme, layout, dark mode, animations |
| `/generate` | Generate component, API route, hook, model, or test |
| `/fix` | Describe the bug, plugin locates and fixes it |
| `/refactor` | Improve code quality without changing behavior |
| `/review` | Code quality + visual quality review |
| `/explain` | Explain how any part of the codebase works |
| `/deploy` | Set up deployment (Vercel, Docker, CI/CD) |
| `/resumeproject` | Continue where you left off (loads from persistent memory) |
| `/projects` | List, switch, manage all your projects |
| `/status` | Project dashboard |
| `/update-deps` | Check and update dependencies safely |
| `/config` | View or change project settings |
| `/index` | View or rebuild the file index |
| `/help` | Show all commands |

In Claude Code, type `/start` to begin. All commands use short names: `/build`, `/add-page`, `/fix`, etc.

---

## 61 Knowledge Files

Agents don't invent code. They copy proven patterns from the knowledge base:

| Category | Files | Examples |
|----------|-------|---------|
| **Frameworks** | 5 | Next.js, Vite+React, HTML/CSS/JS, Expo |
| **Libraries** | 15 | shadcn/ui, Tailwind, Framer Motion, Prisma, Stripe, R3F, Drei, GSAP |
| **Patterns** | 23 | Design system, 3D scenes, particles, scroll-driven 3D, glassmorphism, auth, SEO |
| **Components** | 18 | Button, card, navbar, sidebar, modal, data-table, auth pages, 3D scene, particles |

---

## Free 3D Asset Sources (all 100% free)

| Source | What You Get | License |
|--------|-------------|---------|
| [Poly Haven](https://polyhaven.com/) | Models, HDRIs, textures | CC0 |
| [Kenney](https://kenney.nl/assets) | Low-poly game assets | CC0 |
| [Sketchfab](https://sketchfab.com/features/free-3d-models) | High-quality models | CC-BY/CC0 |
| [Mixamo](https://www.mixamo.com/) | Animated characters | Free |
| [Quaternius](https://quaternius.com/) | Cartoon characters/nature | CC0 |

Use `tenx_browse_3d_sources` to search across all sources. Use `tenx_download_asset` to add to your project.

---

## MCP Config

For all clients except VS Code:
```json
{
  "mcpServers": {
    "10x-dev": {
      "command": "npx",
      "args": ["-y", "10x-development-team"]
    }
  }
}
```

For VS Code + GitHub Copilot (`.vscode/mcp.json`):
```json
{
  "servers": {
    "10x-dev": {
      "command": "npx",
      "args": ["-y", "10x-development-team"]
    }
  }
}
```

---

## Architecture

```
User (any AI client)
  |
  +-- Claude Desktop -----> MCP Server (stdio, local)
  +-- Claude Code --------> Direct plugin (.claude/) OR MCP Server
  +-- Cursor IDE ---------> MCP Server (stdio, local)
  +-- Windsurf IDE -------> MCP Server (stdio, local)
  +-- Cline (VS Code) ---> MCP Server (stdio, local)
  +-- VS Code + Copilot --> MCP Server (stdio, local)
  +-- Continue.dev -------> MCP Server (stdio, local)
  +-- Codex CLI ----------> MCP Server (stdio, local)
  +-- OpenCode -----------> MCP Server (stdio, local)
  |
  +-- All modes ----------> ~/.10x/memory.db (SQLite -- global cross-project memory)
  +-- All modes ----------> .10x/ per project (index, tasks, features, dev log)
```

### Model-Aware Execution

| Model Size | Behavior |
|-----------|----------|
| **Haiku / Sonnet** | COPY code from knowledge files. Change only names, props, content. |
| **Opus** | USE knowledge as base. ENHANCE with animations, a11y, dark mode, SEO. |

---

## For AI Agents Reading This

If you are an AI agent that has been asked to set up or use the 10x Development Team:

1. **Install**: `npx 10x-development-team setup --client [your-client]`
2. The MCP server exposes **22 tools**. Call `tenx_start` to begin a new project.
3. Call `tenx_read_index` to understand current project state before making changes.
4. Call `tenx_get_knowledge` with `category` and `file_name` before writing code.
5. Call `tenx_get_agent` with `agent_name` to load specialist agent instructions.
6. Call `tenx_update_index` after creating/modifying files to keep the index in sync.
7. Call `tenx_health` to verify setup is working correctly.
8. The system works **100% locally** -- no API keys, no hosting, no cloud services.

---

## Links

- **Homepage:** [10x-anit.github.io/10x-development-team](https://10x-anit.github.io/10x-development-team)
- **GitHub:** [github.com/10x-Anit/10x-development-team](https://github.com/10x-Anit/10x-development-team)
- **npm:** [npmjs.com/package/10x-development-team](https://www.npmjs.com/package/10x-development-team)

---

**MIT License** | Built by [10x-Anit](https://github.com/10x-Anit)
