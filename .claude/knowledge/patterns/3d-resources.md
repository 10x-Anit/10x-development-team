# 3D Resources & Techniques — Complete Guide

Three approaches to creating 3D elements for websites and web apps. Use the right one based on the project needs.

---

## Overview: Three Approaches

| Approach | Best For | Quality | Effort | Tools |
|----------|----------|---------|--------|-------|
| **A. Pre-made Models** | Realistic characters, products, environments | Highest | Import + animate | Spline, Sketchfab, Mixamo, Poly Haven |
| **B. SVG to 3D Extrude** | Icons, illustrations, logos, stylized elements | Modern/Trendy | Convert SVG + extrude | SVGLoader + ExtrudeGeometry |
| **C. Procedural Primitives** | Abstract shapes, particles, geometric art | Good | Code from scratch | Three.js primitives + Drei helpers |

---

## Approach A: Pre-made 3D Models (GLB/GLTF)

### Sources (ALL 100% FREE — no subscriptions, no cost)

> IMPORTANT: Every source listed here is completely free. No paid subscriptions. No premium tiers required. Users should NEVER be asked to pay for any 3D resource. If a source has a paid tier, we ONLY use its free features.

| Source | URL | License | Cost | Best For |
|--------|-----|---------|------|----------|
| **Poly Haven** | https://polyhaven.com/models | CC0 (public domain) | FREE, no account needed | Premium models, HDRIs, textures. BEST free source. No attribution required |
| **Kenney** | https://kenney.nl/assets | CC0 (public domain) | FREE, no account needed | Low-poly game asset packs. Consistent art style. Download full packs |
| **Quaternius** | https://quaternius.com/ | CC0 (public domain) | FREE, no account needed | Cartoon/cute low-poly characters, animals, nature |
| **Sketchfab** | https://sketchfab.com/features/free-3d-models | CC-BY / CC0 | FREE downloads available (filter by "Downloadable" + CC license) | High-quality models, characters, environments. Check license per model |
| **Mixamo** | https://www.mixamo.com/ | Free | FREE (requires free Adobe account — no payment) | Animated human characters. 100+ animations (walk, dance, wave, type, celebrate) |
| **ReadyPlayer.me** | https://readyplayer.me/ | Free | FREE, no subscription | Custom avatars from selfie photo. Combine with Mixamo animations |
| **Blender** | https://www.blender.org/ | GPL (open source) | FREE forever | Create anything from scratch. Export as GLB/GLTF. Industry-standard tool |
| **Spline** | https://spline.design/ | Free tier | FREE to design + embed. GLB export needs free account. Some features are paid — only use free features | Visual 3D design tool. Use free embed or screenshot for reference, then recreate in R3F |

NOTE on Spline: The free tier allows designing and embedding 3D scenes. GLB export and some advanced features may require their paid plan. ALWAYS prefer Poly Haven, Kenney, or Blender for model exports — they are fully free with no restrictions.

### Loading in React Three Fiber

```tsx
import { useGLTF, useAnimations } from '@react-three/drei'

// Basic model loading
function MyModel() {
  const { scene } = useGLTF('/models/character.glb')
  return <primitive object={scene} scale={1.5} />
}

// With animations (Mixamo characters)
function AnimatedCharacter() {
  const group = useRef<THREE.Group>(null)
  const { scene, animations } = useGLTF('/models/character.glb')
  const { actions } = useAnimations(animations, group)

  useEffect(() => {
    actions['Idle']?.play()
  }, [actions])

  return <primitive ref={group} object={scene} scale={1.5} />
}

// Preload for performance
useGLTF.preload('/models/character.glb')
```

### Spline → React Pipeline (3 options)

Spline Docs: https://docs.spline.design/
GitHub: https://github.com/splinetool/react-spline
R3F Hook: https://github.com/splinetool/r3f-spline

```bash
# Option 1: Spline React component (simplest — no R3F needed)
npm install @splinetool/react-spline @splinetool/runtime

# Option 2: Spline inside R3F Canvas (more control)
npm install @splinetool/r3f-spline @splinetool/loader

# Option 3: Export GLB from Spline → load with useGLTF (most control, no Spline runtime)
# No package needed — just useGLTF from @react-three/drei
```

```tsx
// OPTION 1: Standalone Spline component (simplest, works in any React app)
import Spline from '@splinetool/react-spline'

function SplineScene() {
  return <Spline scene="https://prod.spline.design/YOUR_SCENE_ID/scene.splinecode" />
}

// For Next.js with SSR placeholder:
import Spline from '@splinetool/react-spline/next'

// Handle CORS: download .splinecode file and self-host
// In Spline: Code export panel → click download icon → save to public/
<Spline scene="/my-scene.splinecode" />
```

