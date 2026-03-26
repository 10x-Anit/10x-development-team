# React Component Patterns — Comprehensive Reference

> All components use semantic design tokens. NEVER hardcode colors.
> All base components use forwardRef. All interactive elements have focus indicators and transitions.

---

## Component File Organization

```
src/components/
  ui/                  Base primitives (button, input, badge, skeleton)
  layout/              Layout components (navbar, sidebar, footer, container)
  [feature-name].tsx   Feature-specific components (pricing-card, testimonial-card)
  providers.tsx        Client-side providers (theme, toast, etc.)

src/app/
  page.tsx             Pages import components, never define them inline
  layout.tsx           Root layout with providers
```

Rules:
- ONE component per file (plus sub-components for compound patterns)
- File name matches the component: `pricing-card.tsx` exports `PricingCard`
- NEVER define reusable components inside page files
- ALWAYS export with a named export (not default) for non-page components

---

## Proper Prop Interfaces with TypeScript

Every component MUST have a typed props interface.

```tsx
// Simple props
interface BadgeProps {
  label: string
  variant?: "default" | "primary" | "destructive"
  size?: "sm" | "md"
}

export function Badge({ label, variant = "default", size = "sm" }: BadgeProps) {
  return (
    <span className={cn(
      "inline-flex items-center rounded-full font-medium",
      size === "sm" && "px-2 py-0.5 text-xs",
      size === "md" && "px-2.5 py-1 text-sm",
      variant === "default" && "bg-secondary text-secondary-foreground",
      variant === "primary" && "bg-primary/10 text-primary",
      variant === "destructive" && "bg-destructive/10 text-destructive",
    )}>
      {label}
    </span>
  )
}

// Props that extend HTML attributes
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "interactive" | "featured"
}

export function Card({ variant = "default", className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-6",
        variant === "default" && "shadow-sm",
        variant === "interactive" && "shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer",
        variant === "featured" && "border-2 border-primary shadow-elegant ring-1 ring-primary/10",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
```

---

## forwardRef Pattern (All Base Components)

Every base/primitive component MUST use `forwardRef` so parent components can attach refs.

```tsx
import { forwardRef } from "react"
import { cn } from "@/lib/utils"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  description?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, description, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-")
    const errorId = error ? `${inputId}-error` : undefined
    const descId = description ? `${inputId}-desc` : undefined

    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium leading-none text-foreground">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
            "placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "transition-colors",
            error && "border-destructive focus-visible:ring-destructive",
            className,
          )}
          aria-invalid={error ? true : undefined}
          aria-describedby={[errorId, descId].filter(Boolean).join(" ") || undefined}
          {...props}
        />
        {description && !error && (
          <p id={descId} className="text-xs text-muted-foreground">{description}</p>
        )}
        {error && (
          <p id={errorId} className="text-xs text-destructive" role="alert">{error}</p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
```

### forwardRef Button
```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive"
  size?: "sm" | "md" | "lg" | "icon"
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, className, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          // Variants
          variant === "primary" && "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 active:scale-[0.98]",
          variant === "secondary" && "bg-secondary text-secondary-foreground hover:bg-secondary/80",
          variant === "outline" && "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
          variant === "ghost" && "hover:bg-accent hover:text-accent-foreground",
          variant === "destructive" && "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
          // Sizes
          size === "sm" && "h-8 px-3 text-xs rounded-md",
          size === "md" && "h-10 px-4 text-sm rounded-md",
          size === "lg" && "h-12 px-6 text-base rounded-lg",
          size === "icon" && "h-10 w-10 rounded-md",
          className,
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading...</span>
          </>
        ) : (
          children
        )}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button }
```

---

## Component Composition Patterns

