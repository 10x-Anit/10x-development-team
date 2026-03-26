# Monitoring & Observability — Copy-Paste Reference

## Sentry Error Tracking
```bash
npx @sentry/wizard@latest -i nextjs
```
This auto-creates: `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`, and updates `next.config.js`.

Manual setup if wizard fails:
```bash
npm install @sentry/nextjs
```
```tsx
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,  // 10% of transactions
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
})
```
```tsx
// sentry.server.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
})
```
```env
NEXT_PUBLIC_SENTRY_DSN=https://your-key@o123.ingest.sentry.io/456
SENTRY_DSN=https://your-key@o123.ingest.sentry.io/456
SENTRY_AUTH_TOKEN=sntrys_your_token
```

## Error Boundary with Reporting
```tsx
// src/components/error-boundary.tsx
'use client'
import React from 'react'

interface Props { children: React.ReactNode; fallback?: React.ReactNode }
interface State { hasError: boolean; error: Error | null }

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, info)
    // Report to Sentry (if installed):
    // Sentry.captureException(error, { extra: { componentStack: info.componentStack } })
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-500 mb-4">{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false, error: null })} className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800">
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

// Usage: <ErrorBoundary><MyComponent /></ErrorBoundary>
```

## Structured Logger (no dependencies)
```tsx
// src/lib/logger.ts
type LogLevel = 'debug' | 'info' | 'warn' | 'error'

const LOG_LEVELS: Record<LogLevel, number> = { debug: 0, info: 1, warn: 2, error: 3 }
const MIN_LEVEL: LogLevel = (process.env.LOG_LEVEL as LogLevel) || (process.env.NODE_ENV === 'production' ? 'info' : 'debug')

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  [key: string]: unknown
}

function log(level: LogLevel, message: string, meta?: Record<string, unknown>) {
  if (LOG_LEVELS[level] < LOG_LEVELS[MIN_LEVEL]) return

  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...meta,
  }

  if (process.env.NODE_ENV === 'production') {
    // JSON output for log aggregators
    console[level === 'error' ? 'error' : 'log'](JSON.stringify(entry))
  } else {
    // Pretty output for dev
    const colors = { debug: '\x1b[36m', info: '\x1b[32m', warn: '\x1b[33m', error: '\x1b[31m' }
    console[level === 'error' ? 'error' : 'log'](`${colors[level]}[${level.toUpperCase()}]\x1b[0m ${message}`, meta || '')
  }
}

export const logger = {
  debug: (msg: string, meta?: Record<string, unknown>) => log('debug', msg, meta),
  info: (msg: string, meta?: Record<string, unknown>) => log('info', msg, meta),
  warn: (msg: string, meta?: Record<string, unknown>) => log('warn', msg, meta),
  error: (msg: string, meta?: Record<string, unknown>) => log('error', msg, meta),
}

// Usage:
// logger.info('User logged in', { userId: '123', ip: '1.2.3.4' })
// logger.error('Payment failed', { orderId: '456', error: err.message })
```

## Health Check Endpoint
```tsx
// src/app/api/health/route.ts
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'  // adjust import for your db client

export const dynamic = 'force-dynamic'

export async function GET() {
  const checks: Record<string, string> = {}

  // Database check
  try {
    await db.$queryRaw`SELECT 1` // Prisma
    // or: await supabase.from('_health').select('*').limit(1)
    checks.database = 'connected'
  } catch {
    checks.database = 'disconnected'
  }

  const allHealthy = Object.values(checks).every(v => v === 'connected' || v === 'ok')

  return NextResponse.json({
    status: allHealthy ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION || '1.0.0',
    checks,
  }, { status: allHealthy ? 200 : 503 })
}
```

## API Route Timing
```tsx
// src/lib/api-timing.ts
import { logger } from './logger'

export function withTiming<T>(name: string, fn: () => Promise<T>): Promise<T> {
  const start = performance.now()
  return fn().then(result => {
    const duration = Math.round(performance.now() - start)
    if (duration > 500) logger.warn(`Slow operation: ${name}`, { duration: `${duration}ms` })
    else logger.debug(`${name}`, { duration: `${duration}ms` })
    return result
  })
}

// Usage in API route:
// const users = await withTiming('fetch-users', () => db.user.findMany())
```

## Web Vitals Reporting
```tsx
// src/app/layout.tsx — add this to your root layout
import { SpeedInsights } from '@vercel/speed-insights/next' // if on Vercel

// Or manual reporting:
// src/lib/web-vitals.ts
export function reportWebVitals(metric: { name: string; value: number }) {
  // Log to console in dev, send to analytics in prod
  if (process.env.NODE_ENV === 'production') {
    fetch('/api/analytics/vitals', {
      method: 'POST',
      body: JSON.stringify(metric),
      headers: { 'Content-Type': 'application/json' },
    }).catch(() => {}) // fire and forget
  } else {
    console.log(`[Web Vital] ${metric.name}: ${metric.value}`)
  }
}
```

## Choosing
| Scope | What to add |
|-------|-------------|
| MVP | Structured logger + health check (zero deps) |
| Production | Sentry + structured logger + health check + Web Vitals + error boundaries |
