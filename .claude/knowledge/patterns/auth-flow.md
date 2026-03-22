# Authentication Flow Patterns — Copy-Paste Reference

## Complete Auth Setup Checklist
```
1. Install: npm install next-auth bcryptjs @auth/prisma-adapter
2. Create: src/app/api/auth/[...nextauth]/route.ts (NextAuth config)
3. Create: src/app/api/auth/signup/route.ts (registration endpoint)
4. Create: src/app/providers.tsx (SessionProvider wrapper)
5. Create: src/middleware.ts (route protection)
6. Create: src/app/(auth)/login/page.tsx (login UI)
7. Create: src/app/(auth)/signup/page.tsx (signup UI)
8. Add to .env: NEXTAUTH_SECRET, NEXTAUTH_URL
9. Add User model to prisma/schema.prisma
```

## Signup API Route
```tsx
// src/app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'

const SignupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = SignupSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ data: null, error: { message: 'Validation failed' } }, { status: 400 })
    }

    const exists = await db.user.findUnique({ where: { email: result.data.email } })
    if (exists) {
      return NextResponse.json({ data: null, error: { message: 'Email already registered' } }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(result.data.password, 12)
    const user = await db.user.create({
      data: { name: result.data.name, email: result.data.email, password: hashedPassword },
    })

    return NextResponse.json({ data: { id: user.id, email: user.email }, error: null }, { status: 201 })
  } catch {
    return NextResponse.json({ data: null, error: { message: 'Failed to create account' } }, { status: 500 })
  }
}
```

## Route Protection Middleware
```tsx
// src/middleware.ts
import { withAuth } from 'next-auth/middleware'

export default withAuth({
  pages: { signIn: '/login' },
})

export const config = {
  matcher: ['/dashboard/:path*', '/settings/:path*', '/api/protected/:path*'],
}
```

## Get Session in Server Component
```tsx
import { getServerSession } from 'next-auth'

export default async function DashboardPage() {
  const session = await getServerSession()
  if (!session) redirect('/login')

  return <h1>Welcome, {session.user?.name}</h1>
}
```

## Get Session in Client Component
```tsx
'use client'
import { useSession } from 'next-auth/react'

export function UserGreeting() {
  const { data: session, status } = useSession()

  if (status === 'loading') return <Skeleton className="h-8 w-32" />
  if (!session) return null

  return <span>Hi, {session.user?.name}</span>
}
```

## Prisma User Model
```prisma
model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String
  role      String   @default("user")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```
