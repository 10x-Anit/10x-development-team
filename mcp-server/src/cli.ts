/**
 * CLI commands for the 10x MCP server package.
 *
 * Usage:
 *   10x-mcp setup                        # Auto-detect and configure AI clients
 *   10x-mcp setup --client claude-desktop # Configure specific client
 *   10x-mcp setup --client claude-code    # Configure for Claude Code
 *   10x-mcp install-plugin [path]         # Copy .claude/ plugin files into a project
 *   10x-mcp doctor                        # Check installation health
 */

import { existsSync, mkdirSync, writeFileSync, readFileSync, cpSync } from 'fs';
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
function success(msg: string) { console.log(`${c.green}✓${c.reset} ${msg}`); }
function warn(msg: string) { console.log(`${c.yellow}⚠${c.reset} ${msg}`); }
function error(msg: string) { console.log(`${c.red}✗${c.reset} ${msg}`); }
function heading(msg: string) { console.log(`\n${c.bold}${c.cyan}${msg}${c.reset}`); }

// ── Path helpers ──

function getClaudeDesktopConfigPath(): string {
  const os = platform();
  if (os === 'win32') {
    return join(homedir(), 'AppData', 'Roaming', 'Claude', 'claude_desktop_config.json');
  }
  if (os === 'darwin') {
    return join(homedir(), 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json');
  }
  // Linux
  return join(homedir(), '.config', 'claude', 'claude_desktop_config.json');
}

function getClaudeCodeConfigPath(): string {
  // Claude Code uses ~/.claude/settings.json or project-level .claude/settings.json
  return join(homedir(), '.claude', 'settings.json');
}

function getMcpServerCommand(): { command: string; args: string[] } {
  // Determine how to invoke this MCP server
  const packageDir = resolve(__dirname, '..');
  const indexPath = join(packageDir, 'dist', 'index.js');

  // If installed globally or via npx, use the bin name
  // Otherwise use node with absolute path
  return {
    command: 'node',
    args: [indexPath]
  };
}

// ── Setup Command ──

export async function runSetup(args: string[]): Promise<void> {
  heading('10x Development Team — MCP Server Setup');
  log('');

  const clientArg = args.find(a => a.startsWith('--client='))?.split('=')[1]
    || (args.indexOf('--client') >= 0 ? args[args.indexOf('--client') + 1] : undefined);

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
    getDb(); // This creates tables if they don't exist
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

  // Step 4: Configure AI clients
  const clients = clientArg ? [clientArg] : detectClients();

  if (clients.length === 0) {
    warn('No AI clients detected. Use --client to specify one:');
    log('  10x-mcp setup --client claude-desktop');
    log('  10x-mcp setup --client claude-code');
    log('');
    log('Manual configuration:');
    log(JSON.stringify({
      command: serverCmd.command,
      args: serverCmd.args,
      env: serverEnv
    }, null, 2));
    return;
  }

  for (const client of clients) {
    if (client === 'claude-desktop') {
      configureClaudeDesktop(serverCmd, serverEnv);
    } else if (client === 'claude-code') {
      configureClaudeCode(serverCmd, serverEnv, pluginRoot);
    } else if (client === 'codex') {
      configureCodex(serverCmd, serverEnv);
    } else if (client === 'opencode') {
      configureOpenCode(serverCmd, serverEnv);
    } else {
      warn(`Unknown client: ${client}. Supported: claude-desktop, claude-code, codex, opencode`);
    }
  }

  // Step 5: Summary
  heading('Setup Complete');
  log('');
  log('Your 10x Development Team MCP server is configured.');
  log('');
  log(`${c.bold}What you can do now:${c.reset}`);
  log('  1. Open your AI client');
  log('  2. The 10x tools, resources, and prompts are available');
  log('  3. Say "Start a new project" to begin');
  log('');
  log(`${c.dim}Run "10x-mcp doctor" to verify the setup${c.reset}`);
}

function detectClients(): string[] {
  const detected: string[] = [];

  // Check for Claude Desktop
  const configPath = getClaudeDesktopConfigPath();
  const configDir = join(configPath, '..');
  if (existsSync(configDir)) {
    detected.push('claude-desktop');
  }

  // Check for Claude Code
  try {
    execSync('claude --version', { stdio: 'ignore' });
    detected.push('claude-code');
  } catch { /* not installed */ }

  // Check for OpenAI Codex CLI
  try {
    execSync('codex --version', { stdio: 'ignore' });
    detected.push('codex');
  } catch { /* not installed */ }

  // Check for OpenCode
  try {
    execSync('opencode --version', { stdio: 'ignore' });
    detected.push('opencode');
  } catch { /* not installed */ }

  return detected;
}

function configureClaudeDesktop(
  serverCmd: { command: string; args: string[] },
  serverEnv: Record<string, string>
): void {
  const configPath = getClaudeDesktopConfigPath();
  const configDir = join(configPath, '..');

  if (!existsSync(configDir)) {
    mkdirSync(configDir, { recursive: true });
  }

  let config: Record<string, unknown> = {};
  if (existsSync(configPath)) {
    try {
      config = JSON.parse(readFileSync(configPath, 'utf-8'));
    } catch {
      warn('Existing claude_desktop_config.json is invalid, creating new one');
    }
  }

  if (!config.mcpServers) {
    config.mcpServers = {};
  }

  (config.mcpServers as Record<string, unknown>)['10x-dev'] = {
    command: serverCmd.command,
    args: serverCmd.args,
    env: serverEnv
  };

  writeFileSync(configPath, JSON.stringify(config, null, 2));
  success(`Claude Desktop configured: ${configPath}`);
  log(`  ${c.dim}Restart Claude Desktop to activate${c.reset}`);
}

function configureClaudeCode(
  serverCmd: { command: string; args: string[] },
  serverEnv: Record<string, string>,
  pluginRoot: string
): void {
  // For Claude Code, the best approach is adding to .claude/.mcp.json
  // But since the plugin IS the .claude/ folder, we configure at user level
  const userMcpPath = join(homedir(), '.claude', '.mcp.json');
  const userMcpDir = join(homedir(), '.claude');

  if (!existsSync(userMcpDir)) {
    mkdirSync(userMcpDir, { recursive: true });
  }

  let mcpConfig: Record<string, unknown> = { mcpServers: {} };
  if (existsSync(userMcpPath)) {
    try {
      mcpConfig = JSON.parse(readFileSync(userMcpPath, 'utf-8'));
      if (!mcpConfig.mcpServers) mcpConfig.mcpServers = {};
    } catch { /* use default */ }
  }

  (mcpConfig.mcpServers as Record<string, unknown>)['10x-dev'] = {
    command: serverCmd.command,
    args: serverCmd.args,
    env: serverEnv
  };

  writeFileSync(userMcpPath, JSON.stringify(mcpConfig, null, 2));
  success(`Claude Code MCP configured: ${userMcpPath}`);
  log(`  ${c.dim}The MCP server will be available in all Claude Code sessions${c.reset}`);

  // Also remind about direct plugin usage
  log(`  ${c.dim}For direct plugin mode (no MCP), copy .claude/ into your project:${c.reset}`);
  log(`  ${c.dim}  10x-mcp install-plugin /path/to/project${c.reset}`);
}

// ── Codex (OpenAI) Configuration ──

function getCodexConfigPath(): string {
  // Codex CLI uses ~/.codex/config.json or similar
  // MCP servers are configured in the codex config
  const os = platform();
  if (os === 'win32') return join(homedir(), '.codex', 'config.json');
  return join(homedir(), '.codex', 'config.json');
}

function configureCodex(
  serverCmd: { command: string; args: string[] },
  serverEnv: Record<string, string>
): void {
  const configPath = getCodexConfigPath();
  const configDir = join(configPath, '..');

  if (!existsSync(configDir)) {
    mkdirSync(configDir, { recursive: true });
  }

  let config: Record<string, unknown> = {};
  if (existsSync(configPath)) {
    try {
      config = JSON.parse(readFileSync(configPath, 'utf-8'));
    } catch { /* fresh config */ }
  }

  if (!config.mcpServers) {
    config.mcpServers = {};
  }

  (config.mcpServers as Record<string, unknown>)['10x-dev'] = {
    command: serverCmd.command,
    args: serverCmd.args,
    env: serverEnv
  };

  writeFileSync(configPath, JSON.stringify(config, null, 2));
  success(`Codex configured: ${configPath}`);
  log(`  ${c.dim}Restart Codex to activate${c.reset}`);
}

// ── OpenCode Configuration ──

function getOpenCodeConfigPath(): string {
  // OpenCode uses ~/.config/opencode/config.json
  const os = platform();
  if (os === 'win32') return join(homedir(), '.config', 'opencode', 'config.json');
  if (os === 'darwin') return join(homedir(), '.config', 'opencode', 'config.json');
  return join(homedir(), '.config', 'opencode', 'config.json');
}

function configureOpenCode(
  serverCmd: { command: string; args: string[] },
  serverEnv: Record<string, string>
): void {
  const configPath = getOpenCodeConfigPath();
  const configDir = join(configPath, '..');

  if (!existsSync(configDir)) {
    mkdirSync(configDir, { recursive: true });
  }

  let config: Record<string, unknown> = {};
  if (existsSync(configPath)) {
    try {
      config = JSON.parse(readFileSync(configPath, 'utf-8'));
    } catch { /* fresh config */ }
  }

  if (!config.mcpServers) {
    config.mcpServers = {};
  }

  (config.mcpServers as Record<string, unknown>)['10x-dev'] = {
    command: serverCmd.command,
    args: serverCmd.args,
    env: serverEnv
  };

  writeFileSync(configPath, JSON.stringify(config, null, 2));
  success(`OpenCode configured: ${configPath}`);
  log(`  ${c.dim}Restart OpenCode to activate${c.reset}`);
}

// ── Install Plugin Command ──

export async function runInstallPlugin(targetPath?: string): Promise<void> {
  heading('10x Development Team — Install Plugin');
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
  if (!existsSync(sourceClaude)) {
    error(`Plugin files not found at: ${sourceClaude}`);
    error('Set PLUGIN_ROOT environment variable to the plugin repo path');
    process.exit(1);
  }

  // Warn if .claude/ already exists
  if (existsSync(targetClaude)) {
    warn('.claude/ already exists in target. Merging (existing files preserved)...');
  }

  // Copy plugin directories
  const dirs = ['skills', 'agents', 'knowledge', 'components', 'templates', 'scripts'];
  for (const dir of dirs) {
    const src = join(sourceClaude, dir);
    const dest = join(targetClaude, dir);
    if (existsSync(src)) {
      cpSync(src, dest, { recursive: true, force: false }); // force:false = don't overwrite
      success(`Copied ${dir}/`);
    }
  }

  // Copy CLAUDE.md and QUICKSTART.md
  for (const file of ['CLAUDE.md', 'QUICKSTART.md']) {
    const src = join(sourceClaude, file);
    const dest = join(targetClaude, file);
    if (existsSync(src) && !existsSync(dest)) {
      writeFileSync(dest, readFileSync(src));
      success(`Copied ${file}`);
    } else if (existsSync(dest)) {
      warn(`${file} already exists, skipped`);
    }
  }

  // Copy settings.json if not exists
  const settingsSrc = join(sourceClaude, 'settings.json');
  const settingsDest = join(targetClaude, 'settings.json');
  if (existsSync(settingsSrc) && !existsSync(settingsDest)) {
    writeFileSync(settingsDest, readFileSync(settingsSrc));
    success('Copied settings.json');
  }

  heading('Plugin Installed');
  log('');
  log(`Plugin files installed to: ${targetClaude}`);
  log('');
  log(`${c.bold}Next steps:${c.reset}`);
  log(`  1. cd ${target}`);
  log('  2. Open Claude Code');
  log('  3. Type: /10x-development-team:start');
  log('');
}

// ── Doctor Command ──

export async function runDoctor(): Promise<void> {
  heading('10x Development Team — Health Check');
  log('');

  let issues = 0;

  // Check Node version
  const nodeVersion = process.version;
  const major = parseInt(nodeVersion.slice(1));
  if (major >= 18) {
    success(`Node.js ${nodeVersion}`);
  } else {
    error(`Node.js ${nodeVersion} — need >= 18`);
    issues++;
  }

  // Check plugin root
  try {
    const root = resolvePluginRoot();
    success(`Plugin root: ${root}`);
  } catch {
    error('Plugin root not found — set PLUGIN_ROOT env var');
    issues++;
  }

  // Check ~/.10x/
  const dotTenx = join(homedir(), '.10x');
  if (existsSync(dotTenx)) {
    success(`~/.10x/ directory exists`);
  } else {
    warn('~/.10x/ not created yet — run "10x-mcp setup"');
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
    warn('SQLite database not created yet — run "10x-mcp setup"');
  }

  // Check Claude Desktop config
  const desktopConfig = getClaudeDesktopConfigPath();
  if (existsSync(desktopConfig)) {
    try {
      const config = JSON.parse(readFileSync(desktopConfig, 'utf-8'));
      if (config.mcpServers?.['10x-dev']) {
        success('Claude Desktop: configured');
      } else {
        warn('Claude Desktop: installed but 10x-dev not configured');
      }
    } catch {
      warn('Claude Desktop: config file exists but is invalid');
    }
  } else {
    log(`${c.dim}  Claude Desktop: not detected${c.reset}`);
  }

  // Check Claude Code
  try {
    execSync('claude --version', { stdio: 'ignore' });
    success('Claude Code: installed');
  } catch {
    log(`${c.dim}  Claude Code: not detected${c.reset}`);
  }

  log('');
  if (issues === 0) {
    success(`${c.bold}All checks passed${c.reset}`);
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
      log('10x-mcp v1.0.0');
      break;
    default:
      error(`Unknown command: ${command}`);
      printHelp();
      process.exit(1);
  }
}

function printHelp(): void {
  log(`
${c.bold}10x Development Team — MCP Server${c.reset}

${c.bold}Usage:${c.reset}
  10x-mcp                          Start the MCP server (stdio transport)
  10x-mcp setup                    Auto-detect and configure AI clients
  10x-mcp setup --client <name>    Configure a specific AI client
  10x-mcp install-plugin [path]    Copy plugin files into a project
  10x-mcp doctor                   Check installation health
  10x-mcp --version                Show version

${c.bold}Clients:${c.reset}
  claude-desktop    Configure Claude Desktop app
  claude-code       Configure Claude Code CLI
  codex             Configure OpenAI Codex CLI
  opencode          Configure OpenCode

${c.bold}Environment Variables:${c.reset}
  PLUGIN_ROOT       Path to the 10x plugin repo (auto-detected)
  PROJECT_DIR       Path to the user's project (defaults to cwd)

${c.bold}Examples:${c.reset}
  10x-mcp setup                              # Auto-detect everything
  10x-mcp setup --client claude-desktop      # Just Claude Desktop
  10x-mcp install-plugin ~/my-app            # Copy plugin into project
  PROJECT_DIR=~/my-app 10x-mcp              # Start server for a project
`);
}
