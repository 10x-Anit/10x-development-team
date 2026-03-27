# 3D Hero Sections — Complete Patterns

Copy-paste-ready hero section patterns that combine 3D scenes with HTML content. The most impactful visual element on any landing page.

---

## 1. Floating Object Hero (Most Common)

A large floating 3D object behind the hero text. The signature "premium landing page" look.

```tsx
'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Float, Environment, MeshDistortMaterial, ContactShadows, Preload } from '@react-three/drei'

function HeroObject() {
  return (
    <>
      <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.6}>
        <mesh scale={2.5}>
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
      <ContactShadows position={[0, -3, 0]} opacity={0.3} scale={10} blur={2.5} />
      <Environment preset="city" />
    </>
  )
}

function HeroScene() {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 6], fov: 45 }}
      gl={{ alpha: true, antialias: true }}
      style={{ position: 'absolute', top: 0, left: 0 }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-5, -5, 5]} intensity={0.3} color="hsl(346, 77%, 50%)" />
        <HeroObject />
        <Preload all />
      </Suspense>
    </Canvas>
  )
}

export function FloatingObjectHero() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0" role="img" aria-label="3D animated background">
        <HeroScene />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Welcome to the future
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-7xl">
            Build Something
            <span className="block text-primary">Extraordinary</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            Create stunning, interactive experiences with the power of 3D.
            No design skills required.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <button className="rounded-xl bg-primary px-8 py-4 text-base font-medium text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl active:scale-[0.98]">
              Get Started Free
            </button>
            <button className="rounded-xl border border-border bg-card/60 px-8 py-4 text-base font-medium text-foreground backdrop-blur-sm transition-all hover:bg-card/80">
              See Examples
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
```

---

## 2. Particle Field Hero

A dense particle field as the background. Creates an immersive, tech-forward feel.

```tsx
'use client'

import { Suspense, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import * as THREE from 'three'

function ParticleField() {
  const count = 2000
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const particles = useMemo(() =>
    Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 15,
      y: (Math.random() - 0.5) * 15,
      z: (Math.random() - 0.5) * 10,
      speed: 0.1 + Math.random() * 0.3,
      offset: Math.random() * Math.PI * 2,
      scale: 0.3 + Math.random() * 0.7,
    })),
    []
  )

  useFrame(({ clock, mouse }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()

    particles.forEach((p, i) => {
      dummy.position.set(
        p.x + Math.sin(t * p.speed + p.offset) * 0.5 + mouse.x * 0.3,
        p.y + Math.cos(t * p.speed * 0.8 + p.offset) * 0.5 + mouse.y * 0.3,
        p.z + Math.sin(t * p.speed * 0.5) * 0.2,
      )
      dummy.scale.setScalar(p.scale * (0.8 + Math.sin(t + p.offset) * 0.2))
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
    })

    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.015, 6, 6]} />
      <meshBasicMaterial color="hsl(262, 83%, 70%)" transparent opacity={0.5} />
    </instancedMesh>
  )
}

export function ParticleHero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-background">
      {/* Particle Canvas */}
      <div className="absolute inset-0 z-0" role="img" aria-label="Animated particle field">
        <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 5], fov: 60 }}>
          <Suspense fallback={null}>
            <ParticleField />
            <Preload all />
          </Suspense>
        </Canvas>
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-7xl">
            Powered by Intelligence
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed">
            AI-driven experiences that adapt and respond in real time.
          </p>
          <button className="mt-10 rounded-xl bg-primary px-8 py-4 text-base font-medium text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl active:scale-[0.98]">
            Launch App
          </button>
        </div>
      </div>
    </section>
  )
}
```

---

## 3. Wireframe + Bloom Hero (Neon Tech)

Glowing wireframe objects with bloom post-processing. Cyberpunk/tech aesthetic.

```tsx
'use client'

import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Preload } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'

function WireframeObjects() {
  const group = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.1
    }
  })

  return (
    <group ref={group}>
      <Float speed={1.5} floatIntensity={0.5}>
        <mesh position={[0, 0, 0]}>
          <torusKnotGeometry args={[1.5, 0.4, 128, 16]} />
          <meshBasicMaterial color="hsl(262, 83%, 65%)" wireframe toneMapped={false} />
        </mesh>
      </Float>

      <Float speed={2} rotationIntensity={1}>
        <mesh position={[-3, 1, -2]} scale={0.8}>
          <icosahedronGeometry args={[1, 1]} />
          <meshBasicMaterial color="hsl(190, 90%, 50%)" wireframe toneMapped={false} />
        </mesh>
      </Float>

      <Float speed={1} rotationIntensity={0.5}>
        <mesh position={[3, -0.5, -1]} scale={0.6}>
          <octahedronGeometry args={[1, 0]} />
          <meshBasicMaterial color="hsl(346, 77%, 60%)" wireframe toneMapped={false} />
        </mesh>
      </Float>
    </group>
  )
}

export function NeonHero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 z-0" role="img" aria-label="Neon wireframe 3D objects">
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 6], fov: 45 }}>
          <Suspense fallback={null}>
            <WireframeObjects />
            <EffectComposer>
              <Bloom luminanceThreshold={0.1} intensity={1.5} mipmapBlur />
              <Vignette offset={0.3} darkness={0.7} />
            </EffectComposer>
            <Preload all />
          </Suspense>
        </Canvas>
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-8xl">
            Next Gen
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-lg text-muted-foreground">
            Built for the future of the web.
          </p>
        </div>
      </div>
    </section>
  )
}
```

