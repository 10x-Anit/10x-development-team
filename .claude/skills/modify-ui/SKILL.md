---
name: modify-ui
description: Quick UI changes — swap layouts, change colors, rearrange sections, switch components, toggle dark mode, adjust spacing. Reads file index to know exactly which files to touch.
argument-hint: "<what to change> — e.g. 'make it dark mode', 'change cards to a table', 'add a sidebar', 'swap the hero section'"
user-invocable: true
model: inherit
effort: medium
context: fork
agent: frontend-dev
---

# 10x Development Team — Modify UI

Fast, targeted UI changes. No planning overhead — just read, change, done.

## Step 0: Read Project Index (MANDATORY)

```
ACTION 1: Read .10x/project.json → extract: scope, stack
ACTION 2: Read .10x/file-index.json → find the files that need changing
ACTION 3: Read .claude/components/registry.json → check available components
ACTION 4: Read .10x/feature-map.json → understand which feature the UI belongs to
```

If `.10x/` does not exist, STOP. Tell user: "Run /10x-development-team:start first."

## Step 1: Parse the Change

Map `$ARGUMENTS` to a change type:

| User says | Change type | What to do |
|-----------|------------|------------|
| "dark mode", "make it dark" | theme | Toggle dark mode support |
| "change cards to table", "show as list" | layout-swap | Replace component type |
| "add sidebar", "add filter panel" | add-element | Insert new component |
| "remove the banner", "hide the footer" | remove-element | Remove or hide component |
| "change colors", "make it blue" | re-theme | Update color tokens |
| "bigger text", "more spacing" | spacing | Adjust typography/spacing |
| "rearrange", "move X above Y" | reorder | Change component order |
| "make it responsive", "fix mobile" | responsive | Add/fix responsive breakpoints |
| "add animation", "make it smooth" | animation | Add Framer Motion or CSS transitions |
| "change the layout", "two columns" | restructure | Change page layout structure |

If unclear, ask ONE question: "What should it look like after the change?"

## Step 2: Locate Files to Change

Use `.10x/file-index.json` to find the exact files. DO NOT scan the filesystem.

| Change type | Look for files with type |
|------------|------------------------|
| theme | "config", "style" (tailwind.config, globals.css, theme files) |
| layout-swap | "page", "component" (the page containing the component to swap) |
| add-element | "page" (target page) + check registry for the component to add |
| remove-element | "page" (target page) |
| re-theme | "config", "style" (tailwind.config, CSS variables) |
| spacing | "style", "config" (global styles, tailwind config) |
| reorder | "page" (target page) |
| responsive | "page", "component" (the broken/target elements) |
| animation | "page", "component" (elements to animate) |
| restructure | "page", "layout" (page and layout files) |

Read ONLY the files identified. Do not read unrelated files.

## Step 3: Scope-Aware Execution

### scope = "simple" (HTML/CSS/JS)
- Edit `css/styles.css` for visual changes
- Edit HTML files for structural changes
- Edit `js/main.js` for interactive changes
- NO npm packages, NO React — vanilla only
- Dark mode: add CSS custom properties + toggle JS
- Layout changes: restructure HTML elements

### scope = "prototype" or "mvp" or "production"
- Check component registry FIRST — if the target component exists, import it
- Use Tailwind classes for styling changes
- Use existing design tokens from tailwind.config
- For dark mode: add `dark:` variants to Tailwind classes + theme toggle
- For animations: use Framer Motion (read `.claude/knowledge/libraries/framer-motion.md`)
- For layout swaps: import the replacement component from registry

## Step 4: Execute the Change

Rules:
1. **MINIMAL CHANGES** — touch only the files that need changing
2. **PRESERVE FUNCTIONALITY** — never break existing features for a visual change
3. **USE EXISTING TOKENS** — don't hardcode colors, use design tokens / Tailwind config
4. **CHECK REGISTRY** — if you need a component, check if it exists before creating one
5. **RESPONSIVE** — every change must work on mobile too (unless user explicitly says desktop-only)

### For component swaps:
1. Read the current component in the page
2. Check registry for the replacement component
3. Read the replacement component template
4. Replace in the page file, preserving the same data/props flow
5. Remove old component import, add new one

### For theme changes:
1. Read the current theme config (tailwind.config or CSS variables)
2. Apply the change to tokens (not individual components)
3. Changes cascade automatically to all components using those tokens

### For adding elements:
1. Check registry for the component
2. Read the component template
3. If component doesn't exist in project, create it in `src/components/`
4. Import into the target page
5. Place it in the right position in the JSX/HTML

## Step 5: Update Index (MANDATORY)

1. Update `.10x/file-index.json` with every file modified or created
2. Update `.10x/feature-map.json` if the change affects feature files
3. Append to `.10x/dev-log.md`:

```markdown
## [date] — UI Change: [what changed]
- **Agent:** frontend-dev
- **Change type:** [theme|layout-swap|add-element|etc]
- **Files modified:** [list]
- **Files created:** [list or "none"]
- **Components used from registry:** [list or "none"]
---
```

Tell user: "Done. [one sentence describing the visual change]. Run `npm run dev` to see it."

For scope = "simple": "Done. [one sentence]. Open index.html in your browser to see it."

## Design System Changes

When the user asks for visual changes (colors, theme, dark mode, etc.):
1. ALWAYS modify globals.css and/or tailwind.config.ts FIRST
2. NEVER change individual component files for color changes — update the design tokens
3. For dark mode: ensure all tokens have .dark overrides in globals.css
4. For color changes: update --primary HSL values, not individual className props
5. Reference: .claude/knowledge/patterns/design-system.md for token presets

## Animation Changes

When the user asks to add/change animations:
1. Read .claude/knowledge/libraries/framer-motion.md for animation patterns
2. For simple additions: use CSS animations in tailwind.config.ts keyframes
3. For complex animations: use Framer Motion components
4. Common requests:
   - "Add scroll animations" → wrap sections in ScrollReveal from framer-motion.md
   - "Add page transitions" → add template.tsx with AnimatePresence
   - "Make it more dynamic" → add staggered children to grids/lists
   - "Add a cool background" → gradient orbs or floating particles from framer-motion.md

<large-model-instructions>
## Enhanced UI Modifications (Opus)
- For theme changes: ensure all color contrast ratios meet WCAG AA
- For layout swaps: add Framer Motion layout animations for smooth transitions
- For dark mode: add system preference detection + manual toggle with persistence
- For responsive fixes: test against 5 breakpoints (320, 768, 1024, 1280, 1536)
- Add aria-labels and focus indicators on any new interactive elements
- For animations: use reduced-motion media query for accessibility
- Suggest related improvements: "I also noticed [X] could look better. Want me to fix that too?"
</large-model-instructions>
