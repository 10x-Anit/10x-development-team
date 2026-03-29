import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerTools } from './tools/index.js';
import { registerResources } from './resources/index.js';
import { registerPrompts } from './prompts/index.js';

/**
 * Create and configure the 10x Development Team MCP server.
 * Registers all tools, resources, and prompts.
 */
export function createServer(): McpServer {
  const server = new McpServer(
    {
      name: '10x-development-team',
      version: '3.2.0',
    },
    {
      capabilities: {
        logging: {},
      },
    }
  );

  // Register all capabilities
  registerTools(server);
  registerResources(server);
  registerPrompts(server);

  return server;
}
