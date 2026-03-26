# Plugin Memory — SQLite Persistent Storage Reference

The 10x Development Team uses a SQLite database at `~/.10x/memory.db` to remember all projects across sessions. This is SEPARATE from individual project `.10x/` directories.

## Architecture

```
~/.10x/                          ← User-level (persists forever)
  memory.db                      ← SQLite: all projects, chat context, references
  backups/                       ← Auto-backups of memory.db

/path/to/project-a/.10x/        ← Project-level (per project)
  project.json
  file-index.json
  tasks.json
  dev-log.md
  feature-map.json

/path/to/project-b/.10x/        ← Another project
  ...
```

## Schema

```sql
-- All projects the user has created with this plugin
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  scope TEXT NOT NULL CHECK(scope IN ('simple', 'prototype', 'mvp', 'production')),
  type TEXT NOT NULL,
  stack_json TEXT,           -- JSON blob of stack config
  path TEXT NOT NULL UNIQUE, -- Absolute path to project root
  status TEXT DEFAULT 'initialized',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  last_opened_at TEXT DEFAULT (datetime('now'))
);

-- Chat context / session summaries for each project
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  summary TEXT,              -- What happened in this session
  tasks_completed TEXT,      -- JSON array of task IDs completed
  tasks_created TEXT,        -- JSON array of task IDs created
  files_created TEXT,        -- JSON array of file paths created
  files_modified TEXT,       -- JSON array of file paths modified
  started_at TEXT DEFAULT (datetime('now')),
  ended_at TEXT,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Key decisions and context worth remembering
CREATE TABLE IF NOT EXISTS memories (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  category TEXT NOT NULL,    -- 'decision', 'preference', 'issue', 'context'
  content TEXT NOT NULL,     -- The actual memory
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Cross-project component reuse tracking
CREATE TABLE IF NOT EXISTS shared_patterns (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  source_project_id TEXT REFERENCES projects(id),
  pattern_type TEXT,         -- 'component', 'api', 'hook', 'util'
  file_content TEXT,         -- The actual code (for copying to new projects)
  created_at TEXT DEFAULT (datetime('now'))
);

-- Indexes for fast lookup
CREATE INDEX IF NOT EXISTS idx_projects_last_opened ON projects(last_opened_at DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_project ON sessions(project_id);
CREATE INDEX IF NOT EXISTS idx_memories_project ON memories(project_id);
```

## Init Script (Node.js)

```javascript
// .claude/scripts/db-init.js
// Run: node .claude/scripts/db-init.js

const Database = require('better-sqlite3')
const path = require('path')
const fs = require('fs')
const os = require('os')

const DB_DIR = path.join(os.homedir(), '.10x')
const DB_PATH = path.join(DB_DIR, 'memory.db')

// Ensure directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true })
}

const db = new Database(DB_PATH)

// Enable WAL mode for better concurrent access
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    scope TEXT NOT NULL CHECK(scope IN ('simple', 'prototype', 'mvp', 'production')),
    type TEXT NOT NULL,
    stack_json TEXT,
    path TEXT NOT NULL UNIQUE,
    status TEXT DEFAULT 'initialized',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    last_opened_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    summary TEXT,
    tasks_completed TEXT,
    tasks_created TEXT,
    files_created TEXT,
    files_modified TEXT,
    started_at TEXT DEFAULT (datetime('now')),
    ended_at TEXT,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS memories (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    category TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS shared_patterns (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    source_project_id TEXT REFERENCES projects(id),
    pattern_type TEXT,
    file_content TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_projects_last_opened ON projects(last_opened_at DESC);
  CREATE INDEX IF NOT EXISTS idx_sessions_project ON sessions(project_id);
  CREATE INDEX IF NOT EXISTS idx_memories_project ON memories(project_id);
`)

console.log('10x memory database initialized at:', DB_PATH)
db.close()
```

## Query Patterns (for agents)

### Register a new project
```bash
sqlite3 ~/.10x/memory.db "INSERT INTO projects (id, name, description, scope, type, stack_json, path) VALUES ('$(uuidgen)', 'My App', 'Invoice manager', 'mvp', 'webapp', '{\"framework\":\"next.js\"}', '$(pwd)');"
```

### List all projects (most recent first)
```bash
sqlite3 -header -column ~/.10x/memory.db "SELECT id, name, scope, status, path, last_opened_at FROM projects ORDER BY last_opened_at DESC;"
```

### Find project by path
```bash
sqlite3 ~/.10x/memory.db "SELECT * FROM projects WHERE path = '$(pwd)';"
```

### Update last opened
```bash
sqlite3 ~/.10x/memory.db "UPDATE projects SET last_opened_at = datetime('now') WHERE path = '$(pwd)';"
```

### Save session summary
```bash
sqlite3 ~/.10x/memory.db "INSERT INTO sessions (id, project_id, summary, tasks_completed, files_created) VALUES ('$(uuidgen)', '<project-id>', 'Built login page and dashboard', '[\"task-003\",\"task-004\"]', '[\"src/app/login/page.tsx\"]');"
```

### Save a memory/decision
```bash
sqlite3 ~/.10x/memory.db "INSERT INTO memories (id, project_id, category, content) VALUES ('$(uuidgen)', '<project-id>', 'decision', 'Using Supabase instead of Prisma because user already has a Supabase account');"
```

### Get project context (for resume)
```bash
sqlite3 -header -column ~/.10x/memory.db "
  SELECT m.category, m.content, m.created_at
  FROM memories m
  WHERE m.project_id = '<project-id>'
  ORDER BY m.created_at DESC
  LIMIT 20;
"
```

### Get recent sessions (for resume)
```bash
sqlite3 -header -column ~/.10x/memory.db "
  SELECT s.summary, s.tasks_completed, s.files_created, s.started_at
  FROM sessions s
  WHERE s.project_id = '<project-id>'
  ORDER BY s.started_at DESC
  LIMIT 5;
"
```

### Share a pattern across projects
```bash
sqlite3 ~/.10x/memory.db "INSERT INTO shared_patterns (id, name, description, source_project_id, pattern_type, file_content) VALUES ('$(uuidgen)', 'DataTable', 'Sortable data table with pagination', '<project-id>', 'component', '<file content>');"
```

## Agent Integration Points

### On `/start` (project initialization):
1. Run db-init.js if ~/.10x/memory.db doesn't exist
2. INSERT into projects table
3. CREATE first session entry

### On `/resume` (returning to project):
1. SELECT from projects WHERE path = current directory
2. SELECT recent sessions for context
3. SELECT memories for decisions/preferences
4. UPDATE last_opened_at

### On `/build` completion:
1. UPDATE session with tasks_completed, files_created
2. INSERT key decisions into memories

### On session end:
1. UPDATE session with ended_at and summary
2. INSERT any unlogged memories

### On `/projects` (new skill):
1. SELECT all projects ordered by last_opened_at
2. Display as list with name, scope, status, last activity
