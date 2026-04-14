---
name: fix
description: Fix a bug. User describes the problem, agents locate the cause using the file index and feature map, apply targeted fix, verify.
argument-hint: "<describe the bug in plain language>"
user-invocable: true
model: inherit
effort: high
context: fork
agent: team-lead
---

# 10x Development Team — Fix Bug

## STEP 0: Read Project Index (MANDATORY)

```
ACTION 1: Read .10x/project.json → extract: scope, stack
ACTION 2: Read .10x/file-index.json → get file map
ACTION 3: Read .10x/feature-map.json → understand feature wiring
ACTION 4: Read .10x/tasks.json → check for related tasks
```

## STEP 1: Parse Bug Description

Read `$ARGUMENTS`. Map the user's words to file types:

| User says | Look in (from file-index.json) |
|-----------|-------------------------------|
| "page is blank/broken" | files with type = "page" |
| "button doesn't work" | files with type = "page" + "component" |
| "data not showing" | files with type = "api" + data-fetching code in pages |
| "login not working" | feature-map → authentication feature → all listed files |
| "error when I open" | entry point files: layout.tsx, page.tsx, providers |
| "API returns wrong data" | files with type = "api" + "service" |
| "styling looks wrong" | files with type = "style" + "component" |

If description is too vague, ask ONE question: "What do you see vs what you expected?"

## STEP 2: Locate the Bug

1. Use file-index.json and feature-map.json to find the relevant files (DO NOT grep the whole project)
2. Read ONLY those files
3. Identify the root cause — look for:
   - Missing imports or wrong paths
   - Undefined variables or wrong prop names
   - API response shape mismatch (check api_shape in file-index)
   - Missing error handling (no try/catch on fetch)
   - Wrong conditional logic
   - Missing environment variable

## STEP 3: Report to User

Tell the user EXACTLY:
```
Found the issue:
  File: [exact path]
  Line: [approximate line number]
  Problem: [one sentence]
  Fix: [what will be changed]
```

For scope = "simple" or "prototype": fix immediately without waiting for approval.
For scope = "mvp" or "production": wait for user confirmation.

## STEP 4: Apply Fix

1. Create task in `.10x/tasks.json` with id `fix-[short-name]`
2. Delegate to the right agent:
   - UI/display → frontend-dev
   - API/data → backend-dev
   - Both → fix backend FIRST, then frontend
3. If fix is small (1-3 lines), apply it yourself without delegation

## STEP 5: Verify

Run scope-appropriate verification:
- scope = "simple": check HTML is valid
- scope = "prototype": `npm run dev` → no console errors
- scope = "mvp": `npx tsc --noEmit` + `npm run dev`
- scope = "production": `npx tsc --noEmit` + `npm test` + `npm run dev`

## STEP 6: Update Index (MANDATORY)

Update `.10x/file-index.json` with modified files.
Update `.10x/feature-map.json` if feature wiring changed.
Append to `.10x/dev-log.md`:
```markdown
## [date] — Bug Fix: [title]
- **Agent:** [who]
- **Root cause:** [what was wrong]
- **Fix:** [what changed]
- **Files modified:** [list]
- **Verified:** [which command passed]
---
```

Tell user: "Fixed. [one sentence summary]."

<large-model-instructions>
## Enhanced Debugging (Opus)
- Check for related issues in other files using feature-map.json wiring
- Add error handling around the fixed area to prevent similar bugs
- Add a test case that covers this specific bug scenario
- Check if the same pattern exists elsewhere and is also broken
</large-model-instructions>
