---
name: add-page
description: Add a new page to an existing app. Reads file index to understand the project, uses global components, updates the index after creation.
argument-hint: "<page name or description>"
user-invocable: true
model: inherit
effort: medium
context: fork
agent: frontend-dev
---

# 10x Development Team — Add Page

You are the frontend developer. The user wants to add a new page.

## Step 0: Read Project Index (ALWAYS FIRST)

1. Read `.10x/project.json` → get scope, stack, app type
2. Read `.10x/file-index.json` → understand existing files, patterns, components
3. Read `.10x/tasks.json` → check if this relates to an existing task

DO NOT scan the filesystem. The index tells you everything you need.
Only read actual files when you need their content to match patterns.

## Step 1: Understand the Page

Parse `$ARGUMENTS`. If unclear, ask ONE question:
"What should this page do and what should the user see on it?"

## Step 2: Scope-Aware Building

### If scope = "simple"
- Create a new `.html` file in `pages/`
- Link CSS from `css/styles.css` (add new rules there)
- Add JS interactions in `js/main.js` or a page-specific JS file
- Add navigation link in `index.html`
- NO frameworks, NO components — just HTML/CSS/JS

### If scope = "prototype"
- Create page file matching existing pattern
- Use mock data from `src/mock/data.ts`
- Keep it fast — inline styles OK, minimal components
- Add route entry

### If scope = "mvp" or "production"
- Check `.claude/components/registry.json` for available components
- Read existing page files from index to match patterns
- Import global components — NEVER recreate what exists
- Add proper loading and error states (production only)
- Add route and navigation entry

## Step 3: Build the Page

1. Create the page file
2. Connect to existing components/patterns
3. Add navigation link/route
4. Connect to API endpoints if needed

## Step 4: Update Project Index

After creating the page, update `.10x/file-index.json`:
```json
{
  "src/app/[new-page]/page.tsx": {
    "type": "page",
    "description": "[what this page does]",
    "created_by": "frontend-dev",
    "created_at": "[ISO date]",
    "dependencies": ["list", "of", "imports"],
    "exports": ["PageComponent"]
  }
}
```

Add entry to `.10x/dev-log.md`:
```
## [date] — Page Added: [page name]
- **Agent:** frontend-dev
- **Action:** Created new page
- **Files:** [list of created/modified files]
- **Components used:** [list from registry]
---
```

Update task status in `.10x/tasks.json` if applicable.

## Step 5: Verify

- Check the page renders (scope-appropriate verification)
- Confirm navigation works
- Mark task complete

Tell the user: "Added [page name]. [X] files created, [Y] components used."

<large-model-instructions>
## Production Page Standards (Opus)
- Page metadata (title, description, OG tags)
- Loading states with skeletons
- Error boundaries with fallback UI
- Keyboard navigation on all interactive elements
- aria-labels and semantic HTML
- Focus management on page transitions
- Analytics tracking hooks
- Image optimization
</large-model-instructions>
