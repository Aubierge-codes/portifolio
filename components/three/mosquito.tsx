"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group, Mesh } from "three";

const BODY = "#241c18";
const LIMB = "#2f2622";
const WING = "#cfd6dc";

/**
 * A mosquito, not a generic bug. The silhouette carries the recognition, so
 * the parts that actually distinguish Culicidae are the ones modelled:
 * a needle proboscis as long as the head and thorax together, a slender
 * abdomen carried at a raised angle, long narrow wings, and — most of all —
 * six very long legs with the hind pair trailing far behind the body. Drop
 * the legs or shorten the proboscis and it reads as a housefly instead.
 *
 * Built forward along +Z so the whole insect can be pointed along its
 * velocity by the flight rig.
 */

function Leg({
  origin,
  yaw,
  spread,
  drop,
  length,
  phase
}: {
  origin: [number, number, number];
  yaw: number;
  spread: number;
  drop: number;
  length: number;
  phase: number;
}) {
  const ref = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    // Legs hang passively and trail the body's motion rather than striding.
    const t = clock.getElapsedTime();
    ref.current.rotation.z = spread + Math.sin(t * 2.1 + phase) * 0.05;
  });

  return (
    <group position={origin} rotation={[0, yaw, 0]}>
      <group ref={ref} rotation={[0, 0, spread]}>
        {/* femur */}
        <mesh position={[0, -length * 0.25, 0]}>
          <cylinderGeometry args={[0.005, 0.004, length * 0.5, 5]} />
          <meshStandardMaterial color={LIMB} roughness={0.9} />
        </mesh>
        {/* tibia + tarsus, kinked outward at the knee like the real thing */}
        <group position={[0, -length * 0.5, 0]} rotation={[0, 0, -drop]}>
          <mesh position={[0, -length * 0.3, 0]}>
            <cylinderGeometry args={[0.0035, 0.002, length * 0.6, 5]} />
            <meshStandardMaterial color={LIMB} roughness={0.9} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

function Wing({ side, phase }: { side: 1 | -1; phase: number }) {
  const ref = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    // Fast enough to blur into a haze rather than read as flapping panels.
    const beat = Math.sin(clock.getElapsedTime() * 52 + phase);
    ref.current.rotation.x = beat * 0.75;
    ref.current.rotation.y = side * (0.35 + beat * 0.12);
  });

  return (
    <group ref={ref} position={[side * 0.035, 0.035, -0.02]}>
      {/* Long and narrow — mosquito wings are strap-like, not broad ovals. */}
      <mesh position={[side * 0.11, 0, -0.1]} rotation={[0, 0, side * 0.1]}>
        <planeGeometry args={[0.055, 0.34]} />
        <meshStandardMaterial
          color={WING}
          transparent
          opacity={0.28}
          roughness={0.5}
          side={2}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

export function Mosquito({ scale = 1 }: { scale?: number }) {
  const abdomen = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (!abdomen.current) return;
    // Slight abdominal pulse; keeps the body from reading as one rigid prop.
    abdomen.current.rotation.x =
      -0.38 + Math.sin(clock.getElapsedTime() * 3.4) * 0.02;
  });

  return (
    <group scale={scale}>
      {/* thorax */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <capsuleGeometry args={[0.035, 0.05, 6, 10]} />
        <meshStandardMaterial color={BODY} roughness={0.75} />
      </mesh>

      {/* head */}
      <group position={[0, 0.004, 0.072]}>
        <mesh>
          <sphereGeometry args={[0.027, 12, 12]} />
          <meshStandardMaterial color={BODY} roughness={0.7} />
        </mesh>
        {/* compound eyes */}
        <mesh position={[0.018, 0.004, 0.006]}>
          <sphereGeometry args={[0.013, 8, 8]} />
          <meshStandardMaterial color="#0d0b0a" roughness={0.35} />
        </mesh>
        <mesh position={[-0.018, 0.004, 0.006]}>
          <sphereGeometry args={[0.013, 8, 8]} />
          <meshStandardMaterial color="#0d0b0a" roughness={0.35} />
        </mesh>
        {/* proboscis — the giveaway feature, deliberately long and straight */}
        <mesh position={[0, -0.006, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.0035, 0.0015, 0.2, 6]} />
          <meshStandardMaterial color={LIMB} roughness={0.8} />
        </mesh>
        {/* antennae */}
        {[1, -1].map((s) => (
          <mesh
            key={s}
            position={[s * 0.012, 0.018, 0.05]}
            rotation={[1.2, 0, s * 0.35]}
          >
            <cylinderGeometry args={[0.0018, 0.001, 0.085, 4]} />
            <meshStandardMaterial color={LIMB} roughness={0.9} />
          </mesh>
        ))}
      </group>

      {/* abdomen, tapered and carried nose-up at an angle */}
      <mesh ref={abdomen} position={[0, 0.03, -0.11]} rotation={[-0.38, 0, 0]}>
        <coneGeometry args={[0.028, 0.24, 10]} />
        <meshStandardMaterial color={BODY} roughness={0.8} />
      </mesh>

      <Wing side={1} phase={0} />
      <Wing side={-1} phase={Math.PI} />

      {/* Six legs: front pair reaching forward, mid pair out, hind pair
          trailing well past the abdomen — the classic dangling posture. */}
      <Leg
        origin={[0.03, -0.01, 0.045]}
        yaw={0.5}
        spread={0.75}
        drop={0.9}
        length={0.3}
        phase={0}
      />
      <Leg
        origin={[-0.03, -0.01, 0.045]}
        yaw={-0.5}
        spread={-0.75}
        drop={-0.9}
        length={0.3}
        phase={1}
      />
      <Leg
        origin={[0.035, -0.012, 0]}
        yaw={0.1}
        spread={1.05}
        drop={0.75}
        length={0.34}
        phase={2}
      />
      <Leg
        origin={[-0.035, -0.012, 0]}
        yaw={-0.1}
        spread={-1.05}
        drop={-0.75}
        length={0.34}
        phase={3}
      />
      <Leg
        origin={[0.03, -0.01, -0.04]}
        yaw={-0.55}
        spread={1.15}
        drop={0.5}
        length={0.42}
        phase={4}
      />
      <Leg
        origin={[-0.03, -0.01, -0.04]}
        yaw={0.55}
        spread={-1.15}
        drop={-0.5}
        length={0.42}
        phase={5}
      />
    </group>
  );
}
