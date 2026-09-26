/**
 * Single source of truth for the GLB models the site loads, and the scale
 * each one is displayed at.
 *
 * The files came from different sources at wildly different unit scales — the
 * raw Raspberry Pi export is ~90 units wide, the Arduino ~1.1 — so `scale`
 * normalises each to a comparable on-screen size. Placement is NOT configured
 * here: every model centres and grounds itself at runtime by measuring its own
 * bounding box (see hooks/use-grounded-model.ts), so re-exporting an asset
 * never requires re-deriving offsets by hand.
 *
 * To add a model: optimise it (see docs), drop it in public/models/, add its
 * path and scale below, and build a component on the pattern of
 * arduino-model.tsx.
 */

export const MODEL_PATHS = {
  arduino: "/models/arduino.glb",
  raspberryPi: "/models/raspberry-pi.glb",
  robotArm: "/models/robot-arm.glb",
  laptop: "/models/laptop.glb",
  streetLamp: "/models/street-lamp.glb"
} as const;

export type ModelKey = keyof typeof MODEL_PATHS;

/** Uniform scale bringing each model's largest dimension to ~1.4-1.7 units. */
export const MODEL_SCALE: Record<Exclude<ModelKey, "streetLamp">, number> = {
  arduino: 1.15,
  raspberryPi: 0.017,
  robotArm: 1.4,
  laptop: 0.42
};
