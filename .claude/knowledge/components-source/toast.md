# Toast / Notification Component -- Production-Quality, Copy-Paste Ready

> Uses ONLY semantic design tokens. NEVER use `text-white`, `bg-gray-*`, `bg-blue-*`, etc.

---

## Option 1: Sonner Integration (Recommended for MVP/Production)

Sonner is a lightweight, beautiful toast library. Install via shadcn.

### Setup

```bash
npx shadcn@latest add sonner
```

### Add to Root Layout

```tsx
// src/app/layout.tsx
import { Toaster } from '@/components/ui/sonner'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            className: 'border-border bg-card text-card-foreground',
          }}
        />
      </body>
    </html>
  )
}
```

### Usage Patterns

```tsx
import { toast } from 'sonner'
import { CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'

// --- Basic variants ---

// Success
toast.success('Changes saved successfully')

// Error
toast.error('Failed to save changes. Please try again.')

// Warning
toast.warning('Your session will expire in 5 minutes')

// Info
toast.info('A new version is available')

// --- With description ---

toast.success('File uploaded', {
  description: 'profile-photo.jpg has been uploaded successfully.',
})

// --- With action button ---

toast('Item moved to trash', {
  action: {
    label: 'Undo',
    onClick: () => restoreItem(itemId),
  },
})

// --- Promise-based toast (loading, success, error) ---

async function saveData(data: FormData) {
  const promise = fetch('/api/save', {
    method: 'POST',
    body: data,
  })

  toast.promise(promise, {
    loading: 'Saving your changes...',
    success: 'All changes saved!',
    error: 'Failed to save. Please try again.',
  })
}

// --- Custom toast with icon ---

toast('New message from Sarah', {
  icon: <MessageCircle className="h-4 w-4 text-primary" />,
  description: 'Hey, can you review the latest design?',
  action: {
    label: 'View',
    onClick: () => router.push('/messages'),
  },
})

// --- Dismiss programmatically ---

const toastId = toast.loading('Processing...')
// later:
toast.dismiss(toastId)
// or update it:
toast.success('Done!', { id: toastId })

// --- Long-duration for important messages ---

toast.error('Payment failed', {
  duration: 10000, // 10 seconds
  description: 'Your card was declined. Please update your payment method.',
  action: {
    label: 'Update',
    onClick: () => router.push('/settings/billing'),
  },
})
```

### Sonner Theme Override (for consistent token usage)

```css
/* globals.css -- add these overrides to keep tokens consistent */
[data-sonner-toaster] [data-sonner-toast] {
  --normal-bg: hsl(var(--card));
  --normal-border: hsl(var(--border));
  --normal-text: hsl(var(--card-foreground));
}
```

---

## Option 2: Custom Toast System (No dependencies)

Use this when you need a zero-dependency toast system or for Simple scope projects.

### React + Tailwind Version

