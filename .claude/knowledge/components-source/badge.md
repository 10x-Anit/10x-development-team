# Badge / Tag Component — Copy-Paste Ready

> Uses ONLY semantic design tokens.

---

## React + Tailwind

```tsx
// src/components/ui/badge.tsx
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

const variants = {
  default:     'bg-primary/10 text-primary border-primary/20',
  secondary:   'bg-secondary text-secondary-foreground border-secondary',
  success:     'bg-success/10 text-success border-success/20',
  warning:     'bg-warning/10 text-warning border-warning/20',
  destructive: 'bg-destructive/10 text-destructive border-destructive/20',
  outline:     'bg-transparent text-foreground border-border',
  muted:       'bg-muted text-muted-foreground border-transparent',
} as const

const sizes = {
  sm: 'h-5 px-1.5 text-[10px] gap-1',
  md: 'h-6 px-2.5 text-xs gap-1.5',
  lg: 'h-7 px-3 text-sm gap-2',
} as const

export interface BadgeProps {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
  removable?: boolean
  onRemove?: () => void
  icon?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function Badge({
  variant = 'default',
  size = 'md',
  removable,
  onRemove,
  icon,
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-medium leading-none whitespace-nowrap transition-colors',
        variants[variant],
        sizes[size],
        className,
      )}
    >
      {icon && <span className="shrink-0" aria-hidden="true">{icon}</span>}
      {children}
      {removable && (
        <button
          type="button"
          onClick={onRemove}
          className="shrink-0 rounded-full p-0.5 transition-colors hover:bg-foreground/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          aria-label={`Remove ${children}`}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  )
}
```

### Usage
```tsx
<Badge>Default</Badge>
<Badge variant="success">Active</Badge>
<Badge variant="destructive">Overdue</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="outline">Draft</Badge>
<Badge variant="muted" size="sm">v2.0</Badge>
<Badge removable onRemove={() => {}}>React</Badge>
```

---

## HTML/CSS (Simple Scope)

```html
<span class="badge badge-primary">Default</span>
<span class="badge badge-success">Active</span>
<span class="badge badge-error">Overdue</span>
<span class="badge badge-warning">Pending</span>
<span class="badge badge-outline">Draft</span>
```

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.625rem;
  font-size: var(--text-xs);
  font-weight: 500;
  line-height: 1;
  border-radius: 9999px;
  border: 1px solid transparent;
  white-space: nowrap;
}
.badge-primary { background: color-mix(in srgb, var(--color-primary) 10%, transparent); color: var(--color-primary); border-color: color-mix(in srgb, var(--color-primary) 20%, transparent); }
.badge-success { background: color-mix(in srgb, var(--color-success) 10%, transparent); color: var(--color-success); border-color: color-mix(in srgb, var(--color-success) 20%, transparent); }
.badge-error { background: color-mix(in srgb, var(--color-error) 10%, transparent); color: var(--color-error); border-color: color-mix(in srgb, var(--color-error) 20%, transparent); }
.badge-warning { background: color-mix(in srgb, var(--color-warning) 10%, transparent); color: var(--color-warning); border-color: color-mix(in srgb, var(--color-warning) 20%, transparent); }
.badge-outline { background: transparent; color: var(--color-text); border-color: var(--color-border); }
```
