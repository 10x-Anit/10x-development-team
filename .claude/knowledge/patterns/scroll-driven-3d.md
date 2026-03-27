# Scroll-Driven 3D — Patterns & Recipes

Combine GSAP ScrollTrigger with React Three Fiber to create cinematic scroll experiences where 3D scenes respond to scroll position.

---

## 1. Full-Page Scroll-Driven 3D Hero

A 3D scene overlaid on a scrollable page. The camera moves through the scene as the user scrolls.

```tsx
'use client'

import { useRef, useEffect, Suspense } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { Float, Environment, Preload } from '@react-three/drei'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'

gsap.registerPlugin(ScrollTrigger)

// --- 3D Scene Content ---

function ScrollLinkedScene() {
  const groupRef = useRef<THREE.Group>(null)
  const { camera } = useThree()
  const cameraTarget = useRef({ x: 0, y: 0, z: 5 })

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#scroll-sections',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
      }
    })

    // Camera path keyframes
    tl.to(cameraTarget.current, { x: 2, y: 1, z: 4, duration: 1 }, 0)
      .to(cameraTarget.current, { x: -1, y: 2, z: 6, duration: 1 }, 1)
      .to(cameraTarget.current, { x: 0, y: 0.5, z: 3, duration: 1 }, 2)

    return () => {
      tl.kill()
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  useFrame(() => {
    camera.position.lerp(
      new THREE.Vector3(cameraTarget.current.x, cameraTarget.current.y, cameraTarget.current.z),
      0.1
    )
    camera.lookAt(0, 0, 0)
  })

  return (
    <group ref={groupRef}>
      <Float speed={1.5} floatIntensity={0.5}>
        <mesh position={[0, 0, 0]}>
          <torusKnotGeometry args={[1, 0.35, 128, 16]} />
          <meshStandardMaterial color="hsl(262, 83%, 58%)" metalness={0.9} roughness={0.1} />
        </mesh>
      </Float>

      <Float speed={2} floatIntensity={0.8}>
        <mesh position={[-3, 1, -2]}>
          <icosahedronGeometry args={[0.7, 1]} />
          <meshStandardMaterial color="hsl(222, 47%, 51%)" metalness={0.8} roughness={0.2} />
        </mesh>
      </Float>

      <Float speed={1} floatIntensity={0.3}>
        <mesh position={[3, -1, -1]}>
          <octahedronGeometry args={[0.6, 0]} />
          <meshStandardMaterial color="hsl(142, 76%, 36%)" metalness={0.8} roughness={0.2} />
        </mesh>
      </Float>

      <Environment preset="city" />
    </group>
  )
}

// --- Page Component ---

export function ScrollDriven3DPage() {
  return (
    <div className="relative">
      {/* Fixed 3D Canvas */}
      <div className="fixed inset-0 z-0" role="img" aria-label="Scroll-driven 3D scene">
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 45 }} gl={{ alpha: true }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.4} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <ScrollLinkedScene />
            <Preload all />
          </Suspense>
        </Canvas>
      </div>

      {/* Scrollable HTML content overlaid */}
      <div id="scroll-sections" className="relative z-10">
        <section className="flex min-h-screen items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Scroll to Explore
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              The 3D scene moves as you scroll
            </p>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-4">
          <div className="max-w-lg rounded-2xl bg-card/80 p-8 backdrop-blur-xl">
            <h2 className="text-3xl font-semibold text-foreground">Section Two</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Content appears as you scroll, with the 3D scene responding in the background.
            </p>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-4">
          <div className="max-w-lg rounded-2xl bg-card/80 p-8 backdrop-blur-xl">
            <h2 className="text-3xl font-semibold text-foreground">Section Three</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              The camera zooms in for a closer look at the details.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
```

---

## 2. Object Reveal on Scroll

A 3D object that scales up and rotates into view as the user scrolls to that section.

