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

## Step 1: Load from Project Index (NOT filesystem scanning)

Read in this exact order:
1. `.10x/project.json` → app name, scope, status, stack, vision
2. `.10x/tasks.json` → task states (completed, in progress, pending)
3. `.10x/file-index.json` → all files and their purposes (DO NOT scan filesystem)
4. `.10x/dev-log.md` → last 10 entries to see what was done recently

Also check auto memory for any saved context from previous sessions.

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

After the session, update auto memory with current state.
