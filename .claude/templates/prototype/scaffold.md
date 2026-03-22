# Prototype / Demo Scaffold

## Command
```bash
npm create vite@latest [app-name] -- --template react-ts
```

## Directory Structure
```
src/
  App.tsx               ← Main app with all routes
  main.tsx              ← Entry point
  components/           ← Shared components (minimal)
  pages/                ← One file per page
  styles/
    index.css           ← Single stylesheet
  mock/
    data.ts             ← Mock/fake data (no real backend)
```

## Philosophy
- SPEED over perfection
- Mock data instead of real APIs
- Minimal components — inline styles OK
- No auth, no database, no deployment
- Goal: show the idea, get feedback, iterate

## Default Dependencies
```json
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-router-dom": "latest"
  },
  "devDependencies": {
    "typescript": "latest",
    "vite": "latest",
    "@vitejs/plugin-react": "latest",
    "tailwindcss": "latest"
  }
}
```

## When to Use
- User says "prototype", "demo", "mockup", "proof of concept"
- User wants to show something to stakeholders
- User wants to test an idea quickly
- No mention of production, deployment, or scaling
