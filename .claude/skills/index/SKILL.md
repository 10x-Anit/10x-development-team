---
name: index
description: View, rebuild, or verify the project index system. Use when the index seems out of sync with actual files.
argument-hint: "[view | rebuild | verify]"
user-invocable: true
model: inherit
effort: medium
---

# 10x Development Team — Index Manager

## STEP 0: Parse Command

Read `$ARGUMENTS`. Execute the matching command:
- Empty or "view" → go to COMMAND: VIEW
- "rebuild" → go to COMMAND: REBUILD
- "verify" → go to COMMAND: VERIFY

If `.10x/` does not exist, STOP. Tell user: "No project found. Run /10x-development-team:start first."

---

## COMMAND: VIEW

```
STEP 1: Read .10x/project.json → show: name, scope, status, phase
STEP 2: Read .10x/tasks.json → show: task summary (X completed, Y pending, Z blocked)
STEP 3: Read .10x/file-index.json → show: file count by type
STEP 4: Read .10x/feature-map.json → show: feature list with status
STEP 5: Read .10x/dev-log.md (last 20 lines) → show: last 5 entries
```

Output as a clean summary. This is READ-ONLY.

---

## COMMAND: REBUILD

CAUTION: This scans the filesystem and rewrites the index. Use when files were created outside the plugin.

```
STEP 1: Read .10x/project.json → keep project config
STEP 2: Glob for all source files: src/**/*.{ts,tsx,js,jsx,html,css}
STEP 3: For EACH file found:
        - Determine type: page, component, api, service, lib, hook, type, style, config, test
        - Read first 20 lines to extract: exports, imports
        - Create file-index entry with type, description (inferred from filename + content), dependencies
STEP 4: Write the rebuilt index to .10x/file-index.json
STEP 5: Append to .10x/dev-log.md:
        "Index rebuilt. [X] files indexed."
```

Tell user: "Index rebuilt. [X] files indexed. [Y] new files found."

---

## COMMAND: VERIFY

Check if the index matches the actual filesystem.

```
STEP 1: Read .10x/file-index.json → get list of indexed files
STEP 2: Glob for all source files: src/**/*.{ts,tsx,js,jsx,html,css}
STEP 3: Compare:
        - Files in index but NOT on filesystem → "STALE: [path] (indexed but deleted)"
        - Files on filesystem but NOT in index → "MISSING: [path] (exists but not indexed)"
STEP 4: Report:
        "Index verification:
          Indexed: [X] files
          On disk: [Y] files
          Stale entries: [count]
          Missing entries: [count]
          [list each stale and missing file]"
```

If mismatches found, ask: "Should I rebuild the index to fix this?"
