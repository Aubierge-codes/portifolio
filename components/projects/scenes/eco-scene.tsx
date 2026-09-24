"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import type { Group, Mesh, MeshStandardMaterial } from "three";
import { ThreeFrame } from "@/components/three/three-frame";
import { Mannequin, walkSpeedFor } from "@/components/three/mannequin";

const CYCLE = 18;
/** Where litter sits, and when the collector reaches each piece. */
const LITTER = [
  { x: -1.5, z: 0.35, at: 2.6 },
  { x: -0.55, z: -0.15, at: 6.2 },
  { x: 0.5, z: 0.3, at: 9.8 },
  { x: 1.35, z: -0.1, at: 13.4 }
];
const BIN_X = 2.1;
const WALK_SPEED = 0.62;

function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.4, 8]} />
        <meshStandardMaterial color="#4A3B32" roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.6, 0]}>
        <coneGeometry args={[0.3, 0.6, 8]} />
        <meshStandardMaterial color="#2E4A28" roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.8, 0]}>
        <coneGeometry args={[0.25, 0.5, 8]} />
        <meshStandardMaterial color="#3A5F33" roughness={0.95} />
      </mesh>
    </group>
  );
}

/** Collection bin; its fill rises one step per piece picked up. */
function Bin({ fillRef }: { fillRef: React.RefObject<Mesh | null> }) {
  return (
    <group position={[BIN_X, 0, 0]}>
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.17, 0.14, 0.36, 12, 1, true]} />
        <meshStandardMaterial color="#2f3a33" roughness={0.9} side={2} />
      </mesh>
      <mesh ref={fillRef} position={[0, 0.06, 0]} scale={[1, 0.01, 1]}>
        <cylinderGeometry args={[0.15, 0.13, 0.3, 12]} />
        <meshStandardMaterial color="#6E1F24" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.375, 0]}>
        <torusGeometry args={[0.165, 0.014, 6, 16]} />
        <meshStandardMaterial color="#1f2723" roughness={0.8} />
      </mesh>
    </group>
  );
}

function Cleanup() {
  const collector = useRef<Group>(null);
  const litterRefs = useRef<(Mesh | null)[]>([]);
  const fill = useRef<Mesh>(null);
  const [picking, setPicking] = useState(false);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() % CYCLE;

    // Walk from piece to piece, then carry the last one to the bin.
    let targetX = LITTER[0].x;
    let collected = 0;
    for (const piece of LITTER) {
      if (t >= piece.at) collected += 1;
    }
    if (collected === 0) {
      targetX = LITTER[0].x;
    } else if (collected < LITTER.length) {
      targetX = LITTER[collected].x;
    } else {
      targetX = BIN_X - 0.45;
    }

    if (collector.current) {
      const current = collector.current.position.x;
      const step = Math.sign(targetX - current) * WALK_SPEED * 0.016;
      collector.current.position.x =
        Math.abs(targetX - current) < 0.02 ? targetX : current + step;
      // Face the direction of travel.
      collector.current.rotation.y =
        targetX >= current ? Math.PI / 2 : -Math.PI / 2;
    }

    // A piece disappears as she reaches it; all of them return on reset.
    let anyPicking = false;
    LITTER.forEach((piece, i) => {
      const mesh = litterRefs.current[i];
      if (!mesh) return;
      const gone = t >= piece.at;
      const material = mesh.material as MeshStandardMaterial;
      const fade = gone ? Math.max(0, 1 - (t - piece.at) * 3) : 1;
      material.opacity = fade;
      mesh.visible = fade > 0.01;
      if (gone && t - piece.at < 0.7) anyPicking = true;
    });
    if (anyPicking !== picking) setPicking(anyPicking);

    // Bin fills as the ground clears.
    if (fill.current) {
      const target = collected / LITTER.length;
      fill.current.scale.y = Math.max(0.01, target);
      fill.current.position.y = 0.06 + (target * 0.3) / 2 - 0.15 * 0.01;
    }
  });

  return (
    <group position={[0, -0.62, 0]}>
      <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6, 0.012]} />
        <meshStandardMaterial color="#111110" />
      </mesh>

      <Tree position={[-2.1, 0, -1]} />
      <Tree position={[1.1, 0, -1.1]} />

      {LITTER.map((piece, i) => (
        <mesh
          key={piece.x}
          ref={(el) => {
            litterRefs.current[i] = el;
          }}
          position={[piece.x, 0.035, piece.z]}
          rotation={[0.4, i * 1.1, 0.2]}
        >
          <dodecahedronGeometry args={[0.055, 0]} />
          <meshStandardMaterial
            color={i % 2 ? "#8d9299" : "#b9a88f"}
            roughness={1}
            transparent
          />
        </mesh>
      ))}

      <Bin fillRef={fill} />

      <group ref={collector} position={[LITTER[0].x, 0, 0.3]} scale={0.72}>
        <Mannequin
          pose={picking ? "reach" : "walk"}
          hair="bun"
          outfit="sand"
          accent
          speed={walkSpeedFor(WALK_SPEED)}
        />
      </group>
    </group>
  );
}

export function EcoScene() {
  return (
    <ThreeFrame
      className="h-44 md:h-52"
      fallback={<div className="h-full w-full bg-paper" />}
    >
      <Cleanup />
    </ThreeFrame>
  );
}
