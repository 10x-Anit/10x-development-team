# 10x Development Team — MCP Server

MCP (Model Context Protocol) server that exposes the entire **10x Development Team** plugin as tools, resources, and prompts for any AI client.

Works with: **Claude Desktop**, **Claude Code**, **OpenAI Codex**, and any MCP-compatible client.

## Quick Start

```bash
# One-command setup (auto-detects your AI clients)
npx @10x-dev/mcp-server setup

# Check everything is working
npx @10x-dev/mcp-server doctor
```

That's it. Open your AI client and say: **"Start a new project"**.

## Setup by Client

### Claude Desktop

```bash
npx @10x-dev/mcp-server setup --client claude-desktop
```

Or manually add to `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "10x-dev": {
      "command": "npx",
      "args": ["@10x-dev/mcp-server"],
      "env": {
        "PROJECT_DIR": "/path/to/your/project"
      }
    }
  }
}
```

### Claude Code

```bash
npx @10x-dev/mcp-server setup --client claude-code
```

Or for direct plugin mode (no MCP, uses slash commands):
```bash
npx @10x-dev/mcp-server install-plugin /path/to/your/project
cd /path/to/your/project
# Now use /10x-development-team:start in Claude Code
```

### OpenAI Codex CLI

```bash
npx @10x-dev/mcp-server setup --client codex
```

### OpenCode

```bash
npx @10x-dev/mcp-server setup --client opencode
```

### Any MCP Client

Start the server with stdio transport:
```bash
npx @10x-dev/mcp-server
```

Set `PROJECT_DIR` to point to the project you're building:
```bash
PROJECT_DIR=/path/to/project npx @10x-dev/mcp-server
```

## What's Available

### Tools (12)

| Tool | Description |
|------|-------------|
| `tenx_start` | Initialize a new project with vision, scope, and type |
| `tenx_build` | Execute the full build — returns plan + task list |
| `tenx_projects` | List, search, manage all projects across sessions |
| `tenx_read_index` | Read current project state (.10x/ files) |
| `tenx_update_index` | Update file index, tasks, dev log, feature map |
| `tenx_get_skill` | Get detailed instructions for any skill (19 available) |
| `tenx_get_knowledge` | Get copy-paste code patterns from knowledge base |
| `tenx_list_knowledge` | List all knowledge files by category |
| `tenx_get_components` | Get the component registry (50+ components) |
| `tenx_save_memory` | Save decisions/context to persistent memory |
| `tenx_get_context` | Load cross-session context for current project |
| `tenx_get_agent` | Get specialist agent instructions (7 agents) |

### Resources (10)

| Resource | URI | Description |
|----------|-----|-------------|
| Knowledge Index | `knowledge://index` | All knowledge files listed by category |
| Knowledge File | `knowledge://{category}/{file}` | Individual code pattern files |
| Component Registry | `components://registry` | 50+ pre-built component definitions |
| Project Config | `project://config` | Project scope, stack, vision |
| Project Files | `project://files` | File index with descriptions |
| Project Tasks | `project://tasks` | Task list with status |
| Project Features | `project://features` | Feature map with data flow |
| Project Log | `project://log` | Development history |
| Skill Instructions | `skill://{name}` | 19 skill instruction files |
| Agent Instructions | `agent://{name}` | 7 agent role definitions |

### Prompts (8)

| Prompt | Description |
|--------|-------------|
| `tenx-system` | Core system prompt for the 10x plugin |
| `tenx-agent` | Load a specialist agent role |
| `tenx-build` | Full build with team-lead instructions |
| `tenx-add-page` | Add a page with frontend-dev instructions |
| `tenx-add-feature` | Add a feature with team-lead coordination |
| `tenx-connect-data` | Connect external data source |
| `tenx-modify-ui` | Quick UI changes |
| `tenx-fix` | Fix a bug with diagnostic instructions |

## CLI Commands

```bash
10x-mcp                          # Start MCP server (stdio)
10x-mcp setup                    # Auto-configure AI clients
10x-mcp setup --client <name>    # Configure specific client
10x-mcp install-plugin [path]    # Copy plugin files into project
10x-mcp doctor                   # Check installation health
10x-mcp --version                # Show version
```

## Architecture

```
User's AI Client (Claude Desktop, Codex, etc.)
    |
    | MCP Protocol (stdio)
    |
10x MCP Server
    |
    +-- Tools -----> Project lifecycle, knowledge access, memory
    +-- Resources -> Knowledge base, component registry, project index
    +-- Prompts ---> Agent roles, task-specific workflows
    |
    +-- SQLite ----> ~/.10x/memory.db (cross-project persistent memory)
    +-- Plugin ----> .claude/ (skills, agents, knowledge, components)
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PROJECT_DIR` | `cwd()` | Path to the project being built |
| `PLUGIN_ROOT` | auto-detect | Path to the 10x plugin repo |

## License

MIT
