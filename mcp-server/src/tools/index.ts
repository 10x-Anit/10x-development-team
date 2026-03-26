import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import {
  readProjectFile, writeProjectFile, getProjectDir,
  readPluginFile, readSkillFile, listSkills
} from '../utils.js';
import {
  registerProject, listProjects, getProjectByPath,
  searchProjects, deleteProject, touchProject,
  createSession, updateSession, getRecentSessions,
  saveMemory, getMemories
} from '../db.js';

/**
 * Register all MCP tools on the server
 */
export function registerTools(server: McpServer): void {

  // ── Project Lifecycle Tools ──

  server.tool(
    'tenx_start',
    'Start a new 10x project. Captures app vision, scope, and type. Creates .10x/ project index and registers in persistent memory.',
    {
      name: z.string().describe('App name'),
      description: z.string().describe('What the app does in one sentence'),
      scope: z.enum(['simple', 'prototype', 'mvp', 'production']).describe('Project scope'),
      type: z.enum(['website', 'webapp', 'mobile', 'ecommerce', 'other']).describe('App type'),
      target_users: z.string().optional().describe('Who will use this app'),
      core_features: z.array(z.string()).optional().describe('3-5 key features'),
      first_screen: z.string().optional().describe('What user sees first')
    },
    async (args) => {
      const projectDir = getProjectDir();

      const projectJson = {
        name: args.name,
        description: args.description,
        scope: args.scope,
        type: args.type,
        stack: {},
        vision: {
          target_users: args.target_users || '',
          core_features: args.core_features || [],
          first_screen: args.first_screen || ''
        },
        status: 'initialized',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Write project files
      writeProjectFile('project.json', JSON.stringify(projectJson, null, 2));
      writeProjectFile('file-index.json', JSON.stringify({
        _meta: { description: 'Master file index.', last_updated: new Date().toISOString() },
        files: {}
      }, null, 2));
      writeProjectFile('tasks.json', JSON.stringify({
        _meta: { description: 'Task tracker.', last_updated: new Date().toISOString() },
        current_phase: 'initialization',
        tasks: []
      }, null, 2));
      writeProjectFile('feature-map.json', JSON.stringify({
        _meta: { description: 'Feature map.', version: '1.0.0', last_updated: new Date().toISOString() },
        features: {}
      }, null, 2));
      writeProjectFile('dev-log.md', `# Development Log\n\n## ${new Date().toISOString()} — Project Initialized\n- **Agent:** team-lead\n- **Action:** Project kickoff\n- **Details:** ${args.name} — ${args.scope} — ${args.type}\n---\n`);

      // Register in persistent memory
      try {
        const projectId = registerProject(
          args.name,
          args.description,
          args.scope,
          args.type,
          '{}',
          JSON.stringify(projectJson.vision),
          projectDir
        );
        createSession(projectId, 'Project initialized');
      } catch { /* SQLite optional */ }

      // Load the skill instructions for the AI to follow
      let skillInstructions = '';
      try {
        skillInstructions = readSkillFile('start');
      } catch { /* skill file optional for MCP mode */ }

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            status: 'initialized',
            project: projectJson,
            project_dir: projectDir,
            next_step: 'Run tenx_build to start building, or use tenx_get_skill with skill_name="build" for detailed instructions.',
            skill_instructions: skillInstructions ? 'Skill instructions loaded — follow the build skill for next steps.' : undefined
          }, null, 2)
        }]
      };
    }
  );

  server.tool(
    'tenx_build',
    'Execute the full build process for the current project. Reads project index, plans architecture based on scope, returns build plan and task list.',
    {
      vision_summary: z.string().optional().describe('Optional vision summary to guide the build')
    },
    async (args) => {
      const project = readProjectFile('project.json');
      if (!project) {
        return { content: [{ type: 'text' as const, text: 'No project found. Run tenx_start first.' }] };
      }

      const projectData = JSON.parse(project);
      const fileIndex = readProjectFile('file-index.json');
      const tasks = readProjectFile('tasks.json');

      let buildInstructions = '';
      try { buildInstructions = readSkillFile('build'); } catch { /* optional */ }

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            project: projectData,
            existing_files: fileIndex ? JSON.parse(fileIndex) : null,
            existing_tasks: tasks ? JSON.parse(tasks) : null,
            build_instructions: buildInstructions,
            message: `Ready to build "${projectData.name}" at ${projectData.scope} scope. Follow the build instructions to proceed.`
          }, null, 2)
        }]
      };
    }
  );

  // ── Project Management Tools ──

  server.tool(
    'tenx_projects',
    'List, search, or manage all projects tracked by the 10x plugin across sessions.',
    {
      action: z.enum(['list', 'search', 'info', 'delete']).default('list').describe('Action to perform'),
      query: z.string().optional().describe('Search query or project name (for search/info/delete)')
    },
    async (args) => {
      try {
        if (args.action === 'list') {
          const projects = listProjects();
          return { content: [{ type: 'text' as const, text: JSON.stringify({ projects, count: (projects as unknown[]).length }, null, 2) }] };
        }
        if (args.action === 'search' && args.query) {
          const results = searchProjects(args.query);
          return { content: [{ type: 'text' as const, text: JSON.stringify({ results, count: (results as unknown[]).length }, null, 2) }] };
        }
        if (args.action === 'info' && args.query) {
          const results = searchProjects(args.query);
          if ((results as unknown[]).length === 0) {
            return { content: [{ type: 'text' as const, text: `No project found matching "${args.query}"` }] };
          }
          const project = results[0] as { id: string };
          const sessions = getRecentSessions(project.id, 5);
          const memories = getMemories(project.id, 10);
          return { content: [{ type: 'text' as const, text: JSON.stringify({ project, sessions, memories }, null, 2) }] };
        }
        if (args.action === 'delete' && args.query) {
          const results = searchProjects(args.query);
          if ((results as unknown[]).length === 0) {
            return { content: [{ type: 'text' as const, text: `No project found matching "${args.query}"` }] };
          }
          const project = results[0] as { id: string; name: string };
          deleteProject(project.id);
          return { content: [{ type: 'text' as const, text: `Removed "${project.name}" from tracking. Files on disk are untouched.` }] };
        }
        return { content: [{ type: 'text' as const, text: 'Provide a query for search/info/delete actions.' }] };
      } catch (err) {
        return { content: [{ type: 'text' as const, text: `Database not available: ${(err as Error).message}` }] };
      }
    }
  );

  // ── Index & Context Tools ──

  server.tool(
    'tenx_read_index',
    'Read the project index files (.10x/) to understand current project state. Returns project.json, file-index.json, tasks.json, and feature-map.json.',
    {},
    async () => {
      const project = readProjectFile('project.json');
      if (!project) {
        return { content: [{ type: 'text' as const, text: 'No .10x/ directory found. Run tenx_start first.' }] };
      }

      // Touch last_opened in persistent memory
      try { touchProject(getProjectDir()); } catch { /* optional */ }

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            project: JSON.parse(project),
            file_index: JSON.parse(readProjectFile('file-index.json') || '{}'),
            tasks: JSON.parse(readProjectFile('tasks.json') || '{}'),
            feature_map: JSON.parse(readProjectFile('feature-map.json') || '{}')
          }, null, 2)
        }]
      };
    }
  );

  server.tool(
    'tenx_update_index',
    'Update project index files after creating or modifying code. Keeps the .10x/ directory in sync.',
    {
      file_index_updates: z.record(z.unknown()).optional().describe('Files to add/update in file-index.json'),
      task_updates: z.array(z.unknown()).optional().describe('Tasks to add/update in tasks.json'),
      dev_log_entry: z.string().optional().describe('Entry to append to dev-log.md'),
      feature_map_updates: z.record(z.unknown()).optional().describe('Features to add/update in feature-map.json')
    },
    async (args) => {
      const updates: string[] = [];

      if (args.file_index_updates) {
        const existing = JSON.parse(readProjectFile('file-index.json') || '{"_meta":{},"files":{}}');
        existing.files = { ...existing.files, ...args.file_index_updates };
        existing._meta.last_updated = new Date().toISOString();
        writeProjectFile('file-index.json', JSON.stringify(existing, null, 2));
        updates.push('file-index.json');
      }

      if (args.task_updates) {
        const existing = JSON.parse(readProjectFile('tasks.json') || '{"_meta":{},"tasks":[]}');
        for (const task of args.task_updates as Array<{ id: string }>) {
          const idx = existing.tasks.findIndex((t: { id: string }) => t.id === task.id);
          if (idx >= 0) existing.tasks[idx] = { ...existing.tasks[idx], ...task };
          else existing.tasks.push(task);
        }
        existing._meta.last_updated = new Date().toISOString();
        writeProjectFile('tasks.json', JSON.stringify(existing, null, 2));
        updates.push('tasks.json');
      }

      if (args.dev_log_entry) {
        const existing = readProjectFile('dev-log.md') || '# Development Log\n';
        writeProjectFile('dev-log.md', existing + '\n' + args.dev_log_entry + '\n');
        updates.push('dev-log.md');
      }

      if (args.feature_map_updates) {
        const existing = JSON.parse(readProjectFile('feature-map.json') || '{"_meta":{},"features":{}}');
        existing.features = { ...existing.features, ...args.feature_map_updates };
        existing._meta.last_updated = new Date().toISOString();
        writeProjectFile('feature-map.json', JSON.stringify(existing, null, 2));
        updates.push('feature-map.json');
      }

      return {
        content: [{ type: 'text' as const, text: `Updated: ${updates.join(', ') || 'nothing'}` }]
      };
    }
  );

  // ── Skill Instruction Tools ──

  server.tool(
    'tenx_get_skill',
    'Get the detailed instructions for a specific skill/command. Returns the full SKILL.md content that tells the AI exactly how to execute that skill.',
    {
      skill_name: z.enum([
        'start', 'build', 'add-page', 'add-feature', 'connect-data',
        'modify-ui', 'generate', 'fix', 'refactor', 'review', 'explain',
        'deploy', 'resume', 'status', 'update-deps', 'config', 'index',
        'projects', 'help'
      ]).describe('Which skill instructions to retrieve')
    },
    async (args) => {
      try {
        const content = readSkillFile(args.skill_name);
        return { content: [{ type: 'text' as const, text: content }] };
      } catch (err) {
        return { content: [{ type: 'text' as const, text: `Skill "${args.skill_name}" not found: ${(err as Error).message}` }] };
      }
    }
  );

  server.tool(
    'tenx_get_knowledge',
    'Get a knowledge base file with copy-paste-ready code patterns. Read this BEFORE writing code.',
    {
      category: z.enum(['frameworks', 'libraries', 'patterns', 'components-source']).describe('Knowledge category'),
      file_name: z.string().describe('File name (e.g., "nextjs.md", "tailwind.md", "external-api.md")')
    },
    async (args) => {
      try {
        const content = readPluginFile(`knowledge/${args.category}/${args.file_name}`);
        return { content: [{ type: 'text' as const, text: content }] };
      } catch (err) {
        return { content: [{ type: 'text' as const, text: `Knowledge file not found: ${args.category}/${args.file_name}. Use tenx_list_knowledge to see available files.` }] };
      }
    }
  );

  server.tool(
    'tenx_list_knowledge',
    'List all available knowledge base files organized by category.',
    {},
    async () => {
      try {
        const index = readPluginFile('knowledge/index.json');
        return { content: [{ type: 'text' as const, text: index }] };
      } catch (err) {
        return { content: [{ type: 'text' as const, text: `Could not read knowledge index: ${(err as Error).message}` }] };
      }
    }
  );

  server.tool(
    'tenx_get_components',
    'Get the component registry — lists all pre-built components with props, variants, and template paths. Check this BEFORE creating any UI component.',
    {},
    async () => {
      try {
        const content = readPluginFile('components/registry.json');
        return { content: [{ type: 'text' as const, text: content }] };
      } catch (err) {
        return { content: [{ type: 'text' as const, text: `Could not read component registry: ${(err as Error).message}` }] };
      }
    }
  );

  // ── Memory Tools ──

  server.tool(
    'tenx_save_memory',
    'Save a decision, preference, or context to persistent memory for the current project.',
    {
      category: z.enum(['decision', 'preference', 'issue', 'context', 'user_feedback']).describe('Memory category'),
      content: z.string().describe('What to remember')
    },
    async (args) => {
      try {
        const project = getProjectByPath(getProjectDir()) as { id: string } | undefined;
        if (!project) return { content: [{ type: 'text' as const, text: 'No project registered for current directory.' }] };
        saveMemory(project.id, args.category, args.content);
        return { content: [{ type: 'text' as const, text: `Saved ${args.category}: "${args.content.substring(0, 80)}..."` }] };
      } catch (err) {
        return { content: [{ type: 'text' as const, text: `Memory save failed: ${(err as Error).message}` }] };
      }
    }
  );

  server.tool(
    'tenx_get_context',
    'Load persistent context for the current project — recent sessions, saved decisions, preferences.',
    {},
    async () => {
      try {
        const project = getProjectByPath(getProjectDir()) as { id: string } | undefined;
        if (!project) return { content: [{ type: 'text' as const, text: 'No project registered. Run tenx_start first.' }] };
        const sessions = getRecentSessions(project.id, 5);
        const memories = getMemories(project.id, 20);
        touchProject(getProjectDir());
        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify({ project, recent_sessions: sessions, memories }, null, 2)
          }]
        };
      } catch (err) {
        return { content: [{ type: 'text' as const, text: `Context load failed: ${(err as Error).message}` }] };
      }
    }
  );

  // ── Agent Instruction Tool ──

  server.tool(
    'tenx_get_agent',
    'Get the full instruction set for a specialist agent. Use this when you need to act as a specific agent role.',
    {
      agent_name: z.enum(['team-lead', 'frontend-dev', 'backend-dev', 'ui-designer', 'qa-tester', 'deployer', 'error-recovery']).describe('Agent name')
    },
    async (args) => {
      try {
        const content = readPluginFile(`agents/${args.agent_name}.md`);
        return { content: [{ type: 'text' as const, text: content }] };
      } catch (err) {
        return { content: [{ type: 'text' as const, text: `Agent "${args.agent_name}" not found: ${(err as Error).message}` }] };
      }
    }
  );
}
