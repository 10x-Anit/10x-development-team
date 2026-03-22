# React Component Patterns — Copy-Paste Reference

## Conditional Rendering
```tsx
// Show/hide based on state
{isLoading && <Spinner />}
{!isLoading && data && <DataList items={data} />}
{!isLoading && !data && <EmptyState message="No items found" />}
{error && <ErrorBanner message={error.message} />}
```

## List Rendering
```tsx
// Map array to components
<ul className="space-y-2">
  {items.map((item) => (
    <li key={item.id}>
      <ItemCard title={item.title} description={item.description} />
    </li>
  ))}
</ul>

// Empty state
{items.length === 0 && (
  <div className="py-12 text-center text-gray-500">
    <p>No items yet.</p>
  </div>
)}
```

## Component Composition (Children Pattern)
```tsx
interface SectionProps {
  title: string
  children: React.ReactNode
  action?: React.ReactNode
}

function Section({ title, children, action }: SectionProps) {
  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  )
}

// Usage:
<Section title="Products" action={<Button>Add Product</Button>}>
  <ProductGrid products={products} />
</Section>
```

## Controlled Input Pattern
```tsx
const [value, setValue] = useState('')

<input
  type="text"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  className="w-full rounded border px-3 py-2"
/>
```

## Loading + Error + Data Pattern
```tsx
function UserList() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(({ data }) => setUsers(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Skeleton count={5} />
  if (error) return <ErrorBanner message={error} />
  if (users.length === 0) return <EmptyState />

  return <ul>{users.map(u => <UserCard key={u.id} user={u} />)}</ul>
}
```

## forwardRef Pattern (for custom components that need ref)
```tsx
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, ...props }, ref) => (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input ref={ref} className="w-full rounded border px-3 py-2" {...props} />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
)
Input.displayName = 'Input'
```
