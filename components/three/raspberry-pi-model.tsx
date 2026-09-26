"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import type { Group, Mesh, MeshStandardMaterial } from "three";
import { useModelInteraction } from "@/hooks/use-model-interaction";
import { useGroundedModel } from "@/hooks/use-grounded-model";
import { MODEL_PATHS, MODEL_SCALE } from "@/components/three/model-config";

const SCALE = MODEL_SCALE.raspberryPi;
const ACTIVITY_COLOR = "#e8483c";

export function RaspberryPiModel() {
  const { scene } = useGLTF(MODEL_PATHS.raspberryPi);
  const groupRef = useRef<Group>(null);
  const innerRef = useRef<Group>(null);
  const ledRef = useRef<Mesh>(null);

  const { handlePointerOver, handlePointerOut } = useModelInteraction(
    groupRef,
    {
      baseScale: SCALE,
      hoverScale: 1.04
    }
  );

  // This export has a tilt baked into its node, so the board lands on edge;
  // auto-leveling fits its plane and lays it flat.
  useGroundedModel(groupRef, innerRef, [scene], { autoLevel: true });

  // Faint activity-LED flicker — an edge-computing board reading sensors,
  // not a disco light. Irregular but small, never a hard on/off blink.
  useFrame(({ clock }) => {
    const material = ledRef.current?.material as
      MeshStandardMaterial | undefined;
    if (material) {
      const t = clock.getElapsedTime();
      material.emissiveIntensity =
        0.6 + Math.max(0, Math.sin(t * 3.1) * Math.sin(t * 0.7)) * 0.9;
    }
  });

  return (
    <group
      ref={groupRef}
      rotation={[0, 0.35, 0]}
      scale={SCALE}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <group ref={innerRef}>
        <primitive object={scene} />
        <mesh ref={ledRef} position={[-40, 16, 30]}>
          <sphereGeometry args={[1.6, 8, 8]} />
          <meshStandardMaterial
            color={ACTIVITY_COLOR}
            emissive={ACTIVITY_COLOR}
            emissiveIntensity={0.6}
          />
        </mesh>
      </group>
    </group>
  );
}

useGLTF.preload(MODEL_PATHS.raspberryPi);
