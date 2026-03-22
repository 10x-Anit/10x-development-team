---
name: explain
description: Explain how something works in the project. Reads file index and feature map — never scans the filesystem.
argument-hint: "<what to explain — a feature, file, flow, or concept>"
user-invocable: true
model: inherit
effort: medium
---

# 10x Development Team — Explain

## STEP 0: Check Project Index Exists

Read `.10x/project.json`. If it does not exist, STOP. Tell user: "Run /10x-development-team:start first."

## STEP 1: Read Index Files (MANDATORY)

```
ACTION 1: Read .10x/project.json → scope, stack, vision
ACTION 2: Read .10x/file-index.json → all files and their descriptions
ACTION 3: Read .10x/feature-map.json → feature wiring and data flows
```

## STEP 2: Parse Question

Map `$ARGUMENTS` to the right index source:

| Question type | Where to find the answer |
|--------------|-------------------------|
| "How does [feature] work?" | feature-map.json → find the feature → read wiring.data_flow |
| "What does [file] do?" | file-index.json → find the file → read description + exports |
| "How is the project structured?" | file-index.json → group files by type → show structure |
| "What's the tech stack?" | project.json → stack object |
| "What has been built?" | dev-log.md → summarize + tasks.json → show completed |
| "How do [page] and [api] connect?" | feature-map.json → find feature containing both → read wiring |

## STEP 3: Read Source Files (only if needed)

If the index entry doesn't have enough detail to answer the question:
1. Read the SPECIFIC file mentioned — not the whole directory
2. Read ONLY the relevant section (imports, export, main function)

## STEP 4: Explain to User

Adapt language to the user's level:

### Non-technical user (default):
- Describe what they SEE, not what the code does
- Use analogies
- SAY: "When you click 'Add to Cart', the item gets saved to your browser and appears in the cart icon"
- DO NOT SAY: "The addItem action dispatches to the Zustand store which updates the items array"

### Technical user (if they used technical terms in their question):
- Include file paths, function names, data flow
- SAY: "The checkout flow: `CheckoutForm` submits to `POST /api/checkout` which calls `stripe.checkout.sessions.create()`, then redirects to Stripe's hosted page"

## Rules
1. NEVER scan the filesystem. Use the index.
2. NEVER suggest changes. Just explain.
3. Keep answers SHORT. If user wants more detail, they'll ask.
4. Read MAXIMUM 3 source files to answer any question.

<large-model-instructions>
## Enhanced Explanations (Opus)
- Draw ASCII diagrams for complex data flows
- Explain WHY architectural decisions were made (based on scope)
- Suggest what the user might want to know next
- If explaining a feature, mention its test coverage and edge cases
</large-model-instructions>
