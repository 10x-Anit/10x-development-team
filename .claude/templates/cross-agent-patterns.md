# Cross-Agent Coordination Patterns

How agents communicate through the `.10x/` index system.

---

## Pattern 1: Backend Creates → Frontend Consumes

**Backend-dev** creates an API endpoint and documents it in `file-index.json`:
```json
{
  "src/app/api/products/route.ts": {
    "type": "api",
    "description": "Product CRUD — GET (list with pagination), POST (create)",
    "created_by": "backend-dev",
    "exports": ["GET", "POST"],
    "api_shape": {
      "GET": {
        "query": "?page=1&limit=10&search=term",
        "response": "{ data: Product[], total: number, page: number }"
      },
      "POST": {
        "body": "{ name: string, price: number, description: string }",
        "response": "{ data: Product, error: null }"
      }
    }
  }
}
```

**Frontend-dev** reads this entry from file-index.json and knows exactly:
- What URL to call
- What parameters to send
- What shape the response will be
- No need to read the actual API file

---

## Pattern 2: UI Designer Creates → Frontend Uses

**UI-designer** creates design tokens and documents them:
```json
{
  "tailwind.config.ts": {
    "type": "config",
    "description": "Tailwind config with custom colors: primary (blue-600), secondary (purple-500), neutral scale. Dark mode via class strategy.",
    "created_by": "ui-designer",
    "exports": ["config"],
    "design_tokens": {
      "primary": "blue-600",
      "secondary": "purple-500",
      "background": "white / neutral-900 (dark)",
      "text": "neutral-900 / neutral-100 (dark)"
    }
  }
}
```

**Frontend-dev** reads this and uses the correct token names in all components.

---

## Pattern 3: Frontend Creates → QA Tests

**Frontend-dev** documents what they built:
```json
{
  "src/app/checkout/page.tsx": {
    "type": "page",
    "description": "Checkout page — shipping form, payment via Stripe, order summary",
    "created_by": "frontend-dev",
    "dependencies": ["src/components/checkout-form.tsx", "src/lib/stripe.ts"],
    "user_flows": [
      "Fill shipping → enter payment → click pay → see confirmation",
      "Invalid card → show error message",
      "Empty cart → redirect to /cart"
    ]
  }
}
```

**QA-tester** reads this and knows exactly what flows to test.

---

## Pattern 4: Team Lead Tracks → All Agents Report

**Team-lead** creates tasks with clear goals:
```json
{
  "id": "task-005",
  "title": "Build checkout page",
  "assigned_to": "frontend-dev",
  "status": "pending",
  "goal": "Create checkout page with shipping form, Stripe payment, order summary",
  "expected_output": [
    "src/app/checkout/page.tsx",
    "src/components/checkout-form.tsx",
    "src/components/order-summary.tsx"
  ],
  "dependencies": ["task-003", "task-004"],
  "acceptance_criteria": [
    "Page renders at /checkout",
    "Form validates shipping fields",
    "Stripe Elements loads",
    "Order summary shows cart items and total"
  ]
}
```

Each agent updates their task status and the team-lead can see progress without asking.

---

## Pattern 5: Error Escalation

When an agent hits an error:
1. Log it in `dev-log.md` with the error message
2. Update task status to "blocked" in `tasks.json`
3. The team-lead sees the blocked task and delegates to **error-recovery** agent
4. Error-recovery reads the log, fixes the issue, updates the task to "completed"

---

## The Golden Rule

**The index IS the communication channel.**

Agents never talk to each other directly. They:
1. Write their output to the index
2. Read other agents' output from the index
3. The index is always up to date because hooks enforce it
