"use client";

import { useLayoutEffect, useRef } from "react";
import { Object3D, type Group, type InstancedMesh } from "three";
import { useModelInteraction } from "@/hooks/use-model-interaction";
import {
  canvasTexture,
  materials,
  MM,
  unitBox
} from "@/components/three/hardware/kit";
import { Box, Cylinder } from "@/components/three/hardware/parts";

/*
 * A 13-inch-class aluminium laptop, 304 x 212 mm, in millimetres. Origin is
 * the centre of the base's footprint at floor level; the hinge runs along
 * the -z edge and the lid opens toward the viewer.
 */

const W = 304;
const D = 212;
const BASE_H = 10;
const LID_T = 5;
const OPEN = 1.9; // radians from closed, about 109 degrees
const PITCH = 19;
const KEY = 16;

/** Key positions and sizes: [x, z, width, depth]. */
function keyLayout() {
  const keys: [number, number, number, number][] = [];
  const left = -6.5 * PITCH;
  // Function row: shallow keys.
  for (let i = 0; i < 14; i++) keys.push([left + i * PITCH, -86, KEY, 9]);
  // Three full rows of fourteen.
  for (const z of [-70, -51, -32]) {
    for (let i = 0; i < 14; i++) keys.push([left + i * PITCH, z, KEY, KEY]);
  }
  // Shift row: wide shifts either side of ten letters.
  keys.push([left + 0.75 * PITCH, -13, KEY + PITCH * 0.5, KEY]);
  for (let i = 0; i < 10; i++)
    keys.push([left + (2 + i) * PITCH, -13, KEY, KEY]);
  keys.push([left + 12.75 * PITCH, -13, KEY + PITCH * 0.5, KEY]);
  // Bottom row: modifiers, a long space bar, arrows.
  for (let i = 0; i < 3; i++) keys.push([left + i * PITCH, 6, KEY, KEY]);
  keys.push([-61.5, 6, 21, KEY]);
  keys.push([-10, 6, 78, KEY]);
  keys.push([41.5, 6, 21, KEY]);
  keys.push([66.5, 6, KEY, KEY]);
  keys.push([left + 11 * PITCH, 6, KEY, KEY]);
  keys.push([left + 12 * PITCH, 1.8, KEY, 7.6]);
  keys.push([left + 12 * PITCH, 10.2, KEY, 7.6]);
  keys.push([left + 13 * PITCH, 6, KEY, KEY]);
  return keys;
}
const KEYS = keyLayout();

/** The display: a quiet, mostly white page in the site's own palette. */
const screenArt = canvasTexture(1024, 640, (ctx, w, h) => {
  ctx.fillStyle = "#fbfaf8";
  ctx.fillRect(0, 0, w, h);

  // Nav: a mark and three quiet links.
  ctx.fillStyle = "#111110";
  ctx.beginPath();
  ctx.arc(72, 58, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(17,17,16,0.35)";
  [700, 790, 880].forEach((x) => ctx.fillRect(x, 54, 56, 8));
  ctx.fillStyle = "rgba(17,17,16,0.08)";
  ctx.fillRect(0, 102, w, 2);

  // Eyebrow, headline, copy.
  ctx.fillStyle = "#6e1f24";
  ctx.fillRect(72, 180, 170, 10);
  ctx.fillStyle = "rgba(17,17,16,0.86)";
  ctx.fillRect(72, 226, 560, 26);
  ctx.fillRect(72, 270, 420, 26);
  ctx.fillStyle = "rgba(17,17,16,0.22)";
  [334, 358, 382].forEach((y, i) => ctx.fillRect(72, y, [500, 540, 360][i], 8));

  // Buttons.
  ctx.fillStyle = "#111110";
  ctx.fillRect(72, 440, 132, 40);
  ctx.strokeStyle = "#111110";
  ctx.lineWidth = 2;
  ctx.strokeRect(218, 441, 118, 38);

  // A single coral accent.
  ctx.fillStyle = "#eb5a3c";
  ctx.beginPath();
  ctx.arc(860, 420, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(17,17,16,0.12)";
  ctx.fillRect(700, 520, 260, 2);
});

const scratch = new Object3D();

function Keyboard() {
  const ref = useRef<InstancedMesh>(null);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    KEYS.forEach(([x, z, kw, kd], i) => {
      scratch.position.set(x, BASE_H + 0.45, z);
      scratch.scale.set(kw, 0.9, kd);
      scratch.updateMatrix();
      mesh.setMatrixAt(i, scratch.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, []);

  return (
    <instancedMesh
      ref={ref}
      args={[unitBox(), materials().keycap, KEYS.length]}
    />
  );
}

export function LaptopModel({ scale = 1 }: { scale?: number }) {
  const groupRef = useRef<Group>(null);
  const baseScale = MM * scale;
  const screen = screenArt();

  const { handlePointerOver, handlePointerOut } = useModelInteraction(
    groupRef,
    { baseScale, hoverScale: 1.03 }
  );

  return (
    <group
      ref={groupRef}
      rotation={[0, -0.45, 0]}
      scale={baseScale}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* Unibody base, keyboard, trackpad. */}
      <Box
        size={[W, BASE_H, D]}
        at={[0, 0, 0]}
        material="aluminium"
        radius={3.5}
      />
      <Keyboard />
      <Box
        size={[124, 0.2, 78]}
        at={[0, BASE_H, 60]}
        material="aluminiumSoft"
      />
      <Cylinder
        radius={4.6}
        length={250}
        at={[0, BASE_H - 1.5, -D / 2 + 3]}
        material="graphite"
        axis="x"
      />

      {/* Lid, hinged at the back edge. Authored closed, lying forward along
          +z with the display facing down, then swung open. */}
      <group position={[0, BASE_H, -D / 2 + 2]} rotation={[-OPEN, 0, 0]}>
        <Box
          size={[W, LID_T, D]}
          at={[0, 0, D / 2]}
          material="aluminium"
          radius={2.4}
        />
        <Box
          size={[W - 4, 0.3, D - 4]}
          at={[0, -0.3, D / 2]}
          material="bezel"
        />
        {screen ? (
          <mesh position={[0, -0.36, D / 2 + 4]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[284, 177.5]} />
            <meshStandardMaterial
              color="#000000"
              emissive="#ffffff"
              emissiveMap={screen}
              emissiveIntensity={1.45}
              roughness={0.18}
              polygonOffset
              polygonOffsetFactor={-2}
            />
          </mesh>
        ) : null}
      </group>
    </group>
  );
}
