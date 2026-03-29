#!/usr/bin/env node

/**
 * postinstall script for 10x-development-team
 *
 * When a user runs `npm install 10x-development-team` in their project, this:
 * 1. Copies all plugin files (.claude/) into the project root
 * 2. Creates .10x/ directory for project tracking
 * 3. Creates .env, .env.example skeletons
 * 4. Creates public/models/ for 3D assets
 * 5. Sets up .mcp.json with MCP servers
 *
 * IMPORTANT: This file MUST remain CommonJS (.cjs) for maximum portability.
 * ESM postinstall scripts fail when the consumer has a different module system.
 *
 * Skips when:
 * - Running in the package's own repo (development)
 * - Running as global install (npm install -g)
 * - Running in CI
 * - Plugin files weren't bundled
 */

const { cpSync, existsSync, mkdirSync, writeFileSync, readFileSync, readdirSync, statSync } = require('fs');
const { join, resolve, dirname } = require('path');

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
function fail(msg) { console.log(`${c.red}  \u2717${c.reset} ${msg}`); }
function info(msg) { console.log(`  ${msg}`); }

// ── Skip conditions ──

// Skip in CI
if (process.env.CI || process.env.npm_config_ignore_scripts) {
  process.exit(0);
}

// The package root is one level up from scripts/
const packageRoot = resolve(__dirname, '..');
const pluginDir = join(packageRoot, 'plugin');

// The project root is where the user ran npm install
const projectRoot = process.env.INIT_CWD || process.cwd();

// Detect global install: if the package is being installed to a global prefix,
// don't try to install plugin files into a random directory
const isGlobalInstall = (function() {
  // npm sets npm_config_global when doing global install
  if (process.env.npm_config_global === 'true') return true;
  // Also check if package is inside a global node_modules
  const globalDirs = [
    join(require('os').homedir(), '.npm-global'),
    '/usr/local/lib/node_modules',
    '/usr/lib/node_modules',
  ];
  // On Windows, check AppData
  if (process.platform === 'win32') {
    globalDirs.push(join(require('os').homedir(), 'AppData', 'Roaming', 'npm', 'node_modules'));
    globalDirs.push(join(require('os').homedir(), 'AppData', 'Local', 'npm-cache'));
  }
  for (const dir of globalDirs) {
    if (packageRoot.startsWith(dir)) return true;
  }
  // Check if INIT_CWD is the same as packageRoot parent (npm global puts things in lib/node_modules)
  if (packageRoot.includes('node_modules') && !packageRoot.includes(resolve(projectRoot, 'node_modules'))) {
    return true;
  }
  return false;
})();

if (isGlobalInstall) {
  // Global install — just create ~/.10x/ and show instructions
  const dotTenxDir = join(require('os').homedir(), '.10x');
  if (!existsSync(dotTenxDir)) {
    try { mkdirSync(dotTenxDir, { recursive: true }); } catch {}
  }
  console.log('');
  console.log(`${c.bold}${c.cyan}  10x Development Team${c.reset} installed globally.`);
  console.log('');
  info(`${c.bold}Usage:${c.reset}`);
  info(`  ${c.cyan}10x-mcp setup${c.reset}                    Configure your AI clients`);
  info(`  ${c.cyan}10x-mcp install-plugin ~/my-app${c.reset}  Add skills to a project`);
  info(`  ${c.cyan}10x-mcp doctor${c.reset}                   Health check`);
  console.log('');
  process.exit(0);
}

// Skip if we're running in the package's own repo (development mode)
const resolvedProject = resolve(projectRoot);
const resolvedPackage = resolve(packageRoot);
const resolvedRepoRoot = resolve(packageRoot, '..');
if (resolvedProject === resolvedPackage || resolvedProject === resolvedRepoRoot) {
  process.exit(0);
}

// Skip if plugin files weren't bundled
if (!existsSync(pluginDir)) {
  warn('Plugin files not found in package. Skipping auto-setup.');
  info(`Run manually: npx 10x-development-team install-plugin ${projectRoot}`);
  process.exit(0);
}