```tsx
// OPTION 2: Inside R3F Canvas (mix Spline objects with R3F elements)
import useSpline from '@splinetool/r3f-spline'

function SplineInR3F() {
  const { nodes, materials } = useSpline('https://prod.spline.design/YOUR_SCENE_ID/scene.splinecode')
  return (
    <group>
      <mesh geometry={nodes.Character.geometry} material={materials.Skin} />
      {/* Mix with regular R3F elements */}
      <Sparkles count={50} size={2} />
    </group>
  )
}
```

```tsx
// OPTION 3: Export GLB from Spline → useGLTF (no Spline runtime, smallest bundle)
// In Spline: File → Export → GLTF/GLB → save to public/models/
// NOTE: GLB export loses Spline-specific materials. Use code export for full fidelity.
import { useGLTF } from '@react-three/drei'

function SplineModel() {
  const { scene } = useGLTF('/models/my-spline-export.glb')
  return <primitive object={scene} scale={1.5} />
}
```

### Spline Code Export (how it works)
1. Open your scene in Spline (spline.design)
2. Click "Code" in left sidebar → choose "React" from dropdown
3. Copy code, open as CodeSandbox, or download local files
4. Animations and events are preserved in React export
5. Code includes geometry, materials, lights, camera positions

> FREE TIER NOTE: Spline's free tier allows designing scenes, embedding via iframe or @splinetool/react-spline, and code export. Some export features may require paid plan. If GLB export is restricted, use code export instead (it's free and includes everything). For fully free alternatives, use Poly Haven or Kenney models.

### Mixamo → React Three Fiber Pipeline

```
1. Go to mixamo.com → pick a character
2. Apply animation (e.g., "Typing", "Waving", "Victory Dance")
3. Download as FBX (with skin)
4. Import FBX into Blender
5. Export from Blender as GLB (File → Export → glTF 2.0)
6. Place GLB in public/models/
7. Use useGLTF + useAnimations in R3F
```

### Converting GLB to React Component

Use https://gltf.pmnd.rs/ — drag-and-drop your GLB file, get a ready-to-use React component with proper types, materials, and animation hooks.

### Performance Tips

- Keep models under 50k polygons for web
- Use Draco compression: `npx @gltf-transform/cli optimize input.glb output.glb --compress draco`
- Inspect with https://gltf.report/ before using
- Lazy-load with `React.lazy()` and `Suspense`

---

## Approach B: SVG → 3D Extrude

Turn any flat SVG icon or illustration into a stylized 3D object. This creates a modern "flat design with depth" look — intentionally artistic, not trying to be realistic.

### How It Works

1. Take any SVG (icon, illustration, logo, silhouette)
2. Parse it with Three.js `SVGLoader`
3. Convert paths to `Shape` objects
4. Extrude with `ExtrudeGeometry` to give depth
5. Apply materials (metallic, glass, matte, emissive)

### Sources for Free SVGs

| Source | URL | Style |
|--------|-----|-------|
| **Heroicons** | https://heroicons.com/ | Clean UI icons (briefcase, envelope, search, rocket) |
| **Lucide** | https://lucide.dev/ | Beautiful open-source icons |
| **unDraw** | https://undraw.co/ | Flat illustrations of people, scenes |
| **Humaaans** | https://www.humaaans.com/ | Mix-and-match people illustrations |
| **Open Peeps** | https://www.openpeeps.com/ | Hand-drawn people illustrations |
| **SVGRepo** | https://www.svgrepo.com/ | 500k+ free SVGs, all categories |
| **Phosphor Icons** | https://phosphoricons.com/ | Flexible icon family |
| **Simple Icons** | https://simpleicons.org/ | Brand/company logos |

### Basic SVG → 3D in React Three Fiber

```tsx
import { useLoader } from '@react-three/fiber'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'
import * as THREE from 'three'

function SVGTo3D({ url, depth = 0.5, color = '#2563eb' }: { url: string; depth?: number; color?: string }) {
  const svgData = useLoader(SVGLoader, url)

  const shapes = useMemo(() => {
    return svgData.paths.flatMap((path) => SVGLoader.createShapes(path))
  }, [svgData])

  const geometry = useMemo(() => {
    const geo = new THREE.ExtrudeGeometry(shapes, {
      depth,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 3,
    })
    geo.center()
    // Fix SVG coordinate system (flip Y)
    geo.scale(1, -1, 1)
    return geo
  }, [shapes, depth])

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        color={color}
        metalness={0.3}
        roughness={0.4}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

// Usage
<SVGTo3D url="/icons/briefcase.svg" depth={0.3} color="#2563eb" />
```

### Inline SVG Path → 3D (No File Loading)

For simple icons, define the SVG path directly in code:

