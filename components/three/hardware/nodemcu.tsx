"use client";

import { MM } from "@/components/three/hardware/kit";
import {
  Box,
  Cylinder,
  Instanced,
  row
} from "@/components/three/hardware/parts";

/*
 * NodeMCU ESP-12E (v1.0) and a piezoelectric disc, in millimetres, resting on
 * y = 0, centred. Both are simple, well-documented parts, so they're built
 * procedurally rather than downloaded (ASSET_INVENTORY.md §7).
 */

const W = 49;
const D = 26;
const PCB = 1.6;
const PINS_A = row(15, 2.54, [-17.78, -8.5, -11.4]);
const PINS_B = row(15, 2.54, [-17.78, -8.5, 11.4]);

/** NodeMCU ESP-12E dev board: ESP-12E module with its shield and antenna. */
export function NodeMcu({ scale = 1 }: { scale?: number }) {
  return (
    <group scale={MM * scale}>
      {/* Lifted so it stands on its pins, as it would on a bench. */}
      <group position={[0, 8.5, 0]}>
        {/* Header pins point down through the board. */}
        <Instanced
          size={[0.64, 8.5, 0.64]}
          items={[...PINS_A, ...PINS_B]}
          material="gold"
        />
        <Box
          size={[W, PCB, D]}
          at={[0, 0, 0]}
          material="blackPlastic"
          radius={0.6}
        />
        {/* ESP-12E module: blue PCB, metal can, zig-zag antenna at the end. */}
        <Box
          size={[24, 0.8, 16]}
          at={[6, PCB, 0]}
          material="pcbBlue"
          radius={0.3}
        />
        <Box
          size={[15, 2.4, 12]}
          at={[3.5, PCB + 0.8, 0]}
          material="nickel"
          radius={0.4}
        />
        {[0, 1, 2, 3].map((i) => (
          <Box
            key={i}
            size={[0.5, 0.06, 12]}
            at={[13.2 + i * 1.6, PCB + 0.8, 0]}
            material="gold"
          />
        ))}
        {/* USB-to-serial chip, regulator, micro-USB, RST/FLASH buttons. */}
        <Box size={[5, 1, 5]} at={[-11, PCB, 0]} material="chip" />
        <Box size={[4, 1.6, 3]} at={[-17, PCB, -6]} material="chip" />
        <Box
          size={[6, 2.6, 7.5]}
          at={[-22.6, PCB, 0]}
          material="nickel"
          radius={0.6}
        />
        {[-7, 7].map((z) => (
          <group key={z}>
            <Box
              size={[3.5, 1.2, 3.5]}
              at={[-18, PCB, z]}
              material="nickel"
              radius={0.3}
            />
            <Cylinder
              radius={1.1}
              length={0.8}
              at={[-18, PCB + 1.2, z]}
              material="blackPlastic"
              segments={14}
            />
          </group>
        ))}
        <Box size={[1.4, 0.6, 0.8]} at={[-6, PCB, 9]} material="ledAmber" />
      </group>
    </group>
  );
}

/** A 27 mm piezo disc: brass plate, ceramic layer, silvered electrode. */
export function PiezoDisc({ scale = 1 }: { scale?: number }) {
  return (
    <group scale={MM * scale}>
      <Cylinder
        radius={13.5}
        length={0.22}
        at={[0, 0, 0]}
        material="gold"
        segments={40}
      />
      <Cylinder
        radius={10}
        length={0.22}
        at={[0, 0.22, 0]}
        material="cream"
        segments={36}
      />
      <Cylinder
        radius={9.2}
        length={0.04}
        at={[0, 0.44, 0]}
        material="tin"
        segments={36}
      />
    </group>
  );
}
