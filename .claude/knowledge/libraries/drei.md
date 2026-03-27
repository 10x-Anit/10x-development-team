# Drei — Helper Components for React Three Fiber

Drei is a collection of useful helpers and abstractions for R3F. It provides ready-to-use components for common 3D patterns.

## Install

```bash
npm install @react-three/drei
```

---

## 1. Float — Floating Animation

Makes objects gently float in space. Perfect for hero sections.

```tsx
import { Float } from '@react-three/drei'

<Float
  speed={2}              // Animation speed
  rotationIntensity={1}  // Rotation amount
  floatIntensity={2}     // Float height
  floatingRange={[-0.1, 0.1]}  // Range of float
>
  <mesh>
    <torusKnotGeometry args={[1, 0.3, 128, 16]} />
    <meshStandardMaterial color="#6366f1" metalness={0.8} roughness={0.2} />
  </mesh>
</Float>
```

---

## 2. Environment — Lighting & Reflections

Provides environment maps for realistic reflections and ambient lighting.

```tsx
import { Environment } from '@react-three/drei'

// Preset environments
<Environment preset="city" />
<Environment preset="studio" />
<Environment preset="sunset" />
<Environment preset="warehouse" />
<Environment preset="forest" />
<Environment preset="apartment" />
<Environment preset="dawn" />
<Environment preset="night" />
<Environment preset="park" />
<Environment preset="lobby" />

// Background visible
<Environment preset="sunset" background />

// Blurred background
<Environment preset="city" background blur={0.5} />
```

---

## 3. Text3D — 3D Typography

```tsx
import { Text3D, Center } from '@react-three/drei'

<Center>
  <Text3D
    font="/fonts/Inter_Bold.json"
    size={1.5}
    height={0.2}
    curveSegments={12}
    bevelEnabled
    bevelThickness={0.02}
    bevelSize={0.02}
    bevelOffset={0}
    bevelSegments={5}
  >
    Hello World
    <meshStandardMaterial color="#6366f1" metalness={0.8} roughness={0.2} />
  </Text3D>
</Center>
```

### Text (2D billboard text — simpler, better performance)
```tsx
import { Text } from '@react-three/drei'

<Text
  position={[0, 2, 0]}
  fontSize={0.5}
  color="#6366f1"
  anchorX="center"
  anchorY="middle"
  font="/fonts/Inter-Bold.woff"
>
  Hello World
</Text>
```

---

## 4. Scroll Controls — Scroll-Driven Scenes

```tsx
import { ScrollControls, Scroll, useScroll } from '@react-three/drei'

function App() {
  return (
    <Canvas>
      <ScrollControls pages={3} damping={0.25}>
        {/* 3D content that animates with scroll */}
        <ScrollScene />

        {/* HTML content overlaid */}
        <Scroll html>
          <section className="h-screen flex items-center justify-center">
            <h1 className="text-5xl font-bold">Page 1</h1>
          </section>
          <section className="h-screen flex items-center justify-center">
            <h2 className="text-4xl font-semibold">Page 2</h2>
          </section>
          <section className="h-screen flex items-center justify-center">
            <h3 className="text-3xl">Page 3</h3>
          </section>
        </Scroll>
      </ScrollControls>
    </Canvas>
  )
}

function ScrollScene() {
  const scroll = useScroll()
  const meshRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (!meshRef.current) return
    const offset = scroll.offset // 0 to 1

    // Rotate based on scroll
    meshRef.current.rotation.y = offset * Math.PI * 2

    // Move based on scroll
    meshRef.current.position.y = -offset * 5
  })

  return (
    <group ref={meshRef}>
      <mesh>
        <torusKnotGeometry args={[1, 0.3, 128, 16]} />
        <meshStandardMaterial color="#6366f1" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  )
}
```

---

## 5. Stars — Starfield Background

```tsx
import { Stars } from '@react-three/drei'

<Stars
  radius={100}      // Sphere radius
  depth={50}        // Depth of field
  count={5000}      // Number of stars
  factor={4}        // Size factor
  saturation={0}    // Color saturation
  fade              // Fade in/out at edges
  speed={1}         // Rotation speed
/>
```

---

## 6. Sparkles — Floating Sparkle Particles

```tsx
import { Sparkles } from '@react-three/drei'

<Sparkles
  count={100}
  scale={5}
  size={2}
  speed={0.4}
  color="#6366f1"
  opacity={0.5}
/>
```

---

## 7. Cloud — Volumetric Clouds

```tsx
import { Cloud, Clouds } from '@react-three/drei'

<Clouds material={THREE.MeshBasicMaterial}>
  <Cloud
    segments={40}
    bounds={[10, 2, 2]}
    volume={6}
    color="#f0f0f0"
    opacity={0.6}
    speed={0.4}
  />
</Clouds>
```

---

## 8. ContactShadows — Ground Shadows

```tsx
import { ContactShadows } from '@react-three/drei'

<ContactShadows
  position={[0, -1.5, 0]}
  opacity={0.4}
  scale={10}
  blur={2.5}
  far={4}
  resolution={256}
  color="#000000"
/>
```

---

