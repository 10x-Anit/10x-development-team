# Responsive Layout Patterns — Comprehensive Reference

> MANDATORY: All colors and spacing use semantic tokens from the Design Bible.
> Mobile-first ALWAYS. Write the mobile layout first, then enhance with `sm:`, `md:`, `lg:`, `xl:`.

---

## Mobile-First Breakpoint Strategy

Design for mobile first. Add complexity as screens get larger.

```
Default (0px+)     Single column, stacked, touch-friendly
sm: (640px+)       Two columns begin, side-by-side CTAs
md: (768px+)       Tablet — sidebar appears, more breathing room
lg: (1024px+)      Laptop — 3+ columns, full navigation
xl: (1280px+)      Desktop — max-width container kicks in
2xl: (1536px+)     Large desktop — extra spacing, wider gutters
```

### The Container Pattern (Use on Every Page)
```tsx
<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
  {/* All page content lives inside this */}
</div>

// Narrow container for text-heavy pages (blog, terms, forms)
<div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
  {/* Readable text width */}
</div>

// Full-bleed sections with inner container
<section className="bg-muted py-16 sm:py-20 lg:py-24">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    {/* Section content */}
  </div>
</section>
```

---

## Hero Section Layouts

### Centered Hero (Landing Pages)
```tsx
<section className="relative px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
  <div className="mx-auto max-w-3xl text-center">
    {/* Optional overline */}
    <p className="text-sm font-medium uppercase tracking-wider text-primary mb-4">
      Introducing v2.0
    </p>

    <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-foreground">
      Build faster with our platform
    </h1>

    <p className="mt-6 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
      A short description that explains the value proposition in one or two sentences.
    </p>

    {/* CTAs: stack on mobile, row on sm+ */}
    <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
      <a href="#" className="inline-flex items-center justify-center h-12 px-6 rounded-lg bg-primary text-primary-foreground font-medium shadow-sm hover:bg-primary/90 transition-colors">
        Get Started
      </a>
      <a href="#" className="inline-flex items-center justify-center h-12 px-6 rounded-lg border border-input bg-background text-foreground font-medium hover:bg-accent transition-colors">
        Learn More
      </a>
    </div>
  </div>
</section>
```

### Split Hero (Image + Text)
```tsx
<section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
  <div className="mx-auto max-w-7xl">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
      {/* Text — comes first in DOM for mobile, visually on left for desktop */}
      <div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
          Headline here
        </h1>
        <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
          Supporting description text.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button className="h-12 px-6 rounded-lg bg-primary text-primary-foreground font-medium">
            Primary CTA
          </button>
        </div>
      </div>

      {/* Image — second in DOM, shows below on mobile, right on desktop */}
      <div className="relative aspect-[4/3] lg:aspect-square rounded-xl overflow-hidden bg-muted">
        <Image
          src="/hero.jpg"
          alt="Descriptive alt text"
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </div>
    </div>
  </div>
</section>
```

---

## Feature Grid Layouts

### 3-Column Feature Grid
```tsx
<section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
  <div className="mx-auto max-w-7xl">
    {/* Section header */}
    <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
      <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
        Everything you need
      </h2>
      <p className="mt-4 text-lg text-muted-foreground">
        A brief description of your features section.
      </p>
    </div>

    {/* Grid: 1 col mobile -> 2 col tablet -> 3 col desktop */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {features.map((feature) => (
        <div key={feature.title} className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10 text-primary mb-4">
            <feature.icon className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>
```

### 4-Column Stats/Metrics Row
```tsx
<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
  {stats.map((stat) => (
    <div key={stat.label} className="rounded-xl bg-muted p-6 text-center">
      <p className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
    </div>
  ))}
</div>
```

---

## Pricing Grid Layout

