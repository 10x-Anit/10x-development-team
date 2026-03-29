import { getDbPath } from './utils.js';
import { randomBytes } from 'crypto';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

/**
 * SQLite database wrapper with graceful fallback.
 *
 * If better-sqlite3 is not available (e.g., Windows native module issues,
 * sandboxed environments), ALL database operations return safe defaults
 * instead of crashing the server. The MCP server works without SQLite —
 * it just loses cross-session persistent memory (file-based .10x/ still works).
 */

let db: any = null;
let sqliteAvailable: boolean | null = null;
let Database: any = null;

function genId(): string {
  return randomBytes(8).toString('hex');
}

/**
 * Try to load better-sqlite3. Returns true if available, false otherwise.
 * Caches the result so we only try once.
 */
function checkSqlite(): boolean {
  if (sqliteAvailable !== null) return sqliteAvailable;
  try {
    Database = require('better-sqlite3');
    sqliteAvailable = true;
  } catch {
    console.error('[10x-mcp] better-sqlite3 not available — persistent memory disabled. File-based .10x/ index still works.');
    sqliteAvailable = false;
  }
  return sqliteAvailable;
}

/**
 * Get or create the SQLite database connection.
 * Returns null if SQLite is not available.
 */
export function getDb(): any {
  if (db) return db;
  if (!checkSqlite()) return null;

  try {
    const dbPath = getDbPath();
    db = new Database(dbPath);

    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    db.pragma('busy_timeout = 5000');

    // Create schema if not exists
    db.exec(`
      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        scope TEXT NOT NULL CHECK(scope IN ('simple', 'prototype', 'mvp', 'production')),
        type TEXT NOT NULL DEFAULT 'webapp',
        stack_json TEXT DEFAULT '{}',
        vision_json TEXT DEFAULT '{}',
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
        tasks_completed TEXT DEFAULT '[]',
        tasks_created TEXT DEFAULT '[]',
        files_created TEXT DEFAULT '[]',
        files_modified TEXT DEFAULT '[]',
        errors_encountered TEXT DEFAULT '[]',
        started_at TEXT DEFAULT (datetime('now')),
        ended_at TEXT,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS memories (
        id TEXT PRIMARY KEY,
        project_id TEXT NOT NULL,
        category TEXT NOT NULL CHECK(category IN ('decision', 'preference', 'issue', 'context', 'user_feedback')),
        content TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS shared_patterns (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        source_project_id TEXT,
        pattern_type TEXT CHECK(pattern_type IN ('component', 'api', 'hook', 'util', 'config', 'template')),
        file_path TEXT,
        file_content TEXT,
        tags TEXT DEFAULT '[]',
        usage_count INTEGER DEFAULT 0,
        created_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (source_project_id) REFERENCES projects(id) ON DELETE SET NULL
      );

      CREATE INDEX IF NOT EXISTS idx_projects_last_opened ON projects(last_opened_at DESC);
      CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
      CREATE INDEX IF NOT EXISTS idx_sessions_project ON sessions(project_id);
      CREATE INDEX IF NOT EXISTS idx_sessions_started ON sessions(started_at DESC);
      CREATE INDEX IF NOT EXISTS idx_memories_project ON memories(project_id);
      CREATE INDEX IF NOT EXISTS idx_memories_category ON memories(category);
    `);

    return db;
  } catch (err) {
    console.error('[10x-mcp] SQLite init failed:', (err as Error).message);
    sqliteAvailable = false;
    db = null;
    return null;
  }
}

// ── Project Operations ──

