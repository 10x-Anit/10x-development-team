# Testing Strategy & Quality Verification Reference

Use this file when deciding what to test, how deep to test it, and what patterns to copy into a project. Match the test depth to the project scope. Do not overbuild tests for simple projects, and do not under-test production systems.

## 1. Test Pyramid by Scope

### Simple

Manual checklist only:

- Validate HTML structure
- Check links and navigation
- Verify viewport and responsive layout
- Confirm images have alt text
- Confirm JavaScript has no console errors

Manual checklist template:

```md
# Simple Scope Manual Test Checklist

- [ ] HTML validates
- [ ] No broken links
- [ ] Mobile layout works at 320px
- [ ] Desktop layout works at 1024px+
- [ ] Images have alt text
- [ ] No console errors
```

### Prototype

Smoke test only:

- App starts locally
- Routes render
- No console errors
- Basic mock data flow works

Prototype smoke test checklist:

```md
# Prototype Smoke Test

- [ ] `npm run dev` starts
- [ ] Home route renders
- [ ] Main navigation routes render
- [ ] No red screen or uncaught runtime error
- [ ] No console error during basic click path
```

### MVP

Test these areas:

- Unit tests for business logic and utilities
- API integration tests
- Build verification
- Auth and CRUD happy path checks

Minimum MVP commands:

```bash
npm test
npx tsc --noEmit
npm run build
```

### Production

Full pyramid:

- Unit: `70%`
- Integration: `20%`
- E2E: `10%`
- Visual regression
- Accessibility testing
- Performance verification

Production release checklist:

- [ ] Coverage thresholds met
- [ ] Critical API routes integration-tested
- [ ] Signup/login/core flow covered by Playwright
- [ ] Visual regressions checked for core pages
- [ ] Accessibility scan passes
- [ ] Lighthouse or equivalent meets budget

## 2. Unit Test Patterns (Vitest)

Install:

```bash
npm install -D vitest @vitest/coverage-v8 @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

### Service Function Test (CRUD Logic)

```ts
// src/services/todo-service.ts
export interface Todo {
  id: string
  title: string
  completed: boolean
}

export function toggleTodo(todo: Todo): Todo {
  return {
    ...todo,
    completed: !todo.completed,
  }
}
```

```ts
// src/services/todo-service.test.ts
import { describe, expect, it } from 'vitest'
import { toggleTodo } from './todo-service'

describe('toggleTodo', () => {
  it('marks an incomplete todo as complete', () => {
    const result = toggleTodo({
      id: '1',
      title: 'Ship app',
      completed: false,
    })

    expect(result.completed).toBe(true)
  })
})
```

### Utility Function Test

```ts
// src/lib/currency.ts
export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}
```

```ts
// src/lib/currency.test.ts
import { describe, expect, it } from 'vitest'
import { formatCurrency } from './currency'

describe('formatCurrency', () => {
  it('formats USD values', () => {
    expect(formatCurrency(199)).toBe('$199.00')
  })
})
```

### Zod Schema Validation Test

```ts
// src/lib/schemas/signup.ts
import { z } from 'zod'

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})
```

```ts
// src/lib/schemas/signup.test.ts
import { describe, expect, it } from 'vitest'
import { signupSchema } from './signup'

describe('signupSchema', () => {
  it('accepts valid payloads', () => {
    const result = signupSchema.safeParse({
      email: 'user@example.com',
      password: 'strongpass123',
    })

    expect(result.success).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = signupSchema.safeParse({
      email: 'bad-email',
      password: 'strongpass123',
    })

    expect(result.success).toBe(false)
  })
})
```

### React Component Test

```tsx
// src/components/save-button.tsx
type SaveButtonProps = {
  isSaving?: boolean
  onSave: () => void
}

export function SaveButton({ isSaving = false, onSave }: SaveButtonProps) {
  return (
    <button onClick={onSave} disabled={isSaving}>
      {isSaving ? 'Saving...' : 'Save'}
    </button>
  )
}
```

```tsx
// src/components/save-button.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SaveButton } from './save-button'

