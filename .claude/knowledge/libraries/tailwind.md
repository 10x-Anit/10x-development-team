# Tailwind CSS — Design-System-First Reference

> MANDATORY: Read `.claude/knowledge/patterns/ui-ux-principles.md` (the Design Bible) before using this file.
> Every color, spacing, and shadow value MUST come from semantic tokens, never from direct Tailwind palette colors.

---

## THE #1 RULE: NEVER Use Direct Colors

```tsx
// WRONG — Direct Tailwind palette colors
<div className="bg-white text-gray-900 border-gray-200">
<button className="bg-blue-600 text-white hover:bg-blue-700">
<p className="text-gray-500">
<div className="bg-gray-50 shadow-md">

// CORRECT — Semantic design tokens
<div className="bg-background text-foreground border-border">
<button className="bg-primary text-primary-foreground hover:bg-primary/90">
<p className="text-muted-foreground">
<div className="bg-muted shadow-sm">
```

The ONLY acceptable direct colors are inside `globals.css` where you define the token values. In components, ALWAYS use semantic tokens.

---

## Complete Semantic Color Token Reference

### Backgrounds
```
bg-background          Main page background
bg-foreground          Inverse background (rare)
bg-card                Card/elevated surface background
bg-muted               Subtle/secondary background (sections, sidebars)
bg-primary             Primary brand fill (buttons, badges)
bg-primary/10          Subtle primary tint (hover states, highlights)
bg-primary/5           Very subtle primary tint (active row, selected)
bg-secondary           Secondary fill (secondary buttons)
bg-accent              Accent fill (hover states on ghost elements)
bg-destructive         Error/danger fill
bg-destructive/10      Subtle error tint (error banners)
```

### Text
```
text-foreground             Primary text (headings, body)
text-muted-foreground       Secondary text (descriptions, captions, placeholders)
text-primary                Brand-colored text (links, active nav)
text-primary-foreground     Text on primary background
text-secondary-foreground   Text on secondary background
text-accent-foreground      Text on accent background
text-destructive            Error text
text-destructive-foreground Text on destructive background
```

### Borders
```
border-border          Default border (cards, dividers)
border-input           Input field borders
border-primary         Highlighted/active borders
border-primary/20      Subtle primary border (hover cards)
border-primary/50      Medium primary border (focus indicators)
border-destructive     Error state borders
border-destructive/50  Subtle error borders
border-border/50       Faint border (glass morphism)
```

### Ring (Focus Indicators)
```
ring-ring              Default focus ring color
ring-primary           Primary focus ring
ring-destructive       Error focus ring
ring-offset-background Ring offset matches page background
```

### Opacity Modifiers
```
bg-primary/90    Hover state (slightly transparent)
bg-primary/10    Subtle tint
bg-primary/5     Very subtle tint
text-foreground/70   Slightly dimmed text
border-border/50     Faint border
```

---

## Tailwind Config — Semantic Token Setup

```ts
// tailwind.config.ts
import type { Config } from "tailwindcss"

export default {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        elegant: "var(--shadow-elegant)",
        glow: "var(--shadow-glow)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-down": {
          from: { opacity: "0", transform: "translateY(-16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-left": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "fade-in-up": "fade-in-up 0.4s ease-out",
        "fade-in-down": "fade-in-down 0.4s ease-out",
        "slide-in-left": "slide-in-left 0.3s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "spin-slow": "spin-slow 3s linear infinite",
        shimmer: "shimmer 2s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config
```

---

## Custom Animation Utilities

