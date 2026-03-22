# Responsive Layout Patterns — Copy-Paste Reference

## Mobile-First Grid
```html
<!-- 1 col mobile → 2 cols tablet → 3 cols desktop -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div>Card 1</div>
  <div>Card 2</div>
  <div>Card 3</div>
</div>
```

## Auto-Fill Grid (items size themselves)
```html
<div class="grid gap-6" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))">
  <!-- Items automatically wrap -->
</div>
```

## Responsive Hero Section
```html
<section class="px-4 py-16 md:py-24 lg:py-32 text-center">
  <div class="mx-auto max-w-3xl">
    <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold">Headline</h1>
    <p class="mt-4 text-lg md:text-xl text-gray-600">Subtitle</p>
    <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
      <a href="#" class="btn btn-primary">Primary CTA</a>
      <a href="#" class="btn btn-outline">Secondary CTA</a>
    </div>
  </div>
</section>
```

## Responsive Navbar → Hamburger
```html
<!-- Desktop: row of links. Mobile: hamburger button -->
<nav class="flex items-center justify-between px-4 h-16">
  <a href="/" class="text-xl font-bold">Logo</a>
  <ul class="hidden md:flex gap-6"><!-- links --></ul>
  <button class="md:hidden">☰</button>
</nav>
```

## Sidebar Layout (Dashboard)
```html
<div class="flex min-h-screen">
  <!-- Sidebar: hidden mobile, 240px on desktop -->
  <aside class="hidden md:block w-60 border-r bg-gray-50">
    <!-- nav items -->
  </aside>
  <!-- Content: full width mobile, remaining width desktop -->
  <main class="flex-1 p-4 md:p-8">
    <!-- page content -->
  </main>
</div>
```

## Responsive Spacing Scale
```
Mobile (default):  px-4 py-8  text-sm  gap-4
Tablet (md:):      px-6 py-12 text-base gap-6
Desktop (lg:):     px-8 py-16 text-lg  gap-8
```

## Stack on Mobile, Row on Desktop
```html
<div class="flex flex-col md:flex-row gap-4">
  <div class="flex-1">Left content</div>
  <div class="flex-1">Right content</div>
</div>
```

## Hide/Show by Breakpoint
```html
<div class="hidden md:block">Desktop only</div>
<div class="md:hidden">Mobile only</div>
```

## Responsive Image
```html
<!-- Next.js -->
<Image src="/hero.jpg" alt="Hero" width={1200} height={600} className="w-full h-auto rounded-lg" priority />

<!-- Plain HTML -->
<img src="hero.jpg" alt="Hero" loading="lazy" class="w-full h-auto rounded-lg" />
```

## CSS Media Queries (Simple scope)
```css
/* Mobile first (default styles) */
.hero { padding: 2rem 1rem; }
.hero h1 { font-size: 1.75rem; }
.grid { grid-template-columns: 1fr; }

/* Tablet: ≥768px */
@media (min-width: 768px) {
  .hero { padding: 3rem 1.5rem; }
  .hero h1 { font-size: 2.5rem; }
  .grid { grid-template-columns: repeat(2, 1fr); }
}

/* Desktop: ≥1024px */
@media (min-width: 1024px) {
  .hero { padding: 4rem 2rem; }
  .hero h1 { font-size: 3rem; }
  .grid { grid-template-columns: repeat(3, 1fr); }
}
```
