---
name: config
description: View or change project configuration — scope, stack choices, design tokens, or rebuild the index.
argument-hint: "[view | set scope mvp | set stack.database supabase]"
user-invocable: true
model: inherit
effort: low
---

# 10x Development Team — Configuration

View or modify the project configuration stored in `.10x/project.json`.

## Commands

### `$ARGUMENTS` = "view" or empty
Show current config from `.10x/project.json`:
```
Project: [name]
Scope: [scope]
Status: [status]
Phase: [phase]

Stack:
  Framework: [framework]
  Styling: [styling]
  Language: [language]
  Backend: [backend]
  Database: [database]
  Auth: [auth]
  Testing: [testing]
  Deployment: [deployment]

Vision:
  Users: [target_users]
  Features: [core_features]
```

### `$ARGUMENTS` = "set scope [value]"
Change the project scope. Valid values: simple, prototype, mvp, production.

Warn the user about implications:
- Upgrading scope (simple → mvp): "This will enable more agents and add structure. Existing code stays."
- Downgrading scope (production → prototype): "This won't remove existing code but future work will be simpler."

Update `.10x/project.json` and log the change.

### `$ARGUMENTS` = "set stack.[key] [value]"
Change a stack choice. For example:
- `set stack.database supabase`
- `set stack.styling css` (switch from Tailwind to plain CSS)
- `set stack.auth nextauth`

Update `.10x/project.json` and log the change.
Warn if the change affects existing code.

### `$ARGUMENTS` = "set name [value]"
Rename the project in `.10x/project.json`.

## Rules
1. Always show the current value before changing it.
2. Log all config changes in `.10x/dev-log.md`.
3. Warn about breaking implications before making changes.
4. Never auto-change code when config changes — just update the config. Code changes happen in subsequent builds.

## Cache & Cost Info

When the user runs `/config view`, append this section at the bottom:

```
Cache & Cost:
  Plugin cache protection: active
  Recommended runner: npx @anthropic-ai/claude-code (avoids cache Bug 1)
  Resume method: /resumeproject (avoids --resume cache bug #34629)
  Details: .claude/knowledge/patterns/cache-optimization.md
```

If the user asks about costs or caching, point them to `knowledge/patterns/cache-optimization.md` which documents two confirmed Claude Code bugs (GitHub #40524 and #34629) and how this plugin's architecture avoids them.
