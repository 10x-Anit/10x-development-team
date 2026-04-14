---
name: help
description: Show all available 10x Development Team commands, what they do, and how to use them.
user-invocable: true
model: inherit
effort: low
disable-model-invocation: true
---

# 10x Development Team — Help

Show the user everything available.

## Output This Exactly:

```
+----------------------------------------------+
|     10x Development Team — Commands          |
+----------------------------------------------+

GETTING STARTED
  /start              Start a new project
  /help               This help screen

BUILD & CREATE
  /build              Full build from vision
  /add-page           Add a page to your app
  /add-feature        Add a feature (frontend + backend)
  /generate           Generate a specific piece of code
                      (component, api, hook, model, test)

CONNECT & MODIFY
  /connect-data       Connect external data (API, Supabase,
                      Firebase, Sheets, CSV, etc.)
  /modify-ui          Quick UI changes — layout, theme,
                      colors, components, dark mode

FIX & IMPROVE
  /fix                Fix a bug — describe the problem
  /refactor           Improve code quality
  /review             Full code review
  /update-deps        Check/update dependencies

UNDERSTAND & TRACK
  /explain            Explain how something works
  /status             Quick project overview
  /index              View/rebuild project index
  /projects           List/switch between all your projects

CONFIGURE & DEPLOY
  /config             View/change project settings
  /deploy             Set up deployment
  /resumeproject      Continue from where you left off

PROJECT SCOPES
  simple      HTML/CSS/JS — no frameworks, no build tools
  prototype   Vite + React — fast, with mock data
  mvp         Next.js — real data, basic auth
  production  Full stack — tested, CI/CD, optimized

COST OPTIMIZATION
  This plugin avoids two confirmed Codex cache bugs:

  Bug 1: History invalidation (#40524)
    Workaround: Use npx @anthropic-ai/Codex
    Plugin: Clean project files avoid the trigger
  Bug 2: --resume cache miss (#34629, since v2.1.69)
    Plugin: /resumeproject reads index files in a
    fresh session — no --resume cache rebuild needed

TIPS
  - Use @ to reference files: @src/components/Button.tsx
  - Use Ctrl+T to see task progress
  - Your project state is saved in .10x/ directory
  - Type ! before a command to run it in terminal: !npm run dev
  - Use npx @anthropic-ai/Codex to avoid cache Bug 1
  - Use /resumeproject instead of --resume to avoid cache Bug 2
```
