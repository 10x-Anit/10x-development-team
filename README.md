# 10x Development Team

**Gen UI Skills Plugin** — Describe your app in plain English. 7 specialist AI agents build it. Works with any AI client.

[![GitHub](https://img.shields.io/badge/GitHub-10x--Anit-blue?logo=github)](https://github.com/10x-Anit/10x-development-team)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![MCP](https://img.shields.io/badge/MCP-Compatible-purple)](https://modelcontextprotocol.io)

---

## What Is This?

A plugin that turns any AI assistant into a full development team. You describe what you want. The plugin's 7 agents plan, build, test, and deploy it.

**No templates. No boilerplate. No "here's some code, figure it out."** The agents coordinate, track files, reuse components, and remember everything across sessions.

---

## Works With Any AI Client

| Client | How | Status |
|--------|-----|--------|
| **Claude Desktop** | MCP Server (auto-configured) | Ready |
| **Claude Code** | Direct plugin OR MCP Server | Ready |
| **OpenAI Codex** | MCP Server (auto-configured) | Ready |
| **OpenCode** | MCP Server (auto-configured) | Ready |
| **Any MCP Client** | MCP Server (stdio transport) | Ready |

```bash
# One command sets up everything
npx @10x-dev/mcp-server setup
```

---

## Quick Start

### Option A: MCP Server (recommended for Claude Desktop, Codex, OpenCode)
```bash
npx @10x-dev/mcp-server setup          # auto-detects your AI clients
npx @10x-dev/mcp-server doctor         # verify everything works
```
Open your AI client. Say: **"Start a new project — I want an invoice app for freelancers."**

### Option B: Claude Code Plugin (direct slash commands)
```bash
npx @10x-dev/mcp-server install-plugin /path/to/your/project
cd /path/to/your/project
```
In Claude Code, type: `/10x-development-team:start`

### Option C: Clone the repo
```bash
git clone https://github.com/10x-Anit/10x-development-team.git
cp -r 10x-development-team/.claude /path/to/your/project/.claude
```

---

## 5 Real Use Cases

### 1. Founder with an idea, no coding skills
> "I want an app where freelancers create invoices and track payments."

**What happens:** The plugin asks 4 plain-English questions. Picks MVP scope. 7 agents build login, dashboard, invoice CRUD, client list, payment tracking. Sarah runs `npm run dev` and sees a working app. She adds Stripe payments with one more command.

**Scope:** MVP | **Client:** Claude Desktop | **Stack:** Next.js + Prisma + Auth

---

### 2. Developer with existing data, needs a dashboard
> "I have 50K rows of analytics in Supabase. Build me a dashboard."

**What happens:** `:connect-data Supabase` wires up the client and proxy routes. The plugin builds stat cards, sortable tables, and charts. `:modify-ui add realtime updates` makes the data flow live. Built in under an hour.

**Scope:** MVP | **Client:** Claude Code | **Data:** Supabase + Realtime

---

### 3. Freelancer who needs a client landing page in 10 minutes
> "Build a landing page for a fitness app — hero, features, pricing, testimonials."

**What happens:** Simple scope. No React, no npm. Just HTML/CSS/JS. The plugin builds a responsive, dark-mode-ready page with all sections. Priya customizes colors and layout with `:modify-ui`. Drags the folder to Netlify. Done.

**Scope:** Simple | **Client:** Any | **Output:** HTML + CSS + JS (no build tools)

---

### 4. Product manager who needs a prototype for investors
> "Build a team workspace app — like Notion meets Slack. Needs to look real."

**What happens:** Prototype scope. Vite + React with mock data. The plugin builds 5 pages: login, workspace, project board, docs, settings. James adds 2 more pages and smooth transitions. Investors click through it live. When funded, upgrade to MVP scope — same project, real data.

**Scope:** Prototype | **Client:** Codex | **Stack:** Vite + React + Tailwind

---

### 5. Startup CTO scaling a live app
> "We have 500 users. Add Stripe payments, email notifications, and a settings page."

**What happens:** `:resume` loads the project from persistent memory — it knows every file, every feature, every past decision. `:add-feature Stripe subscriptions` builds checkout + webhooks + pricing page. `:add-feature welcome and invoice emails` sets up Resend with React Email templates. `:add-page account settings` uses existing auth and components. `:review` runs QA. `:deploy` updates CI/CD. Three features shipped in one session.

**Scope:** Production | **Client:** Claude Code | **Stack:** Next.js + Stripe + Resend

---

## The 7 Agents

| Agent | What It Does | When It's Used |
|-------|-------------|---------------|
| **Team Lead** | Plans, delegates, tracks progress. Never writes code. | All scopes |
| **Frontend Dev** | Pages, components, UI. 50+ components in registry. | All scopes |
| **Backend Dev** | APIs, database schemas, auth, business logic. | MVP + Production |
| **UI Designer** | Design tokens, color system, Tailwind config. | Prototype + MVP + Production |
| **QA Tester** | Type checks, build verification, test suites. | MVP + Production |
| **Deployer** | CI/CD pipelines, Docker, hosting config. | Production (or on request) |
| **Error Recovery** | Diagnoses build failures. Max 3 attempts then escalates. | On demand |

---

## 4 Scopes — Never Over-Engineer

| Scope | Output | Tech | Agents |
|-------|--------|------|--------|
| **Simple** | Static pages, opens in browser | HTML + CSS + JS | Frontend only |
| **Prototype** | Clickable demo with fake data | Vite + React + Tailwind | UI + Frontend |
| **MVP** | Working app with real data | Next.js + Prisma + Auth | UI + Front + Back |
| **Production** | Full app, tested, CI/CD | Next.js + Tests + Docker | All 7 agents |

A landing page gets HTML. A SaaS gets Next.js. The plugin decides — you don't have to.

---

## 19 Commands

| Command | Description |
|---------|------------|
| `/start` | New project — 4 questions, then build |
| `/build` | Full build from your vision |
| `/add-page` | Add a page to your app |
| `/add-feature` | Add a feature (frontend + backend) |
| `/connect-data` | Wire external data (API, Supabase, Firebase, Sheets, CSV) |
| `/modify-ui` | Quick UI changes — theme, layout, dark mode, components |
| `/generate` | Generate component, API route, hook, model, or test |
| `/fix` | Describe the bug, plugin locates and fixes it |
| `/refactor` | Improve code quality without changing behavior |
| `/review` | Code quality review (scope-appropriate depth) |
| `/explain` | Explain how any part of the codebase works |
| `/deploy` | Set up deployment (Vercel, Docker, CI/CD) |
| `/resume` | Continue where you left off (loads from persistent memory) |
| `/projects` | List, switch, manage all your projects |
| `/status` | Project dashboard |
| `/update-deps` | Check and update dependencies safely |
| `/config` | View or change project settings |
| `/index` | View or rebuild the file index |
| `/help` | Show all commands |

---

## What's Inside

```
mcp-server/          MCP server — 12 tools, 10 resources, 8 prompts
.claude/
  skills/            19 skill definitions (slash commands)
  agents/             7 specialist agent instructions
  knowledge/         40+ code pattern files (copy-paste ready)
  components/        50+ component blueprints with registry
  templates/          8 project scaffolds
  scripts/            DB init, validation, component checks
```

### Knowledge Base — 40+ Files

Agents don't invent code. They copy proven patterns:

| Category | What's Covered |
|----------|---------------|
| **Frameworks** | Next.js App Router, Vite + React, Expo React Native, vanilla HTML/CSS/JS |
| **Libraries** | Tailwind, shadcn/ui, Framer Motion, Prisma, Zod, NextAuth, Stripe, Zustand, React Hook Form, Resend |
| **Data** | REST APIs, GraphQL, Supabase, Firebase, Airtable, Google Sheets, Notion, CSV/JSON/Excel |
| **Infrastructure** | File storage (S3/R2), realtime (SSE/WebSocket), rate limiting, monitoring, security headers |
| **Patterns** | Auth flows, dark mode, SEO, responsive layout, error boundaries |
| **Components** | Button, navbar, sidebar, cards, modals, tables, forms, auth pages — all copy-paste ready |

### MCP Server

```bash
npx @10x-dev/mcp-server setup     # auto-configure for your AI clients
npx @10x-dev/mcp-server doctor    # verify installation
npx @10x-dev/mcp-server --help    # all CLI commands
```

| Capability | Count | Examples |
|-----------|-------|---------|
| **Tools** | 12 | `tenx_start`, `tenx_build`, `tenx_connect_data`, `tenx_get_knowledge` |
| **Resources** | 10 | `knowledge://index`, `components://registry`, `project://config` |
| **Prompts** | 8 | `tenx-system`, `tenx-agent`, `tenx-build`, `tenx-fix` |

Full MCP docs: [mcp-server/README.md](mcp-server/README.md)

### Persistent Memory

SQLite database at `~/.10x/memory.db`:
- Tracks every project you've ever created
- Remembers decisions, preferences, session history
- Resume any project with full context: `:resume`
- Switch between projects: `:projects`

### Model-Aware Execution

| Model Size | Behavior |
|-----------|----------|
| **Haiku / Sonnet** | COPY code from knowledge files. Change only names, props, content. |
| **Opus** | USE knowledge as base. ENHANCE with animations, a11y, dark mode, SEO. |

---

## Architecture

```
User (any AI client)
  |
  +── Claude Code ──────> .claude/ skills + agents (direct plugin)
  |
  +── Claude Desktop ───> MCP Server ──> 12 tools + 10 resources + 8 prompts
  |
  +── Codex / OpenCode ─> MCP Server ──> 12 tools + 10 resources + 8 prompts
  |
  +── All modes ────────> ~/.10x/memory.db (persistent cross-project memory)
  |
  +── All modes ────────> .10x/ per project (index, tasks, features, dev log)
```

---

## Links

- **Homepage:** [10x-anit.github.io/10x-development-team](https://10x-anit.github.io/10x-development-team)
- **GitHub:** [github.com/10x-Anit/10x-development-team](https://github.com/10x-Anit/10x-development-team)
- **MCP Server Docs:** [mcp-server/README.md](mcp-server/README.md)

---

**Built by [Anit Chaudhry](https://github.com/10x-Anit)** | MIT License