// ══════════════════════════════════════════════════════════════════════════════
// PHASE 1: Copy plugin files (.claude/) into project root
// ══════════════════════════════════════════════════════════════════════════════

console.log('');
console.log(`${c.bold}${c.cyan}  10x Development Team \u2014 Setting up your project...${c.reset}`);
console.log('');

const targetClaude = join(projectRoot, '.claude');
let filesInstalled = 0;
let filesSkipped = 0;

// Ensure .claude/ exists
if (!existsSync(targetClaude)) {
  mkdirSync(targetClaude, { recursive: true });
}

// Copy plugin directories into .claude/
const dirs = ['skills', 'agents', 'knowledge', 'components', 'templates', 'scripts', 'hooks'];
for (const dir of dirs) {
  const src = join(pluginDir, dir);
  const dest = join(targetClaude, dir);
  if (existsSync(src)) {
    try {
      // Always force-copy to ensure latest version
      cpSync(src, dest, { recursive: true, force: true });
      filesInstalled++;
      success(`Installed ${dir}/`);
    } catch (err) {
      fail(`Failed to copy ${dir}/: ${err.message}`);
    }
  }
}

// Copy individual files (don't overwrite if they exist — user may have customized)
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
        success(`Installed ${file}`);
      } catch (err) {
        fail(`Failed to copy ${file}: ${err.message}`);
      }
    } else {
      filesSkipped++;
    }
  }
}

if (filesInstalled > 0) {
  success(`${c.bold}Plugin files installed to .claude/${c.reset} (${filesInstalled} items)`);
}
if (filesSkipped > 0) {
  info(`${c.dim}${filesSkipped} file(s) already existed and were preserved${c.reset}`);
}

// Verify skills are actually there
const skillsDir = join(targetClaude, 'skills');
if (existsSync(skillsDir)) {
  try {
    const skillDirs = readdirSync(skillsDir).filter(d => {
      try { return statSync(join(skillsDir, d)).isDirectory(); } catch { return false; }
    });
    success(`${skillDirs.length} slash commands available: /start, /build, /add-page, /fix, etc.`);
  } catch {}
} else {
  fail('Skills directory missing! Slash commands will not work.');
  fail('Try running: npx 10x-development-team install-plugin .');
}

// ══════════════════════════════════════════════════════════════════════════════
// PHASE 2: Create .10x/ directory + skeleton files
// ══════════════════════════════════════════════════════════════════════════════

const dotTenx = join(projectRoot, '.10x');
if (!existsSync(dotTenx)) {
  try {
    mkdirSync(dotTenx, { recursive: true });
    success('Created .10x/ project tracking directory');
  } catch {}
} else {
  success('.10x/ directory already exists');
}

// Create 3D asset directories
const assetDirs = [
  ['public/models', '3D models (GLB, GLTF)'],
  ['public/textures', 'PBR textures'],
  ['public/hdri', 'environment maps (HDRI)'],
];
for (const [dir, desc] of assetDirs) {
  const fullPath = join(projectRoot, dir);
  if (!existsSync(fullPath)) {
    try {
      mkdirSync(fullPath, { recursive: true });
      writeFileSync(join(fullPath, '.gitkeep'), '');
      success(`Created ${dir}/ for ${desc}`);
    } catch {}
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// PHASE 3: Create .env files
// ══════════════════════════════════════════════════════════════════════════════

const envExamplePath = join(projectRoot, '.env.example');
if (!existsSync(envExamplePath)) {
  try {
    writeFileSync(envExamplePath, `# 10x Development Team \u2014 Environment Variables
# Copy this file to .env and fill in your values

# \u2500\u2500 Database (MVP/Production scope) \u2500\u2500
DATABASE_URL=

# \u2500\u2500 Authentication (MVP/Production scope) \u2500\u2500
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000

# \u2500\u2500 External APIs \u2500\u2500
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
RESEND_API_KEY=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SKETCHFAB_API_TOKEN=

# \u2500\u2500 Deployment \u2500\u2500
VERCEL_TOKEN=
`);
    success('Created .env.example');
  } catch {}
}

const envPath = join(projectRoot, '.env');
if (!existsSync(envPath)) {
  try {
    writeFileSync(envPath, `# Auto-generated by 10x-development-team\n# See .env.example for all available variables\n`);
    success('Created .env');
  } catch {}
}

// ══════════════════════════════════════════════════════════════════════════════
// PHASE 4: Update .gitignore
// ══════════════════════════════════════════════════════════════════════════════

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
      success(`Updated .gitignore`);
    }
  } catch {}
} else {
  try {
    writeFileSync(gitignorePath, `node_modules/\ndist/\n.env\n.env.local\n.10x/screenshots/\n.10x/pending-questions.json\n`);
    success('Created .gitignore');
  } catch {}
}

