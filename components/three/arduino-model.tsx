"use client";

import { useRef } from "react";
import type { Group } from "three";
import { useModelInteraction } from "@/hooks/use-model-interaction";
import { canvasTexture, MM } from "@/components/three/hardware/kit";
import {
  Box,
  Cylinder,
  Decal,
  Instanced,
  row
} from "@/components/three/hardware/parts";

/*
 * Arduino UNO-style board, built in millimetres from its real 68.6 x 53.4 mm
 * outline. Origin is the centre of the footprint at floor level; +z is the
 * power/analog edge, -x the USB/barrel-jack edge.
 */

const W = 68.6;
const D = 53.4;
const FEET = 2.4;
const PCB = 1.6;
const TOP = FEET + PCB;
const PITCH = 2.54;

const DIGITAL_A = row(10, PITCH, [-17.3, TOP, -24.3]);
const DIGITAL_B = row(8, PITCH, [8.4, TOP, -24.3]);
const POWER = row(8, PITCH, [-12.5, TOP, 24.3]);
const ANALOG = row(6, PITCH, [11.5, TOP, 24.3]);
const HEADER_HOLES = [...DIGITAL_A, ...DIGITAL_B, ...POWER, ...ANALOG].map(
  ([x, , z]): [number, number, number] => [x, TOP + 8.5, z]
);

const DIGITAL_LABELS = [
  "SCL",
  "SDA",
  "AREF",
  "GND",
  "13",
  "12",
  "~11",
  "~10",
  "~9",
  "8",
  "7",
  "~6",
  "~5",
  "4",
  "~3",
  "2",
  "TX",
  "RX"
];

const CHIP_X = 12;
const CHIP_Z = 10;
const CHIP_LEGS = [
  ...row(14, PITCH, [CHIP_X - 6.5 * PITCH, TOP, CHIP_Z - 4.2]),
  ...row(14, PITCH, [CHIP_X - 6.5 * PITCH, TOP, CHIP_Z + 4.2])
];

const ICSP_PINS: [number, number, number][] = [
  [30.2, TOP, -PITCH],
  [30.2, TOP, 0],
  [30.2, TOP, PITCH],
  [32.7, TOP, -PITCH],
  [32.7, TOP, 0],
  [32.7, TOP, PITCH]
];

const SMD: [number, number, number][] = [
  [-10, TOP, -6],
  [-10, TOP, -3.5],
  [-14, TOP, 4],
  [2, TOP, 4],
  [4.5, TOP, 4],
  [25, TOP, -12],
  [25, TOP, -9.5],
  [-18, TOP, -16]
];

const FOOT_SPOTS: [number, number, number][] = [
  [-30, 0, -22],
  [-30, 0, 22],
  [30, 0, -22],
  [30, 0, 22]
];

/** White silkscreen: section labels, pin numbers and part outlines. */
const silkscreen = canvasTexture(1024, 797, (ctx, w, h) => {
  const px = (x: number) => ((x + W / 2) / W) * w;
  const py = (z: number) => ((z + D / 2) / D) * h;
  const mm = w / W;

  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "rgba(245, 248, 250, 0.92)";
  ctx.strokeStyle = "rgba(245, 248, 250, 0.85)";
  ctx.lineWidth = 0.35 * mm;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";

  ctx.font = `600 ${3.6 * mm}px sans-serif`;
  ctx.fillText("UNO", px(12), py(-4));
  ctx.font = `500 ${1.5 * mm}px sans-serif`;
  ctx.fillText("DIGITAL (PWM ~)", px(4), py(-19.5));
  ctx.fillText("POWER", px(-3.6), py(19.6));
  ctx.fillText("ANALOG IN", px(17.9), py(19.6));

  ctx.font = `500 ${1.05 * mm}px sans-serif`;
  [...DIGITAL_A, ...DIGITAL_B].forEach(([x], i) =>
    ctx.fillText(DIGITAL_LABELS[i], px(x), py(-21.2))
  );
  ["", "IOREF", "RST", "3V3", "5V", "GND", "GND", "VIN"].forEach((t, i) =>
    ctx.fillText(t, px(POWER[i][0]), py(21.4))
  );
  ANALOG.forEach(([x], i) => ctx.fillText(`A${i}`, px(x), py(21.4)));

  ctx.fillText("ON", px(21), py(6));
  ["L", "TX", "RX"].forEach((t, i) =>
    ctx.fillText(t, px(-9), py(-16 + i * 2.5))
  );
  ctx.fillText("ICSP", px(31.5), py(-6));
  ctx.fillText("RESET", px(-27), py(-17.6));

  // Component outlines.
  ctx.strokeRect(px(CHIP_X - 19), py(CHIP_Z - 5.6), 38 * mm, 11.2 * mm);
  ctx.strokeRect(px(28.8), py(-4.4), 5.4 * mm, 8.8 * mm);
  // A thin rule along the board edge, as on the real silkscreen.
  ctx.strokeRect(px(-33.2), py(-25.6), 66.4 * mm, 51.2 * mm);
});

