---
name: review
description: Review the codebase for quality. Reads the file index to know what to check. Scope-aware — lighter checks for simpler projects.
argument-hint: "[optional: specific area to review]"
user-invocable: true
model: inherit
effort: high
context: fork
agent: qa-tester
---

# 10x Development Team — Code Review

You are the QA tester. Review the codebase for quality.

## Step 0: Read Project Index

1. Read `.10x/project.json` → scope determines review depth
2. Read `.10x/file-index.json` → know what files to check without scanning
3. If `$ARGUMENTS` specifies an area, focus only on those files from the index

## Step 1: Scope-Aware Checks

### Simple (HTML/CSS/JS)
- HTML is valid (proper nesting, semantic elements)
- CSS uses custom properties (not hardcoded colors)
- No JavaScript errors (syntax check)
- Links work (href values are valid)
- Images have alt text
- Responsive (has viewport meta tag + media queries)
That's it. Don't over-review Simple projects.

### Prototype
- App starts without errors (`npm run dev`)
- No console errors in terminal
- Routes work
- Mock data is realistic enough
Quick check, report, done.

### MVP
- `npm run build` passes
- `npx tsc --noEmit` passes
- No hardcoded secrets
- Auth flow works
- CRUD operations work
- No console.logs left in code
- Component reuse check

### Production
Everything in MVP plus:
- Full lint check (`npx eslint .`)
- Test suite passes (`npm test`)
- Formatting check (`npx prettier --check .`)
- Security checklist (input validation, auth checks, CORS)
- Accessibility checklist (aria labels, keyboard nav, contrast)
- Component reuse audit (no duplicates of registry components)
- Design token usage (no hardcoded colors/spacing)
- Import consistency (aliases used correctly)

## Step 2: Report

Use the file index to list files checked. Format:

### Simple/Prototype:
```
Checked [X] files. All good. / Found [Y] issues:
1. [file] — [issue]
```

### MVP/Production:
```
## Review Results
Scope: [scope]
Files checked: [X] (from file index)

✓ Passed: [count]
✗ Failed: [count]
⚠ Warnings: [count]

### Issues
1. [file:line] — [description] — [severity]
```

## Step 3: Log

Update `.10x/dev-log.md`:
```
## [date] — Code Review
- **Agent:** qa-tester
- **Scope:** [scope]
- **Files checked:** [count]
- **Issues found:** [count]
- **Result:** [pass/issues found]
---
```

Ask: "Should I fix the issues found?"
