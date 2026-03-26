#!/usr/bin/env node

/**
 * 10x Development Team — MCP Server & CLI
 *
 * Two modes:
 *   1. MCP Server (default): `10x-mcp` or `npx @10x-dev/mcp-server`
 *   2. CLI commands: `10x-mcp setup`, `10x-mcp install-plugin`, `10x-mcp doctor`
 *
 * MCP Server usage:
 *   npx @10x-dev/mcp-server                                    # stdio transport
 *   PROJECT_DIR=/path/to/project npx @10x-dev/mcp-server       # specify project
 *
 * CLI usage:
 *   npx @10x-dev/mcp-server setup                              # auto-configure
 *   npx @10x-dev/mcp-server setup --client claude-desktop      # specific client
 *   npx @10x-dev/mcp-server install-plugin /path/to/project    # copy plugin files
 *   npx @10x-dev/mcp-server doctor                             # health check
 */

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createServer } from './server.js';
import { closeDb } from './db.js';

const CLI_COMMANDS = ['setup', 'install-plugin', 'doctor', 'version', '--version', '-v', '--help', '-h'];

async function startServer() {
  const server = createServer();
  const transport = new StdioServerTransport();

  process.on('SIGINT', async () => {
    closeDb();
    await server.close();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    closeDb();
    await server.close();
    process.exit(0);
  });

  console.error('[10x-mcp] Starting 10x Development Team MCP server...');
  console.error(`[10x-mcp] Project dir: ${process.env.PROJECT_DIR || process.cwd()}`);
  console.error(`[10x-mcp] Plugin root: ${process.env.PLUGIN_ROOT || 'auto-detect'}`);

  await server.connect(transport);
  console.error('[10x-mcp] Server connected and ready.');
}

async function main() {
  const args = process.argv.slice(2);

  // If first arg is a CLI command, run CLI mode
  if (args.length > 0 && CLI_COMMANDS.includes(args[0])) {
    const { runCli } = await import('./cli.js');
    await runCli(args);
    return;
  }

  // Otherwise, start the MCP server
  await startServer();
}

main().catch((err) => {
  console.error('[10x-mcp] Fatal error:', err);
  process.exit(1);
});
