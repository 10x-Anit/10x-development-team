# 3D Scene Composition — Patterns & Recipes

Complete, copy-paste-ready 3D scene patterns for building immersive web experiences.

---

## 1. Floating Object Gallery

Multiple 3D objects floating in space with gentle animation. Perfect for product showcases or abstract hero backgrounds.

```tsx
'use client'

import { Canvas } from '@react-three/fiber'
import { Float, Environment, ContactShadows, Preload } from '@react-three/drei'
import { Suspense } from 'react'

function FloatingObjects() {
  const objects = [
    { position: [-2, 0, 0] as const, geometry: 'torus', color: 'hsl(262, 83%, 58%)', scale: 0.8 },
    { position: [0, 1, -1] as const, geometry: 'torusKnot', color: 'hsl(222, 47%, 51%)', scale: 0.6 },
    { position: [2, -0.5, 0.5] as const, geometry: 'icosahedron', color: 'hsl(142, 76%, 36%)', scale: 0.7 },
    { position: [-1, -1, 1] as const, geometry: 'octahedron', color: 'hsl(346, 77%, 50%)', scale: 0.5 },
    { position: [1.5, 1.5, -0.5] as const, geometry: 'dodecahedron', color: 'hsl(25, 95%, 53%)', scale: 0.4 },
  ]

  return (
    <>
      {objects.map((obj, i) => (
        <Float
          key={i}
          speed={1 + i * 0.3}
          rotationIntensity={0.5 + i * 0.2}
          floatIntensity={1 + i * 0.3}
          position={obj.position}
        >
          <mesh scale={obj.scale}>
            {obj.geometry === 'torus' && <torusGeometry args={[1, 0.4, 16, 32]} />}
            {obj.geometry === 'torusKnot' && <torusKnotGeometry args={[1, 0.3, 128, 16]} />}
            {obj.geometry === 'icosahedron' && <icosahedronGeometry args={[1, 1]} />}
            {obj.geometry === 'octahedron' && <octahedronGeometry args={[1, 0]} />}
            {obj.geometry === 'dodecahedron' && <dodecahedronGeometry args={[1, 0]} />}
            <meshStandardMaterial
              color={obj.color}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
        </Float>
      ))}
      <ContactShadows position={[0, -2.5, 0]} opacity={0.3} scale={12} blur={2.5} />
      <Environment preset="city" />
    </>
  )
}

export function FloatingGalleryScene() {
  return (
    <div className="h-screen w-full" role="img" aria-label="Floating 3D shapes">
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 6], fov: 45 }} gl={{ alpha: true }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 10, 5]} intensity={1} />
          <FloatingObjects />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  )
}
```

---

## 2. Morphing Blob

An organic, distorted sphere that morphs continuously. Dramatic hero visual.

```tsx
'use client'

import { Canvas } from '@react-three/fiber'
import { MeshDistortMaterial, Environment, Float } from '@react-three/drei'
import { Suspense } from 'react'

function MorphBlob() {
  return (
    <Float speed={1} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh scale={2}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color="hsl(262, 83%, 58%)"
          metalness={0.9}
          roughness={0.1}
          distort={0.4}
          speed={2}
        />
      </mesh>
    </Float>
  )
}

export function BlobScene() {
  return (
    <div className="h-screen w-full" role="img" aria-label="Animated morphing sphere">
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 45 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <directionalLight position={[10, 10, 5]} intensity={1.2} />
          <pointLight position={[-5, -5, 5]} intensity={0.5} color="hsl(346, 77%, 50%)" />
          <MorphBlob />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  )
}
```

---

## 3. Reflective Floor Scene (Product Display)

```tsx
'use client'

import { Canvas } from '@react-three/fiber'
import {
  Environment,
  ContactShadows,
  MeshReflectorMaterial,
  Float,
  Preload,
} from '@react-three/drei'
import { Suspense } from 'react'

function ProductScene() {
  return (
    <>
      {/* Main object */}
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
        <mesh position={[0, 0.5, 0]}>
          <torusKnotGeometry args={[0.8, 0.25, 128, 16]} />
          <meshPhysicalMaterial
            color="hsl(262, 83%, 58%)"
            metalness={0.95}
            roughness={0.05}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </mesh>
      </Float>

      {/* Reflective floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[50, 50]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={40}
          roughness={1}
          depthScale={1.2}
          color="#111111"
          metalness={0.5}
          mirror={0.5}
        />
      </mesh>

      <ContactShadows position={[0, -0.99, 0]} opacity={0.4} scale={10} blur={2.5} />
      <Environment preset="warehouse" />
    </>
  )
}

export function ProductDisplayScene() {
  return (
    <div className="h-screen w-full bg-background" role="img" aria-label="3D product display">
      <Canvas dpr={[1, 2]} camera={{ position: [0, 2, 5], fov: 35 }} shadows>
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <spotLight position={[5, 10, 5]} intensity={1} angle={0.3} penumbra={0.5} castShadow />
          <ProductScene />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  )
}
```

