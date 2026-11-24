/**
 * Choices made in the Work overlay that the 3D chapters read every frame.
 * A plain mutable object: the DOM writes, `useFrame` reads, nothing re-renders.
 */
export type RiskLayer = "rain" | "temp" | "risk";

export const worldState = {
  /** Zero Bite: which data layer is draped over the terrain. */
  zeroBiteLayer: "risk" as RiskLayer
};