export function registerProject(
  name: string,
  description: string,
  scope: string,
  type: string,
  stackJson: string,
  visionJson: string,
  path: string
): string {
  const database = getDb();
  if (!database) return genId(); // return a fake ID, no persistence
  const id = genId();
  database.prepare(`
    INSERT OR REPLACE INTO projects (id, name, description, scope, type, stack_json, vision_json, path)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, name, description, scope, type, stackJson, visionJson, path);
  return id;
}

export function listProjects(): unknown[] {
  const database = getDb();
  if (!database) return [];
  return database.prepare('SELECT id, name, scope, type, status, path, last_opened_at FROM projects ORDER BY last_opened_at DESC').all();
}

export function getProjectByPath(path: string): unknown | undefined {
  const database = getDb();
  if (!database) return undefined;
  return database.prepare('SELECT * FROM projects WHERE path = ?').get(path);
}

export function getProjectById(id: string): unknown | undefined {
  const database = getDb();
  if (!database) return undefined;
  return database.prepare('SELECT * FROM projects WHERE id = ?').get(id);
}

export function updateProjectStatus(id: string, status: string): void {
  const database = getDb();
  if (!database) return;
  database.prepare('UPDATE projects SET status = ?, updated_at = datetime(\'now\') WHERE id = ?').run(status, id);
}

export function touchProject(path: string): void {
  const database = getDb();
  if (!database) return;
  database.prepare('UPDATE projects SET last_opened_at = datetime(\'now\') WHERE path = ?').run(path);
}

export function deleteProject(id: string): void {
  const database = getDb();
  if (!database) return;
  database.prepare('DELETE FROM projects WHERE id = ?').run(id);
}

export function searchProjects(query: string): unknown[] {
  const database = getDb();
  if (!database) return [];
  const like = `%${query}%`;
  return database.prepare(`
    SELECT id, name, scope, type, status, path, last_opened_at
    FROM projects
    WHERE name LIKE ? OR description LIKE ? OR stack_json LIKE ?
    ORDER BY last_opened_at DESC
  `).all(like, like, like);
}

// ── Session Operations ──

export function createSession(projectId: string, summary?: string): string {
  const database = getDb();
  const id = genId();
  if (!database) return id;
  database.prepare('INSERT INTO sessions (id, project_id, summary) VALUES (?, ?, ?)').run(id, projectId, summary || null);
  return id;
}

export function updateSession(id: string, updates: {
  summary?: string;
  tasks_completed?: string;
  files_created?: string;
  files_modified?: string;
}): void {
  const database = getDb();
  if (!database) return;
  const parts: string[] = [];
  const values: unknown[] = [];
  if (updates.summary !== undefined) { parts.push('summary = ?'); values.push(updates.summary); }
  if (updates.tasks_completed !== undefined) { parts.push('tasks_completed = ?'); values.push(updates.tasks_completed); }
  if (updates.files_created !== undefined) { parts.push('files_created = ?'); values.push(updates.files_created); }
  if (updates.files_modified !== undefined) { parts.push('files_modified = ?'); values.push(updates.files_modified); }
  if (parts.length === 0) return;
  parts.push('ended_at = datetime(\'now\')');
  values.push(id);
  database.prepare(`UPDATE sessions SET ${parts.join(', ')} WHERE id = ?`).run(...values);
}

export function getRecentSessions(projectId: string, limit = 5): unknown[] {
  const database = getDb();
  if (!database) return [];
  return database.prepare('SELECT * FROM sessions WHERE project_id = ? ORDER BY started_at DESC LIMIT ?').all(projectId, limit);
}

// ── Memory Operations ──

export function saveMemory(projectId: string, category: string, content: string): string {
  const database = getDb();
  const id = genId();
  if (!database) return id;
  database.prepare('INSERT INTO memories (id, project_id, category, content) VALUES (?, ?, ?, ?)').run(id, projectId, category, content);
  return id;
}

export function getMemories(projectId: string, limit = 20): unknown[] {
  const database = getDb();
  if (!database) return [];
  return database.prepare('SELECT * FROM memories WHERE project_id = ? ORDER BY created_at DESC LIMIT ?').all(projectId, limit);
}

/**
 * Check if SQLite is available
 */
export function isSqliteAvailable(): boolean {
  return checkSqlite();
}

/**
 * Close the database connection
 */
export function closeDb(): void {
  if (db) {
    try { db.close(); } catch { /* ignore close errors */ }
    db = null;
  }
}
