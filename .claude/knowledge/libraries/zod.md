# Zod Validation Reference

## Install
```bash
npm install zod
```

## Basic Schemas
```tsx
import { z } from 'zod'

// Primitives
const name = z.string().min(2).max(100)
const email = z.string().email()
const age = z.number().int().min(0).max(150)
const isActive = z.boolean()
const url = z.string().url()

// Object
const UserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  age: z.number().optional(),
  role: z.enum(['user', 'admin']).default('user'),
})

// Infer TypeScript type from schema
type User = z.infer<typeof UserSchema>
// Result: { name: string; email: string; password: string; age?: number; role: 'user' | 'admin' }
```

## Validation
```tsx
// Parse (throws on error)
const user = UserSchema.parse(input) // throws ZodError if invalid

// Safe parse (returns result object)
const result = UserSchema.safeParse(input)
if (result.success) {
  console.log(result.data) // typed User
} else {
  console.log(result.error.issues) // validation errors
}
```

## API Route Validation Pattern
```tsx
// src/app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const CreateUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
})

export async function POST(request: NextRequest) {
  const body = await request.json()
  const result = CreateUserSchema.safeParse(body)

  if (!result.success) {
    return NextResponse.json(
      { data: null, error: { message: 'Validation failed', details: result.error.issues } },
      { status: 400 }
    )
  }

  const user = await db.user.create({ data: result.data })
  return NextResponse.json({ data: user, error: null }, { status: 201 })
}
```

## Common Schemas
```tsx
// Login
const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
})

// Pagination
const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
})

// ID param
const IdSchema = z.object({
  id: z.string().cuid(),
})
```
