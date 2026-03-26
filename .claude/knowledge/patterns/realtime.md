# Realtime Patterns — Copy-Paste Reference

## Server-Sent Events (SSE) — No Dependencies
```tsx
// src/app/api/events/stream/route.ts
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      // Send event every 2 seconds (replace with your data source)
      const interval = setInterval(async () => {
        const data = { timestamp: Date.now(), value: Math.random() * 100 }
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
      }, 2000)

      // Cleanup when client disconnects
      return () => clearInterval(interval)
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
```

## useEventSource Hook
```tsx
// src/hooks/use-event-source.ts
'use client'
import { useState, useEffect, useRef, useCallback } from 'react'

export function useEventSource<T>(url: string) {
  const [data, setData] = useState<T | null>(null)
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const esRef = useRef<EventSource | null>(null)

  const connect = useCallback(() => {
    const es = new EventSource(url)
    esRef.current = es

    es.onopen = () => { setConnected(true); setError(null) }
    es.onmessage = (event) => { setData(JSON.parse(event.data)) }
    es.onerror = () => {
      setConnected(false)
      setError('Connection lost. Reconnecting...')
      es.close()
      // Auto-reconnect after 3 seconds
      setTimeout(connect, 3000)
    }
  }, [url])

  useEffect(() => {
    connect()
    return () => esRef.current?.close()
  }, [connect])

  return { data, connected, error }
}

// Usage:
// const { data, connected } = useEventSource<{ timestamp: number; value: number }>('/api/events/stream')
```

## Polling Hook (simplest realtime)
```tsx
// src/hooks/use-polling.ts
'use client'
import { useState, useEffect, useCallback } from 'react'

export function usePolling<T>(url: string, intervalMs = 5000) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(url)
      const json = await res.json()
      setData(json.data || json)
      setError(null)
    } catch (err) {
      setError('Failed to fetch')
    } finally {
      setLoading(false)
    }
  }, [url])

  useEffect(() => {
    fetchData() // initial fetch

    const interval = setInterval(() => {
      // Pause when tab is hidden
      if (!document.hidden) fetchData()
    }, intervalMs)

    return () => clearInterval(interval)
  }, [fetchData, intervalMs])

  return { data, loading, error, refetch: fetchData }
}

// Usage:
// const { data: stats, loading } = usePolling<DashboardStats>('/api/stats', 10000) // every 10s
```

## Supabase Realtime
```tsx
// src/hooks/use-supabase-realtime.ts
'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function useSupabaseRealtime<T extends { id: string }>(table: string, initialData: T[] = []) {
  const [data, setData] = useState<T[]>(initialData)

  useEffect(() => {
    const channel = supabase
      .channel(`${table}-changes`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table },
        (payload) => setData(prev => [payload.new as T, ...prev])
      )
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table },
        (payload) => setData(prev => prev.map(item => item.id === (payload.new as T).id ? payload.new as T : item))
      )
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table },
        (payload) => setData(prev => prev.filter(item => item.id !== (payload.old as any).id))
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [table])

  return data
}

// Usage:
// const messages = useSupabaseRealtime<Message>('messages', initialMessages)
```

## WebSocket with Socket.io
```bash
npm install socket.io socket.io-client
```
```tsx
// src/hooks/use-socket.ts
'use client'
import { useState, useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'

export function useSocket<T>(url: string, event: string) {
  const [data, setData] = useState<T | null>(null)
  const [connected, setConnected] = useState(false)
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    const socket = io(url)
    socketRef.current = socket

    socket.on('connect', () => setConnected(true))
    socket.on('disconnect', () => setConnected(false))
    socket.on(event, (payload: T) => setData(payload))

    return () => { socket.disconnect() }
  }, [url, event])

  const emit = (eventName: string, payload: unknown) => {
    socketRef.current?.emit(eventName, payload)
  }

  return { data, connected, emit }
}

// Usage:
// const { data: message, connected, emit } = useSocket<ChatMessage>('http://localhost:3001', 'new-message')
// emit('send-message', { text: 'Hello' })
```

## Live Dashboard Pattern
```tsx
// src/components/live-dashboard.tsx
'use client'
import { usePolling } from '@/hooks/use-polling'

interface DashboardStats {
  activeUsers: number
  revenue: number
  orders: number
  uptime: number
}

export function LiveDashboard() {
  const { data: stats, loading, error } = usePolling<DashboardStats>('/api/stats', 5000)

  if (loading) return <div className="animate-pulse">Loading dashboard...</div>
  if (error || !stats) return <div className="text-red-500">Failed to load stats</div>

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard label="Active Users" value={stats.activeUsers} />
      <StatCard label="Revenue" value={`$${stats.revenue.toLocaleString()}`} />
      <StatCard label="Orders" value={stats.orders} />
      <StatCard label="Uptime" value={`${stats.uptime}%`} />
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  )
}
```

## Choosing
| Need | Pattern | Dependencies |
|------|---------|-------------|
| Simple + no deps | SSE | None |
| Already use Supabase | Supabase Realtime | @supabase/supabase-js |
| Need bidirectional | Socket.io | socket.io + socket.io-client |
| Prototype / MVP | Polling | None |
| Live dashboard | Polling or SSE | None |