### Children + Slots Pattern
```tsx
interface SectionProps {
  title: string
  description?: string
  children: React.ReactNode
  action?: React.ReactNode       // Slot for top-right action
  footer?: React.ReactNode       // Slot for bottom content
}

export function Section({ title, description, children, action, footer }: SectionProps) {
  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
              {title}
            </h2>
            {description && (
              <p className="mt-2 text-lg text-muted-foreground">{description}</p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
        {children}
        {footer && <div className="mt-10">{footer}</div>}
      </div>
    </section>
  )
}

// Usage
<Section
  title="Recent Projects"
  description="Browse our latest work"
  action={<Button variant="outline">View All</Button>}
>
  <ProjectGrid projects={projects} />
</Section>
```

### Render Prop Pattern (When Children Need Data)
```tsx
interface DataListProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  emptyMessage?: string
  className?: string
}

export function DataList<T>({ items, renderItem, emptyMessage = "No items", className }: DataListProps<T>) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      {items.map((item, index) => renderItem(item, index))}
    </div>
  )
}
```

---

## Compound Components (Tabs, Accordion, etc.)

Compound components share state through context. Each sub-component handles one concern.

```tsx
"use client"
import { createContext, useContext, useState } from "react"

// Context
interface TabsContextValue {
  activeTab: string
  setActiveTab: (tab: string) => void
}

const TabsContext = createContext<TabsContextValue | null>(null)

function useTabs() {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error("Tabs components must be used within <Tabs.Root>")
  return ctx
}

// Root
interface TabsRootProps {
  defaultValue: string
  children: React.ReactNode
  className?: string
}

function TabsRoot({ defaultValue, children, className }: TabsRootProps) {
  const [activeTab, setActiveTab] = useState(defaultValue)
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

// List (tab buttons container)
function TabsList({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div role="tablist" className={cn(
      "inline-flex items-center gap-1 rounded-lg bg-muted p-1",
      className,
    )}>
      {children}
    </div>
  )
}

// Trigger (individual tab button)
function TabsTrigger({ value, children }: { value: string; children: React.ReactNode }) {
  const { activeTab, setActiveTab } = useTabs()
  const isActive = activeTab === value

  return (
    <button
      role="tab"
      aria-selected={isActive}
      onClick={() => setActiveTab(value)}
      className={cn(
        "inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isActive
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
    </button>
  )
}

// Panel (tab content)
function TabsPanel({ value, children }: { value: string; children: React.ReactNode }) {
  const { activeTab } = useTabs()
  if (activeTab !== value) return null

  return (
    <div role="tabpanel" className="mt-4 animate-fade-in">
      {children}
    </div>
  )
}

// Export as compound
export const Tabs = {
  Root: TabsRoot,
  List: TabsList,
  Trigger: TabsTrigger,
  Panel: TabsPanel,
}

// Usage
<Tabs.Root defaultValue="monthly">
  <Tabs.List>
    <Tabs.Trigger value="monthly">Monthly</Tabs.Trigger>
    <Tabs.Trigger value="yearly">Yearly</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Panel value="monthly">Monthly pricing content</Tabs.Panel>
  <Tabs.Panel value="yearly">Yearly pricing content</Tabs.Panel>
</Tabs.Root>
```

---

## Controlled vs Uncontrolled Components

```tsx
interface ToggleProps {
  // Controlled mode
  value?: boolean
  onChange?: (value: boolean) => void
  // Uncontrolled mode
  defaultValue?: boolean
  // Common
  label: string
  disabled?: boolean
}

export function Toggle({ value, onChange, defaultValue = false, label, disabled }: ToggleProps) {
  const [internalValue, setInternalValue] = useState(defaultValue)

  // Use external value if controlled, otherwise internal
  const isOn = value !== undefined ? value : internalValue

  function handleToggle() {
    if (disabled) return
    const newValue = !isOn
    setInternalValue(newValue)    // Update internal state (for uncontrolled)
    onChange?.(newValue)           // Notify parent (for controlled)
  }

  return (
    <button
      role="switch"
      aria-checked={isOn}
      aria-label={label}
      onClick={handleToggle}
      disabled={disabled}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        isOn ? "bg-primary" : "bg-muted"
      )}
    >
      <span className={cn(
        "pointer-events-none inline-block h-5 w-5 rounded-full bg-background shadow-sm transition-transform",
        isOn ? "translate-x-5" : "translate-x-0.5"
      )} />
    </button>
  )
}

// Uncontrolled usage (component manages its own state)
<Toggle label="Enable notifications" defaultValue={false} />

// Controlled usage (parent manages state)
const [notifications, setNotifications] = useState(false)
<Toggle label="Enable notifications" value={notifications} onChange={setNotifications} />
```

