# Design blueprint

**Aubierge Umurerwa: immersive portfolio redesign.**
Status: **design for review. Nothing in this document is implemented yet.**
Companions: `DESIGN_CONCEPTS.md` (the three directions and why one won),
`INTERACTION_SPECIFICATION.md` (every interaction, with numbers),
`ASSET_INVENTORY.md` (what the models can and can't do).

---

## 1. Direction: "Editorial Engineering, with night chapters"

Concept B (Premium Editorial Engineering) is the backbone. It borrows two
things:

- From **A (Cinematic Technology World)**: the dark, single-key studio light,
  used only where the subject is hardware: the **Embedded Lab** and **Contact**.
  The page physically "dims the lights" as you walk into the lab.
- From **C (Immersive Creative Laboratory)**: every project is a built place you
  travel through, not a card. This is the existing Work world, upgraded.

**Why:** your brand (white, ink, maroon, coral, Bricolage) is already editorial.
A fully dark site would throw that identity away and fight readability. A
lab-everywhere site gets busy. Editorial light with two dark chapters gives
contrast, a sense of a journey, and keeps the copy in charge.

**Design idea in one line:** *a precise, quiet studio where real engineering
objects are photographed like products, and every project is a place.*

## 2. Visual identity

### Colour (exact)

| Role | HEX | Use |
| --- | --- | --- |
| Paper | `#FFFFFF` | Page base |
| Studio | `#F4F1EC` | 3D background, cyclorama, soft surfaces |
| Stone | `#E7E2D9` | Plinths, secondary surfaces |
| Ink | `#030303` | Type, UI lines |
| Ink 70 | `#4A4844` | Secondary type |
| Graphite | `#2B2D31` | Hardware bodies, arm, lamp |
| Aluminium | `#C9CBCE` | Metals, joints, laptop |
| Night | `#0B0B0D` | Lab and Contact background |
| Night surface | `#141316` | Lab bench |
| Maroon | `#6E1F24` | One accent per frame: rail, active tick, arm ring, lab accent light |
| Coral | `#EB5A3C` | Signals only: data packets, the logo dot, live LEDs |

Rules: at most **one** maroon element and **one** coral element per frame. No
gradients except light falloff. No neon, no glows other than physically motivated
light (screens, LEDs, the lamp).

### Typography

| Style | Font | Size desktop / phone | Notes |
| --- | --- | --- | --- |
| Display | Bricolage Grotesque 500 | 88 / 44 px, −2 % tracking, 0.98 lh | Hero name/title only |
| H2 | Bricolage Grotesque 500 | 56 / 34 px | Section titles |
| H3 | Bricolage Grotesque 500 | 32 / 26 px | Project names |
| Body | DM Sans 400 | 18 / 17 px, 1.5 lh | Max 62 ch |
| UI | DM Sans 500 | 14 px | Buttons, nav |
| **Annotation** (new) | **DM Mono 400** | 12 px, uppercase, +12 % tracking | Hotspot labels, counters, specs. Pairs with DM Sans; self-hosted via `next/font`, ~18 KB |

### Light and materials

- Lighting model: offline RoomEnvironment (no HDRI download) + one large soft key
  (front-left, 5600 K-ish warm white), cool fill at 15 % of key, rim from back-right.
  Lab: key drops to a single narrow softbox; fill off; a maroon practical strip.
- Shadows: PCF 2048 on desktop, 1024 on phones; contact shadows under every
  object that touches a surface.
- Finish system (applied to every model, borrowed or procedural):
  graphite (metal 0.6, rough 0.38, clearcoat 0.4), aluminium (metal 0.95, rough
  0.3), PCB greens/blues kept true, keycaps matte (rough 0.6).
- Post: tone mapping ACES, bloom (threshold 0.85, intensity 0.35), vignette
  0.32/0.42, grain 2.8 %. AO only on discrete GPUs. Depth of field only inside
  inspect mode, where the camera is still.

## 3. Page by page

Mockups: `design/mockups/hero-concept-B.png` (hero, chosen direction),
`hero-concept-A.png` (lab lighting), `hero-concept-C.png` (rejected direction),
concept boards `design/mockups/board-{A,B,C}.png`.

### 3.1 Loader (built)
Mark draws, name in Bricolage, maroon progress rule, real progress (fonts, first
hero frame, model loading), 900 ms minimum, 6 s cap. Hands off to the hero camera.

### 3.2 Hero: the workstation
- **Composition:** left 40 % type (eyebrow in DM Mono, Display title, one line,
  two CTAs). Right 60 %: a real workstation still life on a stone plinth:
  laptop (lid open, your UI on screen) at the centre, the articulated arm
  back-right, Arduino and Pi in the foreground, desk lamp back-left on wide
  screens only. A diagonal leads from the boards to the arm.
- **Camera:** 34 mm equivalent, low (desk height + 30 cm), slight pointer orbit.
- **Life:** arm finishes a slow pick-and-place every ~9 s; the Pi's activity LED
  breathes; dust in the key light. Nothing else moves.
- **Scroll:** camera dollies across the desk into the laptop screen; the screen
  becomes the doorway into the Work world (match cut).
- **Phone:** objects re-stack: laptop centre, arm behind, boards in front; the type
  sits above the scene, not over it.

### 3.3 Work: ten places (built, to upgrade)
Pinned, one shared canvas, counter `01 / 10`, name, one line, tags, links,
Details, chapter rail. Upgrades per project:

| Project | Place | Signature interaction | Must stay true |
| --- | --- | --- | --- |
| HerIngress / Asha | A study desk; opportunity cards orbit; Asha answers | Click a card: it turns to you, Asha explains the match; a search field filters cards by type | Technovation 2026 semifinalist; no invented features |
| UMUCOCore | Terraced hills, story pins, imigongo panel, agaseke | Click a pin: place card. "Rooted in Culture. Inspired by Nature." as the chapter's only line | No stereotypes: natural materials, real motifs used sparingly |
| Gwiza | An open office; recruiters, candidates, match lines | Hover a person: their match lines light | Frontend + backend repos only |
| Velora | **Change:** a page assembling itself: tokens → components → page, layers separating in depth | Scroll orbit reveals the layers | Next.js, TypeScript, Tailwind |
| Eco Girls / SHE Leads | Greenhouse + a street drainage channel and waste point | Sensor taps reveal readings; rain clears the channel | Community action, Girl in Bloom 2026 |
| Zero Bite | Gisagara terrain tile at dusk, satellite overhead, risk grid overlay, weather glyphs, field station Pi | Toggle layers: rainfall / temperature / risk | Label on screen: "Risk exploration, not a diagnosis" |
| KinetiQ | Piezo tiles, **NodeMCU ESP-12E**, wiring, monitor with live readout | Press tiles: voltage spike, charge accumulates, Streamlit-style chart updates | Piezo + NodeMCU + Streamlit only |
| Weather | Sky dome, sun/rain split, UI card | Card follows the weather state | API-driven UI |
| Bookstore | Shelves, reader, a record ledger | Add/update/delete a book record animates the shelf | CRUD over Express + MongoDB |
| Java | Class blocks and relations | Hover a class: its relations light | OOP concepts only |

### 3.4 Embedded Lab + Product Studio (new; replaces today's bench panel)
- **Tone:** page dims to Night over the first quarter of the section.
- **Stop 1, bench:** real Arduino, Pi, arm, monitor on a dark bench under one
  softbox; maroon practical strip behind.
- **Stop 2, boards:** close-up of Arduino and Pi with honest hotspots.
- **Stop 3, arm:** the regrouped arm runs a pick-and-place; joints labelled.
- **Inspect mode** (any object): turntable, 4 angle presets, 3 environments
  (Studio white / Dark cinematic / In context), drag + pinch, hotspots.
  This is the "product rendering studio".

### 3.5 Process
Six existing steps grouped into four acts the brief names: **Think**
(Understand), **Design** (Prototype), **Build** (Build, Test), **Improve**
(Ship, Iterate). Each act is a horizontal band; a single thin maroon line draws
across them as you scroll. No 3D: this section rests the eyes.

### 3.6 About
Editorial two-column: copy left, a small rotating aluminium detail (the arm's
wrist joint) in the margin. Languages line kept.

### 3.7 Achievements
An exhibition rail of plaques (stone cards, DM Mono labels). **Only verified
entries from `data/translations.ts`.** Several have no date in the data;
see Open questions.

### 3.8 Contact (built)
Dark, street lamp with working toggle, people walking along the strip. Credits
line for the CC-BY models added to the footer.

## 4. Storyboard (the visitor's path)

1. White page, the mark draws itself, your name settles. Lift.
2. The camera glides down onto the desk; the arm completes a move as the title lands.
3. Scroll: the camera crosses the desk and falls into the laptop screen.
4. The screen opens onto the first place: a young woman at a desk, opportunities orbiting.
5. Nine more places, each a different light and a different world; the rail shows where you are.
6. The page dims: the Lab. Real boards under a single light. Click one; it turns in your hand.
7. Lights come up for Process, About, Achievements: quiet, editorial.
8. Night again for Contact: the street lamp. Click it on. Say hello.

## 5. Technical architecture

| Decision | Choice | Reason |
| --- | --- | --- |
| Framework | Keep Next.js 15 / React 19 / R3F 9 / drei / framer-motion | Works; no rewrite |
| **WebGL contexts** | **One persistent full-viewport canvas** behind the page (drei `View` scissoring for inline scenes) instead of today's 6+ canvases | One context, shared GPU resources, no context-loss risk, seamless hero → work transition |
| Scene management | `SceneDirector` maps each section's DOM rect to a shot list; scenes mount when within one viewport and unmount after leaving | Scroll stays native; lifecycle bounded |
| Animation | framer-motion `useScroll` + R3F frame loop + `maath` damping (already installed) | **No GSAP**: nothing it does here isn't already covered |
| Models | Blender clean-up → glTF-Transform (meshopt, KTX2) → `public/models/*.glb`, loaded with `useGLTF` after first paint | See `ASSET_INVENTORY.md` §6 |
| Arm articulation | Regrouped node hierarchy exported from Blender; joints driven in code | Real pivots exist in the source |
| Post | `@react-three/postprocessing` (installed) | |
| Fallbacks | Reduced motion and no-WebGL → posters and stills (built for Work) | |
| Audio | Optional, off by default, Web Audio, lazy | |

### Budgets

| Metric | Desktop (Iris Xe class) | Phone |
| --- | --- | --- |
| Frame rate | 60 fps target, ≥ 45 floor | ≥ 30 fps |
| DPR | 1–1.5 adaptive | 1–1.25 adaptive |
| 3D downloads | ≤ 3.5 MB after first paint | ≤ 2 MB (lower texture tier) |
| Triangles on screen | ≤ 600k | ≤ 250k |
| Draw calls | ≤ 250 | ≤ 120 |

## 6. Build plan (after approval)

1. **Assets** (Blender): clean, harmonise, regroup the arm, export, compress; credits.
2. **Single-canvas architecture** + SceneDirector; migrate hero, lab, contact.
3. **Hero** workstation with real models.
4. **Embedded Lab + Product Studio** (inspect mode, presets, hotspots, arm cycle).
5. **Chapter upgrades** (table §3.3), KinetiQ and Zero Bite first.
6. **Process / About / Achievements** redesign.
7. **QA**: build, typecheck, lint, browser checks at 1440×900 / 820×1180 /
   390×844, fps, fallbacks, links, console.

## 7. Open questions for you

1. **Achievement dates:** six of the eight achievements have no year in the data.
   Give years, or present them undated?
2. **People:** keep the procedural figures at mid-distance, or approve sourcing a
   CC0 rigged base human (better gait and faces, ~1.5 MB)?
3. **Monitor in the hero:** cut from the hero composition (recommended; it
   competes with the laptop) and used in the Lab. Agree?
4. **Audio:** build it (off by default), or skip?
