# 10x Development Team

> AI-powered development team plugin for Claude Code. Describe your app — 7 specialist agents build it.

## What It Does

You describe what you want to build. The plugin's team of AI agents handles everything:

- **Team Lead** — plans the work, delegates to specialists, tracks progress
- **Frontend Dev** — builds pages and UI using global components
- **Backend Dev** — creates APIs, database, authentication
- **UI Designer** — sets up design system, colors, typography
- **QA Tester** — writes tests, runs quality checks
- **Deployer** — configures CI/CD, Docker, hosting
- **Error Recovery** — fixes build errors and crashes

## Install

### Option 1: Claude Code Plugin
```
/plugin install 10x-development-team
```

### Option 2: Copy into your project
```bash
git clone https://github.com/AnitChaudhry/10x-development-team.git
cp -r 10x-development-team/.claude /path/to/your/project/.claude
```

### Option 3: Local plugin testing
```bash
claude --plugin-dir /path/to/10x-development-team
```

## Quick Start

```
/10x-development-team:start
```

The agent asks 4-5 simple questions about your vision — no engineering jargon. Then it builds.

## Choose Your Scope

| Scope | What You Get | Tech |
|-------|-------------|------|
| **Simple** | Static pages, no build tools | HTML + CSS + JS |
| **Prototype** | Interactive demo with fake data | Vite + React + Tailwind |
| **MVP** | Working app with real data | Next.js + Prisma + Auth |
| **Production** | Full app, tested, deployed | Next.js + Tests + CI/CD + Docker |

## All Commands

| Command | What It Does |
|---------|-------------|
| `:start` | Start a new project |
| `:build` | Full build from vision |
| `:add-page` | Add a page |
| `:add-feature` | Add a feature |
| `:generate` | Generate component, API, hook, model, or test |
| `:fix` | Fix a bug |
| `:refactor` | Improve code quality |
| `:review` | Code quality review |
| `:explain` | Explain how something works |
| `:deploy` | Set up deployment |
| `:resume` | Continue where you left off |
| `:status` | Project dashboard |
| `:update-deps` | Update dependencies |
| `:config` | Change project settings |
| `:index` | View/rebuild file index |
| `:help` | Show all commands |

## Key Features

### Smart Scope Selection
Don't over-engineer. A simple landing page gets HTML/CSS/JS — not React.

### Knowledge Base (32 files)
Agents don't reinvent code. They read from a knowledge base with actual code samples for Next.js, Tailwind, shadcn/ui, Framer Motion, Prisma, Zod, Stripe, and more.

### Model-Aware
- **Small models** (Haiku/Sonnet): COPY code from knowledge base, change only names and content
- **Large models** (Opus): USE knowledge as a base, ENHANCE with animations, accessibility, dark mode, SEO

### Project Index System
Every project gets a `.10x/` directory that tracks:
- `project.json` — vision, scope, stack
- `file-index.json` — every file with descriptions (agents read this instead of scanning)
- `feature-map.json` — feature wiring (which files, which agents, data flow)
- `tasks.json` — task tracker with goals and status
- `dev-log.md` — complete history

### Global Component Registry
39 component blueprints. Agents compose from these — write once, use everywhere.

### 17 Lifecycle Hooks
PreToolUse, PostToolUse, Stop, SessionStart, SubagentStart, SubagentStop, and more — enforcing quality, component reuse, and index updates.

## What's Inside

```
119 files:
  16 skills      — every user action covered
   7 agents      — full team + error recovery
  32 knowledge   — frameworks, libraries, patterns, copy-paste components
  39 components   — web + mobile blueprints + registry
  16 templates    — 8 project types + index system + standards
   1 hooks file   — 17 lifecycle hooks
   6 config files — plugin manifest, settings, MCP, LSP
```

## Built by

**[10x.in](https://10x.in)** — AI-powered development tools.

Developed by **Anit Chaudhry** — Product Manager & Developer at 10x.in

## License

MIT
