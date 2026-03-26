# Card Component -- Production-Quality, Copy-Paste Ready

> Uses ONLY semantic design tokens. NEVER use `text-white`, `bg-gray-*`, `bg-blue-*`, etc.

---

## React + Tailwind (MVP/Production Scope)

### Core Card Component

```tsx
// src/components/ui/card.tsx
import { cn } from '@/lib/utils'

// --- Variant Styles ---

const cardVariants = {
  default:     'rounded-xl border border-border bg-card shadow-sm',
  elevated:    'rounded-xl bg-card shadow-lg',
  muted:       'rounded-xl bg-muted border-0',
  interactive: 'rounded-xl border border-border bg-card shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200 cursor-pointer',
  glass:       'rounded-xl bg-card/80 backdrop-blur-md border border-border/50',
  featured:    'rounded-xl border-2 border-primary bg-card shadow-elegant ring-1 ring-primary/10',
  gradient:    'rounded-xl bg-card border border-border relative overflow-hidden gradient-border',
} as const

// --- TypeScript Interfaces ---

export interface CardProps {
  /** Visual variant */
  variant?: keyof typeof cardVariants
  /** Card padding size */
  padding?: 'compact' | 'default' | 'spacious'
  /** Optional image at top */
  image?: {
    src: string
    alt: string
    aspectRatio?: 'video' | 'square' | 'wide'
  }
  /** Badge text in top corner */
  badge?: string
  /** Card title */
  title?: string
  /** Card description */
  description?: string
  /** Footer actions (buttons, links) */
  actions?: React.ReactNode
  /** Turns card into a link */
  href?: string
  /** Additional class names */
  className?: string
  children?: React.ReactNode
}

// --- Helpers ---

const paddingMap = {
  compact:  'p-4',
  default:  'p-6',
  spacious: 'p-8',
}

const aspectMap = {
  video:  'aspect-video',
  square: 'aspect-square',
  wide:   'aspect-[2/1]',
}

// --- Component ---

export function Card({
  variant = 'default',
  padding = 'default',
  image,
  badge,
  title,
  description,
  actions,
  href,
  className,
  children,
}: CardProps) {
  const Wrapper = href ? 'a' : 'div'
  const wrapperProps = href ? { href } : {}

  return (
    <Wrapper
      {...wrapperProps}
      className={cn(
        'group block overflow-hidden',
        cardVariants[variant],
        href && 'hover:shadow-md hover:-translate-y-0.5 transition-all duration-200',
        className
      )}
    >
      {/* Image */}
      {image && (
        <div className={cn('overflow-hidden bg-muted', aspectMap[image.aspectRatio || 'video'])}>
          <img
            src={image.src}
            alt={image.alt}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      )}

      {/* Content */}
      <div className={paddingMap[padding]}>
        {/* Badge */}
        {badge && (
          <span className="mb-3 inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            {badge}
          </span>
        )}

        {/* Title */}
        {title && (
          <h3 className="text-lg font-semibold text-card-foreground leading-tight">
            {title}
          </h3>
        )}

        {/* Description */}
        {description && (
          <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {description}
          </p>
        )}

        {/* Custom children */}
        {children}

        {/* Actions */}
        {actions && (
          <div className="mt-4 flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </Wrapper>
  )
}
```

### Card Header / Footer Sub-Components

```tsx
// Use these inside <Card> when you need structured sections

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('px-6 py-4 border-b border-border', className)}>
      {children}
    </div>
  )
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('px-6 py-4', className)}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('px-6 py-4 border-t border-border bg-muted/50', className)}>
      {children}
    </div>
  )
}
```

### Skeleton Loader

```tsx
export function CardSkeleton({ hasImage = false }: { hasImage?: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {hasImage && (
        <div className="aspect-video animate-pulse bg-muted" />
      )}
      <div className="p-6 space-y-3">
        <div className="h-3 w-16 animate-pulse rounded bg-muted" />
        <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
        <div className="space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
        </div>
        <div className="h-9 w-24 animate-pulse rounded-md bg-muted" />
      </div>
    </div>
  )
}
```

### Framer Motion Enhanced Card (LARGE context / Production)

```tsx
// src/components/ui/motion-card.tsx
'use client'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { CardProps } from './card'

const cardVariants = {
  default:     'rounded-xl border border-border bg-card shadow-sm',
  elevated:    'rounded-xl bg-card shadow-lg',
  glass:       'rounded-xl bg-card/80 backdrop-blur-md border border-border/50',
  featured:    'rounded-xl border-2 border-primary bg-card shadow-elegant ring-1 ring-primary/10',
} as const

interface MotionCardProps extends Omit<CardProps, 'variant'> {
  variant?: keyof typeof cardVariants
  /** Delay for staggered animation in grids */
  delay?: number
}

export function MotionCard({
  variant = 'default',
  delay = 0,
  image,
  badge,
  title,
  description,
  actions,
  children,
  className,
}: MotionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      whileHover={{ y: -4, boxShadow: 'var(--shadow-lg)' }}
      className={cn('group block overflow-hidden', cardVariants[variant], className)}
    >
      {image && (
        <div className="overflow-hidden bg-muted aspect-video">
          <motion.img
            src={image.src}
            alt={image.alt}
            className="h-full w-full object-cover"
            loading="lazy"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}
      <div className="p-6">
        {badge && (
          <span className="mb-3 inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            {badge}
          </span>
        )}
        {title && <h3 className="text-lg font-semibold text-card-foreground">{title}</h3>}
        {description && <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{description}</p>}
        {children}
        {actions && <div className="mt-4 flex items-center gap-2">{actions}</div>}
      </div>
    </motion.div>
  )
}
```

### Pricing Card Variant

