# Error Handling — Unified Patterns

Every app needs consistent error handling. These patterns cover: error boundaries, API error mapping, toast notifications on errors, retry logic, and user-friendly error states.

---

## 1. Error Boundary (Next.js App Router)

### Route-Level Error Boundary
```tsx
// src/app/dashboard/error.tsx
'use client'

import { useEffect } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log to error tracking (Sentry, etc.)
    console.error('Dashboard error:', error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="text-2xl font-semibold text-foreground">Something went wrong</h2>
        <p className="mt-2 max-w-md text-muted-foreground">
          We encountered an unexpected error. Please try again or contact support if the problem persists.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98]"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center rounded-lg border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  )
}
```

### Global Error Boundary
```tsx
// src/app/global-error.tsx
'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center px-4">
          <h1 className="text-3xl font-bold text-foreground">Something went wrong</h1>
          <p className="mt-2 text-muted-foreground">An unexpected error occurred.</p>
          <button
            onClick={reset}
            className="mt-6 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
```

---

## 2. API Error Response Format

### Consistent Shape
```tsx
// EVERY API route returns this shape:
type ApiResponse<T> = {
  data: T | null
  error: {
    message: string      // User-friendly message
    code?: string        // Machine-readable code (e.g., 'VALIDATION_ERROR')
    details?: unknown    // Zod errors, field-level errors, etc.
  } | null
}

// Success:  { data: {...}, error: null }
// Failure:  { data: null, error: { message: '...' } }
```

### API Route Error Handler
```tsx
// src/lib/api-error.ts
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string,
    public details?: unknown
  ) {
    super(message)
  }
}

export function handleApiError(error: unknown) {
  if (error instanceof ApiError) {
    return Response.json(
      { data: null, error: { message: error.message, code: error.code, details: error.details } },
      { status: error.statusCode }
    )
  }

  console.error('Unexpected API error:', error)
  return Response.json(
    { data: null, error: { message: 'An unexpected error occurred', code: 'INTERNAL_ERROR' } },
    { status: 500 }
  )
}

// Usage in API route:
export async function POST(req: NextRequest) {
  try {
    // ... logic
  } catch (error) {
    return handleApiError(error)
  }
}
```

---

## 3. Client-Side Error Handling

### Fetch Wrapper with Error Handling
```tsx
// src/lib/fetch.ts
export async function apiFetch<T>(
  url: string,
  options?: RequestInit
): Promise<{ data: T; error: null } | { data: null; error: string }> {
  try {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      ...options,
    })

    const json = await res.json()

    if (!res.ok || json.error) {
      return { data: null, error: json.error?.message || `Request failed (${res.status})` }
    }

    return { data: json.data, error: null }
  } catch (err) {
    return { data: null, error: 'Network error. Please check your connection.' }
  }
}
```

### Toast on Error Pattern
```tsx
import { toast } from 'sonner'

async function handleAction() {
  const { data, error } = await apiFetch('/api/action', { method: 'POST', body: JSON.stringify(payload) })

  if (error) {
    toast.error('Action failed', { description: error })
    return
  }

  toast.success('Action completed')
}
```

---

## 4. Retry Logic

### Retry with Exponential Backoff
```tsx
export async function fetchWithRetry<T>(
  url: string,
  options?: RequestInit,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const res = await fetch(url, options)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return await res.json()
    } catch (err) {
      lastError = err as Error

      // Don't retry client errors (4xx)
      if (err instanceof Error && err.message.includes('4')) throw err

      // Exponential backoff: 1s, 2s, 4s
      if (attempt < maxRetries - 1) {
        await new Promise(r => setTimeout(r, baseDelay * Math.pow(2, attempt)))
      }
    }
  }

  throw lastError || new Error('Max retries exceeded')
}
```

### Retry Button Component
```tsx
interface RetryErrorProps {
  message: string
  onRetry: () => void
  retrying?: boolean
}

export function RetryError({ message, onRetry, retrying }: RetryErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-destructive/10 p-3 mb-4">
        <AlertCircle className="h-6 w-6 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">Something went wrong</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{message}</p>
      <button
        onClick={onRetry}
        disabled={retrying}
        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {retrying ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCw className="h-4 w-4" />
        )}
        {retrying ? 'Retrying...' : 'Try again'}
      </button>
    </div>
  )
}
```

---

## 5. Form Error Handling

### Field-Level Errors (react-hook-form + zod)
```tsx
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
})

<div className="space-y-1.5">
  <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
  <input
    {...register('email')}
    id="email"
    aria-invalid={!!errors.email}
    aria-describedby={errors.email ? 'email-error' : undefined}
    className={cn(
      'flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      errors.email ? 'border-destructive focus-visible:ring-destructive' : 'border-input'
    )}
  />
  {errors.email && (
    <p id="email-error" className="text-xs text-destructive" role="alert">
      {errors.email.message}
    </p>
  )}
</div>
```

### Form-Level Error (server returned error)
```tsx
{serverError && (
  <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4" role="alert">
    <div className="flex items-center gap-3">
      <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
      <p className="text-sm text-destructive">{serverError}</p>
    </div>
  </div>
)}
```

---

## 6. Loading/Error/Empty State Pattern

### The Three-State Component Pattern
```tsx
interface DataViewProps<T> {
  data: T[] | null
  loading: boolean
  error: string | null
  onRetry?: () => void
  emptyIcon?: React.ReactNode
  emptyTitle?: string
  emptyDescription?: string
  emptyAction?: { label: string; onClick: () => void }
  skeleton: React.ReactNode
  children: (data: T[]) => React.ReactNode
}

export function DataView<T>({
  data,
  loading,
  error,
  onRetry,
  emptyIcon,
  emptyTitle = 'No items yet',
  emptyDescription = 'Get started by creating your first item.',
  emptyAction,
  skeleton,
  children,
}: DataViewProps<T>) {
  if (loading) return <>{skeleton}</>

  if (error) return <RetryError message={error} onRetry={onRetry || (() => window.location.reload())} />

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        {emptyIcon && (
          <div className="rounded-full bg-muted p-4 mb-4">{emptyIcon}</div>
        )}
        <h3 className="text-lg font-semibold text-foreground">{emptyTitle}</h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">{emptyDescription}</p>
        {emptyAction && (
          <button
            onClick={emptyAction.onClick}
            className="mt-6 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {emptyAction.label}
          </button>
        )}
      </div>
    )
  }

  return <>{children(data)}</>
}
```

---

## Error Type Mapping

| HTTP Status | User Message | Toast Type |
|-------------|-------------|------------|
| 400 | "Please check your input and try again." | error |
| 401 | "Please sign in to continue." | warning |
| 403 | "You don't have permission to do that." | error |
| 404 | "The item you're looking for doesn't exist." | error |
| 409 | "This item already exists." | warning |
| 429 | "Too many requests. Please wait a moment." | warning |
| 500 | "Something went wrong. Please try again." | error |
| Network | "Connection lost. Please check your internet." | error |