```tsx
// src/components/ui/toast.tsx
'use client'
import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
  type ReactNode,
} from 'react'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

// --- Types ---

type ToastVariant = 'success' | 'error' | 'warning' | 'info'

interface ToastData {
  id: string
  message: string
  description?: string
  variant: ToastVariant
  duration: number
  action?: { label: string; onClick: () => void }
}

interface ToastContextValue {
  toast: (message: string, options?: Partial<Omit<ToastData, 'id' | 'message'>>) => string
  success: (message: string, options?: Partial<Omit<ToastData, 'id' | 'message' | 'variant'>>) => string
  error: (message: string, options?: Partial<Omit<ToastData, 'id' | 'message' | 'variant'>>) => string
  warning: (message: string, options?: Partial<Omit<ToastData, 'id' | 'message' | 'variant'>>) => string
  info: (message: string, options?: Partial<Omit<ToastData, 'id' | 'message' | 'variant'>>) => string
  dismiss: (id: string) => void
}

// --- Icon + Style maps ---

const variantIcon: Record<ToastVariant, ReactNode> = {
  success: <CheckCircle className="h-5 w-5 text-primary" />,
  error:   <AlertCircle className="h-5 w-5 text-destructive" />,
  warning: <AlertTriangle className="h-5 w-5 text-warning" />,
  info:    <Info className="h-5 w-5 text-info" />,
}

const variantStyles: Record<ToastVariant, string> = {
  success: 'border-primary/20',
  error:   'border-destructive/20',
  warning: 'border-warning/20',
  info:    'border-info/20',
}

// --- Context ---

const ToastContext = createContext<ToastContextValue | null>(null)

// --- Provider ---

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback(
    (message: string, options: Partial<Omit<ToastData, 'id' | 'message'>> = {}): string => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`
      const duration = options.duration ?? 5000

      setToasts((prev) => [...prev, { id, message, variant: 'info', duration, ...options }])

      if (duration > 0) {
        setTimeout(() => dismiss(id), duration)
      }

      return id
    },
    [dismiss]
  )

  const contextValue: ToastContextValue = {
    toast: addToast,
    success: (msg, opts) => addToast(msg, { ...opts, variant: 'success' }),
    error:   (msg, opts) => addToast(msg, { ...opts, variant: 'error' }),
    warning: (msg, opts) => addToast(msg, { ...opts, variant: 'warning' }),
    info:    (msg, opts) => addToast(msg, { ...opts, variant: 'info' }),
    dismiss,
  }

  return (
    <ToastContext.Provider value={contextValue}>
      {children}

      {/* Toast container */}
      <div
        className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none"
        aria-live="polite"
        aria-label="Notifications"
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

// --- Individual toast item ---

function ToastItem({ toast: t, onDismiss }: { toast: ToastData; onDismiss: (id: string) => void }) {
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    if (t.duration <= 0) return
    const start = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - start
      const remaining = Math.max(0, 100 - (elapsed / t.duration) * 100)
      setProgress(remaining)
      if (remaining <= 0) clearInterval(interval)
    }, 50)
    return () => clearInterval(interval)
  }, [t.duration])

  return (
    <div
      className={cn(
        'pointer-events-auto w-80 max-w-[calc(100vw-2rem)] rounded-lg border bg-card shadow-lg',
        'animate-slide-in-right overflow-hidden',
        variantStyles[t.variant]
      )}
      role="status"
      aria-atomic="true"
    >
      <div className="flex items-start gap-3 px-4 py-3">
        {/* Icon */}
        <span className="mt-0.5 shrink-0" aria-hidden="true">
          {variantIcon[t.variant]}
        </span>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-card-foreground">{t.message}</p>
          {t.description && (
            <p className="mt-0.5 text-xs text-muted-foreground">{t.description}</p>
          )}
          {t.action && (
            <button
              onClick={() => {
                t.action!.onClick()
                onDismiss(t.id)
              }}
              className="mt-2 text-xs font-medium text-primary hover:text-primary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            >
              {t.action.label}
            </button>
          )}
        </div>

        {/* Close */}
        <button
          onClick={() => onDismiss(t.id)}
          className="shrink-0 rounded-md p-1 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Dismiss notification"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Progress bar */}
      {t.duration > 0 && (
        <div className="h-0.5 bg-muted">
          <div
            className={cn(
              'h-full transition-all ease-linear',
              t.variant === 'error'   ? 'bg-destructive' :
              t.variant === 'warning' ? 'bg-warning' :
              t.variant === 'success' ? 'bg-primary' :
              'bg-info'
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  )
}

// --- Hook ---

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}
```

### Usage (Custom Toast)

```tsx
// Wrap app in ToastProvider
// src/app/layout.tsx
import { ToastProvider } from '@/components/ui/toast'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  )
}

// Use in any component
import { useToast } from '@/components/ui/toast'

function SaveButton() {
  const { success, error } = useToast()

  async function handleSave() {
    try {
      await saveData()
      success('Saved successfully', { description: 'Your changes are live.' })
    } catch {
      error('Failed to save', {
        description: 'Please try again.',
        action: { label: 'Retry', onClick: handleSave },
      })
    }
  }

  return <Button onClick={handleSave}>Save</Button>
}
```

---

## HTML/CSS (Simple Scope)

```html
<!-- Toast container (add once at bottom of body) -->
<div class="toast-container" id="toast-container" aria-live="polite" aria-label="Notifications"></div>
```

```css
/* css/components/toast.css */

.toast-container {
  position: fixed;
  top: var(--space-4);
  right: var(--space-4);
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  pointer-events: none;
}

