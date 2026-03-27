# GSAP + ScrollTrigger — Scroll Animation Reference

GSAP (GreenSock Animation Platform) is the industry-standard animation library. ScrollTrigger ties animations to scroll position. Free for all uses since Webflow acquisition.

## Install

```bash
npm install gsap
npm install lenis    # Optional: smooth scrolling
```

## When to Use

| Scope | What to Use |
|-------|-------------|
| production | Full GSAP: ScrollTrigger, scroll-driven 3D cameras, Lenis smooth scroll, SplitText, complex timelines |
| mvp | GSAP ScrollTrigger: section reveals, parallax, pinning, scrub animations |
| prototype | Basic GSAP: simple reveals on scroll, no Lenis |
| simple | CSS `@keyframes` + `IntersectionObserver` — no GSAP (no npm) |

---

## 1. Setup — Register Plugin

```tsx
'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
```

---

## 2. Basic ScrollTrigger

### Fade In On Scroll
```tsx
'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function FadeInSection({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    gsap.fromTo(ref.current,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 80%',      // When top of element hits 80% of viewport
          end: 'top 20%',
          toggleActions: 'play none none reverse',
        }
      }
    )

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  return <div ref={ref}>{children}</div>
}
```

### ScrollTrigger Options Reference
```tsx
scrollTrigger: {
  trigger: element,         // Element that triggers the animation
  start: 'top 80%',        // [trigger position] [viewport position]
  end: 'bottom 20%',       // When to end
  scrub: true,              // Tie animation progress to scroll (boolean or number for smoothing)
  scrub: 1,                 // Smooth scrub with 1 second lag
  pin: true,                // Pin the trigger element during animation
  pinSpacing: true,         // Add spacing for pinned element
  markers: false,           // Debug markers (set true during development)
  toggleActions: 'play none none reverse',  // onEnter, onLeave, onEnterBack, onLeaveBack
  snap: 1,                  // Snap to nearest section
  snap: { snapTo: 1, duration: 0.3, ease: 'power1.inOut' },
  onEnter: () => {},
  onLeave: () => {},
  onEnterBack: () => {},
  onLeaveBack: () => {},
  onUpdate: (self) => {
    console.log(self.progress) // 0 to 1
  },
}
```

---

## 3. Parallax Effect

```tsx
'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function ParallaxSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current || !bgRef.current || !contentRef.current) return

    // Background moves slower (parallax)
    gsap.to(bgRef.current, {
      yPercent: -30,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      }
    })

    // Content moves at normal speed with fade
    gsap.fromTo(contentRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
          end: 'top 20%',
          scrub: 1,
        }
      }
    )

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  return (
    <section ref={sectionRef} className="relative min-h-screen overflow-hidden">
      <div ref={bgRef} className="absolute inset-0 -top-[30%] -bottom-[30%] bg-gradient-to-b from-primary/5 to-background" />
      <div ref={contentRef} className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <h2 className="text-4xl font-bold text-foreground">Parallax Section</h2>
      </div>
    </section>
  )
}
```

---

## 4. Pin + Horizontal Scroll

