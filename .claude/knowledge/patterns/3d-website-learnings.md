# 3D Website Learnings — Battle-Tested Patterns

Everything learned from building production 3D scroll-driven websites. These are REAL learnings from actual builds, not theory.

---

## LEARNING 1: How to Research a 3D Website Before Building

### Step-by-step exploration process:

1. **Open the target site in Playwright** (headless browser)
2. **Screenshot at 0%, then every 10% scroll** to understand the full journey
3. **Extract page structure**: scroll height, canvas size, text elements with fonts/sizes/positions
4. **Key metrics to capture**:
   - `document.body.scrollHeight` — is it a single viewport or multi-section?
   - `document.querySelector('canvas')` — is it WebGL/Three.js?
   - All visible text with `fontSize`, `fontWeight`, `position`, `color`
   - Count of scenes/sections
5. **Analyze the scroll model**: Does the page scroll normally, or does it capture wheel events?

### What we discovered about the Dora duck site:
- Scroll height = viewport height (900px) — **single page, NO vertical sections**
- The Dora engine intercepts scroll events and converts them to animation progress
- Canvas is full viewport (1440x1024)
- "Dancing Duck" title is **100px, weight 700**
- Background decorative text "Shuba Duck" is **360px(!!) font** — massive
- The duck model is from Sketchfab (real GLB, not primitives)
- 3 scenes navigable from top
- "SCROLL TO DANCE" prompt at bottom

### Key takeaway:
**Always screenshot and analyze before building. Don't assume — measure.**

---

## LEARNING 2: Single Viewport vs Multi-Section (CRITICAL)

### What DOESN'T work for premium 3D sites:
```
BAD: 5 sections x min-h-screen = 5 viewports of scroll
- Elements crossfade between sections
- GSAP ScrollTrigger scrubs through a timeline
- The 3D scene feels disconnected from scroll
- Text overlaps 3D elements at wrong scroll positions
```

### What DOES work (Dora pattern):
```
GOOD: 1 viewport = 100vh, overflow hidden
- Wheel events captured, converted to progress (0-1)
- The 3D model ANIMATES based on progress
- Text fades in/out based on current scene
- Background color transitions smoothly
- Everything is a single, cohesive experience
```

### Why single viewport wins:
1. The 3D character is ALWAYS visible and centered — never scrolled off screen
2. No layout conflicts between text and 3D (text is overlaid, not in flow)
3. Scroll = animation control, not page navigation
4. Feels like a premium interactive experience, not a website
5. Works identically on all screen sizes

### Implementation:
```tsx
// Single viewport with wheel-driven progress
const scrollProgress = useRef(0)

useEffect(() => {
  const handleWheel = (e: WheelEvent) => {
    e.preventDefault()
    scrollProgress.current = Math.max(0, Math.min(1,
      scrollProgress.current + e.deltaY * 0.0005
    ))
  }
  window.addEventListener('wheel', handleWheel, { passive: false })
  return () => window.removeEventListener('wheel', handleWheel)
}, [])
```

---

## LEARNING 3: Character/Model is THE Star (Not Primitives)

### What we tried and what happened:

| Attempt | Approach | Result | Rating |
|---------|----------|--------|--------|
| V1 | Primitive shapes (torus, cone, box) as "magnifying glass, laptop, etc." | Looked like basic geometry homework | 4/10 |
| V2 | Abstract MeshDistortMaterial orb morphing through chapters | Generic, could be any website, no story | 6/10 |
| V3 | Low-poly character from primitives (sphere head, box body, cylinder arms) | Charming but crude, hard to pose naturally | 5/10 |
| V4 | SVG → 3D extruded icons (briefcase, person, envelope) | Stylish but flat, hard to tell a story | 6.5/10 |
| V5 | Real GLB model (RobotExpressive.glb) with pre-built animations | HUGE improvement — character has personality | TBD |

### Key takeaway:
**Use a REAL 3D model, not primitives.** The character needs:
- Pre-built animations (idle, walk, dance, wave, etc.)
- Personality and expressiveness
- Enough visual weight to be the hero (50%+ of viewport)

### Where to get free models that WORK:

| Source | What Works | Direct Download? |
|--------|-----------|-----------------|
| **Three.js examples** | RobotExpressive.glb (14 animations, 464KB) | YES — `https://threejs.org/examples/models/gltf/RobotExpressive/RobotExpressive.glb` |
| **Three.js examples** | Soldier.glb (walk/run/idle, 2.1MB) | YES — `https://threejs.org/examples/models/gltf/Soldier.glb` |
| **Quaternius** | Low-poly characters and assets (CC0) | Via itch.io or Google Drive |
| **Sketchfab** | High-quality models (CC-BY) | Requires account + API auth |
| **Mixamo** | Animated characters (free Adobe account) | Export FBX → Blender → GLB |
| **Kenney** | Game asset packs (CC0) | Direct download from kenney.nl |

