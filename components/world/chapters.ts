/**
 * Camera direction for each chapter of the Work world, in story order. The
 * ids match data/projects.ts. Sets are laid out along +x, `SPACING` apart, so
 * the fog hides each one from its neighbours.
 *
 * - `eye` and `look` are local to the set's centre.
 * - `orbit` is how far (radians) the camera arcs around `look` while the
 *   visitor scrolls through the chapter; `dolly` how much closer it drifts.
 * - `tint` colours the background and fog for that chapter.
 */
export type Shot = {
  id: string;
  eye: [number, number, number];
  look: [number, number, number];
  fov: number;
  orbit: number;
  dolly: number;
  tint: string;
  fog: [number, number];
};

export const SPACING = 60;

export const SHOTS: Shot[] = [
  {
    id: "heringress",
    eye: [2.6, 1.75, 3.4],
    look: [0, 1.05, -0.2],
    fov: 34,
    orbit: 0.5,
    dolly: 0.12,
    tint: "#f4f1ec",
    fog: [9, 26]
  },
  {
    id: "umucocore",
    eye: [1.5, 5.8, 11],
    look: [0, 0.9, 0],
    fov: 38,
    orbit: 0.45,
    dolly: 0.15,
    tint: "#eef1ec",
    fog: [14, 46]
  },
  {
    id: "gwiza",
    eye: [4.4, 2.9, 7.0],
    look: [0.1, 1.1, 0.4],
    fov: 36,
    orbit: 0.4,
    dolly: 0.12,
    tint: "#f3f1ed",
    fog: [10, 28]
  },
  {
    id: "velora",
    eye: [0.4, 1.3, 3.2],
    look: [0, 0.75, 0],
    fov: 32,
    orbit: 0.8,
    dolly: 0.18,
    tint: "#d6d2cc",
    fog: [8, 22]
  },
  {
    id: "eco-girls",
    eye: [3.2, 2.3, 4.6],
    look: [0, 0.8, -0.2],
    fov: 38,
    orbit: 0.45,
    dolly: 0.12,
    tint: "#eff2ec",
    fog: [10, 30]
  },
  {
    id: "zero-bite",
    eye: [1.6, 2.0, 6.4],
    look: [0.4, 1.3, 0],
    fov: 36,
    orbit: 0.4,
    dolly: 0.14,
    tint: "#efe1d2",
    fog: [9, 30]
  },
  {
    id: "kinetiq",
    eye: [0.6, 2.1, 5.8],
    look: [-0.5, 0.85, 0.4],
    fov: 36,
    orbit: 0.45,
    dolly: 0.12,
    tint: "#f2f1ee",
    fog: [10, 28]
  },
  {
    id: "weather",
    eye: [0.2, 1.7, 6.2],
    look: [0, 1.9, 0],
    fov: 42,
    orbit: 0.35,
    dolly: 0.1,
    tint: "#eaf0f4",
    fog: [30, 90]
  },
  {
    id: "bookstore",
    eye: [2.2, 1.75, 4.4],
    look: [0, 0.95, -0.3],
    fov: 36,
    orbit: 0.45,
    dolly: 0.12,
    tint: "#f4efe7",
    fog: [9, 24]
  },
  {
    id: "java-projects",
    eye: [0.6, 2.5, 6.4],
    look: [0.1, 2.0, -0.3],
    fov: 36,
    orbit: 0.6,
    dolly: 0.12,
    tint: "#f2f2f1",
    fog: [10, 28]
  }
];
