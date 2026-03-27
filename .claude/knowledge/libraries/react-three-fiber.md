# React Three Fiber (R3F) — Complete Reference

React Three Fiber is a React renderer for Three.js. It lets you build 3D scenes declaratively with JSX, hooks, and the React component model.

## Install

```bash
npm install three @react-three/fiber @react-three/drei
npm install -D @types/three
```

## When to Use

| Scope | What to Use |
|-------|-------------|
| production | Full R3F: scenes, particles, scroll-driven, shaders, post-processing |
| mvp | R3F scenes, basic particles, scroll animations, bloom |
| prototype | Simple R3F: floating objects, OrbitControls, environment maps |
| simple | DO NOT USE — use CSS 3D transforms instead |

---

## 1. Canvas Setup

The `<Canvas>` component creates a WebGL context and a Three.js scene.

### Basic Canvas

```tsx
'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'

export function MyScene() {
  return (
    <div className="h-screen w-full">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="hotpink" />
          </mesh>
        </Suspense>
      </Canvas>
    </div>
  )
}
```

### Canvas Props Reference

```tsx
<Canvas
  dpr={[1, 2]}                          // Pixel ratio range (responsive)
  camera={{ position: [0, 0, 5], fov: 45 }} // Default camera
  gl={{ antialias: true, alpha: true }}  // WebGL settings
  shadows                                // Enable shadow maps
  flat                                   // Use THREE.NoToneMapping
  linear                                 // Disable sRGB color management
  style={{ background: 'transparent' }}  // CSS on the canvas wrapper
  onCreated={({ gl }) => {               // After context created
    gl.setClearColor(0x000000, 0)
  }}
>
```

---

## 2. Core Hooks

### useFrame — Animation Loop

```tsx
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

function RotatingBox() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x += delta * 0.5
    meshRef.current.rotation.y += delta * 0.3
  })

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  )
}
```

### useThree — Access Three.js Internals

```tsx
import { useThree } from '@react-three/fiber'

function CameraInfo() {
  const { camera, gl, scene, size, viewport } = useThree()
  // camera: THREE.Camera
  // gl: THREE.WebGLRenderer
  // scene: THREE.Scene
  // size: { width, height } in pixels
  // viewport: { width, height } in Three.js units
  return null
}
```

### useLoader — Load Assets

```tsx
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { TextureLoader } from 'three'

function Model() {
  const gltf = useLoader(GLTFLoader, '/model.glb')
  return <primitive object={gltf.scene} scale={0.5} />
}

function TexturedBox() {
  const texture = useLoader(TextureLoader, '/texture.jpg')
  return (
    <mesh>
      <boxGeometry />
      <meshStandardMaterial map={texture} />
    </mesh>
  )
}
```

---

## 3. Geometry Primitives

```tsx
// Box
<boxGeometry args={[width, height, depth]} />

// Sphere
<sphereGeometry args={[radius, widthSegments, heightSegments]} />

// Torus
<torusGeometry args={[radius, tube, radialSegments, tubularSegments]} />

// Torus Knot
<torusKnotGeometry args={[radius, tube, tubularSegments, radialSegments]} />

// Plane
<planeGeometry args={[width, height]} />

// Cylinder
<cylinderGeometry args={[radiusTop, radiusBottom, height, radialSegments]} />

// Cone
<coneGeometry args={[radius, height, radialSegments]} />

// Icosahedron (low-poly sphere)
<icosahedronGeometry args={[radius, detail]} />

// Ring
<ringGeometry args={[innerRadius, outerRadius, thetaSegments]} />

// Dodecahedron
<dodecahedronGeometry args={[radius, detail]} />
```

---

## 4. Materials

### Standard Material (PBR — most common)
```tsx
<meshStandardMaterial
  color="#6366f1"
  metalness={0.8}
  roughness={0.2}
  emissive="#6366f1"
  emissiveIntensity={0.1}
  transparent
  opacity={0.9}
  wireframe={false}
/>
```

### Physical Material (advanced PBR)
```tsx
<meshPhysicalMaterial
  color="#6366f1"
  metalness={0.9}
  roughness={0.1}
  clearcoat={1}
  clearcoatRoughness={0.1}
  transmission={0.5}          // Glass-like transparency
  thickness={0.5}              // Refraction depth
  ior={1.5}                    // Index of refraction
  envMapIntensity={1}
/>
```

### Basic Material (unlit — good for particles)
```tsx
<meshBasicMaterial color="#6366f1" transparent opacity={0.6} />
```

### Normal Material (debug)
```tsx
<meshNormalMaterial />
```

---

## 5. Lighting

### Complete Lighting Rig
```tsx
function Lighting() {
  return (
    <>
      {/* Soft overall illumination */}
      <ambientLight intensity={0.4} />

      {/* Main directional light (like the sun) */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* Fill light from opposite side */}
      <directionalLight position={[-5, 5, -5]} intensity={0.3} />

      {/* Colored accent point light */}
      <pointLight position={[0, -3, 3]} intensity={0.5} color="#f59e0b" />

      {/* Hemisphere light for outdoor scenes */}
      <hemisphereLight args={['#87ceeb', '#362907', 0.3]} />
    </>
  )
}
```