```tsx
'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function HorizontalScroll() {
  const containerRef = useRef<HTMLDivElement>(null)
  const panelsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !panelsRef.current) return

    const panels = panelsRef.current.children
    const totalWidth = panelsRef.current.scrollWidth - window.innerWidth

    gsap.to(panelsRef.current, {
      x: -totalWidth,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true,
        scrub: 1,
        end: `+=${totalWidth}`,
        snap: 1 / (panels.length - 1),
      }
    })

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  return (
    <div ref={containerRef} className="overflow-hidden">
      <div ref={panelsRef} className="flex">
        {['Panel 1', 'Panel 2', 'Panel 3', 'Panel 4'].map((text, i) => (
          <div key={i} className="flex h-screen w-screen flex-shrink-0 items-center justify-center">
            <h2 className="text-5xl font-bold text-foreground">{text}</h2>
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

## 5. Staggered Reveal

```tsx
'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function StaggeredCards() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const cards = containerRef.current.querySelectorAll('.card')

    gsap.fromTo(cards,
      { opacity: 0, y: 60, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 70%',
        }
      }
    )

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  return (
    <div ref={containerRef} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="card rounded-xl bg-card p-6 shadow-md">
          <h3 className="text-lg font-semibold text-foreground">Card {i}</h3>
          <p className="text-sm text-muted-foreground">Content here</p>
        </div>
      ))}
    </div>
  )
}
```

---

## 6. Text Reveal Animation

```tsx
'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function TextReveal({ text }: { text: string }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const words = containerRef.current.querySelectorAll('.word')

    gsap.fromTo(words,
      { opacity: 0, y: 20, rotateX: 90 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.6,
        ease: 'back.out(1.7)',
        stagger: 0.05,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
        }
      }
    )

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  return (
    <div ref={containerRef} className="flex flex-wrap gap-x-2" style={{ perspective: '400px' }}>
      {text.split(' ').map((word, i) => (
        <span key={i} className="word inline-block text-4xl font-bold text-foreground" style={{ transformOrigin: 'bottom center' }}>
          {word}
        </span>
      ))}
    </div>
  )
}
```

---

## 7. Lenis Smooth Scroll Integration

```tsx
'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    })

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      gsap.ticker.remove(lenis.raf)
    }
  }, [])

  return <>{children}</>
}
```

### Usage in Layout
```tsx
// src/app/layout.tsx
import { SmoothScrollProvider } from '@/components/smooth-scroll'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  )
}
```

---

## 8. GSAP + React Three Fiber Integration

### Scroll-Driven Camera
```tsx
'use client'

import { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function ScrollCamera() {
  const { camera } = useThree()
  const tl = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    tl.current = gsap.timeline({
      scrollTrigger: {
        trigger: '#scroll-container',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
      }
    })

    // Camera path: position keyframes
    tl.current
      .to(camera.position, { x: 3, y: 1, z: 4, duration: 1 }, 0)
      .to(camera.position, { x: -2, y: 2, z: 3, duration: 1 }, 1)
      .to(camera.position, { x: 0, y: 0, z: 5, duration: 1 }, 2)

    return () => {
      tl.current?.kill()
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [camera])

  useFrame(() => {
    camera.lookAt(0, 0, 0)
  })

  return null
}
```

### Scroll-Driven Material Changes
```tsx
export function ScrollMaterial() {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.MeshStandardMaterial>(null)

  useEffect(() => {
    if (!materialRef.current) return

    gsap.to(materialRef.current, {
      metalness: 1,
      roughness: 0,
      scrollTrigger: {
        trigger: '#features-section',
        start: 'top center',
        end: 'bottom center',
        scrub: 1,
      }
    })

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[1, 0.3, 128, 16]} />
      <meshStandardMaterial ref={materialRef} color="#6366f1" metalness={0.3} roughness={0.7} />
    </mesh>
  )
}
```

---

## 9. Common Easing Functions

```
Linear:         'none'
Smooth:         'power1.out', 'power2.out', 'power3.out', 'power4.out'
Bounce:         'bounce.out'
Elastic:        'elastic.out(1, 0.3)'
Back (overshoot): 'back.out(1.7)'
Custom:         'cubic-bezier(0.22, 1, 0.36, 1)'
```

---

## 10. Performance Tips

1. **Scrub smoothing**: Use `scrub: 1` or `scrub: 2` instead of `scrub: true` for smoother scroll-linked animations
2. **Batch animations**: Use `gsap.utils.toArray('.card')` to batch similar elements
3. **Kill on unmount**: Always clean up ScrollTrigger instances in useEffect cleanup
4. **Lazy init**: Use `ScrollTrigger.create()` for triggers that don't need a tween
5. **Debounce resize**: `ScrollTrigger.addEventListener('refreshInit', () => {})`
6. **Prefer transforms**: Animate `x`, `y`, `scale`, `rotation` instead of `top`, `left`, `width`
7. **will-change**: GSAP adds `will-change: transform` automatically for hardware acceleration

---

## 11. Cleanup Pattern (CRITICAL for React)

```tsx
useEffect(() => {
  const ctx = gsap.context(() => {
    // All GSAP animations here
    gsap.to('.card', {
      y: 0,
      opacity: 1,
      scrollTrigger: { trigger: '.cards-section', start: 'top 80%' }
    })
  }, containerRef) // Scope to container

  return () => ctx.revert() // Cleans up ALL animations and ScrollTriggers in this context
}, [])
```

This is the RECOMMENDED cleanup pattern. `gsap.context()` automatically reverts all animations when the component unmounts.