```tsx
'use client'

import { useRef, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Environment, Preload } from '@react-three/drei'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'

gsap.registerPlugin(ScrollTrigger)

function RevealObject() {
  const meshRef = useRef<THREE.Mesh>(null)
  const state = useRef({ scale: 0, rotationY: -Math.PI })

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(state.current, {
        scale: 1,
        rotationY: 0,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#reveal-section',
          start: 'top 70%',
          end: 'top 20%',
          scrub: 1,
        }
      })
    })

    return () => ctx.revert()
  }, [])

  useFrame(() => {
    if (!meshRef.current) return
    meshRef.current.scale.setScalar(state.current.scale)
    meshRef.current.rotation.y = state.current.rotationY
  })

  return (
    <Float speed={1} floatIntensity={0.3}>
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[1, 0.35, 128, 16]} />
        <meshStandardMaterial color="hsl(262, 83%, 58%)" metalness={0.9} roughness={0.1} />
      </mesh>
    </Float>
  )
}

export function ObjectRevealSection() {
  return (
    <section id="reveal-section" className="relative min-h-screen py-24">
      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
        {/* Text side */}
        <div className="px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Stunning 3D Design
          </h2>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Watch the 3D object come to life as you scroll into this section.
          </p>
        </div>

        {/* 3D side */}
        <div className="h-[400px] lg:h-[500px]" role="img" aria-label="3D object reveal">
          <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 40 }}>
            <Suspense fallback={null}>
              <ambientLight intensity={0.4} />
              <directionalLight position={[5, 5, 5]} intensity={1} />
              <RevealObject />
              <Environment preset="city" />
              <Preload all />
            </Suspense>
          </Canvas>
        </div>
      </div>
    </section>
  )
}
```

---

## 3. Scroll Progress Bar + 3D Morph

A material that changes (metalness, roughness, color) based on scroll progress.

```tsx
'use client'

import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'

gsap.registerPlugin(ScrollTrigger)

export function ScrollMorphObject() {
  const meshRef = useRef<THREE.Mesh>(null)
  const matRef = useRef<THREE.MeshStandardMaterial>(null)
  const morphState = useRef({
    metalness: 0.2,
    roughness: 0.8,
    scale: 0.8,
    distort: 0,
    r: 0.39, g: 0.4, b: 0.95, // primary color in RGB
  })

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '#morph-container',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        }
      })

      // Phase 1: Become metallic
      tl.to(morphState.current, {
        metalness: 0.95,
        roughness: 0.05,
        scale: 1.2,
        duration: 1,
      }, 0)

      // Phase 2: Change color to gold
      tl.to(morphState.current, {
        r: 1, g: 0.84, b: 0,
        duration: 1,
      }, 1)

      // Phase 3: Scale down and become glassy
      tl.to(morphState.current, {
        metalness: 0.1,
        roughness: 0.05,
        scale: 0.6,
        duration: 1,
      }, 2)
    })

    return () => ctx.revert()
  }, [])

  useFrame((_, delta) => {
    if (!meshRef.current || !matRef.current) return
    meshRef.current.rotation.y += delta * 0.3
    meshRef.current.scale.setScalar(morphState.current.scale)
    matRef.current.metalness = morphState.current.metalness
    matRef.current.roughness = morphState.current.roughness
    matRef.current.color.setRGB(morphState.current.r, morphState.current.g, morphState.current.b)
  })

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[1, 0.35, 128, 16]} />
      <meshStandardMaterial ref={matRef} color="#6366f1" metalness={0.2} roughness={0.8} />
    </mesh>
  )
}
```

---

## 4. Parallax Layers in 3D

Multiple depth layers that move at different speeds on scroll for a parallax effect.

```tsx
'use client'

import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'

gsap.registerPlugin(ScrollTrigger)

export function Parallax3DLayers() {
  const frontRef = useRef<THREE.Group>(null)
  const midRef = useRef<THREE.Group>(null)
  const backRef = useRef<THREE.Group>(null)
  const offsets = useRef({ front: 0, mid: 0, back: 0 })

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(offsets.current, {
        front: -4,
        mid: -2,
        back: -1,
        ease: 'none',
        scrollTrigger: {
          trigger: '#parallax-container',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        }
      })
    })
    return () => ctx.revert()
  }, [])

  useFrame(() => {
    if (frontRef.current) frontRef.current.position.y = offsets.current.front
    if (midRef.current) midRef.current.position.y = offsets.current.mid
    if (backRef.current) backRef.current.position.y = offsets.current.back
  })

  return (
    <>
      {/* Back layer — moves slowest */}
      <group ref={backRef}>
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh key={i} position={[(i % 4 - 1.5) * 3, Math.floor(i / 4) * 3 - 1, -5]}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial color="hsl(262, 40%, 40%)" metalness={0.5} roughness={0.5} />
          </mesh>
        ))}
      </group>

      {/* Mid layer */}
      <group ref={midRef}>
        {Array.from({ length: 6 }).map((_, i) => (
          <mesh key={i} position={[(i % 3 - 1) * 3, Math.floor(i / 3) * 4, -2]}>
            <icosahedronGeometry args={[0.5, 1]} />
            <meshStandardMaterial color="hsl(222, 47%, 51%)" metalness={0.7} roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* Front layer — moves fastest */}
      <group ref={frontRef}>
        {Array.from({ length: 4 }).map((_, i) => (
          <mesh key={i} position={[(i % 2 - 0.5) * 4, Math.floor(i / 2) * 5, 1]}>
            <octahedronGeometry args={[0.4, 0]} />
            <meshStandardMaterial color="hsl(142, 76%, 36%)" metalness={0.8} roughness={0.2} />
          </mesh>
        ))}
      </group>
    </>
  )
}
```

