# Framer Motion — Comprehensive Animation Reference

Complete, copy-paste-ready animation patterns for building mesmerizing UI.
Every code block is real, working TSX. Agents: copy these directly into projects.

## Install

```bash
npm install framer-motion
```

## When to Use

| Scope | What to Use |
|-------|-------------|
| production | Everything in this file — page transitions, scroll animations, hero effects, background effects, micro-interactions |
| mvp | Scroll reveals, stagger children, micro-interactions, loading animations |
| prototype | Skip animations entirely — speed matters more |
| simple | Use CSS `@keyframes` instead (no React) — see Section 15 at the bottom |

---

## 1. Basic Animations

### Fade In

```tsx
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5, ease: 'easeOut' }}
>
  Content fades in
</motion.div>
```

### Slide Up + Fade

```tsx
<motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
>
  Slides up and fades in
</motion.div>
```

### Slide Down + Fade

```tsx
<motion.div
  initial={{ opacity: 0, y: -30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
>
  Slides down and fades in
</motion.div>
```

### Slide In from Left

```tsx
<motion.div
  initial={{ opacity: 0, x: -60 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ type: 'spring', stiffness: 100, damping: 20 }}
>
  Slides in from left
</motion.div>
```

### Slide In from Right

```tsx
<motion.div
  initial={{ opacity: 0, x: 60 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ type: 'spring', stiffness: 100, damping: 20 }}
>
  Slides in from right
</motion.div>
```

### Scale In

```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
>
  Scales up into view
</motion.div>
```

### Rotate In

```tsx
<motion.div
  initial={{ opacity: 0, rotate: -10, scale: 0.9 }}
  animate={{ opacity: 1, rotate: 0, scale: 1 }}
  transition={{ type: 'spring', stiffness: 150, damping: 15 }}
>
  Rotates into place
</motion.div>
```

### Spring Physics Reference

```
Snappy button:    { type: 'spring', stiffness: 400, damping: 25 }
Smooth entrance:  { type: 'spring', stiffness: 100, damping: 20 }
Bouncy pop:       { type: 'spring', stiffness: 300, damping: 10 }
Gentle settle:    { type: 'spring', stiffness: 80, damping: 20, mass: 1.2 }
Quick snap:       { type: 'spring', stiffness: 500, damping: 30 }
Elastic:          { type: 'spring', stiffness: 200, damping: 8, mass: 0.8 }
```

### Cubic Bezier Easing Reference

```
Smooth decel:     [0.22, 1, 0.36, 1]      (best for entrances)
Smooth accel:     [0.55, 0, 1, 0.45]       (best for exits)
Emphasized:       [0.16, 1, 0.3, 1]        (Material Design style)
Bounce feel:      [0.34, 1.56, 0.64, 1]    (slight overshoot)
Expo out:         [0.16, 1, 0.3, 1]        (strong deceleration)
```

---

## 2. Scroll-Triggered Animations

### Simple whileInView (quickest approach)

```tsx
<motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: '-100px' }}
  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
>
  Animates when scrolled into view
</motion.div>
```

### ScrollReveal Wrapper Component (reusable)

```tsx
'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, type ReactNode } from 'react'

interface ScrollRevealProps {
  children: ReactNode
  direction?: 'up' | 'down' | 'left' | 'right'
  delay?: number
  duration?: number
  className?: string
}

const directionOffset = {
  up: { y: 40 },
  down: { y: -40 },
  left: { x: 40 },
  right: { x: -40 },
}

export function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  className,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, ...directionOffset[direction] }}
      animate={
        isInView
          ? { opacity: 1, x: 0, y: 0 }
          : { opacity: 0, ...directionOffset[direction] }
      }
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  )
}
```

Usage:

```tsx
<ScrollReveal>
  <h2>This section fades up on scroll</h2>
</ScrollReveal>

<ScrollReveal direction="left" delay={0.2}>
  <p>This slides in from the left with a delay</p>
</ScrollReveal>
```

### Scroll-Triggered Section with Staggered Children

```tsx
'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, type ReactNode } from 'react'

interface ScrollSectionProps {
  children: ReactNode
  className?: string
}

export function ScrollSection({ children, className }: ScrollSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.12 } },
      }}
    >
      {children}
    </motion.div>
  )
}

export function ScrollItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
        },
      }}
    >
      {children}
    </motion.div>
  )
}
```

Usage:

```tsx
<ScrollSection className="grid grid-cols-3 gap-6">
  <ScrollItem><FeatureCard title="Fast" /></ScrollItem>
  <ScrollItem><FeatureCard title="Secure" /></ScrollItem>
  <ScrollItem><FeatureCard title="Scalable" /></ScrollItem>
</ScrollSection>
```

---

## 3. Staggered Children

### Basic Stagger (list/grid items appear one by one)

```tsx
'use client'

import { motion } from 'framer-motion'

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
}

export function StaggerList({ items }: { items: { id: string; name: string }[] }) {
  return (
    <motion.ul
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-3"
    >
      {items.map((item) => (
        <motion.li key={item.id} variants={itemVariants}>
          {item.name}
        </motion.li>
      ))}
    </motion.ul>
  )
}
```

### Stagger Grid (cards appearing in sequence)

```tsx
const gridContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
}

<motion.div
  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
  variants={gridContainerVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: '-50px' }}
>
  {cards.map((card) => (
    <motion.div key={card.id} variants={cardVariants}>
      <Card {...card} />
    </motion.div>
  ))}
</motion.div>
```

### Stagger with Alternating Directions

```tsx
const alternatingItem = {
  hidden: (i: number) => ({
    opacity: 0,
    x: i % 2 === 0 ? -40 : 40,
  }),
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}

{items.map((item, i) => (
  <motion.div
    key={item.id}
    custom={i}
    variants={alternatingItem}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
  >
    {item.content}
  </motion.div>
))}
```

---

## 4. Page Transitions

### AnimatePresence for Route Changes (App Router)

Create a template file at `src/app/template.tsx`:

```tsx
'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
```

### Slide Page Transition

```tsx
'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
```

### AnimatePresence for Conditional Content (modals, tabs, etc.)

```tsx
'use client'

import { AnimatePresence, motion } from 'framer-motion'

<AnimatePresence mode="wait">
  {activeTab === 'monthly' && (
    <motion.div
      key="monthly"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
    >
      Monthly pricing content
    </motion.div>
  )}
  {activeTab === 'yearly' && (
    <motion.div
      key="yearly"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
    >
      Yearly pricing content
    </motion.div>
  )}
</AnimatePresence>
```

---

## 5. Hero Section Animations

### Floating Element (gentle bob up and down)

```tsx
<motion.div
  animate={{
    y: [0, -12, 0],
  }}
  transition={{
    duration: 4,
    repeat: Infinity,
    ease: 'easeInOut',
  }}
>
  <img src="/hero-illustration.svg" alt="Hero" />
</motion.div>
```

### Floating with Rotation (for decorative shapes)

```tsx
<motion.div
  className="absolute top-20 right-10 w-16 h-16 rounded-full bg-primary-400/20"
  animate={{
    y: [0, -15, 0],
    rotate: [0, 5, -5, 0],
    scale: [1, 1.05, 1],
  }}
  transition={{
    duration: 6,
    repeat: Infinity,
    ease: 'easeInOut',
  }}
/>
```

### Hero Text with Stagger Word Reveal

```tsx
'use client'

import { motion } from 'framer-motion'

interface HeroHeadingProps {
  text: string
}

export function HeroHeading({ text }: HeroHeadingProps) {
  const words = text.split(' ')

  return (
    <motion.h1
      className="text-5xl md:text-7xl font-bold leading-tight"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.08 } },
      }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.25em]"
          variants={{
            hidden: { opacity: 0, y: 30, filter: 'blur(4px)' },
            visible: {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
            },
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.h1>
  )
}
```

### Animated Counting Number (for stats sections)

```tsx
'use client'

import { useEffect, useRef } from 'react'
import { useInView, useMotionValue, useTransform, motion, animate } from 'framer-motion'

interface AnimatedCounterProps {
  target: number
  duration?: number
  prefix?: string
  suffix?: string
  className?: string
}

export function AnimatedCounter({
  target,
  duration = 2,
  prefix = '',
  suffix = '',
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const motionValue = useMotionValue(0)
  const rounded = useTransform(motionValue, (v) => Math.round(v))

  useEffect(() => {
    if (isInView) {
      const controls = animate(motionValue, target, {
        duration,
        ease: [0.22, 1, 0.36, 1],
      })
      return controls.stop
    }
  }, [isInView, motionValue, target, duration])

  useEffect(() => {
    const unsubscribe = rounded.on('change', (v) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${v.toLocaleString()}${suffix}`
      }
    })
    return unsubscribe
  }, [rounded, prefix, suffix])

  return <span ref={ref} className={className}>{prefix}0{suffix}</span>
}
```

Usage:

```tsx
<div className="grid grid-cols-3 gap-8 text-center">
  <div>
    <AnimatedCounter target={10000} suffix="+" className="text-4xl font-bold" />
    <p className="text-muted-foreground">Users</p>
  </div>
  <div>
    <AnimatedCounter target={99} suffix="%" className="text-4xl font-bold" />
    <p className="text-muted-foreground">Uptime</p>
  </div>
  <div>
    <AnimatedCounter target={50} prefix="$" suffix="M" className="text-4xl font-bold" />
    <p className="text-muted-foreground">Processed</p>
  </div>
