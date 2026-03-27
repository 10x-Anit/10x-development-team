# Scroll-Driven 3D Hero — Copy-Paste Ready

A hero section with a 3D object that responds to scroll. The camera moves through the scene as the user scrolls down.

## Install Dependencies

```bash
npm install three @react-three/fiber @react-three/drei gsap
npm install -D @types/three
```

---

## Scroll 3D Hero Component

```tsx
// src/components/sections/hero-3d.tsx
'use client'

import { Suspense, useRef, useEffect, useState } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { Float, Environment, MeshDistortMaterial, Preload } from '@react-three/drei'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'

gsap.registerPlugin(ScrollTrigger)

// --- 3D Objects ---

function HeroMesh() {
  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.6}>
      <mesh scale={2}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color="hsl(262, 83%, 58%)"
          metalness={0.9}
          roughness={0.1}
          distort={0.3}
          speed={1.5}
        />
      </mesh>
    </Float>
  )
}

function AccentShapes() {
  return (
    <>
      <Float speed={2} rotationIntensity={0.8} floatIntensity={1}>
        <mesh position={[-4, 1.5, -3]} scale={0.5}>
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial color="hsl(222, 47%, 51%)" metalness={0.8} roughness={0.2} />
        </mesh>
      </Float>

      <Float speed={1.2} rotationIntensity={0.6} floatIntensity={0.5}>
        <mesh position={[4, -1, -2]} scale={0.4}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="hsl(142, 76%, 36%)" metalness={0.8} roughness={0.2} />
        </mesh>
      </Float>

      <Float speed={1.8} rotationIntensity={0.3} floatIntensity={0.7}>
        <mesh position={[3, 2.5, -4]} scale={0.35}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="hsl(346, 77%, 50%)" metalness={0.7} roughness={0.3} />
        </mesh>
      </Float>
    </>
  )
}

// --- Scroll Camera Controller ---

function ScrollCamera() {
  const { camera } = useThree()
  const target = useRef({ x: 0, y: 0, z: 6 })

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '#hero-scroll-container',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.5,
        }
      })

      tl.to(target.current, { x: 1.5, y: 0.5, z: 5, duration: 1 }, 0)
        .to(target.current, { x: -0.5, y: 1, z: 4, duration: 1 }, 1)
        .to(target.current, { x: 0, y: 0, z: 7, duration: 1 }, 2)
    })

    return () => ctx.revert()
  }, [])

  useFrame(() => {
    camera.position.lerp(
      new THREE.Vector3(target.current.x, target.current.y, target.current.z),
      0.08
    )
    camera.lookAt(0, 0, 0)
  })

  return null
}

// --- Main Hero Component ---

interface Hero3DProps {
  title: string
  subtitle?: string
  description?: string
  ctaPrimary?: { label: string; href: string }
  ctaSecondary?: { label: string; href: string }
}

export function Hero3D({
  title,
  subtitle,
  description,
  ctaPrimary,
  ctaSecondary,
}: Hero3DProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  return (
    <div id="hero-scroll-container">
      {/* Fixed 3D Canvas */}
      <div className="fixed inset-0 z-0" role="img" aria-label="Interactive 3D hero background">
        {!isMobile && (
          <Canvas
            dpr={[1, 2]}
            camera={{ position: [0, 0, 6], fov: 45 }}
            gl={{ alpha: true, antialias: true }}
          >
            <Suspense fallback={null}>
              <ambientLight intensity={0.4} />
              <directionalLight position={[10, 10, 5]} intensity={1} />
              <pointLight position={[-5, -5, 5]} intensity={0.3} color="hsl(346, 77%, 50%)" />

              <HeroMesh />
              <AccentShapes />
              <ScrollCamera />
              <Environment preset="city" />
              <Preload all />
            </Suspense>
          </Canvas>
        )}

        {/* Mobile gradient fallback */}
        {isMobile && (
          <div className="h-full w-full">
            <div className="absolute -left-[20%] -top-[20%] h-[400px] w-[400px] rounded-full bg-primary/20 blur-[100px]" />
            <div className="absolute bottom-[10%] right-[5%] h-[300px] w-[300px] rounded-full bg-accent/15 blur-[80px]" />
          </div>
        )}
      </div>

      {/* Scrollable content sections */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="flex min-h-screen items-center justify-center px-4">
          <div className="text-center">
            {subtitle && (
              <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                {subtitle}
              </p>
            )}
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-7xl">
              {title}
            </h1>
            {description && (
              <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
                {description}
              </p>
            )}
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              {ctaPrimary && (
                <a
                  href={ctaPrimary.href}
                  className="rounded-xl bg-primary px-8 py-4 text-base font-medium text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl active:scale-[0.98]"
                >
                  {ctaPrimary.label}
                </a>
              )}
              {ctaSecondary && (
                <a
                  href={ctaSecondary.href}
                  className="rounded-xl border border-border bg-card/60 px-8 py-4 text-base font-medium text-foreground backdrop-blur-sm transition-all hover:bg-card/80"
                >
                  {ctaSecondary.label}
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Spacer sections (camera moves during scroll) */}
        <section className="flex min-h-screen items-center justify-center px-4">
          <div className="max-w-lg rounded-2xl bg-card/80 p-8 backdrop-blur-xl">
            {/* Add your section content here */}
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-4">
          <div className="max-w-lg rounded-2xl bg-card/80 p-8 backdrop-blur-xl">
            {/* Add your section content here */}
          </div>
        </section>
      </div>
    </div>
  )
}
```

---

## Usage

```tsx
// src/app/page.tsx
import { Hero3D } from '@/components/sections/hero-3d'

export default function HomePage() {
  return (
    <Hero3D
      title="Build Something Extraordinary"
      subtitle="Welcome to the future"
      description="Create stunning, interactive experiences with the power of 3D and AI. No design skills required."
      ctaPrimary={{ label: 'Get Started Free', href: '/signup' }}
      ctaSecondary={{ label: 'See Examples', href: '/examples' }}
    />
  )
}
```

---

## Dynamic Import (SSR-Safe)

```tsx
import dynamic from 'next/dynamic'

const Hero3D = dynamic(
  () => import('@/components/sections/hero-3d').then(mod => mod.Hero3D),
  { ssr: false, loading: () => <div className="min-h-screen" /> }
)
```
