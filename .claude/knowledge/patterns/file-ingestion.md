# File Ingestion Patterns — Copy-Paste Reference

## CSV Parsing (papaparse)
```bash
npm install papaparse && npm install -D @types/papaparse
```
```tsx
// Client-side: file input → parse → state
'use client'
import Papa from 'papaparse'
import { useState } from 'react'

export function CsvUploader({ onData }: { onData: (rows: Record<string, string>[]) => void }) {
  const [headers, setHeaders] = useState<string[]>([])

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setHeaders(results.meta.fields || [])
        onData(results.data as Record<string, string>[])
      },
      error: (err) => console.error('CSV parse error:', err.message),
    })
  }

  return <input type="file" accept=".csv" onChange={handleFile} />
}
```
```tsx
// Server-side: API route that accepts CSV upload
// src/app/api/upload/csv/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Papa from 'papaparse'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    if (!file) return NextResponse.json({ error: { message: 'No file' } }, { status: 400 })

    const text = await file.text()
    const { data, meta } = Papa.parse(text, { header: true, skipEmptyLines: true })

    return NextResponse.json({ data, headers: meta.fields, count: data.length, error: null })
  } catch {
    return NextResponse.json({ data: null, error: { message: 'Failed to parse CSV' } }, { status: 500 })
  }
}
```

## JSON File Loading
```tsx
// Client-side: file input → parse → state
'use client'
import { useState } from 'react'

export function JsonUploader({ onData }: { onData: (data: unknown) => void }) {
  const [error, setError] = useState<string | null>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string)
        onData(parsed)
        setError(null)
      } catch {
        setError('Invalid JSON file')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div>
      <input type="file" accept=".json" onChange={handleFile} />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}
```

## Excel Parsing (SheetJS)
```bash
npm install xlsx
```
```tsx
// Client-side: file → parse workbook → extract sheet → JSON
'use client'
import * as XLSX from 'xlsx'

export function ExcelUploader({ onData }: { onData: (rows: Record<string, unknown>[]) => void }) {
  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target!.result as ArrayBuffer)
      const workbook = XLSX.read(data, { type: 'array' })
      const sheetName = workbook.SheetNames[0] // first sheet
      const sheet = workbook.Sheets[sheetName]
      const rows = XLSX.utils.sheet_to_json(sheet)
      onData(rows as Record<string, unknown>[])
    }
    reader.readAsArrayBuffer(file)
  }

  return <input type="file" accept=".xlsx,.xls" onChange={handleFile} />
}
```

## Drag-and-Drop File Upload + Auto-Parse
```tsx
// src/components/file-drop-zone.tsx
'use client'
import { useState, useCallback } from 'react'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'

interface FileDropZoneProps {
  onData: (data: Record<string, unknown>[], fileName: string) => void
}

export function FileDropZone({ onData }: FileDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const parseFile = useCallback(async (file: File) => {
    setFileName(file.name)
    setError(null)
    const ext = file.name.split('.').pop()?.toLowerCase()

    try {
      if (ext === 'csv') {
        const text = await file.text()
        const { data } = Papa.parse(text, { header: true, skipEmptyLines: true })
        onData(data as Record<string, unknown>[], file.name)
      } else if (ext === 'json') {
        const text = await file.text()
        const parsed = JSON.parse(text)
        const rows = Array.isArray(parsed) ? parsed : [parsed]
        onData(rows, file.name)
      } else if (ext === 'xlsx' || ext === 'xls') {
        const buffer = await file.arrayBuffer()
        const wb = XLSX.read(new Uint8Array(buffer), { type: 'array' })
        const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
        onData(rows as Record<string, unknown>[], file.name)
      } else {
        setError('Unsupported file type. Use CSV, JSON, or Excel.')
      }
    } catch {
      setError('Failed to parse file. Check the format.')
    }
  }, [onData])

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) parseFile(f) }}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
    >
      <input type="file" accept=".csv,.json,.xlsx,.xls" onChange={(e) => { const f = e.target.files?.[0]; if (f) parseFile(f) }} className="hidden" id="file-input" />
      <label htmlFor="file-input" className="cursor-pointer">
        <p className="text-gray-600">{fileName || 'Drop a file here or click to upload'}</p>
        <p className="text-sm text-gray-400 mt-1">CSV, JSON, or Excel</p>
      </label>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  )
}
```

## Local Data File as App Source
```tsx
// Put your data file in: public/data/items.json
// Fetch on page load — works for prototype scope

// src/hooks/use-local-data.ts
'use client'
import { useState, useEffect } from 'react'

export function useLocalData<T>(fileName: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/data/${fileName}`)
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [fileName])

  return { data, loading }
}

// Usage:
// const { data: products, loading } = useLocalData<Product[]>('products.json')
```

## Upload API Route (multipart form data)
```tsx
// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'

const MAX_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['text/csv', 'application/json', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) return NextResponse.json({ error: { message: 'No file provided' } }, { status: 400 })
    if (file.size > MAX_SIZE) return NextResponse.json({ error: { message: 'File too large (max 5MB)' } }, { status: 400 })
    if (!ALLOWED_TYPES.includes(file.type)) return NextResponse.json({ error: { message: 'Invalid file type' } }, { status: 400 })

    const buffer = Buffer.from(await file.arrayBuffer())
    // Process buffer based on file type, or save to storage
    // For now, return file info:
    return NextResponse.json({
      data: { name: file.name, size: file.size, type: file.type },
      error: null,
    })
  } catch {
    return NextResponse.json({ data: null, error: { message: 'Upload failed' } }, { status: 500 })
  }
}
```
