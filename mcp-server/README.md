# 10x Development Team

**Describe your app. 7 AI agents build it.** Works with 9 AI clients. Outputs production-quality UI.

[![npm](https://img.shields.io/npm/v/10x-development-team?color=blue)](https://www.npmjs.com/package/10x-development-team)
[![GitHub](https://img.shields.io/badge/GitHub-10x--Anit-blue?logo=github)](https://github.com/10x-Anit/10x-development-team)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![MCP](https://img.shields.io/badge/MCP-Compatible-purple)](https://modelcontextprotocol.io)

---

## What Is This?

An MCP server and plugin that turns any AI assistant into a full development team. You describe what you want in plain English. The plugin's 7 specialist agents plan, design, build, test, and deploy it.

**No templates. No boilerplate. No "here's some code, figure it out."** The agents coordinate through a shared file index, reuse a registry of 35+ component blueprints, follow a 50+ file knowledge base of proven patterns, and remember everything across sessions via persistent SQLite memory.

### By the numbers

| | |
|---|---|
| **7** specialist agents | Team Lead, Frontend, Backend, UI Designer, QA, Deployer, Error Recovery |
| **19** slash commands | From `/start` to `/deploy` |
| **50+** knowledge files | Copy-paste-ready code for every common pattern |
| **35+** component blueprints | Buttons, cards, tables, modals, auth pages, sidebars, and more |
| **9** AI clients supported | Claude Desktop, Claude Code, Cursor, Windsurf, Cline, VS Code, Continue.dev, Codex, OpenCode |
| **12** MCP tools | Project lifecycle, knowledge access, persistent memory |
| **10** MCP resources | Knowledge base, component registry, project index |
| **8** MCP prompts | Agent roles, task-specific workflows |

---

## Design-First Philosophy

> Most AI code generators produce functional but ugly output. This plugin produces **Lovable/v0/Bolt-level quality** by default.

**The design system is everything.** Inspired by Lovable, v0, and Bolt.new, the 10x Development Team treats visual quality as a first-class requirement -- not an afterthought. The knowledge base includes massive, production-grade reference files: the Framer Motion reference alone is 1,949 lines, the shadcn/ui reference is 2,041 lines, and the UI/UX Principles bible is 514 lines.

Every agent follows 10 mandatory design principles baked into the system:

1. **Design system first, code second** -- `globals.css` and `tailwind.config.ts` define ALL visual tokens. Components only reference semantic tokens like `bg-primary`, `text-foreground`, `border-border`. Direct colors like `bg-gray-500` or `text-white` are banned. No hardcoded colors, ever.

2. **Rich animations by default** -- Scroll reveals, hover lifts, page transitions, staggered lists, hero effects, micro-interactions. The Framer Motion knowledge file alone is 1,949 lines of production-ready animation patterns.

3. **Every data view has 3 states** -- Loading skeleton, empty state, error state. Never a blank screen.

4. **shadcn/ui with custom variants** -- 2,041 lines of component patterns including theming, custom variants, and composition recipes. Not just "install and use" -- deeply integrated with the design system.

5. **Dark mode is automatic** -- Semantic HSL tokens in `globals.css` mean dark mode works everywhere with zero per-component effort. Gradients and shadows adapt automatically.

6. **Micro-interactions on everything** -- Hover scale (1.02), focus rings, active press (0.98), smooth transitions. Every interactive element has visible state changes.

7. **Mobile-first responsive** -- Designed for 320px first, enhanced at 640px and 1024px+. No desktop-only layouts.

8. **Accessibility is non-negotiable** -- Labels, 4.5:1 contrast ratios, focus indicators, semantic HTML, ARIA attributes. WCAG AA compliance.

9. **Typography has hierarchy** -- Display, headline, title, body-lg, body, caption, overline. Consistent across all pages.

10. **Spacing follows base-4 rhythm** -- 4px, 8px, 12px, 16px, 24px, 32px. No arbitrary values.

The result: apps that look like a designer built them, not like AI generated them.

---

## Works With 9 AI Clients

| Client | Config Path | Setup Command | Status |
|--------|-------------|---------------|--------|
| **Claude Desktop** | `claude_desktop_config.json` | `npx 10x-development-team setup --client claude-desktop` | Ready |
| **Claude Code** | `~/.claude/.mcp.json` (or direct plugin) | `npx 10x-development-team install-plugin .` | Ready |
| **Cursor** | `~/.cursor/mcp.json` | `npx 10x-development-team setup --client cursor` | Ready |
| **Windsurf** | `~/.codeium/windsurf/mcp_config.json` | `npx 10x-development-team setup --client windsurf` | Ready |
| **Cline** | `cline_mcp_settings.json` | `npx 10x-development-team setup --client cline` | Ready |
| **VS Code + Copilot** | `.vscode/mcp.json` | `npx 10x-development-team setup --client vscode` | Ready |
| **Continue.dev** | `~/.continue/mcp.json` | `npx 10x-development-team setup --client continue` | Ready |
| **Codex** | `~/.codex/mcp.json` | `npx 10x-development-team setup --client codex` | Ready |
| **OpenCode** | `~/.config/opencode/mcp.json` | `npx 10x-development-team setup --client opencode` | Ready |

Config paths are auto-detected per platform (Windows, macOS, Linux).

---

## Quick Start

### Option A: Auto-detect all your AI clients (recommended)

```bash
# Auto-detect and configure ALL your AI clients
npx 10x-development-team setup

# Health check
npx 10x-development-team doctor
```

Open your AI client. Say: **"Start a new project -- I want an invoice app for freelancers."**

### Option B: Configure a specific client

```bash
# Or configure a specific client
npx 10x-development-team setup --client cursor

# Or configure ALL supported clients at once
npx 10x-development-team setup --all
```

### Option C: Claude Code direct plugin (slash commands, no MCP needed)

```bash
# Claude Code direct plugin (no MCP needed)
npx 10x-development-team install-plugin /path/to/your/project
cd /path/to/your/project
```

In Claude Code, type: `/10x-development-team:start`

### Option D: Clone the repo

```bash
git clone https://github.com/10x-Anit/10x-development-team.git
cp -r 10x-development-team/.claude /path/to/your/project/.claude
```

### Health check

```bash
npx 10x-development-team doctor
```

This checks: Node version, plugin files, SQLite database, configured clients, and knowledge base integrity.

---

## 5 Real Use Cases

### 1. Founder with an idea, no coding skills

> "I want an app where freelancers create invoices and track payments."

**What happens:** The plugin asks 4 plain-English questions. Picks MVP scope. 7 agents build login, dashboard, invoice CRUD, client list, payment tracking -- all with a polished design system, loading states, and dark mode. Run `npm run dev` and see a working app. Add Stripe payments with one more command.

**Scope:** MVP | **Client:** Claude Desktop | **Stack:** Next.js + Prisma + Auth

---

### 2. Developer with existing data, needs a dashboard

> "I have 50K rows of analytics in Supabase. Build me a dashboard."

**What happens:** `:connect-data Supabase` wires up the client and proxy routes. The plugin builds stat cards with animated numbers, sortable tables, and Recharts/Plotly charts -- all following the design system. `:modify-ui add realtime updates` makes the data flow live. Built in under an hour.

**Scope:** MVP | **Client:** Claude Code | **Data:** Supabase + Realtime

---

### 3. Freelancer who needs a client landing page in 10 minutes

> "Build a landing page for a fitness app -- hero, features, pricing, testimonials."

**What happens:** Simple scope. No React, no npm. Just HTML/CSS/JS. The plugin builds a responsive, dark-mode-ready page with smooth scroll, animated sections, and a polished color system. Customize colors and layout with `:modify-ui`. Drag the folder to Netlify. Done.

**Scope:** Simple | **Client:** Any | **Output:** HTML + CSS + JS (no build tools)

---

### 4. Product manager who needs a prototype for investors

> "Build a team workspace app -- like Notion meets Slack. Needs to look real."

**What happens:** Prototype scope. Vite + React with mock data. The plugin builds 5 pages with Framer Motion transitions, staggered list animations, and a complete design system. Investors click through it live. When funded, upgrade to MVP scope -- same project, real data.

**Scope:** Prototype | **Client:** Codex | **Stack:** Vite + React + Tailwind

---

### 5. Startup CTO scaling a live app

> "We have 500 users. Add Stripe payments, email notifications, and a settings page."

**What happens:** `:resume` loads the project from persistent memory -- it knows every file, every feature, every past decision. `:add-feature Stripe subscriptions` builds checkout + webhooks + pricing page. `:add-feature welcome and invoice emails` sets up Resend with React Email templates. `:add-page account settings` uses existing auth and components. `:review` runs QA. `:deploy` updates CI/CD. Three features shipped in one session.

**Scope:** Production | **Client:** Claude Code | **Stack:** Next.js + Stripe + Resend

---

## The 7 Agents

| Agent | What It Does | When It's Used |
|-------|-------------|---------------|
| **Team Lead** | Plans, delegates, tracks progress. Never writes code. | All scopes |
| **Frontend Dev** | Pages, components, UI. 35+ components in registry. Follows design system. | All scopes |
| **Backend Dev** | APIs, database schemas, auth, business logic. | MVP + Production |
| **UI Designer** | Design system tokens, color palettes, Tailwind config, visual consistency. | Prototype + MVP + Production |
| **QA Tester** | Type checks, build verification, test suites, accessibility audits. | MVP + Production |
| **Deployer** | CI/CD pipelines, Docker, hosting config. | Production (or on request) |
| **Error Recovery** | Diagnoses build failures. Max 3 attempts then escalates. | On demand |

---

## 4 Scopes -- Never Over-Engineer

| Scope | Output | Tech | Agents | Design Quality |
|-------|--------|------|--------|----------------|
| **Simple** | Static pages, opens in browser | HTML + CSS + JS | Frontend only | CSS custom properties, transitions, responsive |
| **Prototype** | Clickable demo with fake data | Vite + React + Tailwind | UI + Frontend | Full design system, Framer Motion, dark mode |
| **MVP** | Working app with real data | Next.js + Prisma + Auth | UI + Front + Back | shadcn/ui, loading skeletons, error states |
| **Production** | Full app, tested, CI/CD | Next.js + Tests + Docker | All 7 agents | Everything above + a11y audit, SEO, monitoring |

A landing page gets HTML. A SaaS gets Next.js. The plugin decides -- you don't have to.

---

## 19 Commands

| Command | Description |
|---------|------------|
| `/start` | New project -- 4 questions, then build |
| `/build` | Full build from your vision |
| `/add-page` | Add a page to your app |
| `/add-feature` | Add a feature (frontend + backend) |
| `/connect-data` | Wire external data (API, Supabase, Firebase, Sheets, CSV) |
| `/modify-ui` | Quick UI changes -- theme, layout, dark mode, components |
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
mcp-server/          MCP server -- 12 tools, 10 resources, 8 prompts
.claude/
  skills/            19 skill definitions (slash commands)
  agents/             7 specialist agent instructions
  knowledge/         50+ code pattern files (copy-paste ready)
  components/        35+ component blueprints with registry
  templates/          8 project scaffolds
  scripts/            DB init, validation, component checks
```

### Knowledge Base -- 50+ Files

Agents don't invent code. They copy proven patterns from a curated knowledge base:

| Category | Files | What's Covered |
|----------|-------|---------------|
| **Frameworks** | 5 | Next.js App Router, Vite + React, Expo React Native, vanilla HTML/CSS/JS, framework selection matrix |
| **Libraries** | 11 | Tailwind (utilities, responsive, dark mode), shadcn/ui (2,041 lines -- theming, variants, composition), Framer Motion (1,949 lines -- scroll, stagger, layout, gestures), Prisma, Zod, NextAuth, Stripe, Zustand, React Hook Form, Resend, Charts/Data Viz (Recharts, Plotly, sparklines, heatmaps) |
| **UI/UX Design** | 3 | UI/UX Principles bible (514 lines -- typography, spacing, color tokens, hierarchy, micro-interactions), Design System Creation (538 lines -- globals.css tokens, tailwind.config.ts, HSL color system, gradients, shadows), Charts and Data Visualization |
| **Data Patterns** | 5 | REST/GraphQL APIs, Supabase, Firebase, Airtable, Google Sheets, Notion, CSV/JSON/Excel parsing |
| **Infrastructure** | 4 | File storage (S3/R2), realtime (SSE/WebSocket), rate limiting/security, error tracking/monitoring |
| **App Patterns** | 7 | Auth flows, dark mode, SEO, responsive layout, error boundaries, React component patterns, data fetching |
| **Components** | 10+ | Button, input, card, modal, data table, navbar, sidebar, toast, form, auth pages -- all copy-paste ready |

### MCP Server -- Tools, Resources, Prompts

#### Tools (12)

| Tool | Description |
|------|-------------|
| `tenx_start` | Initialize a new project with vision, scope, and type |
| `tenx_build` | Execute the full build -- returns plan + task list |
| `tenx_projects` | List, search, manage all projects across sessions |
| `tenx_read_index` | Read current project state (.10x/ files) |
| `tenx_update_index` | Update file index, tasks, dev log, feature map |
| `tenx_get_skill` | Get detailed instructions for any skill (19 available) |
| `tenx_get_knowledge` | Get copy-paste code patterns from knowledge base |
| `tenx_list_knowledge` | List all knowledge files by category |
| `tenx_get_components` | Get the component registry (35+ components) |
| `tenx_save_memory` | Save decisions/context to persistent memory |
| `tenx_get_context` | Load cross-session context for current project |
| `tenx_get_agent` | Get specialist agent instructions (7 agents) |

#### Resources (10)

| Resource | URI | Description |
|----------|-----|-------------|
| Knowledge Index | `knowledge://index` | All knowledge files listed by category |
| Knowledge File | `knowledge://{category}/{file}` | Individual code pattern files |
| Component Registry | `components://registry` | 35+ pre-built component definitions |
| Project Config | `project://config` | Project scope, stack, vision |
| Project Files | `project://files` | File index with descriptions |
| Project Tasks | `project://tasks` | Task list with status |
| Project Features | `project://features` | Feature map with data flow |
| Project Log | `project://log` | Development history |
| Skill Instructions | `skill://{name}` | 19 skill instruction files |
| Agent Instructions | `agent://{name}` | 7 agent role definitions |

#### Prompts (8)

| Prompt | Description |
|--------|-------------|
| `tenx-system` | Core system prompt for the 10x plugin |
| `tenx-agent` | Load a specialist agent role |
| `tenx-build` | Full build with team-lead instructions |
| `tenx-add-page` | Add a page with frontend-dev instructions |
| `tenx-add-feature` | Add a feature with team-lead coordination |
| `tenx-connect-data` | Connect external data source |
| `tenx-modify-ui` | Quick UI changes |
| `tenx-fix` | Fix a bug with diagnostic instructions |

### Persistent Memory

SQLite database at `~/.10x/memory.db`:
- Tracks every project you've ever created
- Remembers decisions, preferences, session history
- Resume any project with full context: `:resume`
- Switch between projects: `:projects`

### Model-Aware Execution

The plugin adapts to whatever model is running it:

| Model Size | Behavior |
|-----------|----------|
| **Haiku / Sonnet** (small context) | COPY code directly from knowledge files. Change only names, props, content. Fast and reliable. |
| **Opus** (large context) | USE knowledge as structural base. ENHANCE with Framer Motion animations, loading skeletons, error boundaries, accessibility, dark mode, SEO metadata, micro-interactions. |

---

## Architecture

```
User (any AI client)
  |
  +── Claude Desktop ───> MCP Server (stdio, local)
  +── Claude Code ──────> Direct plugin (.claude/) OR MCP Server
  +── Cursor IDE ───────> MCP Server (stdio, local)
  +── Windsurf IDE ─────> MCP Server (stdio, local)
  +── Cline ────────────> MCP Server (stdio, local)
  +── VS Code + Copilot ─> MCP Server (stdio, local)
  +── Continue.dev ─────> MCP Server (stdio, local)
  +── Codex CLI ────────> MCP Server (stdio, local)
  +── OpenCode ─────────> MCP Server (stdio, local)
  |
  +── All modes ────────> ~/.10x/memory.db (persistent memory)
  +── All modes ────────> .10x/ per project (index, tasks, features, log)
```

---

## MCP Config Reference

The JSON format that goes in each client's config file:

```json
{
  "mcpServers": {
    "10x-dev": {
      "command": "npx",
      "args": ["-y", "10x-development-team"],
      "env": {}
    }
  }
}
```

**Note:** VS Code uses `"servers"` instead of `"mcpServers"`:

```json
{
  "servers": {
    "10x-dev": {
      "command": "npx",
      "args": ["-y", "10x-development-team"],
      "env": {}
    }
  }
}
```

This config works for: Claude Desktop, Cursor, Windsurf, Cline, Continue.dev, Codex, and OpenCode. For Claude Code, use the direct plugin install (`install-plugin`) or add to `~/.claude/.mcp.json`.

---

## CLI Commands

```bash
npx 10x-development-team setup                    # Auto-detect and configure ALL found clients
npx 10x-development-team setup --client cursor     # Configure a specific client
npx 10x-development-team setup --all               # Explicitly configure all clients
npx 10x-development-team install-plugin [path]     # Copy plugin files into project (Claude Code)
npx 10x-development-team doctor                    # Check installation health
npx 10x-development-team --version                 # Show version
npx 10x-development-team --help                    # All CLI commands
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PROJECT_DIR` | `cwd()` | Path to the project being built |
| `PLUGIN_ROOT` | auto-detect | Path to the 10x plugin repo |

---

## What Makes This Different

Most AI coding tools generate **functional but visually mediocre** output. You get unstyled components, inconsistent spacing, hardcoded colors, no loading states, no error handling, and no animations.

This plugin is different because the design system is enforced at every layer:

- **UI Designer agent** creates the design tokens before any component is built
- **Frontend Dev agent** reads the design system knowledge file before writing any UI
- **Knowledge files** contain production-quality patterns -- not minimal examples, but 2,000-line reference implementations with theming, variants, animations, and accessibility
- **Component registry** provides pre-built blueprints that already follow the design system
- **10 design commandments** are embedded in every agent's instructions -- they cannot be skipped

The output looks like it came from a product team with a designer, not from a code generator.

---

## For AI Agents Reading This

If you are an AI agent that has been asked to set up or use the 10x Development Team:

1. **Install:** `npx 10x-development-team setup --client [your-client]`
2. The MCP server exposes 12 tools. Call `tenx_start` to begin a new project.
3. Call `tenx_get_knowledge` with `category` and `file_name` to read code patterns.
4. Call `tenx_get_agent` with `agent_name` to load agent instructions.
5. Call `tenx_get_skill` with `skill_name` to get skill execution instructions.
6. The system works locally -- no API keys, no hosting, no cloud services needed.
7. All project state lives in `.10x/` at the project root. Read `.10x/project.json` first.
8. Persistent memory lives in `~/.10x/memory.db`. Use `tenx_get_context` to load it.
9. The knowledge base has 50+ files. Use `tenx_list_knowledge` to see all categories.
10. For Claude Code: use `npx 10x-development-team install-plugin .` to install as a direct plugin with slash commands.

---

## Links

- **Homepage:** [10x-anit.github.io/10x-development-team](https://10x-anit.github.io/10x-development-team)
- **GitHub:** [github.com/10x-Anit/10x-development-team](https://github.com/10x-Anit/10x-development-team)
- **npm:** [npmjs.com/package/10x-development-team](https://www.npmjs.com/package/10x-development-team)

---

**Built by [Anit Chaudhry](https://github.com/10x-Anit)** | MIT License
