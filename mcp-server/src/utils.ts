import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { homedir } from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Resolve the plugin's .claude/ directory.
 * Checks in order:
 *   1. mcp-server/plugin/ (npm package mode — files bundled at publish time)
 *   2. <repo>/.claude/ (development mode — running from repo)
 *   3. cwd/.claude/ (fallback)
 */
export function getPluginRoot(): string {
  // Check for bundled plugin files inside the npm package
  const packagePlugin = resolve(__dirname, '..', 'plugin');
  if (existsSync(join(packagePlugin, 'CLAUDE.md'))) {
    // Return a fake root where .claude/ would be packagePlugin's parent
    // We handle this in readPluginFile by checking both paths
    return resolve(packagePlugin, '..');
  }

  // Development mode: repo root
  const repoRoot = resolve(__dirname, '..', '..');
  if (existsSync(join(repoRoot, '.claude'))) {
    return repoRoot;
  }
  // Fallback: check current working directory
  if (existsSync(join(process.cwd(), '.claude'))) {
    return process.cwd();
  }
  throw new Error('Cannot find plugin root (.claude/ directory). Run from the plugin repo or set PLUGIN_ROOT env var.');
}

/**
 * Get the plugin root, with env var override
 */
export function resolvePluginRoot(): string {
  if (process.env.PLUGIN_ROOT) {
    return process.env.PLUGIN_ROOT;
  }
  return getPluginRoot();
}

/**
 * Read a file from the plugin's .claude/ directory.
 * Checks bundled plugin/ dir first (npm mode), then .claude/ (dev mode).
 */
export function readPluginFile(relativePath: string): string {
  // Check bundled plugin dir first (npm package mode)
  const bundledPath = join(resolve(__dirname, '..', 'plugin'), relativePath);
  if (existsSync(bundledPath)) {
    return readFileSync(bundledPath, 'utf-8');
  }

  // Fall back to .claude/ dir (development mode)
  const root = resolvePluginRoot();
  const fullPath = join(root, '.claude', relativePath);
  if (!existsSync(fullPath)) {
    throw new Error(`Plugin file not found: ${relativePath}`);
  }
  return readFileSync(fullPath, 'utf-8');
}

/**
 * Read a JSON file from the plugin
 */
export function readPluginJson<T = unknown>(relativePath: string): T {
  const content = readPluginFile(relativePath);
  return JSON.parse(content) as T;
}

/**
 * List all knowledge files available
 */
export function listKnowledgeFiles(): Record<string, Record<string, string>> {
  return readPluginJson<Record<string, Record<string, string>>>('knowledge/index.json');
}

/**
 * Read a specific knowledge file
 */
export function readKnowledgeFile(category: string, fileName: string): string {
  return readPluginFile(`knowledge/${category}/${fileName}`);
}

/**
 * Read the component registry
 */
export function readComponentRegistry(): unknown {
  return readPluginJson('components/registry.json');
}

/**
 * Read an agent instruction file
 */
export function readAgentInstructions(agentName: string): string {
  return readPluginFile(`agents/${agentName}.md`);
}

/**
 * Read a skill file
 */
export function readSkillFile(skillName: string): string {
  return readPluginFile(`skills/${skillName}/SKILL.md`);
}

/**
 * Get project directory — either from env var or current working directory
 */
export function getProjectDir(): string {
  return process.env.PROJECT_DIR || process.cwd();
}

/**
 * Read a project index file (.10x/)
 */
export function readProjectFile(fileName: string): string | null {
  const projectDir = getProjectDir();
  const fullPath = join(projectDir, '.10x', fileName);
  if (!existsSync(fullPath)) {
    return null;
  }
  return readFileSync(fullPath, 'utf-8');
}

/**
 * Write a project index file (.10x/)
 */
export function writeProjectFile(fileName: string, content: string): void {
  const projectDir = getProjectDir();
  const dirPath = join(projectDir, '.10x');
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
  writeFileSync(join(dirPath, fileName), content, 'utf-8');
}

/**
 * Get the SQLite database path
 */
export function getDbPath(): string {
  const dbDir = join(homedir(), '.10x');
  if (!existsSync(dbDir)) {
    mkdirSync(dbDir, { recursive: true });
  }
  return join(dbDir, 'memory.db');
}

/**
 * List all available skills
 */
export function listSkills(): string[] {
  return [
    'start', 'build', 'add-page', 'add-feature', 'connect-data',
    'modify-ui', 'generate', 'fix', 'refactor', 'review', 'explain',
    'deploy', 'resume', 'status', 'update-deps', 'config', 'index',
    'projects', 'help'
  ];
}

/**
 * List all available agents
 */
export function listAgents(): string[] {
  return ['team-lead', 'frontend-dev', 'backend-dev', 'ui-designer', 'qa-tester', 'deployer', 'error-recovery'];
}
