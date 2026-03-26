# UI/UX Design Principles — The Design Bible

> "The design system is everything. You should NEVER write custom styles in components. ALWAYS use the design system and customize it."

This file is MANDATORY reading for every agent that touches UI. Read it BEFORE writing any component, page, or layout.

---

## THE #1 RULE: Design System First, Code Second

Every visual decision — color, spacing, shadow, radius, font — MUST come from the design system tokens defined in `tailwind.config.ts` and `globals.css`.

NEVER write ad-hoc styles. NEVER use direct color values.

```tsx
// WRONG — Ad-hoc styling
<button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700">

// CORRECT — Design system tokens
<button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-elegant hover:bg-primary/90">
```

```tsx
// WRONG — Hardcoded colors
<div className="bg-white text-gray-900 border-gray-200">

// CORRECT — Semantic tokens that adapt to dark mode
<div className="bg-background text-foreground border-border">
```

---

## VISUAL HIERARCHY — The 60-30-10 Rule

Every screen follows this color distribution:
- **60%** — Background/neutral (bg-background, bg-muted)
- **30%** — Secondary/supporting (bg-card, bg-secondary, text-muted-foreground)
- **10%** — Accent/primary (bg-primary, bg-accent, text-primary)

### Hierarchy Through Size, Weight, and Color

```
Page Title (h1):    text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground
Section Title (h2): text-2xl sm:text-3xl font-semibold tracking-tight text-foreground
Card Title (h3):    text-lg sm:text-xl font-semibold text-foreground
Body Text:          text-base text-muted-foreground leading-relaxed
Small/Caption:      text-sm text-muted-foreground
Overline/Label:     text-xs font-medium uppercase tracking-wider text-muted-foreground
```

### Emphasis Levels for Interactive Elements

```
Primary Action:   bg-primary text-primary-foreground (filled, prominent)
Secondary Action: bg-secondary text-secondary-foreground (filled, subtle)
Tertiary Action:  bg-transparent text-foreground border border-border (outlined)
Ghost Action:     bg-transparent text-muted-foreground hover:bg-muted (no border)
Destructive:      bg-destructive text-destructive-foreground
```

---

## SPACING SYSTEM — Consistent Rhythm

Use a base-4 spacing scale. Never use arbitrary spacing values.

### Component Internal Spacing
```
Tight:    gap-1 (4px)  — icon + label, badge padding
Default:  gap-2 (8px)  — button padding, input padding
Relaxed:  gap-3 (12px) — card padding, between form fields
Spacious: gap-4 (16px) — section padding, between cards
Wide:     gap-6 (24px) — between sections
```

### Page-Level Spacing
```
Section padding:       py-16 sm:py-20 lg:py-24
Between sections:      space-y-16 sm:space-y-20 lg:space-y-24
Container padding:     px-4 sm:px-6 lg:px-8
Card padding:          p-6
Card gap in grid:      gap-4 sm:gap-6 lg:gap-8
Content max-width:     max-w-7xl mx-auto (1280px)
Narrow content:        max-w-3xl mx-auto (768px) — for text/forms
```

### Whitespace Rules
- **Let the design breathe.** Generous whitespace = premium feel.
- Hero sections: min-h-[60vh] or min-h-screen with centered content
- Between logical groups: at least 2x the spacing within groups
- Text blocks: max-w-prose (65ch) for readability
- Paragraph spacing: space-y-4 for body text

---

## TYPOGRAPHY — Professional Type System

