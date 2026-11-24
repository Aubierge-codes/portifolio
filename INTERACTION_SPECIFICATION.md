# Interaction specification

Every interaction in the redesigned portfolio, with the numbers needed to build
it. Companion to `DESIGN_BLUEPRINT.md`. Anything not listed here doesn't move.

## 0. Principles

1. **Reading wins.** No motion runs under text while it's being read; the
   camera holds while a chapter's copy is on screen and travels between them.
2. **Physical, not tweened.** Camera and objects move with critically damped
   springs (no fixed-duration tweens), so interrupted motion never snaps.
3. **Scroll is never hijacked.** Native scroll everywhere; 3D reads the scroll
   position, it never sets it (except explicit jump links).
4. **Everything in 3D has a DOM equivalent.** Every hotspot, product control and
   chapter is also a real button or link.

## 1. Motion tokens

| Token | Value | Used for |
| --- | --- | --- |
| `spring.camera` | critically damped, ω = 6 rad/s (`1 - e^(-6·dt)` per frame) | camera position/target |
| `spring.object` | ω = 10 | hover lift, press |
| `spring.inspect` | ω = 4.5 | entering/leaving inspect mode |
| `ease.enter` | cubic-bezier(0.16, 1, 0.3, 1), 600 ms | text and UI entering |
| `ease.exit` | cubic-bezier(0.7, 0, 0.84, 0), 240 ms | UI leaving |
| `ease.travel` | smoothstep over the middle 40 % of a chapter's scroll span | chapter-to-chapter camera travel |
| `inertia.rotate` | angular velocity × 0.92 per 16.7 ms, stop below 0.002 rad/frame | drag-to-rotate release |

## 2. Pointer (desktop)

| Where | Behaviour | Amount |
| --- | --- | --- |
| Hero | Camera orbits target with pointer | ±1.6° yaw, ±0.8° pitch, `spring.camera` |
| Hero | Foreground boards parallax against the arm | depth-proportional; boards move 2.2× the arm |
| Work chapters | Same pointer parallax, halved | ±0.8° yaw, ±0.4° pitch |
| Any interactive object | Hover: lift 4 mm (world), 3 % emissive rim **only on the hotspot ring**, cursor `pointer` | `spring.object` |
| Hotspot | Hover: label slides in (DM Mono 12 px), 140 ms | `ease.enter` |
| Lamp (Contact) | Hover: standby glow 0.3; click toggles light | existing behaviour kept |
| Pointer idle 4 s | Parallax eases back to centre | `spring.camera` |

Pointer parallax is disabled while the pointer is over text blocks or the nav,
so reading never shakes the scene.

## 3. Scroll map

Page height is driven by the DOM; the 3D camera director reads each section's
`getBoundingClientRect()` and maps it to that section's shot list.

| Section | Pinned? | Scroll length | Camera |
| --- | --- | --- | --- |
| Loader | n/a | n/a | After exit: hero camera glides 1.8 s from (+0.45 y, +1.6 z) to rest |
| Hero | No | 100 svh | 0→60 %: holds. 60→100 %: dolly over the desk toward the laptop, screen fills ~70 % of frame |
| Work (10 chapters) | Yes | 100 svh per chapter (85 svh on phones) | Match cut: laptop screen → chapter 01 opening shot. Per chapter: hold 30 %, orbit `shot.orbit`, travel 40 % with a 3.2 m crane |
| Embedded Lab | Yes | 260 svh | Lights go down (page tone shifts white → `#0B0B0D` over the first 25 %). Three stops: bench overview → Arduino/Pi close-up → arm articulation |
| Process | No | auto | Six steps reveal on enter (`ease.enter`, 80 ms stagger); no camera |
| About | No | auto | No 3D; one portrait-scale detail object floats in the margin |
| Achievements | No | auto | Horizontal plaque rail; native horizontal scroll inside, no scroll-jacking |
| Contact | No | auto | Street lamp scene; page tone stays dark |

## 4. Click / tap