```tsx
// Entrance animations — add to elements that appear on page load or scroll
<div className="animate-fade-in">                  {/* Simple fade */}
<div className="animate-fade-in-up">               {/* Fade + slide up (most common) */}
<div className="animate-fade-in-down">              {/* Fade + slide down (dropdowns) */}
<div className="animate-scale-in">                  {/* Fade + scale (modals, popovers) */}
<div className="animate-slide-in-left">             {/* Slide from left (drawers) */}
<div className="animate-slide-in-right">            {/* Slide from right (mobile nav) */}

// Staggered children — use animation-delay with Tailwind arbitrary values
<div className="animate-fade-in-up [animation-delay:0ms]">Item 1</div>
<div className="animate-fade-in-up [animation-delay:100ms]">Item 2</div>
<div className="animate-fade-in-up [animation-delay:200ms]">Item 3</div>

// Loading skeleton shimmer
<div className="animate-pulse rounded-md bg-muted h-4 w-3/4" />

// Spinner
<Loader2 className="h-4 w-4 animate-spin" />

// Slow spin for decorative elements
<div className="animate-spin-slow" />
```

---

## Dark Mode — Class Strategy

Dark mode uses `darkMode: "class"` in Tailwind config. The `dark` class on `<html>` activates all `dark:` variants.

With semantic tokens, you almost NEVER need `dark:` prefixes in components because the CSS variables handle the switch automatically.

```tsx
// WRONG — Manual dark mode overrides everywhere
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700">

// CORRECT — Semantic tokens handle dark mode automatically
<div className="bg-background text-foreground border-border">
// The CSS variables change when .dark is applied to <html> — zero component changes needed
```

When you DO need `dark:` prefix (rare cases):
```tsx
// Images that need different opacity in dark mode
<img className="dark:opacity-80 dark:invert" />

// Shadows that should be more subtle in dark mode
<div className="shadow-lg dark:shadow-none dark:border dark:border-border" />

// SVG illustrations with baked-in light colors
<div className="dark:brightness-90 dark:contrast-125" />
```

---

## Gradient Text Utility

```tsx
// Gradient text — use for hero headings and emphasis
<h1 className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
  Gradient Heading
</h1>

// Multi-color gradient
<span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
  Colorful Text
</span>

// Animated gradient (add shimmer effect)
<h1 className="bg-gradient-to-r from-primary via-primary/60 to-primary bg-[length:200%_auto] animate-shimmer bg-clip-text text-transparent">
  Shimmering Heading
</h1>
```

---

## Glass Morphism Utility

```tsx
// Glass card — semi-transparent with blur
<div className="rounded-xl bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg">
  {/* Content */}
</div>

// Stronger glass effect
<div className="rounded-xl bg-background/60 backdrop-blur-md border border-border/30 shadow-xl">
  {/* Content */}
</div>

// Glass navbar
<nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
  {/* Nav content */}
</nav>

// Glass over image/gradient backgrounds
<div className="relative">
  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
  <div className="relative rounded-xl bg-card/70 backdrop-blur-sm border border-border/40 p-6">
    {/* Content floats above the gradient */}
  </div>
</div>
```

---

## Container Query Patterns

Container queries let components respond to their container width, not the viewport.

```tsx
// Parent: mark as a container
<div className="@container">
  {/* Children can use @sm, @md, @lg, @xl based on THIS container's width */}
  <div className="flex flex-col @md:flex-row gap-4">
    <div className="@md:w-1/3">Sidebar</div>
    <div className="@md:w-2/3">Content</div>
  </div>
</div>

// Card that adapts to its container
<div className="@container">
  <div className="flex flex-col @sm:flex-row gap-4 p-4">
    <img className="w-full @sm:w-32 @sm:h-32 rounded-lg object-cover" />
    <div>
      <h3 className="text-base @md:text-lg font-semibold">Title</h3>
      <p className="text-sm text-muted-foreground @md:line-clamp-3 line-clamp-2">Description</p>
    </div>
  </div>
</div>
```

Requires the `@tailwindcss/container-queries` plugin in your config:
```ts
plugins: [require("tailwindcss-animate"), require("@tailwindcss/container-queries")]
```

---

## Responsive Design Patterns

### Breakpoint Strategy (Mobile-First)
```
Default:    0-639px     Mobile phones (single column, stacked)
sm:         640px+      Large phones / small tablets (2 columns start)
md:         768px+      Tablets (sidebar appears, more breathing room)
lg:         1024px+     Laptops (3+ columns, full layouts)
xl:         1280px+     Desktops (max-width container)
2xl:        1536px+     Large desktops (extra spacing)
```