---

## Custom Hooks for Component Logic

### useDisclosure (Modals, Drawers, Menus)
```tsx
import { useCallback, useState } from "react"

export function useDisclosure(initialOpen = false) {
  const [isOpen, setIsOpen] = useState(initialOpen)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((prev) => !prev), [])

  return { isOpen, open, close, toggle }
}

// Usage
const deleteDialog = useDisclosure()

<Button onClick={deleteDialog.open}>Delete</Button>
{deleteDialog.isOpen && (
  <ConfirmDialog onConfirm={handleDelete} onCancel={deleteDialog.close} />
)}
```

### useMediaQuery
```tsx
import { useEffect, useState } from "react"

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia(query)
    setMatches(mql.matches)

    function handler(e: MediaQueryListEvent) {
      setMatches(e.matches)
    }

    mql.addEventListener("change", handler)
    return () => mql.removeEventListener("change", handler)
  }, [query])

  return matches
}

// Usage
const isMobile = useMediaQuery("(max-width: 639px)")
const isDesktop = useMediaQuery("(min-width: 1024px)")
const prefersDark = useMediaQuery("(prefers-color-scheme: dark)")
```

### useDebounce
```tsx
import { useEffect, useState } from "react"

export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}

// Usage — debounce search input
const [query, setQuery] = useState("")
const debouncedQuery = useDebounce(query, 300)

useEffect(() => {
  if (debouncedQuery) fetchResults(debouncedQuery)
}, [debouncedQuery])
```

---

## Error Boundary with Friendly Fallback

```tsx
"use client"
import { Component, type ReactNode } from "react"
import { AlertCircle, RefreshCw } from "lucide-react"

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-destructive/10 p-4 mb-4">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Something went wrong</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-md">
            An unexpected error occurred. Please try refreshing the page.
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null })
              window.location.reload()
            }}
            className="mt-6 inline-flex items-center gap-2 h-10 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

// Usage in layout.tsx
<ErrorBoundary>
  {children}
</ErrorBoundary>
```

---

## Suspense Boundary with Skeleton Fallback

```tsx
import { Suspense } from "react"

// Skeleton component
function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} />
}

// Page-level skeleton
function PageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Skeleton className="h-10 w-1/3" />
      <Skeleton className="h-5 w-2/3" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border p-6 space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-10 w-24" />
          </div>
        ))}
      </div>
    </div>
  )
}

// Card skeleton
function CardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-4">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  )
}

// Usage with Suspense
<Suspense fallback={<PageSkeleton />}>
  <AsyncPageContent />
</Suspense>

// Wrap individual async components
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  <Suspense fallback={<CardSkeleton />}>
    <AsyncCard />
  </Suspense>
</div>
```

---

## Conditional Rendering Patterns

```tsx
// Ternary for two states
{isLoggedIn ? <UserMenu /> : <LoginButton />}

// Logical AND for optional rendering
{hasNotifications && <NotificationBadge count={count} />}

// Early return for loading/error/empty
function UserList() {
  const { data, isLoading, error } = useUsers()

  if (isLoading) return <Skeleton className="h-64" />
  if (error) return <ErrorBanner message={error.message} />
  if (!data || data.length === 0) return <EmptyState message="No users found" />

  return (
    <ul className="space-y-2">
      {data.map((user) => (
        <li key={user.id}>
          <UserCard user={user} />
        </li>
      ))}
    </ul>
  )
}
```

---

## The `cn()` Utility (Required)

Every component uses `cn()` to merge Tailwind classes. Install it once:

```tsx
// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

This allows conditional classes and lets parent components override styles via `className` prop.
