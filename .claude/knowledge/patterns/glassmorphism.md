# Glassmorphism & Modern CSS Effects — Patterns & Recipes

Premium visual effects: frosted glass, mesh gradients, noise textures, glow effects, and modern CSS techniques that create depth and visual sophistication.

---

## 1. Glassmorphism Card

The signature frosted glass effect. Requires a colorful background behind it.

```tsx
// Glassmorphism card — use semantic tokens
export function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card/60 p-6 shadow-lg backdrop-blur-xl">
      {children}
    </div>
  )
}
```

### CSS Custom Properties for Glass
Add to `globals.css`:

```css
@layer base {
  :root {
    --glass-bg: 0 0% 100% / 0.6;
    --glass-border: 0 0% 100% / 0.2;
    --glass-blur: 20px;
    --glass-shadow: 0 8px 32px hsl(0 0% 0% / 0.1);
  }

  .dark {
    --glass-bg: 222 47% 11% / 0.6;
    --glass-border: 0 0% 100% / 0.1;
    --glass-shadow: 0 8px 32px hsl(0 0% 0% / 0.3);
  }
}
```

### Tailwind Config Extension
```ts
// tailwind.config.ts
{
  theme: {
    extend: {
      backdropBlur: {
        xs: '2px',
      },
      backgroundColor: {
        'glass': 'hsl(var(--glass-bg))',
      },
      borderColor: {
        'glass': 'hsl(var(--glass-border))',
      },
      boxShadow: {
        'glass': 'var(--glass-shadow)',
      },
    }
  }
}
```

### Production-Ready Glass Card
```tsx
interface GlassCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export function GlassCard({ children, className = '', hover = true }: GlassCardProps) {
  return (
    <div
      className={`
        rounded-2xl border border-border/30 bg-card/60 p-6 shadow-glass backdrop-blur-xl
        ${hover ? 'transition-all duration-300 hover:bg-card/80 hover:shadow-lg hover:-translate-y-0.5' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}
```

---

## 2. Mesh Gradient Background

Organic, flowing gradients with multiple color stops. The trendy 2026 background effect.

### CSS Mesh Gradient
```css
.mesh-gradient {
  background:
    radial-gradient(at 40% 20%, hsl(var(--primary)) 0px, transparent 50%),
    radial-gradient(at 80% 0%, hsl(var(--accent) / 0.4) 0px, transparent 50%),
    radial-gradient(at 0% 50%, hsl(var(--secondary)) 0px, transparent 50%),
    radial-gradient(at 80% 50%, hsl(var(--primary) / 0.3) 0px, transparent 50%),
    radial-gradient(at 0% 100%, hsl(var(--accent) / 0.5) 0px, transparent 50%),
    hsl(var(--background));
}
```

### Tailwind Component
```tsx
export function MeshGradientBg() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Gradient blobs */}
      <div className="absolute -left-[10%] -top-[10%] h-[500px] w-[500px] rounded-full bg-primary/20 blur-[100px]" />
      <div className="absolute -right-[5%] top-[20%] h-[400px] w-[400px] rounded-full bg-accent/15 blur-[100px]" />
      <div className="absolute bottom-[10%] left-[20%] h-[450px] w-[450px] rounded-full bg-secondary/20 blur-[100px]" />
      <div className="absolute -bottom-[10%] right-[10%] h-[350px] w-[350px] rounded-full bg-primary/10 blur-[80px]" />
    </div>
  )
}
```

### Animated Mesh Gradient
```tsx
'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export function AnimatedMeshGradient() {
  const blob1 = useRef<HTMLDivElement>(null)
  const blob2 = useRef<HTMLDivElement>(null)
  const blob3 = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const blobs = [blob1.current, blob2.current, blob3.current].filter(Boolean)

    blobs.forEach((blob) => {
      gsap.to(blob, {
        x: 'random(-100, 100)',
        y: 'random(-100, 100)',
        duration: 'random(8, 15)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
    })
  }, [])

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div ref={blob1} className="absolute -left-[10%] -top-[10%] h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px]" />
      <div ref={blob2} className="absolute right-[10%] top-[30%] h-[400px] w-[400px] rounded-full bg-accent/15 blur-[100px]" />
      <div ref={blob3} className="absolute bottom-[10%] left-[30%] h-[450px] w-[450px] rounded-full bg-secondary/20 blur-[100px]" />
    </div>
  )
}
```

---

## 3. Noise / Grain Texture Overlay

Adds subtle film grain for a tactile, premium feel.

### CSS-Only Noise
```css
.noise-overlay::after {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0.03;
  z-index: 1;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}
