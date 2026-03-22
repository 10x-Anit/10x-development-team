---
name: build
description: Execute the full build process. Reads project index, plans architecture based on scope, delegates to specialist agents, maintains file index and dev log.
argument-hint: "<vision summary from /start>"
user-invocable: true
model: inherit
effort: high
context: fork
agent: team-lead
---

# 10x Development Team — Full Build

You are the team lead. Execute the build based on the project scope.

## Step 0: Read Project Index (ALWAYS DO THIS FIRST)

Read `.10x/project.json` to understand:
- App name, description, scope, type
- Vision: target users, core features, first screen

Read `.10x/file-index.json` to see what already exists.
Read `.10x/tasks.json` to see current task state.

NEVER scan the filesystem to understand the project. The index IS the truth.

## Step 1: Pick the Right Stack for the Scope

### Simple (HTML/CSS/JS)
- NO frameworks, NO npm, NO build tools
- Create: index.html, css/styles.css, js/main.js
- Use the `simple-html` template from `.claude/templates/simple-html/scaffold.md`
- Skip backend, auth, testing, deployment agents
- Only use: **frontend-dev** agent (and only for HTML/CSS/JS)

### Prototype / Demo
- Vite + React (lightweight, fast)
- Tailwind for quick styling
- Mock data in `src/mock/data.ts` — NO real backend
- Use the `prototype` template
- Only use: **ui-designer** + **frontend-dev** agents
- Skip: backend-dev, qa-tester, deployer

### MVP
- Next.js App Router + Tailwind + SQLite or Supabase
- Basic auth (email/password)
- Real data but minimal features
- Use the `mvp` template
- Use: **ui-designer** + **frontend-dev** + **backend-dev** agents
- Skip: deployer (unless asked), lighter testing

### Production
- Full stack: Next.js + Tailwind + PostgreSQL + Auth + Testing + CI/CD
- Pick the right template: `saas-webapp`, `dashboard`, `e-commerce`, or `landing-page`
- Use ALL agents: ui-designer, frontend-dev, backend-dev, qa-tester, deployer

Update `.10x/project.json` with the chosen stack:
```json
{
  "stack": {
    "framework": "next.js|vite|html",
    "styling": "tailwind|css",
    "language": "typescript|javascript",
    "backend": "next-api|express|none",
    "database": "postgresql|sqlite|supabase|none",
    "auth": "nextauth|supabase|none",
    "testing": "vitest|none",
    "deployment": "vercel|docker|none"
  }
}
```

## Step 2: Present Plan to User

Show the plan based on scope. For Simple/Prototype, keep it SHORT:

**Simple:**
```
Plan:
1. Create HTML structure with semantic elements
2. Add CSS styling (responsive)
3. Add JavaScript interactions
Done.
```

**Prototype:**
```
Plan:
1. Scaffold Vite + React project
2. Set up design tokens
3. Build pages with mock data
4. Add basic routing
Done.
```

**MVP / Production:** Full task list with milestones.

Wait for user approval before proceeding.

## Step 3: Create Task List

Create tasks in `.10x/tasks.json`. Each task:
```json
{
  "id": "task-001",
  "title": "Scaffold project",
  "assigned_to": "team-lead",
  "status": "pending",
  "goal": "Create project structure matching the chosen template",
  "expected_output": ["package.json", "src/", "tsconfig.json"],
  "dependencies": [],
  "created_at": "[ISO date]"
}
```

Also create TaskCreate entries so user sees them in Ctrl+T.

## Step 4: Scaffold Project

Run the scaffold command from the chosen template.
After scaffolding, index ALL created files in `.10x/file-index.json`:

```json
{
  "files": {
    "src/app/layout.tsx": {
      "type": "layout",
      "description": "Root layout with HTML head, body, providers",
      "created_by": "team-lead",
      "created_at": "[ISO date]",
      "dependencies": ["src/styles/globals.css"],
      "exports": ["RootLayout"]
    },
    "src/app/page.tsx": {
      "type": "page",
      "description": "Home page — landing content",
      "created_by": "frontend-dev",
      "created_at": "[ISO date]",
      "dependencies": ["src/components/ui/button.tsx"],
      "exports": ["HomePage"]
    }
  }
}
```

Log the scaffold in `.10x/dev-log.md`.

## Step 5: Delegate to Specialists

Pass each agent ONLY what they need. Include:
1. The specific task from `.10x/tasks.json`
2. The relevant section of `.10x/file-index.json`
3. The component registry path for frontend work

When delegating, tell the agent:
- "Read `.10x/project.json` for project context."
- "After creating/editing files, update `.10x/file-index.json`."
- "Log your work in `.10x/dev-log.md`."

Delegate in dependency order:
1. **Scaffolding** (team-lead does this)
2. **Design system** → ui-designer
3. **Frontend pages** → frontend-dev
4. **Backend APIs** → backend-dev (if scope requires)
5. **Tests** → qa-tester (if scope requires)
6. **Deployment** → deployer (if scope requires)

## Step 6: Verify and Complete

After all agents complete:
1. Read `.10x/tasks.json` — confirm all tasks are "completed"
2. Read `.10x/file-index.json` — confirm all expected files exist
3. Run appropriate verification:
   - Simple: check HTML is valid
   - Prototype: `npm run dev` starts without errors
   - MVP: `npm run build` + `npm test` pass
   - Production: full test suite + build + lint pass
4. Update `.10x/project.json` status to "built"
5. Log completion in `.10x/dev-log.md`

Tell the user what was built and how to run it.

<large-model-instructions>
## Production Build Standards (Opus)
- TypeScript strict mode, path aliases
- ESLint + Prettier configured
- .env.example with all variables documented
- Proper SEO: sitemap, robots.txt, meta tags
- Error monitoring ready (Sentry placeholder)
- Performance budget: Lighthouse 90+
- Rate limiting on API routes
- CORS + security headers configured
- Input sanitization on all endpoints
- Proper logging with structured output
</large-model-instructions>
