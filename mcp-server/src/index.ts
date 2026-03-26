#!/usr/bin/env node

/**
 * 10x Development Team — MCP Server
 *
 * Exposes the full 10x plugin as MCP tools, resources, and prompts
 * that any AI client (Claude Desktop, ChatGPT, Codex, etc.) can use.
 *
 * Usage:
 *   npx @10x-dev/mcp-server                    # stdio transport (default)
 *   PROJECT_DIR=/path/to/project npx @10x-dev/mcp-server  # specify project dir
 *
 * Configure in Claude Desktop (claude_desktop_config.json):
 *   {
 *     "mcpServers": {
 *       "10x-dev": {
 *         "command": "npx",
 *         "args": ["@10x-dev/mcp-server"],
 *         "env": { "PROJECT_DIR": "/path/to/your/project" }
 *       }
 *     }
 *   }
 */

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createServer } from './server.js';
import { closeDb } from './db.js';

async function main() {
  const server = createServer();
  const transport = new StdioServerTransport();

  // Graceful shutdown
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

  // Never write to stdout — it corrupts JSON-RPC messages
  // Use stderr for any debug output
  console.error('[10x-mcp] Starting 10x Development Team MCP server...');
  console.error(`[10x-mcp] Project dir: ${process.env.PROJECT_DIR || process.cwd()}`);
  console.error(`[10x-mcp] Plugin root: ${process.env.PLUGIN_ROOT || 'auto-detect'}`);

  await server.connect(transport);
  console.error('[10x-mcp] Server connected and ready.');
}

main().catch((err) => {
  console.error('[10x-mcp] Fatal error:', err);
  process.exit(1);
});
