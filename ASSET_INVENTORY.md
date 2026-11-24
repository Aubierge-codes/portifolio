# Asset inventory

Audit of every 3D, image and type asset the portfolio has or needs, written
before the redesign. Numbers come from reading each GLB's glTF JSON and from
importing each model into Blender 4.5 to inspect its hierarchy and pivots
(November 2026).

## 1. Licensing: action required

Every downloaded model is **CC-BY-4.0**, which requires visible credit. The site
shipped five of them from September to November 2026 with **no attribution
anywhere**. The redesign must add a Credits line (footer + Details) before any
of these models goes back online.

| Model | Author | Source |
| --- | --- | --- |
| Arduino Uno R3, Elegoo | Lassi Kaukonen | sketchfab.com/3d-models/arduino-uno-r3-elegoo-69d58a27ae814b429e39b2c19d648cdd |
| Gaming Laptop | Blue Lantern | sketchfab.com/3d-models/gaming-laptop-4e72a2078b3c4a75a821ab09830693fe |
| Raspberry | objets3D | sketchfab.com/3d-models/raspberry-d045eaf534384d9eb926245a5a09ead4 |
| Robot Arm | David06 | sketchfab.com/3d-models/robot-arm-2370f3522d4446eaabd1a319d10b7e22 |
| Monitor | seanbonsenge | sketchfab.com/3d-models/monitor-951acc26013f4652a81c7438a4f5b30b |
| Keyboard | thethieme | sketchfab.com/3d-models/keyboard-cc7e7ed38d9a469ea499893295bc767a |
| Lamp Model | Juan111 | sketchfab.com/3d-models/lamp-model-blender-glb-fbx-5fbae18ee4e84741bd4cba908552d278 |
| Street lamp 02 | Poly Haven (CC0, credit optional) | `lamp_temp/street_lamp_02_4k.blend` |

## 2. Source models (`portfolio-source-assets/`, 147 MB)

| File | Size | Triangles | Parts | Textures | Real size | What the geometry allows |
| --- | --- | --- | --- | --- | --- | --- |
| `arduinoUNO.glb` | 42.4 MB | 57,540 | **1 merged mesh** | 3 × very large (13–16 MB each) | 68.6 × 53.4 mm | Labelled hotspots and close-ups. **No exploded view or per-component highlight**: the components are not separate objects. |
| `gaming_laptop.glb` | 21.0 MB | 120,330 | 15 meshes in **2 groups: lid + base**; lid origin sits on the hinge | 5 | ~360 mm wide | Lid open/close animation. Stock RGB keyboard and Windows wallpaper must be replaced (done in the mockups). |
| `raspberry.glb` | 5.7 MB | 49,999 | 1 merged mesh, **tilted, ~1000× scale** | 1 (3.9 MB) | 85 × 56 mm | Level + rescale once in Blender. Hotspots only. |
| `robot_arm.glb` | 16.5 MB | 73,604 | **40 separate meshes**; wrist/gripper parts share a real pivot at (-0.025, 0.403, 0.614) | 6 | ~1 m as authored | **Can be articulated.** Parts must be regrouped into a base → shoulder → elbow → wrist → gripper rig in Blender. Today's optimised copy merged it to 4 meshes, which made this impossible. |
| `monitor.glb` | 6.0 MB | 29,508 | screen, stand, 2 supports | 6 | 4.3 units wide, far from origin | Screen can take live content. Model faces +X and sits ~8 units off origin; needs re-origin. |
| `keyboard.glb` | 1.3 MB | **144** | 1 | 3 | | Too crude for close-ups. Use the procedural keyboard or model one. |
| `lamp.glb` | 2.5 MB | 18,150 | 2 | 3 | | Fine as a desk prop. |
| `lamp_temp/` street lamp | 0.5 MB .blend + 4K EXR maps | 20,338 | | 4K diffuse/normal/rough/metal | ~4 m | High quality; textures must drop to 1K–2K KTX2. |

## 3. What ran in production before the last redesign

Optimised with glTF-Transform (meshopt + WebP), 6.5 MB total, removed in
November in favour of procedural models. Still recoverable from git (`80e234f`).