| Target | Result |
| --- | --- |
| Chapter rail tick | Smooth-scroll to that chapter's hold position |
| Details + | Opens the details dialog (Problem, Role, Decision, Outcome, team) |
| Repository links | New tab, `rel="noreferrer"` |
| Lab object | **Inspect mode**: other objects fade to 15 %, camera springs to the object's three-quarter preset, inspect panel opens |
| Inspect: angle chips | Front / ¾ / Top / Detail presets (`spring.inspect`) |
| Inspect: environment chips | Studio white / Dark cinematic / In context |
| Inspect: hotspot | Highlights that region and shows its label; only real components (see §7) |
| Robot arm "Run" | Plays the articulated pick-and-place cycle once (≈6 s) |
| Laptop "Lid" | Opens/closes the lid about its hinge (900 ms, spring) |
| KinetiQ tile | Press → tile depresses 1.4 mm, voltage spike on the monitor, charge bar fills |
| UMUCOCore pin | Pin rises 6 cm, place card opens beside it |
| HerIngress card | Card turns to face camera, others recede; Asha bubble answers |
| Esc / click outside | Leaves inspect mode or closes dialog, returns focus to the opener |

## 5. Touch

| Gesture | Where | Behaviour |
| --- | --- | --- |
| Vertical swipe | Everywhere | **Native scroll**: never captured |
| Horizontal drag | Inspect mode only | Rotates the object (0.6° per px), `inertia.rotate` on release |
| Pinch | Inspect mode only | Zoom between 0.8× and 1.6× of the preset distance |
| Tap | Hotspots, pins, tiles, cards | Same as click; 44 × 44 px minimum hit area |
| Horizontal swipe | Achievements rail | Native horizontal scroll with snap |

Drag starts only after 8 px of horizontal movement with |dx| > |dy|, so vertical
scrolling over a 3D object still scrolls the page.

## 6. Keyboard

| Key | Context | Action |
| --- | --- | --- |
| Tab / Shift-Tab | Page | Nav → hero CTAs → chapter rail → chapter links → Details → lab objects → … |
| Enter / Space | Any control | Activate |
| ← / → | Chapter rail focused | Previous / next chapter |
| ← / → / ↑ / ↓ | Inspect mode | Rotate 15° per press |
| + / − | Inspect mode | Zoom |
| 1–4 | Inspect mode | Angle presets |
| Esc | Inspect or dialog | Close, restore focus |

Focus ring: 3 px `#6E1F24`, 4 px offset (existing). Lab objects are rendered as
an invisible-but-focusable list of buttons positioned over each object, so they
take focus in visual order.

## 7. Honest hotspots (what the models support)

| Object | Hotspots | Not offered (model can't support it) |
| --- | --- | --- |
| Arduino UNO | USB-B, barrel jack, ATmega328P, digital headers, analog/power headers | Exploded view, per-part highlight (single merged mesh) |
| Raspberry Pi | SoC, USB/Ethernet stack, GPIO header, HDMI | Same |
| Robot arm | Base, shoulder, elbow, wrist, gripper, each **articulated** after rig regrouping | |
| Laptop | Lid (hinged), keyboard, trackpad | Internals |
| Procedural boards in chapters | Any part (they're built from parts) | |

## 8. Reduced motion

| Normal | Reduced |
| --- | --- |
| Loader draws the mark | Mark shown complete, 300 ms fade |
| Scroll-driven 3D world | Still gallery of chapter posters (built) |
| Pointer parallax, idle motion | Off |
| Inspect mode spring | Instant cut to preset |
| Robot arm cycle | Single still pose per stop; "Run" shows a 3-frame sequence |
| Page tone shift into the Lab | Instant switch at section boundary |

## 9. Audio

Off by default; nothing ever autoplays. A speaker toggle in the nav (persisted
per visitor in `localStorage`) enables: soft room tone in the Lab, a servo tick
on arm joints, a click on KinetiQ tiles, a lamp switch in Contact. Max −18 LUFS,
all under 60 KB total, loaded only after the toggle is turned on.

## 10. No WebGL

Same as reduced motion, plus the Lab and Product Studio show their Blender
renders (`design/mockups` style stills, exported per object at 3 angles) with
the hotspot list as plain text.
