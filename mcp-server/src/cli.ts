/**
 * CLI commands for the 10x MCP server package.
 *
 * Supports ALL major AI clients:
 *   - Claude Desktop (Anthropic)
 *   - Claude Code CLI (Anthropic)
 *   - Cursor IDE
 *   - Windsurf IDE (Codeium)
 *   - Cline (VS Code extension)
 *   - VS Code + GitHub Copilot
 *   - Continue.dev
 *   - OpenAI Codex CLI
 *   - OpenCode
 *
 * Usage:
 *   10x-mcp setup                        # Auto-detect and configure ALL found clients
 *   10x-mcp setup --client cursor        # Configure specific client
 *   10x-mcp install-plugin [path]        # Copy .claude/ plugin files into a project (Claude Code only)
 *   10x-mcp doctor                       # Check installation health
 */

import { existsSync, mkdirSync, writeFileSync, readFileSync, cpSync, readdirSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { homedir, platform } from 'os';
import { execSync } from 'child_process';
import { resolvePluginRoot } from './utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ── Colors for terminal output ──
const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
};

function log(msg: string) { console.log(msg); }
function success(msg: string) { console.log(`${c.green}\u2713${c.reset} ${msg}`); }
function warn(msg: string) { console.log(`${c.yellow}\u26A0${c.reset} ${msg}`); }
function error(msg: string) { console.log(`${c.red}\u2717${c.reset} ${msg}`); }
function heading(msg: string) { console.log(`\n${c.bold}${c.cyan}${msg}${c.reset}`); }

// ── All Supported Clients ──

const SUPPORTED_CLIENTS = [
  'claude-desktop',
  'claude-code',
  'cursor',
  'windsurf',
  'cline',
  'vscode',
  'continue',
  'codex',
  'opencode',
] as const;

type ClientName = typeof SUPPORTED_CLIENTS[number];

// ── Config Path Helpers ──

