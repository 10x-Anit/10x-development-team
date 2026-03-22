# Toast Notification — Copy-Paste Ready

## Option 1: Sonner (Recommended — install via shadcn)
```bash
npx shadcn@latest add sonner
```

### Setup in Layout
```tsx
// src/app/layout.tsx
import { Toaster } from '@/components/ui/sonner'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html><body>
      {children}
      <Toaster position="top-right" richColors />
    </body></html>
  )
}
```

### Usage Anywhere
```tsx
import { toast } from 'sonner'

// Success
toast.success('Item saved successfully')

// Error
toast.error('Failed to save item')

// Loading → Success
const promise = saveItem(data)
toast.promise(promise, {
  loading: 'Saving...',
  success: 'Saved!',
  error: 'Failed to save',
})

// With action button
toast('Item deleted', {
  action: { label: 'Undo', onClick: () => undoDelete() },
})
```

## Option 2: Custom Toast (No dependencies)
```tsx
// src/components/ui/toast.tsx
'use client'
import { useState, useEffect, createContext, useContext, useCallback } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  message: string
  type: ToastType
}

const icons = {
  success: <CheckCircle className="h-5 w-5 text-green-500" />,
  error: <AlertCircle className="h-5 w-5 text-red-500" />,
  info: <Info className="h-5 w-5 text-blue-500" />,
}

const ToastContext = createContext<{ addToast: (message: string, type?: ToastType) => void }>({ addToast: () => {} })

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now().toString()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000)
  }, [])

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(t => (
          <div key={t.id} className="flex items-center gap-3 rounded-lg border bg-white dark:bg-gray-800 px-4 py-3 shadow-lg animate-in slide-in-from-right">
            {icons[t.type]}
            <span className="text-sm">{t.message}</span>
            <button onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))} className="ml-2"><X className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
```
