# Rate Limiting & Security — Copy-Paste Reference

## In-Memory Rate Limiter (no dependencies)
```tsx
// src/lib/rate-limit.ts
const requests = new Map<string, { count: number; resetAt: number }>()

export function rateLimit(key: string, limit = 10, windowMs = 60000): { success: boolean; remaining: number } {
  const now = Date.now()
  const entry = requests.get(key)

  if (!entry || now > entry.resetAt) {
    requests.set(key, { count: 1, resetAt: now + windowMs })
    return { success: true, remaining: limit - 1 }
  }

  if (entry.count >= limit) {
    return { success: false, remaining: 0 }
  }

  entry.count++
  return { success: true, remaining: limit - entry.count }
}

// Cleanup stale entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of requests) {
    if (now > entry.resetAt) requests.delete(key)
  }
}, 300000)
```
```tsx
// Usage in API route:
import { rateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  const { success, remaining } = rateLimit(ip, 10, 60000) // 10 requests per minute

  if (!success) {
    return NextResponse.json({ error: { message: 'Too many requests' } }, {
      status: 429,
      headers: { 'Retry-After': '60', 'X-RateLimit-Remaining': '0' },
    })
  }

  // ... normal route logic
}
```

## Upstash Redis Rate Limiter (production)
```bash
npm install @upstash/ratelimit @upstash/redis
```
```tsx
// src/lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

export const rateLimiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '60 s'), // 10 requests per 60 seconds
  analytics: true,
})

// Usage in API route:
export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  const { success, limit, remaining, reset } = await rateLimiter.limit(ip)

  if (!success) {
    return NextResponse.json({ error: { message: 'Too many requests' } }, {
      status: 429,
      headers: {
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': reset.toString(),
      },
    })
  }

  // ... normal route logic
}
```
```env
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token
```

## Rate Limit Middleware (Next.js)
```tsx
// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server'

const requests = new Map<string, { count: number; resetAt: number }>()

export function middleware(request: NextRequest) {
  // Only rate-limit API routes
  if (!request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  const now = Date.now()
  const entry = requests.get(ip)

  if (!entry || now > entry.resetAt) {
    requests.set(ip, { count: 1, resetAt: now + 60000 })
    return NextResponse.next()
  }

  if (entry.count >= 30) { // 30 API requests per minute
    return NextResponse.json({ error: { message: 'Rate limited' } }, { status: 429 })
  }

  entry.count++
  return NextResponse.next()
}

export const config = { matcher: '/api/:path*' }
```

## Security Headers (next.config.js)
```tsx
// next.config.js
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

module.exports = {
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }]
  },
}
```

## CORS Helper
```tsx
// src/lib/cors.ts
import { NextRequest, NextResponse } from 'next/server'

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(',')

export function corsHeaders(request: NextRequest) {
  const origin = request.headers.get('origin') || ''
  const isAllowed = ALLOWED_ORIGINS.includes(origin) || ALLOWED_ORIGINS.includes('*')

  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : '',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  }
}

// Handle preflight:
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(request) })
}
```

## Input Sanitization
```bash
npm install isomorphic-dompurify
```
```tsx
// src/lib/sanitize.ts
import DOMPurify from 'isomorphic-dompurify'

export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, { ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'], ALLOWED_ATTR: ['href'] })
}

export function sanitizeInput(input: string): string {
  return input.replace(/[<>"'&]/g, (char) => {
    const map: Record<string, string> = { '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '&': '&amp;' }
    return map[char] || char
  })
}
```

## Choosing
| Scope | Use |
|-------|-----|
| MVP (single server) | In-memory rate limiter |
| Production / serverless | Upstash Redis |
| All scopes | Security headers (always add) |
| Public API | CORS + rate limiting + input sanitization |