</div>
```

### Typewriter Text Effect

```tsx
'use client'

import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect, useState } from 'react'

interface TypewriterProps {
  texts: string[]
  className?: string
}

export function Typewriter({ texts, className }: TypewriterProps) {
  const [textIndex, setTextIndex] = useState(0)
  const count = useMotionValue(0)
  const displayText = useTransform(count, (v) =>
    texts[textIndex].slice(0, Math.round(v))
  )
  const [display, setDisplay] = useState('')

  useEffect(() => {
    const text = texts[textIndex]
    const controls = animate(count, text.length, {
      type: 'tween',
      duration: text.length * 0.05,
      ease: 'linear',
      onComplete: () => {
        setTimeout(() => {
          animate(count, 0, {
            type: 'tween',
            duration: text.length * 0.03,
            ease: 'linear',
            onComplete: () => {
              setTextIndex((prev) => (prev + 1) % texts.length)
            },
          })
        }, 1500)
      },
    })
    return controls.stop
  }, [textIndex, count, texts])

  useEffect(() => {
    const unsubscribe = displayText.on('change', (v) => setDisplay(v))
    return unsubscribe
  }, [displayText])

  return (
    <span className={className}>
      {display}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
      >
        |
      </motion.span>
    </span>
  )
}
```

Usage:

```tsx
<h1 className="text-5xl font-bold">
  We build{' '}
  <Typewriter
    texts={['amazing apps', 'fast websites', 'great products']}
    className="text-primary-500"
  />
</h1>
```

---

## 6. Interactive Micro-Animations

### Button Press (scale down on click, hover glow)

```tsx
<motion.button
  className="px-6 py-3 bg-primary-500 text-white rounded-lg font-medium"
  whileHover={{ scale: 1.03, boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)' }}
  whileTap={{ scale: 0.97 }}
  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
>
  Get Started
</motion.button>
```

### Card Hover Lift with Shadow

```tsx
<motion.div
  className="p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
  whileHover={{
    y: -4,
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
    transition: { duration: 0.25, ease: 'easeOut' },
  }}
>
  <h3>Card content</h3>
</motion.div>
```

### Card with Border Glow on Hover

```tsx
<motion.div
  className="relative p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden"
  whileHover="hover"
>
  <motion.div
    className="absolute inset-0 rounded-xl opacity-0"
    style={{
      background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(147,51,234,0.2))',
    }}
    variants={{ hover: { opacity: 1 } }}
    transition={{ duration: 0.3 }}
  />
  <div className="relative z-10">
    <h3>Glowing Card</h3>
  </div>
</motion.div>
```

### Menu Item Slide-In Indicator on Hover

```tsx
<motion.a
  href="/about"
  className="relative px-4 py-2 text-gray-600 hover:text-gray-900"
  whileHover="hover"
>
  About
  <motion.div
    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 origin-left"
    initial={{ scaleX: 0 }}
    variants={{ hover: { scaleX: 1 } }}
    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
  />
</motion.a>
```

### Toggle Switch

```tsx
'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