### IMPORTANT: Check animations BEFORE choosing a model
```javascript
// Parse GLB to check available animations:
const fs = require('fs');
const buf = fs.readFileSync('model.glb');
const jsonLen = buf.readUInt32LE(12);
const jsonStr = buf.toString('utf8', 20, 20 + jsonLen);
const gltf = JSON.parse(jsonStr);
console.log('Animations:', gltf.animations?.map(a => a.name));
```

---

## LEARNING 4: Animation Crossfade (Not Crossfade Between Objects)

### Wrong approach: Crossfade between different 3D compositions
```
BAD:
- Ch1: Show magnifying glass (fade out)
- Ch2: Show laptop (fade in)
- Ch3: Show paper plane (fade in)
- Problem: No continuity, no character, no emotional connection
```

### Right approach: ONE character, crossfade between ANIMATIONS
```tsx
// RIGHT: One character, many animations
function RobotCharacter({ scrollProgress }) {
  const { scene, animations } = useGLTF('/models/RobotExpressive.glb')
  const { actions } = useAnimations(animations, group)
  const currentAction = useRef('Sitting')

  useFrame(() => {
    const p = scrollProgress.current
    let target = 'Sitting'
    if (p > 0.2) target = 'Standing'
    if (p > 0.35) target = 'Walking'
    if (p > 0.5) target = 'Running'
    if (p > 0.65) target = 'ThumbsUp'
    if (p > 0.8) target = 'Dance'

    if (target !== currentAction.current) {
      actions[currentAction.current]?.fadeOut(0.5)
      actions[target]?.reset().fadeIn(0.5).play()
      currentAction.current = target
    }
  })
}
```

### Why this works:
- User sees ONE character throughout — they identify with it
- Animation transitions feel natural (sitting → standing → walking → celebrating)
- It tells a STORY through body language
- No confusing scene switches

---

## LEARNING 5: Typography Makes or Breaks It

### What the duck site taught us:
- Hero title: **100px, font-weight 700** — MASSIVE
- Background decorative text: **360px, font-weight 400, opacity 0.05-0.1** — fills the entire background
- The text is as much a design element as the 3D model

### Rules for 3D website typography:
1. **Hero text: 80-120px minimum** on desktop (clamp down to 48px on mobile)
2. **Use font-weight 800-900** for hero text — it needs to punch through the 3D scene
3. **Add text-shadow** for readability over 3D: `0 2px 30px rgba(0,0,0,0.5)`
4. **Background decorative text: 200px+**, low opacity (0.03-0.08), rotated, overflow hidden
5. **Text position: LEFT side or BOTTOM** — never centered over the character
6. **Text transitions: fade + slight translate** on scene change, not just show/hide

### Bad vs Good typography:
```
BAD:  text-3xl font-bold        (18px — invisible over 3D)
GOOD: text-7xl font-black       (72px — dramatic, readable)
BEST: text-[100px] font-black   (100px — Dora-level impact)
```

---

## LEARNING 6: Color and Background (Not Dark Space)

### What we kept doing wrong:
Every version used `bg-secondary-950` (near-black) background. This made the scene feel like a space simulator, not a job hunting app.

