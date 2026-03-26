# Button Component -- Production-Quality, Copy-Paste Ready

> Uses ONLY semantic design tokens. NEVER use `text-white`, `bg-blue-*`, `bg-gray-*`, etc.

---

## React + Tailwind (MVP/Production Scope)

### Core Button Component

```tsx
// src/components/ui/button.tsx
import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

// --- Variant and Size Maps ---

const variantStyles = {
  primary:
    'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 active:scale-[0.98]',
  secondary:
    'bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-[0.98]',
  outline:
    'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
  ghost:
    'hover:bg-accent hover:text-accent-foreground',
  destructive:
    'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 active:scale-[0.98]',
  link:
    'text-primary underline-offset-4 hover:underline p-0 h-auto',
  gradient:
    'bg-primary text-primary-foreground shadow-elegant hover:shadow-glow active:scale-[0.98] shine-on-hover',
  glass:
    'bg-background/60 backdrop-blur-md border border-border/50 text-foreground hover:bg-background/80',
} as const

const sizeStyles = {
  sm:   'h-8 px-3 text-xs gap-1.5 rounded-md',
  md:   'h-10 px-4 text-sm gap-2 rounded-md',
  lg:   'h-12 px-6 text-base gap-2.5 rounded-lg',
  xl:   'h-14 px-8 text-lg gap-3 rounded-lg',
  icon: 'h-10 w-10 rounded-md',
} as const

// --- TypeScript Interface ---

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style of the button */
  variant?: keyof typeof variantStyles
  /** Size preset */
  size?: keyof typeof sizeStyles
  /** Show a loading spinner and disable interaction */
  loading?: boolean
  /** Icon element to render before children */
  iconLeft?: React.ReactNode
  /** Icon element to render after children */
  iconRight?: React.ReactNode
  /** Render as full width */
  fullWidth?: boolean
}

// --- Component ---

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled,
      iconLeft,
      iconRight,
      fullWidth,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          // Base styles -- always applied
          'inline-flex items-center justify-center font-medium',
          'transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          'disabled:pointer-events-none disabled:opacity-50',
          // Variant + Size
          variantStyles[variant],
          sizeStyles[size],
          // Full width
          fullWidth && 'w-full',
          className
        )}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden="true" />
        ) : iconLeft ? (
          <span className="shrink-0" aria-hidden="true">{iconLeft}</span>
        ) : null}

        {/* Hide text visually during loading for icon-only buttons */}
        {size === 'icon' ? (
          <span className="sr-only">{children}</span>
        ) : (
          children
        )}

        {iconRight && !loading && (
          <span className="shrink-0" aria-hidden="true">{iconRight}</span>
        )}
      </button>
    )
  }
)
Button.displayName = 'Button'
```

### Button Group Composition

```tsx
// src/components/ui/button-group.tsx
import { cn } from '@/lib/utils'

interface ButtonGroupProps {
  children: React.ReactNode
  className?: string
  /** Stack vertically on mobile, horizontal on desktop */
  responsive?: boolean
}

export function ButtonGroup({ children, className, responsive = false }: ButtonGroupProps) {
  return (
    <div
      className={cn(
        'inline-flex gap-2',
        responsive && 'flex-col sm:flex-row',
        className
      )}
      role="group"
    >
      {children}
    </div>
  )
}
```

### Framer Motion Enhanced Button (LARGE context / Production)

```tsx
// src/components/ui/motion-button.tsx
'use client'
import { forwardRef } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const variantStyles = {
  primary:
    'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90',
  secondary:
    'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  outline:
    'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
  ghost:
    'hover:bg-accent hover:text-accent-foreground',
  destructive:
    'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
  gradient:
    'bg-primary text-primary-foreground shadow-elegant hover:shadow-glow shine-on-hover',
  glass:
    'bg-background/60 backdrop-blur-md border border-border/50 text-foreground hover:bg-background/80',
} as const

const sizeStyles = {
  sm:   'h-8 px-3 text-xs gap-1.5 rounded-md',
  md:   'h-10 px-4 text-sm gap-2 rounded-md',
  lg:   'h-12 px-6 text-base gap-2.5 rounded-lg',
  xl:   'h-14 px-8 text-lg gap-3 rounded-lg',
  icon: 'h-10 w-10 rounded-md',
} as const

interface MotionButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: keyof typeof variantStyles
  size?: keyof typeof sizeStyles
  loading?: boolean
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
  fullWidth?: boolean
  children?: React.ReactNode
}

export const MotionButton = forwardRef<HTMLButtonElement, MotionButtonProps>(
  ({ variant = 'primary', size = 'md', loading, disabled, iconLeft, iconRight, fullWidth, children, className, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        disabled={disabled || loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        className={cn(
          'inline-flex items-center justify-center font-medium',
          'transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          'disabled:pointer-events-none disabled:opacity-50',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className
        )}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden="true" />}
        {!loading && iconLeft && <span className="shrink-0" aria-hidden="true">{iconLeft}</span>}
        {children}
        {!loading && iconRight && <span className="shrink-0" aria-hidden="true">{iconRight}</span>}
      </motion.button>
    )
  }
)
MotionButton.displayName = 'MotionButton'
```

### Skeleton Loader

```tsx
function ButtonSkeleton({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const heights = { sm: 'h-8 w-20', md: 'h-10 w-28', lg: 'h-12 w-36' }
  return <div className={cn('animate-pulse rounded-md bg-muted', heights[size])} />
}
```

