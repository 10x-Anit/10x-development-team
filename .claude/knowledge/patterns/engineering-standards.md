# Engineering Standards Reference

Use this file as the baseline for how experienced teams build, review, and ship software. Agents should follow these standards by default unless the project scope explicitly calls for a lighter process.

## 1. Definition of Done (DoD)

A task is not complete when the code exists. It is complete when the checklist for the current scope passes.

### Simple

- [ ] HTML, CSS, and JavaScript files are present and organized clearly
- [ ] HTML validates and uses semantic structure
- [ ] Links work
- [ ] Layout works on mobile and desktop
- [ ] No console errors
- [ ] Work is logged in `.10x/dev-log.md`

### Prototype

- [ ] App starts locally
- [ ] Main routes render
- [ ] Mock data states work
- [ ] Design tokens are used instead of hardcoded styling
- [ ] No blocking runtime errors
- [ ] Work is logged in `.10x/dev-log.md`

### MVP

- [ ] Build passes
- [ ] Type-check passes
- [ ] Core user flow works end-to-end
- [ ] Validation exists for user input
- [ ] API responses match documented shapes
- [ ] Auth and CRUD happy paths are verified
- [ ] `.env.example` is current
- [ ] Index files and feature map are updated

### Production

- [ ] All quality gates pass
- [ ] Tests pass at the required depth
- [ ] Performance budgets are met
- [ ] Accessibility checks pass
- [ ] Security review is complete
- [ ] Rollback path is documented
- [ ] Monitoring and health checks are ready
- [ ] Smoke tests pass after deployment

## 2. Architecture Decision Records (ADR)

Create ADRs in `.10x/decisions/` for:

- Framework choice
- Database choice
- Auth strategy
- Third-party service integration
- Any non-obvious technical decision

### ADR Template

```md
# ADR-001: [Decision Title]

## Status
Accepted

## Date
2026-04-14

## Context
What problem are we solving? What constraints matter?

## Decision
What was chosen?

## Alternatives Considered
- Option A
- Option B

## Consequences
- Positive:
- Negative:
- Risks:

## Follow-Up
- Actions required:
```

### ADR File Naming

```txt
.10x/decisions/ADR-001-framework-choice.md
.10x/decisions/ADR-002-database-choice.md
```

## 3. Code Quality Gates

Use these gates between build phases. Do not move forward if the current gate fails.

### Gate 1: Post-Scaffold

- Project structure matches template
- Required dependencies installed
- Dev server starts
- `.10x/` index exists and is initialized

Verification commands:

```bash
npm install
npm run dev
```

### Gate 2: Post-Design-System

- Tokens are defined
- Tailwind config is valid
- Dark mode works
- Base typography and spacing scale are established

Verification:

- Review token files
- Check theme switch or system theme behavior
- Render key layout in both light and dark mode

### Gate 3: Post-Frontend

- Build passes
- No hardcoded colors in components
- Loading, empty, and error states exist
- Layout is responsive
- Accessibility basics pass

Verification commands:

```bash
npm run build
npx eslint .
```

### Gate 4: Post-Backend

- Endpoints return correct shapes
- Validation exists
- Errors are user-friendly
- Database migrations run cleanly

Verification commands:

```bash
npx tsc --noEmit
npm test
```

### Gate 5: Post-Integration

- Frontend and backend connect correctly
- Auth works end-to-end
- Core CRUD flow completes
- Shared schemas or contracts match runtime behavior

### Gate 6: Pre-Deploy

- Full build passes
- Tests pass
- No secrets in source
- Env vars documented
- Performance budget met

### Gate Status Template

```json
{
  "id": "task-012",
  "title": "Pre-deploy verification",
  "status": "completed",
  "gate": "release-ready",
  "notes": "Build, lint, test, env documentation, and smoke plan all verified."
}
```

## 4. Performance Budgets by Scope

### Simple

- Page load under `1s`
- Total asset size under `500KB`

### Prototype

- Bundle under `500KB`
- LCP under `2.5s`

### MVP

- Bundle under `300KB` gzipped
- LCP under `2.5s`
- CLS under `0.1`
- FID under `100ms`