```tsx
<section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
  <div className="mx-auto max-w-7xl">
    <div className="text-center mb-12">
      <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
        Simple, transparent pricing
      </h2>
    </div>

    {/* 3 pricing cards — stack on mobile, row on lg */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
      {plans.map((plan) => (
        <div
          key={plan.name}
          className={cn(
            "rounded-xl border bg-card p-6 sm:p-8 flex flex-col",
            plan.popular
              ? "border-2 border-primary shadow-elegant ring-1 ring-primary/10 relative"
              : "border-border shadow-sm"
          )}
        >
          {plan.popular && (
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
              Most Popular
            </span>
          )}
          <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
          <p className="mt-6">
            <span className="text-4xl font-bold text-foreground">${plan.price}</span>
            <span className="text-sm text-muted-foreground">/month</span>
          </p>
          <ul className="mt-6 space-y-3 flex-1">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                {feature}
              </li>
            ))}
          </ul>
          <button className={cn(
            "mt-8 h-11 w-full rounded-lg font-medium transition-colors",
            plan.popular
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "border border-input bg-background text-foreground hover:bg-accent"
          )}>
            Get started
          </button>
        </div>
      ))}
    </div>
  </div>
</section>
```

---

## Testimonials Layout

### Scrollable Row on Mobile, Grid on Desktop
```tsx
<section className="py-16 sm:py-20 lg:py-24">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground text-center mb-12">
      What our customers say
    </h2>

    {/* Horizontal scroll on mobile, 3-col grid on desktop */}
    <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0">
      {testimonials.map((t) => (
        <div
          key={t.name}
          className="min-w-[280px] sm:min-w-[320px] lg:min-w-0 snap-start rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col"
        >
          <p className="text-sm text-muted-foreground leading-relaxed flex-1">
            "{t.quote}"
          </p>
          <div className="mt-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-muted overflow-hidden">
              <Image src={t.avatar} alt={t.name} width={40} height={40} className="object-cover" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.role}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
```

---

## Sidebar + Content Layout (Dashboard)

### Desktop Sidebar, Mobile Bottom Bar
```tsx
<div className="flex min-h-screen flex-col lg:flex-row">
  {/* Desktop sidebar — hidden on mobile */}
  <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-border lg:bg-card">
    <div className="flex h-16 items-center px-6 border-b border-border">
      <span className="text-lg font-semibold text-foreground">AppName</span>
    </div>
    <nav className="flex-1 space-y-1 px-3 py-4">
      {navItems.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            item.active
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <item.icon className="h-5 w-5" />
          {item.label}
        </a>
      ))}
    </nav>
  </aside>

  {/* Main content */}
  <main className="flex-1 pb-20 lg:pb-0">
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Page content */}
    </div>
  </main>

  {/* Mobile bottom bar — visible only on mobile */}
  <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-border bg-card/95 backdrop-blur-sm h-16 lg:hidden">
    {navItems.slice(0, 5).map((item) => (
      <a
        key={item.href}
        href={item.href}
        className={cn(
          "flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium transition-colors",
          item.active ? "text-primary" : "text-muted-foreground"
        )}
      >
        <item.icon className="h-5 w-5" />
        {item.label}
      </a>
    ))}
  </nav>
</div>
```

---

## Navigation Patterns

### Responsive Navbar (Hamburger on Mobile)
```tsx
"use client"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a href="/" className="text-lg font-semibold text-foreground">Logo</a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
          <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">About</a>
          <button className="h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            Get Started
          </button>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-muted transition-colors"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="md:hidden border-t border-border bg-background animate-fade-in-down">
          <div className="flex flex-col px-4 py-4 space-y-1">
            <a href="#" className="py-3 text-base font-medium text-foreground">Features</a>
            <a href="#" className="py-3 text-base font-medium text-foreground">Pricing</a>
            <a href="#" className="py-3 text-base font-medium text-foreground">About</a>
            <button className="mt-2 h-11 w-full rounded-lg bg-primary text-primary-foreground font-medium">
              Get Started
            </button>
          </div>
        </nav>
      )}
    </header>
  )
}
```

---

## Image Handling

