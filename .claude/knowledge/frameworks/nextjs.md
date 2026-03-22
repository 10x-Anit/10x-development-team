# Next.js App Router Reference

## File Conventions
```
src/app/
  layout.tsx          → Root layout (wraps all pages)
  page.tsx            → Home page (/)
  loading.tsx         → Loading UI (auto Suspense boundary)
  error.tsx           → Error boundary
  not-found.tsx       → 404 page

  blog/
    page.tsx          → /blog
    [slug]/page.tsx   → /blog/hello-world (dynamic)

  (auth)/             → Route group (no URL segment)
    login/page.tsx    → /login
    signup/page.tsx   → /signup

  api/
    users/route.ts    → API: /api/users
    users/[id]/route.ts → API: /api/users/123
```

## Layout Pattern
```tsx
// src/app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'My App',
  description: 'Built with 10x Development Team',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

## Page Pattern
```tsx
// src/app/dashboard/page.tsx
export default function DashboardPage() {
  return (
    <main>
      <h1>Dashboard</h1>
    </main>
  )
}
```

## Server Component (default — fetches data)
```tsx
async function ProductsPage() {
  const products = await db.product.findMany()
  return <ProductList products={products} />
}
```

## Client Component (interactivity)
```tsx
'use client'
import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

## API Route Pattern
```tsx
// src/app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const users = await db.user.findMany()
  return NextResponse.json({ data: users })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const user = await db.user.create({ data: body })
  return NextResponse.json({ data: user }, { status: 201 })
}
```

## Dynamic Route
```tsx
// src/app/users/[id]/page.tsx
export default async function UserPage({ params }: { params: { id: string } }) {
  const user = await db.user.findUnique({ where: { id: params.id } })
  if (!user) return notFound()
  return <UserProfile user={user} />
}
```

## Middleware (auth protection)
```tsx
// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('session')
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return NextResponse.next()
}

export const config = { matcher: ['/dashboard/:path*'] }
```

## Environment Variables
```
NEXT_PUBLIC_*  → exposed to browser (public)
*              → server-only (secret)
```
