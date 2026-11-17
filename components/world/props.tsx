"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  AdditiveBlending,
  CanvasTexture,
  Color,
  ConeGeometry,
  MeshPhysicalMaterial,
  Object3D,
  SRGBColorSpace,
  type InstancedMesh,
  type Points
} from "three";
import {
  roundedBox,
  unitBox,
  unitCylinder
} from "@/components/three/hardware/kit";
import {
  concreteColor,
  soilColor,
  softDot,
  woodColor
} from "@/components/world/textures";

/** Shared surface materials for the world's sets. */
let surfaces: ReturnType<typeof buildSurfaces> | null = null;
function buildSurfaces() {
  return {
    wood: new MeshPhysicalMaterial({
      map: woodColor(),
      roughness: 0.55,
      clearcoat: 0.35,
      clearcoatRoughness: 0.4
    }),
    woodDark: new MeshPhysicalMaterial({
      map: woodColor(),
      color: "#7a5a43",
      roughness: 0.5,
      clearcoat: 0.3
    }),
    concrete: new MeshPhysicalMaterial({
      map: concreteColor(),
      roughness: 0.92
    }),
    soil: new MeshPhysicalMaterial({ map: soilColor(), roughness: 1 }),
    ceramic: new MeshPhysicalMaterial({
      color: "#ece6dc",
      roughness: 0.35,
      clearcoat: 0.6
    }),
    leaf: new MeshPhysicalMaterial({
      color: "#4f7a45",
      roughness: 0.55,
      sheen: 0.5,
      sheenColor: new Color("#b9d99a"),
      side: 2
    }),
    fabric: new MeshPhysicalMaterial({
      color: "#d8cfc0",
      roughness: 0.9,
      sheen: 0.6,
      sheenColor: new Color("#ffffff")
    }),
    ink: new MeshPhysicalMaterial({
      color: "#1c1c1e",
      roughness: 0.45,
      clearcoat: 0.4
    }),
    steel: new MeshPhysicalMaterial({
      color: "#b7babf",
      metalness: 0.95,
      roughness: 0.3
    })
  };
}
export function surface() {
  surfaces ??= buildSurfaces();
  return surfaces;
}

/** A round set floor that fades into the fog at its edge. */
export function Ground({
  radius = 9,
  material = "concrete"
}: {
  radius?: number;
  material?: "concrete" | "wood";
}) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <circleGeometry args={[radius, 64]} />
      <primitive object={surface()[material]} attach="material" />
    </mesh>
  );
}

export function Desk({
  width = 1.4,
  depth = 0.7
}: {
  width?: number;
  depth?: number;
}) {
  const s = surface();
  return (
    <group>
      <mesh
        geometry={roundedBox(width, 0.035, depth, 0.008)}
        material={s.wood}
        position={[0, 0.74, 0]}
        castShadow
        receiveShadow
      />
      {[-1, 1].flatMap((x) =>
        [-1, 1].map((z) => (
          <mesh
            key={`${x}${z}`}
            geometry={unitCylinder(12)}
            material={s.steel}
            position={[x * (width / 2 - 0.06), 0.37, z * (depth / 2 - 0.06)]}
            scale={[0.018, 0.72, 0.018]}
            castShadow
          />
        ))
      )}
    </group>
  );
}

export function Chair() {
  const s = surface();
  return (
    <group>
      <mesh
        geometry={roundedBox(0.46, 0.06, 0.44, 0.02)}
        material={s.fabric}
        position={[0, 0.46, 0]}
        castShadow
      />
      <mesh
        geometry={roundedBox(0.44, 0.48, 0.05, 0.02)}
        material={s.fabric}
        position={[0, 0.74, -0.21]}
        rotation={[-0.08, 0, 0]}
        castShadow
      />
      <mesh
        geometry={unitCylinder(12)}
        material={s.steel}
        position={[0, 0.23, 0]}
        scale={[0.025, 0.42, 0.025]}
      />
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i / 5) * Math.PI * 2;
        return (
          <mesh
            key={i}
            geometry={roundedBox(0.28, 0.025, 0.04, 0.01)}
            material={s.ink}
            position={[Math.cos(a) * 0.14, 0.03, Math.sin(a) * 0.14]}
            rotation={[0, -a, 0]}
          />
        );
      })}
    </group>
  );
}

