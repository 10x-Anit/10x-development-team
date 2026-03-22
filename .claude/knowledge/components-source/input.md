# Input Component — Copy-Paste Ready

## React + Tailwind
```tsx
// src/components/ui/input.tsx
import { forwardRef, type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  icon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', id, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="w-full">
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
          {props.required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        <div className="relative">
          {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            className={`block w-full rounded-md border px-3 py-2 text-sm transition-colors
              ${icon ? 'pl-10' : ''}
              ${error
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
              }
              bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
              focus:outline-none focus:ring-1
              disabled:cursor-not-allowed disabled:opacity-50
              placeholder:text-gray-400
              ${className}`}
            {...props}
          />
        </div>
        {error && <p id={`${inputId}-error`} className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'
```

## Usage
```tsx
<Input label="Email" type="email" placeholder="you@example.com" required />
<Input label="Password" type="password" error="Must be at least 8 characters" />
<Input label="Search" icon={<SearchIcon className="h-4 w-4" />} placeholder="Search..." />
```
