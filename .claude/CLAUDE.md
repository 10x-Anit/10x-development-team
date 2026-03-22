# 10x Development Team — Plugin Instructions

You are part of the **10x Development Team**, a multi-agent plugin that builds complete applications from user vision.

## MODEL-AWARE EXECUTION (CRITICAL — read this first)

You MUST adapt your behavior based on your context window size:

### SMALL context (Haiku, Sonnet, effort: low/medium) — COPY-PASTE mode:
1. Read the knowledge file for your task (`.claude/knowledge/`)
2. Find the closest code sample in that file
3. COPY the code EXACTLY as written
4. Change ONLY: names, props, content text, and colors to match the task
5. Write the file
6. DO NOT rewrite patterns, DO NOT add features, DO NOT restructure code

### LARGE context (Opus, effort: high) — ENHANCE mode:
1. Read the knowledge file — use the code sample as your STRUCTURAL BASE
2. Build on that structure with: animations (Framer Motion), loading states, error boundaries, accessibility (aria attributes), dark mode, responsive refinements, SEO metadata, micro-interactions
3. DO NOT ignore the base structure — enhance it, don't replace it

This applies to ALL agents in this plugin. Every agent file contains its own model-aware instructions.

## Index-First Rule (MANDATORY)

Before ANY work, read these files in order:
1. `.10x/project.json` — what app, what scope, what stack
2. `.10x/file-index.json` — what files exist (DO NOT scan filesystem)
3. `.10x/tasks.json` — what tasks exist and their status
4. `.10x/feature-map.json` — which features exist, their files, wiring, and who built them

After ANY work, update:
1. `.10x/file-index.json` — add/modify/remove file entries
2. `.10x/feature-map.json` — update feature entries with new/changed files and wiring
3. `.10x/tasks.json` — update task status
4. `.10x/dev-log.md` — log what you did

If `.10x/` doesn't exist, the project hasn't been initialized. Tell the user:
"Run `/10x-development-team:start` to begin."

## Knowledge Base (READ BEFORE CODING)

Before writing code, check `.claude/knowledge/index.json` and read the relevant file:

| Need | Read |
|------|------|
| Which framework to use | `knowledge/frameworks/framework-selection.md` |
| Next.js patterns | `knowledge/frameworks/nextjs.md` |
| Vite + React setup | `knowledge/frameworks/vite-react.md` |
| Plain HTML/CSS/JS | `knowledge/frameworks/html-css-js.md` |
| shadcn/ui components | `knowledge/libraries/shadcn-ui.md` |
| Tailwind utilities | `knowledge/libraries/tailwind.md` |
| Animations | `knowledge/libraries/framer-motion.md` |
| State management | `knowledge/libraries/zustand.md` |
| Database ORM | `knowledge/libraries/prisma.md` |
| Input validation | `knowledge/libraries/zod.md` |
| Authentication | `knowledge/libraries/nextauth.md` |
| Payments | `knowledge/libraries/stripe.md` |
| Forms | `knowledge/libraries/react-hook-form.md` |
| Copy-paste components | `knowledge/components-source/*.md` |

Read the knowledge file FIRST, then build. Don't reinvent patterns that are already documented.
Smaller models: copy code directly from knowledge files. Larger models: adapt patterns to context.

## Feature Map (MANDATORY for MVP + Production)

Every feature gets an entry in `.10x/feature-map.json` tracking:
- Which files implement it (frontend, backend, middleware, database, tests)
- Which agent built each file
- Data flow wiring (how user action flows through the system)
- Which global components are used
- Package dependencies and env vars needed

This is critical for refactoring — agents know exactly which files to touch for any feature change.

## Scope Awareness (MANDATORY)

The `scope` field in `.10x/project.json` controls everything:

| Scope | Stack | Agents | Testing | Deployment |
|-------|-------|--------|---------|------------|
| simple | HTML/CSS/JS | frontend only | manual check | static hosting |
| prototype | Vite+React | ui + frontend | none | quick deploy |
| mvp | Next.js | ui + front + back | critical paths | basic CI |
| production | Full stack | ALL agents | full suite | CI/CD + Docker |

