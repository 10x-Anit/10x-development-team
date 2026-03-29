#!/usr/bin/env node

/**
 * postinstall script for 10x-development-team
 *
 * When a user runs `npm install 10x-development-team`, this script:
 * 1. Copies the .claude/ plugin files into their project root
 * 2. Creates the .10x/ directory for project tracking
 * 3. Creates skeleton files (.env, .env.example)
 * 4. Creates public/models/ directory for 3D assets
 * 5. Sets up .mcp.json with Playwright MCP wired in
 * 6. Installs Playwright (browser automation for screenshots/exploration)
 * 7. Prints clear next steps
 *
 * Skips if:
 * - Running inside the package's own repo (development mode)
 * - Running in CI (npm_config_ignore_scripts or CI env var)
 */

import { cpSync, existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ── Colors ──
const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
  dim: '\x1b[2m',
};

function success(msg) { console.log(`${c.green}  \u2713${c.reset} ${msg}`); }
function warn(msg) { console.log(`${c.yellow}  \u26A0${c.reset} ${msg}`); }
function info(msg) { console.log(`  ${msg}`); }
function fail(msg) { console.log(`${c.red}  \u2717${c.reset} ${msg}`); }

// ── Detect environment ──

// Skip in CI
if (process.env.CI || process.env.npm_config_ignore_scripts) {
  process.exit(0);
}

// The package root is two levels up from scripts/
const packageRoot = resolve(__dirname, '..');
const pluginDir = join(packageRoot, 'plugin');

// The project root is where node_modules lives
const projectRoot = process.env.INIT_CWD || resolve(packageRoot, '..', '..');

// Skip if we're running in the package's own repo (development mode)
if (resolve(projectRoot) === resolve(packageRoot) || resolve(projectRoot) === resolve(packageRoot, '..')) {
  process.exit(0);
}

// Skip if plugin files weren't bundled
if (!existsSync(pluginDir)) {
  process.exit(0);
}

// ══════════════════════════════════════════════════════════════════════════════
// PHASE 1: Copy plugin files (.claude/)
// ══════════════════════════════════════════════════════════════════════════════

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
      try {
        cpSync(src, dest, { recursive: true });
        filesInstalled++;
      } catch { /* silently skip */ }
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

// ══════════════════════════════════════════════════════════════════════════════
// PHASE 2: Create .10x/ directory + skeleton files
// ══════════════════════════════════════════════════════════════════════════════

const dotTenx = join(projectRoot, '.10x');
if (!existsSync(dotTenx)) {
  try {
    mkdirSync(dotTenx, { recursive: true });
    success('Created .10x/ project tracking directory');
  } catch { /* skip */ }
} else {
  success('.10x/ directory already exists');
}

// Create public/models/ for 3D assets
const publicModels = join(projectRoot, 'public', 'models');
if (!existsSync(publicModels)) {
  try {
    mkdirSync(publicModels, { recursive: true });
    // Add a .gitkeep so the directory is tracked
    writeFileSync(join(publicModels, '.gitkeep'), '');
    success('Created public/models/ for 3D assets');
  } catch { /* skip */ }
}

// Create public/textures/
const publicTextures = join(projectRoot, 'public', 'textures');
if (!existsSync(publicTextures)) {
  try {
    mkdirSync(publicTextures, { recursive: true });
    writeFileSync(join(publicTextures, '.gitkeep'), '');
    success('Created public/textures/ for materials');
  } catch { /* skip */ }
}

// Create public/hdri/
const publicHdri = join(projectRoot, 'public', 'hdri');
if (!existsSync(publicHdri)) {
  try {
    mkdirSync(publicHdri, { recursive: true });
    writeFileSync(join(publicHdri, '.gitkeep'), '');
    success('Created public/hdri/ for environment maps');
  } catch { /* skip */ }
}

// ══════════════════════════════════════════════════════════════════════════════
// PHASE 3: Create skeleton .env files
// ══════════════════════════════════════════════════════════════════════════════

const envExamplePath = join(projectRoot, '.env.example');
if (!existsSync(envExamplePath)) {
  const envContent = `# 10x Development Team — Environment Variables
# Copy this file to .env and fill in your values

# ── Database (MVP/Production scope) ──
DATABASE_URL=

# ── Authentication (MVP/Production scope) ──
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000

# ── External APIs ──
# Stripe (payments)
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Resend (email)
RESEND_API_KEY=

# Supabase (if using as backend)
SUPABASE_URL=
SUPABASE_ANON_KEY=

# ── 3D Assets ──
# Sketchfab API (optional — for downloading models programmatically)
SKETCHFAB_API_TOKEN=

# ── Deployment ──
VERCEL_TOKEN=
`;

  try {
    writeFileSync(envExamplePath, envContent);
    success('Created .env.example with all possible environment variables');
  } catch { /* skip */ }
}

const envPath = join(projectRoot, '.env');
if (!existsSync(envPath)) {
  try {
    writeFileSync(envPath, `# Auto-generated by 10x-development-team
# See .env.example for all available variables

# Add your environment variables below:
`);
    success('Created .env skeleton');
  } catch { /* skip */ }
}

// Add .env to .gitignore if not already there
const gitignorePath = join(projectRoot, '.gitignore');
if (existsSync(gitignorePath)) {
  try {
    const gitignore = readFileSync(gitignorePath, 'utf-8');
    const additions = [];
    if (!gitignore.includes('.env')) additions.push('.env');
    if (!gitignore.includes('.10x/screenshots')) additions.push('.10x/screenshots/');
    if (!gitignore.includes('.10x/pending-questions')) additions.push('.10x/pending-questions.json');

    if (additions.length > 0) {
      writeFileSync(gitignorePath, gitignore + '\n# 10x Development Team\n' + additions.join('\n') + '\n');
      success(`Updated .gitignore with: ${additions.join(', ')}`);
    }
  } catch { /* skip */ }
} else {
  try {
    writeFileSync(gitignorePath, `node_modules/
dist/
.env
.env.local
.10x/screenshots/
.10x/pending-questions.json
`);
    success('Created .gitignore');
  } catch { /* skip */ }
}

