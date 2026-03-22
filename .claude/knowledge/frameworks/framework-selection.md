# Framework Selection Guide

## Decision Matrix

| User Wants | Scope | Framework | Why |
|------------|-------|-----------|-----|
| Simple website, portfolio | Simple | HTML/CSS/JS | No build tools, instant open |
| Landing page | Simple or Prototype | HTML/CSS/JS or Next.js | Depends on scope |
| Interactive demo | Prototype | Vite + React | Fast HMR, lightweight |
| SaaS app | MVP or Production | Next.js (App Router) | SSR, API routes, auth |
| Dashboard/admin | MVP or Production | Next.js (App Router) | Data tables, charts, auth |
| E-commerce | MVP or Production | Next.js (App Router) | SEO, Stripe, dynamic pages |
| Mobile app | MVP or Production | Expo (React Native) | Cross-platform, OTA updates |
| Blog/content site | MVP | Next.js or Astro | Static generation, MDX |
| API-only backend | MVP or Production | Express.js | Lightweight, flexible |

## Install Commands

### Next.js (App Router)
```bash
npx create-next-app@latest my-app --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd my-app
npm install zustand zod lucide-react
```

### Vite + React
```bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
npm install -D tailwindcss @tailwindcss/vite
npm install react-router-dom zustand lucide-react
```

### Expo (React Native)
```bash
npx create-expo-app@latest my-app --template blank-typescript
cd my-app
npx expo install expo-router react-native-safe-area-context react-native-screens
npm install zustand zod
```

### Plain HTML (no install)
```bash
mkdir -p my-app/{css,js,assets/images,pages}
```

## Package Manager Preference
1. npm (default — most compatible)
2. pnpm (if user prefers — faster, saves disk)
3. yarn (if user prefers)
4. bun (if user prefers — fastest)
