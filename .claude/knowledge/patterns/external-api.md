# External API Patterns — Copy-Paste Reference

## Reusable API Client (API Key Auth)
```tsx
// src/lib/api-client.ts
const BASE_URL = process.env.EXTERNAL_API_URL || 'https://api.example.com'
const API_KEY = process.env.EXTERNAL_API_KEY || ''

interface ApiOptions {
  method?: string
  body?: unknown
  headers?: Record<string, string>
}

export async function apiClient<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY,           // Change header name to match your API
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`API error ${res.status}: ${error}`)
  }

  return res.json()
}

// Usage:
// const users = await apiClient<User[]>('/users')
// const user = await apiClient<User>('/users', { method: 'POST', body: { name: 'Alice' } })
```

## API Client with Bearer Token
```tsx
// src/lib/api-client.ts
export async function apiClient<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const token = process.env.EXTERNAL_API_TOKEN // or get from session
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`)
  return res.json()
}
```

## GraphQL Client
```bash
npm install graphql-request graphql
```
```tsx
// src/lib/graphql-client.ts
import { GraphQLClient, gql } from 'graphql-request'

const endpoint = process.env.GRAPHQL_URL || 'https://api.example.com/graphql'
const token = process.env.GRAPHQL_TOKEN || ''

export const graphqlClient = new GraphQLClient(endpoint, {
  headers: { Authorization: `Bearer ${token}` },
})

// Query example
export async function getUsers() {
  const query = gql`
    query GetUsers {
      users {
        id
        name
        email
      }
    }
  `
  const { users } = await graphqlClient.request<{ users: User[] }>(query)
  return users
}

// Mutation example
export async function createUser(input: { name: string; email: string }) {
  const mutation = gql`
    mutation CreateUser($input: CreateUserInput!) {
      createUser(input: $input) {
        id
        name
      }
    }
  `
  return graphqlClient.request(mutation, { input })
}
```

## Proxy API Route (hide API keys from frontend)
```tsx
// src/app/api/proxy/[...path]/route.ts
// Frontend calls: /api/proxy/users → proxied to https://api.example.com/users
import { NextRequest, NextResponse } from 'next/server'

const BASE_URL = process.env.EXTERNAL_API_URL!
const API_KEY = process.env.EXTERNAL_API_KEY!

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    const path = params.path.join('/')
    const search = request.nextUrl.searchParams.toString()
    const url = `${BASE_URL}/${path}${search ? `?${search}` : ''}`

    const res = await fetch(url, {
      headers: {
        'X-API-Key': API_KEY,
        'Content-Type': 'application/json',
      },
    })

    const data = await res.json()
    return NextResponse.json({ data, error: null })
  } catch (err) {
    return NextResponse.json({ data: null, error: { message: 'Failed to fetch from external API' } }, { status: 502 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    const path = params.path.join('/')
    const body = await request.json()

    const res = await fetch(`${BASE_URL}/${path}`, {
      method: 'POST',
      headers: {
        'X-API-Key': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await res.json()
    return NextResponse.json({ data, error: null }, { status: res.status })
  } catch (err) {
    return NextResponse.json({ data: null, error: { message: 'Failed to post to external API' } }, { status: 502 })
  }
}
```

## Fetch with Retry + Timeout
```tsx
// src/lib/fetch-with-retry.ts
interface RetryOptions {
  retries?: number
  timeout?: number   // ms
  backoff?: number   // initial delay ms
}

export async function fetchWithRetry<T>(url: string, init?: RequestInit, options: RetryOptions = {}): Promise<T> {
  const { retries = 3, timeout = 10000, backoff = 1000 } = options

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), timeout)

      const res = await fetch(url, { ...init, signal: controller.signal })
      clearTimeout(timer)

      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return await res.json()
    } catch (err) {
      if (attempt === retries) throw err
      const delay = backoff * Math.pow(2, attempt) // exponential backoff
      await new Promise(r => setTimeout(r, delay))
    }
  }
  throw new Error('Unreachable')
}

// Usage:
// const data = await fetchWithRetry<User[]>('https://api.example.com/users', {}, { retries: 3, timeout: 5000 })
```

## OAuth2 Machine-to-Machine Token
```tsx
// src/lib/oauth-client.ts
let cachedToken: { token: string; expiresAt: number } | null = null

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token
  }

  const res = await fetch(process.env.OAUTH_TOKEN_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.OAUTH_CLIENT_ID!,
      client_secret: process.env.OAUTH_CLIENT_SECRET!,
      scope: process.env.OAUTH_SCOPE || '',
    }),
  })

  const { access_token, expires_in } = await res.json()
  cachedToken = { token: access_token, expiresAt: Date.now() + (expires_in - 60) * 1000 }
  return access_token
}

// Use in api-client:
export async function apiClientWithOAuth<T>(endpoint: string): Promise<T> {
  const token = await getAccessToken()
  const res = await fetch(`${process.env.EXTERNAL_API_URL}${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.json()
}
```

## Environment Variables
```env
# .env.example — External API Configuration

# REST API
EXTERNAL_API_URL=https://api.example.com
EXTERNAL_API_KEY=your-api-key-here
EXTERNAL_API_TOKEN=your-bearer-token-here

# GraphQL
GRAPHQL_URL=https://api.example.com/graphql
GRAPHQL_TOKEN=your-graphql-token

# OAuth2 (machine-to-machine)
OAUTH_TOKEN_URL=https://auth.example.com/oauth/token
OAUTH_CLIENT_ID=your-client-id
OAUTH_CLIENT_SECRET=your-client-secret
OAUTH_SCOPE=read write
```