describe('SaveButton', () => {
  it('calls onSave when clicked', async () => {
    const onSave = vi.fn()
    const user = userEvent.setup()

    render(<SaveButton onSave={onSave} />)
    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(onSave).toHaveBeenCalledTimes(1)
  })
})
```

### Hook Test

```ts
// src/hooks/use-toggle.ts
import { useState } from 'react'

export function useToggle(initial = false) {
  const [value, setValue] = useState(initial)

  function toggle() {
    setValue((current) => !current)
  }

  return { value, toggle }
}
```

```ts
// src/hooks/use-toggle.test.ts
import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useToggle } from './use-toggle'

describe('useToggle', () => {
  it('toggles the value', () => {
    const { result } = renderHook(() => useToggle())

    act(() => {
      result.current.toggle()
    })

    expect(result.current.value).toBe(true)
  })
})
```

## 3. Integration Test Patterns

Install:

```bash
npm install -D supertest
```

### API Route Test (Mock DB)

```ts
// src/app/api/users/route.ts
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const users = await db.user.findMany()
  return NextResponse.json({ users })
}
```

```ts
// src/app/api/users/route.test.ts
import { describe, expect, it, vi } from 'vitest'
import { GET } from './route'

vi.mock('@/lib/db', () => ({
  db: {
    user: {
      findMany: vi.fn().mockResolvedValue([{ id: '1', email: 'a@example.com' }]),
    },
  },
}))

describe('GET /api/users', () => {
  it('returns users', async () => {
    const response = await GET()
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.users).toHaveLength(1)
  })
})
```

### Auth Flow Integration Test

```ts
// src/lib/auth/authorize.test.ts
import { describe, expect, it } from 'vitest'
import { loginSchema } from '@/lib/schemas/login'

describe('login payload', () => {
  it('rejects invalid credentials payload', () => {
    const result = loginSchema.safeParse({ email: '', password: '' })
    expect(result.success).toBe(false)
  })
})
```

### Database Operation Test

Use a test database or transaction wrapper.

```ts
// src/lib/db/user-repo.test.ts
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL,
    },
  },
})

describe('user repository', () => {
  beforeAll(async () => {
    await prisma.user.deleteMany()
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  it('creates and reads a user', async () => {
    const created = await prisma.user.create({
      data: { email: 'user@example.com' },
    })

    const found = await prisma.user.findUnique({
      where: { id: created.id },
    })

    expect(found?.email).toBe('user@example.com')
  })
})
```

### End-to-End API Endpoint Test

```ts
// tests/api.users.integration.test.ts
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createServer } from 'http'
import { fetch } from 'undici'
import next from 'next'

let server: ReturnType<typeof createServer>
let baseUrl = ''

beforeAll(async () => {
  const app = next({ dev: false, dir: process.cwd() })
  await app.prepare()

  const handler = app.getRequestHandler()
  server = createServer((req, res) => handler(req, res))

  await new Promise<void>((resolve) => {
    server.listen(0, () => {
      const address = server.address()
      if (address && typeof address === 'object') {
        baseUrl = `http://127.0.0.1:${address.port}`
      }
      resolve()
    })
  })
})

afterAll(async () => {
  await new Promise<void>((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()))
  })
})

describe('GET /api/users', () => {
  it('returns 200', async () => {
    const response = await fetch(`${baseUrl}/api/users`)
    expect(response.status).toBe(200)
  })
})
```

## 4. E2E Test Patterns (Playwright)

Install:

```bash
npm install -D @playwright/test
npx playwright install
```

### Playwright Config

```ts
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 13'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

### Critical Path Test