---

## 5. Section-Triggered Animations

Different 3D animations triggered by different page sections.

```tsx
'use client'

import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'

gsap.registerPlugin(ScrollTrigger)

export function SectionTriggered3D() {
  const meshRef = useRef<THREE.Mesh>(null)
  const state = useRef({ rotX: 0, rotY: 0, posX: 0, posY: 0, scale: 1 })

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero section: center, large
      ScrollTrigger.create({
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        onEnter: () => gsap.to(state.current, { posX: 0, posY: 0, scale: 1.5, duration: 1 }),
        onEnterBack: () => gsap.to(state.current, { posX: 0, posY: 0, scale: 1.5, duration: 1 }),
      })

      // Features section: move right, shrink
      ScrollTrigger.create({
        trigger: '#features',
        start: 'top center',
        onEnter: () => gsap.to(state.current, { posX: 2, posY: 0, scale: 0.8, duration: 1 }),
        onEnterBack: () => gsap.to(state.current, { posX: 2, posY: 0, scale: 0.8, duration: 1 }),
      })

      // CTA section: center, medium, spin
      ScrollTrigger.create({
        trigger: '#cta',
        start: 'top center',
        onEnter: () => gsap.to(state.current, { posX: 0, posY: 0, scale: 1.2, rotY: Math.PI * 2, duration: 1.5 }),
        onEnterBack: () => gsap.to(state.current, { posX: 0, posY: 0, scale: 1.2, duration: 1 }),
      })
    })

    return () => ctx.revert()
  }, [])

  useFrame((_, delta) => {
    if (!meshRef.current) return
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, state.current.posX, 0.05)
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, state.current.posY, 0.05)
    meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, state.current.scale, 0.05))
    meshRef.current.rotation.y += delta * 0.3
  })

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[1, 0.35, 128, 16]} />
      <meshStandardMaterial color="hsl(262, 83%, 58%)" metalness={0.9} roughness={0.1} />
    </mesh>
  )
}
```

---

## Architecture Pattern: Fixed Canvas + Scrollable HTML

```
+------------------------------------------+
|  FIXED: <Canvas> (z-index: 0)            |
|  - 3D scene fills viewport               |
|  - Responds to scroll via GSAP refs      |
+------------------------------------------+
|  SCROLLABLE: <div> (z-index: 10)         |
|  - HTML sections scroll over the canvas  |
|  - Semi-transparent cards (backdrop-blur) |
|  - pointer-events-none on empty space    |
+------------------------------------------+
```

This is the most common architecture for scroll-driven 3D. The canvas is position:fixed and the HTML scrolls on top of it. GSAP ScrollTrigger reads the scroll position and animates the 3D scene via refs (never React state — that would cause re-renders).

---

## Performance Tips

1. **Use refs, not state** — Animate via `useRef` + `useFrame` + GSAP. Never use `useState` for 60fps animations.
2. **Scrub smoothing** — Use `scrub: 1.5` for smooth camera movements, `scrub: 0.5` for snappy reactions.
3. **Lerp in useFrame** — Use `THREE.MathUtils.lerp()` for smooth interpolation between GSAP targets.
4. **Clean up** — Always use `gsap.context()` and `ctx.revert()` in useEffect cleanup.
5. **Mobile fallback** — On mobile, consider reducing to 2D parallax (CSS transforms) instead of full 3D.
