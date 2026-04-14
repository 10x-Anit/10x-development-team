# Deployment Checklist & Production Release Reference

Use this reference when preparing any MVP or production deployment. Read it before shipping changes. Treat the pre-deployment checklist as mandatory.

## 1. Pre-Deployment Checklist (MANDATORY)

Do not deploy until every item below is checked:

- [ ] All automated tests pass: `npm test`
- [ ] Production build succeeds: `npm run build`
- [ ] TypeScript compiles with no errors: `npx tsc --noEmit`
- [ ] Lint passes with no errors: `npx eslint .`
- [ ] No hardcoded secrets, tokens, or passwords remain in source
- [ ] `.env.example` is complete and matches current runtime requirements
- [ ] Every environment variable is documented with a short description
- [ ] Database migrations are reviewed for safety and rollback
- [ ] Bundle size is within budget
- [ ] Lighthouse meets the performance threshold
- [ ] Security headers are configured
- [ ] Custom error pages exist (`404`, `500`)
- [ ] Health check endpoint responds correctly
- [ ] CORS is intentionally configured
- [ ] Rate limiting is enabled on exposed API routes

### Pre-Deploy Command Pack

```bash
npm test
npm run build
npx tsc --noEmit
npx eslint .
```

### Secret Scan Commands

Use one or more of these before deploy:

```bash
git grep -nE "(sk_live_|pk_live_|AKIA|ghp_|xoxb-|BEGIN PRIVATE KEY|DATABASE_URL=.*:.*@)"
git grep -nE "(password|secret|token)[[:space:]]*[:=][[:space:]]*['\"][^'\"]+['\"]"
```

### Bundle Budget Check

For Next.js:

```bash
ANALYZE=true npm run build
```

Example budget:

- Initial route JS: under `250 kB`
- Largest page JS: under `350 kB`
- Shared JS: under `180 kB`
- Largest image on homepage: under `400 kB`

### Lighthouse Threshold

Recommended minimums for production:

- Performance: `90+`
- Accessibility: `95+`
- Best Practices: `95+`
- SEO: `95+`

### Environment Variable Documentation Template

```md
## Environment Variables

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | yes | `postgresql://...` | Primary application database connection string |
| `NEXTAUTH_SECRET` | yes | `change-me` | Secret used to sign auth session tokens |
| `SENTRY_DSN` | no | `https://...` | Sends production errors to Sentry |
| `UPSTASH_REDIS_REST_URL` | no | `https://...` | Redis endpoint for rate limiting |
```

### `.env.example` Starter

```env
# Database
DATABASE_URL=

# Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000

# Monitoring
SENTRY_DSN=
NEXT_PUBLIC_SENTRY_DSN=

# Rate limiting
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# App
APP_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000
```

### Health Check Route

```tsx
// src/app/api/health/route.ts
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  const checks: Record<string, string> = {}

  try {
    await db.$queryRaw`SELECT 1`
    checks.database = 'ok'
  } catch {
    checks.database = 'failed'
  }

  const healthy = Object.values(checks).every((value) => value === 'ok')

  return NextResponse.json(
    {
      status: healthy ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      checks,
    },
    { status: healthy ? 200 : 503 }
  )
}
```

### Next.js Security Headers

```ts
// next.config.ts
import type { NextConfig } from 'next'

const securityHeaders = [
  { key: 'Content-Security-Policy', value: "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; connect-src 'self' https:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'" },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
}

export default nextConfig
```

### Error Pages

```tsx
// src/app/not-found.tsx
export default function NotFoundPage() {
  return (
    <main>
      <h1>Page not found</h1>
      <p>The page you requested does not exist.</p>
    </main>
  )
}
```

```tsx
// src/app/error.tsx
'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <main>
      <h1>Something went wrong</h1>
      <p>{error.message}</p>
      <button onClick={() => reset()}>Try again</button>
    </main>
  )
}
```

## 2. Database Migration Safety Protocol

Rules:

- NEVER drop columns or tables in production in the same deploy that introduces a replacement.
- Prefer additive changes first.
- Always test both forward migration and rollback.
- Back up production data before running destructive or high-risk migrations.
- Separate schema migration from cleanup migration when possible.

### Safe Three-Step Change Pattern

1. Add new nullable column or table.
2. Backfill data and update application reads/writes.
3. Remove old column or table in a later deploy after verification.

### Safe Prisma Migration Example

```prisma
// prisma/schema.prisma
model User {
  id            String   @id @default(cuid())
  fullName      String?
  displayName   String?
  createdAt     DateTime @default(now())
}
```

```bash
npx prisma migrate dev --name add-display-name
```

```ts
// scripts/backfill-display-name.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany({
    where: {
      displayName: null,
      fullName: { not: null },
    },
    select: {
      id: true,
      fullName: true,
    },
  })

  for (const user of users) {
    await prisma.user.update({
      where: { id: user.id },
      data: { displayName: user.fullName },
    })
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect()
  })
