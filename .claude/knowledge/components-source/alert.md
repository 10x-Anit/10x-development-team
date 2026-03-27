# Alert / Banner Component — Copy-Paste Ready

> Uses ONLY semantic design tokens. Supports info, success, warning, error variants.

---

## React + Tailwind

```tsx
// src/components/ui/alert.tsx
import { cn } from '@/lib/utils'
import { Info, CheckCircle, AlertTriangle, AlertCircle, X } from 'lucide-react'

const variants = {
  info: {
    container: 'border-primary/30 bg-primary/5',
    icon: 'text-primary',
    title: 'text-primary',
    description: 'text-primary/80',
    iconComponent: Info,
  },
  success: {
    container: 'border-success/30 bg-success/5',
    icon: 'text-success',
    title: 'text-success',
    description: 'text-success/80',
    iconComponent: CheckCircle,
  },
  warning: {
    container: 'border-warning/30 bg-warning/5',
    icon: 'text-warning',
    title: 'text-warning',
    description: 'text-warning/80',
    iconComponent: AlertTriangle,
  },
  error: {
    container: 'border-destructive/30 bg-destructive/5',
    icon: 'text-destructive',
    title: 'text-destructive',
    description: 'text-destructive/80',
    iconComponent: AlertCircle,
  },
} as const

export interface AlertProps {
  variant?: keyof typeof variants
  title?: string
  children: React.ReactNode
  dismissible?: boolean
  onDismiss?: () => void
  icon?: React.ReactNode
  action?: React.ReactNode
  className?: string
}

export function Alert({
  variant = 'info',
  title,
  children,
  dismissible,
  onDismiss,
  icon,
  action,
  className,
}: AlertProps) {
  const style = variants[variant]
  const IconComponent = style.iconComponent

  return (
    <div
      role="alert"
      className={cn(
        'rounded-lg border p-4',
        style.container,
        className,
      )}
    >
      <div className="flex gap-3">
        {/* Icon */}
        <div className="shrink-0 pt-0.5">
          {icon || <IconComponent className={cn('h-5 w-5', style.icon)} />}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className={cn('text-sm font-semibold', style.title)}>
              {title}
            </h4>
          )}
          <div className={cn('text-sm', title && 'mt-1', style.description)}>
            {children}
          </div>
          {action && <div className="mt-3">{action}</div>}
        </div>

        {/* Dismiss */}
        {dismissible && (
          <button
            type="button"
            onClick={onDismiss}
            className={cn(
              'shrink-0 rounded-md p-1 transition-colors hover:bg-foreground/10',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              style.icon,
            )}
            aria-label="Dismiss alert"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}
```

### Usage
```tsx
import { Alert } from '@/components/ui/alert'

{/* Info */}
<Alert variant="info" title="New feature available">
  Check out the new dashboard widgets in Settings.
</Alert>

{/* Success */}
<Alert variant="success" title="Payment successful">
  Your subscription has been renewed.
</Alert>

{/* Warning */}
<Alert variant="warning" title="Storage almost full">
  You've used 90% of your storage. Consider upgrading your plan.
</Alert>

{/* Error */}
<Alert variant="error" title="Connection lost">
  Unable to connect to the server. Please check your internet connection.
</Alert>

{/* Dismissible */}
<Alert variant="info" dismissible onDismiss={() => setVisible(false)}>
  This alert can be dismissed.
</Alert>

{/* With action */}
<Alert
  variant="warning"
  title="Subscription expiring"
  action={
    <button className="rounded-md bg-warning/20 px-3 py-1 text-sm font-medium text-warning transition-colors hover:bg-warning/30">
      Renew now
    </button>
  }
>
  Your subscription expires in 3 days.
</Alert>
```

---

## HTML/CSS (Simple Scope)

```html
<div class="alert alert-info" role="alert">
  <svg class="alert-icon">...</svg>
  <div class="alert-content">
    <strong class="alert-title">Info</strong>
    <p>This is an informational alert.</p>
  </div>
</div>

<div class="alert alert-success" role="alert">...</div>
<div class="alert alert-warning" role="alert">...</div>
<div class="alert alert-error" role="alert">...</div>
```

```css
.alert {
  display: flex;
  gap: var(--space-3);
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  border: 1px solid;
}
.alert-icon { width: 1.25rem; height: 1.25rem; flex-shrink: 0; margin-top: 0.125rem; }
.alert-title { font-size: var(--text-sm); font-weight: 600; }
.alert-content p { font-size: var(--text-sm); margin-top: var(--space-1); }

.alert-info    { border-color: color-mix(in srgb, var(--color-primary) 30%, transparent); background: color-mix(in srgb, var(--color-primary) 5%, transparent); }
.alert-info .alert-icon, .alert-info .alert-title { color: var(--color-primary); }
.alert-info p { color: color-mix(in srgb, var(--color-primary) 80%, transparent); }

.alert-success { border-color: color-mix(in srgb, var(--color-success) 30%, transparent); background: color-mix(in srgb, var(--color-success) 5%, transparent); }
.alert-success .alert-icon, .alert-success .alert-title { color: var(--color-success); }

.alert-warning { border-color: color-mix(in srgb, var(--color-warning) 30%, transparent); background: color-mix(in srgb, var(--color-warning) 5%, transparent); }
.alert-warning .alert-icon, .alert-warning .alert-title { color: var(--color-warning); }

.alert-error   { border-color: color-mix(in srgb, var(--color-error) 30%, transparent); background: color-mix(in srgb, var(--color-error) 5%, transparent); }
.alert-error .alert-icon, .alert-error .alert-title { color: var(--color-error); }
```
