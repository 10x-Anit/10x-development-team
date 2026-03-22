---
name: status
description: Quick project status dashboard. Reads index files only — no filesystem scanning.
user-invocable: true
model: inherit
effort: low
---

# 10x Development Team — Status

## STEP 0: Check Project Exists

Check if `.10x/project.json` exists.
If NO → tell user: "No project found. Run /10x-development-team:start to begin." STOP.

## STEP 1: Read Index Files (all 4)

```
ACTION 1: Read .10x/project.json → extract: name, scope, status, current_phase, stack
ACTION 2: Read .10x/tasks.json → count: completed, in_progress, pending, blocked, failed
ACTION 3: Read .10x/file-index.json → count files by type
ACTION 4: Read .10x/dev-log.md → extract last 3 entries (read last 30 lines of file)
```

## STEP 2: Output EXACTLY This Format

```
╔══════════════════════════════════════╗
║  [name] — [scope] — [status]       ║
╚══════════════════════════════════════╝

Stack: [framework] + [styling] + [database or "no backend"]
Phase: [current_phase]

Files:
  Pages:      [count of type=page]
  Components: [count of type=component]
  APIs:       [count of type=api]
  Services:   [count of type=service]
  Tests:      [count of type=test]
  Config:     [count of type=config]
  Other:      [remaining count]
  Total:      [total count]

Tasks:
  ✓ Completed:   [count]
  → In Progress: [count]
  ○ Pending:     [count]
  ✗ Blocked:     [count]

Recent:
  [last 3 dev-log entries — one line each: date + action title]

Commands:
  :add-page     Add a new page
  :add-feature  Add a feature
  :fix          Fix a bug
  :review       Code review
  :deploy       Set up deployment
```

## Rules
1. This skill is READ-ONLY. NEVER modify any file.
2. NEVER scan the filesystem. Use index files only.
3. Output the format EXACTLY as shown above.