```ts
// tests/e2e/auth-and-core-flow.spec.ts
import { expect, test } from '@playwright/test'

test('signup -> login -> core action -> logout', async ({ page }) => {
  await page.goto('/signup')
  await page.getByLabel('Email').fill('new-user@example.com')
  await page.getByLabel('Password').fill('strongpass123')
  await page.getByRole('button', { name: 'Create account' }).click()

  await expect(page).toHaveURL(/dashboard/)

  await page.getByRole('button', { name: 'New project' }).click()
  await page.getByLabel('Project name').fill('Launch plan')
  await page.getByRole('button', { name: 'Save' }).click()
  await expect(page.getByText('Launch plan')).toBeVisible()

  await page.getByRole('button', { name: 'Logout' }).click()
  await expect(page).toHaveURL(/login/)
})
```

### Form Validation Test

```ts
import { expect, test } from '@playwright/test'

test('shows validation errors on invalid form submit', async ({ page }) => {
  await page.goto('/login')
  await page.getByRole('button', { name: 'Login' }).click()

  await expect(page.getByText('Email is required')).toBeVisible()
  await expect(page.getByText('Password is required')).toBeVisible()
})
```

### Navigation and Routing Test

```ts
import { expect, test } from '@playwright/test'

test('main navigation routes render', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Pricing' }).click()
  await expect(page).toHaveURL(/pricing/)
  await expect(page.getByRole('heading', { name: 'Pricing' })).toBeVisible()
})
```

### Responsive Breakpoint Test

```ts
import { expect, test } from '@playwright/test'

test('mobile navigation works', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Open menu' }).click()
  await expect(page.getByRole('link', { name: 'Features' })).toBeVisible()
})
```

### Visual Regression Template

```ts
import { expect, test } from '@playwright/test'

test('homepage visual regression', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveScreenshot('homepage.png', {
    fullPage: true,
  })
})
```

## 5. API Contract Testing

The backend response shape and frontend expectation must stay aligned.

### Contract Test Using `file-index.json`

```ts
// tests/contracts/users.contract.test.ts
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { z } from 'zod'

const fileIndexPath = join(process.cwd(), '.10x', 'file-index.json')
const fileIndex = JSON.parse(readFileSync(fileIndexPath, 'utf-8'))

const usersApi = fileIndex.files['src/app/api/users/route.ts']
const documentedShape = usersApi.api_shape?.response

const usersResponseSchema = z.object({
  users: z.array(
    z.object({
      id: z.string(),
      email: z.string().email(),
    })
  ),
})

describe('users API contract', () => {
  it('has a documented api_shape', () => {
    expect(documentedShape).toBeTruthy()
  })

  it('matches the runtime schema', () => {
    expect(usersResponseSchema.safeParse(documentedShape?.example ?? { users: [] }).success).toBe(true)
  })
})
```

### Frontend Fetch Shape Verification

```ts
// src/lib/contracts/users.ts
import { z } from 'zod'

export const usersResponseSchema = z.object({
  users: z.array(
    z.object({
      id: z.string(),
      email: z.string().email(),
    })
  ),
})
```

```ts
// src/lib/api/get-users.ts
import { usersResponseSchema } from '@/lib/contracts/users'

export async function getUsers() {
  const response = await fetch('/api/users')
  const data = await response.json()
  return usersResponseSchema.parse(data)
}
```

### Contract Verification Checklist

- Every frontend fetch parses a schema
- Every backend route documents `api_shape`
- Error response shapes are also documented
- Contract changes update producer and consumer together

## 6. Security Testing Checklist

Test these areas:

- XSS: user input is sanitized
- SQL injection: parameterized queries only
- CSRF: mutation routes protected
- Auth bypass: protected routes reject anonymous access
- Rate limiting: API limits trigger correctly

### XSS Test Example

```ts
import { describe, expect, it } from 'vitest'
import { sanitizeRichText } from '@/lib/input'

describe('sanitizeRichText', () => {
  it('removes script tags', () => {
    const result = sanitizeRichText('<script>alert(1)</script><p>Hello</p>')
    expect(result).not.toContain('<script>')
    expect(result).toContain('<p>Hello</p>')
  })
})
```