## 9. MeshDistortMaterial — Organic Distortion

```tsx
import { MeshDistortMaterial } from '@react-three/drei'

<mesh>
  <sphereGeometry args={[1, 64, 64]} />
  <MeshDistortMaterial
    color="#6366f1"
    distort={0.4}        // Distortion amount
    speed={2}            // Animation speed
    roughness={0.2}
    metalness={0.8}
  />
</mesh>
```

---

## 10. MeshWobbleMaterial — Wobble Effect

```tsx
import { MeshWobbleMaterial } from '@react-three/drei'

<mesh>
  <torusGeometry args={[1, 0.4, 16, 32]} />
  <MeshWobbleMaterial
    color="#6366f1"
    factor={0.6}     // Wobble intensity
    speed={2}        // Wobble speed
    roughness={0.2}
  />
</mesh>
```

---

## 11. GradientTexture — Gradient on Meshes

```tsx
import { GradientTexture } from '@react-three/drei'

<mesh>
  <sphereGeometry args={[1, 64, 64]} />
  <meshBasicMaterial>
    <GradientTexture
      stops={[0, 0.5, 1]}
      colors={['#6366f1', '#8b5cf6', '#a78bfa']}
    />
  </meshBasicMaterial>
</mesh>
```

---

## 12. Html — Render HTML Inside 3D

```tsx
import { Html } from '@react-three/drei'

<mesh position={[2, 0, 0]}>
  <boxGeometry />
  <meshStandardMaterial color="#6366f1" />
  <Html
    position={[0, 1.5, 0]}
    center
    distanceFactor={10}
    transform
    occlude
  >
    <div className="rounded-lg bg-card p-4 shadow-lg">
      <p className="text-sm text-foreground">Hello from 3D!</p>
    </div>
  </Html>
</mesh>
```

---

## 13. useGLTF — Load 3D Models

```tsx
import { useGLTF } from '@react-three/drei'

function Model({ url }: { url: string }) {
  const { scene, nodes, materials } = useGLTF(url)
  return <primitive object={scene} scale={0.5} />
}

// Preload for better performance
useGLTF.preload('/model.glb')
```

---

## 14. Preload — Preload All Assets

```tsx
import { Preload } from '@react-three/drei'

<Canvas>
  <Suspense fallback={null}>
    {/* Scene content */}
  </Suspense>
  <Preload all />
</Canvas>
```

---

## 15. RoundedBox — Rounded Corner Box

```tsx
import { RoundedBox } from '@react-three/drei'

<RoundedBox args={[1, 1, 1]} radius={0.1} smoothness={4}>
  <meshStandardMaterial color="#6366f1" />
</RoundedBox>
```

---

## 16. MeshReflectorMaterial — Reflective Floor

```tsx
import { MeshReflectorMaterial } from '@react-three/drei'

<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
  <planeGeometry args={[50, 50]} />
  <MeshReflectorMaterial
    blur={[300, 100]}
    resolution={1024}
    mixBlur={1}
    mixStrength={40}
    roughness={1}
    depthScale={1.2}
    minDepthThreshold={0.4}
    maxDepthThreshold={1.4}
    color="#101010"
    metalness={0.5}
    mirror={0.5}
  />
</mesh>
```

---

## 17. Useful Utilities

### Center — Center Any Object
```tsx
import { Center } from '@react-three/drei'

<Center>
  <mesh>
    <torusKnotGeometry />
    <meshStandardMaterial />
  </mesh>
</Center>
```

### Billboard — Always Face Camera
```tsx
import { Billboard } from '@react-three/drei'

<Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
  <Text fontSize={0.5}>Always facing you</Text>
</Billboard>
```

### Trail — Motion Trail Effect
```tsx
import { Trail } from '@react-three/drei'

<Trail
  width={0.5}
  length={8}
  color="#6366f1"
  attenuation={(t) => t * t}
>
  <mesh ref={movingObjectRef}>
    <sphereGeometry args={[0.1]} />
    <meshBasicMaterial color="#6366f1" />
  </mesh>
</Trail>
```

---

## Common Compositions

### Floating Hero Object
```tsx
<Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
  <mesh>
    <torusKnotGeometry args={[1, 0.35, 128, 16]} />
    <MeshDistortMaterial
      color="#6366f1"
      metalness={0.9}
      roughness={0.1}
      distort={0.2}
      speed={1.5}
    />
  </mesh>
</Float>
<ContactShadows position={[0, -2, 0]} opacity={0.3} scale={8} blur={2} />
<Environment preset="city" />
```

### Starfield with Sparkles
```tsx
<Stars radius={100} depth={50} count={3000} factor={4} fade speed={0.5} />
<Sparkles count={50} scale={8} size={3} speed={0.3} color="#6366f1" />
```

### Glass Material
```tsx
<mesh>
  <sphereGeometry args={[1, 64, 64]} />
  <meshPhysicalMaterial
    transmission={0.95}
    thickness={0.5}
    roughness={0.05}
    ior={1.5}
    envMapIntensity={1}
    color="#ffffff"
  />
</mesh>
<Environment preset="city" background blur={0.5} />
```
