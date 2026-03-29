import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import {
  readProjectFile, writeProjectFile, getProjectDir,
  readPluginFile, readSkillFile, listSkills,
  downloadFile, readStoryboard, writeStoryboard
} from '../utils.js';
import {
  registerProject, listProjects, getProjectByPath,
  searchProjects, deleteProject, touchProject,
  createSession, updateSession, getRecentSessions,
  saveMemory, getMemories, isSqliteAvailable
} from '../db.js';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

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
        'deploy', 'resumeproject', 'status', 'update-deps', 'config', 'index',
        'projects', 'help'
      ]).describe('Skill name to retrieve instructions for')
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
      agent_name: z.enum(['team-lead', 'frontend-dev', 'backend-dev', 'ui-designer', '3d-designer', 'qa-tester', 'deployer', 'error-recovery']).describe('Agent name')
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

  // ── User Interaction Tools ──

  server.tool(
    'tenx_ask_user',
    'Present a structured question to the user for approval or choice. Use this for story approval, design decisions, feature prioritization, or any decision that requires user input before proceeding. Returns the question formatted for clear user response.',
    {
      question_type: z.enum([
        'approval',       // Yes/No — "Do you approve this story?"
        'choice',         // Pick one — "Which style do you prefer?"
        'multi_choice',   // Pick many — "Which features do you want?"
        'open_ended',     // Free text — "Describe your vision"
        'priority',       // Rank items — "Order these by importance"
        'confirmation'    // Final check — "Ready to build?"
      ]).describe('Type of question to ask'),
      title: z.string().describe('Short title for the question (e.g., "Story Approval", "Design Style")'),
      context: z.string().optional().describe('Background context to help the user decide'),
      question: z.string().describe('The actual question text'),
      options: z.array(z.object({
        label: z.string().describe('Option label (e.g., "Option A: Animated Characters")'),
        description: z.string().optional().describe('Detailed description of this option'),
        preview: z.string().optional().describe('URL or path to a preview image/demo')
      })).optional().describe('Available options (for choice/multi_choice/priority types)'),
      default_option: z.string().optional().describe('Suggested default option label'),
      deadline_context: z.string().optional().describe('What happens next after the user answers')
    },
    async (args) => {
      // Save the pending question to project state so it persists
      const pendingQuestion = {
        id: `q-${Date.now()}`,
        type: args.question_type,
        title: args.title,
        context: args.context,
        question: args.question,
        options: args.options || [],
        default_option: args.default_option,
        deadline_context: args.deadline_context,
        asked_at: new Date().toISOString(),
        status: 'pending'
      };

      // Store in .10x/pending-questions.json
      let questions: unknown[] = [];
      try {
        const existing = readProjectFile('pending-questions.json');
        if (existing) questions = JSON.parse(existing);
      } catch { /* first question */ }
      questions.push(pendingQuestion);
      writeProjectFile('pending-questions.json', JSON.stringify(questions, null, 2));

      // Format the question for display
      let formatted = `\n## ${args.title}\n\n`;
      if (args.context) formatted += `${args.context}\n\n`;
      formatted += `**${args.question}**\n\n`;

      if (args.options && args.options.length > 0) {
        args.options.forEach((opt, i) => {
          const marker = args.default_option === opt.label ? ' ⭐ (recommended)' : '';
          formatted += `**${String.fromCharCode(65 + i)}. ${opt.label}**${marker}\n`;
          if (opt.description) formatted += `   ${opt.description}\n`;
          if (opt.preview) formatted += `   Preview: ${opt.preview}\n`;
          formatted += '\n';
        });
      }

      if (args.question_type === 'approval') {
        formatted += `Reply with **Yes** to approve, or tell me what you'd like to change.\n`;
      } else if (args.question_type === 'choice') {
        formatted += `Reply with the letter (A, B, C...) or the option name.\n`;
      } else if (args.question_type === 'multi_choice') {
        formatted += `Reply with the letters of all options you want (e.g., "A, C, D").\n`;
      } else if (args.question_type === 'confirmation') {
        formatted += `Reply **Go** to proceed, or tell me what needs to change first.\n`;
      }

      if (args.deadline_context) {
        formatted += `\n*Next step: ${args.deadline_context}*\n`;
      }

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            question_id: pendingQuestion.id,
            formatted_question: formatted,
            awaiting_response: true,
            instruction: 'Present this formatted question to the user and wait for their response before proceeding.'
          }, null, 2)
        }]
      };
    }
  );

  server.tool(
    'tenx_save_answer',
    'Save the user\'s answer to a previously asked question. Call this after the user responds to a tenx_ask_user question.',
    {
      question_id: z.string().describe('The question ID from tenx_ask_user'),
      answer: z.string().describe('The user\'s response'),
      selected_options: z.array(z.string()).optional().describe('Which options the user selected (for choice types)')
    },
    async (args) => {
      let questions: Array<{ id: string; status: string; answer?: string; selected_options?: string[]; answered_at?: string }> = [];
      try {
        const existing = readProjectFile('pending-questions.json');
        if (existing) questions = JSON.parse(existing);
      } catch { /* no questions file */ }

      const idx = questions.findIndex(q => q.id === args.question_id);
      if (idx >= 0) {
        questions[idx].status = 'answered';
        questions[idx].answer = args.answer;
        questions[idx].selected_options = args.selected_options;
        questions[idx].answered_at = new Date().toISOString();
        writeProjectFile('pending-questions.json', JSON.stringify(questions, null, 2));
      }

      // Also save to memory for cross-session persistence
      try {
        const project = getProjectByPath(getProjectDir()) as { id: string } | undefined;
        if (project) {
          saveMemory(project.id, 'user_feedback', `Q: ${args.question_id} → A: ${args.answer}`);
        }
      } catch { /* SQLite optional */ }

      return {
        content: [{ type: 'text' as const, text: `Answer saved for ${args.question_id}: "${args.answer.substring(0, 100)}"` }]
      };
    }
  );

  // ── 3D Asset Tools ──

  server.tool(
    'tenx_download_asset',
    'Download a 3D model, texture, HDRI, or other asset from a URL to the project\'s public/models/ directory. Supports GLB, GLTF, OBJ, FBX, HDR, PNG, JPG formats.',
    {
      url: z.string().url().describe('Direct download URL for the asset'),
      filename: z.string().describe('Filename to save as (e.g., "laptop.glb", "office.gltf")'),
      asset_type: z.enum(['model', 'texture', 'hdri', 'animation', 'other']).describe('Type of asset'),
      source: z.string().optional().describe('Source attribution (e.g., "Sketchfab - Author Name - CC-BY")'),
      license: z.string().optional().describe('License type (e.g., "CC-BY-4.0", "CC0", "MIT")'),
      description: z.string().optional().describe('What this asset is used for')
    },
    async (args) => {
      const projectDir = getProjectDir();
      const subDir = args.asset_type === 'model' ? 'models'
                   : args.asset_type === 'texture' ? 'textures'
                   : args.asset_type === 'hdri' ? 'hdri'
                   : args.asset_type === 'animation' ? 'animations'
                   : 'assets';
      const destPath = join(projectDir, 'public', subDir, args.filename);

      try {
        await downloadFile(args.url, destPath);

        // Track asset in .10x/assets.json
        let assets: Array<Record<string, unknown>> = [];
        try {
          const existing = readProjectFile('assets.json');
          if (existing) assets = JSON.parse(existing);
        } catch { /* first asset */ }

        assets.push({
          filename: args.filename,
          path: `public/${subDir}/${args.filename}`,
          public_url: `/${subDir}/${args.filename}`,
          type: args.asset_type,
          source: args.source || 'unknown',
          license: args.license || 'unknown',
          description: args.description || '',
          downloaded_at: new Date().toISOString()
        });

        writeProjectFile('assets.json', JSON.stringify(assets, null, 2));

        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify({
              status: 'downloaded',
              path: `public/${subDir}/${args.filename}`,
              public_url: `/${subDir}/${args.filename}`,
              usage_hint: `In React Three Fiber: useGLTF('/${subDir}/${args.filename}')`,
              attribution: args.source
            }, null, 2)
          }]
        };
      } catch (err) {
        return {
          content: [{
            type: 'text' as const,
            text: `Download failed: ${(err as Error).message}. Try downloading manually and placing in public/${subDir}/${args.filename}`
          }]
        };
      }
    }
  );

  server.tool(
    'tenx_list_assets',
    'List all downloaded 3D assets in the current project. Shows models, textures, HDRIs with their paths and licenses.',
    {},
    async () => {
      try {
        const content = readProjectFile('assets.json');
        if (!content) return { content: [{ type: 'text' as const, text: 'No assets downloaded yet. Use tenx_download_asset to add 3D models.' }] };
        const assets = JSON.parse(content);
        return { content: [{ type: 'text' as const, text: JSON.stringify({ assets, count: assets.length }, null, 2) }] };
      } catch (err) {
        return { content: [{ type: 'text' as const, text: `Could not read assets: ${(err as Error).message}` }] };
      }
    }
  );

  // ── Storyboard Tools ──

  server.tool(
    'tenx_storyboard',
    'Create or manage a storyboard for a 3D scroll-driven website. Defines scenes, 3D models, animations, text overlays, and scroll-to-animation mappings.',
    {
      action: z.enum(['create', 'read', 'update_scene', 'approve', 'reject']).describe('Action to perform'),
      storyboard: z.object({
        title: z.string().describe('Story title (e.g., "The Job Seeker\'s Journey")'),
        narrative: z.string().describe('Overall narrative in one sentence'),
        style: z.enum(['dora-hero', 'scroll-story', 'parallax-layers', 'scene-transitions', 'interactive-explore']).describe('3D website style'),
        scenes: z.array(z.object({
          id: z.string().describe('Scene ID (e.g., "scene-1")'),
          title: z.string().describe('Scene title (e.g., "The Search")'),
          scroll_range: z.string().describe('Scroll percentage range (e.g., "0%-20%")'),
          model_3d: z.object({
            source: z.string().describe('Where to get the model (Sketchfab URL, Mixamo, procedural, etc.)'),
            description: z.string().describe('What the 3D element looks like'),
            animation: z.string().describe('How it animates on scroll (e.g., "rotates 360°, scales from 0.5 to 1.2")')
          }),
          text_overlay: z.object({
            heading: z.string().describe('Main heading text'),
            subtext: z.string().optional().describe('Supporting text'),
            position: z.enum(['center', 'left', 'right', 'bottom']).describe('Text position relative to 3D')
          }),
          background: z.object({
            color: z.string().describe('Background color/gradient'),
            effects: z.array(z.string()).optional().describe('Visual effects (particles, stars, fog, etc.)')
          }),
          camera: z.object({
            start: z.string().describe('Camera position at scene start'),
            end: z.string().describe('Camera position at scene end'),
            movement: z.string().describe('How camera moves (orbit, dolly, pan, static)')
          }).optional(),
          transition: z.string().optional().describe('How this scene transitions to the next')
        })).optional().describe('Scene definitions')
      }).optional().describe('Full storyboard (for create action)'),
      scene_id: z.string().optional().describe('Scene ID to update (for update_scene action)'),
      scene_updates: z.record(z.unknown()).optional().describe('Scene field updates'),
      feedback: z.string().optional().describe('User feedback on rejection')
    },
    async (args) => {
      if (args.action === 'create' && args.storyboard) {
        const fullStoryboard = {
          ...args.storyboard,
          status: 'draft',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          approval_history: []
        };
        writeStoryboard(fullStoryboard);
        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify({
              status: 'created',
              storyboard: fullStoryboard,
              next_step: 'Present to user for approval using tenx_ask_user with question_type="approval"'
            }, null, 2)
          }]
        };
      }

      if (args.action === 'read') {
        const sb = readStoryboard();
        if (!sb) return { content: [{ type: 'text' as const, text: 'No storyboard exists. Create one with action="create".' }] };
        return { content: [{ type: 'text' as const, text: JSON.stringify(sb, null, 2) }] };
      }

      if (args.action === 'update_scene' && args.scene_id && args.scene_updates) {
        const sb = readStoryboard() as { scenes?: Array<{ id: string }>; updated_at?: string } | null;
        if (!sb || !sb.scenes) return { content: [{ type: 'text' as const, text: 'No storyboard to update.' }] };
        const idx = sb.scenes.findIndex(s => s.id === args.scene_id);
        if (idx < 0) return { content: [{ type: 'text' as const, text: `Scene "${args.scene_id}" not found.` }] };
        sb.scenes[idx] = { ...sb.scenes[idx], ...args.scene_updates };
        sb.updated_at = new Date().toISOString();
        writeStoryboard(sb);
        return { content: [{ type: 'text' as const, text: `Scene "${args.scene_id}" updated.` }] };
      }

      if (args.action === 'approve') {
        const sb = readStoryboard() as { status?: string; updated_at?: string; approval_history?: unknown[] } | null;
        if (!sb) return { content: [{ type: 'text' as const, text: 'No storyboard to approve.' }] };
        sb.status = 'approved';
        sb.updated_at = new Date().toISOString();
        if (sb.approval_history) sb.approval_history.push({ action: 'approved', at: new Date().toISOString() });
        writeStoryboard(sb);
        return { content: [{ type: 'text' as const, text: 'Storyboard APPROVED. Ready to build.' }] };
      }

      if (args.action === 'reject') {
        const sb = readStoryboard() as { status?: string; updated_at?: string; approval_history?: unknown[] } | null;
        if (!sb) return { content: [{ type: 'text' as const, text: 'No storyboard to reject.' }] };
        sb.status = 'revision_needed';
        sb.updated_at = new Date().toISOString();
        if (sb.approval_history) sb.approval_history.push({ action: 'rejected', feedback: args.feedback, at: new Date().toISOString() });
        writeStoryboard(sb);
        return { content: [{ type: 'text' as const, text: `Storyboard needs revision. Feedback: ${args.feedback}` }] };
      }

      return { content: [{ type: 'text' as const, text: 'Invalid action or missing parameters.' }] };
    }
  );

  // ── Browse & Explore Tools ──

  server.tool(
    'tenx_browse_3d_sources',
    'Search for free 3D models across multiple sources (Sketchfab, Poly Haven, Mixamo, etc.). Returns curated results with download links and license info.',
    {
      query: z.string().describe('Search query (e.g., "laptop", "rocket", "office desk", "character walking")'),
      source: z.enum(['all', 'sketchfab', 'polyhaven', 'mixamo', 'kenney', 'quaternius']).default('all').describe('Which source to search'),
      format_preference: z.enum(['glb', 'gltf', 'fbx', 'any']).default('glb').describe('Preferred file format'),
      license_filter: z.enum(['any', 'cc0', 'cc-by', 'free']).default('free').describe('License filter'),
      max_poly: z.number().optional().describe('Max polygon count for web performance (default: 50000)')
    },
    async (args) => {
      // Build curated source URLs for the user/agent to browse
      const sources: Record<string, string> = {
        sketchfab: `https://sketchfab.com/search?q=${encodeURIComponent(args.query)}&type=models&downloadable=true&sort_by=-likeCount`,
        polyhaven: `https://polyhaven.com/models?s=${encodeURIComponent(args.query)}`,
        mixamo: `https://www.mixamo.com/#/?page=1&query=${encodeURIComponent(args.query)}&type=Character`,
        kenney: `https://kenney.nl/assets?q=${encodeURIComponent(args.query)}`,
        quaternius: `https://quaternius.com/`,
      };

      const selectedSources = args.source === 'all'
        ? sources
        : { [args.source]: sources[args.source] };

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            query: args.query,
            format: args.format_preference,
            license: args.license_filter,
            max_polygons: args.max_poly || 50000,
            search_urls: selectedSources,
            recommended_workflow: [
              '1. Browse the search URLs to find suitable models',
              '2. Check license (CC0 or CC-BY preferred for web)',
              '3. Download as GLB format (smallest, web-optimized)',
              '4. Use tenx_download_asset to save to project',
              '5. Convert to R3F component using: https://gltf.pmnd.rs/',
              '6. Keep poly count under 50k for smooth 60fps'
            ],
            tips: {
              sketchfab: 'Filter by "Downloadable" and sort by "Likes". Check license tab before downloading.',
              polyhaven: 'All models are CC0 (no attribution needed). Best quality free models.',
              mixamo: 'Free animated characters. Export as FBX, convert to GLB in Blender.',
              kenney: 'All CC0. Low-poly game assets, great for stylized scenes.',
              quaternius: 'Free low-poly packs. Cartoon/stylized aesthetic.'
            }
          }, null, 2)
        }]
      };
    }
  );

  server.tool(
    'tenx_screenshot',
    'Take a screenshot of the running dev server for visual verification. Requires the dev server to be running. Uses Playwright if installed, falls back to a message.',
    {
      url: z.string().default('http://localhost:5173').describe('URL to screenshot'),
      filename: z.string().default('screenshot.png').describe('Output filename'),
      full_page: z.boolean().default(false).describe('Capture full scrollable page'),
      width: z.number().default(1280).describe('Viewport width'),
      height: z.number().default(720).describe('Viewport height'),
      wait_for: z.number().default(3000).describe('Wait ms for page to load before screenshot'),
      scroll_to: z.number().optional().describe('Scroll to this Y position before capturing')
    },
    async (args) => {
      const projectDir = getProjectDir();
      const outputPath = join(projectDir, '.10x', 'screenshots', args.filename);

      // Check if Playwright is available
      try {
        const { execSync } = await import('child_process');

        // Create screenshots dir
        const screenshotDir = join(projectDir, '.10x', 'screenshots');
        if (!existsSync(screenshotDir)) {
          mkdirSync(screenshotDir, { recursive: true });
        }

        // Try using Playwright via npx
        const scrollScript = args.scroll_to
          ? `await page.evaluate(() => window.scrollTo(0, ${args.scroll_to})); await page.waitForTimeout(1000);`
          : '';

        const script = `
          const { chromium } = require('playwright');
          (async () => {
            const browser = await chromium.launch();
            const page = await browser.newPage({ viewport: { width: ${args.width}, height: ${args.height} } });
            await page.goto('${args.url}', { waitUntil: 'networkidle', timeout: 15000 });
            await page.waitForTimeout(${args.wait_for});
            ${scrollScript}
            await page.screenshot({ path: '${outputPath.replace(/\\/g, '/')}', fullPage: ${args.full_page} });
            await browser.close();
          })();
        `;

        execSync(`node -e "${script.replace(/"/g, '\\"').replace(/\n/g, ' ')}"`, {
          cwd: projectDir,
          timeout: 30000,
          stdio: 'pipe'
        });

        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify({
              status: 'captured',
              path: outputPath,
              url: args.url,
              dimensions: `${args.width}x${args.height}`,
              scroll_position: args.scroll_to || 0
            }, null, 2)
          }]
        };
      } catch (err) {
        return {
          content: [{
            type: 'text' as const,
            text: JSON.stringify({
              status: 'playwright_not_available',
              message: `Playwright not installed or screenshot failed: ${(err as Error).message}`,
              install_command: 'npm install -D playwright && npx playwright install chromium',
              alternative: 'Open the dev server manually at ' + args.url + ' to verify visually.'
            }, null, 2)
          }]
        };
      }
    }
  );

  // ── Session Lifecycle Tools ──

  server.tool(
    'tenx_update_session',
    'Update or close the current build session. Saves what was accomplished, which tasks were completed, and which files were created. Call this when a build finishes or when the user ends a session.',
    {
      session_id: z.string().describe('Session ID from tenx_start or tenx_get_context'),
      summary: z.string().optional().describe('What was accomplished in this session'),
      tasks_completed: z.array(z.string()).optional().describe('Task IDs that were completed'),
      files_created: z.array(z.string()).optional().describe('File paths that were created'),
      files_modified: z.array(z.string()).optional().describe('File paths that were modified')
    },
    async (args) => {
      try {
        updateSession(args.session_id, {
          summary: args.summary,
          tasks_completed: args.tasks_completed ? JSON.stringify(args.tasks_completed) : undefined,
          files_created: args.files_created ? JSON.stringify(args.files_created) : undefined,
          files_modified: args.files_modified ? JSON.stringify(args.files_modified) : undefined
        });
        return { content: [{ type: 'text' as const, text: `Session ${args.session_id} updated and closed.` }] };
      } catch (err) {
        return { content: [{ type: 'text' as const, text: `Session update failed: ${(err as Error).message}` }] };
      }
    }
  );

  // ── Health Check Tool ──

  server.tool(
    'tenx_health',
    'Check the health of the 10x Development Team setup. Verifies SQLite, plugin files, project index, and reports what is working.',
    {},
    async () => {
      const checks: Record<string, string> = {};

      // Check SQLite
      checks.sqlite = isSqliteAvailable() ? 'ok' : 'unavailable (file-based fallback active)';

      // Check project index
      const project = readProjectFile('project.json');
      checks.project_index = project ? 'ok' : 'no project initialized';

      // Check file index
      const fileIndex = readProjectFile('file-index.json');
      if (fileIndex) {
        try {
          const parsed = JSON.parse(fileIndex);
          const fileCount = Object.keys(parsed.files || {}).length;
          checks.file_index = `ok (${fileCount} files tracked)`;
        } catch {
          checks.file_index = 'exists but invalid JSON';
        }
      } else {
        checks.file_index = 'not created yet';
      }

      // Check tasks
      const tasks = readProjectFile('tasks.json');
      if (tasks) {
        try {
          const parsed = JSON.parse(tasks);
          const taskList = parsed.tasks || [];
          const completed = taskList.filter((t: { status: string }) => t.status === 'completed').length;
          const pending = taskList.filter((t: { status: string }) => t.status === 'pending').length;
          checks.tasks = `ok (${taskList.length} total: ${completed} completed, ${pending} pending)`;
        } catch {
          checks.tasks = 'exists but invalid JSON';
        }
      } else {
        checks.tasks = 'not created yet';
      }

      // Check plugin files
      try {
        readPluginFile('CLAUDE.md');
        checks.plugin_files = 'ok';
      } catch {
        checks.plugin_files = 'not found — run 10x-mcp install-plugin or 10x-mcp setup';
      }

      // Check feature map
      const featureMap = readProjectFile('feature-map.json');
      checks.feature_map = featureMap ? 'ok' : 'not created yet';

      // Check dev log
      const devLog = readProjectFile('dev-log.md');
      checks.dev_log = devLog ? 'ok' : 'not created yet';

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify({
            status: 'healthy',
            version: '3.2.0',
            checks,
            project_dir: getProjectDir()
          }, null, 2)
        }]
      };
    }
  );

  // ── Model Sources Registry ──

  server.tool(
    'tenx_model_sources',
    'Get a curated registry of free 3D model sources with direct links, API info, and usage patterns for React Three Fiber projects.',
    {
      category: z.enum([
        'all',
        'characters',     // Animated human/character models
        'objects',        // Props, furniture, vehicles, etc.
        'environments',   // Landscapes, rooms, cities
        'effects',        // Particles, VFX, shaders
        'textures',       // PBR textures and materials
        'hdri'            // Environment maps
      ]).default('all').describe('Category of assets needed')
    },
    async () => {
      const registry = {
        models: {
          sketchfab: {
            url: 'https://sketchfab.com/features/free-3d-models',
            api: 'https://api.sketchfab.com/v3/search?type=models&downloadable=true&q=QUERY',
            formats: ['glb', 'gltf', 'fbx', 'obj'],
            license: 'CC-BY / CC0 (check per model)',
            quality: 'High — professional models, many photorealistic',
            best_for: 'High-quality hero models, product visualization, characters',
            r3f_usage: "import { useGLTF } from '@react-three/drei'; const { scene } = useGLTF('/models/name.glb')",
            tips: 'Use download API, filter by downloadable. Models may need optimization for web.'
          },
          polyhaven: {
            url: 'https://polyhaven.com/models',
            api: 'https://api.polyhaven.com/assets?t=models',
            formats: ['glb', 'gltf', 'fbx', 'blend'],
            license: 'CC0 (public domain — no attribution needed)',
            quality: 'Premium — curated, web-optimized',
            best_for: 'Environments, architectural props, nature elements',
            r3f_usage: "useGLTF('https://dl.polyhaven.org/file/ph-assets/Models/glb/MODEL_NAME.glb')",
            tips: 'Best free source. All CC0. Small file sizes.'
          },
          kenney: {
            url: 'https://kenney.nl/assets',
            formats: ['glb', 'gltf', 'obj', 'fbx'],
            license: 'CC0 (public domain)',
            quality: 'Stylized low-poly — consistent art style',
            best_for: 'Consistent low-poly scenes, game-style UI, complete asset packs',
            tips: 'Download full packs. Very web-friendly poly counts.'
          },
          quaternius: {
            url: 'https://quaternius.com/',
            formats: ['fbx', 'gltf'],
            license: 'CC0 (public domain)',
            quality: 'Cartoon low-poly — cute aesthetic',
            best_for: 'Stylized characters, animals, nature elements',
            tips: 'Great for playful/friendly app aesthetics.'
          }
        },
        characters: {
          mixamo: {
            url: 'https://www.mixamo.com/',
            formats: ['fbx (convert to glb)'],
            license: 'Free for all uses (Adobe account required)',
            quality: 'Professional animated characters',
            best_for: 'Animated human characters, walk cycles, gestures, dances',
            r3f_usage: "const { animations } = useGLTF('/models/character.glb'); const { actions } = useAnimations(animations, ref)",
            workflow: [
              '1. Pick a character on Mixamo',
              '2. Apply animation (e.g., "Typing", "Waving", "Victory")',
              '3. Download as FBX',
              '4. Import to Blender → Export as GLB',
              '5. Use useGLTF + useAnimations in R3F'
            ]
          },
          readyplayerme: {
            url: 'https://readyplayer.me/',
            formats: ['glb'],
            license: 'Free for personal/commercial use',
            quality: 'Custom avatars from photo',
            best_for: 'Personalized 3D avatars, selfie-based characters',
            tips: 'Combine with Mixamo animations for animated custom avatars.'
          }
        },
        textures_hdri: {
          polyhaven_textures: {
            url: 'https://polyhaven.com/textures',
            api: 'https://api.polyhaven.com/assets?t=textures',
            formats: ['jpg', 'png', 'exr'],
            license: 'CC0',
            best_for: 'PBR materials (wood, metal, fabric, concrete)',
            r3f_usage: "import { useTexture } from '@react-three/drei'; const texture = useTexture('/textures/name.jpg')"
          },
          polyhaven_hdri: {
            url: 'https://polyhaven.com/hdris',
            api: 'https://api.polyhaven.com/assets?t=hdris',
            formats: ['hdr', 'exr'],
            license: 'CC0',
            best_for: 'Environment lighting, realistic reflections',
            r3f_usage: "<Environment files='/hdri/name.hdr' /> or <Environment preset='city' />"
          }
        },
        tools: {
          gltf_to_r3f: {
            url: 'https://gltf.pmnd.rs/',
            description: 'Drag-and-drop GLTF/GLB → React Three Fiber JSX component converter',
            usage: 'Upload your .glb file, get a ready-to-use React component with proper materials, animations, and types.'
          },
          gltf_report: {
            url: 'https://gltf.report/',
            description: 'Inspect and optimize GLTF models — check file size, poly count, textures',
            usage: 'Upload before using in project to verify web-readiness.'
          },
          gltf_transform: {
            url: 'https://gltf-transform.dev/',
            description: 'CLI tool to optimize GLTF models — compress textures, reduce polygons',
            usage: 'npx @gltf-transform/cli optimize input.glb output.glb --compress draco'
          }
        }
      };

      return {
        content: [{
          type: 'text' as const,
          text: JSON.stringify(registry, null, 2)
        }]
      };
    }
  );
}