### Auth Bypass Test Example

```ts
import { describe, expect, it } from 'vitest'
import { GET } from '@/app/api/account/route'

describe('GET /api/account', () => {
  it('rejects unauthenticated requests', async () => {
    const response = await GET()
    expect([401, 403]).toContain(response.status)
  })
})
```

### Rate Limiting Test Example

```ts
import { describe, expect, it } from 'vitest'
import { rateLimit } from '@/lib/rate-limit'

describe('rateLimit', () => {
  it('blocks after the limit is reached', () => {
    const key = 'ip:test'

    for (let index = 0; index < 10; index += 1) {
      rateLimit(key, 10, 60000)
    }

    const result = rateLimit(key, 10, 60000)
    expect(result.success).toBe(false)
  })
})
```

### Security Command Pack

```bash
npm audit --audit-level=high
git grep -nE "(sk_live_|pk_live_|AKIA|ghp_|BEGIN PRIVATE KEY)"
npx eslint .
```

## 7. Accessibility Testing

Install:

```bash
npm install -D vitest-axe axe-core
```

### axe-core Integration

```ts
// src/components/login-form.a11y.test.tsx
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { axe, toHaveNoViolations } from 'vitest-axe'
import { LoginForm } from './login-form'

expect.extend(toHaveNoViolations)

describe('LoginForm accessibility', () => {
  it('has no detectable axe violations', async () => {
    const { container } = render(<LoginForm />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
```

### Keyboard Navigation Test

```ts
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Modal } from './modal'

describe('Modal keyboard navigation', () => {
  it('moves focus with keyboard', async () => {
    const user = userEvent.setup()

    render(<Modal open onClose={() => {}} title="Settings">Content</Modal>)
    await user.tab()

    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus()
  })
})
```

### Screen Reader Compatibility Checklist

- Labels exist for all inputs
- Buttons have accessible names
- Landmarks use semantic HTML
- Modals have `role="dialog"` and `aria-modal="true"`
- Tabs, lists, comboboxes, and tables expose ARIA roles correctly

### Color Contrast Verification

- Verify design tokens pass WCAG AA
- Avoid color-only state indicators
- Test focus indicators in both light and dark mode

## 8. Performance Testing

### Bundle Analysis

For Next.js:

```bash
ANALYZE=true npm run build
```

Interpretation:

- Large shared chunk: too much framework or utility code in common bundle
- Large route chunk: heavy page-specific imports
- Multiple duplicate dependencies: dedupe or remove overlap

### Lighthouse CI Template

```json
{
  "ci": {
    "collect": {
      "url": ["http://127.0.0.1:3000/"],
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }]
      }
    }
  }
}
```

### Core Web Vitals Monitoring

```ts
// src/app/reportWebVitals.ts
export function reportWebVitals(metric: { name: string; value: number }) {
  if (process.env.NODE_ENV === 'production') {
    console.log(JSON.stringify({ type: 'web-vital', ...metric }))
  }
}
```

### Load Time Budget Verification

Recommended targets:

- LCP under `2.5s`
- CLS under `0.1`
- TTFB under `800ms`
- Initial JS under agreed budget

## 9. Test Configuration Templates

### `vitest.config.ts` for Next.js

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./setupTests.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### `setupTests.ts`

```ts
// setupTests.ts
import '@testing-library/jest-dom'
```

### `playwright.config.ts`

```ts
// playwright.config.ts
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:3000',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

### Coverage Threshold Policy

Use these defaults:

- Production: `80%` minimum overall
- MVP: test critical paths, even if overall coverage is lower
- Prototype: smoke tests only
- Simple: manual checks only

## Recommended Test Command Packs

### MVP

```bash
npm test
npx tsc --noEmit
npm run build
```

### Production

```bash
npx eslint .
npx tsc --noEmit
npm test -- --coverage
npm run build
npx playwright test
```
