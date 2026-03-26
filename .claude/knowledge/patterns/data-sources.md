# External Data Sources — Copy-Paste Reference

## Supabase (Direct Client — No Prisma)
```bash
npm install @supabase/supabase-js
```
```tsx
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)
```
```tsx
// CRUD Operations

// READ (list)
const { data: products, error } = await supabase
  .from('products')
  .select('*')
  .order('created_at', { ascending: false })
  .range(0, 9) // pagination: first 10

// READ (single)
const { data: product, error } = await supabase
  .from('products')
  .select('*')
  .eq('id', productId)
  .single()

// READ (with filter)
const { data, error } = await supabase
  .from('products')
  .select('*')
  .ilike('name', `%${search}%`)
  .gte('price', minPrice)

// READ (with relations)
const { data, error } = await supabase
  .from('products')
  .select('*, category:categories(name)')

// CREATE
const { data, error } = await supabase
  .from('products')
  .insert({ name: 'Widget', price: 9.99 })
  .select()
  .single()

// UPDATE
const { data, error } = await supabase
  .from('products')
  .update({ price: 14.99 })
  .eq('id', productId)
  .select()
  .single()

// DELETE
const { error } = await supabase
  .from('products')
  .delete()
  .eq('id', productId)

// COUNT
const { count, error } = await supabase
  .from('products')
  .select('*', { count: 'exact', head: true })
```
```tsx
// Realtime subscription
const channel = supabase
  .channel('products-changes')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'products' },
    (payload) => {
      console.log('Change:', payload.eventType, payload.new)
    }
  )
  .subscribe()

// Cleanup
channel.unsubscribe()
```
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Firebase / Firestore
```bash
npm install firebase
```
```tsx
// src/lib/firebase.ts
import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
export const db = getFirestore(app)
```
```tsx
// CRUD Operations
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit } from 'firebase/firestore'
import { db } from '@/lib/firebase'

// READ (list)
const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(10))
const snap = await getDocs(q)
const products = snap.docs.map(d => ({ id: d.id, ...d.data() }))

// READ (filtered)
const q = query(collection(db, 'products'), where('category', '==', 'electronics'), orderBy('price'))
const snap = await getDocs(q)

// READ (single)
const snap = await getDoc(doc(db, 'products', productId))
const product = snap.exists() ? { id: snap.id, ...snap.data() } : null

// CREATE
const ref = await addDoc(collection(db, 'products'), { name: 'Widget', price: 9.99, createdAt: new Date() })
const newId = ref.id

// UPDATE
await updateDoc(doc(db, 'products', productId), { price: 14.99 })

// DELETE
await deleteDoc(doc(db, 'products', productId))
```
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123:web:abc
```

## Airtable (via API route — don't expose key to client)
```bash
npm install airtable
```
```tsx
// src/app/api/airtable/[table]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Airtable from 'airtable'

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID!)

export async function GET(_: NextRequest, { params }: { params: { table: string } }) {
  try {
    const records = await base(params.table).select({ maxRecords: 100, view: 'Grid view' }).all()
    const data = records.map(r => ({ id: r.id, ...r.fields }))
    return NextResponse.json({ data, error: null })
  } catch {
    return NextResponse.json({ data: null, error: { message: 'Failed to fetch from Airtable' } }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { table: string } }) {
  try {
    const body = await request.json()
    const record = await base(params.table).create(body)
    return NextResponse.json({ data: { id: record.id, ...record.fields }, error: null }, { status: 201 })
  } catch {
    return NextResponse.json({ data: null, error: { message: 'Failed to create in Airtable' } }, { status: 500 })
  }
}
```
```env
AIRTABLE_API_KEY=pat_your_token_here
AIRTABLE_BASE_ID=app_your_base_id
```

## Google Sheets (via API route)
```bash
npm install googleapis
```
```tsx
// src/app/api/sheets/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
})

const sheets = google.sheets({ version: 'v4', auth })
const SHEET_ID = process.env.GOOGLE_SHEET_ID!

// READ rows
export async function GET() {
  try {
    const res = await sheets.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range: 'Sheet1!A1:Z1000' })
    const [headers, ...rows] = res.data.values || []
    const data = rows.map(row => Object.fromEntries(headers.map((h: string, i: number) => [h, row[i] || ''])))
    return NextResponse.json({ data, error: null })
  } catch {
    return NextResponse.json({ data: null, error: { message: 'Failed to read sheet' } }, { status: 500 })
  }
}

// WRITE row
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: 'Sheet1!A1',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [Object.values(body)] },
    })
    return NextResponse.json({ data: body, error: null }, { status: 201 })
  } catch {
    return NextResponse.json({ data: null, error: { message: 'Failed to write to sheet' } }, { status: 500 })
  }
}
```
```env
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-sa@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=your-spreadsheet-id
```

## Notion API (via API route)
```bash
npm install @notionhq/client
```
```tsx
// src/app/api/notion/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { Client } from '@notionhq/client'

const notion = new Client({ auth: process.env.NOTION_API_KEY })
const DB_ID = process.env.NOTION_DATABASE_ID!

// READ
export async function GET() {
  try {
    const res = await notion.databases.query({ database_id: DB_ID, sorts: [{ timestamp: 'created_time', direction: 'descending' }] })
    const data = res.results.map((page: any) => ({
      id: page.id,
      ...Object.fromEntries(Object.entries(page.properties).map(([key, val]: [string, any]) => {
        if (val.type === 'title') return [key, val.title[0]?.plain_text || '']
        if (val.type === 'rich_text') return [key, val.rich_text[0]?.plain_text || '']
        if (val.type === 'number') return [key, val.number]
        if (val.type === 'select') return [key, val.select?.name || '']
        if (val.type === 'date') return [key, val.date?.start || '']
        return [key, JSON.stringify(val)]
      }))
    }))
    return NextResponse.json({ data, error: null })
  } catch {
    return NextResponse.json({ data: null, error: { message: 'Failed to query Notion' } }, { status: 500 })
  }
}
```
```env
NOTION_API_KEY=ntn_your_integration_token
NOTION_DATABASE_ID=your-database-id
```

## Choosing Your Data Source

| Situation | Use |
|-----------|-----|
| Already using Supabase | Supabase (direct client) |
| Need realtime + auth + storage | Supabase or Firebase |
| Non-technical team manages data | Airtable or Google Sheets |
| Already using Notion for docs | Notion API |
| Need Google ecosystem | Google Sheets |
| Need maximum flexibility | Supabase |
| Quick prototype with existing data | Airtable or Google Sheets |
