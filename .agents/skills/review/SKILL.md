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
- Test pyramid sanity check: unit, integration, and e2e coverage exists for critical flows
- API contract verification between frontend and backend
- Database migration safety review for schema changes
- Security checklist (input validation, auth checks, CORS)
- Threat model review for auth bypass, injection, XSS/CSRF, secrets exposure, rate abuse, unsafe upload
- Accessibility checklist (aria labels, keyboard nav, contrast)
- Component reuse audit (no duplicates of registry components)
- Design token usage (no hardcoded colors/spacing)
- Import consistency (aliases used correctly)
- Performance budget / bundle analysis review
- Pre-deploy checklist and rollback plan exist
- Smoke test plan and post-deploy verification steps exist
- Handoff quality: tasks include enough context for the next agent to continue without rediscovery
- **Cache cost safety check**: Verify AGENTS.md and knowledge files don't contain Codex internal strings, billing sentinels, or CC source code that could trigger cache Bug 1 ([#40524](https://github.com/anthropics/Codex/issues/40524)). If found, flag as a cost risk.

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

When reviewing `production`, explicitly call out failures under:
- Architecture / spec
- Tests
- Contracts
- Migration safety
- Security
- Performance
- Release readiness
- Handoff quality

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