### Production

- Lighthouse `90+`
- Bundle under `250KB` gzipped
- LCP under `2s`
- CLS under `0.05`
- FID under `50ms`
- TTFB under `600ms`

### Performance Review Template

```md
## Performance Review

- Scope:
- Bundle size:
- LCP:
- CLS:
- FID:
- TTFB:
- Result: pass / fail
- Follow-up:
```

## 5. Git Workflow Standards

### Commit Message Format

Use:

```txt
type(scope): description
```

Examples:

```txt
feat(auth): add email login flow
fix(api): return consistent error shape
refactor(ui): extract dashboard shell
test(payments): cover webhook signature validation
docs(deploy): add rollback runbook
```

### Allowed Types

- `feat`
- `fix`
- `refactor`
- `style`
- `test`
- `docs`
- `chore`
- `perf`

### Branch Naming

Use:

- `feature/...`
- `fix/...`
- `refactor/...`

Examples:

```txt
feature/user-onboarding
fix/login-redirect-loop
refactor/api-error-handling
```

## 6. Dependency Management Rules

Rules:

- Pin exact versions in production-critical projects
- Run `npm audit` after installs
- Prefer packages with healthy adoption and maintenance
- Do not add a package for something achievable in under ~20 lines
- Check bundle size before adding frontend dependencies

### Dependency Review Checklist

- [ ] Needed for real complexity, not convenience
- [ ] Maintained recently
- [ ] Sane bundle impact
- [ ] Compatible license
- [ ] TypeScript support exists
- [ ] Security posture is acceptable

### Commands

```bash
npm audit
npm view <package-name> version
```

Bundle size check:

- Review [bundlephobia.com](https://bundlephobia.com/) before adding a client-side package

## 7. Environment Variable Safety

Rules:

- NEVER commit `.env`
- ALWAYS keep `.env.example`
- Prefix client-side variables with `NEXT_PUBLIC_`
- Validate env vars at startup
- Document every variable with purpose

### Zod Environment Validation Template

```ts
// src/lib/env.ts
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().min(1),
  NEXTAUTH_SECRET: z.string().min(1),
  NEXTAUTH_URL: z.string().url(),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  SENTRY_DSN: z.string().optional(),
})

export const env = envSchema.parse(process.env)
```

### `.env.example` Template

```env
# Runtime
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database
DATABASE_URL=

# Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000

# Monitoring
SENTRY_DSN=
```

## 8. Error Handling Standards

### Frontend Standards

- Route-level error boundaries
- Toasts for user-triggered failures
- Retry for transient network failures
- Helpful empty and error states

### Backend Standards

- Structured error responses
- Never expose stack traces to users
- Log with context
- Map known errors to stable HTTP status codes

### Standard Error Classes

```ts
// src/lib/errors.ts
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode = 500,
    public code = 'internal_error',
    public details?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 400, 'validation_error', details)
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401, 'unauthorized')
  }
}
```

### Standard API Error Response

```ts
// src/lib/api-error.ts
import { NextResponse } from 'next/server'
import { AppError } from './errors'

export function toErrorResponse(error: unknown) {
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: {
          code: error.code,
          message: error.message,
          details: error.details ?? null,
        },
      },
      { status: error.statusCode }
    )
  }

  console.error(error)

  return NextResponse.json(
    {
      error: {
        code: 'internal_error',
        message: 'Something went wrong',
      },
    },
    { status: 500 }
  )
}
```

### Route-Level Error Boundary

```tsx
// src/app/dashboard/error.tsx
'use client'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <main>
      <h1>We hit a problem</h1>
      <p>{error.message}</p>
      <button onClick={() => reset()}>Try again</button>
    </main>
  )
}
```

## Delivery Standards Summary

Use this as the default posture:

- Document important decisions
- Pass gates before moving phases
- Match test depth to scope
- Stay inside performance budgets
- Keep dependencies intentional
- Treat env vars and secrets carefully
- Return user-friendly errors
- Update `.10x/` indexes so the next agent does not need to rediscover context
