"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { LatheGeometry, Vector2, type Group } from "three";
import { useModelInteraction } from "@/hooks/use-model-interaction";
import { materials, MM } from "@/components/three/hardware/kit";
import { Box, Cylinder } from "@/components/three/hardware/parts";

/*
 * A small four-axis desktop arm, in millimetres. Origin is the centre of the
 * base at floor level; the arm reaches toward -x, back along the signal path
 * to the boards beside it.
 *
 * Joint chain: base yaw -> shoulder pitch -> elbow pitch -> wrist pitch ->
 * two-finger gripper. Every joint pivots about its local z axis.
 */

const BASE_H = 16;
const TURRET_H = 18;
const SHOULDER_Y = BASE_H + TURRET_H + 18;
const UPPER = 120;
const FORE = 100;

let baseGeometry: LatheGeometry | null = null;
function base() {
  baseGeometry ??= new LatheGeometry(
    [
      new Vector2(0, 0),
      new Vector2(62, 0),
      new Vector2(62.5, 3),
      new Vector2(60, 8),
      new Vector2(52, 13),
      new Vector2(44, BASE_H),
      new Vector2(0, BASE_H)
    ],
    48
  );
  return baseGeometry;
}

export function RobotArmModel({ scale = 1 }: { scale?: number }) {
  const groupRef = useRef<Group>(null);
  const turret = useRef<Group>(null);
  const shoulder = useRef<Group>(null);
  const elbow = useRef<Group>(null);
  const wrist = useRef<Group>(null);
  const fingerA = useRef<Group>(null);
  const fingerB = useRef<Group>(null);
  const baseScale = MM * scale;

  const { handlePointerOver, handlePointerOut } = useModelInteraction(
    groupRef,
    { baseScale, hoverScale: 1.03 }
  );

  // A slow pick-and-place loop: each joint drifts on its own period so the
  // motion never visibly repeats, and the gripper opens and closes softly.
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (turret.current) turret.current.rotation.y = Math.sin(t * 0.32) * 0.35;
    if (shoulder.current)
      shoulder.current.rotation.z = 0.3 + Math.sin(t * 0.5) * 0.12;
    if (elbow.current)
      elbow.current.rotation.z = 1.3 + Math.sin(t * 0.5 + 0.8) * 0.15;
    if (wrist.current)
      wrist.current.rotation.z = 0.45 + Math.sin(t * 0.7 + 1.6) * 0.18;
    const gap = 4 + (Math.sin(t * 0.9) * 0.5 + 0.5) * 6;
    if (fingerA.current) fingerA.current.position.x = gap;
    if (fingerB.current) fingerB.current.position.x = -gap;
  });

  return (
    <group
      ref={groupRef}
      scale={baseScale}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <mesh geometry={base()} material={materials().graphite} />

      <group ref={turret} position={[0, BASE_H, 0]}>
        <Cylinder
          radius={40}
          length={TURRET_H}
          at={[0, 0, 0]}
          material="shell"
          segments={40}
        />
        <Cylinder
          radius={40.6}
          length={2}
          at={[0, TURRET_H - 5, 0]}
          material="maroon"
          segments={40}
        />
        <Box
          size={[34, 20, 30]}
          at={[0, TURRET_H, 0]}
          material="shell"
          radius={4}
        />

        <group ref={shoulder} position={[0, SHOULDER_Y - BASE_H, 0]}>
          <Cylinder
            radius={19}
            length={44}
            at={[0, 0, 0]}
            material="graphite"
            axis="z"
            segments={32}
          />
          <Box
            size={[26, UPPER, 22]}
            at={[0, 0, 0]}
            material="shell"
            radius={6}
          />

          <group ref={elbow} position={[0, UPPER, 0]}>
            <Cylinder
              radius={15}
              length={34}
              at={[0, 0, 0]}
              material="graphite"
              axis="z"
              segments={28}
            />
            <Box
              size={[21, FORE, 17]}
              at={[0, 0, 0]}
              material="shell"
              radius={5}
            />

            <group ref={wrist} position={[0, FORE, 0]}>
              <Cylinder
                radius={11}
                length={26}
                at={[0, 0, 0]}
                material="graphite"
                axis="z"
                segments={24}
              />
              <Box
                size={[30, 12, 16]}
                at={[0, 6, 0]}
                material="graphite"
                radius={2.5}
              />
              <group ref={fingerA} position={[7, 18, 0]}>
                <Box
                  size={[4, 24, 11]}
                  at={[0, 0, 0]}
                  material="graphite"
                  radius={1.2}
                />
                <Box size={[1.2, 12, 9]} at={[-2.4, 10, 0]} material="rubber" />
              </group>
              <group ref={fingerB} position={[-7, 18, 0]}>
                <Box
                  size={[4, 24, 11]}
                  at={[0, 0, 0]}
                  material="graphite"
                  radius={1.2}
                />
                <Box size={[1.2, 12, 9]} at={[2.4, 10, 0]} material="rubber" />
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}