### What works (from the duck site):
- **Vibrant, bold colors** — the duck site uses bright green (#00FF00-ish)
- **High contrast** — white character on dark, bright accents
- **Background color CHANGES per scene** — transitions smoothly with scroll
- **Gradient backgrounds** — not flat solid colors

### Scene-by-scene background transitions:
```tsx
// Background color interpolates with scroll progress
const bgColors = [
  '#0f172a', // Scene 1: Deep navy (moody)
  '#1e3a5f', // Scene 2: Brighter blue (hope)
  '#4a3728', // Scene 3: Warm amber (action)
  '#3d2e0a', // Scene 4: Gold tint (triumph)
  '#0a3d2a', // Scene 5: Emerald (celebration)
]
```

---

## LEARNING 7: The Exploration Pipeline (for the team-lead agent)

When a user says "make it like [reference site]", follow this EXACT pipeline:

### Step 1: Explore with Playwright
```javascript
// Navigate, wait for 3D to load (15-20 seconds), screenshot
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(url, { waitUntil: 'load', timeout: 60000 });
await page.waitForTimeout(20000); // 3D scenes need time to render
```

### Step 2: Analyze page structure
```javascript
const info = await page.evaluate(() => ({
  scrollHeight: document.body.scrollHeight,
  hasCanvas: !!document.querySelector('canvas'),
  textElements: [...document.querySelectorAll('*')]
    .filter(el => el.innerText?.trim().length > 0)
    .map(el => ({
      text: el.innerText.trim(),
      fontSize: getComputedStyle(el).fontSize,
      fontWeight: getComputedStyle(el).fontWeight,
    }))
}));
```

### Step 3: Screenshot at every 10% scroll position
```javascript
for (let pct = 0; pct <= 100; pct += 10) {
  await page.evaluate(y => window.scrollTo(0, y), height * pct / 100);
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `screenshot-${pct}.png` });
}
```

### Step 4: View screenshots to understand visual design
- Use the Read tool to view each screenshot image
- Note: colors, layout, typography sizes, character position, effects

### Step 5: Document findings before building
- Scroll model (single viewport vs multi-section)
- Character type (GLB model vs primitives vs SVG)
- Typography scale
- Color palette
- Animation approach

---

## LEARNING 8: Model Loading in React Three Fiber

### The correct pattern for loading GLB models with animations:
```tsx
import { useGLTF, useAnimations } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

function AnimatedModel({ scrollProgress }: { scrollProgress: React.RefObject<number> }) {
  const group = useRef<THREE.Group>(null)
  const { scene, animations } = useGLTF('/models/RobotExpressive.glb')
  const { actions, mixer } = useAnimations(animations, group)
  const currentAction = useRef<string>('')

  // Initialize first animation
  useEffect(() => {
    if (actions['Sitting']) {
      actions['Sitting'].play()
      currentAction.current = 'Sitting'
    }
  }, [actions])

  // Crossfade based on scroll
  useFrame(() => {
    const p = scrollProgress.current || 0
    let target = 'Sitting'
    if (p > 0.2) target = 'Standing'
    if (p > 0.4) target = 'Walking'
    if (p > 0.6) target = 'ThumbsUp'
    if (p > 0.8) target = 'Dance'

    if (target !== currentAction.current && actions[target]) {
      const prev = actions[currentAction.current]
      const next = actions[target]
      prev?.fadeOut(0.5)
      next?.reset().fadeIn(0.5).play()
      currentAction.current = target
    }
  })

  return <primitive ref={group} object={scene} scale={2.5} position={[0, -1.5, 0]} />
}

// IMPORTANT: Preload for faster initial render
useGLTF.preload('/models/RobotExpressive.glb')
```

### Common mistakes:
1. Forgetting to `preload` the model (causes visible loading delay)
2. Not using `fadeOut`/`fadeIn` (causes animation pops)
3. Setting scale too small (model should be 50%+ of viewport)
4. Playing animations from state instead of refs (causes re-renders, drops frames)

---

## LEARNING 9: Free Models That Actually Work for Web

### Verified working GLB URLs (no auth needed):

```typescript
const FREE_MODELS = {
  // Three.js official examples (MIT license)
  robot: 'https://threejs.org/examples/models/gltf/RobotExpressive/RobotExpressive.glb',
  soldier: 'https://threejs.org/examples/models/gltf/Soldier.glb',
  horse: 'https://threejs.org/examples/models/gltf/Horse.glb',
  flamingo: 'https://threejs.org/examples/models/gltf/Flamingo.glb',
  parrot: 'https://threejs.org/examples/models/gltf/Parrot.glb',
  stork: 'https://threejs.org/examples/models/gltf/Stork.glb',
}
```

### How to check a GLB before using it:
```bash
# 1. Check if URL is accessible
curl -sI "URL" | grep "content-type"
# Should show: content-type: model/gltf-binary

# 2. Download it
curl -L -o model.glb "URL"

# 3. Check animations
node -e "
const buf = require('fs').readFileSync('model.glb');
const json = JSON.parse(buf.toString('utf8', 20, 20 + buf.readUInt32LE(12)));
console.log('Animations:', json.animations?.map(a => a.name));
console.log('Size:', (buf.length / 1024).toFixed(0) + 'KB');
"
```

### Size guidelines for web:
- Under 500KB: Excellent (instant load)
- 500KB - 2MB: Good (show loading spinner)
- 2MB - 5MB: Acceptable (lazy load + compress)
- Over 5MB: Too large (optimize with gltf-transform)

---

## LEARNING 10: The Complete Build Pipeline

### For building a premium 3D website, follow this order:

1. **Research** → Explore reference site with Playwright screenshots
2. **Download model** → Find a free GLB with the right animations
3. **Verify model** → Check animations, file size, polygon count
4. **Architecture** → Single viewport + wheel-driven progress (NOT multi-section scroll)
5. **Build 3D scene** → Load model, set up animation crossfade, lighting, camera
6. **Build text overlays** → Massive typography, positioned to not overlap model
7. **Add background transitions** → Color shifts per scene
8. **Add effects** → Sparkles, stars, particles (subtle, not overwhelming)
9. **Test with Playwright** → Screenshot at each scene, verify visually
10. **Iterate** → Fix text positioning, lighting, colors based on screenshots

### The audit loop:
```
Build → Screenshot all scenes → Rate 1-10 → Fix issues → Screenshot again → Repeat until 8+/10
```

---

## Summary: Rules for 10/10 3D Websites

1. **ONE character, HUGE, CENTER STAGE** — 50%+ of viewport
2. **Real GLB model with animations** — NOT primitives, NOT SVG extrude
3. **Single viewport (100vh)** — wheel events drive animation, not scroll sections
4. **Massive typography (80-100px)** — with background decorative text (200px+)
5. **Vibrant colors that transition per scene** — not flat dark background
6. **Animation crossfade** — one character changes poses, not crossfading between objects
7. **"SCROLL TO BEGIN" prompt** — user needs to know to scroll
8. **Scene navigation** — dots or labels showing current position
9. **CTA at the end** — the story leads to an action
10. **Always test with screenshots** — what looks good in code may look bad rendered
