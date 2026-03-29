# 10x Development Team -- Quick Start Guide

## Installation

### Option 1: npm install (recommended)
```bash
cd my-project
npm install 10x-development-team
```
Postinstall auto-creates `.claude/`, `.10x/`, `.mcp.json`, `.env`, and 3D asset directories.

### Option 2: Global install
```bash
npm install -g 10x-development-team
10x-mcp install-plugin ~/my-project
```

### Option 3: Copy into your project
Copy the `.claude/` folder from this repo into your project root:
```bash
cp -r 10x-development-team/.claude /path/to/your/project/.claude
```
All slash commands become available immediately.

## Your First Project

### Step 1: Start
```
/start
```
Describe what you want to build. The agent auto-detects scope and begins immediately.

### Step 2: Build
The team lead automatically delegates to specialist agents:
- UI Designer sets up your design system
- Frontend Dev builds pages using global components
- 3D Designer creates immersive 3D scenes (if needed)
- Backend Dev creates APIs and database (if MVP/Production)
- QA Tester verifies everything works (if MVP/Production)

### Step 3: Track Progress
- Press `Ctrl+T` to see task progress
- Check `.10x/dev-log.md` for detailed history
- Run `/status` for a quick overview

### Step 4: Iterate
```
/add-page pricing page with 3 plans
/add-feature user can save items to favorites
/connect-data my Supabase database
/modify-ui make it dark mode with blue accents
/fix the login button doesn't work
```

## Key Concepts

### Scope Controls Everything
| Scope | What You Get |
|-------|-------------|
| Simple | Pure HTML/CSS/JS -- opens in any browser |
| Prototype | React app with fake data -- for demos |
| MVP | Real app with database -- for first users |
| Production | Full app with tests, CI/CD -- for scale |

### The .10x/ Directory
Your project's brain. Agents read this instead of scanning files:
- `project.json` -- your app's vision, scope, and stack
- `file-index.json` -- every file indexed with descriptions
- `tasks.json` -- task tracker with goals and status
- `feature-map.json` -- feature-to-file mapping with data flow
- `dev-log.md` -- complete history of what was built

### Global Components
35 pre-defined component blueprints. Agents compose from these.
No duplicate code. Write once, use everywhere.

## All Commands
```
/help
```

### Persistent Memory
Your projects are tracked across sessions in `~/.10x/memory.db`:
- Switch between projects: `/projects`
- Resume any project: `/resumeproject`
- All decisions and context are remembered automatically

## Tips
- Use `@filename` to point agents to specific files
- Type `!npm run dev` to test your app without leaving Claude
- The agents save progress -- come back anytime and run `/resumeproject`
- Connect your existing data: `/connect-data my REST API at api.example.com`
- Quick visual changes: `/modify-ui change cards to a table view`
