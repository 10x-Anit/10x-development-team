# Input Component -- Production-Quality, Copy-Paste Ready

> Uses ONLY semantic design tokens. NEVER use `text-white`, `bg-gray-*`, `bg-blue-*`, etc.

---

## React + Tailwind (MVP/Production Scope)

### Core Input Component

```tsx
// src/components/ui/input.tsx
'use client'
import { forwardRef, useState, type InputHTMLAttributes } from 'react'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

// --- TypeScript Interface ---

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Label text above the input */
  label?: string
  /** Error message (shows red border and error text) */
  error?: string
  /** Helper text below the input */
  helperText?: string
  /** Icon element rendered inside the left edge */
  iconLeft?: React.ReactNode
  /** Icon element rendered inside the right edge */
  iconRight?: React.ReactNode
  /** Show character counter (requires maxLength) */
  showCount?: boolean
  /** Show loading spinner in the right slot */
  loading?: boolean
  /** Input size variant */
  size?: 'sm' | 'md' | 'lg'
  /** Full-width (default: true) */
  fullWidth?: boolean
}

// --- Size Map ---

const sizeMap = {
  sm: 'h-8 px-2.5 text-xs rounded-md',
  md: 'h-10 px-3 text-sm rounded-md',
  lg: 'h-12 px-4 text-base rounded-lg',
}

// --- Component ---

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      iconLeft,
      iconRight,
      showCount,
      loading,
      size = 'md',
      fullWidth = true,
      type,
      disabled,
      required,
      maxLength,
      value,
      defaultValue,
      className,
      id,
      onChange,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)
    const errorId = error && inputId ? `${inputId}-error` : undefined
    const helperId = helperText && inputId ? `${inputId}-helper` : undefined

    // Password toggle
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = type === 'password'
    const inputType = isPassword && showPassword ? 'text' : type

    // Character count
    const [charCount, setCharCount] = useState(
      typeof value === 'string' ? value.length : typeof defaultValue === 'string' ? defaultValue.length : 0
    )

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      if (showCount) setCharCount(e.target.value.length)
      onChange?.(e)
    }

    // Build aria-describedby
    const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined

    return (
      <div className={cn(fullWidth ? 'w-full' : 'w-auto')}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            {label}
            {required && (
              <span className="ml-0.5 text-destructive" aria-hidden="true">*</span>
            )}
          </label>
        )}

        {/* Input wrapper */}
        <div className="relative">
          {/* Left icon */}
          {iconLeft && (
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {iconLeft}
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            disabled={disabled}
            required={required}
            maxLength={maxLength}
            value={value}
            defaultValue={defaultValue}
            onChange={handleChange}
            aria-invalid={!!error}
            aria-describedby={describedBy}
            aria-required={required}
            className={cn(
              // Base
              'flex w-full border bg-background text-foreground ring-offset-background',
              'placeholder:text-muted-foreground',
              'transition-colors duration-150',
              // Focus
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              // Disabled
              'disabled:cursor-not-allowed disabled:opacity-50',
              // Error state
              error
                ? 'border-destructive focus-visible:ring-destructive'
                : 'border-input',
              // Size
              sizeMap[size],
              // Icon padding
              iconLeft && 'pl-10',
              (iconRight || isPassword || loading) && 'pr-10',
              className
            )}
            {...props}
          />

          {/* Right slot: loading > password toggle > icon */}
          {(loading || isPassword || iconRight) && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" aria-hidden="true" />
              ) : isPassword ? (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              ) : iconRight ? (
                <span className="text-muted-foreground">{iconRight}</span>
              ) : null}
            </div>
          )}
        </div>

        {/* Bottom row: error/helper + count */}
        <div className="mt-1.5 flex items-start justify-between gap-2">
          <div className="flex-1">
            {error && (
              <p id={errorId} className="text-xs text-destructive" role="alert">
                {error}
              </p>
            )}
            {!error && helperText && (
              <p id={helperId} className="text-xs text-muted-foreground">
                {helperText}
              </p>
            )}
          </div>

          {showCount && maxLength && (
            <span
              className={cn(
                'text-xs tabular-nums',
                charCount > maxLength ? 'text-destructive' : 'text-muted-foreground'
              )}
            >
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      </div>
    )
  }
)
Input.displayName = 'Input'
```

### Textarea Component

```tsx
// src/components/ui/textarea.tsx
import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, required, className, id, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)
    const errorId = error && textareaId ? `${textareaId}-error` : undefined

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="mb-1.5 block text-sm font-medium text-foreground">
            {label}
            {required && <span className="ml-0.5 text-destructive" aria-hidden="true">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          required={required}
          aria-invalid={!!error}
          aria-describedby={errorId}
          className={cn(
            'flex min-h-[80px] w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground ring-offset-background',
            'placeholder:text-muted-foreground',
            'transition-colors duration-150',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error ? 'border-destructive focus-visible:ring-destructive' : 'border-input',
            className
          )}
          {...props}
        />
        {error && <p id={errorId} className="mt-1.5 text-xs text-destructive" role="alert">{error}</p>}
        {!error && helperText && <p className="mt-1.5 text-xs text-muted-foreground">{helperText}</p>}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'
```

### Skeleton Loader

