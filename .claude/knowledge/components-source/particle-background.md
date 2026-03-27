# Particle Background Component — Copy-Paste Ready

A reusable animated particle background that can be dropped behind any section.

## Install Dependencies

```bash
npm install three @react-three/fiber @react-three/drei
npm install -D @types/three
```

---

## Particle Background Component

```tsx
// src/components/3d/particle-background.tsx
'use client'

import { Suspense, useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import * as THREE from 'three'

type ParticlePreset = 'ambient' | 'dense' | 'sparse' | 'galaxy' | 'rain'

interface ParticleBackgroundProps {
  preset?: ParticlePreset
  color?: string
  className?: string
  opacity?: number
}

const PRESETS: Record<ParticlePreset, { count: number; spread: number; speed: number; size: number }> = {
  ambient: { count: 800, spread: 12, speed: 0.2, size: 0.015 },
  dense: { count: 2000, spread: 10, speed: 0.15, size: 0.01 },
  sparse: { count: 300, spread: 15, speed: 0.1, size: 0.025 },
  galaxy: { count: 3000, spread: 8, speed: 0.3, size: 0.008 },
  rain: { count: 1000, spread: 10, speed: 1.5, size: 0.005 },
}

function Particles({ preset = 'ambient', color = '#6366f1', opacity = 0.5 }: Omit<ParticleBackgroundProps, 'className'>) {
  const config = PRESETS[preset]
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
  }, [])

  const count = isMobile ? Math.floor(config.count * 0.4) : config.count

  const particles = useMemo(() =>
    Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * config.spread,
      y: (Math.random() - 0.5) * config.spread,
      z: (Math.random() - 0.5) * config.spread * 0.5,
      speed: config.speed * (0.5 + Math.random()),
      offset: Math.random() * Math.PI * 2,
      scale: 0.4 + Math.random() * 0.6,
    })),
    [count, config.spread, config.speed]
  )

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()

    particles.forEach((p, i) => {
      if (preset === 'rain') {
        p.y -= config.speed * 0.016
        if (p.y < -config.spread / 2) {
          p.y = config.spread / 2
          p.x = (Math.random() - 0.5) * config.spread
        }
        dummy.position.set(p.x, p.y, p.z)
      } else if (preset === 'galaxy') {
        const angle = t * p.speed + p.offset
        const radius = Math.sqrt(p.x ** 2 + p.z ** 2)
        dummy.position.set(
          Math.cos(angle) * radius,
          p.y * 0.2 + Math.sin(t * 0.3 + p.offset) * 0.1,
          Math.sin(angle) * radius,
        )
      } else {
        dummy.position.set(
          p.x + Math.sin(t * p.speed + p.offset) * 0.5,
          p.y + Math.cos(t * p.speed * 0.8 + p.offset) * 0.5,
          p.z + Math.sin(t * p.speed * 0.5 + p.offset) * 0.3,
        )
      }

      dummy.scale.setScalar(p.scale)
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
    })

    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[config.size, 6, 6]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} />
    </instancedMesh>
  )
}

export function ParticleBackground({
  preset = 'ambient',
  color,
  className = 'absolute inset-0',
  opacity = 0.5,
}: ParticleBackgroundProps) {
  const [prefersReduced, setPrefersReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReduced(mq.matches)
  }, [])

  if (prefersReduced) {
    return <div className={`${className} -z-10`} />
  }

  return (
    <div className={`${className} -z-10`} role="img" aria-label="Animated particle background">
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 5], fov: 60 }} gl={{ alpha: true }}>
        <Suspense fallback={null}>
          <Particles preset={preset} color={color} opacity={opacity} />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  )
}
```

---

## Usage Examples

### Default Ambient Particles
```tsx
import { ParticleBackground } from '@/components/3d/particle-background'

<section className="relative min-h-screen">
  <ParticleBackground />
  <div className="relative z-10">
    {/* Your content */}
  </div>
</section>
```

### Dense Purple Particles
```tsx
<ParticleBackground preset="dense" color="#8b5cf6" opacity={0.4} />
```

### Galaxy Rotation
```tsx
<ParticleBackground preset="galaxy" color="#6366f1" />
```

### Sparse Large Particles
```tsx
<ParticleBackground preset="sparse" color="#f59e0b" opacity={0.6} />
```

### Rain Effect
```tsx
<ParticleBackground preset="rain" color="#87ceeb" opacity={0.3} />
```

---

## Dynamic Import (SSR-Safe)

```tsx
import dynamic from 'next/dynamic'

const ParticleBackground = dynamic(
  () => import('@/components/3d/particle-background').then(mod => mod.ParticleBackground),
  { ssr: false }
)
```
