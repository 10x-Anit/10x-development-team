# 10x Development Team

> Multi-agent AI plugin that builds complete apps from your vision. Works with **Claude Code**, **Claude Desktop**, **OpenAI Codex**, and any MCP-compatible AI client.

## 3 Ways to Use It

### 1. Claude Code (Direct Plugin)
```bash
git clone https://github.com/10x-Anit/10x-development-team.git
cp -r 10x-development-team/.claude /path/to/your/project/.claude
# Open Claude Code, type: /10x-development-team:start
```

### 2. MCP Server (Any AI Client)
```bash
npx @10x-dev/mcp-server setup    # auto-configures Claude Desktop + Claude Code
```

### 3. npm Package
```bash
npx @10x-dev/mcp-server install-plugin /path/to/project   # copy plugin files
```

## What It Does

You describe what you want. 7 specialist AI agents build it:

| Agent | Role |
|-------|------|
| **Team Lead** | Plans work, delegates, tracks progress |
| **Frontend Dev** | Pages, components, UI |
| **Backend Dev** | APIs, database, auth |
| **UI Designer** | Design system, colors, typography |
| **QA Tester** | Tests, quality checks |
| **Deployer** | CI/CD, Docker, hosting |
| **Error Recovery** | Fixes build errors |

## Quick Start

```
/10x-development-team:start
```

4 plain-English questions. No engineering jargon. Then it builds.

## Choose Your Scope

| Scope | What You Get | Tech |
|-------|-------------|------|
| **Simple** | Static pages, no build tools | HTML + CSS + JS |
| **Prototype** | Interactive demo with fake data | Vite + React + Tailwind |
| **MVP** | Working app with real data | Next.js + Prisma + Auth |
| **Production** | Full app, tested, deployed | Next.js + Tests + CI/CD + Docker |

## All Commands (19)

| Command | What It Does |
|---------|-------------|
| `:start` | Start a new project |
| `:build` | Full build from vision |
| `:add-page` | Add a page |
| `:add-feature` | Add a feature (frontend + backend) |
| `:connect-data` | Connect external data (API, Supabase, Firebase, CSV, etc.) |
| `:modify-ui` | Quick UI changes — layout, theme, dark mode |
| `:generate` | Generate component, API, hook, model, or test |
| `:fix` | Fix a bug |
| `:refactor` | Improve code quality |
| `:review` | Code quality review |
| `:explain` | Explain how something works |
| `:deploy` | Set up deployment |
| `:resume` | Continue where you left off |
| `:status` | Project dashboard |
| `:projects` | List/switch between all your projects |
| `:update-deps` | Update dependencies |
| `:config` | Change project settings |
| `:index` | View/rebuild file index |
| `:help` | Show all commands |

## What's Inside

```
 19 skills         — every user action covered
  7 agents         — full team + error recovery
 40 knowledge files — frameworks, libraries, patterns, copy-paste code
 50+ components    — web + mobile blueprints with registry
  8 templates      — project scaffolds for every scope
  1 MCP server     — 12 tools, 10 resources, 8 prompts
  1 SQLite DB      — persistent memory across all projects
```

### Knowledge Base (40 files)

Agents don't reinvent code. They copy from proven patterns:

| Category | Covers |
|----------|--------|
| **Frameworks** | Next.js, Vite+React, Expo, vanilla HTML/CSS/JS |
| **Libraries** | shadcn/ui, Tailwind, Framer Motion, Prisma, Zod, NextAuth, Stripe, Zustand, React Hook Form, Resend |
| **Patterns** | External APIs, data sources (Supabase/Firebase/Airtable/Sheets/Notion), file ingestion, file storage, realtime, rate limiting, monitoring, auth flows, dark mode, SEO |
| **Components** | Button, navbar, sidebar, cards, modals, tables, forms, auth pages — all copy-paste ready |

### MCP Server

The full plugin exposed as MCP tools for any AI client:

```bash
npx @10x-dev/mcp-server setup     # auto-configure
npx @10x-dev/mcp-server doctor    # health check
npx @10x-dev/mcp-server --help    # all commands
```

**12 tools** — project lifecycle, knowledge access, persistent memory
**10 resources** — knowledge files, component registry, project index, agent/skill instructions
**8 prompts** — agent roles, task-specific workflows

See [mcp-server/README.md](mcp-server/README.md) for full docs.

### Persistent Memory

Every project is tracked in `~/.10x/memory.db`:
- Switch between projects: `:projects`
- Resume any project: `:resume`
- Decisions and context remembered across sessions

### Model-Aware Execution

- **Small models** (Haiku/Sonnet): COPY code from knowledge base, change only names and content
- **Large models** (Opus): USE knowledge as a base, ENHANCE with animations, accessibility, dark mode, SEO

### Project Index System

Every project gets a `.10x/` directory:
- `project.json` — vision, scope, stack
- `file-index.json` — every file indexed (agents read this instead of scanning)
- `feature-map.json` — feature wiring (files, agents, data flow)
- `tasks.json` — task tracker with goals and status
- `dev-log.md` — complete build history

## Architecture

```
User (any AI client)
  |
  +-- Claude Code -----> .claude/ skills + agents (direct)
  |
  +-- Claude Desktop --> MCP Server (stdio) --> tools + resources + prompts
  |
  +-- Codex / Other ---> MCP Server (stdio) --> tools + resources + prompts
  |
  +-- All modes -------> ~/.10x/memory.db (persistent cross-project memory)
  |
  +-- All modes -------> .10x/ (per-project index, tasks, dev log)
```

## Built by

**[10x.in](https://10x-anit.github.io/10x-development-team)** — AI-powered development tools.

Developed by **Anit Chaudhry** — Product Manager & Developer at 10x.in

## License

MIT
