#!/usr/bin/env node

/**
 * postinstall script for 10x-development-team
 *
 * When a user runs `npm install 10x-development-team`, this script:
 * 1. Copies the .claude/ plugin files into their project root
 * 2. Creates the .10x/ directory for project tracking
 * 3. Prints clear next steps
 *
 * Skips if:
 * - Running inside the package's own repo (development mode)
 * - Running in CI (npm_config_ignore_scripts or CI env var)
 */

import { cpSync, existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ── Colors ──
const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
};

function success(msg) { console.log(`${c.green}  \u2713${c.reset} ${msg}`); }
function warn(msg) { console.log(`${c.yellow}  \u26A0${c.reset} ${msg}`); }
function info(msg) { console.log(`  ${msg}`); }

// ── Detect environment ──

// Skip in CI
if (process.env.CI || process.env.npm_config_ignore_scripts) {
  process.exit(0);
}

// The package root is two levels up from scripts/
const packageRoot = resolve(__dirname, '..');
const pluginDir = join(packageRoot, 'plugin');

// The project root is where node_modules lives (3 levels up from node_modules/10x-development-team/scripts/)
// npm sets INIT_CWD to the directory where `npm install` was run
const projectRoot = process.env.INIT_CWD || resolve(packageRoot, '..', '..');

// Skip if we're running in the package's own repo (development mode)
if (resolve(projectRoot) === resolve(packageRoot) || resolve(projectRoot) === resolve(packageRoot, '..')) {
  process.exit(0);
}

// Skip if plugin files weren't bundled
if (!existsSync(pluginDir)) {
  process.exit(0);
}

// ── Copy plugin files ──

console.log('');
console.log(`${c.bold}${c.cyan}  10x Development Team \u2014 Setting up your project...${c.reset}`);
console.log('');

const targetClaude = join(projectRoot, '.claude');
let filesInstalled = 0;

// Copy plugin directories into .claude/
const dirs = ['skills', 'agents', 'knowledge', 'components', 'templates', 'scripts'];
for (const dir of dirs) {
  const src = join(pluginDir, dir);
  const dest = join(targetClaude, dir);
  if (existsSync(src)) {
    try {
      cpSync(src, dest, { recursive: true, force: false });
      filesInstalled++;
    } catch {
      // force:false may throw on some platforms if files exist, that's ok
      try {
        cpSync(src, dest, { recursive: true });
        filesInstalled++;
      } catch {
        // silently skip if copy fails
      }
    }
  }
}

// Copy individual files
const files = ['CLAUDE.md', 'QUICKSTART.md', 'settings.json'];
for (const file of files) {
  const src = join(pluginDir, file);
  const dest = join(targetClaude, file);
  if (existsSync(src)) {
    if (!existsSync(dest)) {
      try {
        mkdirSync(dirname(dest), { recursive: true });
        writeFileSync(dest, readFileSync(src));
        filesInstalled++;
      } catch { /* skip */ }
    }
  }
}

if (filesInstalled > 0) {
  success(`Plugin files installed to ${c.bold}.claude/${c.reset}`);
} else {
  warn('.claude/ already exists (existing files preserved)');
}

// ── Create .10x/ directory ──
const dotTenx = join(projectRoot, '.10x');
if (!existsSync(dotTenx)) {
  try {
    mkdirSync(dotTenx, { recursive: true });
    success('Created .10x/ project tracking directory');
  } catch { /* skip */ }
} else {
  success('.10x/ directory already exists');
}

// ── Print next steps ──
console.log('');
console.log(`${c.bold}  Setup complete!${c.reset} Here's what to do next:`);
console.log('');
info(`${c.bold}1.${c.reset} Open Claude Code in this project`);
info(`${c.bold}2.${c.reset} Type: ${c.cyan}/10x-development-team:start${c.reset}`);
info(`${c.bold}3.${c.reset} Describe what you want to build`);
console.log('');
info(`${c.dim}For MCP server mode: npx 10x-development-team setup${c.reset}`);
info(`${c.dim}Health check: npx 10x-development-team doctor${c.reset}`);
console.log('');