### Font Stack
```css
--font-sans: 'Inter', system-ui, -apple-system, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### Type Scale (use consistently)
```
text-xs:   0.75rem (12px) — captions, badges, timestamps
text-sm:   0.875rem (14px) — secondary text, table cells, form labels
text-base: 1rem (16px) — body text, buttons, inputs
text-lg:   1.125rem (18px) — lead text, card titles
text-xl:   1.25rem (20px) — sub-headings
text-2xl:  1.5rem (24px) — section titles (mobile)
text-3xl:  1.875rem (30px) — section titles (desktop)
text-4xl:  2.25rem (36px) — page titles
text-5xl:  3rem (48px) — hero headlines
```

### Line Height and Tracking
```
Headlines:  leading-tight tracking-tight (1.25 line-height, -0.025em tracking)
Body text:  leading-relaxed (1.625 line-height)
Buttons:    leading-none or leading-tight
Labels:     leading-none tracking-wider uppercase text-xs font-medium
```

### Font Weight Usage
```
Regular (400):  Body text, descriptions, input values
Medium (500):   Buttons, form labels, nav links, table headers
Semibold (600): Card titles, section titles, emphasis
Bold (700):     Page titles, hero headlines, prices
```

---

## COLOR — Semantic Token System

### NEVER use direct Tailwind colors. ALWAYS use semantic tokens.

```css
/* globals.css — Define ALL colors as HSL CSS variables */
:root {
  /* Backgrounds */
  --background: 0 0% 100%;
  --foreground: 222 47% 11%;

  /* Cards and elevated surfaces */
  --card: 0 0% 100%;
  --card-foreground: 222 47% 11%;

  /* Muted/subtle backgrounds */
  --muted: 210 40% 96%;
  --muted-foreground: 215 16% 47%;

  /* Primary brand color */
  --primary: 222 47% 51%;
  --primary-foreground: 210 40% 98%;

  /* Secondary supporting color */
  --secondary: 210 40% 96%;
  --secondary-foreground: 222 47% 11%;

  /* Accent highlights */
  --accent: 210 40% 96%;
  --accent-foreground: 222 47% 11%;

  /* Destructive/error */
  --destructive: 0 84% 60%;
  --destructive-foreground: 210 40% 98%;

  /* Borders */
  --border: 214 32% 91%;
  --input: 214 32% 91%;
  --ring: 222 47% 51%;

  /* Radius */
  --radius: 0.625rem;

  /* Rich tokens — gradients, shadows, animations */
  --gradient-primary: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.8));
  --gradient-hero: linear-gradient(180deg, hsl(var(--background)), hsl(var(--muted)));
  --gradient-card: linear-gradient(135deg, hsl(var(--card)), hsl(var(--muted) / 0.5));

  --shadow-sm: 0 1px 2px 0 hsl(var(--foreground) / 0.05);
  --shadow-md: 0 4px 6px -1px hsl(var(--foreground) / 0.1), 0 2px 4px -2px hsl(var(--foreground) / 0.1);
  --shadow-lg: 0 10px 15px -3px hsl(var(--foreground) / 0.1), 0 4px 6px -4px hsl(var(--foreground) / 0.1);
  --shadow-xl: 0 20px 25px -5px hsl(var(--foreground) / 0.1), 0 8px 10px -6px hsl(var(--foreground) / 0.1);
  --shadow-elegant: 0 10px 30px -10px hsl(var(--primary) / 0.3);
  --shadow-glow: 0 0 40px hsl(var(--primary) / 0.15);
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
}
```

### Color Usage Rules
1. **Backgrounds**: ONLY `bg-background`, `bg-card`, `bg-muted`, `bg-primary`, `bg-secondary`, `bg-accent`, `bg-destructive`
2. **Text**: ONLY `text-foreground`, `text-muted-foreground`, `text-primary-foreground`, etc.
3. **Borders**: ONLY `border-border`, `border-input`, `border-primary`
4. **NEVER**: `text-white`, `text-black`, `bg-white`, `bg-gray-*`, `bg-blue-*`, `text-slate-*`
5. **Opacity modifiers**: `bg-primary/10`, `text-foreground/70` — use for subtle variations

---

## BUTTONS — Perfect Buttons Every Time

### Size System
```tsx
const sizes = {
  sm:  "h-8 px-3 text-xs gap-1.5 rounded-md",
  md:  "h-10 px-4 text-sm gap-2 rounded-md",
  lg:  "h-12 px-6 text-base gap-2.5 rounded-lg",
  xl:  "h-14 px-8 text-lg gap-3 rounded-lg",
  icon: "h-10 w-10 rounded-md",
}
```

### Variant System
```tsx
const variants = {
  primary:     "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 active:scale-[0.98]",
  secondary:   "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  outline:     "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  ghost:       "hover:bg-accent hover:text-accent-foreground",
  destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  link:        "text-primary underline-offset-4 hover:underline p-0 h-auto",
}
```

### Button Rules
1. ALWAYS include `transition-colors` for smooth state changes
2. ALWAYS include focus styles: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`
3. Disabled state: `disabled:pointer-events-none disabled:opacity-50`
4. Loading state: replace text with spinner, keep button same size
5. Icon buttons: use `size="icon"` variant, include `aria-label`
6. Micro-interaction: `active:scale-[0.98]` on primary buttons
7. NEVER compete: only ONE primary button per visible section

