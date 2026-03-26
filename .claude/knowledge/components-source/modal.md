# Modal Component -- Production-Quality, Copy-Paste Ready

> Uses ONLY semantic design tokens. NEVER use `text-white`, `bg-gray-*`, `bg-blue-*`, etc.

---

## React + Tailwind (MVP/Production Scope)

### Core Modal Component

```tsx
// src/components/ui/modal.tsx
'use client'
import { useEffect, useRef, useCallback } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

// --- TypeScript Interfaces ---

export interface ModalProps {
  /** Modal title */
  title: string
  /** Optional description below the title */
  description?: string
  /** Controls visibility */
  isOpen: boolean
  /** Called when the modal should close */
  onClose: () => void
  /** Content body */
  children: React.ReactNode
  /** Footer actions (buttons) */
  actions?: React.ReactNode
  /** Size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  /** Prevent closing by clicking backdrop or pressing Escape */
  preventClose?: boolean
}

// --- Size Map ---

const sizeMap = {
  sm:   'max-w-sm',
  md:   'max-w-lg',
  lg:   'max-w-2xl',
  xl:   'max-w-4xl',
  full: 'max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]',
}

// --- Component ---

export function Modal({
  title,
  description,
  isOpen,
  onClose,
  children,
  actions,
  size = 'md',
  preventClose = false,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !preventClose) onClose()
    },
    [onClose, preventClose]
  )

  // Lock body scroll + focus trap
  useEffect(() => {
    if (!isOpen) return

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    // Focus the first focusable element
    const focusable = contentRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    if (focusable?.length) focusable[0].focus()

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === overlayRef.current && !preventClose) onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby={description ? 'modal-description' : undefined}
    >
      <div
        ref={contentRef}
        className={cn(
          'w-full rounded-xl border border-border bg-card shadow-xl animate-scale-in',
          sizeMap[size]
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-4">
          <div>
            <h2 id="modal-title" className="text-lg font-semibold text-card-foreground">
              {title}
            </h2>
            {description && (
              <p id="modal-description" className="mt-1 text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          {!preventClose && (
            <button
              onClick={onClose}
              className={cn(
                'shrink-0 rounded-md p-1.5 transition-colors',
                'text-muted-foreground hover:text-foreground hover:bg-accent',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
              )}
              aria-label="Close dialog"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="max-h-[60vh] overflow-y-auto px-6 py-4">
          {children}
        </div>

        {/* Footer */}
        {actions && (
          <div className="flex items-center justify-end gap-2 border-t border-border px-6 py-4 bg-muted/30">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}
```

### Confirm Dialog Variant

```tsx
// src/components/ui/confirm-dialog.tsx
'use client'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'destructive' | 'primary'
  loading?: boolean
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'destructive',
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      actions={
        <>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant={variant} onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex gap-4">
        {variant === 'destructive' && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </div>
        )}
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Modal>
  )
}
```

### Drawer Variant (slides from right)

```tsx
// src/components/ui/drawer.tsx
'use client'
import { useEffect, useRef, useCallback } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DrawerProps {
  title: string
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  /** Which side to slide from */
  side?: 'right' | 'left'
  /** Width class */
  width?: string
}

export function Drawer({
  title,
  isOpen,
  onClose,
  children,
  side = 'right',
  width = 'w-full max-w-md',
}: DrawerProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() },
    [onClose]
  )

  useEffect(() => {
    if (!isOpen) return
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div
        className={cn(
          'absolute inset-y-0 flex flex-col border-border bg-card shadow-xl',
          width,
          side === 'right'
            ? 'right-0 border-l animate-slide-in-right'
            : 'left-0 border-r animate-slide-in-left'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4 shrink-0">
          <h2 id="drawer-title" className="text-lg font-semibold text-card-foreground">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Close drawer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {children}
        </div>
      </div>
    </div>
  )
}
```

### Framer Motion Enhanced Modal (LARGE context / Production)

```tsx
// src/components/ui/motion-modal.tsx
'use client'
import { useEffect, useRef, useCallback } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface MotionModalProps {
  title: string
  description?: string
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  actions?: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const sizeMap = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
}

export function MotionModal({ title, description, isOpen, onClose, children, actions, size = 'md' }: MotionModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() },
    [onClose]
  )

  useEffect(() => {
    if (!isOpen) return
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleKeyDown])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="motion-modal-title">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={cn('relative w-full rounded-xl border border-border bg-card shadow-xl', sizeMap[size])}
          >
            <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-4">
              <div>
                <h2 id="motion-modal-title" className="text-lg font-semibold text-card-foreground">{title}</h2>
                {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
              </div>
              <button
                onClick={onClose}
                className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto px-6 py-4">{children}</div>
            {actions && (
              <div className="flex items-center justify-end gap-2 border-t border-border px-6 py-4 bg-muted/30">{actions}</div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
```

