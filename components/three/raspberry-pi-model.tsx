"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { useModelInteraction } from "@/hooks/use-model-interaction";
import { canvasTexture, materials, MM } from "@/components/three/hardware/kit";
import {
  Box,
  Cylinder,
  Decal,
  Instanced,
  row
} from "@/components/three/hardware/parts";

/*
 * Raspberry Pi 4-style single-board computer on its real 85 x 56 mm outline.
 * Origin is the centre of the footprint at floor level. The GPIO header runs
 * along the -z edge, USB and Ethernet stacks along +x, and the power, HDMI
 * and audio connectors along +z.
 */

const W = 85;
const D = 56;
const FEET = 2.4;
const PCB = 1.4;
const TOP = FEET + PCB;
const PITCH = 2.54;
const PORT_X = W / 2 + 2; // the stacks overhang the edge by ~2 mm

const GPIO_X = -10;
const GPIO_Z = -24.5;
const GPIO_PINS = [
  ...row(20, PITCH, [GPIO_X - 9.5 * PITCH, TOP, GPIO_Z - PITCH / 2]),
  ...row(20, PITCH, [GPIO_X - 9.5 * PITCH, TOP, GPIO_Z + PITCH / 2])
];

const HOLES: [number, number, number][] = [
  [-39, 0, -24.5],
  [-39, 0, 24.5],
  [19, 0, -24.5],
  [19, 0, 24.5]
];

const SMD: [number, number, number][] = [
  [-16, TOP, 8],
  [-14, TOP, 8],
  [3, TOP, 9],
  [3, TOP, 11],
  [-22, TOP, -6],
  [24, TOP, 4],
  [24, TOP, 6.5],
  [-28, TOP, 12]
];

const silkscreen = canvasTexture(1024, 675, (ctx, w, h) => {
  const px = (x: number) => ((x + W / 2) / W) * w;
  const py = (z: number) => ((z + D / 2) / D) * h;
  const mm = w / W;

  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "rgba(244, 247, 244, 0.9)";
  ctx.strokeStyle = "rgba(244, 247, 244, 0.75)";
  ctx.lineWidth = 0.3 * mm;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";

  ctx.font = `600 ${2.2 * mm}px sans-serif`;
  ctx.fillText("Pi 4 Model B", px(-26), py(4));
  ctx.font = `500 ${1.2 * mm}px sans-serif`;
  ctx.fillText("GPIO", px(GPIO_X), py(-20.4));
  ctx.fillText("POWER", px(-31.5), py(19.5));
  ctx.fillText("HDMI0", px(-17.6), py(19.5));
  ctx.fillText("HDMI1", px(-4.1), py(19.5));
  ctx.fillText("AUDIO", px(11.5), py(15.6));
  ctx.fillText("PWR", px(-36.6), py(19.5));
  ctx.fillText("ACT", px(-36.6), py(22));

  ctx.strokeRect(px(-15), py(-11), 18 * mm, 18 * mm);
  ctx.strokeRect(px(5.5), py(-10), 11 * mm, 16 * mm);
  ctx.strokeRect(px(-41.5), py(-27), 83 * mm, 54 * mm);
});

