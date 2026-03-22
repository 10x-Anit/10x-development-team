# .10x Directory — Project Intelligence System

This directory is created and maintained by the **10x Development Team** plugin.

## Files

| File | Purpose | Who reads it |
|------|---------|-------------|
| `project.json` | App vision, scope, stack, status | All agents (first thing they read) |
| `file-index.json` | Every file in the project with type, description, dependencies | All agents (instead of scanning filesystem) |
| `tasks.json` | Task list with goals, assignments, status | Team lead + all assigned agents |
| `dev-log.md` | Chronological log of all development actions | Team lead, resume skill |

## Why This Exists

Agents waste tokens scanning the filesystem to understand a project. This index system means:
- **Agents read ONE file** to know what exists (not `ls -R` or `find .`)
- **Tasks have clear goals** so agents know exactly what to produce
- **The dev log** lets agents pick up where others left off
- **No duplicate work** because the index tracks who created what

## Keeping It In Sync

The plugin's hooks automatically remind agents to update the index.
If things get out of sync, run: `/10x-development-team:index rebuild`
