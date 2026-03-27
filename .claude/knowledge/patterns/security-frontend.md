# Frontend Security — Patterns & Best Practices

Every agent that builds frontend code MUST follow these security patterns. Security is non-negotiable.

---

## 1. XSS Prevention (Cross-Site Scripting)

### NEVER use dangerouslySetInnerHTML
```tsx
// BANNED — XSS vulnerability
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// CORRECT — React auto-escapes text content
<div>{userContent}</div>

// IF you MUST render HTML (e.g., CMS content), sanitize first:
import DOMPurify from 'dompurify'
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(cmsContent) }} />
```

### Sanitize User Input Before Display
```tsx
// NEVER trust user input — always validate and sanitize
const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}
```

### URL Validation
```tsx
// NEVER render user-provided URLs without validation
function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return ['https:', 'http:'].includes(parsed.protocol)
  } catch {
    return false
  }
}

// Usage
<a href={isValidUrl(userUrl) ? userUrl : '#'}>Link</a>

// BANNED — javascript: URLs can execute code
// <a href={userUrl}> where userUrl could be "javascript:alert(1)"
```

---

## 2. CSRF Protection (Cross-Site Request Forgery)

### Include CSRF Token in Forms
```tsx
// Next.js: Use server actions (automatically CSRF-protected)
// OR include a CSRF token in form submissions

// API route: Generate token
import { randomBytes } from 'crypto'

export function generateCsrfToken(): string {
  return randomBytes(32).toString('hex')
}

// Form: Include as hidden field
<form action="/api/submit" method="POST">
  <input type="hidden" name="csrf_token" value={csrfToken} />
  {/* ... form fields ... */}
</form>

// API route: Validate token
export async function POST(req: NextRequest) {
  const body = await req.formData()
  const token = body.get('csrf_token')
  if (!validateCsrfToken(token as string)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 403 })
  }
  // ... process form
}
```

### SameSite Cookie Attribute
```tsx
// Always set SameSite on auth cookies
cookies().set('session', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: 60 * 60 * 24 * 7, // 7 days
})
```

---

## 3. Input Validation (Client + Server)

### ALWAYS validate on BOTH sides
```tsx
// Client-side (UX — instant feedback)
import { z } from 'zod'

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
  name: z.string().min(2).max(100),
})

// Server-side (Security — NEVER trust client validation)
export async function POST(req: NextRequest) {
  const body = await req.json()
  const result = schema.safeParse(body)
  if (!result.success) {
    return NextResponse.json(
      { error: { message: 'Validation failed', details: result.error.flatten() } },
      { status: 400 }
    )
  }
  // Use result.data (validated and typed)
}
```

### File Upload Validation
```tsx
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

function validateFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'File type not allowed. Use JPEG, PNG, WebP, or PDF.'
  }
  if (file.size > MAX_SIZE) {
    return 'File is too large. Maximum size is 5MB.'
  }
  return null // Valid
}
```

---

## 4. Secure Data Handling

### NEVER expose sensitive data in client components
```tsx
// BANNED — API keys in client code
const API_KEY = 'sk_live_abc123' // NEVER
fetch(`https://api.service.com?key=${API_KEY}`) // NEVER

// CORRECT — Use server-side API routes as proxy
// src/app/api/data/route.ts (server-side)
export async function GET() {
  const res = await fetch('https://api.service.com', {
    headers: { Authorization: `Bearer ${process.env.API_SECRET}` },
  })
  const data = await res.json()
  return NextResponse.json({ data })
}

// Client-side: call YOUR API route
const res = await fetch('/api/data')
```

### Environment Variables
```
# .env.local (NEVER commit this file)
DATABASE_URL=postgresql://...
API_SECRET=sk_live_...
NEXTAUTH_SECRET=random-string

# NEXT_PUBLIC_ prefix = exposed to browser (use sparingly)
NEXT_PUBLIC_APP_URL=https://myapp.com

# Add to .gitignore:
.env
.env.local
.env.production
```

---

## 5. Content Security Policy (CSP)

### Next.js Middleware CSP
```tsx
// src/middleware.ts
import { NextResponse } from 'next/server'

export function middleware(request: Request) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}'`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self' https:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ')

  const response = NextResponse.next()
  response.headers.set('Content-Security-Policy', csp)
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  return response
}
```

---

## 6. Debounce & Throttle (Prevent Abuse)

### Debounce Search Input
```tsx
import { useState, useEffect, useCallback } from 'react'

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

// Usage in search
function SearchInput() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    if (debouncedQuery) {
      fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)
    }
  }, [debouncedQuery])

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search..."
      className="..."
    />
  )
}
```

### Prevent Double Form Submission
```tsx
function SubmitForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (isSubmitting) return // Prevent double submission

    setIsSubmitting(true)
    try {
      await fetch('/api/submit', { method: 'POST', body: formData })
      toast.success('Submitted!')
    } catch {
      toast.error('Failed to submit')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* fields */}
      <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
        Submit
      </Button>
    </form>
  )
}
```

---

## 7. Secure Authentication UI Patterns

### Password Field Security
```tsx
// ALWAYS use type="password" (toggleable)
// ALWAYS use autocomplete attributes for browser autofill
<input type="password" autoComplete="current-password" /> // Login
<input type="password" autoComplete="new-password" />     // Signup

// NEVER log password values
// NEVER store passwords in localStorage
// NEVER send passwords in URL query strings
```

### Session Handling
```tsx
// Check session on protected pages
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'

export default async function DashboardPage() {
  const session = await getServerSession()
  if (!session) redirect('/login')

  return <Dashboard user={session.user} />
}
```

### Logout — Clear Everything
```tsx
async function handleLogout() {
  // Sign out from NextAuth
  await signOut({ redirect: false })

  // Clear any client-side state
  localStorage.removeItem('user-preferences')
  sessionStorage.clear()

  // Redirect to home
  window.location.href = '/'
}
```

---

## 8. Security Checklist (Every Build)

```
[ ] No dangerouslySetInnerHTML without DOMPurify
[ ] No API keys or secrets in client-side code
[ ] No sensitive data in localStorage (use httpOnly cookies)
[ ] All forms have CSRF protection (server actions or tokens)
[ ] All user input validated with Zod on BOTH client and server
[ ] File uploads validated for type and size
[ ] Search inputs debounced (300ms minimum)
[ ] Form submit buttons disabled during submission
[ ] Authentication checks on all protected pages
[ ] CSP headers set in middleware
[ ] .env files in .gitignore
[ ] Password fields use autocomplete attributes
[ ] URLs validated before rendering as href
[ ] No inline event handlers (onclick="...") in HTML
```

---

## Scope Guide

| Security Measure | simple | prototype | mvp | production |
|-----------------|--------|-----------|-----|------------|
| Input sanitization | Basic HTML escape | Zod validation | Zod + server | Zod + server + CSP |
| CSRF protection | N/A | N/A | Server actions | Tokens + SameSite |
| CSP headers | Basic meta tag | N/A | Middleware | Full CSP + nonce |
| Rate limiting | N/A | N/A | In-memory | Redis + middleware |
| Auth security | N/A | N/A | NextAuth + cookies | Full + MFA support |
| Debounce | N/A | Basic | All search/filter | All + throttle |
