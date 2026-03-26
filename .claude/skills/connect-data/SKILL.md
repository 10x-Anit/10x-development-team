---
name: connect-data
description: Connect your app to an external data source — REST API, Supabase, Firebase, Airtable, Google Sheets, Notion, or a local file (CSV/JSON/Excel). Sets up the client, creates API proxy routes, and wires the data into your UI.
argument-hint: "<data source> — e.g. 'my REST API at api.example.com', 'Supabase', 'this CSV file', 'Google Sheets'"
user-invocable: true
model: inherit
effort: medium
context: fork
agent: team-lead
---

# 10x Development Team — Connect Data Source

You are the team lead. The user wants to connect their app to external data they already have.

## Step 0: Read Project Index (MANDATORY)

```
ACTION 1: Read .10x/project.json → extract: scope, stack
ACTION 2: Read .10x/file-index.json → existing files
ACTION 3: Read .10x/tasks.json → context
ACTION 4: Read .10x/feature-map.json → existing features and wiring
```

If `.10x/` does not exist, STOP. Tell user: "Run /10x-development-team:start first."

## Step 1: Identify the Data Source

Parse `$ARGUMENTS`. Map user's words to a source type:

| User says | Source type | Knowledge file |
|-----------|------------|----------------|
| "REST API", "my API", "api.example.com" | external-api | `patterns/external-api.md` |
| "Supabase" | supabase | `patterns/data-sources.md` (Supabase section) |
| "Firebase", "Firestore" | firebase | `patterns/data-sources.md` (Firebase section) |
| "Airtable" | airtable | `patterns/data-sources.md` (Airtable section) |
| "Google Sheets", "spreadsheet" | google-sheets | `patterns/data-sources.md` (Google Sheets section) |
| "Notion" | notion | `patterns/data-sources.md` (Notion section) |
| "CSV file", "JSON file", "Excel" | file | `patterns/file-ingestion.md` |
| Unclear | ASK | "Where does your data live? (REST API, Supabase, Firebase, Airtable, Google Sheets, Notion, or a file like CSV/JSON)" |

DO NOT ask technical follow-ups. If they say "my API", that's enough — you'll create a configurable client.

## Step 2: Gather Minimal Info (ONE question max)

| Source type | Ask (only if not already provided) |
|------------|-----------------------------------|
| external-api | "What's the base URL? (e.g., https://api.example.com)" |
| supabase | Nothing — setup uses env vars |
| firebase | Nothing — setup uses env vars |
| airtable | Nothing — setup uses env vars |
| google-sheets | Nothing — setup uses env vars |
| notion | Nothing — setup uses env vars |
| file | "What kind of file? (CSV, JSON, or Excel)" |

NEVER ask about authentication methods, data schemas, or API documentation. The generated code will be configurable.

## Step 3: Scope-Aware Execution

### scope = "simple"
- Create a `js/data.js` file with fetch() calls to the external source
- Add inline comments showing where to put the API URL
- NO npm packages, NO build tools
- For file sources: create a `data/` folder, tell user to drop their file there
- Load data with vanilla JS fetch or FileReader

### scope = "prototype"
- Install the client library (if needed)
- Create `src/lib/[source].ts` — client singleton
- Create `src/mock/data.ts` with sample data that mirrors the external shape
- Create a toggle: use mock data in dev, real data when env var is set
- Wire into one existing page as proof of concept

### scope = "mvp"
- Install the client library
- Create `src/lib/[source].ts` — client singleton
- Create API proxy route if needed (to hide API keys): `src/app/api/data/[resource]/route.ts`
- Create a custom hook: `src/hooks/use-[source].ts`
- Wire into existing pages that need this data
- Add `.env.example` entries
- Error handling on all fetch calls

### scope = "production"
Everything in MVP, plus:
- Retry logic with exponential backoff
- Request caching (in-memory or Redis)
- Rate limit awareness
- TypeScript types for the data shape (Zod schema)
- Loading + error states on all connected UI
- Connection health check

## Step 4: Create Tasks

Create tasks in `.10x/tasks.json`:

**Task 1** (always): Set up data client
```json
{
  "id": "data-client-001",
  "title": "Set up [source] client — connection + config",
  "assigned_to": "backend-dev",
  "status": "pending",
  "goal": "Create the data source client with environment config"
}
```

**Task 2** (if API proxy needed): Create proxy route
```json
{
  "id": "data-proxy-001",
  "title": "Create API proxy route — hide credentials server-side",
  "assigned_to": "backend-dev",
  "status": "pending",
  "dependencies": ["data-client-001"]
}
```

**Task 3** (always): Wire into UI
```json
{
  "id": "data-ui-001",
  "title": "Connect [source] data to [page/component]",
  "assigned_to": "frontend-dev",
  "status": "pending",
  "dependencies": ["data-client-001"]
}
```

For scope = "simple": skip backend-dev tasks, assign everything to frontend-dev.

## Step 5: Delegate

Follow the standard delegation format from team-lead.md. Pass each agent:
- Their specific task
- The matching knowledge file path
- Relevant file-index entries
- Instruction to update index + dev-log when done

Delegation order:
1. backend-dev → client setup + proxy route
2. frontend-dev → UI wiring + hook creation

For scope = "simple": frontend-dev only.

## Step 6: Verify and Report

After agents complete:
1. Check that the client file exists and has proper env var references
2. Check that `.env.example` is updated with the new variables
3. Run scope-appropriate check (build, dev server, etc.)
4. Update feature-map.json with the new data connection feature

Tell user:
```
Your app is now connected to [source].

What was set up:
- [client file path] — talks to your [source]
- [proxy route if any] — keeps your API keys safe
- [hook/page changes] — your [page name] now shows real data

To configure:
1. Copy .env.example to .env.local
2. Fill in: [list of env vars needed]
3. Run: npm run dev

Your data will appear on [page name].
```

<large-model-instructions>
## Enhanced Data Connection (Opus)
- Generate TypeScript types by inferring from a sample API response (ask user for one endpoint URL, fetch it, infer types)
- Add Zod runtime validation on incoming external data
- Create a data adapter layer: external shape → app shape (so UI never depends on external API structure)
- Add connection status indicator component
- Add automatic retry with user-visible "reconnecting..." state
- Cache strategy: SWR for reads, optimistic updates for writes
- Create seed script that populates local dev with sample data matching the external shape
</large-model-instructions>