```tsx
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'
import * as THREE from 'three'

function IconTo3D({
  svgPath,
  depth = 0.4,
  color = '#2563eb',
  scale = 0.01,
  ...props
}: {
  svgPath: string
  depth?: number
  color?: string
  scale?: number
}) {
  const geometry = useMemo(() => {
    // Parse SVG path string
    const loader = new SVGLoader()
    const paths = loader.parse(`<svg><path d="${svgPath}"/></svg>`).paths
    const shapes = paths.flatMap((p) => SVGLoader.createShapes(p))

    const geo = new THREE.ExtrudeGeometry(shapes, {
      depth,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 2,
    })
    geo.center()
    geo.scale(scale, -scale, scale)
    return geo
  }, [svgPath, depth, scale])

  return (
    <mesh geometry={geometry} {...props}>
      <meshStandardMaterial color={color} metalness={0.4} roughness={0.3} />
    </mesh>
  )
}

// Example: Heroicons briefcase path
<IconTo3D
  svgPath="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0"
  depth={0.3}
  color="#2563eb"
  scale={0.015}
/>
```

### Material Variations for Extruded SVGs

```tsx
// Metallic (premium look)
<meshStandardMaterial color="#2563eb" metalness={0.8} roughness={0.15} />

// Glass/Transparent
<meshPhysicalMaterial
  color="#ffffff"
  transmission={0.9}
  thickness={0.5}
  roughness={0.05}
  ior={1.5}
/>

// Emissive (glowing)
<meshStandardMaterial
  color="#10b981"
  emissive="#10b981"
  emissiveIntensity={0.5}
  metalness={0.3}
  roughness={0.4}
/>

// Gradient (using vertex colors or shader)
<meshStandardMaterial vertexColors side={THREE.DoubleSide} />
```

### Common SVG Icon Paths (Heroicons — ready to use)

```ts
// Briefcase
const BRIEFCASE = "M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0"

// Envelope
const ENVELOPE = "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"

// Magnifying Glass / Search
const SEARCH = "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"

// Rocket / Launch
const ROCKET = "M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"

// Trophy / Star
const TROPHY = "M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"

// User / Person
const USER = "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"

// Document / Paper
const DOCUMENT = "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"

// Globe
const GLOBE = "M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"

// Paper Airplane
const PAPER_PLANE = "M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
```

---

## Approach C: Procedural Primitives (Three.js + Drei)

Build 3D elements entirely from code using primitive shapes and advanced materials.

### Key Drei Helpers

```tsx
import {
  Float,               // Gentle floating animation
  MeshDistortMaterial, // Organic morphing surface
  MeshWobbleMaterial,  // Wobbly jelly effect
  Stars,              // Starfield background
  Sparkles,           // Floating sparkle particles
  Environment,        // HDR environment lighting
  ContactShadows,     // Ground shadow
  Cloud,              // Volumetric clouds
  Sky,                // Realistic sky
  Lightformer,        // Custom light shapes
  useTexture,         // Load textures
  Text3D,             // 3D text (requires font JSON)
  Center,             // Auto-center geometry
} from '@react-three/drei'
```

### Advanced Materials

```tsx
// Organic living surface
<MeshDistortMaterial color="#2563eb" distort={0.4} speed={2} metalness={0.8} roughness={0.2} />

// Jelly wobble
<MeshWobbleMaterial color="#10b981" factor={0.6} speed={2} metalness={0.3} />

// Glass/Crystal
<meshPhysicalMaterial transmission={0.95} thickness={0.5} roughness={0} ior={2.33} color="#ffffff" />

// Holographic
<meshPhysicalMaterial
  color="#ffffff"
  metalness={1}
  roughness={0}
  iridescence={1}
  iridescenceIOR={1.3}
  iridescenceThicknessRange={[100, 800]}
/>
```

---

## Tools for Optimization

| Tool | URL | Purpose |
|------|-----|---------|
| **gltf.pmnd.rs** | https://gltf.pmnd.rs/ | Convert GLB → React Three Fiber JSX component |
| **gltf.report** | https://gltf.report/ | Inspect GLB files — check poly count, textures, file size |
| **gltf-transform** | https://gltf-transform.dev/ | CLI to optimize GLB — Draco compression, texture resize |
| **Squoosh** | https://squoosh.app/ | Compress textures (PNG/JPG) before bundling |

```bash
# Optimize a GLB file (compress textures + Draco geometry compression)
npx @gltf-transform/cli optimize input.glb output.glb --compress draco --texture-compress webp

# Check file size
npx @gltf-transform/cli inspect model.glb
```

---

## Choosing the Right Approach

| Project Need | Recommended Approach |
|-------------|---------------------|
| Realistic product showcase | A (Spline or Sketchfab model) |
| Animated human character | A (Mixamo + Blender → GLB) |
| Custom branded 3D scene | A (Spline — design visually) |
| Icon-based 3D elements | B (SVG → ExtrudeGeometry) |
| Stylized flat-design-with-depth | B (SVG illustrations → 3D) |
| Logo as 3D element | B (SVG → 3D extrude) |
| Abstract hero background | C (procedural primitives + Drei) |
| Particle effects, stars | C (Drei Sparkles, Stars, InstancedMesh) |
| Scroll-driven story | A or B for elements + C for effects |
| Quick prototype | C (fastest, no external assets) |
