---
name: generate
description: Generate a specific piece of code — component, API endpoint, hook, utility, database model, or test. Reads knowledge base, copies exact patterns.
argument-hint: "<type> <name> — e.g. component Button, api /users, hook useAuth, model Product, test UserCard"
user-invocable: true
model: inherit
effort: medium
---

# 10x Development Team — Generate

Targeted code generation. Read knowledge base → copy pattern → adapt to task → write file.

## STEP 0: Read Project Index (MANDATORY)

```
ACTION 1: Read .10x/project.json → extract: scope, stack
ACTION 2: Read .10x/file-index.json → extract: existing files, naming patterns
ACTION 3: Read .claude/knowledge/index.json → find the knowledge file for the generation type
```

If `.10x/` does not exist, STOP. Tell user: "Run /10x-development-team:start first."

## STEP 1: Parse Request

Parse `$ARGUMENTS` into `type` and `name`:

| Input | type | name | Knowledge file to read |
|-------|------|------|----------------------|
| `component Button` | component | Button | `components-source/button.md` |
| `component PricingCard` | component | PricingCard | `components-source/card.md` |
| `api /products` | api | products | `patterns/api-patterns.md` |
| `hook useAuth` | hook | useAuth | `patterns/auth-flow.md` |
| `hook useProducts` | hook | useProducts | `patterns/data-fetching.md` |
| `model Product` | model | Product | `libraries/prisma.md` |
| `test UserCard` | test | UserCard | find UserCard in file-index → write test |
| `form ContactForm` | form | ContactForm | `components-source/form.md` |

If the type is unclear, STOP. Ask: "What should I generate? (component, api, hook, model, test, form)"

## STEP 2: Read Knowledge File

Read the matching knowledge file from `.claude/knowledge/`.

### SMALL context:
COPY the code pattern EXACTLY. Change only the name and fields.

### LARGE context:
Use the pattern as a base. Add TypeScript types, error handling, loading states, and accessibility.

## STEP 3: Generate

### type = "component"
1. Read the matching `components-source/*.md` file
2. COPY the component code
3. Change: component name, props interface, content
4. Write to: `src/components/[name].tsx`
5. FORBIDDEN: writing inside a page directory

### type = "api"
1. Read `patterns/api-patterns.md`
2. COPY the CRUD route pattern
3. Change: resource name, Zod schema fields, service function names
4. Write to: `src/app/api/[name]/route.ts` and `src/app/api/[name]/[id]/route.ts`
5. Write service: `src/lib/services/[name].ts`

### type = "hook"
1. Read `patterns/data-fetching.md`
2. COPY the useFetch hook pattern
3. Change: hook name, return type, URL
4. Write to: `src/hooks/[name].ts`

### type = "model"
1. Read `libraries/prisma.md`
2. COPY the model pattern
3. Change: model name, fields
4. APPEND to: `prisma/schema.prisma`
5. Run: `npx prisma migrate dev --name add-[name]`

### type = "test"
1. Read `.10x/file-index.json` → find the source file for [name]
2. Read the source file
3. Write test based on the component/function signature
4. Write to: `[source-file-dir]/[name].test.ts(x)`

### scope = "simple" overrides:
- component → write HTML section + CSS class (NOT React)
- api → FORBIDDEN. Tell user: "Simple scope has no backend."
- hook → FORBIDDEN. Tell user: "Simple scope uses vanilla JS."
- model → FORBIDDEN. Tell user: "Simple scope has no database."

## STEP 4: Update Index (MANDATORY)

1. Update `.10x/file-index.json` with the new file entry
2. Update `.10x/feature-map.json` if this is part of a feature
3. Append to `.10x/dev-log.md`

Tell user: "Generated [type] [name]. File: [path]."

<large-model-instructions>
## Enhanced Generation (Opus)
- Components: add Framer Motion entrance animation, dark mode support, responsive variants
- APIs: add pagination, sorting, filtering, rate limiting
- Hooks: add retry logic, caching, optimistic updates
- Models: add indexes on frequently queried fields, soft delete support
- Tests: add edge cases, error scenarios, accessibility checks
</large-model-instructions>
