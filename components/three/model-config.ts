/**
 * Centralized paths and per-model calibration for the GLB accents used
 * across the portfolio. Each source file was downloaded separately (Sketchfab
 * exports) and authored at a different, arbitrary unit scale — Raspberry Pi's
 * raw geometry is ~90 units wide, Arduino's is ~1.1. `scale` and `groundOffset`
 * below were derived from each file's bounding box (via `gltf-transform
 * inspect`) to normalize every model to a comparable on-screen size and sit
 * flush on its local ground plane (y = 0) rather than floating or clipping.
 */

export const MODEL_PATHS = {
  arduino: "/models/arduino.glb",
  raspberryPi: "/models/raspberry-pi.glb",
  robotArm: "/models/robot-arm.glb",
  laptop: "/models/laptop.glb",
  monitor: "/models/monitor.glb",
  keyboard: "/models/keyboard.glb",
  deskLamp: "/models/desk-lamp.glb"
} as const;

type ModelCalibration = {
  /** Uniform scale bringing the model's largest bbox dimension to ~1.4-1.7 units. */
  scale: number;
  /** bbox center in the model's own local space (x, z only — y is grounded separately). */
  center: [number, number];
  /** The model's lowest point (bbox min y), so it can be placed flush at y = 0. */
  floorY: number;
};

export const MODEL_CALIBRATION: Record<
  "arduino" | "raspberryPi" | "robotArm" | "laptop" | "monitor" | "keyboard",
  ModelCalibration
> = {
  arduino: { scale: 1.15, center: [0.024, -0.086], floorY: 0.005 },
  raspberryPi: { scale: 0.017, center: [-21.16, 27.83], floorY: -48.533 },
  robotArm: { scale: 1.4, center: [-0.001, -0.054], floorY: -0.21 },
  laptop: { scale: 0.42, center: [-0.205, 0.001], floorY: -0.131 },
  monitor: { scale: 0.38, center: [-2.427, -3.29], floorY: 6.277 },
  keyboard: { scale: 4.5, center: [0, 0], floorY: -0.015 }
};

/** Group position that centers a calibrated model on x/z and grounds it at y = 0. */
export function groundedPosition({
  scale,
  center,
  floorY
}: ModelCalibration): [number, number, number] {
  return [-center[0] * scale, -floorY * scale, -center[1] * scale];
}