---

## CARDS — Elegant Containers

### Standard Card Pattern
```tsx
<div className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
  {/* Card content */}
</div>
```

### Card Variants
```
Default:    rounded-xl border border-border bg-card shadow-sm
Elevated:   rounded-xl bg-card shadow-lg
Muted:      rounded-xl bg-muted border-0
Interactive: rounded-xl border border-border bg-card shadow-sm hover:shadow-md hover:border-primary/20 transition-all cursor-pointer
Glass:      rounded-xl bg-card/80 backdrop-blur-sm border border-border/50
Featured:   rounded-xl border-2 border-primary bg-card shadow-elegant ring-1 ring-primary/10
```

### Card Spacing
```
Compact:  p-4
Default:  p-6
Spacious: p-8
Header:   px-6 py-4 border-b border-border
Footer:   px-6 py-4 border-t border-border bg-muted/50
```

---

## FORMS — Polished Input Experience

### Input Pattern
```tsx
<div className="space-y-2">
  <label className="text-sm font-medium leading-none text-foreground">
    Email
  </label>
  <input
    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    placeholder="you@example.com"
  />
  <p className="text-xs text-muted-foreground">We'll never share your email.</p>
</div>
```

### Form Rules
1. Labels ABOVE inputs (not inline, not floating for better a11y)
2. Helper text below input in `text-xs text-muted-foreground`
3. Error text in `text-xs text-destructive` with `aria-describedby`
4. Group related fields with `space-y-4`
5. Submit button: full-width on mobile, auto-width on desktop
6. Required fields: add `*` after label in `text-destructive`
7. Form spacing: `space-y-6` between field groups

---

## RESPONSIVE DESIGN — Mobile-First Always

### Breakpoint Strategy
```
Default (mobile):  < 640px  — single column, stacked layout
sm (640px):        tablet portrait — 2 columns start
md (768px):        tablet landscape — content gets breathing room
lg (1024px):       laptop — sidebar layouts, 3+ columns
xl (1280px):       desktop — max-width container activates
2xl (1536px):      large desktop — extra padding/spacing
```

### Common Responsive Patterns
```tsx
// Grid: 1 → 2 → 3 columns
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">

// Stack → Row
<div className="flex flex-col sm:flex-row gap-4">

// Text sizing
<h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl">

// Padding
<section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">

// Hide/Show
<div className="hidden md:block">  {/* Show on desktop */}
<div className="md:hidden">         {/* Show on mobile */}

// Container
<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
```

---

## MICRO-INTERACTIONS — The Details That Matter

### Transitions (add to ALL interactive elements)
```
Default:     transition-colors duration-150
Hover card:  transition-all duration-200
Modal:       transition-all duration-300 ease-out
Drawer:      transition-transform duration-300 ease-in-out
Tooltip:     transition-opacity duration-150
```

### Hover Effects
```tsx
// Subtle lift
"hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"

// Color shift
"hover:bg-primary/90 transition-colors duration-150"

// Border highlight
"hover:border-primary/50 transition-colors duration-200"

// Scale (buttons only)
"active:scale-[0.98] transition-transform duration-100"
```

### Focus Indicators
```tsx
// ALWAYS on interactive elements
"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
```

---

## LOADING & EMPTY STATES — Never Leave a Blank Screen

