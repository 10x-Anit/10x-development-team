# Dark Mode Patterns — Copy-Paste Reference

## Tailwind Setup
```ts
// tailwind.config.ts
export default {
  darkMode: 'class',  // toggle via class on <html>
  // ...
}
```

## Toggle Component
```tsx
'use client'
import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark = saved === 'dark' || (!saved && prefersDark)
    setDark(isDark)
    document.documentElement.classList.toggle('dark', isDark)
  }, [])

  function toggle() {
    const newDark = !dark
    setDark(newDark)
    document.documentElement.classList.toggle('dark', newDark)
    localStorage.setItem('theme', newDark ? 'dark' : 'light')
  }

  return (
    <button onClick={toggle} className="rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Toggle theme">
      {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  )
}
```

## Common Dark Mode Classes
```html
<!-- Background -->
<div class="bg-white dark:bg-gray-900">

<!-- Text -->
<p class="text-gray-900 dark:text-gray-100">
<p class="text-gray-500 dark:text-gray-400">

<!-- Borders -->
<div class="border-gray-200 dark:border-gray-700">

<!-- Cards -->
<div class="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">

<!-- Inputs -->
<input class="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">

<!-- Hover -->
<button class="hover:bg-gray-100 dark:hover:bg-gray-800">
```

## CSS Custom Properties (Simple scope)
```css
:root {
  --color-bg: #ffffff;
  --color-text: #1f2937;
  --color-border: #e5e7eb;
}
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #111827;
    --color-text: #f9fafb;
    --color-border: #374151;
  }
}
```