### Lighting Presets

```
Studio:     ambientLight(0.5) + 2x directionalLight (left/right at 45deg) + Environment preset="studio"
Dramatic:   ambientLight(0.2) + 1x directionalLight (warm, high) + pointLight (cool accent) + Bloom
Neon:       ambientLight(0.1) + multiple colored pointLights + Bloom(high intensity)
Outdoor:    hemisphereLight + directionalLight (sun) + Environment preset="sunset"
Product:    ambientLight(0.4) + 3-point directional + contactShadows + Environment preset="warehouse"
```

---

## 6. Camera Controls

### OrbitControls (most common)
```tsx
import { OrbitControls } from '@react-three/drei'

<OrbitControls
  enableZoom={false}       // Disable scroll zoom
  enablePan={false}        // Disable panning
  autoRotate               // Auto-rotate scene
  autoRotateSpeed={0.5}    // Rotation speed
  maxPolarAngle={Math.PI / 2}  // Limit vertical rotation
  minPolarAngle={Math.PI / 4}
/>
```

### Programmatic Camera
```tsx
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function AnimatedCamera() {
  const { camera } = useThree()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    camera.position.x = Math.sin(t * 0.2) * 5
    camera.position.z = Math.cos(t * 0.2) * 5
    camera.lookAt(0, 0, 0)
  })

  return null
}
```

---

## 7. Events & Interactivity

```tsx
function InteractiveBox() {
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  return (
    <mesh
      scale={clicked ? 1.5 : 1}
      onClick={() => setClicked(!clicked)}
      onPointerOver={() => {
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHovered(false)
        document.body.style.cursor = 'auto'
      }}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? '#f59e0b' : '#6366f1'} />
    </mesh>
  )
}
```

---

## 8. Performance Patterns

### Instanced Meshes (for many identical objects)
```tsx
import { Instances, Instance } from '@react-three/drei'

function ManyBoxes({ count = 100 }) {
  const positions = useMemo(() =>
    Array.from({ length: count }, () => [
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10,
    ] as [number, number, number]),
    [count]
  )

  return (
    <Instances limit={count}>
      <boxGeometry args={[0.1, 0.1, 0.1]} />
      <meshStandardMaterial color="#6366f1" />
      {positions.map((pos, i) => (
        <Instance key={i} position={pos} />
      ))}
    </Instances>
  )
}
```

### Memoize Heavy Computations
```tsx
// CORRECT — geometry created once
const geometry = useMemo(() => new THREE.TorusKnotGeometry(1, 0.3, 128, 16), [])

// WRONG — recreated every render
const geometry = new THREE.TorusKnotGeometry(1, 0.3, 128, 16)
```

### Dispose Resources
```tsx
useEffect(() => {
  return () => {
    geometry.dispose()
    material.dispose()
    texture.dispose()
  }
}, [])
```

---

## 9. Next.js Integration

### Dynamic Import (Required for SSR)
```tsx
// src/components/3d/scene.tsx
'use client'

import dynamic from 'next/dynamic'

const Scene3D = dynamic(() => import('./scene-content'), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  ),
})

export default Scene3D
```

### Page Usage
```tsx
// src/app/page.tsx
import Scene3D from '@/components/3d/scene'

export default function HomePage() {
  return (
    <main>
      <section className="relative h-screen">
        <Scene3D />
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <h1 className="text-5xl font-bold text-foreground">
            Welcome
          </h1>
        </div>
      </section>
    </main>
  )
}
```

---

## 10. Common Patterns

### Transparent Background (Overlay 3D on HTML)
```tsx
<Canvas gl={{ alpha: true }} style={{ position: 'absolute', top: 0, left: 0 }}>
  {/* Scene renders with transparent background */}
  {/* HTML content shows through */}
</Canvas>
```

### Reading Design System Colors in 3D
```tsx
function useDesignColor(token: string, fallback: string = '#6366f1'): string {
  const [color, setColor] = useState(fallback)

  useEffect(() => {
    const root = document.documentElement
    const hslValue = getComputedStyle(root).getPropertyValue(`--${token}`).trim()
    if (hslValue) {
      const parts = hslValue.split(' ')
      if (parts.length >= 3) {
        const h = parseFloat(parts[0])
        const s = parseFloat(parts[1])
        const l = parseFloat(parts[2])
        setColor(`hsl(${h}, ${s}%, ${l}%)`)
      }
    }
  }, [token])

  return color
}

// Usage:
function BrandMesh() {
  const primaryColor = useDesignColor('primary')
  return (
    <mesh>
      <sphereGeometry />
      <meshStandardMaterial color={primaryColor} />
    </mesh>
  )
}
```

### Responsive 3D Hook
```tsx
function useResponsive3D() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return {
    isMobile,
    cameraPosition: isMobile ? [0, 0, 8] as const : [0, 0, 5] as const,
    particleCount: isMobile ? 300 : 1500,
    dpr: isMobile ? 1 : 1.5,
    quality: isMobile ? 'low' : 'high' as 'low' | 'high',
  }
}
```
