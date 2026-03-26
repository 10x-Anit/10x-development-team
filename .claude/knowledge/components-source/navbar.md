# Navbar Component -- Production-Quality, Copy-Paste Ready

> Uses ONLY semantic design tokens. NEVER use `text-white`, `bg-gray-*`, `bg-blue-*`, etc.

---

## React + Tailwind (MVP/Production Scope)

### Core Navbar Component

```tsx
// src/components/layout/navbar.tsx
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

// --- TypeScript Interfaces ---

interface NavLink {
  label: string
  href: string
}

interface NavbarProps {
  /** Logo text or element */
  logo: { text: string; href: string; icon?: React.ReactNode }
  /** Navigation links */
  links: NavLink[]
  /** Primary CTA button */
  cta?: { label: string; href: string }
  /** Secondary action (e.g. "Log in") */
  secondaryAction?: { label: string; href: string }
  /** Use glassmorphism backdrop */
  glass?: boolean
  /** Shrink navbar on scroll */
  shrinkOnScroll?: boolean
}

// --- Component ---

export function Navbar({
  logo,
  links,
  cta,
  secondaryAction,
  glass = true,
  shrinkOnScroll = true,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  // Scroll-triggered shrink
  useEffect(() => {
    if (!shrinkOnScroll) return
    function handleScroll() {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [shrinkOnScroll])

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b transition-all duration-200',
        glass
          ? 'bg-background/80 backdrop-blur-md border-border/50'
          : 'bg-background border-border',
        scrolled ? 'shadow-sm' : ''
      )}
    >
      <nav
        className={cn(
          'mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 transition-all duration-200',
          scrolled ? 'h-14' : 'h-16'
        )}
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href={logo.href}
          className="flex items-center gap-2 text-xl font-bold text-foreground transition-colors hover:text-foreground/80"
        >
          {logo.icon && <span aria-hidden="true">{logo.icon}</span>}
          {logo.text}
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 md:flex" role="list">
          {links.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/')
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    'relative px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                  {/* Active indicator line */}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-primary" />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 md:flex">
          {secondaryAction && (
            <Link
              href={secondaryAction.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {secondaryAction.label}
            </Link>
          )}
          {cta && (
            <Button size="sm" asChild>
              <Link href={cta.href}>{cta.label}</Link>
            </Button>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className={cn(
            'inline-flex items-center justify-center rounded-md p-2 md:hidden',
            'text-muted-foreground transition-colors',
            'hover:bg-accent hover:text-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'
          )}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          className="border-t border-border bg-background px-4 py-4 md:hidden animate-fade-in-down"
          role="navigation"
          aria-label="Mobile navigation"
        >
          <ul className="space-y-1" role="list">
            {links.map((link) => {
              const isActive = pathname === link.href
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      'block rounded-md px-3 py-2.5 text-base font-medium transition-colors',
                      isActive
                        ? 'bg-accent text-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              )
            })}
          </ul>

          <div className="mt-4 space-y-2 border-t border-border pt-4">
            {secondaryAction && (
              <Link
                href={secondaryAction.href}
                className="block rounded-md px-3 py-2.5 text-center text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {secondaryAction.label}
              </Link>
            )}
            {cta && (
              <Button fullWidth asChild>
                <Link href={cta.href}>{cta.label}</Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
```

### Framer Motion Enhanced Navbar (LARGE context / Production)

```tsx
// src/components/layout/motion-navbar.tsx
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface NavLink { label: string; href: string }
interface MotionNavbarProps {
  logo: { text: string; href: string; icon?: React.ReactNode }
  links: NavLink[]
  cta?: { label: string; href: string }
  secondaryAction?: { label: string; href: string }
}

export function MotionNavbar({ logo, links, cta, secondaryAction }: MotionNavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  useEffect(() => { setMobileOpen(false) }, [pathname])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={cn(
        'sticky top-0 z-50 border-b transition-all duration-200',
        'bg-background/80 backdrop-blur-md border-border/50',
        scrolled && 'shadow-sm'
      )}
    >
      <nav
        className={cn(
          'mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 transition-all duration-200',
          scrolled ? 'h-14' : 'h-16'
        )}
        aria-label="Main navigation"
      >
        <Link href={logo.href} className="flex items-center gap-2 text-xl font-bold text-foreground">
          {logo.icon && <span aria-hidden="true">{logo.icon}</span>}
          {logo.text}
        </Link>

        <ul className="hidden items-center gap-1 md:flex" role="list">
          {links.map((link) => {
            const isActive = pathname === link.href
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    'relative px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="navbar-active"
                      className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-primary"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          {secondaryAction && (
            <Link href={secondaryAction.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              {secondaryAction.label}
            </Link>
          )}
          {cta && (
            <Button size="sm" asChild>
              <Link href={cta.href}>{cta.label}</Link>
            </Button>
          )}
        </div>

        <button
          className="inline-flex items-center justify-center rounded-md p-2 md:hidden text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Animated mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-border bg-background md:hidden"
          >
            <div className="px-4 py-4">
              <ul className="space-y-1">
                {links.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        'block rounded-md px-3 py-2.5 text-base font-medium transition-colors',
                        pathname === link.href
                          ? 'bg-accent text-foreground'
                          : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
              {cta && (
                <div className="mt-4 border-t border-border pt-4">
                  <Button fullWidth asChild>
                    <Link href={cta.href}>{cta.label}</Link>
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
```

### Usage Examples