| File | Size | Notes |
| --- | --- | --- |
| `arduino.glb` | 1.3 MB | Fine |
| `laptop.glb` | 2.7 MB | 120k triangles: too heavy for its screen size |
| `raspberry-pi.glb` | 0.8 MB | Still tilted; needed a runtime auto-level hack |
| `robot-arm.glb` | 1.0 MB | **Merged to 4 meshes, lost articulation** |
| `street-lamp.glb` | 0.5 MB | Texture missing (0 KB image) |

## 4. Procedural assets in the current build (code, ~0 KB)

`components/three/hardware/*` (Arduino, Pi, arm, laptop, lamp built from
primitives), `components/world/person.tsx` (six people), and
`components/world/scenes-*.tsx` (ten project sets). They are light and fully
art-directable but read as **stylised**, not photographic. The people in
particular read as refined mannequins.

## 5. Decision: hybrid, by where the camera gets close

| Use | Asset strategy | Why |
| --- | --- | --- |
| Hero workstation, Product Studio, Embedded Lab | **Real models**, cleaned and harmonised in Blender, re-exported | These are close-up "product photography" shots where scanned/modelled detail matters. |
| Ten project chapters | **Procedural sets** (existing), upgraded | Many objects at a distance; must stay light; need bespoke props no library has. |
| People | Procedural rig kept; candidate upgrade to a skinned base mesh (see §7) | Rigid-segment figures are the weakest part of the current build. |

## 6. Production pipeline (per model)

1. **Blender**: apply transforms, set real-world scale (metres), put the origin at
   the base centre, Y-up on export.
2. Rename and **group parts semantically** (`arm.shoulder`, `laptop.lid`, …) so code
   can address them. Rebuild the arm hierarchy at its real pivots.
3. **Harmonise materials** to the shared finish system (graphite `#2B2D31`,
   aluminium `#C9CBCE`, maroon accent `#6E1F24`), replace stock screens and RGB.
4. Decimate to budget: hero objects ≤ 40k triangles, props ≤ 15k.
5. Bake textures to **2K max** (1K for props); export GLB.
6. `gltf-transform optimize --compress meshopt --texture-compress ktx2`
   (dev-time CLI, not a runtime dependency).
7. Target sizes: arm ≤ 900 KB, laptop ≤ 900 KB, Arduino ≤ 600 KB, Pi ≤ 500 KB,
   monitor ≤ 500 KB. Total hero set ≤ 3.5 MB, loaded after first paint.

## 7. Missing assets and how to make them

| Needed by | Asset | Approach |
| --- | --- | --- |
| KinetiQ | Piezo disc (brass + ceramic), NodeMCU ESP-12E | **Procedural** (simple, well-documented geometry; exact dimensions available) |
| Zero Bite | Earth-observation satellite, terrain tile with data overlay | Satellite: Blender model (~5k tris). Terrain: procedural heightfield (in place) |
| Eco Girls | Drainage channel, waste bins, rain gauge | Procedural props |
| People | Believable humans with skinning | Options, in order of honesty: (a) keep procedural, show at mid-distance; (b) CC0/CC-BY base mesh (e.g. Quaternius, MakeHuman CC0 exports) rigged with Mixamo-style walk/idle; (c) AI generation (Meshy / Tripo) only for static background figures, never close-up faces |
| Monitor screen, laptop screen | Portfolio UI | Rendered from canvas at runtime (in place) |

AI-generated meshes (Meshy, Tripo) are acceptable for **background props only**:
their topology and textures don't hold up in the close-up product shots this
brief asks for, and every one needs a licence check before use.

## 8. Type and images

- Fonts: Bricolage Grotesque 500, DM Sans 400/500 via `next/font` (self-hosted, no CDN).
- `public/posters/*.jpg`: 10 stills (488 KB) rendered from the live chapters,
  used by the reduced-motion / no-WebGL gallery.
- `app/icon.svg`: the squiggle mark.
- `design/mockups/hero-concept-{A,B,C}.png`: concept renders made from the
  real models in Blender (this design phase).