### Grid Patterns
```tsx
// 1 -> 2 -> 3 columns
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">

// 1 -> 2 -> 4 columns (feature grid)
<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

// Auto-fill (items size themselves)
<div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">

// 2-column asymmetric (content + sidebar)
<div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
```

### Flex Patterns
```tsx
// Stack on mobile, row on desktop
<div className="flex flex-col sm:flex-row gap-4">

// Center content with constrained width
<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

// Space-between header
<header className="flex items-center justify-between h-16 px-4 sm:px-6">

// Wrap on small screens
<div className="flex flex-wrap gap-2">
```

### Spacing Per Breakpoint
```tsx
// Section padding
<section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">

// Container
<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

// Text sizing
<h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight">

// Gap scaling
<div className="gap-4 sm:gap-6 lg:gap-8">
```

---

## Common Utility Combinations (Copy-Paste Ready)

### Card Pattern
```tsx
// Standard card
"rounded-xl border border-border bg-card p-6 shadow-sm"

// Interactive card (hover lift)
"rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/20 cursor-pointer"

// Featured card (primary border)
"rounded-xl border-2 border-primary bg-card p-6 shadow-elegant ring-1 ring-primary/10"

// Glass card
"rounded-xl bg-card/80 backdrop-blur-sm border border-border/50 p-6 shadow-lg"

// Muted card (no border, tinted bg)
"rounded-xl bg-muted p-6"
```

### Button Pattern
```tsx
// Primary
"inline-flex items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground h-10 px-4 text-sm font-medium shadow-sm transition-colors hover:bg-primary/90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"

// Secondary
"inline-flex items-center justify-center gap-2 rounded-md bg-secondary text-secondary-foreground h-10 px-4 text-sm font-medium transition-colors hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"

// Outline
"inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background text-foreground h-10 px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"

// Ghost
"inline-flex items-center justify-center gap-2 rounded-md text-muted-foreground h-10 px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"

// Destructive
"inline-flex items-center justify-center gap-2 rounded-md bg-destructive text-destructive-foreground h-10 px-4 text-sm font-medium shadow-sm transition-colors hover:bg-destructive/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
```

### Input Pattern
```tsx
"flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
```

### Badge Pattern
```tsx
// Default
"inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs font-medium text-foreground"

// Primary
"inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"

// Destructive
"inline-flex items-center rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive"

// Success (use with custom --success token or primary)
"inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400"
```

---

## Typography Hierarchy (Use Consistently)

```tsx
// Page title
"text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground"

// Section title
"text-2xl sm:text-3xl font-semibold tracking-tight text-foreground"

// Card title
"text-lg sm:text-xl font-semibold text-foreground"

// Body text
"text-base text-muted-foreground leading-relaxed"

// Small / caption
"text-sm text-muted-foreground"

// Overline / label
"text-xs font-medium uppercase tracking-wider text-muted-foreground"

// Lead paragraph (hero subtitle)
"text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl"
```

---

## Transition Standards

```tsx
// ALWAYS add transitions to interactive elements
"transition-colors duration-150"       // Color-only changes (buttons, links)
"transition-all duration-200"          // Multi-property changes (cards with shadow + transform)
"transition-transform duration-100"    // Transform-only (active press)
"transition-opacity duration-150"      // Opacity-only (tooltips, fade)
"transition-shadow duration-200"       // Shadow-only changes

// Easing
"ease-out"    // Default for entrances
"ease-in-out" // Default for toggles
"ease-in"     // Default for exits
```

---

## Focus Indicators (Non-Negotiable)

Every interactive element MUST have:
```tsx
"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
```

This provides:
- No outline on click (only visible on keyboard focus)
- 2px ring in the theme's ring color
- 2px offset so the ring doesn't overlap the element
- Offset color matches the background for clean appearance
