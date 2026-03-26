# Dark Mode — Complete Implementation Guide

> Dark mode should be AUTOMATIC when you use semantic tokens.
> If you find yourself writing `dark:` prefixes on every element, you are doing it wrong.

---

## How Semantic Tokens Make Dark Mode Automatic

The entire dark mode system is built on CSS custom properties. When the `.dark` class is applied to `<html>`, all token values change at once. Components that use `bg-background`, `text-foreground`, `border-border`, etc. switch automatically with ZERO component changes.

```css
/* globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222 47% 11%;
    --card: 0 0% 100%;
    --card-foreground: 222 47% 11%;
    --muted: 210 40% 96%;
    --muted-foreground: 215 16% 47%;
    --primary: 222 47% 51%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222 47% 11%;
    --accent: 210 40% 96%;
    --accent-foreground: 222 47% 11%;
    --destructive: 0 84% 60%;
    --destructive-foreground: 210 40% 98%;
    --border: 214 32% 91%;
    --input: 214 32% 91%;
    --ring: 222 47% 51%;
    --radius: 0.625rem;

    --shadow-sm: 0 1px 2px 0 hsl(var(--foreground) / 0.05);
    --shadow-md: 0 4px 6px -1px hsl(var(--foreground) / 0.1), 0 2px 4px -2px hsl(var(--foreground) / 0.1);
    --shadow-lg: 0 10px 15px -3px hsl(var(--foreground) / 0.1), 0 4px 6px -4px hsl(var(--foreground) / 0.1);
    --shadow-elegant: 0 10px 30px -10px hsl(var(--primary) / 0.3);
  }

  .dark {
    --background: 222 47% 5%;
    --foreground: 210 40% 98%;
    --card: 222 47% 8%;
    --card-foreground: 210 40% 98%;
    --muted: 217 33% 12%;
    --muted-foreground: 215 20% 65%;
    --primary: 217 91% 60%;
    --primary-foreground: 222 47% 5%;
    --secondary: 217 33% 12%;
    --secondary-foreground: 210 40% 98%;
    --accent: 217 33% 12%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62% 54%;
    --destructive-foreground: 210 40% 98%;
    --border: 217 33% 17%;
    --input: 217 33% 17%;
    --ring: 217 91% 60%;

    /* Shadows become more subtle in dark mode */
    --shadow-sm: 0 1px 2px 0 hsl(0 0% 0% / 0.3);
    --shadow-md: 0 4px 6px -1px hsl(0 0% 0% / 0.4), 0 2px 4px -2px hsl(0 0% 0% / 0.3);
    --shadow-lg: 0 10px 15px -3px hsl(0 0% 0% / 0.4), 0 4px 6px -4px hsl(0 0% 0% / 0.3);
    --shadow-elegant: 0 10px 30px -10px hsl(var(--primary) / 0.2);
  }
}
```

### The Result
```tsx
// This component works in BOTH light and dark mode without a single dark: prefix
<div className="rounded-xl border border-border bg-card p-6 shadow-sm">
  <h3 className="text-lg font-semibold text-foreground">Card Title</h3>
  <p className="mt-2 text-sm text-muted-foreground">Card description.</p>
  <button className="mt-4 h-10 px-4 rounded-md bg-primary text-primary-foreground hover:bg-primary/90">
    Action
  </button>
</div>
```

---

## next-themes Setup (Complete)

`next-themes` is the standard library for dark mode in Next.js App Router. It handles:
- Class toggling on `<html>`
- System preference detection
- Persistence in localStorage
- SSR flash prevention

### Step 1: Install
```bash
npm install next-themes
```

### Step 2: Create the ThemeProvider
```tsx
// src/components/providers.tsx
"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  )
}
```

### Step 3: Wrap in Root Layout
```tsx
// src/app/layout.tsx
import { Providers } from "@/components/providers"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
```

Key points:
- `attribute="class"` matches Tailwind's `darkMode: "class"` strategy
- `suppressHydrationWarning` on `<html>` prevents React hydration warning from the injected script
- `disableTransitionOnChange` prevents a flash of transitioning elements on theme switch
- `defaultTheme="system"` respects the user's OS preference on first visit

### Step 4: Tailwind Config
```ts
// tailwind.config.ts
export default {
  darkMode: "class",
  // ... rest of config
}
```

---

## ThemeToggle Component

### Using shadcn Button
```tsx
// src/components/theme-toggle.tsx
"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch — render nothing until client-side
  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="h-10 w-10" /> // Placeholder to prevent layout shift

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
    </Button>
  )
}
```

### Three-State Toggle (Light / Dark / System)
```tsx
"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Moon, Sun, Monitor } from "lucide-react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="h-10 w-[120px]" />

  const options = [
    { value: "light", icon: Sun, label: "Light" },
    { value: "dark", icon: Moon, label: "Dark" },
    { value: "system", icon: Monitor, label: "System" },
  ] as const

  return (
    <div className="inline-flex items-center gap-1 rounded-lg bg-muted p-1" role="radiogroup" aria-label="Theme">
      {options.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          role="radio"
          aria-checked={theme === value}
          aria-label={`${label} theme`}
          onClick={() => setTheme(value)}
          className={cn(
            "inline-flex items-center justify-center rounded-md px-2.5 py-1.5 text-sm transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            theme === value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  )
}
```

---

## System Preference Detection

`next-themes` handles this automatically with `enableSystem` and `defaultTheme="system"`. The library injects a script before React hydrates to prevent flash of wrong theme (FOWT).

If you need to detect system preference in a custom hook (without next-themes):

