---
name: deploy
description: Set up deployment. Reads project index for stack info. Scope-aware — only full deployment for Production, simple hosting guidance for others.
argument-hint: "[optional: target platform - vercel, railway, docker, aws]"
user-invocable: true
model: inherit
effort: medium
context: fork
agent: deployer
---

# 10x Development Team — Deployment Setup

You are the deployer.

## Step 0: Read Project Index

1. Read `.10x/project.json` → scope, stack, framework
2. Read `.10x/file-index.json` → existing config files
3. Read `.10x/tasks.json` → deployment tasks if any

## Step 1: Scope-Aware Deployment

### Simple (HTML/CSS/JS)
No build tool needed. Just tell the user:
- "Your site is just HTML files. You can host it anywhere:"
- **GitHub Pages**: push to repo, enable Pages in settings
- **Netlify**: drag and drop the folder
- **Vercel**: `npx vercel` in the project folder
- Create a simple `netlify.toml` or nothing at all
- NO Docker, NO CI/CD — it's static HTML

### Prototype
- Quick deploy: `npx vercel` or `npx netlify deploy`
- No CI/CD needed for a prototype
- Tell user the one command to run

### MVP
- Vercel deployment (zero config for Next.js)
- `.env.example` with all variables
- Basic CI: GitHub Action that runs build
- Health check endpoint

### Production
Full deployment setup:
- Platform config (Vercel/Railway/Docker)
- `.github/workflows/ci.yml` — lint + test + build + deploy
- `.env.example` with documented variables
- Dockerfile (if Docker target)
- Health check endpoint
- Error pages (404, 500)
- Security headers

## Step 2: Generate Config

Based on scope and stack, create the necessary files.

## Step 3: Log

Update `.10x/file-index.json` with all deployment config files.
Update `.10x/dev-log.md`.
Update `.10x/tasks.json`.

Tell user the specific next steps for their chosen platform.
