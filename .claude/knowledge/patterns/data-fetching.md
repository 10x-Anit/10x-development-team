# Data Fetching Patterns — Copy-Paste Reference

## Server Component Fetch (Next.js — preferred)
```tsx
// This runs on the server. No useEffect, no loading state needed.
export default async function ProductsPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/products`, { cache: 'no-store' })
  const { data: products } = await res.json()

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map((p: Product) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}
```

## Client Component Fetch (with loading + error states)
```tsx
'use client'
import { useState, useEffect } from 'react'

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(({ data, error }) => {
        if (error) throw new Error(error.message)
        setProducts(data)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="animate-pulse space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-24 rounded bg-gray-200" />)}</div>
  if (error) return <div className="rounded bg-red-50 p-4 text-red-600">{error}</div>
  if (products.length === 0) return <div className="py-12 text-center text-gray-500">No products found</div>

  return <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{products.map(p => <ProductCard key={p.id} product={p} />)}</div>
}
```

## Custom useFetch Hook
```tsx
// src/hooks/use-fetch.ts
import { useState, useEffect } from 'react'

export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(({ data, error }) => {
        if (error) throw new Error(error.message)
        setData(data)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [url])

  return { data, loading, error }
}

// Usage:
const { data: products, loading, error } = useFetch<Product[]>('/api/products')
```

## Form Submission
```tsx
async function handleSubmit(formData: FormData) {
  const res = await fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(Object.fromEntries(formData)),
  })
  const { data, error } = await res.json()
  if (error) { setError(error.message); return }
  router.push(`/products/${data.id}`)
}
```

## Delete with Confirmation
```tsx
async function handleDelete(id: string) {
  if (!confirm('Are you sure?')) return
  await fetch(`/api/products/${id}`, { method: 'DELETE' })
  setProducts(prev => prev.filter(p => p.id !== id))
}
```
