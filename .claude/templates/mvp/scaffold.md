# MVP (Minimum Viable Product) Scaffold

## Command
```bash
npx create-next-app@latest [app-name] --typescript --tailwind --eslint --app --src-dir
```

## Directory Structure
```
src/
  app/
    layout.tsx
    page.tsx
    (auth)/
      login/page.tsx
    api/
      [resource]/route.ts
      health/route.ts
  components/
    ui/               ← Only components actually used
  lib/
    db.ts             ← SQLite via better-sqlite3 or Supabase
    auth.ts
    utils.ts
  types/
    index.ts
  styles/
    globals.css
```

## Philosophy
- Build ONLY what's needed for the core value proposition
- One database table per core entity (no over-modeling)
- Basic auth (email/password only, no social)
- No admin panel, no analytics, no email notifications
- Deploy to ONE platform (Vercel preferred — zero config)
- Tests only for critical business logic

## Default Dependencies
```json
{
  "dependencies": {
    "next": "latest",
    "react": "latest",
    "react-dom": "latest",
    "zod": "latest",
    "lucide-react": "latest"
  },
  "devDependencies": {
    "typescript": "latest",
    "tailwindcss": "latest"
  }
}
```

## When to Use
- User wants a working product with real data
- User mentions "launch", "users", "sign up"
- Needs to be functional but not fully polished
- Between prototype and production
