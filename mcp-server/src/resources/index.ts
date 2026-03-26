import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  readPluginFile, readProjectFile, getProjectDir,
  listSkills, listAgents
} from '../utils.js';

/**
 * Register all MCP resources on the server
 */
export function registerResources(server: McpServer): void {

  // ── Knowledge Base Index ──
  server.resource(
    'knowledge-index',
    'knowledge://index',
    {
      description: 'Knowledge base index — lists all available code pattern files by category',
      mimeType: 'application/json'
    },
    async (uri) => {
      const content = readPluginFile('knowledge/index.json');
      return { contents: [{ uri: uri.href, text: content, mimeType: 'application/json' }] };
    }
  );

  // ── Dynamic Knowledge Files ──
  server.resource(
    'knowledge-file',
    new ResourceTemplate('knowledge://{category}/{fileName}', {
      list: async () => {
        const index = JSON.parse(readPluginFile('knowledge/index.json'));
        const resources: Array<{ uri: string; name: string; description: string; mimeType: string }> = [];
        for (const [category, files] of Object.entries(index)) {
          if (category === '_meta') continue;
          for (const [fileName, desc] of Object.entries(files as Record<string, string>)) {
            resources.push({
              uri: `knowledge://${category}/${fileName}`,
              name: `${category}/${fileName}`,
              description: desc,
              mimeType: 'text/markdown'
            });
          }
        }
        return { resources };
      }
    }),
    {
      description: 'A specific knowledge base file with copy-paste code patterns',
      mimeType: 'text/markdown'
    },
    async (uri, { category, fileName }) => {
      const content = readPluginFile(`knowledge/${category}/${fileName}`);
      return { contents: [{ uri: uri.href, text: content, mimeType: 'text/markdown' }] };
    }
  );

  // ── Component Registry ──
  server.resource(
    'component-registry',
    'components://registry',
    {
      description: 'Global component registry — all pre-built components with props, variants, and templates',
      mimeType: 'application/json'
    },
    async (uri) => {
      const content = readPluginFile('components/registry.json');
      return { contents: [{ uri: uri.href, text: content, mimeType: 'application/json' }] };
    }
  );

  // ── Project Index Files ──
  server.resource(
    'project-config',
    'project://config',
    {
      description: 'Current project configuration (.10x/project.json) — scope, stack, vision',
      mimeType: 'application/json'
    },
    async (uri) => {
      const content = readProjectFile('project.json');
      return {
        contents: [{
          uri: uri.href,
          text: content || JSON.stringify({ error: 'No project initialized. Run tenx_start first.' }),
          mimeType: 'application/json'
        }]
      };
    }
  );

  server.resource(
    'project-files',
    'project://files',
    {
      description: 'Project file index (.10x/file-index.json) — all files with types and descriptions',
      mimeType: 'application/json'
    },
    async (uri) => {
      const content = readProjectFile('file-index.json');
      return {
        contents: [{
          uri: uri.href,
          text: content || '{"files":{}}',
          mimeType: 'application/json'
        }]
      };
    }
  );

  server.resource(
    'project-tasks',
    'project://tasks',
    {
      description: 'Project task list (.10x/tasks.json) — goals, assignments, status',
      mimeType: 'application/json'
    },
    async (uri) => {
      const content = readProjectFile('tasks.json');
      return {
        contents: [{
          uri: uri.href,
          text: content || '{"tasks":[]}',
          mimeType: 'application/json'
        }]
      };
    }
  );

  server.resource(
    'project-features',
    'project://features',
    {
      description: 'Project feature map (.10x/feature-map.json) — features, files, wiring',
      mimeType: 'application/json'
    },
    async (uri) => {
      const content = readProjectFile('feature-map.json');
      return {
        contents: [{
          uri: uri.href,
          text: content || '{"features":{}}',
          mimeType: 'application/json'
        }]
      };
    }
  );

  server.resource(
    'project-log',
    'project://log',
    {
      description: 'Development log (.10x/dev-log.md) — chronological history of all actions',
      mimeType: 'text/markdown'
    },
    async (uri) => {
      const content = readProjectFile('dev-log.md');
      return {
        contents: [{
          uri: uri.href,
          text: content || '# Development Log\n\nNo entries yet.',
          mimeType: 'text/markdown'
        }]
      };
    }
  );

  // ── Skill Instructions ──
  server.resource(
    'skill-instructions',
    new ResourceTemplate('skill://{skillName}', {
      list: async () => ({
        resources: listSkills().map(s => ({
          uri: `skill://${s}`,
          name: s,
          description: `Instructions for the ${s} skill`,
          mimeType: 'text/markdown'
        }))
      })
    }),
    {
      description: 'Detailed instructions for a specific skill/command',
      mimeType: 'text/markdown'
    },
    async (uri, { skillName }) => {
      const content = readPluginFile(`skills/${skillName}/SKILL.md`);
      return { contents: [{ uri: uri.href, text: content, mimeType: 'text/markdown' }] };
    }
  );

  // ── Agent Instructions ──
  server.resource(
    'agent-instructions',
    new ResourceTemplate('agent://{agentName}', {
      list: async () => ({
        resources: listAgents().map(a => ({
          uri: `agent://${a}`,
          name: a,
          description: `Instructions for the ${a} agent role`,
          mimeType: 'text/markdown'
        }))
      })
    }),
    {
      description: 'Full instruction set for a specialist agent role',
      mimeType: 'text/markdown'
    },
    async (uri, { agentName }) => {
      const content = readPluginFile(`agents/${agentName}.md`);
      return { contents: [{ uri: uri.href, text: content, mimeType: 'text/markdown' }] };
    }
  );
}