```tsx
import { useEffect, useState } from "react"

export function useSystemTheme(): "light" | "dark" {
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)")
    setSystemTheme(mql.matches ? "dark" : "light")

    function handler(e: MediaQueryListEvent) {
      setSystemTheme(e.matches ? "dark" : "light")
    }

    mql.addEventListener("change", handler)
    return () => mql.removeEventListener("change", handler)
  }, [])

  return systemTheme
}
```

---

## Persisting Theme Choice

`next-themes` persists to `localStorage` automatically under the key `"theme"`. No extra code needed.

If building without `next-themes` (e.g., simple scope), persist manually:

```tsx
// On toggle
localStorage.setItem("theme", newTheme)
document.documentElement.classList.toggle("dark", newTheme === "dark")

// On page load (in a <script> tag in <head> to prevent flash)
<script dangerouslySetInnerHTML={{ __html: `
  (function() {
    var t = localStorage.getItem('theme');
    var d = t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', d);
  })()
`}} />
```

---

## Common Dark Mode Pitfalls

### 1. White Text on White Background
```tsx
// WRONG — Hardcoded colors break in one mode
<div className="bg-white text-white">  {/* Invisible in light mode! */}

// CORRECT — Semantic tokens always contrast properly
<div className="bg-card text-card-foreground">
```

### 2. Shadows in Dark Mode
Shadows using `hsl(var(--foreground) / 0.1)` become very dark in dark mode. Use token-based shadows that adjust:

```css
/* Light mode shadows are soft and subtle */
:root { --shadow-md: 0 4px 6px -1px hsl(var(--foreground) / 0.1); }

/* Dark mode shadows are darker but less visible — use pure black */
.dark { --shadow-md: 0 4px 6px -1px hsl(0 0% 0% / 0.4); }
```

Alternatively, replace shadows with borders in dark mode:
```tsx
<div className="shadow-md dark:shadow-none dark:border dark:border-border">
```

### 3. Images and Illustrations
Light-themed illustrations/SVGs can look harsh in dark mode:
```tsx
// Reduce brightness and boost contrast slightly
<img className="dark:brightness-90 dark:contrast-110" />

// Or invert simple line art
<img className="dark:invert dark:hue-rotate-180" />

// Provide separate images for each mode
<picture>
  <source srcSet="/hero-dark.png" media="(prefers-color-scheme: dark)" />
  <img src="/hero-light.png" alt="Hero" />
</picture>
```

### 4. Borders Become More Important in Dark Mode
In light mode, shadows provide depth. In dark mode, shadows vanish. Borders take over as the primary depth indicator:
```tsx
// Cards: add explicit border for dark mode
<div className="shadow-sm dark:shadow-none border border-transparent dark:border-border rounded-xl bg-card p-6">
```

Or just always use borders (recommended approach):
```tsx
<div className="rounded-xl border border-border bg-card p-6 shadow-sm">
// Works great in both modes — shadow is visible in light, border is visible in dark
```

### 5. Color Contrast
Some colors that have good contrast on white have poor contrast on dark backgrounds:
- Light gray text (`text-gray-400`) on dark bg = hard to read
- Use `text-muted-foreground` which is tuned for each mode
- Test with browser DevTools contrast checker

### 6. Focus Ring Offset
The focus ring offset color must match the background:
```tsx
// This breaks in dark mode if offset is white
"focus-visible:ring-offset-background"  // Uses the token — always matches
```

---

## Dark Mode-Specific Design Adjustments

### General Principles
```
Light Mode                           Dark Mode
--------------------------------------------
Shadows for depth                    Borders for depth
White/light card bg                  Slightly lighter than page bg
Primary color: vibrant               Primary color: slightly desaturated
Subtle gray backgrounds              Slightly lighter dark backgrounds
Text: dark on light                  Text: light on dark (less contrast than full white)
```

### Recommended Adjustments in CSS Tokens
```css
.dark {
  /* Primary is slightly brighter/more saturated to pop on dark bg */
  --primary: 217 91% 60%;         /* vs light: 222 47% 51% */

  /* Muted foreground is brighter for readability */
  --muted-foreground: 215 20% 65%; /* vs light: 215 16% 47% */

  /* Destructive is slightly less saturated to reduce harshness */
  --destructive: 0 62% 54%;       /* vs light: 0 84% 60% */
}
```

---

## CSS Custom Properties (Simple Scope)

For projects without Tailwind or next-themes:

```css
:root {
  --color-bg: #ffffff;
  --color-bg-card: #ffffff;
  --color-bg-muted: #f3f4f6;
  --color-text: #111827;
  --color-text-muted: #6b7280;
  --color-border: #e5e7eb;
  --color-primary: #3b82f6;
  --color-primary-text: #ffffff;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #0f1117;
    --color-bg-card: #1a1d2e;
    --color-bg-muted: #1e2132;
    --color-text: #f1f5f9;
    --color-text-muted: #94a3b8;
    --color-border: #2d3148;
    --color-primary: #60a5fa;
    --color-primary-text: #0f1117;
  }
}

/* Usage */
body { background: var(--color-bg); color: var(--color-text); }
.card { background: var(--color-bg-card); border: 1px solid var(--color-border); }
.btn-primary { background: var(--color-primary); color: var(--color-primary-text); }
```

### Manual Toggle (Simple Scope)
```js
const toggle = document.querySelector('[data-theme-toggle]')
toggle.addEventListener('click', () => {
  const isDark = document.documentElement.classList.toggle('dark')
  localStorage.setItem('theme', isDark ? 'dark' : 'light')
})

// On page load
;(function() {
  const saved = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  if (saved === 'dark' || (!saved && prefersDark)) {
    document.documentElement.classList.add('dark')
  }
})()
```

Add `.dark` overrides to CSS:
```css
.dark {
  --color-bg: #0f1117;
  --color-bg-card: #1a1d2e;
  /* ... same as the @media block above */
}
```