### Skeleton Loading
```tsx
function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse rounded-md bg-muted", className)} />
  )
}

// Usage: Match the shape of real content
<div className="space-y-4">
  <Skeleton className="h-8 w-3/4" />      {/* Title */}
  <Skeleton className="h-4 w-full" />      {/* Line 1 */}
  <Skeleton className="h-4 w-5/6" />       {/* Line 2 */}
  <Skeleton className="h-10 w-32" />        {/* Button */}
</div>
```

### Empty States
```tsx
<div className="flex flex-col items-center justify-center py-16 text-center">
  <div className="rounded-full bg-muted p-4 mb-4">
    <InboxIcon className="h-8 w-8 text-muted-foreground" />
  </div>
  <h3 className="text-lg font-semibold text-foreground">No items yet</h3>
  <p className="mt-1 text-sm text-muted-foreground max-w-sm">
    Get started by creating your first item.
  </p>
  <Button className="mt-6">
    <PlusIcon className="h-4 w-4 mr-2" />
    Create item
  </Button>
</div>
```

### Error States
```tsx
<div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
  <div className="flex items-center gap-3">
    <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
    <div>
      <h4 className="text-sm font-medium text-destructive">Something went wrong</h4>
      <p className="text-sm text-destructive/80 mt-1">Please try again or contact support.</p>
    </div>
  </div>
</div>
```

---

## ACCESSIBILITY — Non-Negotiable

### Minimum Requirements (ALL scopes)
1. Every `<img>` has `alt` text (empty `alt=""` for decorative)
2. Every `<button>` without text has `aria-label`
3. Every form `<input>` has a `<label>` linked by `htmlFor`/`id`
4. Color contrast: 4.5:1 for text, 3:1 for large text and UI elements
5. Focus indicators visible on ALL interactive elements
6. Keyboard navigation works (Tab, Enter, Escape, Arrow keys)
7. Semantic HTML: `<nav>`, `<main>`, `<header>`, `<footer>`, `<section>`, `<article>`
8. Heading hierarchy: h1 > h2 > h3, no skipping levels
9. Skip-to-content link as first element in `<body>`
10. Error messages connected with `aria-describedby`

---

## ICON USAGE — Lucide React (Standard)

```tsx
import { Search, Plus, ChevronRight, Loader2, X } from 'lucide-react'

// Sizes
<Icon className="h-4 w-4" />  // In buttons, badges, inputs
<Icon className="h-5 w-5" />  // Standalone, navigation
<Icon className="h-6 w-6" />  // Feature cards, empty states
<Icon className="h-8 w-8" />  // Hero, large empty states

// With text: icon BEFORE text, gap-2
<Button><Plus className="h-4 w-4" /> Add item</Button>

// Spinner (loading)
<Loader2 className="h-4 w-4 animate-spin" />
```

---

## SEO — Automatic on Every Page

```tsx
// Every page.tsx MUST export metadata
export const metadata: Metadata = {
  title: 'Page Title — App Name',
  description: 'Page description under 160 characters with main keyword.',
  openGraph: {
    title: 'Page Title — App Name',
    description: 'Same or social-specific description.',
    type: 'website',
  },
}
```

### Page Structure
```tsx
export default function Page() {
  return (
    <main>
      <h1>Single H1 with main keyword</h1>
      <section aria-labelledby="features-heading">
        <h2 id="features-heading">Section Title</h2>
        {/* Content */}
      </section>
    </main>
  )
}
```

---

## THE GOLDEN RULES (Summarized)

1. **Design system first** — ALL visual decisions from tokens
2. **Semantic tokens only** — NEVER `text-white`, `bg-gray-*`, `text-blue-*`
3. **Consistent spacing** — base-4 scale, generous whitespace
4. **Typography hierarchy** — clear size/weight/color levels
5. **One primary action** — per visible section
6. **Mobile-first** — design for smallest screen, enhance up
7. **Every state covered** — loading, empty, error, success
8. **Accessibility always** — labels, contrast, focus, keyboard
9. **Micro-interactions** — transitions on every interactive element
10. **Beautiful by default** — if it's not polished, it's not done