export function ArduinoModel({ scale = 1 }: { scale?: number }) {
  const groupRef = useRef<Group>(null);
  const base = MM * scale;

  const { handlePointerOver, handlePointerOut } = useModelInteraction(
    groupRef,
    { baseScale: base, hoverScale: 1.04 }
  );

  return (
    <group
      ref={groupRef}
      rotation={[0, -0.35, 0]}
      scale={base}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {FOOT_SPOTS.map((at) => (
        <Cylinder
          key={at.join()}
          radius={2.3}
          length={FEET}
          at={at}
          material="rubber"
          segments={12}
        />
      ))}
      <Box
        size={[W, PCB, D]}
        at={[0, FEET, 0]}
        material="pcbBlue"
        radius={0.6}
      />
      <Decal map={silkscreen()} width={W} depth={D} y={TOP} />

      {/* USB-B, overhanging the edge, with its dark mouth. */}
      <Box
        size={[16, 10.9, 12]}
        at={[-32.5, TOP, -12]}
        material="nickel"
        radius={0.6}
      />
      <Box
        size={[0.4, 7.4, 8.4]}
        at={[-40.6, TOP + 1.8, -12]}
        material="hole"
      />
      {/* Barrel jack. */}
      <Box
        size={[14.2, 11, 9]}
        at={[-29, TOP, 16]}
        material="blackPlastic"
        radius={0.8}
      />
      <Cylinder
        radius={3.1}
        length={0.5}
        at={[-36.2, TOP + 5.8, 16]}
        material="hole"
        axis="x"
      />

      {/* ATmega328P in its socket. */}
      <Box
        size={[36, 1.4, 9.6]}
        at={[CHIP_X, TOP, CHIP_Z]}
        material="blackPlastic"
      />
      <Instanced size={[0.6, 3.2, 0.9]} items={CHIP_LEGS} material="tin" />
      <Box
        size={[35.2, 3.6, 7.4]}
        at={[CHIP_X, TOP + 1.4, CHIP_Z]}
        material="chip"
        radius={0.5}
      />
      <Cylinder
        radius={0.9}
        length={0.2}
        at={[CHIP_X - 15.5, TOP + 5, CHIP_Z]}
        material="hole"
        segments={12}
      />

      {/* USB interface chip, crystal, regulator, caps. */}
      <Box size={[5, 1, 5]} at={[-21, TOP, -3]} material="chip" />
      <Box
        size={[11, 3.6, 4.6]}
        at={[-2, TOP, -1]}
        material="nickel"
        radius={1.6}
      />
      <Box size={[6.5, 2.3, 6.5]} at={[-25.5, TOP, 4]} material="chip" />
      <Box size={[6.5, 0.4, 2.6]} at={[-25.5, TOP, 8.4]} material="tin" />
      <Cylinder
        radius={3.1}
        length={5.6}
        at={[-21, TOP, 15]}
        material="capSleeve"
      />
      <Cylinder
        radius={2.9}
        length={0.3}
        at={[-21, TOP + 5.6, 15]}
        material="nickel"
      />
      <Cylinder
        radius={3.1}
        length={5.6}
        at={[-13.5, TOP, 15]}
        material="capSleeve"
      />
      <Cylinder
        radius={2.9}
        length={0.3}
        at={[-13.5, TOP + 5.6, 15]}
        material="nickel"
      />
      <Instanced size={[1.6, 0.5, 0.8]} items={SMD} material="ceramic" />

      {/* Reset button with its accent cap. */}
      <Box
        size={[6, 3.1, 6]}
        at={[-27, TOP, -22]}
        material="nickel"
        radius={0.4}
      />
      <Cylinder
        radius={1.7}
        length={1}
        at={[-27, TOP + 3.1, -22]}
        material="maroon"
        segments={16}
      />

      {/* Status LEDs: power stays lit, the rest glow faintly. */}
      <Box size={[1.6, 0.7, 0.8]} at={[21, TOP, 3.5]} material="ledGreen" />
      {[0, 1, 2].map((i) => (
        <Box
          key={i}
          size={[1.6, 0.7, 0.8]}
          at={[-6, TOP, -16 + i * 2.5]}
          material="ledAmber"
        />
      ))}

      {/* Female headers along both long edges. */}
      <Box
        size={[25.4, 8.5, 2.54]}
        at={[-17.3 + 4.5 * PITCH, TOP, -24.3]}
        material="blackPlastic"
      />
      <Box
        size={[20.3, 8.5, 2.54]}
        at={[8.4 + 3.5 * PITCH, TOP, -24.3]}
        material="blackPlastic"
      />
      <Box
        size={[20.3, 8.5, 2.54]}
        at={[-12.5 + 3.5 * PITCH, TOP, 24.3]}
        material="blackPlastic"
      />
      <Box
        size={[15.24, 8.5, 2.54]}
        at={[11.5 + 2.5 * PITCH, TOP, 24.3]}
        material="blackPlastic"
      />
      <Instanced size={[1, 0.05, 1]} items={HEADER_HOLES} material="hole" />

      {/* ICSP: six bare pins on a plastic shroud. */}
      <Box
        size={[5.1, 2.5, 7.6]}
        at={[31.45, TOP, 0]}
        material="blackPlastic"
      />
      <Instanced size={[0.64, 8.5, 0.64]} items={ICSP_PINS} material="gold" />
    </group>
  );
}
