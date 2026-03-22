# Coding Standards — 10x Development Team

All agents follow these standards. Adapted per scope.

---

## Simple (HTML/CSS/JS)

### HTML
- Semantic elements: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`
- Every `<img>` has `alt` text
- Every page has `<meta viewport>` and `<meta charset>`
- Use `<button>` for actions, `<a>` for navigation
- IDs for JavaScript hooks, classes for CSS styling

### CSS
- CSS custom properties for colors, fonts, spacing (`:root {}`)
- Mobile-first: base styles for mobile, `@media (min-width: 768px)` for tablet+
- One stylesheet: `css/styles.css`
- Class naming: `.section-hero`, `.card-pricing`, `.btn-primary` (BEM-like)
- No `!important` unless overriding third-party styles

### JavaScript
- `const` by default, `let` when reassignment needed, never `var`
- Event delegation where possible
- `DOMContentLoaded` before DOM access
- No inline event handlers (`onclick=`)
- Functions: descriptive names, single responsibility

---

## Prototype (Vite + React)

Everything in Simple, plus:
- Functional components only (no classes)
- Props destructured in function signature
- One component per file
- File names: PascalCase for components (`Button.tsx`), camelCase for utils (`formatDate.ts`)
- Inline styles or Tailwind utilities — don't over-organize
- Mock data in `src/mock/` — clearly fake but realistic

---

## MVP (Next.js)

Everything in Prototype, plus:
- TypeScript for all files
- Props typed with `interface` (not `type` for component props)
- API routes: validate input with Zod
- Database: Prisma models or Supabase tables
- Auth: session-based, check on protected pages
- Error handling: try/catch on async operations
- Environment variables: `process.env.NEXT_PUBLIC_*` for client, `process.env.*` for server

### File Organization
```
src/components/   → reusable UI (Button, Card, Modal)
src/app/          → pages and layouts
src/lib/          → utilities, API clients, DB connection
src/lib/services/ → business logic per resource
src/hooks/        → custom React hooks
src/types/        → shared TypeScript interfaces
```

### Naming
- Components: `PascalCase.tsx`
- Utilities: `camelCase.ts`
- API routes: `route.ts` in named folders
- Types: `PascalCase` for interfaces, `camelCase` for functions
- Constants: `UPPER_SNAKE_CASE`

---

## Production

Everything in MVP, plus:

### Code Quality
- No `any` type — use `unknown` + type guards
- No `console.log` in production code (use proper logger)
- No hardcoded strings for user-facing text (prepare for i18n)
- Error boundaries at route level
- Loading states for all async operations
- Empty states for all lists/tables

### API Standards
- Consistent response shape: `{ data, error }`
- HTTP status codes: 200, 201, 400, 401, 403, 404, 500
- Rate limiting on public endpoints
- Input sanitization on all user input
- Parameterized queries only (never string concatenation)

### Performance
- Images: next/image with proper sizes
- Code splitting: dynamic imports for heavy components
- Memoization: `useMemo`/`useCallback` only when measured necessary
- Bundle analysis: check for large imports

### Security
- CORS configured per environment
- CSP headers set
- No secrets in client-side code
- Auth tokens in httpOnly cookies (not localStorage)
- SQL injection prevention (parameterized queries)
- XSS prevention (React handles by default, be careful with `dangerouslySetInnerHTML`)

### Testing
- Unit tests: one per component/function
- Integration tests: one per API endpoint
- Test files: `[name].test.ts` next to source
- Minimum coverage: critical business logic paths
- Test naming: `it('should [expected behavior] when [condition]')`

### Accessibility (WCAG AA)
- All interactive elements keyboard accessible
- Focus visible indicators
- `aria-label` on icon-only buttons
- Color contrast: 4.5:1 for text, 3:1 for large text
- Form inputs have associated labels
- Error messages linked with `aria-describedby`
- Skip-to-content link
- Page titles and heading hierarchy (h1 → h2 → h3, no skips)