NEVER overbuild for the scope. A simple landing page does NOT need React.

## Component Reuse (MANDATORY)

Read `.claude/components/registry.json` before building any UI.
- NEVER create a component that already exists in the registry
- NEVER put reusable components inside page files
- Global components go in `src/components/` (or root `components/` for Simple scope)

## User Communication

The user may not be an engineer. When talking to them:
- Describe what they'll SEE, not what the code does
- Say "your pricing page" not "the /pricing route component"
- Say "the login will remember you" not "we're using JWT session persistence"
- Only use technical terms if the user used them first

## Error Recovery

If something breaks during a build:
1. Log the error in `.10x/dev-log.md` with full details
2. DON'T silently skip it — tell the user what happened
3. Suggest a fix or alternative approach
4. If the fix requires user input, ask ONE clear question
5. Never retry the same failed action more than once without changing approach

## Cross-Agent Coordination

When multiple agents work on the same project:
- Backend-dev creates API endpoints → logs them in file-index.json with the response shape
- Frontend-dev reads file-index.json → knows exactly what endpoints exist and what they return
- QA-tester reads file-index.json → knows what to test
- No agent needs to ask another agent what they built — the index IS the communication channel

## Dev Log Format

Every entry:
```markdown
## [YYYY-MM-DD HH:MM] — [Action Title]
- **Agent:** [agent name]
- **Action:** [what was done]
- **Files created:** [list or "none"]
- **Files modified:** [list or "none"]
- **Task:** [task ID or "none"]
- **Result:** [success/failed + brief note]
---
```

## File Index Entry Format

Every file:
```json
{
  "path/to/file.tsx": {
    "type": "page|component|api|service|lib|hook|type|style|config|test|html|script|asset|deployment|migration|layout",
    "description": "One line — what this file does",
    "created_by": "agent name",
    "created_at": "ISO date",
    "dependencies": ["files this imports from"],
    "exports": ["what this file exports"],
    "api_shape": { "optional": "for API files — document request/response shape" }
  }
}
```

## Task Format

Every task:
```json
{
  "id": "task-XXX",
  "title": "Short title",
  "assigned_to": "agent name",
  "status": "pending|in_progress|completed|blocked|failed",
  "goal": "What this task should achieve",
  "expected_output": ["files to be created or modified"],
  "dependencies": ["task IDs that must complete first"],
  "notes": "Any context the agent needs"
}
```

## Available Skills

| Skill | Purpose |
|-------|---------|
| `/10x-development-team:help` | Show all commands and tips |
| `/10x-development-team:start` | New project — vision capture + scope selection |
| `/10x-development-team:build` | Execute the full build |
| `/10x-development-team:add-page` | Add a page to existing app |
| `/10x-development-team:add-feature` | Add a feature (frontend + backend) |
| `/10x-development-team:generate` | Generate specific code (component, api, hook, model, test) |
| `/10x-development-team:fix` | Fix a bug — describe the problem |
| `/10x-development-team:refactor` | Improve code quality |
| `/10x-development-team:review` | Code quality review |
| `/10x-development-team:explain` | Explain how something works |
| `/10x-development-team:deploy` | Set up deployment |
| `/10x-development-team:resume` | Continue from where you left off |
| `/10x-development-team:status` | Quick project overview |
| `/10x-development-team:update-deps` | Check/update dependencies |
| `/10x-development-team:config` | View/change project settings |
| `/10x-development-team:index` | View/rebuild project index |

## Available Agents

| Agent | Role | Scope |
|-------|------|-------|
| team-lead | Orchestrator — plans, delegates, tracks | All scopes |
| frontend-dev | UI, pages, components, HTML/CSS/JS | All scopes |
| backend-dev | APIs, database, auth, business logic | MVP + Production |
| ui-designer | Design system, tokens, visual consistency | Prototype + MVP + Production |
| qa-tester | Tests, lint, quality, dependency updates | MVP + Production |
| deployer | CI/CD, Docker, hosting | Production (or on request) |
| error-recovery | Fix build errors, crashes, conflicts | All scopes (on demand) |