### Responsive Image with Next.js
```tsx
// Fill container — use inside a relatively positioned wrapper with aspect ratio
<div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
  <Image
    src="/image.jpg"
    alt="Descriptive text"
    fill
    className="object-cover"
    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  />
</div>

// Fixed aspect ratios
<div className="aspect-square ..." />      {/* 1:1 — avatars, thumbnails */}
<div className="aspect-video ..." />       {/* 16:9 — videos, hero images */}
<div className="aspect-[4/3] ..." />       {/* 4:3 — product images */}
<div className="aspect-[3/2] ..." />       {/* 3:2 — landscape photos */}

// Avatar
<div className="relative h-10 w-10 rounded-full overflow-hidden bg-muted shrink-0">
  <Image src={avatarUrl} alt={name} fill className="object-cover" sizes="40px" />
</div>
```

### Image Sizes Attribute Guide
```
sizes="100vw"                                        Full-width images
sizes="(max-width: 768px) 100vw, 50vw"              Half-width on desktop
sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"   Third-width on large
sizes="40px"                                         Fixed small images (avatars)
```

---

## Touch Targets

All interactive elements MUST be at least 44x44px on mobile (WCAG 2.5.8).

```tsx
// Buttons: minimum h-11 (44px) on mobile
<button className="h-11 min-w-[44px] px-4 ...">

// Mobile nav links: generous padding
<a className="block py-3 px-4 min-h-[44px] ...">

// Icon buttons: minimum 44x44 touch area
<button className="h-11 w-11 inline-flex items-center justify-center ..." aria-label="Close">
  <X className="h-5 w-5" />
</button>

// Checkbox/radio: wrap in label for larger hit area
<label className="flex items-center gap-3 py-2 cursor-pointer min-h-[44px]">
  <input type="checkbox" className="h-4 w-4" />
  <span className="text-sm">Option label</span>
</label>
```

---

## Container Queries for Component-Level Responsiveness

When a component needs to respond to ITS container width (not the viewport), use container queries.

```tsx
// Parent declares itself as a container
<div className="@container">
  {/* Children respond to container width */}
  <article className="flex flex-col @sm:flex-row gap-4 p-4">
    <img className="w-full @sm:w-40 @sm:h-40 rounded-lg object-cover aspect-video @sm:aspect-square" />
    <div className="flex-1">
      <h3 className="font-semibold text-foreground text-base @md:text-lg">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1 line-clamp-2 @md:line-clamp-3">{desc}</p>
      <div className="mt-3 flex gap-2">
        <span className="text-xs text-muted-foreground">{date}</span>
      </div>
    </div>
  </article>
</div>

// Container breakpoints:
// @xs   160px
// @sm   320px
// @md   448px
// @lg   576px
// @xl   672px
```

This is ideal for cards that appear in different layouts (sidebar widget vs main grid vs full-width).

---

## CSS Media Queries (Simple Scope Only)

For projects using plain HTML/CSS without Tailwind:

```css
/* Mobile first — default styles */
.container { max-width: 100%; padding: 0 1rem; margin: 0 auto; }
.hero { padding: 3rem 1rem; text-align: center; }
.hero h1 { font-size: 1.75rem; }
.grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }

/* Tablet: 768px+ */
@media (min-width: 768px) {
  .container { max-width: 768px; padding: 0 1.5rem; }
  .hero { padding: 4rem 1.5rem; }
  .hero h1 { font-size: 2.5rem; }
  .grid { grid-template-columns: repeat(2, 1fr); }
}

/* Desktop: 1024px+ */
@media (min-width: 1024px) {
  .container { max-width: 1024px; padding: 0 2rem; }
  .hero { padding: 5rem 2rem; }
  .hero h1 { font-size: 3rem; }
  .grid { grid-template-columns: repeat(3, 1fr); }
}

/* Large desktop: 1280px+ */
@media (min-width: 1280px) {
  .container { max-width: 1200px; }
}
```
