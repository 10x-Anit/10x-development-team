# Design System Creation — Rich Token Architecture

> Every project needs a design system BEFORE any component is built. This file shows exactly how to create one.

---

## STEP 1: The globals.css File — Foundation of Everything

This is the SINGLE SOURCE OF TRUTH for all visual tokens. Every color, gradient, shadow, radius, font, and animation is defined here.

### Complete Production-Ready globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* ========================================
       CORE SEMANTIC COLORS (HSL format ONLY)
       ======================================== */

    /* Backgrounds */
    --background: 0 0% 100%;
    --foreground: 222 47% 11%;

    /* Cards and elevated surfaces */
    --card: 0 0% 100%;
    --card-foreground: 222 47% 11%;

    /* Popovers, dropdowns, tooltips */
    --popover: 0 0% 100%;
    --popover-foreground: 222 47% 11%;

    /* Primary brand color */
    --primary: 222 47% 51%;
    --primary-foreground: 210 40% 98%;

    /* Secondary supporting color */
    --secondary: 210 40% 96%;
    --secondary-foreground: 222 47% 11%;

    /* Muted/subtle backgrounds and text */
    --muted: 210 40% 96%;
    --muted-foreground: 215 16% 47%;

    /* Accent highlights */
    --accent: 210 40% 96%;
    --accent-foreground: 222 47% 11%;

    /* Destructive/error */
    --destructive: 0 84% 60%;
    --destructive-foreground: 210 40% 98%;

    /* Success */
    --success: 142 76% 36%;
    --success-foreground: 210 40% 98%;

    /* Warning */
    --warning: 38 92% 50%;
    --warning-foreground: 222 47% 11%;

    /* Info */
    --info: 199 89% 48%;
    --info-foreground: 210 40% 98%;

    /* Borders and inputs */
    --border: 214 32% 91%;
    --input: 214 32% 91%;
    --ring: 222 47% 51%;

    /* ========================================
       RADIUS SYSTEM
       ======================================== */
    --radius: 0.625rem;

    /* ========================================
       RICH DESIGN TOKENS
       ======================================== */

    /* Gradients */
    --gradient-primary: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.7));
    --gradient-hero: linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--muted)) 100%);
    --gradient-card-hover: linear-gradient(135deg, hsl(var(--primary) / 0.05), hsl(var(--primary) / 0.02));
    --gradient-shine: linear-gradient(110deg, transparent 25%, hsl(var(--primary) / 0.1) 50%, transparent 75%);
    --gradient-text: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.6));

    /* Shadows */
    --shadow-xs: 0 1px 2px 0 hsl(var(--foreground) / 0.05);
    --shadow-sm: 0 1px 3px 0 hsl(var(--foreground) / 0.1), 0 1px 2px -1px hsl(var(--foreground) / 0.1);
    --shadow-md: 0 4px 6px -1px hsl(var(--foreground) / 0.1), 0 2px 4px -2px hsl(var(--foreground) / 0.1);
    --shadow-lg: 0 10px 15px -3px hsl(var(--foreground) / 0.1), 0 4px 6px -4px hsl(var(--foreground) / 0.1);
    --shadow-xl: 0 20px 25px -5px hsl(var(--foreground) / 0.1), 0 8px 10px -6px hsl(var(--foreground) / 0.1);
    --shadow-elegant: 0 10px 30px -10px hsl(var(--primary) / 0.25);
    --shadow-glow: 0 0 40px hsl(var(--primary) / 0.15);
    --shadow-inner: inset 0 2px 4px 0 hsl(var(--foreground) / 0.05);

    /* Transitions */
    --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
    --transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1);
    --transition-slow: 300ms cubic-bezier(0.4, 0, 0.2, 1);
    --transition-spring: 500ms cubic-bezier(0.34, 1.56, 0.64, 1);

    /* Chart colors (for data visualization) */
    --chart-1: 222 47% 51%;
    --chart-2: 160 60% 45%;
    --chart-3: 38 92% 50%;
    --chart-4: 280 65% 60%;
    --chart-5: 0 84% 60%;
  }

  .dark {
    --background: 222 47% 5%;
    --foreground: 210 40% 98%;
    --card: 222 47% 8%;
    --card-foreground: 210 40% 98%;
    --popover: 222 47% 8%;
    --popover-foreground: 210 40% 98%;
    --primary: 217 91% 60%;
    --primary-foreground: 222 47% 5%;
    --secondary: 217 33% 12%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217 33% 12%;
    --muted-foreground: 215 20% 65%;
    --accent: 217 33% 15%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62% 54%;
    --destructive-foreground: 210 40% 98%;
    --success: 142 69% 45%;
    --success-foreground: 222 47% 5%;
    --warning: 38 92% 50%;
    --warning-foreground: 222 47% 5%;
    --info: 199 89% 48%;
    --info-foreground: 222 47% 5%;
    --border: 217 33% 17%;
    --input: 217 33% 17%;
    --ring: 217 91% 60%;

    --shadow-elegant: 0 10px 30px -10px hsl(var(--primary) / 0.3);
    --shadow-glow: 0 0 40px hsl(var(--primary) / 0.2);
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground antialiased;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
  h1, h2, h3, h4, h5, h6 {
    @apply tracking-tight text-foreground;
  }
}

/* ========================================
   UTILITY CLASSES — Use sparingly
   ======================================== */
