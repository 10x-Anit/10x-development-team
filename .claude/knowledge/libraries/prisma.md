# Prisma ORM Reference

## Install
```bash
npm install prisma @prisma/client
npx prisma init
```

## Schema (prisma/schema.prisma)
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"       // or "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  password  String
  role      String   @default("user")
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Migration
```bash
npx prisma migrate dev --name init     # create + apply migration
npx prisma generate                    # generate client
npx prisma studio                      # GUI to view data
```

## Database Client
```tsx
// src/lib/db.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
export const db = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
```

## CRUD Operations
```tsx
// CREATE
const user = await db.user.create({
  data: { email: 'a@b.com', name: 'Alice', password: hashedPassword }
})

// READ (one)
const user = await db.user.findUnique({ where: { id } })
const user = await db.user.findUnique({ where: { email } })

// READ (many)
const users = await db.user.findMany({
  where: { role: 'user' },
  orderBy: { createdAt: 'desc' },
  take: 10,
  skip: 0,
})

// READ (with relations)
const user = await db.user.findUnique({
  where: { id },
  include: { posts: true }
})

// UPDATE
const user = await db.user.update({
  where: { id },
  data: { name: 'New Name' }
})

// DELETE
await db.user.delete({ where: { id } })

// COUNT
const count = await db.user.count({ where: { role: 'admin' } })
```

## ENV
```
# SQLite
DATABASE_URL="file:./dev.db"

# PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
```