```tsx
export function InputSkeleton({ hasLabel = true }: { hasLabel?: boolean }) {
  return (
    <div className="w-full">
      {hasLabel && <div className="mb-1.5 h-4 w-20 animate-pulse rounded bg-muted" />}
      <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
    </div>
  )
}
```

### Usage Examples

```tsx
import { Input } from '@/components/ui/input'
import { Search, Mail, DollarSign } from 'lucide-react'

{/* Basic */}
<Input label="Full Name" placeholder="John Doe" required />

{/* Email with icon */}
<Input
  label="Email"
  type="email"
  iconLeft={<Mail className="h-4 w-4" />}
  placeholder="you@example.com"
  helperText="We will never share your email."
  required
/>

{/* Password with toggle */}
<Input label="Password" type="password" placeholder="Enter password" required />

{/* With error */}
<Input
  label="Username"
  error="Username is already taken"
  defaultValue="john"
/>

{/* Character count */}
<Input
  label="Bio"
  maxLength={160}
  showCount
  placeholder="Tell us about yourself"
/>

{/* Currency prefix */}
<Input
  label="Price"
  type="number"
  iconLeft={<DollarSign className="h-4 w-4" />}
  placeholder="0.00"
/>

{/* Search with loading */}
<Input
  iconLeft={<Search className="h-4 w-4" />}
  placeholder="Search..."
  loading
/>

{/* Sizes */}
<Input size="sm" placeholder="Small" />
<Input size="md" placeholder="Medium (default)" />
<Input size="lg" placeholder="Large" />
```

---

## HTML/CSS (Simple Scope)

```html
<!-- Basic input with label -->
<div class="form-field">
  <label for="name" class="form-label">
    Full Name <span class="form-required">*</span>
  </label>
  <input type="text" id="name" class="form-input" placeholder="John Doe" required />
</div>

<!-- Input with icon -->
<div class="form-field">
  <label for="email" class="form-label">Email</label>
  <div class="input-wrapper">
    <svg class="input-icon-left" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/></svg>
    <input type="email" id="email" class="form-input has-icon-left" placeholder="you@example.com" />
  </div>
  <p class="form-helper">We will never share your email.</p>
</div>

<!-- Password with toggle -->
<div class="form-field">
  <label for="password" class="form-label">Password</label>
  <div class="input-wrapper">
    <input type="password" id="password" class="form-input has-icon-right" placeholder="Enter password" />
    <button type="button" class="input-toggle-password" aria-label="Show password" data-target="password">
      <svg class="icon-eye" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>
    </button>
  </div>
</div>

<!-- Input with error -->
<div class="form-field">
  <label for="username" class="form-label">Username</label>
  <input type="text" id="username" class="form-input form-input-error" value="john" aria-invalid="true" aria-describedby="username-error" />
  <p id="username-error" class="form-error" role="alert">Username is already taken</p>
</div>

<!-- Input with character count -->
<div class="form-field">
  <label for="bio" class="form-label">Bio</label>
  <input type="text" id="bio" class="form-input" maxlength="160" placeholder="Tell us about yourself" data-show-count />
  <div class="form-footer">
    <span class="form-helper"></span>
    <span class="form-count">0/160</span>
  </div>
</div>
```

```css
/* css/components/input.css */

.form-field {
  width: 100%;
}

.form-field + .form-field {
  margin-top: var(--space-4);
}

.form-label {
  display: block;
  margin-bottom: var(--space-1);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text);
}

.form-required {
  color: var(--color-error);
  margin-left: 0.125rem;
}

.input-wrapper {
  position: relative;
}

.form-input {
  display: flex;
  width: 100%;
  height: 2.5rem;
  padding: var(--space-2) var(--space-3);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  color: var(--color-text);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.form-input::placeholder {
  color: var(--color-text-muted);
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary) 25%, transparent);
}

.form-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.form-input-error {
  border-color: var(--color-error);
}

.form-input-error:focus {
  border-color: var(--color-error);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-error) 25%, transparent);
}

.has-icon-left { padding-left: 2.5rem; }
.has-icon-right { padding-right: 2.5rem; }

.input-icon-left {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-muted);
  pointer-events: none;
}

.input-toggle-password {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: var(--radius-sm);
  transition: color var(--transition-fast);
}

.input-toggle-password:hover { color: var(--color-text); }
.input-toggle-password:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.form-error {
  margin-top: var(--space-1);
  font-size: var(--text-xs);
  color: var(--color-error);
}

.form-helper {
  margin-top: var(--space-1);
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-2);
  margin-top: var(--space-1);
}

.form-count {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  font-variant-numeric: tabular-nums;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  .form-input { background: var(--color-bg-alt); }
}
```

```js
// js/input.js
(function () {
  // Password toggle
  document.querySelectorAll('.input-toggle-password').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target')
      const input = document.getElementById(targetId)
      if (!input) return
      const isPassword = input.type === 'password'
      input.type = isPassword ? 'text' : 'password'
      btn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password')
    })
  })

  // Character count
  document.querySelectorAll('[data-show-count]').forEach(input => {
    const field = input.closest('.form-field')
    const counter = field?.querySelector('.form-count')
    if (!counter || !input.maxLength) return

    function update() {
      counter.textContent = `${input.value.length}/${input.maxLength}`
      if (input.value.length > input.maxLength) {
        counter.style.color = 'var(--color-error)'
      } else {
        counter.style.color = ''
      }
    }

    input.addEventListener('input', update)
    update()
  })
})()
```
