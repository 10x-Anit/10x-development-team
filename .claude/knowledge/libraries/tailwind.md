# Tailwind CSS Quick Reference

## Most Used Utilities

### Layout
```
flex items-center justify-between    → horizontal row, centered, spaced
flex flex-col gap-4                  → vertical stack with gap
grid grid-cols-3 gap-6              → 3-column grid
container mx-auto px-4              → centered container
w-full max-w-md                     → full width, max 28rem
min-h-screen                        → full viewport height
hidden md:block                     → hidden mobile, show tablet+
```

### Spacing
```
p-4     → padding 1rem
px-6    → horizontal padding 1.5rem
py-2    → vertical padding 0.5rem
m-4     → margin 1rem
mt-8    → margin-top 2rem
mb-4    → margin-bottom 1rem
gap-4   → gap 1rem (flex/grid)
space-y-4 → vertical spacing between children
```

### Typography
```
text-sm / text-base / text-lg / text-xl / text-2xl / text-3xl
font-normal / font-medium / font-semibold / font-bold
text-gray-900    → dark text
text-gray-500    → muted text
text-white       → white text
leading-tight    → line-height 1.25
tracking-wide    → letter-spacing wide
text-center / text-left / text-right
truncate         → text overflow ellipsis
```

### Colors
```
bg-white / bg-gray-50 / bg-gray-100
bg-blue-500 / bg-blue-600 / bg-blue-700
text-blue-500 / text-blue-700
border-gray-200 / border-blue-500
hover:bg-blue-700
```

### Borders & Shadows
```
rounded / rounded-md / rounded-lg / rounded-full
border / border-2 / border-gray-200
shadow-sm / shadow / shadow-md / shadow-lg
ring-2 ring-blue-500    → focus ring
```

### Interactivity
```
hover:bg-blue-700        → hover state
focus:ring-2             → focus state
active:scale-95          → click state
disabled:opacity-50      → disabled state
cursor-pointer           → clickable
transition-all duration-150 ease-in-out
```

### Responsive
```
sm:   → ≥640px
md:   → ≥768px
lg:   → ≥1024px
xl:   → ≥1280px

Example: text-sm md:text-base lg:text-lg
Example: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
Example: hidden md:flex
Example: px-4 md:px-6 lg:px-8
```

### Dark Mode
```
dark:bg-gray-900
dark:text-white
dark:border-gray-700
```
Enable: `darkMode: 'class'` in tailwind.config

## Common Component Patterns

### Button
```html
<button class="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
  Button
</button>
```

### Input
```html
<div>
  <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
  <input type="email" class="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
</div>
```

### Card
```html
<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
  <h3 class="text-lg font-semibold">Title</h3>
  <p class="mt-2 text-sm text-gray-600">Description</p>
</div>
```

### Badge
```html
<span class="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
  Badge
</span>
```

### Avatar
```html
<div class="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
  <img src="avatar.jpg" alt="User" class="h-full w-full object-cover" />
</div>
```

## Tailwind Config (Custom Theme)
```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: { 50: '#eff6ff', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
```