export function ToggleSwitch() {
  const [isOn, setIsOn] = useState(false)

  return (
    <button
      className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-colors ${
        isOn ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
      }`}
      onClick={() => setIsOn(!isOn)}
      role="switch"
      aria-checked={isOn}
    >
      <motion.div
        className="w-6 h-6 rounded-full bg-white shadow-md"
        animate={{ x: isOn ? 22 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </button>
  )
}
```

### Accordion Expand/Collapse

```tsx
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, type ReactNode } from 'react'

interface AccordionItemProps {
  title: string
  children: ReactNode
}

export function AccordionItem({ title, children }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <button
        className="w-full flex items-center justify-between py-4 text-left font-medium"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        {title}
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
        >
          &#9662;
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-4 text-gray-600 dark:text-gray-400">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
```

---

## 7. Background Effects

### Animated Gradient Orbs (mesmerizing hero background)

```tsx
'use client'

import { motion } from 'framer-motion'

export function GradientOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      {/* Primary orb */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)',
          top: '-10%',
          left: '10%',
          filter: 'blur(60px)',
        }}
        animate={{
          x: [0, 80, -40, 0],
          y: [0, -60, 40, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      {/* Secondary orb */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(147,51,234,0.25) 0%, transparent 70%)',
          top: '30%',
          right: '5%',
          filter: 'blur(60px)',
        }}
        animate={{
          x: [0, -60, 30, 0],
          y: [0, 50, -30, 0],
          scale: [1, 0.85, 1.15, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      {/* Accent orb */}
      <motion.div
        className="absolute w-[350px] h-[350px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)',
          bottom: '10%',
          left: '30%',
          filter: 'blur(60px)',
        }}
        animate={{
          x: [0, 40, -60, 0],
          y: [0, -40, 20, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  )
}
```

### Floating Particles

```tsx
'use client'

import { motion } from 'framer-motion'

function Particle({ size, x, y, delay }: { size: number; x: string; y: string; delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full bg-primary-500/20 dark:bg-primary-400/10"
      style={{ width: size, height: size, left: x, top: y }}
      animate={{
        y: [0, -30, 0],
        opacity: [0.2, 0.6, 0.2],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 4 + Math.random() * 3,
        repeat: Infinity,
        delay,
        ease: 'easeInOut',
      }}
    />
  )
}

export function FloatingParticles({ count = 20 }: { count?: number }) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: 4 + Math.random() * 8,
    x: `${Math.random() * 100}%`,
    y: `${Math.random() * 100}%`,
    delay: Math.random() * 3,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      {particles.map((p) => (
        <Particle key={p.id} {...p} />
      ))}
    </div>
  )
}
```

### Animated Grid/Dot Pattern

```tsx
'use client'

import { motion } from 'framer-motion'

export function AnimatedDotGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(99,102,241,0.15) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
        animate={{
          backgroundPosition: ['0px 0px', '32px 32px'],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      {/* Fade edges */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, hsl(var(--background)) 75%)',
        }}
      />
    </div>
  )
}
```

### Aurora / Northern Lights Effect

```tsx
'use client'

import { motion } from 'framer-motion'

export function AuroraBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      <motion.div
        className="absolute -top-1/2 left-0 right-0 h-full"
        style={{
          background:
            'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(147,51,234,0.1), rgba(16,185,129,0.1), rgba(59,130,246,0.15))',
          backgroundSize: '400% 400%',
          filter: 'blur(80px)',
        }}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute -top-1/3 left-1/4 right-0 h-2/3"
        style={{
          background:
            'linear-gradient(225deg, rgba(244,63,94,0.1), rgba(168,85,247,0.12), rgba(59,130,246,0.08))',
          backgroundSize: '300% 300%',
          filter: 'blur(100px)',
        }}
        animate={{
          backgroundPosition: ['100% 0%', '0% 100%', '100% 0%'],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  )
}
```

### Floating Geometric Shapes

```tsx
'use client'

import { motion } from 'framer-motion'

interface ShapeProps {
  className: string
  style?: React.CSSProperties
  animateProps: Record<string, number[]>
  duration: number
}

function FloatingShape({ className, style, animateProps, duration }: ShapeProps) {
  return (
    <motion.div
      className={`absolute ${className}`}
      style={{ ...style, filter: 'blur(1px)' }}
      animate={animateProps}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  )
}

export function FloatingShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10 opacity-30">
      {/* Rotating square */}
      <FloatingShape
        className="w-12 h-12 border-2 border-primary-400/40 rounded-md"
        style={{ top: '15%', left: '10%' }}
        animateProps={{ rotate: [0, 360], y: [0, -20, 0] }}
        duration={12}
      />
      {/* Pulsing circle */}
      <FloatingShape
        className="w-8 h-8 rounded-full bg-purple-400/20"
        style={{ top: '60%', right: '15%' }}
        animateProps={{ scale: [1, 1.3, 1], y: [0, -15, 0] }}
        duration={8}
      />
      {/* Triangle (using CSS border trick) */}
      <FloatingShape
        className="w-0 h-0"
        style={{
          top: '25%',
          right: '25%',
          borderLeft: '12px solid transparent',
          borderRight: '12px solid transparent',
          borderBottom: '20px solid rgba(16,185,129,0.2)',
        }}
        animateProps={{ rotate: [0, -360], y: [0, 15, 0] }}
        duration={15}
      />
      {/* Ring */}
      <FloatingShape
        className="w-16 h-16 rounded-full border-2 border-rose-400/20"
        style={{ bottom: '20%', left: '20%' }}
        animateProps={{ rotate: [0, 180], scale: [1, 1.1, 1] }}
        duration={10}
      />
    </div>
  )
}
```

---

## 8. Loading Animations

### Skeleton Shimmer

```tsx
'use client'

import { motion } from 'framer-motion'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = 'h-4 w-full' }: SkeletonProps) {
  return (
    <motion.div
      className={`rounded-md bg-gray-200 dark:bg-gray-700 ${className}`}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
      <Skeleton className="h-40 w-full rounded-lg" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="flex gap-3 pt-2">
        <Skeleton className="h-9 w-24 rounded-md" />
        <Skeleton className="h-9 w-24 rounded-md" />
      </div>
    </div>
  )
}
```

### Spinner

```tsx
<motion.div
  className="w-8 h-8 border-3 border-gray-300 border-t-primary-500 rounded-full"
  animate={{ rotate: 360 }}
  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
/>
```

### Pulsing Dots

```tsx
export function PulsingDots() {
  return (
    <div className="flex gap-1.5 items-center">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2.5 h-2.5 rounded-full bg-primary-500"
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.15,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
```

### Animated Progress Bar

```tsx
export function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-primary-500 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  )
}
```

---

## 9. Layout Animations

### Shared Element Transition with layoutId

```tsx
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

export function ExpandableCards({ cards }: { cards: { id: string; title: string; body: string }[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selectedCard = cards.find((c) => c.id === selectedId)

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        {cards.map((card) => (
          <motion.div
            key={card.id}
            layoutId={`card-${card.id}`}
            onClick={() => setSelectedId(card.id)}
            className="p-6 rounded-xl bg-white dark:bg-gray-900 border cursor-pointer"
            whileHover={{ scale: 1.02 }}
          >
            <motion.h3 layoutId={`title-${card.id}`} className="font-semibold">
              {card.title}
            </motion.h3>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedCard && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedId(null)}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                layoutId={`card-${selectedCard.id}`}
                className="w-full max-w-lg p-8 rounded-2xl bg-white dark:bg-gray-900 border"
              >
                <motion.h3 layoutId={`title-${selectedCard.id}`} className="text-xl font-semibold mb-4">
                  {selectedCard.title}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.15 }}
                  className="text-gray-600 dark:text-gray-400"
                >
                  {selectedCard.body}
                </motion.p>
                <motion.button
                  className="mt-6 text-sm text-primary-500 hover:underline"
                  onClick={() => setSelectedId(null)}
                  whileTap={{ scale: 0.95 }}
                >
                  Close
                </motion.button>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
```

### List Reorder Animation

```tsx
'use client'

import { Reorder, motion } from 'framer-motion'
import { useState } from 'react'

export function ReorderableList() {
  const [items, setItems] = useState(['Item A', 'Item B', 'Item C', 'Item D'])

  return (
    <Reorder.Group axis="y" values={items} onReorder={setItems} className="space-y-2">
      {items.map((item) => (
        <Reorder.Item
          key={item}
          value={item}
          className="p-4 bg-white dark:bg-gray-900 rounded-lg border cursor-grab active:cursor-grabbing"
          whileDrag={{ scale: 1.03, boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}
        >
          {item}
        </Reorder.Item>
      ))}
    </Reorder.Group>
  )
}
```

### Layout animation for filter/sort changes

```tsx
<motion.div layout className="grid grid-cols-3 gap-4">
  {filteredItems.map((item) => (
    <motion.div
      key={item.id}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <Card {...item} />
    </motion.div>
  ))}
</motion.div>
```

---

## 10. Text Animations

### Word-by-Word Reveal on Scroll

```tsx
'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

interface WordRevealProps {
  text: string
  className?: string
}

export function WordReveal({ text, className }: WordRevealProps) {
  const ref = useRef<HTMLParagraphElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const words = text.split(' ')

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.25em]"
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{
            duration: 0.3,
            delay: i * 0.04,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {word}
        </motion.span>
      ))}
    </p>
  )
}
```

### Character Stagger

```tsx
'use client'

import { motion } from 'framer-motion'

interface CharStaggerProps {
  text: string
  className?: string
  delay?: number
}

export function CharStagger({ text, className, delay = 0 }: CharStaggerProps) {
  const chars = text.split('')

  return (
    <motion.span
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.03, delayChildren: delay },
        },
      }}
    >
      {chars.map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
            },
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.span>
  )
}
```

### Animated Highlight / Underline

```tsx
'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, type ReactNode } from 'react'

export function AnimatedHighlight({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })

  return (
    <span ref={ref} className="relative inline-block">
      {children}
      <motion.span
        className="absolute bottom-0 left-0 right-0 h-[30%] bg-primary-500/20 -z-10 rounded-sm"
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        style={{ originX: 0 }}
      />
    </span>
  )
}
```

Usage:

```tsx
<p className="text-lg">
  We help companies build <AnimatedHighlight>world-class products</AnimatedHighlight> faster.
</p>
```

---

## 11. Modal / Dialog Animation

```tsx
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import type { ReactNode } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

export function AnimatedModal({ isOpen, onClose, children }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              {children}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
```

---

## 12. Reusable Animation Variants (copy-paste into any project)

Create `src/lib/animations.ts`:

```tsx
// ===== ENTRANCE VARIANTS =====

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.4 },
}

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
}

export const fadeInDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
}

export const fadeInLeft = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
}

export const fadeInRight = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
}

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { type: 'spring', stiffness: 200, damping: 20 },
}

export const scaleInBounce = {
  initial: { opacity: 0, scale: 0.5 },
  animate: { opacity: 1, scale: 1 },
  transition: { type: 'spring', stiffness: 300, damping: 12 },
}

export const slideInLeft = {
  initial: { x: -60, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { type: 'spring', stiffness: 100, damping: 20 },
}

export const slideInRight = {
  initial: { x: 60, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { type: 'spring', stiffness: 100, damping: 20 },
}

export const rotateIn = {
  initial: { opacity: 0, rotate: -10, scale: 0.9 },
  animate: { opacity: 1, rotate: 0, scale: 1 },
  transition: { type: 'spring', stiffness: 150, damping: 15 },
}

export const blurIn = {
  initial: { opacity: 0, filter: 'blur(8px)' },
  animate: { opacity: 1, filter: 'blur(0px)' },
  transition: { duration: 0.5 },
}

// ===== CONTAINER VARIANTS (for staggering children) =====

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

export const staggerContainerSlow = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
}

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
}

export const staggerItemScale = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
}

export const staggerItemSlideRight = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
}

// ===== HOVER / TAP PRESETS =====

export const hoverLift = {
  whileHover: { y: -4, transition: { duration: 0.2 } },
}

export const hoverScale = {
  whileHover: { scale: 1.03, transition: { duration: 0.2 } },
  whileTap: { scale: 0.97 },
}

export const hoverGlow = {
  whileHover: {
    scale: 1.02,
    boxShadow: '0 8px 30px rgba(59, 130, 246, 0.25)',
    transition: { duration: 0.25 },
  },
  whileTap: { scale: 0.98 },
}

export const tapShrink = {
  whileTap: { scale: 0.95 },
}

// ===== PAGE TRANSITION =====

export const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
}
```

Usage:

```tsx
import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer, staggerItem, hoverLift } from '@/lib/animations'

// Spread on any motion element
<motion.div {...fadeInUp}>
  <h2>Title</h2>
</motion.div>

// Container + items
<motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
  {items.map(item => (
    <motion.div key={item.id} variants={staggerItem} {...hoverLift}>
      <Card {...item} />
    </motion.div>
  ))}
</motion.div>
```

---

## 13. Complete Hero Section Example

Combines multiple patterns into a production-ready hero:

```tsx
'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { GradientOrbs } from '@/components/gradient-orbs'
import { HeroHeading } from '@/components/hero-heading'
import { AnimatedCounter } from '@/components/animated-counter'

export function HeroSection() {
  const statsRef = useRef<HTMLDivElement>(null)
  const statsInView = useInView(statsRef, { once: true })

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      <GradientOrbs />

      {/* Badge */}
      <motion.div
        className="mb-6 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-sm text-primary-600 dark:text-primary-400"
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        Now in public beta
      </motion.div>

      {/* Heading */}
      <HeroHeading text="Build products that people love" />

      {/* Subtitle */}
      <motion.p
        className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        The all-in-one platform that helps teams ship faster,
        collaborate better, and build with confidence.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        className="mt-10 flex flex-wrap gap-4 justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <motion.button
          className="px-8 py-3.5 bg-primary-500 text-white rounded-xl font-semibold text-lg"
          whileHover={{ scale: 1.03, boxShadow: '0 4px 20px rgba(59,130,246,0.4)' }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          Get Started Free
        </motion.button>
        <motion.button
          className="px-8 py-3.5 border border-gray-300 dark:border-gray-600 rounded-xl font-semibold text-lg"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          Watch Demo
        </motion.button>
      </motion.div>

      {/* Stats */}
      <motion.div
        ref={statsRef}
        className="mt-20 grid grid-cols-3 gap-12 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={statsInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div>
          <AnimatedCounter target={10000} suffix="+" className="text-4xl font-bold" />
          <p className="mt-1 text-sm text-gray-500">Active users</p>
        </div>
        <div>
          <AnimatedCounter target={99} suffix="%" className="text-4xl font-bold" />
          <p className="mt-1 text-sm text-gray-500">Uptime</p>
        </div>
        <div>
          <AnimatedCounter target={4.9} duration={1.5} className="text-4xl font-bold" />
          <p className="mt-1 text-sm text-gray-500">User rating</p>
        </div>
      </motion.div>
    </section>
  )
}
```

---

## 14. Performance Tips

### Animate Only Transforms and Opacity

GPU-accelerated properties (fast):
- `x`, `y`, `scale`, `rotate`, `opacity`

CPU-painted properties (slow, avoid animating):
- `width`, `height`, `padding`, `margin`, `border-radius`, `background-color`

Exception: `height: 'auto'` is fine for accordions (Framer Motion handles it).

### Use `will-change` Sparingly

Only add `will-change: transform` on elements that animate frequently (like floating decorations).
Do NOT add it to every animated element -- it reserves GPU memory.

### AnimatePresence Modes

```
mode="wait"  → old element fully exits BEFORE new enters (use for tab/page switches)
mode="sync"  → old exits and new enters simultaneously (use for crossfade effects)
mode="popLayout" → exiting elements are popped from layout flow (use for lists)
```

### Avoid Layout Thrashing

- Only use `layout` prop on elements whose position actually changes
- Wrap layout-animated elements in `LayoutGroup` if they are in separate components
- Use `layoutId` for shared element transitions, not for general animations

### Reduce Motion (accessibility)

```tsx
import { useReducedMotion } from 'framer-motion'

function MyComponent() {
  const prefersReduced = useReducedMotion()

  return (
    <motion.div
      animate={{ y: prefersReduced ? 0 : [0, -10, 0] }}
      transition={prefersReduced ? { duration: 0 } : { duration: 3, repeat: Infinity }}
    >
      Respects user motion preferences
    </motion.div>
  )
}
```

---

## 15. CSS Alternative (Simple Scope -- No React)

For projects with `scope: "simple"`, use CSS animations instead:

```css
/* Fade in up */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fadeInUp 0.5s ease forwards;
}

/* Fade in */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fade-in {
  animation: fadeIn 0.5s ease forwards;
}

/* Scale in */
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
.animate-scale-in {
  animation: scaleIn 0.4s ease forwards;
}

/* Slide in from left */
@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
}
.animate-slide-in-left {
  animation: slideInLeft 0.5s ease forwards;
}

/* Stagger delay utilities */
.delay-100 { animation-delay: 0.1s; }
.delay-200 { animation-delay: 0.2s; }
.delay-300 { animation-delay: 0.3s; }
.delay-400 { animation-delay: 0.4s; }
.delay-500 { animation-delay: 0.5s; }

/* Float animation (for decorative elements) */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}
.animate-float {
  animation: float 4s ease-in-out infinite;
}

/* Shimmer loading */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.animate-shimmer {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}

/* Scroll-triggered (use with IntersectionObserver in JS) */
.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
```

JavaScript for scroll-triggered reveals (Simple scope):

```js
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
      }
    })
  },
  { threshold: 0.1, rootMargin: '-50px' }
)

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
```
