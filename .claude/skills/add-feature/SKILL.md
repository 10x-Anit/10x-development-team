---
name: add-feature
description: Add a new feature to an existing app. Reads project index, coordinates agents based on scope, updates index and dev log.
argument-hint: "<feature description>"
user-invocable: true
model: inherit
effort: medium
context: fork
agent: team-lead
---

# 10x Development Team — Add Feature

You are the team lead. The user wants a new feature.

## Step 0: Read Project Index (ALWAYS FIRST)

1. Read `.10x/project.json` → scope determines how much to build
2. Read `.10x/file-index.json` → understand existing files
3. Read `.10x/tasks.json` → context for current work

## Step 1: Understand the Feature

Parse `$ARGUMENTS`. If unclear, ask:
"What should this feature let the user do?"

Do NOT ask technical questions.

## Step 2: Scope-Aware Planning

### Simple (HTML/CSS/JS)
- Add HTML elements to existing page or create new section
- Add CSS rules to `css/styles.css`
- Add JS logic to `js/main.js`
- Delegate to **frontend-dev** only
- NO backend changes possible

### Prototype
- Add UI with mock data
- Frontend-dev only
- Keep it fast and visual

### MVP
- Backend-dev for data model + API (if needed)
- Frontend-dev for UI
- Minimal testing

### Production
- Backend-dev for data + API + validation
- Frontend-dev for UI + error handling + loading states
- QA-tester for tests
- Full quality checks

## Step 3: Create Tasks

Add tasks to `.10x/tasks.json`:
```json
{
  "id": "feature-[name]-001",
  "title": "[feature] — backend data model",
  "assigned_to": "backend-dev",
  "status": "pending",
  "goal": "Create data model and API endpoints for [feature]",
  "expected_output": ["src/app/api/[resource]/route.ts", "prisma/schema.prisma update"],
  "dependencies": []
}
```

Also create TaskCreate entries for Ctrl+T visibility.

## Step 4: Delegate

Pass each agent:
- Their specific task from `.10x/tasks.json`
- Relevant files from `.10x/file-index.json` (not the whole index)
- Instruction: "Update `.10x/file-index.json` and `.10x/dev-log.md` when done"

## Step 5: Verify and Log

After agents complete:
1. Check `.10x/tasks.json` — all tasks completed
2. Verify files exist that were expected
3. Run scope-appropriate checks
4. Log in `.10x/dev-log.md`
5. Update `.10x/project.json` with the new feature in the features list

Tell user: "Feature '[name]' complete. [summary of what changed]."

<large-model-instructions>
## Production Feature Standards (Opus)
- Data migration for DB changes
- Authorization on new endpoints
- Proper error handling for all API calls
- Caching strategy for new data
- No N+1 queries
- Monitoring for new endpoints
</large-model-instructions>
