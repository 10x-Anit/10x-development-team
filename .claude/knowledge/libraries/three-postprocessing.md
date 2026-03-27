# Three.js Post-Processing — Effects Reference

Post-processing adds cinematic effects to R3F scenes: bloom, depth of field, chromatic aberration, vignette, and more.

## Install

```bash
npm install @react-three/postprocessing postprocessing
```

## When to Use

| Scope | What to Use |
|-------|-------------|
| production | Full pipeline: Bloom + Vignette + ChromaticAberration + DepthOfField + custom effects |
| mvp | Bloom + Vignette (keep it subtle) |
| prototype | Bloom only (if needed for neon/glow aesthetic) |
| simple | Not applicable (no R3F) |

---

## 1. EffectComposer Setup

```tsx
'use client'

import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'

// Inside Canvas, AFTER scene content:
<EffectComposer>
  <Bloom
    luminanceThreshold={0.6}
    luminanceSmoothing={0.9}
    intensity={0.8}
    mipmapBlur
  />
  <Vignette offset={0.3} darkness={0.6} />
</EffectComposer>
```

---

## 2. Bloom — Glow Effect

Makes bright objects glow. Essential for neon/cyber aesthetics.

```tsx
import { Bloom } from '@react-three/postprocessing'

<Bloom
  luminanceThreshold={0.5}    // Brightness threshold to bloom
  luminanceSmoothing={0.9}    // Smoothing between threshold
  intensity={1.0}             // Bloom intensity
  mipmapBlur                  // Better quality blur
  radius={0.8}                // Bloom radius
/>
```

### Making Objects Glow
```tsx
// Objects with emissive materials glow with Bloom
<mesh>
  <sphereGeometry args={[0.5, 32, 32]} />
  <meshStandardMaterial
    color="#6366f1"
    emissive="#6366f1"
    emissiveIntensity={2}      // Higher = more glow
    toneMapped={false}          // IMPORTANT: disable tone mapping for bright glow
  />
</mesh>
```

---

## 3. Vignette — Darkened Edges

```tsx
import { Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'

<Vignette
  offset={0.3}               // Size of clear center area
  darkness={0.6}             // How dark the edges get
  blendFunction={BlendFunction.NORMAL}
/>
```

---

## 4. ChromaticAberration — Color Fringing

```tsx
import { ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'

<ChromaticAberration
  blendFunction={BlendFunction.NORMAL}
  offset={new THREE.Vector2(0.002, 0.002)}  // RGB offset amount
  radialModulation                            // Stronger at edges
  modulationOffset={0.5}
/>
```

---

## 5. DepthOfField — Bokeh Blur

```tsx
import { DepthOfField } from '@react-three/postprocessing'

<DepthOfField
  focusDistance={0}           // Focus point (0-1 normalized)
  focalLength={0.02}         // Focal length
  bokehScale={2}             // Bokeh circle size
  height={480}               // Render resolution
/>
```

---

## 6. Noise — Film Grain

```tsx
import { Noise } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'

<Noise
  blendFunction={BlendFunction.SOFT_LIGHT}
  opacity={0.3}
/>
```

---

## 7. God Rays — Volumetric Light

```tsx
import { GodRays } from '@react-three/postprocessing'
import { useRef } from 'react'

function GodRayScene() {
  const sunRef = useRef()

  return (
    <>
      <mesh ref={sunRef} position={[0, 5, -10]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      <EffectComposer>
        {sunRef.current && (
          <GodRays
            sun={sunRef.current}
            samples={60}
            density={0.97}
            decay={0.96}
            weight={0.6}
            exposure={0.4}
            clampMax={1}
            blur
          />
        )}
      </EffectComposer>
    </>
  )
}
```

---

## 8. Complete Cinematic Pipeline

```tsx
import {
  EffectComposer,
  Bloom,
  Vignette,
  ChromaticAberration,
  Noise,
  DepthOfField,
  ToneMapping,
} from '@react-three/postprocessing'
import { BlendFunction, ToneMappingMode } from 'postprocessing'
import * as THREE from 'three'

function CinematicEffects() {
  return (
    <EffectComposer>
      {/* Glow on bright objects */}
      <Bloom
        luminanceThreshold={0.5}
        luminanceSmoothing={0.9}
        intensity={0.8}
        mipmapBlur
      />

      {/* Depth blur */}
      <DepthOfField
        focusDistance={0}
        focalLength={0.02}
        bokehScale={2}
      />

      {/* Subtle color fringing */}
      <ChromaticAberration
        offset={new THREE.Vector2(0.001, 0.001)}
        radialModulation
        modulationOffset={0.5}
      />

      {/* Film grain */}
      <Noise
        blendFunction={BlendFunction.SOFT_LIGHT}
        opacity={0.15}
      />

      {/* Dark edges */}
      <Vignette offset={0.3} darkness={0.5} />

      {/* Tone mapping */}
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  )
}
```

---

## 9. Performance Notes

- Each effect adds a render pass — use sparingly on mobile
- `mipmapBlur` on Bloom is faster than default blur
- Set lower `height` on DepthOfField for performance
- Disable effects on mobile with a responsive check:

```tsx
const { isMobile } = useResponsive3D()

{!isMobile && (
  <EffectComposer>
    <Bloom intensity={0.8} mipmapBlur />
    <Vignette offset={0.3} darkness={0.5} />
  </EffectComposer>
)}
```

---

## Effect Presets by Aesthetic

```
Neon/Cyber:    Bloom(high intensity) + ChromaticAberration + Noise + Vignette
Cinematic:     Bloom(subtle) + DepthOfField + Vignette + Noise + ACES ToneMapping
Clean/Minimal: Bloom(very subtle) + Vignette only
Dreamy:        Bloom(medium) + DepthOfField(strong) + Noise(light)
Horror:        ChromaticAberration(strong) + Vignette(dark) + Noise(heavy)
Retro:         Noise(heavy) + Vignette + Bloom(warm tint)
```
