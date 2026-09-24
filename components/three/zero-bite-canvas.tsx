"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Vector3, type Group, type Mesh } from "three";
import { ThreeFrame } from "@/components/three/three-frame";
import { ZeroBiteScene } from "@/components/projects/scenes/zero-bite-scene";
import { Mannequin } from "@/components/three/mannequin";
import { Satellite } from "@/components/three/satellite";
import { Mosquito } from "@/components/three/mosquito";

/**
 * Mosquito flight: probing loops around the protected figure, deflected
 * whenever it reaches the shield radius. Layered fast/slow sine terms give the
 * hunting, jinking path mosquitoes actually fly — a smooth orbit would read as
 * a fly circling a lamp. The body is pointed along its own velocity each frame
 * so it always leads with the proboscis.
 */
function MosquitoFlight({
  offset = 0,
  radius = 1.2
}: {
  offset?: number;
  radius?: number;
}) {
  const ref = useRef<Group>(null);
  const previous = useRef(new Vector3());

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() + offset;

    // Wandering approach with higher-frequency jitter layered on top.
    let x = Math.sin(t * 1.1) * 1.35 + Math.sin(t * 5.3) * 0.08;
    let y = 0.75 + Math.sin(t * 1.7) * 0.4 + Math.sin(t * 6.1) * 0.05;
    let z = Math.cos(t * 0.9) * 1.35 + Math.cos(t * 4.7) * 0.08;

    const dx = x;
    const dy = y - 0.4;
    const dz = z;
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;

    if (dist < radius) {
      // Turned away at the boundary, with a small rebound each time.
      const push = radius - dist + Math.abs(Math.sin(t * 9)) * 0.08;
      x += (dx / dist) * push;
      y += (dy / dist) * push;
      z += (dz / dist) * push;
    }

    const next = new Vector3(x, y, z);
    // Face travel direction; falls back to the previous heading when nearly
    // stationary so the model never snaps to a default orientation.
    if (next.distanceToSquared(previous.current) > 1e-6) {
      ref.current.lookAt(next.clone().add(next.clone().sub(previous.current)));
    }
    previous.current.copy(next);
    ref.current.position.copy(next);
  });

  return (
    <group ref={ref}>
      <Mosquito scale={0.55} />
    </group>
  );
}

function Shield() {
  const shieldRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (shieldRef.current) {
      const t = clock.getElapsedTime();
      const material = shieldRef.current
        .material as import("three").MeshStandardMaterial;
      // Pulse effect on the shield
      material.opacity = 0.15 + Math.sin(t * 2) * 0.05;
    }
  });

  return (
    <mesh ref={shieldRef} position={[0, 0.4, 0]}>
      <sphereGeometry args={[1.2, 32, 32]} />
      <meshStandardMaterial
        color="#88ccff"
        transparent
        opacity={0.2}
        roughness={0.1}
        metalness={0.1}
        depthWrite={false}
      />
    </mesh>
  );
}

function Terrain() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
      <planeGeometry args={[8, 8, 12, 12]} />
      <meshStandardMaterial
        color="#ffffff"
        wireframe
        transparent
        opacity={0.15}
      />
    </mesh>
  );
}

export function ZeroBiteCanvas() {
  return (
    <ThreeFrame className="h-52 md:h-64" fallback={<ZeroBiteScene />}>
      <Terrain />

      {/* Human shielded in the center */}
      <group position={[0, -0.1, 0]} rotation={[0, 0.4, 0]}>
        <Mannequin pose="idle" look={0.5} />
      </group>

      <Shield />

      {/* Mosquitoes trying to get in */}
      <MosquitoFlight offset={0} radius={1.25} />
      <MosquitoFlight offset={4.2} radius={1.25} />
      <MosquitoFlight offset={8.5} radius={1.25} />

      {/* Satellite in the sky */}
      <group position={[0, 2, -1]} scale={0.6}>
        <Satellite />
      </group>
    </ThreeFrame>
  );
}