---

## 4. Abstract Wireframe Scene

Wireframe objects with neon glow. Great for tech/AI/startup aesthetics.

```tsx
'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Preload } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Suspense, useRef } from 'react'
import * as THREE from 'three'

function WireframeObject({ position, geometry, color, speed = 0.3 }: {
  position: [number, number, number]
  geometry: 'torus' | 'icosahedron' | 'octahedron'
  color: string
  speed?: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * speed
      meshRef.current.rotation.z += delta * speed * 0.5
    }
  })

  return (
    <Float speed={1} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position}>
        {geometry === 'torus' && <torusGeometry args={[1, 0.3, 16, 32]} />}
        {geometry === 'icosahedron' && <icosahedronGeometry args={[1, 1]} />}
        {geometry === 'octahedron' && <octahedronGeometry args={[1, 0]} />}
        <meshBasicMaterial color={color} wireframe toneMapped={false} />
      </mesh>
    </Float>
  )
}

export function WireframeScene() {
  return (
    <div className="h-screen w-full bg-background" role="img" aria-label="Wireframe 3D objects">
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 6], fov: 45 }}>
        <Suspense fallback={null}>
          <WireframeObject position={[-2, 0, 0]} geometry="torus" color="#6366f1" />
          <WireframeObject position={[0, 1, -1]} geometry="icosahedron" color="#8b5cf6" speed={0.2} />
          <WireframeObject position={[2, -0.5, 0]} geometry="octahedron" color="#a78bfa" speed={0.4} />

          <EffectComposer>
            <Bloom luminanceThreshold={0.1} intensity={1.5} mipmapBlur />
          </EffectComposer>

          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  )
}
```

---

## 5. Glass Material Scene

Transparent glass-like objects with refraction. Premium, modern aesthetic.

```tsx
'use client'

import { Canvas } from '@react-three/fiber'
import { Environment, Float, Preload } from '@react-three/drei'
import { Suspense } from 'react'

function GlassObjects() {
  return (
    <>
      {/* Main glass sphere */}
      <Float speed={1} floatIntensity={0.5}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[1.2, 64, 64]} />
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

      {/* Accent glass torus */}
      <Float speed={1.5} rotationIntensity={1}>
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[2, 0.15, 16, 64]} />
          <meshPhysicalMaterial
            transmission={0.9}
            thickness={0.3}
            roughness={0.1}
            ior={1.5}
            color="hsl(262, 83%, 85%)"
          />
        </mesh>
      </Float>

      {/* Colored inner sphere (visible through glass) */}
      <mesh position={[0, 0, 0]}>
        <icosahedronGeometry args={[0.5, 1]} />
        <meshStandardMaterial color="hsl(262, 83%, 58%)" metalness={0.8} roughness={0.2} />
      </mesh>

      <Environment preset="city" background blur={0.8} />
    </>
  )
}

export function GlassScene() {
  return (
    <div className="h-screen w-full" role="img" aria-label="Glass 3D composition">
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 6], fov: 40 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={0.5} />
          <GlassObjects />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  )
}
```

---

## 6. Animated Grid / Ground Plane

Moving grid lines that create a sense of motion. Retro/futuristic aesthetic.

```tsx
'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import { Suspense, useRef, useMemo } from 'react'
import * as THREE from 'three'

function AnimatedGrid() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.MeshBasicMaterial
      // Scroll the UV offset to create movement
      if (material.map) {
        material.map.offset.y -= delta * 0.3
      }
    }
  })

  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, 64, 64)
    ctx.strokeStyle = '#6366f1'
    ctx.lineWidth = 1
    ctx.strokeRect(0, 0, 64, 64)
    const tex = new THREE.CanvasTexture(canvas)
    tex.wrapS = THREE.RepeatWrapping
    tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(20, 20)
    return tex
  }, [])

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry args={[50, 50]} />
      <meshBasicMaterial map={texture} transparent opacity={0.3} />
    </mesh>
  )
}

export function GridScene() {
  return (
    <div className="h-screen w-full" role="img" aria-label="Animated grid background">
      <Canvas dpr={[1, 2]} camera={{ position: [0, 3, 8], fov: 50 }}>
        <Suspense fallback={null}>
          <fog attach="fog" args={['#000000', 5, 20]} />
          <AnimatedGrid />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  )
}
```

---

## Scene Composition Checklist

Every 3D scene should have:

- [ ] `'use client'` directive (Next.js)
- [ ] `<Canvas>` with `dpr={[1, 2]}` and appropriate camera
- [ ] `<Suspense fallback={...}>` wrapping scene content
- [ ] Lighting rig (ambient + at least one directional/point)
- [ ] `<Environment>` for reflections (if using metallic/glass materials)
- [ ] `<Preload all />` for asset preloading
- [ ] `role="img"` and `aria-label` on container div
- [ ] Responsive check (reduce complexity on mobile)
- [ ] Reduced motion fallback for accessibility
