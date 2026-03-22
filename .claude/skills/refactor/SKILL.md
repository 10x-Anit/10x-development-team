---
name: refactor
description: Improve code quality without changing functionality. Reads file index to understand dependencies. Shows plan before making changes.
argument-hint: "<area to refactor or 'all'>"
user-invocable: true
model: inherit
effort: high
context: fork
agent: team-lead
---

# 10x Development Team — Refactor

## STEP 0: Read Project Index (MANDATORY)

```
ACTION 1: Read .10x/project.json → extract: scope
ACTION 2: Read .10x/file-index.json → understand file dependencies
ACTION 3: Read .10x/feature-map.json → understand feature boundaries
```

## STEP 1: Scope Check

### scope = "simple"
ALLOWED refactors: CSS cleanup, HTML semantics, JS simplification.
FORBIDDEN: suggesting migration to a framework. STOP if user asks for this — say "That would be a scope upgrade, not a refactor. Use /10x-development-team:config set scope mvp."

### scope = "prototype"
Tell user: "This is a prototype. Refactoring may not be worth the time. Proceed?" STOP and wait for confirmation.

### scope = "mvp" or "production"
Full refactoring allowed.

## STEP 2: Identify Targets

If `$ARGUMENTS` = "all" or empty:
1. Read file-index.json — look for:
   - Files with type = "component" that are inside page directories (should be global)
   - Multiple files importing the same utility code (candidate for shared hook/util)
   - Files with many dependencies (high coupling)
   - Large files (>200 lines — candidate for splitting)
2. List each target

If `$ARGUMENTS` specifies an area:
1. Find related files in file-index.json
2. Read those files
3. Identify improvement opportunities

## STEP 3: Present Plan (MANDATORY — wait for approval)

STOP. Show the user:
```
Refactor Plan:
1. [file] — [what to change] — [why]
2. [file] — [what to change] — [why]
3. [file] — [what to change] — [why]

This will NOT change any functionality. Approve? (yes/no/partial)
```

DO NOT proceed until user approves.

## STEP 4: Execute Approved Changes

For each approved change:
1. Read the file AND its dependencies (from file-index)
2. Make the change
3. Verify nothing broke: `npx tsc --noEmit` (for TS projects)
4. Update `.10x/file-index.json` — descriptions and dependencies may change
5. Update `.10x/feature-map.json` if file paths changed

## STEP 5: Log and Report

Append to `.10x/dev-log.md`.
Tell user: "Refactored [X] files. No functionality changed."

<large-model-instructions>
## Enhanced Refactoring (Opus)
- Identify and extract repeated patterns into shared utilities
- Suggest component composition improvements
- Flag performance issues (unnecessary re-renders, missing memoization)
- Check for proper TypeScript usage (avoid any, use proper generics)
- Identify dead code that can be removed
</large-model-instructions>
