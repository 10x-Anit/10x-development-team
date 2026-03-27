# Glassmorphism Card Component — Copy-Paste Ready

A frosted glass card with multiple variants, hover effects, and full dark mode support.

---

## Glass Card Component

```tsx
// src/components/ui/glass-card.tsx
import { forwardRef } from 'react'

type GlassVariant = 'default' | 'frosted' | 'subtle' | 'bordered' | 'glow'

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: GlassVariant
  hover?: boolean
  padding?: 'sm' | 'md' | 'lg'
}

const variantClasses: Record<GlassVariant, string> = {
  default: 'bg-card/60 border border-border/30 backdrop-blur-xl shadow-lg',
  frosted: 'bg-card/40 border border-border/20 backdrop-blur-2xl shadow-xl',
  subtle: 'bg-card/30 border border-border/10 backdrop-blur-lg',
  bordered: 'bg-card/50 border-2 border-primary/20 backdrop-blur-xl shadow-lg',
  glow: 'bg-card/50 border border-primary/30 backdrop-blur-xl shadow-lg shadow-primary/5',
}

const paddingClasses = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ variant = 'default', hover = true, padding = 'md', className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          rounded-2xl ${variantClasses[variant]} ${paddingClasses[padding]}
          ${hover ? 'transition-all duration-300 hover:bg-card/80 hover:shadow-xl hover:-translate-y-0.5' : ''}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    )
  }
)
GlassCard.displayName = 'GlassCard'
```

---

## Usage Examples

### Default Glass Card
```tsx
import { GlassCard } from '@/components/ui/glass-card'

<GlassCard>
  <h3 className="text-lg font-semibold text-foreground">Card Title</h3>
  <p className="mt-2 text-sm text-muted-foreground">Card description text here.</p>
</GlassCard>
```

### Frosted (Heavier Blur)
```tsx
<GlassCard variant="frosted">
  <h3 className="text-lg font-semibold text-foreground">Frosted Glass</h3>
  <p className="mt-2 text-sm text-muted-foreground">Extra blur and transparency.</p>
</GlassCard>
```

### Bordered with Primary Accent
```tsx
<GlassCard variant="bordered">
  <h3 className="text-lg font-semibold text-foreground">Featured</h3>
  <p className="mt-2 text-sm text-muted-foreground">Highlighted with a primary-colored border.</p>
</GlassCard>
```

### Glow Effect
```tsx
<GlassCard variant="glow">
  <h3 className="text-lg font-semibold text-foreground">Glowing Card</h3>
  <p className="mt-2 text-sm text-muted-foreground">Subtle glow from the primary color.</p>
</GlassCard>
```

### No Hover (Static)
```tsx
<GlassCard hover={false} padding="lg">
  <h3 className="text-xl font-semibold text-foreground">Static Card</h3>
  <p className="mt-2 text-muted-foreground">No hover animation.</p>
</GlassCard>
```

---

## Glass Card Grid (Feature Section)

```tsx
import { GlassCard } from '@/components/ui/glass-card'

const features = [
  { title: '3D Scenes', description: 'Build immersive 3D experiences with code.', icon: '...' },
  { title: 'Animations', description: 'Scroll-driven motion that tells a story.', icon: '...' },
  { title: 'Design System', description: 'Tokens that adapt to light and dark mode.', icon: '...' },
]

export function FeatureGrid() {
  return (
    <section className="relative py-24">
      {/* Background for glass to look good */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -left-[10%] top-[20%] h-[400px] w-[400px] rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute -right-[5%] bottom-[10%] h-[350px] w-[350px] rounded-full bg-accent/10 blur-[80px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Features
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <GlassCard key={i} variant="default">
              <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}
```

---

## Glass Navigation Bar

```tsx
export function GlassNavbar() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-border/20 bg-background/50 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="/" className="text-lg font-bold text-foreground">Brand</a>
        <div className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Features</a>
          <a href="#pricing" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Pricing</a>
          <a href="#about" className="text-sm text-muted-foreground transition-colors hover:text-foreground">About</a>
        </div>
        <button className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98]">
          Get Started
        </button>
      </div>
    </nav>
  )
}
```

---

## Important Notes

- Glassmorphism REQUIRES a colorful background behind it to look good. Always pair with mesh gradients, 3D scenes, or gradient blobs.
- All colors use semantic tokens (`bg-card/60`, `border-border/30`, `text-foreground`) — dark mode works automatically.
- The `backdrop-blur-xl` property has good browser support but may be slow on very old devices. Always test.