### Usage Examples

```tsx
import { Button } from '@/components/ui/button'
import { Plus, ArrowRight, Trash2, Settings } from 'lucide-react'

{/* Primary action */}
<Button>Get Started</Button>

{/* With left icon */}
<Button iconLeft={<Plus className="h-4 w-4" />}>Add Item</Button>

{/* With right icon */}
<Button variant="outline" iconRight={<ArrowRight className="h-4 w-4" />}>
  Continue
</Button>

{/* Loading state */}
<Button loading>Saving...</Button>

{/* Destructive */}
<Button variant="destructive" iconLeft={<Trash2 className="h-4 w-4" />}>
  Delete
</Button>

{/* Gradient (hero CTA) */}
<Button variant="gradient" size="lg">Start Free Trial</Button>

{/* Glass (over images/gradients) */}
<Button variant="glass">Learn More</Button>

{/* Icon-only */}
<Button variant="ghost" size="icon" aria-label="Settings">
  <Settings className="h-5 w-5" />
</Button>

{/* Full-width on mobile */}
<Button fullWidth className="sm:w-auto">Submit</Button>

{/* Button group */}
<ButtonGroup responsive>
  <Button variant="outline">Cancel</Button>
  <Button>Confirm</Button>
</ButtonGroup>
```

---

## HTML/CSS (Simple Scope)

```html
<!-- Buttons use CSS custom properties from the design system -->
<button class="btn btn-primary">Primary</button>
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-outline">Outline</button>
<button class="btn btn-ghost">Ghost</button>
<button class="btn btn-destructive">Delete</button>
<button class="btn btn-gradient">Get Started</button>
<button class="btn btn-glass">Learn More</button>

<!-- With icon -->
<button class="btn btn-primary">
  <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
  Add Item
</button>

<!-- Loading state -->
<button class="btn btn-primary btn-loading" disabled>
  <svg class="btn-spinner" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity="0.25"/><path fill="currentColor" opacity="0.75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
  Saving...
</button>

<!-- Icon-only -->
<button class="btn btn-ghost btn-icon-only" aria-label="Settings">
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
</button>

<!-- Sizes -->
<button class="btn btn-primary btn-sm">Small</button>
<button class="btn btn-primary">Default</button>
<button class="btn btn-primary btn-lg">Large</button>
<button class="btn btn-primary btn-xl">Extra Large</button>
```

```css
/* css/components/button.css -- uses design system tokens from :root */

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  font-family: var(--font-sans);
  font-weight: 500;
  font-size: var(--text-sm);
  line-height: 1;
  padding: var(--space-2) var(--space-4);
  height: 2.5rem;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background-color var(--transition-fast),
              color var(--transition-fast),
              box-shadow var(--transition-fast),
              transform var(--transition-fast);
  text-decoration: none;
}

.btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.btn:active:not(:disabled) {
  transform: scale(0.98);
}

/* Variants */
.btn-primary {
  background: var(--color-primary);
  color: var(--color-bg);
  box-shadow: var(--shadow-sm);
}
.btn-primary:hover:not(:disabled) {
  background: var(--color-primary-hover);
}

.btn-secondary {
  background: var(--color-bg-alt);
  color: var(--color-text);
}
.btn-secondary:hover:not(:disabled) {
  background: var(--color-border);
}

.btn-outline {
  background: transparent;
  color: var(--color-text);
  border: 1px solid var(--color-border);
}
.btn-outline:hover:not(:disabled) {
  background: var(--color-bg-alt);
}

.btn-ghost {
  background: transparent;
  color: var(--color-text-muted);
}
.btn-ghost:hover:not(:disabled) {
  background: var(--color-bg-alt);
  color: var(--color-text);
}

.btn-destructive {
  background: var(--color-error);
  color: var(--color-bg);
}
.btn-destructive:hover:not(:disabled) {
  filter: brightness(0.9);
}

.btn-gradient {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-hover));
  color: var(--color-bg);
  box-shadow: 0 10px 30px -10px var(--color-primary);
}
.btn-gradient:hover:not(:disabled) {
  box-shadow: 0 0 40px var(--color-primary);
}

.btn-glass {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--color-border);
  color: var(--color-text);
}
.btn-glass:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.8);
}

/* Sizes */
.btn-sm  { height: 2rem; padding: var(--space-1) var(--space-3); font-size: var(--text-xs); }
.btn-lg  { height: 3rem; padding: var(--space-3) var(--space-6); font-size: var(--text-base); border-radius: var(--radius-lg); }
.btn-xl  { height: 3.5rem; padding: var(--space-3) var(--space-8); font-size: var(--text-lg); border-radius: var(--radius-lg); }

/* Icon only */
.btn-icon-only { width: 2.5rem; padding: 0; }
.btn-icon-only.btn-sm { width: 2rem; height: 2rem; }
.btn-icon-only.btn-lg { width: 3rem; height: 3rem; }

/* Icons inside buttons */
.btn-icon { width: 1em; height: 1em; flex-shrink: 0; }

/* Loading */
.btn-loading { position: relative; }
.btn-spinner {
  width: 1em;
  height: 1em;
  flex-shrink: 0;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  .btn-glass {
    background: rgba(0, 0, 0, 0.4);
  }
  .btn-glass:hover:not(:disabled) {
    background: rgba(0, 0, 0, 0.6);
  }
}
```
