---
name: resume
description: Resume working on an existing project. Reads the project index system to understand state, shows progress, and continues where you left off.
user-invocable: true
model: inherit
effort: medium
context: fork
agent: team-lead
---

# 10x Development Team — Resume Project

You are the team lead. The user is returning to continue their project.

## Step 1: Load from Project Index + Persistent Memory

Read the project index files in this exact order:
1. `.10x/project.json` → app name, scope, status, stack, vision
2. `.10x/tasks.json` → task states (completed, in progress, pending)
3. `.10x/file-index.json` → all files and their purposes (DO NOT scan filesystem)
4. `.10x/dev-log.md` → last 10 entries to see what was done recently

Then load cross-session context from SQLite (if available):
```bash
# Update last opened timestamp
sqlite3 ~/.10x/memory.db "UPDATE projects SET last_opened_at = datetime('now') WHERE path = '$(pwd)';" 2>/dev/null

# Get previous session summaries
sqlite3 -json ~/.10x/memory.db "SELECT summary, tasks_completed, started_at FROM sessions WHERE project_id = (SELECT id FROM projects WHERE path = '$(pwd)') ORDER BY started_at DESC LIMIT 5;" 2>/dev/null

# Get saved decisions and context
sqlite3 -json ~/.10x/memory.db "SELECT category, content, created_at FROM memories WHERE project_id = (SELECT id FROM projects WHERE path = '$(pwd)') ORDER BY created_at DESC LIMIT 15;" 2>/dev/null
```

If SQLite is not available, fall back to auto memory and dev-log.md only. Do NOT tell the user about the database — just use whatever context is available.

Use the session summaries and memories to understand:
- What was the user working on last time?
- What decisions were made that affect current work?
- Were there any unresolved issues from previous sessions?

## Step 2: Status Report

Tell the user:
```
Welcome back to [App Name]!

Scope: [Simple/Prototype/MVP/Production]
Status: [from project.json]

Tasks:
  ✓ Completed: [count]
  → In Progress: [count]
  ○ Pending: [count]

Last activity:
  [last 3 dev-log entries summarized]

Files: [count from file index]
```

## Step 3: Ask What's Next

"What would you like to do?"
- Continue with the next pending task
- Add a new page
- Add a new feature
- Fix or change something
- Review the code
- Set up deployment
- Rebuild the index (if things seem off)

Based on answer, invoke the right skill:
- Continue → pick next pending task from `.10x/tasks.json` and execute
- New page → `/10x-development-team:add-page`
- New feature → `/10x-development-team:add-feature`
- Review → `/10x-development-team:review`
- Deploy → `/10x-development-team:deploy`
- Rebuild index → `/10x-development-team:index rebuild`

## Step 4: Update Memory

After the session, save context to both auto memory and SQLite:

```bash
# Save session to persistent memory
sqlite3 ~/.10x/memory.db "INSERT INTO sessions (id, project_id, summary, tasks_completed, tasks_created, files_created, files_modified)
  VALUES (
    lower(hex(randomblob(8))),
    (SELECT id FROM projects WHERE path = '$(pwd)'),
    '[summary of what was done]',
    '[JSON array of completed task IDs]',
    '[JSON array of created task IDs]',
    '[JSON array of files created]',
    '[JSON array of files modified]'
  );" 2>/dev/null

# Save any key decisions
sqlite3 ~/.10x/memory.db "INSERT INTO memories (id, project_id, category, content)
  VALUES (lower(hex(randomblob(8))), (SELECT id FROM projects WHERE path = '$(pwd)'), 'context', '[what the user was working on and what to continue next]');" 2>/dev/null
```

Also update auto memory with current state for fallback.
