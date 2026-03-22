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
╔══════════════════════════════════════════════╗
║     10x Development Team — Commands          ║
╚══════════════════════════════════════════════╝

GETTING STARTED
  /10x-development-team:start          Start a new project
  /10x-development-team:help           This help screen

BUILD & CREATE
  /10x-development-team:build          Full build from vision
  /10x-development-team:add-page       Add a page to your app
  /10x-development-team:add-feature    Add a feature (frontend + backend)
  /10x-development-team:generate       Generate a specific piece of code
                                       (component, api, hook, model, test)

FIX & IMPROVE
  /10x-development-team:fix            Fix a bug — describe the problem
  /10x-development-team:refactor       Improve code quality
  /10x-development-team:review         Full code review
  /10x-development-team:update-deps    Check/update dependencies

UNDERSTAND & TRACK
  /10x-development-team:explain        Explain how something works
  /10x-development-team:status         Quick project overview
  /10x-development-team:index          View/rebuild project index

CONFIGURE & DEPLOY
  /10x-development-team:config         View/change project settings
  /10x-development-team:deploy         Set up deployment
  /10x-development-team:resume         Continue from where you left off

PROJECT SCOPES
  simple      HTML/CSS/JS — no frameworks, no build tools
  prototype   Vite + React — fast, with mock data
  mvp         Next.js — real data, basic auth
  production  Full stack — tested, CI/CD, optimized

TIPS
  • Use @ to reference files: @src/components/Button.tsx
  • Use Ctrl+T to see task progress
  • Your project state is saved in .10x/ directory
  • Use /memory to see what's remembered across sessions
  • Type ! before a command to run it in terminal: !npm run dev
```
