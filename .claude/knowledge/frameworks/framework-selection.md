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
| 3D website / immersive landing | Prototype+ | Next.js + R3F | React Three Fiber for 3D scenes |
| 3D product showcase | MVP or Production | Next.js + R3F + Drei | Environment maps, reflections, contact shadows |
| Scroll-driven 3D experience | MVP or Production | Next.js + R3F + GSAP | ScrollTrigger for camera paths, parallax |
| Particle effects / animated bg | Prototype+ | Next.js or Vite + R3F | Instanced meshes, GPU particles |
| Simple 3D with CSS transforms | Simple | HTML/CSS/JS | CSS perspective, transform-style: preserve-3d |

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

## 3D Dependencies (add to any React project)

### Core 3D (React Three Fiber)
```bash
npm install three @react-three/fiber @react-three/drei
npm install -D @types/three
```

### Post-Processing Effects (Bloom, Vignette, etc.)
```bash
npm install @react-three/postprocessing postprocessing
```

### Scroll Animations (GSAP + Smooth Scroll)
```bash
npm install gsap lenis
```

### Physics (optional — for interactive simulations)
```bash
npm install @react-three/rapier
```

### When to Install 3D Deps
| User mentions | Install |
|---------------|---------|
| "3D", "three-dimensional", "WebGL", "immersive" | Core 3D + Post-Processing |
| "scroll animation", "parallax", "scroll-driven" | GSAP + Lenis |
| "particles", "starfield", "animated background" | Core 3D |
| "glassmorphism", "glass effect", "frosted" | No extra deps (CSS/Tailwind only) |
| "physics", "simulation", "interactive objects" | Core 3D + Physics |

## Package Manager Preference
1. npm (default — most compatible)
2. pnpm (if user prefers — faster, saves disk)
3. yarn (if user prefers)
4. bun (if user prefers — fastest)