@layer utilities {
  /* Text gradient */
  .text-gradient {
    @apply bg-clip-text text-transparent;
    background-image: var(--gradient-text);
  }

  /* Smooth focus ring */
  .focus-ring {
    @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background;
  }

  /* Glass morphism */
  .glass {
    @apply bg-background/80 backdrop-blur-md border border-border/50;
  }

  /* Animated gradient border */
  .gradient-border {
    position: relative;
  }
  .gradient-border::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1px;
    background: var(--gradient-primary);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
  }

  /* Shine effect on hover */
  .shine-on-hover {
    position: relative;
    overflow: hidden;
  }
  .shine-on-hover::after {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--gradient-shine);
    transform: translateX(-100%);
    transition: transform 0.6s ease;
  }
  .shine-on-hover:hover::after {
    transform: translateX(100%);
  }
}
```

---

## STEP 2: The tailwind.config.ts — Extending Tailwind

```typescript
import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
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
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "calc(var(--radius) + 2px)",
        md: "var(--radius)",
        sm: "calc(var(--radius) - 2px)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      fontSize: {
        "display": ["3.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline": ["2.25rem", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" }],
        "title": ["1.5rem", { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "600" }],
        "body-lg": ["1.125rem", { lineHeight: "1.6", fontWeight: "400" }],
        "body": ["1rem", { lineHeight: "1.6", fontWeight: "400" }],
        "caption": ["0.875rem", { lineHeight: "1.5", fontWeight: "400" }],
        "overline": ["0.75rem", { lineHeight: "1", letterSpacing: "0.1em", fontWeight: "500" }],
      },
      boxShadow: {
        "elegant": "var(--shadow-elegant)",
        "glow": "var(--shadow-glow)",
        "inner-subtle": "var(--shadow-inner)",
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
        "slide-in-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-in-left": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "spin-slow": {
          to: { transform: "rotate(360deg)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "fade-in-up": "fade-in-up 0.4s ease-out",
        "fade-in-down": "fade-in-down 0.4s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "slide-in-left": "slide-in-left 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "spin-slow": "spin-slow 3s linear infinite",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
```

---

## STEP 3: Color Palette Presets

Choose based on the user's brand/vibe. These are HSL values for `--primary`.

### Professional (Default Blue)
```css
--primary: 222 47% 51%;     /* Deep blue */
```

### Startup / Energetic
```css
--primary: 262 83% 58%;     /* Vivid purple */
```

### Nature / Health
```css
--primary: 142 76% 36%;     /* Emerald green */
```

### Luxury / Premium
```css
--primary: 0 0% 9%;         /* Near black */
```

### Creative / Bold
```css
--primary: 346 77% 50%;     /* Rose/magenta */
```

### Finance / Trust
```css
--primary: 213 94% 44%;     /* Royal blue */
```

### Warm / Friendly
```css
--primary: 25 95% 53%;      /* Warm orange */
```

---

## STEP 4: Design Token Naming Convention

### Pattern: `[category]-[variant]`

| Token | What It Controls | Example |
|-------|-----------------|---------|
| `--background` | Page background | `0 0% 100%` |
| `--foreground` | Default text | `222 47% 11%` |
| `--primary` | Brand color, CTAs | `222 47% 51%` |
| `--primary-foreground` | Text on primary bg | `210 40% 98%` |
| `--muted` | Subtle backgrounds | `210 40% 96%` |
| `--muted-foreground` | Secondary text | `215 16% 47%` |
| `--card` | Card backgrounds | `0 0% 100%` |
| `--border` | Dividers, outlines | `214 32% 91%` |
| `--ring` | Focus ring color | `222 47% 51%` |
| `--destructive` | Errors, delete | `0 84% 60%` |
| `--success` | Confirmations | `142 76% 36%` |
| `--warning` | Warnings, alerts | `38 92% 50%` |

---

## STEP 5: Simple Scope Design System (CSS Variables)

For `scope = "simple"` projects (no Tailwind):

```css
:root {
  /* Colors */
  --color-primary: #3b82f6;
  --color-primary-hover: #2563eb;
  --color-primary-light: #dbeafe;
  --color-secondary: #64748b;
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-error: #ef4444;

  --color-bg: #ffffff;
  --color-bg-alt: #f8fafc;
  --color-text: #1e293b;
  --color-text-muted: #64748b;
  --color-border: #e2e8f0;

  /* Typography */
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  --text-4xl: 2.25rem;

  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;
  --space-24: 6rem;

  /* Radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 200ms ease;
  --transition-slow: 300ms ease;

  /* Layout */
  --max-width: 1200px;
  --max-width-narrow: 768px;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #0f172a;
    --color-bg-alt: #1e293b;
    --color-text: #f1f5f9;
    --color-text-muted: #94a3b8;
    --color-border: #334155;
    --color-primary-light: #1e3a5f;
  }
}
```

---

## RULES FOR ALL AGENTS

1. **Design system MUST exist before ANY component code is written**
2. **globals.css and tailwind.config.ts are the ONLY places colors/shadows/animations are defined**
3. **Components ONLY reference semantic tokens** — never raw colors
4. **When the user mentions a brand color or vibe, update the design system FIRST**, then build components
5. **Dark mode support is automatic** when using semantic tokens correctly
6. **Test contrast**: primary-foreground on primary must be readable, foreground on background must be readable
7. **HSL format ONLY in globals.css** — never hex, never rgb in CSS variables
