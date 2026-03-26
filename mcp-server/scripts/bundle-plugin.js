#!/usr/bin/env node

/**
 * Copies .claude/ plugin files into mcp-server/plugin/ for npm packaging.
 * Run before publish: npm run prebuild:package
 */

import { cpSync, mkdirSync, existsSync, rmSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

// Copy each directory
const dirs = ['skills', 'agents', 'knowledge', 'components', 'templates', 'scripts'];
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

console.log(`Plugin files bundled into: ${destDir}`);
