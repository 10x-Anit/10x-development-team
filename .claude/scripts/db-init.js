#!/usr/bin/env node

// 10x Development Team — SQLite Memory Database Initializer
// Creates ~/.10x/memory.db with schema for cross-project persistent memory.
//
// Usage: node .claude/scripts/db-init.js
// Dependencies: better-sqlite3 (auto-installed if missing)

const path = require('path')
const fs = require('fs')
const os = require('os')
const { execSync } = require('child_process')

const DB_DIR = path.join(os.homedir(), '.10x')
const DB_PATH = path.join(DB_DIR, 'memory.db')
const BACKUP_DIR = path.join(DB_DIR, 'backups')

// Ensure directories exist
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true })
  console.log('Created:', DB_DIR)
}
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true })
}

// Try to load better-sqlite3, install if missing
let Database
try {
  Database = require('better-sqlite3')
} catch {
  console.log('Installing better-sqlite3...')
  execSync('npm install -g better-sqlite3', { stdio: 'inherit' })
  // Try global path
  const globalPath = execSync('npm root -g', { encoding: 'utf8' }).trim()
  Database = require(path.join(globalPath, 'better-sqlite3'))
}

// Backup existing DB before schema changes
if (fs.existsSync(DB_PATH)) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backupPath = path.join(BACKUP_DIR, `memory-${timestamp}.db`)
  fs.copyFileSync(DB_PATH, backupPath)
  console.log('Backup created:', backupPath)
}

const db = new Database(DB_PATH)

// Performance + safety settings
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')
db.pragma('busy_timeout = 5000')

// Create schema
db.exec(`
  -- All projects created with the 10x Development Team plugin
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

  -- Session history per project
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

  -- Key decisions, preferences, and context
  CREATE TABLE IF NOT EXISTS memories (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    category TEXT NOT NULL CHECK(category IN ('decision', 'preference', 'issue', 'context', 'user_feedback')),
    content TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
  );

  -- Reusable patterns across projects
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

  -- Indexes
  CREATE INDEX IF NOT EXISTS idx_projects_last_opened ON projects(last_opened_at DESC);
  CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
  CREATE INDEX IF NOT EXISTS idx_sessions_project ON sessions(project_id);
  CREATE INDEX IF NOT EXISTS idx_sessions_started ON sessions(started_at DESC);
  CREATE INDEX IF NOT EXISTS idx_memories_project ON memories(project_id);
  CREATE INDEX IF NOT EXISTS idx_memories_category ON memories(category);
  CREATE INDEX IF NOT EXISTS idx_shared_patterns_type ON shared_patterns(pattern_type);
`)

// Verify
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all()
console.log('Database ready at:', DB_PATH)
console.log('Tables:', tables.map(t => t.name).join(', '))

const projectCount = db.prepare('SELECT COUNT(*) as count FROM projects').get()
console.log('Projects tracked:', projectCount.count)

db.close()