export function RaspberryPiModel({ scale = 1 }: { scale?: number }) {
  const groupRef = useRef<Group>(null);
  const base = MM * scale;

  const { handlePointerOver, handlePointerOut } = useModelInteraction(
    groupRef,
    { baseScale: base, hoverScale: 1.04 }
  );

  // The activity LED gets its own material so its pulse doesn't light every
  // other green LED on the page.
  const activity = useMemo(() => materials().ledGreen.clone(), []);
  useEffect(() => () => activity.dispose(), [activity]);

  // A soft, slightly irregular pulse: a board quietly working, not blinking.
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const wave = Math.max(0, Math.sin(t * 2.4) * Math.sin(t * 0.9 + 0.6));
    activity.emissiveIntensity = 0.25 + wave * 1.6;
  });

  return (
    <group
      ref={groupRef}
      rotation={[0, 0.35, 0]}
      scale={base}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {HOLES.map(([x, , z]) => (
        <group key={`${x}${z}`}>
          <Cylinder
            radius={2.6}
            length={FEET}
            at={[x, 0, z]}
            material="nickel"
            segments={12}
          />
          <Cylinder
            radius={3}
            length={0.06}
            at={[x, TOP, z]}
            material="gold"
            segments={20}
          />
          <Cylinder
            radius={1.4}
            length={0.1}
            at={[x, TOP, z]}
            material="hole"
            segments={16}
          />
        </group>
      ))}
      <Box
        size={[W, PCB, D]}
        at={[0, FEET, 0]}
        material="pcbGreen"
        radius={0.6}
      />
      <Decal map={silkscreen()} width={W} depth={D} y={TOP} />

      {/* SoC under its metal heat spreader, with the RAM beside it. */}
      <Box size={[15, 1.2, 15]} at={[-6, TOP, -2]} material="chip" />
      <Box
        size={[13, 0.8, 13]}
        at={[-6, TOP + 1.2, -2]}
        material="aluminium"
        radius={0.3}
      />
      <Box size={[10, 1, 14]} at={[11, TOP, -2]} material="chip" radius={0.2} />
      <Box
        size={[10.5, 1.4, 12]}
        at={[-30, TOP, -10]}
        material="nickel"
        radius={0.3}
      />
      <Box size={[7, 1, 7]} at={[20, TOP, 14]} material="chip" />
      <Box size={[6, 1, 6]} at={[20, TOP, -14]} material="chip" />
      <Instanced size={[1.6, 0.5, 0.8]} items={SMD} material="ceramic" />

      {/* USB 2, USB 3 and Ethernet along the +x edge. */}
      {[-18.5, -0.5].map((z) => (
        <group key={z}>
          <Box
            size={[17.5, 16, 13.2]}
            at={[PORT_X - 8.75, TOP, z]}
            material="nickel"
            radius={0.5}
          />
          <Box
            size={[0.4, 5.2, 10.4]}
            at={[PORT_X + 0.05, TOP + 1.8, z]}
            material="hole"
          />
          <Box
            size={[0.4, 5.2, 10.4]}
            at={[PORT_X + 0.05, TOP + 9, z]}
            material="hole"
          />
        </group>
      ))}
      <Box
        size={[21, 13.5, 16]}
        at={[PORT_X - 10.5, TOP, 17.5]}
        material="nickel"
        radius={0.5}
      />
      <Box
        size={[0.4, 8.6, 11.6]}
        at={[PORT_X + 0.05, TOP + 2.2, 17.5]}
        material="hole"
      />

      {/* Power, two micro-HDMI and audio along the +z edge. */}
      <Box
        size={[9, 3.3, 7.4]}
        at={[-31.5, TOP, 25.3]}
        material="nickel"
        radius={1.4}
      />
      <Box
        size={[7, 1.6, 0.4]}
        at={[-31.5, TOP + 0.85, 29.05]}
        material="hole"
      />
      {[-17.6, -4.1].map((x) => (
        <group key={x}>
          <Box
            size={[6.6, 3, 7.5]}
            at={[x, TOP, 25.2]}
            material="nickel"
            radius={0.6}
          />
          <Box size={[5, 1.4, 0.4]} at={[x, TOP + 0.8, 29]} material="hole" />
        </group>
      ))}
      <Box
        size={[7, 6, 12.5]}
        at={[11.5, TOP, 23.7]}
        material="blackPlastic"
        radius={0.8}
      />
      <Cylinder
        radius={3}
        length={1.6}
        at={[11.5, TOP + 3, 30.6]}
        material="blackPlastic"
        axis="z"
      />
      <Cylinder
        radius={1.75}
        length={0.3}
        at={[11.5, TOP + 3, 31.4]}
        material="hole"
        axis="z"
      />

      {/* Display connector on the short edge. */}
      <Box size={[3, 5.5, 22]} at={[-39.5, TOP, 6]} material="blackPlastic" />
      <Box size={[2, 0.8, 20]} at={[-39.5, TOP + 5.5, 6]} material="cream" />

      {/* 40-pin GPIO header. */}
      <Box
        size={[50.8, 2.5, 5.08]}
        at={[GPIO_X, TOP, GPIO_Z]}
        material="blackPlastic"
      />
      <Instanced size={[0.64, 8.5, 0.64]} items={GPIO_PINS} material="gold" />

      {/* Power LED steady, activity LED breathing. */}
      <Box size={[1.6, 0.7, 0.8]} at={[-40.5, TOP, 19.5]} material="maroon" />
      <mesh
        position={[-40.5, TOP + 0.35, 22]}
        scale={[1.6, 0.7, 0.8]}
        material={activity}
      >
        <boxGeometry />
      </mesh>
    </group>
  );
}
