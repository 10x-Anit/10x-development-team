# API Route Patterns — Copy-Paste Reference

## Standard CRUD Route (Next.js App Router)

### List + Create: `/api/[resource]/route.ts`
```tsx
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'

const CreateSchema = z.object({
  name: z.string().min(1),
  // add fields
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number(searchParams.get('page') || '1')
    const limit = Number(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''

    const where = search ? { name: { contains: search } } : {}
    const [data, total] = await Promise.all([
      db.resource.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' } }),
      db.resource.count({ where }),
    ])

    return NextResponse.json({ data, total, page, limit, error: null })
  } catch {
    return NextResponse.json({ data: null, error: { message: 'Failed to fetch' } }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = CreateSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ data: null, error: { message: 'Validation failed', details: result.error.issues } }, { status: 400 })
    }
    const data = await db.resource.create({ data: result.data })
    return NextResponse.json({ data, error: null }, { status: 201 })
  } catch {
    return NextResponse.json({ data: null, error: { message: 'Failed to create' } }, { status: 500 })
  }
}
```

### Get + Update + Delete: `/api/[resource]/[id]/route.ts`
```tsx
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await db.resource.findUnique({ where: { id: params.id } })
    if (!data) return NextResponse.json({ data: null, error: { message: 'Not found' } }, { status: 404 })
    return NextResponse.json({ data, error: null })
  } catch {
    return NextResponse.json({ data: null, error: { message: 'Failed to fetch' } }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const data = await db.resource.update({ where: { id: params.id }, data: body })
    return NextResponse.json({ data, error: null })
  } catch {
    return NextResponse.json({ data: null, error: { message: 'Failed to update' } }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await db.resource.delete({ where: { id: params.id } })
    return NextResponse.json({ data: null, error: null })
  } catch {
    return NextResponse.json({ data: null, error: { message: 'Failed to delete' } }, { status: 500 })
  }
}
```

## Auth Middleware Pattern
```tsx
import { getServerSession } from 'next-auth'

async function requireAuth() {
  const session = await getServerSession()
  if (!session) {
    return NextResponse.json({ data: null, error: { message: 'Unauthorized' } }, { status: 401 })
  }
  return session
}

// Usage in route:
export async function GET() {
  const session = await requireAuth()
  if (session instanceof NextResponse) return session // it's an error response
  // ... protected logic using session.user
}
```

## Database Client Singleton
```tsx
// src/lib/db.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
export const db = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
```
