# Particle Systems — Patterns & Recipes

Copy-paste-ready particle effects for React Three Fiber. From subtle background ambiance to dramatic effects.

---

## 1. Floating Particles (Background Ambiance)

Gentle, floating particles. Works as a background for any section.

```tsx
'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface FloatingParticlesProps {
  count?: number
  color?: string
  size?: number
  spread?: number
  speed?: number
}

export function FloatingParticles({
  count = 1000,
  color = '#6366f1',
  size = 0.015,
  spread = 10,
  speed = 0.3,
}: FloatingParticlesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const particles = useMemo(() =>
    Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * spread,
      y: (Math.random() - 0.5) * spread,
      z: (Math.random() - 0.5) * spread,
      speed: speed * (0.5 + Math.random()),
      offset: Math.random() * Math.PI * 2,
      scale: 0.5 + Math.random() * 0.5,
    })),
    [count, spread, speed]
  )

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()

    particles.forEach((p, i) => {
      dummy.position.set(
        p.x + Math.sin(t * p.speed + p.offset) * 0.5,
        p.y + Math.cos(t * p.speed * 0.8 + p.offset) * 0.5,
        p.z + Math.sin(t * p.speed * 0.5 + p.offset) * 0.3,
      )
      dummy.scale.setScalar(p.scale)
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
    })

    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[size, 6, 6]} />
      <meshBasicMaterial color={color} transparent opacity={0.5} />
    </instancedMesh>
  )
}
```

---

## 2. Rising Particles (Like Embers / Fireflies)

Particles that continuously rise upward and respawn at the bottom.

```tsx
'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface RisingParticlesProps {
  count?: number
  color?: string
  height?: number
  spread?: number
}

export function RisingParticles({
  count = 500,
  color = '#f59e0b',
  height = 10,
  spread = 8,
}: RisingParticlesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const particles = useMemo(() =>
    Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * spread,
      y: Math.random() * height - height / 2,
      z: (Math.random() - 0.5) * spread,
      speed: 0.2 + Math.random() * 0.5,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.5 + Math.random(),
      scale: 0.3 + Math.random() * 0.7,
    })),
    [count, height, spread]
  )

  useFrame(({ clock }, delta) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()

    particles.forEach((p, i) => {
      // Rise upward
      p.y += delta * p.speed

      // Reset when above bounds
      if (p.y > height / 2) {
        p.y = -height / 2
        p.x = (Math.random() - 0.5) * spread
        p.z = (Math.random() - 0.5) * spread
      }

      dummy.position.set(
        p.x + Math.sin(t * p.wobbleSpeed + p.wobble) * 0.3,
        p.y,
        p.z + Math.cos(t * p.wobbleSpeed + p.wobble) * 0.3,
      )

      // Fade based on height
      const normalizedY = (p.y + height / 2) / height
      const fade = Math.sin(normalizedY * Math.PI)
      dummy.scale.setScalar(p.scale * fade)
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
    })

    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.02, 6, 6]} />
      <meshBasicMaterial color={color} transparent opacity={0.7} toneMapped={false} />
    </instancedMesh>
  )
}
```

---

## 3. Particle Wave / Ocean

Particles arranged in a grid that move in a wave pattern.

```tsx
'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface ParticleWaveProps {
  gridSize?: number
  spacing?: number
  color?: string
  waveAmplitude?: number
  waveFrequency?: number
}

export function ParticleWave({
  gridSize = 40,
  spacing = 0.3,
  color = '#6366f1',
  waveAmplitude = 0.5,
  waveFrequency = 0.8,
}: ParticleWaveProps) {
  const count = gridSize * gridSize
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const grid = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      x: (i % gridSize - gridSize / 2) * spacing,
      z: (Math.floor(i / gridSize) - gridSize / 2) * spacing,
    })),
    [count, gridSize, spacing]
  )

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()

    grid.forEach((point, i) => {
      const distance = Math.sqrt(point.x ** 2 + point.z ** 2)
      const y = Math.sin(distance * waveFrequency - t * 2) * waveAmplitude
      const scale = 0.3 + (y + waveAmplitude) / (waveAmplitude * 2) * 0.7

      dummy.position.set(point.x, y, point.z)
      dummy.scale.setScalar(scale)
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
    })

    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.04, 8, 8]} />
      <meshStandardMaterial color={color} metalness={0.5} roughness={0.5} />
    </instancedMesh>
  )
}
```

---

## 4. Galaxy / Spiral Particles

Particles arranged in a spiral galaxy pattern.

```tsx
'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface GalaxyProps {
  count?: number
  radius?: number
  branches?: number
  spin?: number
  randomness?: number
  colorInside?: string
  colorOutside?: string
}

export function Galaxy({
  count = 5000,
  radius = 5,
  branches = 3,
  spin = 1,
  randomness = 0.2,
  colorInside = '#ff6030',
  colorOutside = '#1b3984',
}: GalaxyProps) {
  const pointsRef = useRef<THREE.Points>(null)

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const colorIn = new THREE.Color(colorInside)
    const colorOut = new THREE.Color(colorOutside)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const r = Math.random() * radius
      const branchAngle = ((i % branches) / branches) * Math.PI * 2
      const spinAngle = r * spin

      const randomX = (Math.random() - 0.5) * randomness * r
      const randomY = (Math.random() - 0.5) * randomness * r
      const randomZ = (Math.random() - 0.5) * randomness * r

      positions[i3] = Math.cos(branchAngle + spinAngle) * r + randomX
      positions[i3 + 1] = randomY
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * r + randomZ

      const mixedColor = colorIn.clone().lerp(colorOut, r / radius)
      colors[i3] = mixedColor.r
      colors[i3 + 1] = mixedColor.g
      colors[i3 + 2] = mixedColor.b
    }

    return { positions, colors }
  }, [count, radius, branches, spin, randomness, colorInside, colorOutside])

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.1
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors
      />
    </points>
  )
}
```