### Usage Examples

```tsx
import { useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Drawer } from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'

// Basic modal
const [open, setOpen] = useState(false)

<Button onClick={() => setOpen(true)}>Open Modal</Button>
<Modal
  title="Edit Profile"
  description="Make changes to your profile information."
  isOpen={open}
  onClose={() => setOpen(false)}
  actions={
    <>
      <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
      <Button onClick={() => { /* save */ setOpen(false) }}>Save</Button>
    </>
  }
>
  <div className="space-y-4">
    <Input label="Name" defaultValue="John" />
    <Input label="Email" defaultValue="john@example.com" />
  </div>
</Modal>

// Confirm dialog
<ConfirmDialog
  isOpen={confirmOpen}
  onClose={() => setConfirmOpen(false)}
  onConfirm={handleDelete}
  title="Delete item?"
  description="This action cannot be undone. The item and all its data will be permanently deleted."
  confirmLabel="Delete"
  variant="destructive"
/>

// Drawer
<Drawer title="Notifications" isOpen={drawerOpen} onClose={() => setDrawerOpen(false)}>
  <div className="space-y-4">
    <p className="text-sm text-muted-foreground">You have 3 new notifications.</p>
  </div>
</Drawer>
```

---

## HTML/CSS (Simple Scope)

```html
<!-- Modal trigger -->
<button class="btn btn-primary" onclick="openModal('demo-modal')">Open Modal</button>

<!-- Modal -->
<div class="modal-overlay" id="demo-modal" hidden role="dialog" aria-modal="true" aria-labelledby="demo-modal-title">
  <div class="modal-panel modal-md">
    <div class="modal-header">
      <h2 id="demo-modal-title" class="modal-title">Edit Profile</h2>
      <button class="modal-close" onclick="closeModal('demo-modal')" aria-label="Close">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="modal-body">
      <div class="form-field">
        <label for="modal-name" class="form-label">Name</label>
        <input type="text" id="modal-name" class="form-input" value="John" />
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline" onclick="closeModal('demo-modal')">Cancel</button>
      <button class="btn btn-primary">Save</button>
    </div>
  </div>
</div>
```

```css
/* css/components/modal.css */

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  animation: modal-fade-in 0.15s ease-out;
}

.modal-overlay[hidden] { display: none; }

.modal-panel {
  width: 100%;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  animation: modal-scale-in 0.2s ease-out;
}

.modal-sm  { max-width: 24rem; }
.modal-md  { max-width: 32rem; }
.modal-lg  { max-width: 42rem; }

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-4) var(--space-6);
  border-bottom: 1px solid var(--color-border);
}

.modal-title {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
}

.modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.375rem;
  background: none;
  border: none;
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  cursor: pointer;
  transition: background var(--transition-fast), color var(--transition-fast);
}

.modal-close:hover { background: var(--color-bg-alt); color: var(--color-text); }
.modal-close:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; }

.modal-body {
  padding: var(--space-4) var(--space-6);
  max-height: 60vh;
  overflow-y: auto;
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-2);
  padding: var(--space-4) var(--space-6);
  border-top: 1px solid var(--color-border);
  background: var(--color-bg-alt);
  border-radius: 0 0 var(--radius-xl) var(--radius-xl);
}

@keyframes modal-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes modal-scale-in {
  from { opacity: 0; transform: scale(0.95) translateY(8px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
```

```js
// js/modal.js
function openModal(id) {
  const modal = document.getElementById(id)
  if (!modal) return
  modal.hidden = false
  document.body.style.overflow = 'hidden'

  // Focus first focusable element
  const focusable = modal.querySelector('button, [href], input, select, textarea')
  focusable?.focus()
}

function closeModal(id) {
  const modal = document.getElementById(id)
  if (!modal) return
  modal.hidden = true
  document.body.style.overflow = ''
}

// Close on backdrop click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal(overlay.id)
  })
})

// Close on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const open = document.querySelector('.modal-overlay:not([hidden])')
    if (open) closeModal(open.id)
  }
})
```
