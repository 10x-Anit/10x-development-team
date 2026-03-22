---
name: update-deps
description: Check and update project dependencies. Reports outdated packages, security vulnerabilities, and handles updates safely.
argument-hint: "[optional: specific package name]"
user-invocable: true
model: inherit
effort: medium
context: fork
agent: qa-tester
---

# 10x Development Team — Update Dependencies

Check and update packages safely.

## Step 0: Scope Check

Read `.10x/project.json`. If scope is "simple" (HTML/CSS/JS):
- Tell user: "This is a plain HTML project — no package dependencies to update."
- Exit.

## Step 1: Check Current State

Run:
```bash
npm outdated 2>/dev/null || true
npm audit 2>/dev/null || true
```

## Step 2: Report

Format clearly:
```
## Dependency Report

### Outdated Packages
| Package | Current | Latest | Type |
|---------|---------|--------|------|
| react   | 18.2.0  | 19.1.0 | major |
| next    | 14.1.0  | 14.2.3 | patch |

### Security Vulnerabilities
[X] critical, [Y] high, [Z] moderate

### Recommendation
- Safe to update: [patch/minor packages]
- Needs review: [major version changes]
- Security fixes: [packages with vulnerabilities]
```

## Step 3: Ask User

"Which updates should I apply?"
- All safe updates (patch + minor)
- Everything including major versions
- Only security fixes
- Specific packages
- None — just wanted the report

## Step 4: Apply Updates

If user approves:
1. Create a git branch if in a git repo: `git checkout -b deps-update`
2. Run the appropriate update command
3. Run `npm test` to check for breakage
4. Run `npm run build` to verify build works
5. Report results

## Step 5: Log

Update `.10x/dev-log.md` with what was updated.
Update `.10x/file-index.json` if package.json or lock file changed.

## Rules
1. NEVER auto-update without user approval.
2. ALWAYS run tests after updating.
3. Major version updates get a warning about breaking changes.
4. Use WebSearch to check changelogs for major updates.
