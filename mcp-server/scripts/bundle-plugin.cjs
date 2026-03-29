#!/usr/bin/env node

/**
 * Copies .claude/ plugin files into mcp-server/plugin/ for npm packaging.
 * Run before publish: npm run prebuild:package
 *
 * NOTE: CommonJS (.cjs) for portability — this runs as a standalone script.
 */

const { cpSync, mkdirSync, existsSync, rmSync } = require('fs');
const { join, resolve } = require('path');

const packageRoot = resolve(__dirname, '..');
const repoRoot = resolve(packageRoot, '..');
const sourceDir = join(repoRoot, '.claude');
const destDir = join(packageRoot, 'plugin');

if (!existsSync(sourceDir)) {
  console.error('ERROR: .claude/ directory not found at repo root.');
  console.error('This script must be run from inside the 10x-development-team repo.');
  process.exit(1);
}

// Clean previous bundle
if (existsSync(destDir)) {
  rmSync(destDir, { recursive: true });
}
mkdirSync(destDir, { recursive: true });

// Copy each directory (including hooks!)
const dirs = ['skills', 'agents', 'knowledge', 'components', 'templates', 'scripts', 'hooks'];
for (const dir of dirs) {
  const src = join(sourceDir, dir);
  if (existsSync(src)) {
    cpSync(src, join(destDir, dir), { recursive: true });
    console.log(`  Bundled: ${dir}/`);
  }
}

// Copy individual files
const files = ['CLAUDE.md', 'QUICKSTART.md', 'settings.json'];
for (const file of files) {
  const src = join(sourceDir, file);
  if (existsSync(src)) {
    cpSync(src, join(destDir, file));
    console.log(`  Bundled: ${file}`);
  }
}

console.log(`\nPlugin files bundled into: ${destDir}`);