// ══════════════════════════════════════════════════════════════════════════════
// PHASE 4: Set up .mcp.json with Playwright MCP
// ══════════════════════════════════════════════════════════════════════════════

const mcpJsonPath = join(projectRoot, '.mcp.json');
if (!existsSync(mcpJsonPath)) {
  const isWindows = process.platform === 'win32';

  const mcpConfig = {
    mcpServers: {
      playwright: {
        command: isWindows ? 'cmd' : 'npx',
        args: isWindows
          ? ['/c', 'npx', '-y', '@playwright/mcp@latest']
          : ['-y', '@playwright/mcp@latest']
      },
      '10x-dev': {
        command: 'node',
        args: [join(packageRoot, 'dist', 'index.js')],
        env: {
          PROJECT_DIR: projectRoot,
          PLUGIN_ROOT: packageRoot
        }
      }
    }
  };

  try {
    writeFileSync(mcpJsonPath, JSON.stringify(mcpConfig, null, 2));
    success('Created .mcp.json with Playwright MCP + 10x MCP wired in');
  } catch { /* skip */ }
} else {
  // If .mcp.json exists, check if playwright is wired in
  try {
    const existing = JSON.parse(readFileSync(mcpJsonPath, 'utf-8'));
    let updated = false;

    if (!existing.mcpServers) existing.mcpServers = {};

    if (!existing.mcpServers.playwright) {
      const isWindows = process.platform === 'win32';
      existing.mcpServers.playwright = {
        command: isWindows ? 'cmd' : 'npx',
        args: isWindows
          ? ['/c', 'npx', '-y', '@playwright/mcp@latest']
          : ['-y', '@playwright/mcp@latest']
      };
      updated = true;
    }

    if (!existing.mcpServers['10x-dev']) {
      existing.mcpServers['10x-dev'] = {
        command: 'node',
        args: [join(packageRoot, 'dist', 'index.js')],
        env: {
          PROJECT_DIR: projectRoot,
          PLUGIN_ROOT: packageRoot
        }
      };
      updated = true;
    }

    if (updated) {
      writeFileSync(mcpJsonPath, JSON.stringify(existing, null, 2));
      success('Updated .mcp.json — added missing MCP servers (Playwright + 10x)');
    } else {
      success('.mcp.json already has Playwright + 10x configured');
    }
  } catch {
    warn('.mcp.json exists but could not be parsed');
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// PHASE 5: Install Playwright (for browser screenshots & site exploration)
// ══════════════════════════════════════════════════════════════════════════════

console.log('');
info(`${c.dim}Installing Playwright for browser automation...${c.reset}`);

try {
  // Install playwright as a dev dependency
  execSync('npm install -D playwright @playwright/mcp', {
    cwd: projectRoot,
    stdio: 'pipe',
    timeout: 120000
  });
  success('Installed Playwright + @playwright/mcp');

  // Install Chromium browser
  try {
    execSync('npx playwright install chromium', {
      cwd: projectRoot,
      stdio: 'pipe',
      timeout: 120000
    });
    success('Installed Chromium browser for Playwright');
  } catch {
    warn('Could not auto-install Chromium. Run: npx playwright install chromium');
  }
} catch {
  warn('Could not install Playwright automatically.');
  info(`${c.dim}Run manually: npm install -D playwright @playwright/mcp && npx playwright install chromium${c.reset}`);
}

// ══════════════════════════════════════════════════════════════════════════════
// PHASE 6: Create .10x/assets.json for 3D asset tracking
// ══════════════════════════════════════════════════════════════════════════════

const assetsJson = join(dotTenx, 'assets.json');
if (!existsSync(assetsJson)) {
  try {
    writeFileSync(assetsJson, JSON.stringify([], null, 2));
    success('Created .10x/assets.json for 3D asset tracking');
  } catch { /* skip */ }
}

// ══════════════════════════════════════════════════════════════════════════════
// DONE — Print next steps
// ══════════════════════════════════════════════════════════════════════════════

console.log('');
console.log(`${c.bold}${c.green}  Setup complete!${c.reset} Here's what to do next:`);
console.log('');
info(`${c.bold}1.${c.reset} Open Claude Code in this project`);
info(`${c.bold}2.${c.reset} Type: ${c.cyan}/10x-development-team:start${c.reset}`);
info(`${c.bold}3.${c.reset} Describe what you want to build`);
console.log('');
info(`${c.dim}Installed for you:${c.reset}`);
info(`  ${c.green}\u2713${c.reset} .claude/ — AI agent skills, knowledge, components`);
info(`  ${c.green}\u2713${c.reset} .10x/ — project tracking & asset registry`);
info(`  ${c.green}\u2713${c.reset} .mcp.json — Playwright MCP + 10x MCP servers`);
info(`  ${c.green}\u2713${c.reset} .env + .env.example — environment variable skeletons`);
info(`  ${c.green}\u2713${c.reset} public/models/ — ready for 3D assets (GLB, GLTF)`);
info(`  ${c.green}\u2713${c.reset} Playwright — browser automation for screenshots & exploration`);
console.log('');
info(`${c.dim}MCP server mode: npx 10x-development-team setup${c.reset}`);
info(`${c.dim}Health check: npx 10x-development-team doctor${c.reset}`);
console.log('');
