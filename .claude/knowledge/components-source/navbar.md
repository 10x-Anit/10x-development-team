# Navbar Component — Copy-Paste Ready

## React + Tailwind
```tsx
// src/components/layout/navbar.tsx
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

interface NavbarProps {
  logo: { text: string; href: string }
  links: { label: string; href: string }[]
  cta?: { label: string; href: string }
}

export function Navbar({ logo, links, cta }: NavbarProps) {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link href={logo.href} className="text-xl font-bold">
          {logo.text}
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-4">
          {cta && (
            <Link href={cta.href} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
              {cta.label}
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-gray-200 bg-white px-4 py-4 md:hidden">
          <ul className="space-y-3">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="block text-base font-medium text-gray-700" onClick={() => setOpen(false)}>
                  {link.label}
                </Link>
              </li>
            ))}
            {cta && (
              <li>
                <Link href={cta.href} className="block w-full rounded-md bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white">
                  {cta.label}
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  )
}
```

## Usage
```tsx
<Navbar
  logo={{ text: 'MyApp', href: '/' }}
  links={[
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Docs', href: '/docs' },
  ]}
  cta={{ label: 'Get Started', href: '/signup' }}
/>
```
