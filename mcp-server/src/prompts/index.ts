import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { readPluginFile } from '../utils.js';

/**
 * Register all MCP prompts on the server.
 * Prompts provide reusable instruction templates for AI clients.
 */
export function registerPrompts(server: McpServer): void {

  // ── Core System Prompt (no args) ──
  server.prompt(
    'tenx-system',
    'The core 10x Development Team system prompt. Use as base instruction when building apps.',
    () => {
      const claudeMd = readPluginFile('CLAUDE.md');
      return {
        messages: [{
          role: 'user' as const,
          content: {
            type: 'text' as const,
            text: `You are operating as part of the 10x Development Team plugin. Follow these instructions precisely:\n\n${claudeMd}`
          }
        }]
      };
    }
  );

  // ── Agent Role Prompt ──
  server.prompt(
    'tenx-agent',
    {
      agent: z.enum(['team-lead', 'frontend-dev', 'backend-dev', 'ui-designer', '3d-designer', 'qa-tester', 'deployer', 'error-recovery']).describe('Agent role to assume')
    },
    ({ agent }) => {
      const instructions = readPluginFile(`agents/${agent}.md`);
      return {
        messages: [{
          role: 'user' as const,
          content: {
            type: 'text' as const,
            text: `You are now acting as the ${agent} agent. Follow these instructions:\n\n${instructions}`
          }
        }]
      };
    }
  );

  // ── Build Prompt ──
  server.prompt(
    'tenx-build',
    {
      scope: z.enum(['simple', 'prototype', 'mvp', 'production']).describe('Project scope')
    },
    ({ scope }) => {
      const teamLead = readPluginFile('agents/team-lead.md');
      const buildSkill = readPluginFile('skills/build/SKILL.md');
      return {
        messages: [{
          role: 'user' as const,
          content: {
            type: 'text' as const,
            text: `You are the team lead for a ${scope}-scope project. Follow these agent instructions:\n\n${teamLead}\n\n---\n\nNow execute the build skill:\n\n${buildSkill}`
          }
        }]
      };
    }
  );

  // ── Add Page Prompt ──
  server.prompt(
    'tenx-add-page',
    {
      page_description: z.string().describe('What the page should show and do')
    },
    ({ page_description }) => {
      const agent = readPluginFile('agents/frontend-dev.md');
      const skill = readPluginFile('skills/add-page/SKILL.md');
      return {
        messages: [{
          role: 'user' as const,
          content: {
            type: 'text' as const,
            text: `You are the frontend developer. Add this page:\n\n"${page_description}"\n\nFollow these instructions:\n\n${agent}\n\n---\n\nSkill instructions:\n\n${skill}`
          }
        }]
      };
    }
  );

  // ── Add Feature Prompt ──
  server.prompt(
    'tenx-add-feature',
    {
      feature_description: z.string().describe('What the feature should let users do')
    },
    ({ feature_description }) => {
      const agent = readPluginFile('agents/team-lead.md');
      const skill = readPluginFile('skills/add-feature/SKILL.md');
      return {
        messages: [{
          role: 'user' as const,
          content: {
            type: 'text' as const,
            text: `You are the team lead. Add this feature:\n\n"${feature_description}"\n\nFollow these instructions:\n\n${agent}\n\n---\n\nSkill instructions:\n\n${skill}`
          }
        }]
      };
    }
  );

  // ── Connect Data Prompt ──
  server.prompt(
    'tenx-connect-data',
    {
      data_source: z.string().describe('Data source (e.g., "Supabase", "my REST API at api.example.com", "CSV file")')
    },
    ({ data_source }) => {
      const agent = readPluginFile('agents/team-lead.md');
      const skill = readPluginFile('skills/connect-data/SKILL.md');
      return {
        messages: [{
          role: 'user' as const,
          content: {
            type: 'text' as const,
            text: `You are the team lead. Connect this data source:\n\n"${data_source}"\n\nFollow these instructions:\n\n${agent}\n\n---\n\nSkill instructions:\n\n${skill}`
          }
        }]
      };
    }
  );

  // ── Modify UI Prompt ──
  server.prompt(
    'tenx-modify-ui',
    {
      change_description: z.string().describe('What to change (e.g., "make it dark mode", "change cards to table")')
    },
    ({ change_description }) => {
      const agent = readPluginFile('agents/frontend-dev.md');
      const skill = readPluginFile('skills/modify-ui/SKILL.md');
      return {
        messages: [{
          role: 'user' as const,
          content: {
            type: 'text' as const,
            text: `You are the frontend developer. Make this UI change:\n\n"${change_description}"\n\nFollow these instructions:\n\n${agent}\n\n---\n\nSkill instructions:\n\n${skill}`
          }
        }]
      };
    }
  );

  // ── Fix Bug Prompt ──
  server.prompt(
    'tenx-fix',
    {
      bug_description: z.string().describe('What is broken — describe what you see vs what you expected')
    },
    ({ bug_description }) => {
      const agent = readPluginFile('agents/team-lead.md');
      const skill = readPluginFile('skills/fix/SKILL.md');
      return {
        messages: [{
          role: 'user' as const,
          content: {
            type: 'text' as const,
            text: `You are the team lead. Fix this bug:\n\n"${bug_description}"\n\nFollow these instructions:\n\n${agent}\n\n---\n\nSkill instructions:\n\n${skill}`
          }
        }]
      };
    }
  );
}