```

After one release cycle, remove `fullName` in a separate migration.

### Rollback Test Checklist

- Run migration on a staging clone of production data
- Verify application boots on new schema
- Verify rollback command returns schema to previous shape
- Verify old app version can still run if rollback is needed
- Confirm backup restore instructions are current

### Backup Strategy

Before high-risk migrations:

```bash
pg_dump "$DATABASE_URL" > backup-$(date +%Y%m%d-%H%M%S).sql
```

If using managed Postgres, also capture:

- Managed snapshot ID
- Restore point timestamp
- On-call owner
- Expected restore time

## 3. Staging Environment Setup

Staging should look like production, but use isolated services and data.

### Environment Split Template

```env
# .env.staging
APP_ENV=staging
APP_URL=https://staging.example.com
DATABASE_URL=postgresql://staging-db
NEXTAUTH_URL=https://staging.example.com
SENTRY_DSN=https://staging-sentry
ALLOWED_ORIGINS=https://staging.example.com
FEATURE_BETA_DASHBOARD=true
```

```env
# .env.production
APP_ENV=production
APP_URL=https://app.example.com
DATABASE_URL=postgresql://prod-db
NEXTAUTH_URL=https://app.example.com
SENTRY_DSN=https://prod-sentry
ALLOWED_ORIGINS=https://app.example.com
FEATURE_BETA_DASHBOARD=false
```

### Feature Flags Pattern

```ts
// src/lib/flags.ts
export const flags = {
  betaDashboard: process.env.FEATURE_BETA_DASHBOARD === 'true',
  newCheckout: process.env.FEATURE_NEW_CHECKOUT === 'true',
}
```

```tsx
// usage
import { flags } from '@/lib/flags'

export function DashboardEntry() {
  return flags.betaDashboard ? <NewDashboard /> : <OldDashboard />
}
```

### Preview Deployment Notes

Vercel preview:

- Use preview env vars for non-production integrations
- Point preview auth callbacks to preview URLs
- Disable destructive cron jobs
- Use seed data or isolated preview DB branches

Docker staging:

```yaml
# docker-compose.staging.yml
services:
  app:
    image: ghcr.io/acme/app:${APP_TAG}
    env_file:
      - .env.staging
    ports:
      - '3000:3000'
```

## 4. Rollback Strategy

Have rollback instructions before deployment starts.

### Git-Based Rollback

```bash
git revert <bad_commit_sha>
git push origin main
```

Then redeploy the reverted commit through the normal deployment flow.

### Vercel Rollback

- Open the project in Vercel
- Find the last healthy deployment
- Promote or restore that deployment
- Verify `/api/health` and critical smoke tests

### Docker Rollback

```bash
docker service update --image ghcr.io/acme/app:previous-stable my-app
```

Or in Kubernetes:

```bash
kubectl rollout undo deployment/my-app
```

### Database Rollback Plan

- Prefer forward fixes over destructive down migrations
- If rollback is necessary, restore code and schema together
- Never run an automatic down migration unless it has been tested against realistic data
- If restore is faster and safer, use backup restore instead of schema rollback

### Rollback Runbook Template

```md
# Rollback Runbook

## Trigger
- Error rate above threshold
- Health check failing
- Core revenue/auth flow broken

## Owner
- Release commander: [name]
- Database owner: [name]

## Steps
1. Pause rollout / disable feature flag
2. Roll back app to previous stable version
3. Roll back or stabilize database changes
4. Run smoke tests
5. Announce status to stakeholders

## Verification
- `/api/health` returns 200
- Login works
- Core write path works
- Error rate returns below threshold
```

## 5. Post-Deployment Verification (Smoke Tests)

Run these immediately after deploy:

- Health check returns `200`
- Homepage loads within budget
- Login, signup, and logout succeed
- Core CRUD flow succeeds
- Key API responses match expected shape
- No spike in error rate or latency

### Automated Smoke Test Script

```js
// scripts/smoke-test.mjs
const baseUrl = process.env.APP_URL || 'http://localhost:3000'

async function check(name, fn) {
  try {
    await fn()
    console.log(`PASS: ${name}`)
  } catch (error) {
    console.error(`FAIL: ${name}`)
    console.error(error)
    process.exitCode = 1
  }
}

await check('health endpoint', async () => {
  const response = await fetch(`${baseUrl}/api/health`)
  if (response.status !== 200) throw new Error(`Expected 200, got ${response.status}`)
})

await check('homepage loads', async () => {
  const response = await fetch(baseUrl)
  if (response.status !== 200) throw new Error(`Expected 200, got ${response.status}`)
  const html = await response.text()
  if (!html.includes('<html')) throw new Error('Homepage did not return HTML')
})

await check('users API shape', async () => {
  const response = await fetch(`${baseUrl}/api/users`)
  if (response.status !== 200) throw new Error(`Expected 200, got ${response.status}`)
  const body = await response.json()
  if (!Array.isArray(body.users)) throw new Error('Expected body.users to be an array')
})

