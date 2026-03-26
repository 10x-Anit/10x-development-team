# 10x Development Team

**Gen UI Skills Plugin** — Describe your app in plain English. 7 specialist AI agents build it. Works with any AI client.

[![GitHub](https://img.shields.io/badge/GitHub-10x--Anit-blue?logo=github)](https://github.com/10x-Anit/10x-development-team)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![MCP](https://img.shields.io/badge/MCP-Compatible-purple)](https://modelcontextprotocol.io)
[![npm](https://img.shields.io/badge/npm-10x--development--team-red?logo=npm)](https://www.npmjs.com/package/10x-development-team)

---

## What Is This?

A plugin that turns any AI assistant into a full development team. You describe what you want. The plugin's 7 agents plan, build, test, and deploy it.

**No templates. No boilerplate. No "here's some code, figure it out."** The agents coordinate, track files, reuse components, and remember everything across sessions.

---

## Design-First Philosophy

Inspired by **Lovable**, **v0**, and **Bolt.new** — the output isn't just functional, it's beautiful.

- **"The design system is everything"** — globals.css + tailwind.config.ts define ALL visual tokens. Components only reference semantic tokens.
- **No hardcoded colors** — `text-white`, `bg-gray-*` are banned. Only `bg-primary`, `text-foreground`, `border-border`.
- **Rich animations** — Framer Motion scroll reveals, staggered lists, hero effects, micro-interactions (1,949-line reference).
- **shadcn/ui** with custom variants — premium buttons, glass cards, animated dialogs (2,041-line reference).
- **Every page has 3 states** — loading skeleton, empty state, error state. Never a blank screen.
- **Dark mode automatic** — semantic tokens handle light/dark. No separate `dark:` classes needed.
- **Responsive mobile-first** — design for 320px, enhance up. Touch targets, proper spacing.
- **Accessible** — WCAG AA contrast, focus indicators, semantic HTML, aria attributes.

---

## Works With 9 AI Clients

| Client | Config Path | Setup Command | Status |
|--------|------------|---------------|--------|
| **Claude Desktop** | `claude_desktop_config.json` | `npx 10x-development-team setup --client claude-desktop` | Ready |
| **Claude Code** | `~/.claude/.mcp.json` or direct plugin | `npx 10x-development-team install-plugin .` | Ready |
| **Cursor** | `~/.cursor/mcp.json` | `npx 10x-development-team setup --client cursor` | Ready |
| **Windsurf** | `~/.codeium/windsurf/mcp_config.json` | `npx 10x-development-team setup --client windsurf` | Ready |
| **Cline** | `cline_mcp_settings.json` | `npx 10x-development-team setup --client cline` | Ready |
| **VS Code + Copilot** | `.vscode/mcp.json` | `npx 10x-development-team setup --client vscode` | Ready |
| **Continue.dev** | `~/.continue/mcp.json` | `npx 10x-development-team setup --client continue` | Ready |
| **OpenAI Codex** | `~/.codex/mcp.json` | `npx 10x-development-team setup --client codex` | Ready |
| **OpenCode** | `~/.config/opencode/mcp.json` | `npx 10x-development-team setup --client opencode` | Ready |

The MCP server runs **locally** on your machine. No hosting, no API keys, no cloud services needed.

---

## Quick Start

```bash
# Auto-detect and configure ALL your AI clients
npx 10x-development-team setup

# Or configure a specific client
npx 10x-development-team setup --client cursor

# Or configure ALL supported clients at once
npx 10x-development-team setup --all

# Claude Code direct plugin (no MCP needed)
npx 10x-development-team install-plugin /path/to/project

# Health check
npx 10x-development-team doctor
```

Then open your AI client and say: **"Start a new project — I want an invoice app for freelancers."**

For Claude Code users: `cd /path/to/project` then type `/10x-development-team:start`

---

## 5 Real Use Cases

### 1. Founder with an idea, no coding skills
> "I want an app where freelancers create invoices and track payments."

**What happens:** The plugin asks 4 plain-English questions. Picks MVP scope. 7 agents build login, dashboard, invoice CRUD, client list, payment tracking — all with a polished design system, animations, and dark mode. She runs `npm run dev` and sees a beautiful working app.

**Scope:** MVP | **Client:** Claude Desktop | **Stack:** Next.js + Prisma + Auth

---

### 2. Developer with existing data, needs a dashboard
> "I have 50K rows of analytics in Supabase. Build me a dashboard."

**What happens:** `:connect-data Supabase` wires up the client and proxy routes. The plugin builds stat cards with animated counters, sortable tables, and Recharts data visualizations. `:modify-ui add realtime updates` makes the data flow live. Built in under an hour.

**Scope:** MVP | **Client:** Claude Code | **Data:** Supabase + Realtime

---

### 3. Freelancer who needs a client landing page in 10 minutes
> "Build a landing page for a fitness app — hero, features, pricing, testimonials."

**What happens:** Simple scope. No React, no npm. Just HTML/CSS/JS with CSS custom properties, smooth animations, and responsive design. Priya customizes colors and layout with `:modify-ui`. Drags the folder to Netlify. Done.

**Scope:** Simple | **Client:** Any | **Output:** HTML + CSS + JS (no build tools)

---

### 4. Product manager who needs a prototype for investors
> "Build a team workspace app — like Notion meets Slack. Needs to look real."

**What happens:** Prototype scope. Vite + React with mock data. The plugin builds 5 pages with Framer Motion transitions, scroll animations, and glassmorphism effects. Investors click through it live. When funded, upgrade to MVP scope — same project, real data.

**Scope:** Prototype | **Client:** Cursor | **Stack:** Vite + React + Tailwind

---

### 5. Startup CTO scaling a live app
> "We have 500 users. Add Stripe payments, email notifications, and a settings page."

**What happens:** `:resume` loads the project from persistent memory. `:add-feature Stripe subscriptions` builds checkout + webhooks + pricing page. `:add-feature welcome and invoice emails` sets up Resend with React Email templates. `:add-page account settings` uses existing auth and components. `:review` runs QA. `:deploy` updates CI/CD. Three features shipped in one session.

**Scope:** Production | **Client:** Claude Code | **Stack:** Next.js + Stripe + Resend

---

## The 7 Agents

| Agent | What It Does | When It's Used |
|-------|-------------|---------------|
| **Team Lead** | Plans, delegates, tracks progress, verifies design quality. Never writes code. | All scopes |
| **Frontend Dev** | Pages, components, UI. 35+ components in registry. Design-system enforced. | All scopes |
| **Backend Dev** | APIs, database schemas, auth, business logic. Frontend-friendly error messages. | MVP + Production |
| **UI Designer** | Rich design system: semantic tokens, gradients, shadows, animations, dark mode. | Prototype + MVP + Production |
| **QA Tester** | Type checks, build verification, visual quality audit, accessibility scan. | MVP + Production |
| **Deployer** | CI/CD pipelines, Docker, hosting config, performance headers, Web Vitals. | Production (or on request) |
| **Error Recovery** | Diagnoses build failures, design system errors, Framer Motion issues. Max 3 attempts. | On demand |

---

## 4 Scopes — Never Over-Engineer

| Scope | Output | Tech | Agents | Design Quality |
|-------|--------|------|--------|---------------|
| **Simple** | Static pages, opens in browser | HTML + CSS + JS | Frontend only | CSS variables, responsive |
| **Prototype** | Clickable demo with fake data | Vite + React + Tailwind | UI + Frontend | Full design tokens, animations |
| **MVP** | Working app with real data | Next.js + Prisma + Auth | UI + Front + Back | shadcn/ui, Framer Motion, dark mode |
| **Production** | Full app, tested, CI/CD | Next.js + Tests + Docker | All 7 agents | Everything above + a11y, SEO, perf |

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
| `/modify-ui` | Quick UI changes — theme, layout, dark mode, animations |
| `/generate` | Generate component, API route, hook, model, or test |
| `/fix` | Describe the bug, plugin locates and fixes it |
| `/refactor` | Improve code quality without changing behavior |
| `/review` | Code quality + visual quality review |
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
  knowledge/         50+ code pattern files (copy-paste ready)
  components/        35+ component blueprints with registry
  templates/          8 project scaffolds
  hooks/              Safety hooks (component reuse, secret detection, index sync)
  scripts/            DB init, validation, component checks
```

### Knowledge Base — 50+ Files

Agents don't invent code. They copy proven patterns:

| Category | What's Covered | Key Files |
|----------|---------------|-----------|
| **UI/UX Design** | The design bible, design system creation, charts | `ui-ux-principles.md` (514 lines), `design-system.md` (538 lines) |
| **Frameworks** | Next.js App Router, Vite + React, Expo, vanilla HTML/CSS/JS | `nextjs.md`, `vite-react.md`, `html-css-js.md` |
| **Libraries** | Tailwind, shadcn/ui, Framer Motion, Prisma, Zod, NextAuth, Stripe, Zustand, Recharts | `shadcn-ui.md` (2,041 lines), `framer-motion.md` (1,949 lines) |
| **Data** | REST APIs, GraphQL, Supabase, Firebase, Airtable, Sheets, Notion, CSV/Excel | `external-api.md`, `data-sources.md`, `file-ingestion.md` |
| **Infrastructure** | File storage (S3/R2), realtime (SSE/WebSocket), rate limiting, monitoring | `realtime.md`, `rate-limiting.md`, `monitoring.md` |
| **Patterns** | Auth flows, dark mode, SEO, responsive layout, error boundaries | `dark-mode.md`, `seo.md`, `responsive-layout.md` |
| **Components** | Button, navbar, sidebar, cards, modals, tables, forms, auth pages | 10 copy-paste-ready component files |

### MCP Server

```bash
npx 10x-development-team setup     # auto-configure for your AI clients
npx 10x-development-team doctor    # verify installation
npx 10x-development-team --help    # all CLI commands
```

| Capability | Count | Examples |
|-----------|-------|---------|
| **Tools** | 12 | `tenx_start`, `tenx_build`, `tenx_get_knowledge`, `tenx_get_agent` |
| **Resources** | 10 | `knowledge://index`, `components://registry`, `project://config` |
| **Prompts** | 8 | `tenx-system`, `tenx-agent`, `tenx-build`, `tenx-fix` |

### MCP Config Format

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
  +-- All modes ----------> ~/.10x/memory.db (persistent cross-project memory)
  +-- All modes ----------> .10x/ per project (index, tasks, features, dev log)
```

---

## For AI Agents Reading This

If you are an AI agent that has been asked to set up or use the 10x Development Team:

1. **Install**: `npx 10x-development-team setup --client [your-client]`
2. The MCP server exposes **12 tools**. Call `tenx_start` to begin a new project.
3. Call `tenx_get_knowledge` with `category` and `file_name` to read code patterns before writing code.
4. Call `tenx_get_agent` with `agent_name` to load specialist agent instructions.
5. Call `tenx_get_skill` with `skill_name` to get detailed skill execution steps.
6. Call `tenx_read_index` to understand current project state before making changes.
7. Call `tenx_update_index` after creating/modifying files to keep the index in sync.
8. Call `tenx_list_knowledge` to see ALL available knowledge files by category.
9. Call `tenx_get_components` to check the component registry before building UI.
10. The system works **100% locally** — no API keys, no hosting, no cloud services needed.

---

## Links

- **Homepage:** [10x-anit.github.io/10x-development-team](https://10x-anit.github.io/10x-development-team)
- **GitHub:** [github.com/10x-Anit/10x-development-team](https://github.com/10x-Anit/10x-development-team)
- **npm:** [npmjs.com/package/10x-development-team](https://www.npmjs.com/package/10x-development-team)

---

**Built by [Anit Chaudhry](https://github.com/10x-Anit)** | MIT License
