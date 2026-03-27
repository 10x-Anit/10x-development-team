# Loading States — Complete Skeleton & Spinner Patterns

Every component that displays async data MUST have a matching loading skeleton. Never show a blank screen.

---

## 1. Base Skeleton Component

```tsx
// src/components/ui/skeleton.tsx
import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('animate-pulse rounded-md bg-muted', className)} />
  )
}
```

---

## 2. Card Skeleton

```tsx
export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-4">
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-10 w-28 mt-2" />
    </div>
  )
}

export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}
```

---

## 3. Table Skeleton

```tsx
export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="flex gap-4 border-b border-border bg-muted/50 px-6 py-3">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} className="flex gap-4 border-b border-border px-6 py-4 last:border-0">
          {Array.from({ length: cols }).map((_, colIdx) => (
            <Skeleton key={colIdx} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}
```

---

## 4. List Skeleton

```tsx
export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 rounded-lg border border-border bg-card p-4">
          <Skeleton className="h-10 w-10 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-2/3" />
          </div>
          <Skeleton className="h-8 w-20" />
        </div>
      ))}
    </div>
  )
}
```

---

## 5. Form Skeleton

```tsx
export function FormSkeleton({ fields = 4 }: { fields?: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-1.5">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <Skeleton className="h-10 w-32 mt-2" />
    </div>
  )
}
```

---

## 6. Profile / Avatar Skeleton

```tsx
export function ProfileSkeleton() {
  return (
    <div className="flex items-center gap-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-48" />
      </div>
    </div>
  )
}
```

---

## 7. Hero Skeleton

```tsx
export function HeroSkeleton() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="mx-auto max-w-3xl space-y-6 text-center">
        <Skeleton className="mx-auto h-4 w-32" />
        <Skeleton className="mx-auto h-12 w-3/4" />
        <Skeleton className="mx-auto h-6 w-2/3" />
        <div className="flex justify-center gap-4 pt-4">
          <Skeleton className="h-12 w-36 rounded-xl" />
          <Skeleton className="h-12 w-36 rounded-xl" />
        </div>
      </div>
    </div>
  )
}
```

---

## 8. Stats / Dashboard Skeleton

```tsx
export function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-3">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-3 w-16" />
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Stats row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
      {/* Chart area */}
      <div className="rounded-xl border border-border bg-card p-6">
        <Skeleton className="h-4 w-32 mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
      {/* Table */}
      <TableSkeleton rows={5} cols={5} />
    </div>
  )
}
```

---

## 9. Inline Spinner

```tsx
import { Loader2 } from 'lucide-react'

// Small inline spinner
<Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />

// Button spinner
<Button loading>Saving...</Button>

// Full-page centered spinner
export function PageSpinner() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}
```

---

## 10. Next.js Loading Files

```tsx
// src/app/dashboard/loading.tsx
import { DashboardSkeleton } from '@/components/skeletons/dashboard-skeleton'

export default function DashboardLoading() {
  return <DashboardSkeleton />
}

// src/app/products/loading.tsx
import { CardGridSkeleton } from '@/components/skeletons/card-skeleton'

export default function ProductsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <Skeleton className="h-10 w-48 mb-8" />
      <CardGridSkeleton count={6} />
    </div>
  )
}
```

---

## Rules

1. **Shape must match content** — A card skeleton should look like a card. A table skeleton should look like a table.
2. **Width variation** — Vary skeleton widths (`w-1/3`, `w-2/3`, `w-full`) to look like real text of different lengths.
3. **Never use fixed heights for text** — Use `h-4` for body text, `h-5` for titles, `h-3` for small text.
4. **Include in every Next.js route** — Create `loading.tsx` for every route that fetches data.
5. **Rounded corners match component** — Card skeleton uses `rounded-xl`, badge skeleton uses `rounded-full`.
6. **Color: bg-muted only** — Never use `bg-gray-*` for skeletons. Always `bg-muted`.