.toast {
  pointer-events: auto;
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  width: 20rem;
  max-width: calc(100vw - 2rem);
  padding: var(--space-3) var(--space-4);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  animation: toast-slide-in 0.3s ease-out;
  overflow: hidden;
  position: relative;
}

.toast-success { border-color: color-mix(in srgb, var(--color-success) 30%, transparent); }
.toast-error   { border-color: color-mix(in srgb, var(--color-error) 30%, transparent); }
.toast-warning { border-color: color-mix(in srgb, var(--color-warning) 30%, transparent); }
.toast-info    { border-color: color-mix(in srgb, var(--color-primary) 30%, transparent); }

.toast-icon {
  flex-shrink: 0;
  width: 1.25rem;
  height: 1.25rem;
  margin-top: 0.125rem;
}

.toast-success .toast-icon { color: var(--color-success); }
.toast-error .toast-icon   { color: var(--color-error); }
.toast-warning .toast-icon { color: var(--color-warning); }
.toast-info .toast-icon    { color: var(--color-primary); }

.toast-content { flex: 1; min-width: 0; }

.toast-message {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text);
  margin: 0;
}

.toast-description {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  margin-top: 0.125rem;
}

.toast-close {
  flex-shrink: 0;
  background: none;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  color: var(--color-text-muted);
  border-radius: var(--radius-sm);
  transition: color var(--transition-fast), background var(--transition-fast);
}

.toast-close:hover { color: var(--color-text); background: var(--color-bg-alt); }
.toast-close:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; }

.toast-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: var(--color-border);
  width: 100%;
}

.toast-progress-bar {
  height: 100%;
  transition: width 50ms linear;
}

.toast-success .toast-progress-bar { background: var(--color-success); }
.toast-error .toast-progress-bar   { background: var(--color-error); }
.toast-warning .toast-progress-bar { background: var(--color-warning); }
.toast-info .toast-progress-bar    { background: var(--color-primary); }

.toast-exiting {
  animation: toast-slide-out 0.2s ease-in forwards;
}

@keyframes toast-slide-in {
  from { opacity: 0; transform: translateX(100%); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes toast-slide-out {
  from { opacity: 1; transform: translateX(0); }
  to { opacity: 0; transform: translateX(100%); }
}
```

```js
// js/toast.js

const ToastManager = (function () {
  const container = document.getElementById('toast-container')
  const icons = {
    success: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    error:   '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
    warning: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    info:    '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
  }

  function show(message, options = {}) {
    const { variant = 'info', description = '', duration = 5000 } = options

    const el = document.createElement('div')
    el.className = `toast toast-${variant}`
    el.setAttribute('role', 'status')
    el.setAttribute('aria-atomic', 'true')

    el.innerHTML = `
      ${icons[variant]}
      <div class="toast-content">
        <p class="toast-message">${message}</p>
        ${description ? `<p class="toast-description">${description}</p>` : ''}
      </div>
      <button class="toast-close" aria-label="Dismiss">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      ${duration > 0 ? '<div class="toast-progress"><div class="toast-progress-bar" style="width:100%"></div></div>' : ''}
    `

    container.appendChild(el)

    // Close button
    el.querySelector('.toast-close').addEventListener('click', () => dismiss(el))

    // Progress bar + auto-dismiss
    if (duration > 0) {
      const bar = el.querySelector('.toast-progress-bar')
      const start = Date.now()
      const interval = setInterval(() => {
        const pct = Math.max(0, 100 - ((Date.now() - start) / duration) * 100)
        bar.style.width = pct + '%'
        if (pct <= 0) { clearInterval(interval); dismiss(el) }
      }, 50)
    }
  }

  function dismiss(el) {
    el.classList.add('toast-exiting')
    el.addEventListener('animationend', () => el.remove())
  }

  return {
    success: (msg, opts) => show(msg, { ...opts, variant: 'success' }),
    error:   (msg, opts) => show(msg, { ...opts, variant: 'error' }),
    warning: (msg, opts) => show(msg, { ...opts, variant: 'warning' }),
    info:    (msg, opts) => show(msg, { ...opts, variant: 'info' }),
  }
})()

// Usage in Simple scope:
// ToastManager.success('Saved!', { description: 'Your changes are live.' })
// ToastManager.error('Failed to save')
// ToastManager.warning('Session expiring soon')
// ToastManager.info('New update available')
```