const scratch = new Object3D();
const leafGeometry = (() => {
  let g: ConeGeometry | null = null;
  return () => {
    g ??= new ConeGeometry(0.05, 0.28, 5, 1, true).translate(0, 0.14, 0);
    return g;
  };
})();

/**
 * A plant: a fan of instanced leaves on a pot. `seed` varies the arrangement
 * so a row of them doesn't read as copies.
 */
export function Plant({
  scale = 1,
  seed = 1,
  pot = true,
  sway = 1
}: {
  scale?: number;
  seed?: number;
  pot?: boolean;
  sway?: number;
}) {
  const ref = useRef<InstancedMesh>(null);
  const leaves = useMemo(() => {
    const out: { yaw: number; tilt: number; len: number; y: number }[] = [];
    for (let i = 0; i < 18; i++) {
      const r = Math.sin(seed * 97.3 + i * 12.9) * 0.5 + 0.5;
      out.push({
        yaw: i * 2.39996 + seed,
        tilt: 0.35 + r * 0.75,
        len: 0.75 + r * 0.6,
        y: 0.02 + (i / 18) * 0.12
      });
    }
    return out;
  }, [seed]);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    leaves.forEach((leaf, i) => {
      scratch.position.set(0, leaf.y, 0);
      scratch.rotation.set(leaf.tilt, leaf.yaw, 0, "YXZ");
      scratch.scale.set(1, leaf.len, 0.35);
      scratch.updateMatrix();
      mesh.setMatrixAt(i, scratch.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [leaves]);

  const group = useRef<Object3D>(null);
  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime() + seed;
    group.current.rotation.z = Math.sin(t * 0.9) * 0.025 * sway;
    group.current.rotation.x = Math.cos(t * 0.7) * 0.02 * sway;
  });

  const s = surface();
  return (
    <group scale={scale}>
      {pot ? (
        <>
          <mesh
            geometry={unitCylinder(24)}
            material={s.ceramic}
            position={[0, 0.11, 0]}
            scale={[0.12, 0.22, 0.12]}
            castShadow
            receiveShadow
          />
          <mesh
            geometry={unitCylinder(24)}
            material={s.soil}
            position={[0, 0.215, 0]}
            scale={[0.11, 0.01, 0.11]}
          />
        </>
      ) : null}
      <group ref={group} position={[0, pot ? 0.2 : 0, 0]}>
        <instancedMesh
          ref={ref}
          args={[leafGeometry(), s.leaf, leaves.length]}
          castShadow
        />
      </group>
    </group>
  );
}

/** Slow-drifting motes catching the light; the air in the room. */
export function Dust({
  count = 160,
  spread = [8, 4, 8],
  color = "#ffffff",
  size = 0.035,
  opacity = 0.5
}: {
  count?: number;
  spread?: [number, number, number];
  color?: string;
  size?: number;
  opacity?: number;
}) {
  const ref = useRef<Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = Math.sin(i * 12.9898) * 0.5 * spread[0];
      arr[i * 3 + 1] = (Math.sin(i * 78.233) * 0.5 + 0.5) * spread[1];
      arr[i * 3 + 2] = Math.sin(i * 37.719) * 0.5 * spread[2];
    }
    return arr;
  }, [count, spread]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.position.y = Math.sin(t * 0.15) * 0.15;
    ref.current.rotation.y = t * 0.012;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={softDot()}
        color={color}
        size={size}
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