if (process.exitCode) {
  process.exit(process.exitCode)
}
```

### Performance Budget Check

Recommended homepage targets:

- TTFB under `800ms`
- LCP under `2.5s`
- JS payload under budget
- Largest API p95 under `2s`

## 6. Monitoring Setup

Production apps need error tracking, uptime checks, performance metrics, and structured logs.

### Sentry Setup Template

```bash
npm install @sentry/nextjs
```

```ts
// sentry.server.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
})
```

### Uptime Monitoring

Monitor `/api/health` every 5 minutes from at least one external service.

Alert if:

- 2 consecutive failures occur
- uptime drops below `99.5%`

### Web Vitals Reporting

```ts
// src/app/reportWebVitals.ts
export function reportWebVitals(metric: { name: string; value: number }) {
  if (process.env.NODE_ENV === 'production') {
    fetch('/api/vitals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metric),
      keepalive: true,
    }).catch(() => {})
  }
}
```

### Structured JSON Logger

```ts
// src/lib/logger.ts
type Level = 'info' | 'warn' | 'error'

export function log(level: Level, message: string, meta: Record<string, unknown> = {}) {
  console.log(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      message,
      ...meta,
    })
  )
}
```

### Alert Thresholds

- Error rate `> 1%`
- p95 latency `> 2s`
- Uptime `< 99.5%`
- Repeated health check failures
- Login or checkout failure spikes

## 7. Incident Response Protocol

### Severity Levels

- `P0`: Site down, data corruption, payment outage, auth fully broken
- `P1`: Core feature broken for many users
- `P2`: Important but non-critical bug
- `P3`: Cosmetic or low-impact issue

### Response Expectations

- `P0`: Immediate rollback, stabilize first, investigate second
- `P1`: Hotfix within 1 hour
- `P2`: Fix in next sprint
- `P3`: Add to backlog

### Initial Incident Checklist

1. Confirm severity
2. Assign incident owner
3. Stop rollout or roll back if needed
4. Stabilize customer impact
5. Capture timeline and logs
6. Communicate status

### Post-Mortem Template

```md
# Incident Post-Mortem

## Summary
- Severity:
- Start time:
- End time:
- Impact:

## Timeline
- HH:MM detected
- HH:MM mitigation started
- HH:MM service restored

## Root Cause
- What failed:
- Why it failed:

## Resolution
- Immediate fix:
- Rollback used:

## Prevention
- Action items:
- Owners:
- Due dates:
```

## 8. CI/CD Pipeline Templates

### GitHub Actions Pipeline

This pipeline runs lint, type-check, test, and build in parallel where possible, then deploys with approval for production.

```yaml
# .github/workflows/ci-cd.yml
name: ci-cd

on:
  push:
    branches: [main]
  pull_request:

jobs:
  quality:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        task: [lint, typecheck, test, build]
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - run: npm ci

      - name: Run lint
        if: matrix.task == 'lint'
        run: npx eslint .

      - name: Run typecheck
        if: matrix.task == 'typecheck'
        run: npx tsc --noEmit

      - name: Run tests
        if: matrix.task == 'test'
        run: npm test

      - name: Run build
        if: matrix.task == 'build'
        run: npm run build

  deploy-production:
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    needs: quality
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://app.example.com
    steps:
      - uses: actions/checkout@v4

      - name: Wait for approval
        run: echo "Protected environment approval gate enforced by GitHub"

      - name: Deploy
        run: echo "Run production deploy command here"
```

### Extra CI Hardening

Add these jobs when relevant:

- Bundle size check
- Lighthouse CI
- Secret scan
- Dependency vulnerability scan
- Smoke tests against preview or staging

## 9. Security Hardening for Production

### CSP Template

```ts
const csp = [
  "default-src 'self'",
  "img-src 'self' data: https:",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "connect-src 'self' https:",
  "font-src 'self' data:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ')
```

### HSTS

Use:

```txt
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```

Only enable preload when every subdomain is HTTPS-ready.

### Rate Limiting Middleware

```ts
// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'

export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  const result = rateLimit(ip, 30, 60_000)

  if (!result.success) {
    return NextResponse.json({ error: { message: 'Too many requests' } }, { status: 429 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
}
```

### Input Sanitization

```bash
npm install zod isomorphic-dompurify
```

```ts
// src/lib/input.ts
import DOMPurify from 'isomorphic-dompurify'
import { z } from 'zod'

export const createPostSchema = z.object({
  title: z.string().min(1).max(120),
  body: z.string().min(1).max(5000),
})

export function sanitizeRichText(input: string) {
  return DOMPurify.sanitize(input)
}
```

### Dependency Vulnerability Scanning in CI

```yaml
- name: Audit dependencies
  run: npm audit --audit-level=high
```

### Secret Scanning in CI

```yaml
- name: Secret scan
  run: |
    git grep -nE "(sk_live_|pk_live_|AKIA|ghp_|BEGIN PRIVATE KEY)" && exit 1 || true
```

## Release Command Center Checklist

Use this quick version during the actual deployment window:

- [ ] Tests, lint, type-check, and build all green
- [ ] Migrations reviewed and backup ready
- [ ] Production env vars validated
- [ ] Rollback owner assigned
- [ ] Smoke test script prepared
- [ ] Monitoring dashboard open
- [ ] Incident channel ready
- [ ] Deployment approved
- [ ] Post-deploy verification completed