function getConfigPath(client: ClientName): string {
  const os = platform();
  const home = homedir();

  switch (client) {
    case 'claude-desktop':
      if (os === 'win32') return join(home, 'AppData', 'Roaming', 'Claude', 'claude_desktop_config.json');
      if (os === 'darwin') return join(home, 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json');
      return join(home, '.config', 'claude', 'claude_desktop_config.json');

    case 'claude-code':
      return join(home, '.claude', '.mcp.json');

    case 'cursor':
      // Cursor: ~/.cursor/mcp.json (global) or .cursor/mcp.json (project)
      return join(home, '.cursor', 'mcp.json');

    case 'windsurf':
      // Windsurf: ~/.codeium/windsurf/mcp_config.json
      return join(home, '.codeium', 'windsurf', 'mcp_config.json');

    case 'cline':
      // Cline: stored per-workspace in VS Code, but global defaults in settings
      // The cline_mcp_settings.json is in the VS Code global storage
      if (os === 'win32') return join(home, 'AppData', 'Roaming', 'Code', 'User', 'globalStorage', 'saoudrizwan.claude-dev', 'settings', 'cline_mcp_settings.json');
      if (os === 'darwin') return join(home, 'Library', 'Application Support', 'Code', 'User', 'globalStorage', 'saoudrizwan.claude-dev', 'settings', 'cline_mcp_settings.json');
      return join(home, '.config', 'Code', 'User', 'globalStorage', 'saoudrizwan.claude-dev', 'settings', 'cline_mcp_settings.json');

    case 'vscode':
      // VS Code: .vscode/mcp.json (project) or settings.json (user)
      // We create a project-level config since it's more portable
      return join(process.cwd(), '.vscode', 'mcp.json');

    case 'continue':
      // Continue.dev: ~/.continue/mcp.json
      return join(home, '.continue', 'mcp.json');

    case 'codex':
      // OpenAI Codex CLI: ~/.codex/mcp.json
      return join(home, '.codex', 'mcp.json');

    case 'opencode':
      // OpenCode: ~/.config/opencode/mcp.json
      return join(home, '.config', 'opencode', 'mcp.json');
  }
}

function getConfigDir(client: ClientName): string {
  return dirname(getConfigPath(client));
}

function getMcpServerCommand(): { command: string; args: string[] } {
  const packageDir = resolve(__dirname, '..');
  const indexPath = join(packageDir, 'dist', 'index.js');
  return {
    command: 'node',
    args: [indexPath]
  };
}

// ── Generic MCP Config Writer ──

/**
 * Write MCP server config to a client's config file.
 * Handles different config formats per client.
 */
function writeMcpConfig(
  client: ClientName,
  serverCmd: { command: string; args: string[] },
  serverEnv: Record<string, string>
): void {
  const configPath = getConfigPath(client);
  const configDir = getConfigDir(client);

  if (!existsSync(configDir)) {
    mkdirSync(configDir, { recursive: true });
  }

  const serverEntry = {
    command: serverCmd.command,
    args: serverCmd.args,
    env: serverEnv
  };

  // VS Code uses a different format: { "servers": { ... } } instead of { "mcpServers": { ... } }
  if (client === 'vscode') {
    let config: Record<string, unknown> = {};
    if (existsSync(configPath)) {
      try { config = JSON.parse(readFileSync(configPath, 'utf-8')); } catch { /* fresh */ }
    }
    if (!config.servers) config.servers = {};
    (config.servers as Record<string, unknown>)['10x-dev'] = serverEntry;
    writeFileSync(configPath, JSON.stringify(config, null, 2));
    success(`VS Code configured: ${configPath}`);
    log(`  ${c.dim}Available in GitHub Copilot Agent Mode${c.reset}`);
    return;
  }

  // Continue.dev can use either format, but mcpServers in mcp.json is the standard
  // All other clients use { "mcpServers": { ... } }
  let config: Record<string, unknown> = {};
  if (existsSync(configPath)) {
    try {
      config = JSON.parse(readFileSync(configPath, 'utf-8'));
    } catch {
      // Invalid JSON — start fresh
    }
  }

  if (!config.mcpServers) {
    config.mcpServers = {};
  }

  (config.mcpServers as Record<string, unknown>)['10x-dev'] = serverEntry;

  writeFileSync(configPath, JSON.stringify(config, null, 2));

  const labels: Record<ClientName, string> = {
    'claude-desktop': 'Claude Desktop',
    'claude-code': 'Claude Code',
    'cursor': 'Cursor IDE',
    'windsurf': 'Windsurf IDE',
    'cline': 'Cline (VS Code)',
    'vscode': 'VS Code + Copilot',
    'continue': 'Continue.dev',
    'codex': 'OpenAI Codex CLI',
    'opencode': 'OpenCode',
  };

  success(`${labels[client]} configured: ${configPath}`);
  log(`  ${c.dim}Restart ${labels[client]} to activate${c.reset}`);
}

// ── Client Detection ──

function detectClients(): ClientName[] {
  const detected: ClientName[] = [];

  // Claude Desktop — check if app directory exists
  const desktopDir = dirname(getConfigPath('claude-desktop'));
  if (existsSync(desktopDir)) {
    detected.push('claude-desktop');
  }

  // Claude Code — check CLI
  try {
    execSync('claude --version', { stdio: 'ignore' });
    detected.push('claude-code');
  } catch { /* not installed */ }

  // Cursor — check if ~/.cursor/ exists
  if (existsSync(join(homedir(), '.cursor'))) {
    detected.push('cursor');
  }

  // Windsurf — check if ~/.codeium/windsurf/ exists
  if (existsSync(join(homedir(), '.codeium', 'windsurf'))) {
    detected.push('windsurf');
  }

  // Cline — check if VS Code globalStorage for cline extension exists
  const clineDir = dirname(getConfigPath('cline'));
  if (existsSync(dirname(clineDir))) {
    detected.push('cline');
  }

  // VS Code — check if `code` CLI is available
  try {
    execSync('code --version', { stdio: 'ignore' });
    detected.push('vscode');
  } catch { /* not installed */ }

  // Continue.dev — check if ~/.continue/ exists
  if (existsSync(join(homedir(), '.continue'))) {
    detected.push('continue');
  }

  // Codex CLI
  try {
    execSync('codex --version', { stdio: 'ignore' });
    detected.push('codex');
  } catch { /* not installed */ }

  // OpenCode
  try {
    execSync('opencode --version', { stdio: 'ignore' });
    detected.push('opencode');
  } catch { /* not installed */ }

  return detected;
}

// ── Setup Command ──

export async function runSetup(args: string[]): Promise<void> {
  heading('10x Development Team \u2014 MCP Server Setup');
  log('');

  const clientArg = args.find(a => a.startsWith('--client='))?.split('=')[1]
    || (args.indexOf('--client') >= 0 ? args[args.indexOf('--client') + 1] : undefined);

  // Accept --all flag to configure all supported clients
  const configureAll = args.includes('--all');

  // Step 1: Ensure ~/.10x/ exists
  const dotTenxDir = join(homedir(), '.10x');
  if (!existsSync(dotTenxDir)) {
    mkdirSync(dotTenxDir, { recursive: true });
    success('Created ~/.10x/ directory');
  } else {
    success('~/.10x/ directory exists');
  }

  // Step 2: Initialize SQLite database
  try {
    const { getDb, closeDb } = await import('./db.js');
    getDb();
    closeDb();
    success('SQLite memory database ready');
  } catch (err) {
    warn(`SQLite setup failed: ${(err as Error).message}`);
    warn('Persistent memory will use file-based fallback');
  }

  // Step 3: Detect plugin root
  let pluginRoot: string;
  try {
    pluginRoot = resolvePluginRoot();
    success(`Plugin files found at: ${pluginRoot}`);
  } catch {
    pluginRoot = resolve(__dirname, '..', '..');
    if (!existsSync(join(pluginRoot, '.claude'))) {
      error('Cannot find plugin files (.claude/ directory)');
      error('Set PLUGIN_ROOT environment variable to the plugin repo path');
      process.exit(1);
    }
    success(`Plugin files found at: ${pluginRoot}`);
  }

  const serverCmd = getMcpServerCommand();
  const serverEnv = { PLUGIN_ROOT: pluginRoot };

  // Step 4: Determine which clients to configure
  let clients: ClientName[];

  if (clientArg) {
    if (!SUPPORTED_CLIENTS.includes(clientArg as ClientName)) {
      error(`Unknown client: ${clientArg}`);
      log(`\nSupported clients: ${SUPPORTED_CLIENTS.join(', ')}`);
      process.exit(1);
    }
    clients = [clientArg as ClientName];
  } else if (configureAll) {
    clients = [...SUPPORTED_CLIENTS];
  } else {
    clients = detectClients();
  }

  if (clients.length === 0) {
    warn('No AI clients detected.');
    log('');
    log(`${c.bold}Specify a client manually:${c.reset}`);
    for (const client of SUPPORTED_CLIENTS) {
      log(`  10x-mcp setup --client ${client}`);
    }
    log('');
    log(`${c.bold}Or configure all at once:${c.reset}`);
    log('  10x-mcp setup --all');
    log('');
    log(`${c.bold}Manual MCP config (for any client):${c.reset}`);
    log(JSON.stringify({
      mcpServers: {
        '10x-dev': { command: serverCmd.command, args: serverCmd.args, env: serverEnv }
      }
    }, null, 2));
    return;
  }

  heading('Configuring AI Clients');
  log('');

  for (const client of clients) {
    try {
      if (client === 'claude-code') {
        // Claude Code special handling — also mention plugin mode
        writeMcpConfig(client, serverCmd, serverEnv);
        log(`  ${c.dim}Tip: Claude Code also works in direct plugin mode (no MCP needed).${c.reset}`);
        log(`  ${c.dim}Run: 10x-mcp install-plugin /path/to/project${c.reset}`);
      } else {
        writeMcpConfig(client, serverCmd, serverEnv);
      }
    } catch (err) {
      warn(`Failed to configure ${client}: ${(err as Error).message}`);
    }
  }

  // Step 5: Summary
  heading('Setup Complete');
  log('');
  log(`${c.bold}What the MCP server gives your AI client:${c.reset}`);
  log('  \u2022 12 tools: start projects, build, read knowledge, manage tasks');
  log('  \u2022 19 skills: add pages, features, fix bugs, deploy, and more');
  log('  \u2022 50+ knowledge files: copy-paste code patterns for React, Tailwind, shadcn, etc.');
  log('  \u2022 35+ component blueprints: buttons, cards, forms, tables, auth pages');
  log('  \u2022 7 agent roles: team lead, frontend, backend, UI designer, QA, deployer, error recovery');
  log('  \u2022 Persistent memory: projects tracked across sessions in SQLite');
  log('');
  log(`${c.bold}Quick start:${c.reset}`);
  log('  1. Open your AI client');
  log('  2. Ask: "Use the 10x tools to start a new project"');
  log('  3. Or call the tenx_start tool directly');
  log('');
  log(`${c.dim}Run "10x-mcp doctor" to verify the setup${c.reset}`);
}

// ── Install Plugin Command (Claude Code only) ──

export async function runInstallPlugin(targetPath?: string): Promise<void> {
  heading('10x Development Team \u2014 Install Plugin (Claude Code Direct Mode)');
  log('');
  log(`${c.dim}This copies .claude/ files directly into your project.${c.reset}`);
  log(`${c.dim}Claude Code reads these natively \u2014 no MCP server needed.${c.reset}`);
  log(`${c.dim}For other AI clients (Cursor, Windsurf, etc.), use: 10x-mcp setup${c.reset}`);
  log('');

  const target = targetPath ? resolve(targetPath) : process.cwd();
  const targetClaude = join(target, '.claude');

  if (!existsSync(target)) {
    error(`Target directory does not exist: ${target}`);
    process.exit(1);
  }

  let pluginRoot: string;
  try {
    pluginRoot = resolvePluginRoot();
  } catch {
    pluginRoot = resolve(__dirname, '..', '..');
  }

  const sourceClaude = join(pluginRoot, '.claude');
  // Also check the bundled plugin/ dir
  const sourcePlugin = join(resolve(__dirname, '..'), 'plugin');
  const sourceDir = existsSync(sourcePlugin) ? sourcePlugin : sourceClaude;

  if (!existsSync(sourceDir)) {
    error(`Plugin files not found at: ${sourceDir}`);
    error('Set PLUGIN_ROOT environment variable to the plugin repo path');
    process.exit(1);
  }

  // Warn if .claude/ already exists
  if (existsSync(targetClaude)) {
    warn('.claude/ already exists in target. Merging (existing files preserved)...');
  }

  // Copy plugin directories
  const dirs = ['skills', 'agents', 'knowledge', 'components', 'templates', 'scripts', 'hooks'];
  for (const dir of dirs) {
    const src = join(sourceDir, dir);
    const dest = join(targetClaude, dir);
    if (existsSync(src)) {
      try {
        cpSync(src, dest, { recursive: true, force: false });
        success(`Copied ${dir}/`);
      } catch {
        try {
          cpSync(src, dest, { recursive: true });
          success(`Copied ${dir}/`);
        } catch { /* skip */ }
      }
    }
  }

  // Copy individual files
  for (const file of ['CLAUDE.md', 'QUICKSTART.md', 'settings.json']) {
    const src = join(sourceDir, file);
    const dest = join(targetClaude, file);
    if (existsSync(src) && !existsSync(dest)) {
      mkdirSync(dirname(dest), { recursive: true });
      writeFileSync(dest, readFileSync(src));
      success(`Copied ${file}`);
    } else if (existsSync(dest)) {
      warn(`${file} already exists, skipped`);
    }
  }

  heading('Plugin Installed');
  log('');
  log(`Plugin files installed to: ${targetClaude}`);
  log('');
  log(`${c.bold}Next steps:${c.reset}`);
  log(`  1. cd ${target}`);
  log('  2. Open Claude Code');
  log(`  3. Type: ${c.cyan}/10x-development-team:start${c.reset}`);
  log('');
}

// ── Doctor Command ──

export async function runDoctor(): Promise<void> {
  heading('10x Development Team \u2014 Health Check');
  log('');

  let issues = 0;
  let configured = 0;

  // Check Node version
  const nodeVersion = process.version;
  const major = parseInt(nodeVersion.slice(1));
  if (major >= 18) {
    success(`Node.js ${nodeVersion}`);
  } else {
    error(`Node.js ${nodeVersion} \u2014 need >= 18`);
    issues++;
  }

  // Check plugin root
  try {
    const root = resolvePluginRoot();
    success(`Plugin root: ${root}`);

    // Count knowledge files
    try {
      const knowledgeIndex = JSON.parse(readFileSync(join(root, '.claude', 'knowledge', 'index.json'), 'utf-8'));
      let fileCount = 0;
      for (const [cat, files] of Object.entries(knowledgeIndex)) {
        if (cat === '_meta') continue;
        fileCount += Object.keys(files as Record<string, string>).length;
      }
      success(`Knowledge base: ${fileCount} files`);
    } catch {
      // Try bundled path
      try {
        const bundledIndex = join(resolve(__dirname, '..'), 'plugin', 'knowledge', 'index.json');
        const knowledgeIndex = JSON.parse(readFileSync(bundledIndex, 'utf-8'));
        let fileCount = 0;
        for (const [cat, files] of Object.entries(knowledgeIndex)) {
          if (cat === '_meta') continue;
          fileCount += Object.keys(files as Record<string, string>).length;
        }
        success(`Knowledge base: ${fileCount} files (bundled)`);
      } catch { /* skip */ }
    }
  } catch {
    error('Plugin root not found \u2014 set PLUGIN_ROOT env var');
    issues++;
  }

  // Check ~/.10x/
  const dotTenx = join(homedir(), '.10x');
  if (existsSync(dotTenx)) {
    success('~/.10x/ directory exists');
  } else {
    warn('~/.10x/ not created yet \u2014 run "10x-mcp setup"');
  }

  // Check SQLite
  const dbPath = join(dotTenx, 'memory.db');
  if (existsSync(dbPath)) {
    success(`SQLite database: ${dbPath}`);
    try {
      const { getDb, closeDb } = await import('./db.js');
      const db = getDb();
      const count = (db.prepare('SELECT COUNT(*) as count FROM projects').get() as { count: number }).count;
      success(`Projects tracked: ${count}`);
      closeDb();
    } catch (err) {
      warn(`SQLite read error: ${(err as Error).message}`);
    }
  } else {
    warn('SQLite database not created yet \u2014 run "10x-mcp setup"');
  }

  // Check ALL AI client configs
  heading('AI Client Configurations');
  log('');

  const clientChecks: { name: string; client: ClientName; detect: () => boolean }[] = [
    {
      name: 'Claude Desktop',
      client: 'claude-desktop',
      detect: () => existsSync(dirname(getConfigPath('claude-desktop')))
    },
    {
      name: 'Claude Code',
      client: 'claude-code',
      detect: () => { try { execSync('claude --version', { stdio: 'ignore' }); return true; } catch { return false; } }
    },
    {
      name: 'Cursor IDE',
      client: 'cursor',
      detect: () => existsSync(join(homedir(), '.cursor'))
    },
    {
      name: 'Windsurf IDE',
      client: 'windsurf',
      detect: () => existsSync(join(homedir(), '.codeium', 'windsurf'))
    },
    {
      name: 'Cline (VS Code)',
      client: 'cline',
      detect: () => existsSync(dirname(dirname(getConfigPath('cline'))))
    },
    {
      name: 'VS Code + Copilot',
      client: 'vscode',
      detect: () => { try { execSync('code --version', { stdio: 'ignore' }); return true; } catch { return false; } }
    },
    {
      name: 'Continue.dev',
      client: 'continue',
      detect: () => existsSync(join(homedir(), '.continue'))
    },
    {
      name: 'OpenAI Codex CLI',
      client: 'codex',
      detect: () => { try { execSync('codex --version', { stdio: 'ignore' }); return true; } catch { return false; } }
    },
    {
      name: 'OpenCode',
      client: 'opencode',
      detect: () => { try { execSync('opencode --version', { stdio: 'ignore' }); return true; } catch { return false; } }
    },
  ];

  for (const check of clientChecks) {
    const installed = check.detect();
    if (!installed) {
      log(`  ${c.dim}${check.name}: not detected${c.reset}`);
      continue;
    }

    const configPath = getConfigPath(check.client);
    if (existsSync(configPath)) {
      try {
        const config = JSON.parse(readFileSync(configPath, 'utf-8'));
        // VS Code uses "servers", everything else uses "mcpServers"
        const servers = check.client === 'vscode' ? config.servers : config.mcpServers;
        if (servers?.['10x-dev']) {
          success(`${check.name}: configured`);
          configured++;
        } else {
          warn(`${check.name}: installed, but 10x-dev not configured`);
          log(`  ${c.dim}Run: 10x-mcp setup --client ${check.client}${c.reset}`);
        }
      } catch {
        warn(`${check.name}: config exists but is invalid`);
      }
    } else {
      warn(`${check.name}: installed, no MCP config found`);
      log(`  ${c.dim}Run: 10x-mcp setup --client ${check.client}${c.reset}`);
    }
  }

  log('');
  if (issues === 0) {
    success(`${c.bold}All checks passed${c.reset} (${configured} client(s) configured)`);
  } else {
    error(`${issues} issue(s) found`);
  }
}

// ── CLI Router ──

export async function runCli(args: string[]): Promise<void> {
  const command = args[0];

  if (!command || command === '--help' || command === '-h') {
    printHelp();
    return;
  }

  switch (command) {
    case 'setup':
      await runSetup(args.slice(1));
      break;
    case 'install-plugin':
      await runInstallPlugin(args[1]);
      break;
    case 'doctor':
      await runDoctor();
      break;
    case 'version':
    case '--version':
    case '-v':
      log('10x-development-team v1.0.2');
      break;
    default:
      error(`Unknown command: ${command}`);
      printHelp();
      process.exit(1);
  }
}

function printHelp(): void {
  log(`
${c.bold}10x Development Team \u2014 MCP Server & CLI${c.reset}

${c.bold}Two modes:${c.reset}
  ${c.cyan}Plugin Mode${c.reset} (Claude Code only):
    Your project gets .claude/ files directly. Claude Code reads skills,
    agents, and knowledge natively. No MCP server needed.

  ${c.cyan}MCP Server Mode${c.reset} (ALL AI clients):
    Runs locally on your machine. Exposes tools, resources, and prompts
    via the Model Context Protocol. No hosting needed.

${c.bold}Commands:${c.reset}
  10x-mcp                          Start MCP server (stdio transport)
  10x-mcp setup                    Auto-detect and configure AI clients
  10x-mcp setup --client <name>    Configure a specific AI client
  10x-mcp setup --all              Configure ALL supported clients
  10x-mcp install-plugin [path]    Copy .claude/ files into a project
  10x-mcp doctor                   Check installation health
  10x-mcp --version                Show version

${c.bold}Supported AI Clients:${c.reset}
  claude-desktop    Claude Desktop app (Anthropic)
  claude-code       Claude Code CLI (Anthropic)
  cursor            Cursor IDE
  windsurf          Windsurf IDE (Codeium)
  cline             Cline extension (VS Code)
  vscode            VS Code + GitHub Copilot
  continue          Continue.dev
  codex             OpenAI Codex CLI
  opencode          OpenCode

${c.bold}Environment Variables:${c.reset}
  PLUGIN_ROOT       Path to the plugin files (auto-detected)
  PROJECT_DIR       Path to the user's project (defaults to cwd)

${c.bold}Examples:${c.reset}
  npx 10x-development-team setup                  # Auto-detect everything
  npx 10x-development-team setup --client cursor   # Just Cursor
  npx 10x-development-team setup --all             # ALL clients
  npx 10x-development-team install-plugin ~/my-app # Plugin mode (Claude Code)
  npx 10x-development-team doctor                  # Health check
  PROJECT_DIR=~/my-app npx 10x-development-team    # Start MCP for a project

${c.bold}Config file locations:${c.reset}
  Claude Desktop:  ~/AppData/Roaming/Claude/claude_desktop_config.json (Win)
                   ~/Library/Application Support/Claude/claude_desktop_config.json (Mac)
  Claude Code:     ~/.claude/.mcp.json
  Cursor:          ~/.cursor/mcp.json
  Windsurf:        ~/.codeium/windsurf/mcp_config.json
  Cline:           VS Code globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json
  VS Code:         .vscode/mcp.json (project) or settings.json (user)
  Continue.dev:    ~/.continue/mcp.json
  Codex:           ~/.codex/mcp.json
  OpenCode:        ~/.config/opencode/mcp.json
`);
}
