import {
  BoxGeometry,
  CanvasTexture,
  CylinderGeometry,
  MeshPhysicalMaterial,
  SRGBColorSpace,
  type BufferGeometry
} from "three";
import { RoundedBoxGeometry } from "three-stdlib";

/**
 * Shared building blocks for the procedural hardware models.
 *
 * Every model is authored in real millimetres, centred on x/z and resting on
 * y = 0, so nothing has to be measured or levelled at runtime. A model's root
 * group applies `MM` to bring millimetres into scene units, and each scene
 * then applies its own display scale.
 *
 * Geometries and materials are created once, on first use, and shared by
 * every canvas on the page. three keeps GPU copies per renderer, so a canvas
 * unmounting (and disposing its renderer) frees its uploads while these CPU
 * definitions stay ready for the next one. That's why nothing here is disposed
 * per component; anything a component creates for itself is disposed by that
 * component.
 */

/** Scene units per millimetre: 1 unit = 100 mm. */
export const MM = 0.01;

function lazy<T>(make: () => T) {
  let value: T | undefined;
  return () => (value ??= make());
}

type PhysicalOptions = ConstructorParameters<typeof MeshPhysicalMaterial>[0];

function physical(options: PhysicalOptions) {
  return new MeshPhysicalMaterial({ roughness: 0.5, metalness: 0, ...options });
}

export const materials = lazy(() => ({
  pcbBlue: physical({
    color: "#08587a",
    roughness: 0.45,
    clearcoat: 0.35,
    clearcoatRoughness: 0.32
  }),
  pcbGreen: physical({
    color: "#1f6a3c",
    roughness: 0.45,
    clearcoat: 0.35,
    clearcoatRoughness: 0.32
  }),
  gold: physical({ color: "#d1aa55", metalness: 1, roughness: 0.3 }),
  tin: physical({ color: "#d3d6da", metalness: 1, roughness: 0.26 }),
  nickel: physical({ color: "#c2c5ca", metalness: 1, roughness: 0.32 }),
  blackPlastic: physical({
    color: "#17181b",
    roughness: 0.55,
    clearcoat: 0.15
  }),
  chip: physical({
    color: "#1c1d20",
    roughness: 0.38,
    clearcoat: 0.45,
    clearcoatRoughness: 0.4
  }),
  hole: physical({ color: "#060606", roughness: 1 }),
  cream: physical({ color: "#ece6da", roughness: 0.5 }),
  ceramic: physical({ color: "#b49a74", roughness: 0.6 }),
  capSleeve: physical({
    color: "#23272e",
    roughness: 0.45,
    clearcoat: 0.5
  }),
  graphite: physical({
    color: "#2c2f34",
    metalness: 0.55,
    roughness: 0.38,
    clearcoat: 0.5,
    clearcoatRoughness: 0.3
  }),
  shell: physical({
    color: "#ecebe7",
    roughness: 0.34,
    clearcoat: 0.7,
    clearcoatRoughness: 0.22
  }),
  aluminium: physical({ color: "#d6d8db", metalness: 0.92, roughness: 0.34 }),
  aluminiumSoft: physical({
    color: "#cbcdd0",
    metalness: 0.85,
    roughness: 0.22
  }),
  keycap: physical({ color: "#1e1f22", roughness: 0.62 }),
  bezel: physical({
    color: "#0b0b0c",
    roughness: 0.18,
    clearcoat: 1,
    clearcoatRoughness: 0.05
  }),
  maroon: physical({
    color: "#6e1f24",
    roughness: 0.4,
    clearcoat: 0.6,
    clearcoatRoughness: 0.25
  }),
  rubber: physical({ color: "#121214", roughness: 0.85 }),
  ledGreen: physical({
    color: "#7ee08a",
    emissive: "#3fd25a",
    emissiveIntensity: 1.1,
    roughness: 0.3
  }),
  ledAmber: physical({
    color: "#f2c46b",
    emissive: "#f0a640",
    emissiveIntensity: 0.35,
    roughness: 0.3
  })
}));

export type MaterialName = keyof ReturnType<typeof materials>;

/** A 1 mm cube, scaled per mesh. The cheapest part there is: 12 triangles. */
export const unitBox = lazy(() => new BoxGeometry(1, 1, 1));

const cylinders = new Map<number, CylinderGeometry>();
/** A unit cylinder (radius 1, height 1) with `segments` sides, scaled per mesh. */
export function unitCylinder(segments = 20) {
  let geometry = cylinders.get(segments);
  if (!geometry) {
    geometry = new CylinderGeometry(1, 1, 1, segments);
    cylinders.set(segments, geometry);
  }
  return geometry;
}

const roundedBoxes = new Map<string, BufferGeometry>();
/** A softly bevelled box in millimetres, cached by its dimensions. */
export function roundedBox(
  width: number,
  height: number,
  depth: number,
  radius: number,
  segments = 2
) {
  const key = `${width}|${height}|${depth}|${radius}|${segments}`;
  let geometry = roundedBoxes.get(key);
  if (!geometry) {
    geometry = new RoundedBoxGeometry(width, height, depth, segments, radius);
    roundedBoxes.set(key, geometry);
  }
  return geometry;
}

/**
 * Draws a texture once, on first use, at no more than 1024 px. Returns null
 * outside the browser, where there's no canvas to draw on.
 */
export function canvasTexture(
  width: number,
  height: number,
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void
) {
  let texture: CanvasTexture | null = null;
  return () => {
    if (texture || typeof document === "undefined") return texture;
    const canvas = document.createElement("canvas");
    canvas.width = Math.min(1024, width);
    canvas.height = Math.min(1024, height);
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    draw(ctx, canvas.width, canvas.height);
    texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    texture.anisotropy = 4;
    return texture;
  };
}