---

## 5. Connection Lines (Network Graph)

Particles connected by lines when close to each other.

```tsx
'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface NetworkParticlesProps {
  count?: number
  connectionDistance?: number
  color?: string
}

export function NetworkParticles({
  count = 100,
  connectionDistance = 1.5,
  color = '#6366f1',
}: NetworkParticlesProps) {
  const groupRef = useRef<THREE.Group>(null)
  const pointsRef = useRef<THREE.Points>(null)
  const linesRef = useRef<THREE.LineSegments>(null)

  const particles = useMemo(() =>
    Array.from({ length: count }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 6,
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.01,
      ),
    })),
    [count]
  )

  const pointPositions = useMemo(() => new Float32Array(count * 3), [count])
  const linePositions = useMemo(() => new Float32Array(count * count * 6), [count])

  useFrame(() => {
    if (!pointsRef.current || !linesRef.current) return

    let lineIndex = 0

    particles.forEach((p, i) => {
      // Move particles
      p.position.add(p.velocity)

      // Bounce off bounds
      ;['x', 'y', 'z'].forEach((axis) => {
        const a = axis as 'x' | 'y' | 'z'
        if (Math.abs(p.position[a]) > 3) p.velocity[a] *= -1
      })

      pointPositions[i * 3] = p.position.x
      pointPositions[i * 3 + 1] = p.position.y
      pointPositions[i * 3 + 2] = p.position.z

      // Draw lines to nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const dist = p.position.distanceTo(particles[j].position)
        if (dist < connectionDistance) {
          linePositions[lineIndex++] = p.position.x
          linePositions[lineIndex++] = p.position.y
          linePositions[lineIndex++] = p.position.z
          linePositions[lineIndex++] = particles[j].position.x
          linePositions[lineIndex++] = particles[j].position.y
          linePositions[lineIndex++] = particles[j].position.z
        }
      }
    })

    const pointGeom = pointsRef.current.geometry
    pointGeom.attributes.position.needsUpdate = true

    const lineGeom = linesRef.current.geometry
    lineGeom.setDrawRange(0, lineIndex / 3)
    lineGeom.attributes.position.needsUpdate = true
  })

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={count} array={pointPositions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial color={color} size={0.05} sizeAttenuation transparent opacity={0.8} />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={linePositions.length / 3} array={linePositions} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color={color} transparent opacity={0.15} />
      </lineSegments>
    </group>
  )
}
```

---

## 6. Snow / Rain Particles

Falling particles that loop. Atmospheric effect.

```tsx
'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface WeatherParticlesProps {
  count?: number
  type?: 'snow' | 'rain'
  area?: number
  height?: number
}

export function WeatherParticles({
  count = 1000,
  type = 'snow',
  area = 10,
  height = 10,
}: WeatherParticlesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const particles = useMemo(() =>
    Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * area,
      y: Math.random() * height,
      z: (Math.random() - 0.5) * area,
      speed: type === 'rain' ? 5 + Math.random() * 5 : 0.3 + Math.random() * 0.5,
      wobble: Math.random() * Math.PI * 2,
    })),
    [count, area, height, type]
  )

  useFrame((state, delta) => {
    if (!meshRef.current) return
    const t = state.clock.getElapsedTime()

    particles.forEach((p, i) => {
      p.y -= delta * p.speed

      if (p.y < 0) {
        p.y = height
        p.x = (Math.random() - 0.5) * area
        p.z = (Math.random() - 0.5) * area
      }

      const wobbleX = type === 'snow' ? Math.sin(t + p.wobble) * 0.3 : 0
      dummy.position.set(p.x + wobbleX, p.y, p.z)

      if (type === 'rain') {
        dummy.scale.set(0.3, 2, 0.3)
      } else {
        dummy.scale.setScalar(0.5 + Math.sin(t + p.wobble) * 0.2)
      }

      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
    })

    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[type === 'rain' ? 0.005 : 0.015, 4, 4]} />
      <meshBasicMaterial
        color={type === 'rain' ? '#87ceeb' : '#ffffff'}
        transparent
        opacity={type === 'rain' ? 0.3 : 0.6}
      />
    </instancedMesh>
  )
}
```

---

## Performance Guide

| Particle Count | Device | Technique |
|---------------|--------|-----------|
| < 500 | Any | Individual meshes or InstancedMesh |
| 500 - 5,000 | Desktop | InstancedMesh (recommended) |
| 5,000 - 50,000 | Desktop | Points (BufferGeometry) |
| 50,000+ | Desktop | GPU particles (custom shaders) |
| Any | Mobile | Halve the desktop count |

### Mobile Detection Pattern
```tsx
const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
const particleCount = isMobile ? 300 : 1500
```