```tsx
// src/components/ui/pricing-card.tsx
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PricingCardProps {
  plan: string
  price: string
  period?: string
  description: string
  features: string[]
  popular?: boolean
  ctaLabel?: string
  ctaHref?: string
  onCtaClick?: () => void
}

export function PricingCard({
  plan,
  price,
  period = '/month',
  description,
  features,
  popular = false,
  ctaLabel = 'Get Started',
  ctaHref,
  onCtaClick,
}: PricingCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border bg-card p-8 flex flex-col',
        popular
          ? 'border-2 border-primary shadow-elegant ring-1 ring-primary/10 relative'
          : 'border-border shadow-sm'
      )}
    >
      {popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
          Most Popular
        </span>
      )}

      <div>
        <h3 className="text-lg font-semibold text-card-foreground">{plan}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="mt-6">
        <span className="text-4xl font-bold tracking-tight text-card-foreground">{price}</span>
        <span className="text-sm text-muted-foreground">{period}</span>
      </div>

      <ul className="mt-6 flex-1 space-y-3" role="list">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
            <Check className="h-4 w-4 mt-0.5 shrink-0 text-primary" aria-hidden="true" />
            {feature}
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <Button
          variant={popular ? 'primary' : 'outline'}
          fullWidth
          onClick={onCtaClick}
          {...(ctaHref ? { as: 'a', href: ctaHref } : {})}
        >
          {ctaLabel}
        </Button>
      </div>
    </div>
  )
}
```

### Usage Examples

```tsx
import { Card, CardSkeleton } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

{/* Basic card */}
<Card title="Project Alpha" description="A brief summary of the project." />

{/* Image card */}
<Card
  image={{ src: '/product.jpg', alt: 'Product screenshot' }}
  badge="New"
  title="Product Name"
  description="A brief description of the product."
  actions={<Button size="sm">View</Button>}
/>

{/* Featured card */}
<Card variant="featured" title="Recommended Plan" description="Best value for teams." />

{/* Glass card (over gradient backgrounds) */}
<Card variant="glass" title="Glassmorphism" description="Frosted glass effect." />

{/* Interactive link card */}
<Card variant="interactive" href="/blog/post-1" title="Blog Post" description="Click to read more." />

{/* Card grid with skeletons */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
  {loading
    ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} hasImage />)
    : items.map(item => <Card key={item.id} {...item} />)
  }
</div>
```

---

## HTML/CSS (Simple Scope)

```html
<!-- Default card -->
<div class="card">
  <h3 class="card-title">Card Title</h3>
  <p class="card-description">Description text goes here.</p>
  <div class="card-actions">
    <a href="#" class="btn btn-primary btn-sm">View</a>
  </div>
</div>

<!-- Image card -->
<div class="card card-has-image">
  <div class="card-image">
    <img src="image.jpg" alt="Description" loading="lazy" />
  </div>
  <div class="card-body">
    <span class="card-badge">New</span>
    <h3 class="card-title">Product Name</h3>
    <p class="card-description">Brief product description.</p>
  </div>
</div>

<!-- Featured / highlighted card -->
<div class="card card-featured">
  <span class="card-popular-badge">Most Popular</span>
  <h3 class="card-title">Pro Plan</h3>
  <p class="card-description">Everything you need.</p>
</div>

<!-- Glass card (use over gradient sections) -->
<div class="card card-glass">
  <h3 class="card-title">Glass Effect</h3>
  <p class="card-description">Frosted glass background.</p>
</div>

<!-- Card grid -->
<div class="card-grid">
  <div class="card">...</div>
  <div class="card">...</div>
  <div class="card">...</div>
</div>
```

```css
/* css/components/card.css */

.card {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition: box-shadow var(--transition-base), transform var(--transition-base);
}

.card:hover {
  box-shadow: var(--shadow-md);
}

a.card:hover,
.card-interactive:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.card-body,
.card:not(.card-has-image) {
  padding: var(--space-6);
}

.card-has-image .card-body {
  padding: var(--space-6);
}

.card-image {
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: var(--color-bg-alt);
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.card:hover .card-image img {
  transform: scale(1.05);
}

.card-badge {
  display: inline-block;
  padding: 0.125rem 0.625rem;
  margin-bottom: var(--space-3);
  font-size: var(--text-xs);
  font-weight: 500;
  border-radius: var(--radius-full);
  background: color-mix(in srgb, var(--color-primary) 10%, transparent);
  color: var(--color-primary);
}

.card-title {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-text);
  line-height: 1.3;
  margin: 0;
}

.card-description {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  line-height: 1.6;
  margin-top: var(--space-1);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-actions {
  margin-top: var(--space-4);
  display: flex;
  gap: var(--space-2);
}

/* Featured variant */
.card-featured {
  border: 2px solid var(--color-primary);
  box-shadow: 0 10px 30px -10px var(--color-primary);
  position: relative;
}

.card-popular-badge {
  position: absolute;
  top: -0.75rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.25rem 0.75rem;
  font-size: var(--text-xs);
  font-weight: 600;
  border-radius: var(--radius-full);
  background: var(--color-primary);
  color: var(--color-bg);
  white-space: nowrap;
}

/* Glass variant */
.card-glass {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-color: rgba(255, 255, 255, 0.3);
}

/* Grid */
.card-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: var(--space-4);
}

@media (min-width: 640px) {
  .card-grid { grid-template-columns: repeat(2, 1fr); gap: var(--space-6); }
}

@media (min-width: 1024px) {
  .card-grid { grid-template-columns: repeat(3, 1fr); gap: var(--space-8); }
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  .card-glass {
    background: rgba(0, 0, 0, 0.4);
    border-color: rgba(255, 255, 255, 0.1);
  }
}
```
