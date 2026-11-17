"use client";

import { useLayoutEffect, useRef } from "react";
import {
  Object3D,
  type InstancedMesh,
  type Material,
  type Texture
} from "three";
import {
  materials,
  roundedBox,
  unitBox,
  unitCylinder,
  type MaterialName
} from "@/components/three/hardware/kit";

type Vec3 = [number, number, number];

/**
 * Parts are placed by the centre of their *base*, in millimetres, so a
 * component sits on the board by giving it the board's top as its y.
 */

export function Box({
  size,
  at,
  material,
  radius = 0,
  rotation
}: {
  size: Vec3;
  at: Vec3;
  material: MaterialName;
  /** Edge bevel in mm. 0 uses the shared unit cube. */
  radius?: number;
  rotation?: Vec3;
}) {
  const [w, h, d] = size;
  const position: Vec3 = [at[0], at[1] + h / 2, at[2]];
  const mat = materials()[material];

  if (radius > 0) {
    return (
      <mesh
        geometry={roundedBox(w, h, d, radius)}
        material={mat}
        position={position}
        rotation={rotation}
      />
    );
  }
  return (
    <mesh
      geometry={unitBox()}
      material={mat}
      position={position}
      rotation={rotation}
      scale={size}
    />
  );
}

/** A cylinder standing on `at`, or lying along x/z when `axis` says so. */
export function Cylinder({
  radius,
  length,
  at,
  material,
  axis = "y",
  segments = 20
}: {
  radius: number;
  length: number;
  at: Vec3;
  material: MaterialName | Material;
  axis?: "x" | "y" | "z";
  segments?: number;
}) {
  const mat = typeof material === "string" ? materials()[material] : material;
  const rotation: Vec3 =
    axis === "x"
      ? [0, 0, Math.PI / 2]
      : axis === "z"
        ? [Math.PI / 2, 0, 0]
        : [0, 0, 0];
  // Standing cylinders sit on `at`; lying ones are centred on it.
  const position: Vec3 = axis === "y" ? [at[0], at[1] + length / 2, at[2]] : at;
  return (
    <mesh
      geometry={unitCylinder(segments)}
      material={mat}
      position={position}
      rotation={rotation}
      scale={[radius, length, radius]}
    />
  );
}

const scratch = new Object3D();

/**
 * Many identical small parts (header pins, keys, IC legs) in one draw call.
 * Each entry is the base centre of one copy.
 */
export function Instanced({
  size,
  items,
  material,
  radius = 0
}: {
  size: Vec3;
  items: Vec3[];
  material: MaterialName;
  radius?: number;
}) {
  const ref = useRef<InstancedMesh>(null);
  const geometry =
    radius > 0 ? roundedBox(size[0], size[1], size[2], radius) : unitBox();

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    items.forEach(([x, y, z], i) => {
      scratch.position.set(x, y + size[1] / 2, z);
      if (radius > 0) scratch.scale.set(1, 1, 1);
      else scratch.scale.set(size[0], size[1], size[2]);
      scratch.updateMatrix();
      mesh.setMatrixAt(i, scratch.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [items, size, radius]);

  return (
    <instancedMesh
      ref={ref}
      args={[geometry, materials()[material], items.length]}
    />
  );
}

/**
 * Silkscreen or label art laid flat on a surface. Lifted a hair above it and
 * polygon-offset so it never fights the surface below for depth.
 */
export function Decal({
  map,
  width,
  depth,
  y
}: {
  map: Texture | null;
  width: number;
  depth: number;
  y: number;
}) {
  if (!map) return null;
  return (
    <mesh position={[0, y + 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[width, depth]} />
      <meshStandardMaterial
        map={map}
        transparent
        depthWrite={false}
        polygonOffset
        polygonOffsetFactor={-2}
        roughness={0.6}
      />
    </mesh>
  );
}

/** A row of evenly spaced points, for headers and pin strips. */
export function row(
  count: number,
  pitch: number,
  start: Vec3,
  axis: "x" | "z" = "x"
): Vec3[] {
  return Array.from({ length: count }, (_, i) =>
    axis === "x"
      ? [start[0] + i * pitch, start[1], start[2]]
      : [start[0], start[1], start[2] + i * pitch]
  );
}