```

### React Component
```tsx
export function NoiseOverlay({ opacity = 0.03 }: { opacity?: number }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-10"
      style={{
        opacity,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }}
    />
  )
}
```

---

## 4. Glow / Neon Effect

Colored glow behind elements. Creates depth and draws attention.

```tsx
// Glow behind a card or image
export function GlowEffect({ color = 'primary', children }: { color?: string; children: React.ReactNode }) {
  return (
    <div className="relative">
      {/* Glow */}
      <div className={`absolute -inset-4 rounded-3xl bg-${color}/20 blur-2xl`} />
      {/* Content */}
      <div className="relative">{children}</div>
    </div>
  )
}
```

### Animated Glow
```tsx
export function AnimatedGlow() {
  return (
    <div className="relative">
      <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] opacity-30 blur-xl animate-gradient" />
      <div className="relative rounded-xl border border-border bg-card p-6">
        Content
      </div>
    </div>
  )
}
```

Add to `globals.css`:
```css
@keyframes gradient {
  0% { background-position: 0% center; }
  100% { background-position: 200% center; }
}

.animate-gradient {
  animation: gradient 3s linear infinite;
}
```

---

## 5. Gradient Border

Borders that fade through multiple colors.

```tsx
export function GradientBorderCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-primary/50 via-accent/50 to-primary/50 p-[1px]">
      <div className="rounded-[calc(1rem-1px)] bg-card p-6">
        {children}
      </div>
    </div>
  )
}
```

---

## 6. Dot Grid Pattern

Subtle background pattern for sections.

```tsx
export function DotGridBg() {
  return (
    <div
      className="absolute inset-0 -z-10 opacity-[0.03]"
      style={{
        backgroundImage: 'radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    />
  )
}
```

---

## 7. Line Grid Pattern

```tsx
export function LineGridBg() {
  return (
    <div
      className="absolute inset-0 -z-10 opacity-[0.03]"
      style={{
        backgroundImage: `
          linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
          linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)
        `,
        backgroundSize: '48px 48px',
      }}
    />
  )
}
```

---

## 8. Spotlight / Radial Highlight

A radial gradient that follows the cursor or highlights a section.

### Static Spotlight
```tsx
export function SpotlightBg() {
  return (
    <div className="absolute inset-0 -z-10">
      <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
    </div>
  )
}
```

### Mouse-Following Spotlight
```tsx
'use client'

import { useRef, useEffect } from 'react'

export function MouseSpotlight() {
  const spotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!spotRef.current) return
      spotRef.current.style.left = `${e.clientX}px`
      spotRef.current.style.top = `${e.clientY}px`
    }

    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      <div
        ref={spotRef}
        className="absolute h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[80px] transition-all duration-300"
      />
    </div>
  )
}
```

---

## 9. Glass Navigation Bar

```tsx
export function GlassNav() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-border/30 bg-background/60 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <span className="text-lg font-bold text-foreground">Logo</span>
        <div className="flex items-center gap-6">
          <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Features</a>
          <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Pricing</a>
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            Get Started
          </button>
        </div>
      </div>
    </nav>
  )
}
```

---

## 10. Combining Effects — Hero Section

```tsx
export function PremiumHero() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Mesh gradient background */}
      <MeshGradientBg />

      {/* Noise overlay */}
      <NoiseOverlay opacity={0.03} />

      {/* Dot grid */}
      <DotGridBg />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Beautiful by Default
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            Premium visual effects that create depth, sophistication, and delight.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <button className="rounded-xl bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl active:scale-[0.98]">
              Get Started
            </button>
            <button className="rounded-xl border border-border bg-card/60 px-8 py-3 text-sm font-medium text-foreground backdrop-blur-sm transition-all hover:bg-card/80">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
```

---

## Scope Guide

| Effect | simple | prototype | mvp | production |
|--------|--------|-----------|-----|------------|
| Glassmorphism | CSS only | Tailwind | Tailwind | Tailwind + animated |
| Mesh Gradient | CSS radial | Tailwind blobs | Animated blobs | GSAP animated |
| Noise Overlay | CSS ::after | Component | Component | Component |
| Glow | box-shadow | Tailwind blur | Animated gradient | GSAP + keyframes |
| Gradient Border | CSS | Tailwind | Tailwind | Animated |
| Dot/Line Grid | CSS bg | Tailwind | Tailwind | Tailwind |
| Spotlight | Static | Static | Mouse-follow | Mouse-follow + GSAP |
