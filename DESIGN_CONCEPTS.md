# Design concepts

Three directions for the portfolio, each staged with **your real models** (the
Sketchfab Arduino, Raspberry Pi, robot arm and laptop, harmonised to one finish
system) and rendered in Blender, so they can be compared as images rather than
adjectives. Same objects, same camera; only the art direction changes.

| | Render | Board (with type) |
| --- | --- | --- |
| A | `design/mockups/hero-concept-A.png` | `design/mockups/board-A.png` |
| B | `design/mockups/hero-concept-B.png` | `design/mockups/board-B.png` |
| C | `design/mockups/hero-concept-C.png` | `design/mockups/board-C.png` |

---

## Concept A: Cinematic Technology World

**Moodboard (qualities):** a product launch shot at night; one softbox; black
glass; brushed metal catching a single rim; long falloff into darkness; a thin
line of maroon light on the back wall.

| Palette | HEX |
| --- | --- |
| Night | `#070708` |
| Bench | `#141316` |
| Graphite | `#2B2D31` |
| Aluminium | `#C9CBCE` |
| Paper text | `#F2EFE8` |
| Maroon light | `#6E1F24` |
| Coral signal | `#EB5A3C` |

- **Type:** Bricolage 500 in paper on night; DM Mono annotations at 60 % paper.
- **Lighting:** single narrow key from top-left, rim from back-right, fill near zero; AgX high contrast.
- **Materials:** glossy bench (clearcoat 0.3), metals dominate.
- **Hero:** workstation emerging from black; title bottom-left in paper.
- **Sections:** everything dark; projects are spotlit islands.
- **Products:** pure black sweep, rim-lit silhouettes.
- **Navigation:** thin paper rule, mono labels.
- **Storyboard:** light rises on the desk → camera tracks along the bench → each project lit as a stage.
- **Mobile:** single-object shots; text over black is safe at every size.
- **Strength:** the most dramatic first frame; hardware looks expensive.
- **Weakness:** abandons your white, editorial brand; ten dark chapters get
  monotonous; dark scenes hide the people and environments the projects need;
  heavier on the GPU (relies on bloom/contrast to read).

## Concept B: Premium Editorial Engineering (recommended backbone)

**Moodboard:** a design-museum catalogue; objects on a stone plinth with soft
north light; generous white; precise mono captions; the brand's ink and maroon
used like a print accent.

| Palette | HEX |
| --- | --- |
| Paper | `#FFFFFF` |
| Studio | `#F4F1EC` |
| Stone | `#E7E2D9` |
| Ink | `#030303` |
| Ink 70 | `#4A4844` |
| Aluminium | `#C9CBCE` |
| Maroon | `#6E1F24` |
| Coral | `#EB5A3C` |

- **Type:** Display Bricolage 88 px; DM Sans body; **DM Mono** captions (new).
- **Lighting:** large soft key, gentle fill, low-contrast AgX; long soft shadows.
- **Materials:** matte stone plinth, satin aluminium, true PCB colours.
- **Hero:** left 40 % type, right 60 % still life (render B).
- **Sections:** light by default; projects are places in warm daylight.
- **Products:** catalogue turntable on stone; DM Mono spec captions.
- **Navigation:** existing nav + chapter rail; maroon only on the active state.
- **Storyboard:** see `DESIGN_BLUEPRINT.md` §4.
- **Mobile:** type above scene; scene re-stacks vertically.
- **Strength:** fits the brand you already built; type stays readable; gives
  every project room; the lightest to render.
- **Weakness on its own:** can feel calm to the point of polite; needs a moment
  of drama (solved by borrowing A for the Lab and Contact).

## Concept C: Immersive Creative Laboratory

**Moodboard:** a maker's workbench: oak bench, pegboard wall, a desk lamp,
tools and boards within reach; warm practical light; things mid-use.

| Palette | HEX |
| --- | --- |
| Lab grey | `#D9D4CC` |
| Pegboard | `#CFC9BF` |
| Oak bench | `#8A6A4F` |
| Ink | `#151413` |
| Graphite | `#2B2D31` |
| Maroon | `#6E1F24` |
| Coral | `#EB5A3C` |

- **Type:** Bricolage in ink; DM Mono labels as if on tape.
- **Lighting:** warm practical (desk lamp) plus window fill.
- **Materials:** wood, perforated board, worn metals.
- **Hero:** the bench as a whole room; title on a "label strip".
- **Sections:** one continuous lab you walk through; projects are workstations.
- **Products:** on the bench in context, rarely isolated.
- **Navigation:** lab "stations".
- **Storyboard:** a walk along a single long bench.
- **Mobile:** hard: busy frames don't survive the crop.
- **Strength:** the most tangible and "maker"; great for KinetiQ and the Lab.
- **Weakness:** visually busy; the pegboard and wood fight the type; every
  section looks the same place; the most props to model and render.

---

## Comparison

| Criterion | A Cinematic | B Editorial | C Laboratory |
| --- | --- | --- | --- |
| Fits existing brand | 2/5 | **5/5** | 3/5 |
| First-impression drama | **5/5** | 3/5 | 4/5 |
| Readability of copy | 3/5 | **5/5** | 2/5 |
| Room for ten different project worlds | 2/5 | **5/5** | 2/5 |
| Product-photography quality | **5/5** | 4/5 | 3/5 |
| Mobile | 4/5 | **5/5** | 2/5 |
| Render cost | 3/5 | **5/5** | 2/5 |

## Recommendation

**B as the backbone, A for the two hardware moments, C's "projects are places".**
The page lives in editorial daylight, dims into a cinematic Lab for the
Embedded section and Product Studio, rises again for Process, About and
Achievements, and ends at night in Contact. Full specification in
`DESIGN_BLUEPRINT.md`.

## Art-direction review of the mockups (what I rejected along the way)

1. First staging: objects in a flat line, monitor dominating, boards invisible.
   **Rejected:** no hierarchy. Rebuilt as a diagonal from foreground boards to the arm.
2. Borrowed models clashed (RGB gaming keyboard, Windows wallpaper, copper arm).
   **Rejected:** introduced the finish system and replaced screens with your UI.
3. Monitor next to laptop doubled the "screen" story. **Cut from the hero**,
   moved to the Lab.
4. Concept A's first pass was grey, not dark. Darkened to near-black with a single key.
5. Board B first had the headline over the laptop. Render shifted right so the
   left 40 % of the frame belongs to the type (the blueprint's rule).

**Known flaws left in the mockups (fixed in the asset pipeline, not the design):**
the Raspberry Pi floats a few millimetres above the desk (the source model is
tilted and needs manual levelling in Blender), and the arm crops at the right
edge of the boards. Reproduce or adjust the renders with
`design/tools/concept-render.py` (Blender 4.5:
`blender -b --factory-startup --python design/tools/concept-render.py -- B out.png ../portfolio-source-assets`).
