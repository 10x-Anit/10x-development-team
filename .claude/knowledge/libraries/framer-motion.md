# Framer Motion Animation Reference

## Install
```bash
npm install framer-motion
```

## Core Concept
Wrap elements with `<motion.div>` and add animation props.

## Basic Animations

### Fade In
```tsx
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  Content fades in
</motion.div>
```

### Slide Up + Fade
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Slides up and fades in
</motion.div>
```

### Scale on Hover
```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: 'spring', stiffness: 300 }}
>
  Bouncy button
</motion.button>
```

### Slide In from Left
```tsx
<motion.div
  initial={{ x: -100, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  transition={{ type: 'spring', damping: 20 }}
>
  Slides in from left
</motion.div>
```

## Scroll Animations (Animate on Enter Viewport)
```tsx
<motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: '-100px' }}
  transition={{ duration: 0.6 }}
>
  Animates when scrolled into view
</motion.div>
```

## Staggered Children (List Items Appear One by One)
```tsx
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

<motion.ul variants={container} initial="hidden" animate="show">
  {items.map(i => (
    <motion.li key={i.id} variants={item}>{i.name}</motion.li>
  ))}
</motion.ul>
```

## Page Transitions
```tsx
// Wrap page content
<motion.main
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.3 }}
>
  {children}
</motion.main>
```

## Layout Animations (Auto-animate position/size changes)
```tsx
<motion.div layout>
  {/* This element smoothly animates when its size or position changes */}
</motion.div>
```

## AnimatePresence (Animate Exit)
```tsx
import { AnimatePresence, motion } from 'framer-motion'

<AnimatePresence>
  {isVisible && (
    <motion.div
      key="modal"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      Modal content
    </motion.div>
  )}
</AnimatePresence>
```

## Common Presets (Copy These)

### fadeInUp
```tsx
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}
<motion.div {...fadeInUp}>Content</motion.div>
```

### slideInRight
```tsx
const slideInRight = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.4 }
}
```

### scaleIn
```tsx
const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { type: 'spring', stiffness: 200, damping: 20 }
}
```

## When to Use
- Production scope: page transitions, scroll animations, micro-interactions
- MVP scope: subtle fade-in on key elements only
- Prototype: skip animations — speed matters more
- Simple scope: use CSS animations instead (no React)

## CSS Alternative (Simple scope)
```css
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up { animation: fadeInUp 0.5s ease forwards; }
```