---

## 4. Glass Sphere + Gradient Hero

A glass-like transparent sphere with a beautiful environment reflection.

```tsx
'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Float, Environment, Preload } from '@react-three/drei'

function GlassSphere() {
  return (
    <>
      <Float speed={1} rotationIntensity={0.3} floatIntensity={0.4}>
        <mesh scale={2}>
          <sphereGeometry args={[1, 64, 64]} />
          <meshPhysicalMaterial
            transmission={0.95}
            thickness={0.5}
            roughness={0.05}
            ior={1.5}
            chromaticAberration={0.06}
            envMapIntensity={1.5}
            color="#ffffff"
          />
        </mesh>
      </Float>

      {/* Inner colored object visible through glass */}
      <Float speed={2} rotationIntensity={1}>
        <mesh scale={0.8}>
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial color="hsl(262, 83%, 58%)" metalness={0.9} roughness={0.1} />
        </mesh>
      </Float>

      <Environment preset="sunset" background blur={0.8} />
    </>
  )
}

export function GlassHero() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 z-0" role="img" aria-label="Glass sphere 3D scene">
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 6], fov: 40 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.3} />
            <directionalLight position={[5, 5, 5]} intensity={0.5} />
            <GlassSphere />
            <Preload all />
          </Suspense>
        </Canvas>
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Crystal Clear Vision
          </h1>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            See through the complexity. Build with clarity.
          </p>
        </div>
      </div>
    </section>
  )
}
```

---

## 5. Starfield / Galaxy Hero (Space Theme)

```tsx
'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Stars, Sparkles, Float, Preload } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'

function SpaceScene() {
  return (
    <>
      <Stars radius={100} depth={50} count={4000} factor={4} fade speed={0.5} />
      <Sparkles count={80} scale={10} size={2} speed={0.3} color="hsl(262, 83%, 70%)" />

      <Float speed={0.5} rotationIntensity={0.2} floatIntensity={0.3}>
        <mesh position={[3, 1, -5]} scale={0.8}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color="hsl(262, 83%, 30%)" emissive="hsl(262, 83%, 20%)" emissiveIntensity={0.5} />
        </mesh>
      </Float>

      <EffectComposer>
        <Bloom luminanceThreshold={0.3} intensity={0.5} mipmapBlur />
      </EffectComposer>
    </>
  )
}

export function SpaceHero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 z-0" role="img" aria-label="Starfield background">
        <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 1], fov: 60 }}>
          <Suspense fallback={null}>
            <SpaceScene />
            <Preload all />
          </Suspense>
        </Canvas>
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-7xl">
            Explore the Universe
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            Boundless creativity. Infinite possibilities.
          </p>
        </div>
      </div>
    </section>
  )
}
```

---

## Hero Selection Guide

| Aesthetic | Hero Pattern | Best For |
|-----------|-------------|----------|
| Premium / SaaS | Floating Object | Product launches, SaaS landing |
| Tech / AI | Particle Field | AI products, developer tools |
| Cyberpunk / Gaming | Wireframe + Bloom | Gaming, entertainment, tech |
| Luxury / Minimal | Glass Sphere | Fashion, finance, luxury brands |
| Space / Exploration | Starfield Galaxy | Science, education, creative |
| Organic / Wellness | Morphing Blob | Health, wellness, nature |

---

## Mobile Optimization

ALWAYS provide a fallback for mobile:

```tsx
'use client'

import { useState, useEffect } from 'react'

export function ResponsiveHero() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  return (
    <section className="relative min-h-screen">
      {isMobile ? (
        // CSS gradient fallback for mobile
        <div className="absolute inset-0 -z-10">
          <div className="absolute -left-[20%] -top-[20%] h-[400px] w-[400px] rounded-full bg-primary/20 blur-[100px]" />
          <div className="absolute -bottom-[10%] right-[10%] h-[300px] w-[300px] rounded-full bg-accent/15 blur-[80px]" />
        </div>
      ) : (
        // Full 3D scene for desktop
        <div className="absolute inset-0 z-0">
          {/* Canvas here */}
        </div>
      )}

      {/* Content (same for both) */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        {/* ... */}
      </div>
    </section>
  )
}
```

---

## Reduced Motion Support

```tsx
'use client'

import { useEffect, useState } from 'react'

function usePrefersReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReduced(mq.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return prefersReduced
}

// Usage in hero:
const prefersReduced = usePrefersReducedMotion()

{prefersReduced ? (
  <StaticGradientBackground />
) : (
  <Canvas>...</Canvas>
)}
```