// ══════════════════════════════════════════════════════════════════════════════
// PHASE 5: Set up .mcp.json
// ══════════════════════════════════════════════════════════════════════════════

const mcpJsonPath = join(projectRoot, '.mcp.json');
const isWindows = process.platform === 'win32';

function getMcpConfig() {
  return {
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
}

if (!existsSync(mcpJsonPath)) {
  try {
    writeFileSync(mcpJsonPath, JSON.stringify(getMcpConfig(), null, 2));
    success('Created .mcp.json (Playwright MCP + 10x MCP)');
  } catch {}
} else {
  try {
    const existing = JSON.parse(readFileSync(mcpJsonPath, 'utf-8'));
    let updated = false;
    if (!existing.mcpServers) existing.mcpServers = {};
    if (!existing.mcpServers.playwright) {
      existing.mcpServers.playwright = getMcpConfig().mcpServers.playwright;
      updated = true;
    }
    if (!existing.mcpServers['10x-dev']) {
      existing.mcpServers['10x-dev'] = getMcpConfig().mcpServers['10x-dev'];
      updated = true;
    }
    if (updated) {
      writeFileSync(mcpJsonPath, JSON.stringify(existing, null, 2));
      success('Updated .mcp.json with missing MCP servers');
    } else {
      success('.mcp.json already configured');
    }
  } catch {
    warn('.mcp.json exists but could not be parsed');
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// PHASE 6: Create .10x/assets.json
// ══════════════════════════════════════════════════════════════════════════════

const assetsJson = join(dotTenx, 'assets.json');
if (!existsSync(assetsJson)) {
  try {
    writeFileSync(assetsJson, JSON.stringify([], null, 2));
    success('Created .10x/assets.json');
  } catch {}
}

// ══════════════════════════════════════════════════════════════════════════════
// DONE
// ══════════════════════════════════════════════════════════════════════════════

console.log('');
console.log(`${c.bold}${c.green}  Setup complete!${c.reset}`);
console.log('');
info(`${c.bold}Next steps:${c.reset}`);
info(`  ${c.bold}1.${c.reset} Open ${c.cyan}Claude Code${c.reset} in this project folder`);
info(`  ${c.bold}2.${c.reset} Type: ${c.cyan}/start${c.reset} and describe what you want to build`);
console.log('');
info(`${c.bold}All available commands:${c.reset}`);
info(`  ${c.cyan}/start${c.reset}          New project \u2014 describe your app`);
info(`  ${c.cyan}/build${c.reset}          Build from your vision`);
info(`  ${c.cyan}/add-page${c.reset}       Add a page`);
info(`  ${c.cyan}/add-feature${c.reset}    Add a feature (frontend + backend)`);
info(`  ${c.cyan}/fix${c.reset}            Fix a bug`);
info(`  ${c.cyan}/modify-ui${c.reset}      Change theme, layout, colors`);
info(`  ${c.cyan}/status${c.reset}         Project overview`);
info(`  ${c.cyan}/help${c.reset}           All 19 commands`);
console.log('');
info(`${c.dim}MCP tools: npx 10x-development-team setup${c.reset}`);
info(`${c.dim}Health check: npx 10x-development-team doctor${c.reset}`);
info(`${c.dim}If commands aren't found, restart Claude Code to discover new skills.${c.reset}`);
console.log('');
