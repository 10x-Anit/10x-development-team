# 10x Development Team — Quick Start Guide

## Installation

### Option 1: Copy into your project
Copy the `.claude/` folder from this repo into your project root:
```bash
cp -r 10x-development-team/.claude /path/to/your/project/.claude
```
All slash commands become available immediately — no plugin install needed.

### Option 2: Plugin install (when published)
```bash
/plugin install 10x-development-team
```

### Option 3: Local plugin development testing
```bash
claude --plugin-dir ./10x-development-team
```

## Your First Project

### Step 1: Start
```
/10x-development-team:start
```
The agent will ask you:
1. What does your app do?
2. Who will use it?
3. What scope? (Simple / Prototype / MVP / Production)
4. What type? (Website / Web app / Mobile / E-commerce)

### Step 2: Build
The team lead automatically delegates to specialist agents:
- UI Designer sets up your design system
- Frontend Dev builds pages using global components
- Backend Dev creates APIs and database (if MVP/Production)
- QA Tester verifies everything works (if MVP/Production)

### Step 3: Track Progress
- Press `Ctrl+T` to see task progress
- Check `.10x/dev-log.md` for detailed history
- Run `/10x-development-team:status` for a quick overview

### Step 4: Iterate
```
/10x-development-team:add-page pricing page with 3 plans
/10x-development-team:add-feature user can save items to favorites
/10x-development-team:fix the login button doesn't work
```

## Key Concepts

### Scope Controls Everything
| Scope | What You Get |
|-------|-------------|
| Simple | Pure HTML/CSS/JS — opens in any browser |
| Prototype | React app with fake data — for demos |
| MVP | Real app with database — for first users |
| Production | Full app with tests, CI/CD — for scale |

### The .10x/ Directory
Your project's brain. Agents read this instead of scanning files:
- `project.json` — your app's vision, scope, and stack
- `file-index.json` — every file indexed with descriptions
- `tasks.json` — task tracker with goals and status
- `dev-log.md` — complete history of what was built

### Global Components
35 pre-defined component blueprints. Agents compose from these.
No duplicate code. Write once, use everywhere.

## All Commands
```
/10x-development-team:help
```

## Tips
- Use `@filename` to point agents to specific files
- Use `/memory` to see what's remembered across sessions
- Type `!npm run dev` to test your app without leaving Claude
- The agents save progress — come back anytime and run `:resume`
