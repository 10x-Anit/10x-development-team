# SaaS Web App Scaffold

## Command
```bash
npx create-next-app@latest [app-name] --typescript --tailwind --eslint --app --src-dir
```

## Directory Structure
```
src/
  app/
    layout.tsx          ← Root layout with PageShell
    page.tsx            ← Landing/home page
    (auth)/
      login/page.tsx    ← Login page
      signup/page.tsx   ← Signup page
    (dashboard)/
      layout.tsx        ← Dashboard layout with sidebar
      page.tsx          ← Dashboard home
      settings/page.tsx ← User settings
    api/
      auth/[...]/route.ts  ← Auth API routes
      health/route.ts      ← Health check endpoint
  components/           ← Global reusable components
    ui/                 ← Base UI components (button, input, card)
    layout/             ← Layout components (navbar, sidebar, footer)
    features/           ← Feature-specific components
  lib/
    api.ts              ← API client utilities
    auth.ts             ← Auth utilities
    db.ts               ← Database client
    utils.ts            ← General utilities
  hooks/
    use-auth.ts         ← Auth hook
    use-api.ts          ← API fetch hook
  types/
    index.ts            ← Shared TypeScript types
  styles/
    globals.css         ← Global styles + Tailwind directives
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
    "lucide-react": "latest"
  },
  "devDependencies": {
    "typescript": "latest",
    "tailwindcss": "latest",
    "@types/react": "latest",
    "vitest": "latest",
    "@testing-library/react": "latest",
    "prettier": "latest"
  }
}
```

## Pages to Build (from vision)
Map user's described screens to this structure. Common SaaS pages:
- Landing page (marketing)
- Login / Signup
- Dashboard (main app view)
- Settings / Profile
- Pricing page
- Feature-specific pages (from user vision)
