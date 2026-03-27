# 3D Scene Component — Copy-Paste Ready

A reusable 3D scene wrapper with lighting, environment, and loading state. Drop into any page.

## Install Dependencies

```bash
npm install three @react-three/fiber @react-three/drei
npm install -D @types/three
```

---

## Base Scene Component

```tsx
// src/components/3d/scene-container.tsx
'use client'

import { Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls, Preload } from '@react-three/drei'

interface Scene3DProps {
  children: React.ReactNode
  className?: string
  cameraPosition?: [number, number, number]
  fov?: number
  controls?: boolean
  autoRotate?: boolean
  environment?: 'city' | 'studio' | 'sunset' | 'warehouse' | 'forest' | 'apartment' | 'dawn' | 'night' | 'park' | 'lobby'
  ariaLabel?: string
  transparent?: boolean
}

function SceneLoader() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Loading 3D scene...</p>
      </div>
    </div>
  )
}

export function Scene3D({
  children,
  className = 'h-screen w-full',
  cameraPosition = [0, 0, 5],
  fov = 45,
  controls = false,
  autoRotate = false,
  environment = 'city',
  ariaLabel = '3D scene',
  transparent = true,
}: Scene3DProps) {
  const [prefersReduced, setPrefersReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReduced(mq.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  if (prefersReduced) {
    return (
      <div className={className} role="img" aria-label={ariaLabel}>
        <div className="flex h-full items-center justify-center">
          <div className="absolute inset-0 -z-10">
            <div className="absolute -left-[20%] -top-[20%] h-[400px] w-[400px] rounded-full bg-primary/15 blur-[100px]" />
            <div className="absolute -bottom-[10%] right-[10%] h-[300px] w-[300px] rounded-full bg-accent/10 blur-[80px]" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={className} role="img" aria-label={ariaLabel}>
      <Suspense fallback={<SceneLoader />}>
        <Canvas
          dpr={[1, 2]}
          camera={{ position: cameraPosition, fov }}
          gl={{ antialias: true, alpha: transparent }}
        >
          <Suspense fallback={null}>
            {/* Default lighting */}
            <ambientLight intensity={0.4} />
            <directionalLight position={[10, 10, 5]} intensity={1} />

            {/* Environment */}
            <Environment preset={environment} />

            {/* Scene content */}
            {children}

            {/* Optional controls */}
            {controls && (
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                autoRotate={autoRotate}
                autoRotateSpeed={0.5}
              />
            )}

            <Preload all />
          </Suspense>
        </Canvas>
      </Suspense>
    </div>
  )
}
```

---

## Usage Examples

### Simple Floating Object
```tsx
import { Scene3D } from '@/components/3d/scene-container'
import { Float } from '@react-three/drei'

export function MyPage() {
  return (
    <Scene3D className="h-[500px] w-full" ariaLabel="Floating torus knot">
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.8}>
        <mesh>
          <torusKnotGeometry args={[1, 0.35, 128, 16]} />
          <meshStandardMaterial color="hsl(262, 83%, 58%)" metalness={0.9} roughness={0.1} />
        </mesh>
      </Float>
    </Scene3D>
  )
}
```

### Interactive with Controls
```tsx
<Scene3D controls autoRotate ariaLabel="Interactive 3D model">
  <mesh>
    <dodecahedronGeometry args={[1.5, 0]} />
    <meshStandardMaterial color="hsl(222, 47%, 51%)" metalness={0.8} roughness={0.2} />
  </mesh>
</Scene3D>
```

### Transparent Overlay on HTML
```tsx
<section className="relative min-h-screen">
  <div className="absolute inset-0 z-0">
    <Scene3D transparent ariaLabel="Background 3D scene">
      {/* 3D content */}
    </Scene3D>
  </div>
  <div className="relative z-10">
    {/* HTML content on top */}
  </div>
</section>
```

---

## Dynamic Import for Next.js (SSR-Safe)

```tsx
// src/components/3d/dynamic-scene.tsx
'use client'

import dynamic from 'next/dynamic'

export const DynamicScene3D = dynamic(
  () => import('./scene-container').then(mod => mod.Scene3D),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    ),
  }
)
```
