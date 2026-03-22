# Dashboard / Admin Panel Scaffold

## Command
```bash
npx create-next-app@latest [app-name] --typescript --tailwind --eslint --app --src-dir
```

## Directory Structure
```
src/
  app/
    layout.tsx          ← Root layout (auth check)
    (auth)/
      login/page.tsx
    (dashboard)/
      layout.tsx        ← Dashboard layout (sidebar + header)
      page.tsx          ← Overview / home dashboard
      analytics/page.tsx
      users/
        page.tsx        ← Users list (data table)
        [id]/page.tsx   ← User detail
      settings/page.tsx
    api/
      auth/[...]/route.ts
      users/route.ts
      analytics/route.ts
      health/route.ts
  components/
    ui/                 ← Button, Input, Badge, Avatar
    layout/             ← Sidebar, Header, PageShell
    charts/             ← Chart components (line, bar, pie)
    data/               ← DataTable, StatCard, ListView
  lib/
    api.ts
    auth.ts
    db.ts
    utils.ts
  hooks/
  types/
  styles/
    globals.css
```

## Default Dependencies
```json
{
  "dependencies": {
    "next": "latest",
    "react": "latest",
    "react-dom": "latest",
    "zustand": "latest",
    "zod": "latest",
    "lucide-react": "latest",
    "recharts": "latest"
  },
  "devDependencies": {
    "typescript": "latest",
    "tailwindcss": "latest",
    "@types/react": "latest",
    "vitest": "latest",
    "prettier": "latest"
  }
}
```

## Pages (typical dashboard)
1. Overview — stat cards + charts + recent activity
2. Data tables — CRUD for main entities
3. Detail views — single entity with tabs
4. Analytics — charts and graphs
5. Settings — user/org settings
6. Users/Team — user management (admin only)
