# Select / Dropdown Component — Copy-Paste Ready

> Uses ONLY semantic design tokens. NEVER use `text-white`, `bg-gray-*`, `bg-blue-*`, etc.

---

## React + Tailwind (MVP/Production Scope)

### Core Select Component

```tsx
// src/components/ui/select.tsx
'use client'
import { forwardRef, useState, useRef, useEffect, useCallback } from 'react'
import { ChevronDown, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

// --- Types ---

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps {
  label?: string
  options: SelectOption[]
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  placeholder?: string
  error?: string
  helperText?: string
  required?: boolean
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
  id?: string
}

// --- Size Map ---

const sizeMap = {
  sm: 'h-8 px-2.5 text-xs',
  md: 'h-10 px-3 text-sm',
  lg: 'h-12 px-4 text-base',
}

// --- Component ---

export function Select({
  label,
  options,
  value: controlledValue,
  defaultValue,
  onChange,
  placeholder = 'Select an option',
  error,
  helperText,
  required,
  disabled,
  size = 'md',
  className,
  id,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [internalValue, setInternalValue] = useState(defaultValue || '')
  const containerRef = useRef<HTMLDivElement>(null)
  const listboxRef = useRef<HTMLUListElement>(null)

  const value = controlledValue !== undefined ? controlledValue : internalValue
  const selectedOption = options.find(o => o.value === value)

  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : 'select')
  const errorId = error ? `${selectId}-error` : undefined
  const listboxId = `${selectId}-listbox`

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (disabled) return

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault()
        setIsOpen(prev => !prev)
        break
      case 'Escape':
        setIsOpen(false)
        break
      case 'ArrowDown':
        e.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
        } else {
          const currentIdx = options.findIndex(o => o.value === value)
          const nextIdx = Math.min(currentIdx + 1, options.length - 1)
          const nextOption = options[nextIdx]
          if (nextOption && !nextOption.disabled) {
            setInternalValue(nextOption.value)
            onChange?.(nextOption.value)
          }
        }
        break
      case 'ArrowUp':
        e.preventDefault()
        if (isOpen) {
          const currentIdx = options.findIndex(o => o.value === value)
          const prevIdx = Math.max(currentIdx - 1, 0)
          const prevOption = options[prevIdx]
          if (prevOption && !prevOption.disabled) {
            setInternalValue(prevOption.value)
            onChange?.(prevOption.value)
          }
        }
        break
    }
  }, [disabled, isOpen, options, value, onChange])

  function selectOption(option: SelectOption) {
    if (option.disabled) return
    setInternalValue(option.value)
    onChange?.(option.value)
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className={cn('w-full', className)}>
      {label && (
        <label htmlFor={selectId} className="mb-1.5 block text-sm font-medium text-foreground">
          {label}
          {required && <span className="ml-0.5 text-destructive" aria-hidden="true">*</span>}
        </label>
      )}

      {/* Trigger */}
      <button
        type="button"
        id={selectId}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-invalid={!!error}
        aria-describedby={errorId}
        aria-required={required}
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(prev => !prev)}
        onKeyDown={handleKeyDown}
        className={cn(
          'flex w-full items-center justify-between rounded-md border bg-background ring-offset-background transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error ? 'border-destructive' : 'border-input',
          sizeMap[size],
        )}
      >
        <span className={cn(!selectedOption && 'text-muted-foreground')}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={cn('h-4 w-4 text-muted-foreground transition-transform', isOpen && 'rotate-180')} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <ul
          ref={listboxRef}
          id={listboxId}
          role="listbox"
          aria-labelledby={selectId}
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-border bg-card py-1 shadow-lg"
          style={{ minWidth: containerRef.current?.offsetWidth }}
        >
          {options.map((option) => (
            <li
              key={option.value}
              role="option"
              aria-selected={value === option.value}
              aria-disabled={option.disabled}
              onClick={() => selectOption(option)}
              className={cn(
                'flex cursor-pointer items-center justify-between px-3 py-2 text-sm transition-colors',
                value === option.value
                  ? 'bg-primary/10 text-foreground'
                  : 'text-foreground hover:bg-accent',
                option.disabled && 'cursor-not-allowed opacity-50',
              )}
            >
              {option.label}
              {value === option.value && <Check className="h-4 w-4 text-primary" />}
            </li>
          ))}
        </ul>
      )}

      {/* Error / Helper */}
      {error && <p id={errorId} className="mt-1.5 text-xs text-destructive" role="alert">{error}</p>}
      {!error && helperText && <p className="mt-1.5 text-xs text-muted-foreground">{helperText}</p>}
    </div>
  )
}
```

### Usage Examples

```tsx
import { Select } from '@/components/ui/select'

const countries = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
]

// Basic
<Select label="Country" options={countries} placeholder="Choose a country" />

// With error
<Select label="Country" options={countries} error="Please select a country" required />

// Controlled
<Select
  label="Country"
  options={countries}
  value={selectedCountry}
  onChange={setSelectedCountry}
/>

// Disabled
<Select label="Country" options={countries} disabled />
```

### Skeleton
```tsx
export function SelectSkeleton({ hasLabel = true }: { hasLabel?: boolean }) {
  return (
    <div className="w-full">
      {hasLabel && <div className="mb-1.5 h-4 w-20 animate-pulse rounded bg-muted" />}
      <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
    </div>
  )
}
```
