---
name: projects
description: List, switch between, and manage all projects created with the 10x Development Team. Uses SQLite persistent memory to track every app across sessions.
argument-hint: "[list | switch <name> | info <name> | delete <name> | search <query>]"
user-invocable: true
model: inherit
effort: low
context: fork
agent: team-lead
---

# 10x Development Team — Projects Manager

Manage all projects the user has ever created with this plugin. Data lives in `~/.10x/memory.db`.

## Step 0: Ensure Database Exists

```bash
# Check if memory.db exists
if [ ! -f ~/.10x/memory.db ]; then
  node .claude/scripts/db-init.js
fi
```

If db-init fails (better-sqlite3 not available), fall back to reading the database with the `sqlite3` CLI tool.

## Step 1: Parse Command

| `$ARGUMENTS` | Action |
|--------------|--------|
| empty or "list" | Show all projects |
| "switch [name]" | Open a different project |
| "info [name]" | Show detailed project info |
| "delete [name]" | Remove project from tracking (NOT from disk) |
| "search [query]" | Search projects by name, description, or stack |
| "recent" | Show 5 most recently opened projects |

## Step 2: Execute

### LIST (default)
```bash
sqlite3 -header -column ~/.10x/memory.db "
  SELECT
    name,
    scope,
    type,
    status,
    substr(path, -40) as location,
    date(last_opened_at) as last_opened
  FROM projects
  ORDER BY last_opened_at DESC;
"
```

Format as a clean table for the user:
```
Your Projects:

  #  Name              Scope       Status      Last Opened
  1  Invoice Manager   mvp         built       2026-03-25
  2  Portfolio Site     simple      built       2026-03-20
  3  SaaS Dashboard    production  building    2026-03-18
  4  Demo App          prototype   initialized 2026-03-15

[4 projects total]
```

### SWITCH
1. Find the project by name in the database
2. Read its `path` column
3. Check if the path still exists on disk
4. If exists: tell user "To continue working on [name], open Claude Code in [path] and run `/10x-development-team:resumeproject`"
5. If not exists: warn "The project folder at [path] no longer exists. Remove it from tracking?"
6. Update `last_opened_at` in the database

### INFO
```bash
sqlite3 -json ~/.10x/memory.db "
  SELECT * FROM projects WHERE name LIKE '%[name]%' LIMIT 1;
"
```

Also fetch:
- Session count and last session summary
- Key memories/decisions
- Files created count (from last session)

Format:
```
Project: [name]
Scope: [scope] | Type: [type] | Status: [status]
Path: [path]
Created: [date] | Last opened: [date]

Stack: [framework] + [styling] + [language] + [database]

Sessions: [count]
Last session: [summary]

Key decisions:
- [decision 1]
- [decision 2]

Features built:
- [from feature-map if available]
```

### DELETE
1. Find project by name
2. Confirm: "Remove [name] from project tracking? (This does NOT delete any files)"
3. DELETE from projects table (cascades to sessions and memories)
4. Confirm: "Removed. The project files at [path] are untouched."

### SEARCH
```bash
sqlite3 -header -column ~/.10x/memory.db "
  SELECT name, scope, status, path
  FROM projects
  WHERE name LIKE '%[query]%'
     OR description LIKE '%[query]%'
     OR stack_json LIKE '%[query]%'
  ORDER BY last_opened_at DESC;
"
```

### RECENT
```bash
sqlite3 -header -column ~/.10x/memory.db "
  SELECT name, scope, status, date(last_opened_at) as last_opened
  FROM projects
  ORDER BY last_opened_at DESC
  LIMIT 5;
"
```

## Integration with Other Skills

### /start — registers new project:
```bash
sqlite3 ~/.10x/memory.db "INSERT INTO projects (id, name, description, scope, type, stack_json, vision_json, path)
  VALUES (lower(hex(randomblob(8))), '[name]', '[desc]', '[scope]', '[type]', '[stack_json]', '[vision_json]', '[cwd]');"
```

### /resumeproject — loads project context:
```bash
# Get project
sqlite3 -json ~/.10x/memory.db "SELECT * FROM projects WHERE path = '[cwd]';"

# Get recent sessions
sqlite3 -json ~/.10x/memory.db "SELECT summary, tasks_completed, started_at FROM sessions WHERE project_id = '[id]' ORDER BY started_at DESC LIMIT 3;"

# Get memories
sqlite3 -json ~/.10x/memory.db "SELECT category, content FROM memories WHERE project_id = '[id]' ORDER BY created_at DESC LIMIT 10;"

# Update last opened
sqlite3 ~/.10x/memory.db "UPDATE projects SET last_opened_at = datetime('now') WHERE path = '[cwd]';"
```

### /build — saves session:
```bash
sqlite3 ~/.10x/memory.db "INSERT INTO sessions (id, project_id, summary, tasks_completed, files_created)
  VALUES (lower(hex(randomblob(8))), '[project_id]', '[summary]', '[tasks_json]', '[files_json]');"
```

### /config — saves decisions:
```bash
sqlite3 ~/.10x/memory.db "INSERT INTO memories (id, project_id, category, content)
  VALUES (lower(hex(randomblob(8))), '[project_id]', 'decision', '[what was decided and why]');"
```

## No Database Fallback

If SQLite is not available (web-based clients, sandboxed environments):
- Fall back to reading `.10x/project.json` in the current directory only
- Tell user: "Project memory works best with SQLite. Currently showing only the current project."
- Single-project mode still works — just no cross-project features