```tsx
import { Navbar } from '@/components/layout/navbar'
import { Zap } from 'lucide-react'

<Navbar
  logo={{ text: 'MyApp', href: '/', icon: <Zap className="h-5 w-5 text-primary" /> }}
  links={[
    { label: 'Features', href: '/features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Blog', href: '/blog' },
    { label: 'Docs', href: '/docs' },
  ]}
  secondaryAction={{ label: 'Log in', href: '/login' }}
  cta={{ label: 'Get Started', href: '/signup' }}
/>
```

---

## HTML/CSS (Simple Scope)

```html
<header class="navbar" id="navbar">
  <nav class="navbar-inner" aria-label="Main navigation">
    <a href="/" class="navbar-logo">MyApp</a>

    <!-- Desktop nav -->
    <ul class="navbar-links" role="list">
      <li><a href="#features" class="navbar-link">Features</a></li>
      <li><a href="#pricing" class="navbar-link">Pricing</a></li>
      <li><a href="#about" class="navbar-link">About</a></li>
      <li><a href="#contact" class="navbar-link">Contact</a></li>
    </ul>

    <div class="navbar-actions">
      <a href="/login" class="navbar-link">Log in</a>
      <a href="/signup" class="btn btn-primary btn-sm">Get Started</a>
    </div>

    <!-- Mobile toggle -->
    <button
      class="navbar-toggle"
      aria-expanded="false"
      aria-controls="mobile-menu"
      aria-label="Toggle menu"
    >
      <svg class="navbar-toggle-icon navbar-icon-open" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      <svg class="navbar-toggle-icon navbar-icon-close" style="display:none" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
  </nav>

  <!-- Mobile menu -->
  <div class="navbar-mobile" id="mobile-menu" hidden>
    <ul class="navbar-mobile-links" role="list">
      <li><a href="#features" class="navbar-mobile-link">Features</a></li>
      <li><a href="#pricing" class="navbar-mobile-link">Pricing</a></li>
      <li><a href="#about" class="navbar-mobile-link">About</a></li>
      <li><a href="#contact" class="navbar-mobile-link">Contact</a></li>
    </ul>
    <div class="navbar-mobile-actions">
      <a href="/login" class="navbar-mobile-link">Log in</a>
      <a href="/signup" class="btn btn-primary" style="width: 100%;">Get Started</a>
    </div>
  </div>
</header>
```

```css
/* css/components/navbar.css */

.navbar {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border);
  transition: box-shadow var(--transition-base);
}

.navbar.scrolled {
  box-shadow: var(--shadow-sm);
}

.navbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--space-4);
  height: 4rem;
  transition: height var(--transition-base);
}

.navbar.scrolled .navbar-inner {
  height: 3.5rem;
}

.navbar-logo {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--color-text);
  text-decoration: none;
}

.navbar-links {
  display: none;
  list-style: none;
  gap: var(--space-1);
  margin: 0;
  padding: 0;
}

.navbar-link {
  display: inline-block;
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text-muted);
  text-decoration: none;
  border-radius: var(--radius-md);
  transition: color var(--transition-fast), background var(--transition-fast);
}

.navbar-link:hover {
  color: var(--color-text);
  background: var(--color-bg-alt);
}

.navbar-link[aria-current="page"] {
  color: var(--color-text);
}

.navbar-actions {
  display: none;
  align-items: center;
  gap: var(--space-3);
}

.navbar-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-2);
  background: none;
  border: none;
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  cursor: pointer;
  transition: background var(--transition-fast), color var(--transition-fast);
}

.navbar-toggle:hover {
  background: var(--color-bg-alt);
  color: var(--color-text);
}

.navbar-toggle:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Mobile menu */
.navbar-mobile {
  border-top: 1px solid var(--color-border);
  padding: var(--space-4);
  background: var(--color-bg);
}

.navbar-mobile[hidden] { display: none; }

.navbar-mobile-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.navbar-mobile-link {
  display: block;
  padding: var(--space-3);
  font-size: var(--text-base);
  font-weight: 500;
  color: var(--color-text-muted);
  text-decoration: none;
  border-radius: var(--radius-md);
  transition: background var(--transition-fast), color var(--transition-fast);
}

.navbar-mobile-link:hover {
  background: var(--color-bg-alt);
  color: var(--color-text);
}

.navbar-mobile-actions {
  margin-top: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

/* Show desktop layout at md breakpoint */
@media (min-width: 768px) {
  .navbar-links { display: flex; }
  .navbar-actions { display: flex; }
  .navbar-toggle { display: none; }
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  .navbar {
    background: rgba(15, 23, 42, 0.8);
  }
}
```

```js
// js/navbar.js
(function () {
  const navbar = document.getElementById('navbar')
  const toggle = navbar?.querySelector('.navbar-toggle')
  const mobileMenu = document.getElementById('mobile-menu')
  const iconOpen = navbar?.querySelector('.navbar-icon-open')
  const iconClose = navbar?.querySelector('.navbar-icon-close')

  // Mobile toggle
  toggle?.addEventListener('click', () => {
    const isOpen = !mobileMenu.hidden
    mobileMenu.hidden = isOpen
    toggle.setAttribute('aria-expanded', String(!isOpen))
    if (iconOpen && iconClose) {
      iconOpen.style.display = isOpen ? 'block' : 'none'
      iconClose.style.display = isOpen ? 'none' : 'block'
    }
    document.body.style.overflow = isOpen ? '' : 'hidden'
  })

  // Close on link click
  mobileMenu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.hidden = true
      toggle?.setAttribute('aria-expanded', 'false')
      document.body.style.overflow = ''
      if (iconOpen && iconClose) {
        iconOpen.style.display = 'block'
        iconClose.style.display = 'none'
      }
    })
  })

  // Scroll-triggered class
  window.addEventListener('scroll', () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 20)
  }, { passive: true })
})()
```