/** Draws a canvas once and returns it as a texture, disposed with the owner. */
export function useCanvasTexture(
  width: number,
  height: number,
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void,
  deps: unknown[] = []
) {
  const texture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    draw(ctx, width, height);
    const t = new CanvasTexture(canvas);
    t.colorSpace = SRGBColorSpace;
    t.anisotropy = 4;
    return t;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  useLayoutEffect(() => () => texture?.dispose(), [texture]);
  return texture;
}

/** Rounded rectangle path helper for canvas UI art. */
export function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** A frosted, softly glowing panel: holograms, floating UI, chat bubbles. */
export function GlassPanel({
  width,
  height,
  map,
  glow = 1
}: {
  width: number;
  height: number;
  map: CanvasTexture | null;
  glow?: number;
}) {
  return (
    <mesh>
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial
        map={map}
        emissiveMap={map}
        emissive="#ffffff"
        emissiveIntensity={0.55 * glow}
        transparent
        opacity={0.94}
        roughness={0.2}
        side={2}
        toneMapped
      />
    </mesh>
  );
}

/** A bookshelf with instanced books in muted spines. */
export function Bookshelf({
  width = 2,
  rows = 5,
  seed = 3
}: {
  width?: number;
  rows?: number;
  seed?: number;
}) {
  const s = surface();
  const ref = useRef<InstancedMesh>(null);
  const books = useMemo(() => {
    const out: { x: number; y: number; w: number; h: number; tilt: number }[] =
      [];
    for (let row = 0; row < rows; row++) {
      let x = -width / 2 + 0.06;
      let i = 0;
      while (x < width / 2 - 0.1) {
        const r = Math.sin(seed * 31.7 + row * 9.1 + i * 3.7) * 0.5 + 0.5;
        const w = 0.025 + r * 0.03;
        const h = 0.2 + r * 0.1;
        const gap = r > 0.93 ? 0.12 : 0.003;
        out.push({
          x: x + w / 2,
          y: 0.05 + row * 0.38,
          w,
          h,
          tilt: r > 0.9 ? 0.18 : 0
        });
        x += w + gap;
        i++;
      }
    }
    return out;
  }, [width, rows, seed]);

  const colors = useMemo(() => {
    const palette = [
      "#6e1f24",
      "#2c3a4a",
      "#d9cfbd",
      "#3e4a3a",
      "#b8a07a",
      "#1d1c1b",
      "#8a8378",
      "#eb5a3c"
    ];
    return books.map(
      (_, i) => new Color(palette[(i * 7 + seed) % palette.length])
    );
  }, [books, seed]);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    books.forEach((b, i) => {
      scratch.position.set(b.x, b.y + b.h / 2, 0);
      scratch.rotation.set(0, 0, b.tilt);
      scratch.scale.set(b.w, b.h, 0.2);
      scratch.updateMatrix();
      mesh.setMatrixAt(i, scratch.matrix);
      mesh.setColorAt(i, colors[i]);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [books, colors]);

  const bookMaterial = useMemo(
    () => new MeshPhysicalMaterial({ roughness: 0.65, sheen: 0.3 }),
    []
  );
  useLayoutEffect(() => () => bookMaterial.dispose(), [bookMaterial]);

  return (
    <group>
      {Array.from({ length: rows + 1 }).map((_, row) => (
        <mesh
          key={row}
          geometry={roundedBox(width, 0.03, 0.26, 0.006)}
          material={s.woodDark}
          position={[0, 0.035 + row * 0.38, 0]}
          castShadow
          receiveShadow
        />
      ))}
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          geometry={roundedBox(0.035, rows * 0.38 + 0.06, 0.28, 0.008)}
          material={s.woodDark}
          position={[side * (width / 2), (rows * 0.38 + 0.06) / 2, 0]}
          castShadow
        />
      ))}
      <mesh
        geometry={unitBox()}
        material={s.woodDark}
        position={[0, (rows * 0.38) / 2, -0.13]}
        scale={[width, rows * 0.38 + 0.04, 0.01]}
      />
      <instancedMesh
        ref={ref}
        args={[unitBox(), bookMaterial, books.length]}
        castShadow
      />
    </group>
  );
}
