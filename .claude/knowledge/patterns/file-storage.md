# File Storage Patterns — Copy-Paste Reference

## S3-Compatible Client Setup
```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```
```tsx
// src/lib/storage.ts
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export const s3 = new S3Client({
  region: process.env.S3_REGION || 'auto',
  endpoint: process.env.S3_ENDPOINT,                // Change for R2/MinIO
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
})

const BUCKET = process.env.S3_BUCKET!

export async function uploadFile(key: string, body: Buffer, contentType: string) {
  await s3.send(new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: body, ContentType: contentType }))
  return `${process.env.S3_PUBLIC_URL || process.env.S3_ENDPOINT}/${BUCKET}/${key}`
}

export async function getPresignedUploadUrl(key: string, contentType: string, expiresIn = 3600) {
  const command = new PutObjectCommand({ Bucket: BUCKET, Key: key, ContentType: contentType })
  return getSignedUrl(s3, command, { expiresIn })
}

export async function deleteFile(key: string) {
  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }))
}
```
```env
S3_ENDPOINT=https://your-account.r2.cloudflarestorage.com  # or https://s3.amazonaws.com
S3_BUCKET=your-bucket-name
S3_ACCESS_KEY=your-access-key
S3_SECRET_KEY=your-secret-key
S3_REGION=auto
S3_PUBLIC_URL=https://pub-xxx.r2.dev  # optional: public URL for the bucket
```

## Presigned URL Upload (recommended)
```tsx
// src/app/api/upload/presign/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPresignedUploadUrl } from '@/lib/storage'
import { randomUUID } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { fileName, contentType } = await request.json()
    const ext = fileName.split('.').pop()
    const key = `uploads/${randomUUID()}.${ext}`
    const url = await getPresignedUploadUrl(key, contentType)

    return NextResponse.json({ data: { url, key }, error: null })
  } catch {
    return NextResponse.json({ data: null, error: { message: 'Failed to generate upload URL' } }, { status: 500 })
  }
}
```
```tsx
// Client-side: upload using presigned URL
async function uploadFile(file: File) {
  // 1. Get presigned URL
  const res = await fetch('/api/upload/presign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileName: file.name, contentType: file.type }),
  })
  const { data: { url, key } } = await res.json()

  // 2. Upload directly to S3
  await fetch(url, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } })

  // 3. Return the key (save this in your database)
  return key
}
```

## Direct Upload API Route
```tsx
// src/app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { uploadFile } from '@/lib/storage'
import { randomUUID } from 'crypto'

const MAX_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    if (!file) return NextResponse.json({ error: { message: 'No file' } }, { status: 400 })
    if (file.size > MAX_SIZE) return NextResponse.json({ error: { message: 'File too large' } }, { status: 400 })

    const ext = file.name.split('.').pop()
    const key = `uploads/${randomUUID()}.${ext}`
    const buffer = Buffer.from(await file.arrayBuffer())
    const url = await uploadFile(key, buffer, file.type)

    return NextResponse.json({ data: { url, key, name: file.name, size: file.size }, error: null })
  } catch {
    return NextResponse.json({ data: null, error: { message: 'Upload failed' } }, { status: 500 })
  }
}
```

## Supabase Storage (simpler alternative)
```tsx
// Uses the same @supabase/supabase-js from data-sources.md
import { supabase } from '@/lib/supabase'

const BUCKET = 'uploads' // create this bucket in Supabase dashboard

// Upload
const { data, error } = await supabase.storage
  .from(BUCKET)
  .upload(`${Date.now()}-${file.name}`, file)

// Get public URL
const { data: { publicUrl } } = supabase.storage
  .from(BUCKET)
  .getPublicUrl(data!.path)

// Delete
const { error } = await supabase.storage
  .from(BUCKET)
  .remove(['path/to/file.jpg'])
```

## Upload Component (React)
```tsx
// src/components/file-upload.tsx
'use client'
import { useState, useRef } from 'react'

interface FileUploadProps {
  onUpload: (result: { url: string; key: string }) => void
  accept?: string
  maxSizeMB?: number
}

export function FileUpload({ onUpload, accept = 'image/*', maxSizeMB = 5 }: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    if (file.size > maxSizeMB * 1024 * 1024) { setError(`Max ${maxSizeMB}MB`); return }
    setError(null)
    setUploading(true)
    setProgress(0)

    // Show preview for images
    if (file.type.startsWith('image/')) {
      setPreview(URL.createObjectURL(file))
    }

    try {
      // Get presigned URL
      const res = await fetch('/api/upload/presign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name, contentType: file.type }),
      })
      const { data } = await res.json()

      // Upload
      await fetch(data.url, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } })
      setProgress(100)
      onUpload({ url: data.url.split('?')[0], key: data.key })
    } catch {
      setError('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
      className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
    >
      <input ref={inputRef} type="file" accept={accept} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }} className="hidden" />
      {preview && <img src={preview} alt="Preview" className="w-20 h-20 object-cover rounded mx-auto mb-2" />}
      {uploading ? (
        <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} /></div>
      ) : (
        <p className="text-gray-500">Drop file or click to upload</p>
      )}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}
```
