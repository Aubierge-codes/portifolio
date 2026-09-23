"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import type { Group, Mesh, MeshStandardMaterial } from "three";
import { useModelInteraction } from "@/hooks/use-model-interaction";
import { MODEL_CALIBRATION, MODEL_PATHS, groundedPosition } from "@/components/three/model-config";

const CALIBRATION = MODEL_CALIBRATION.raspberryPi;
const BASE_POSITION = groundedPosition(CALIBRATION);
const ACTIVITY_COLOR = "#e8483c";

export function RaspberryPiModel() {
  const { scene } = useGLTF(MODEL_PATHS.raspberryPi);
  const groupRef = useRef<Group>(null);
  const ledRef = useRef<Mesh>(null);

  const { handlePointerOver, handlePointerOut } = useModelInteraction(groupRef, {
    baseScale: CALIBRATION.scale,
    hoverScale: 1.04
  });

  // Faint activity-LED flicker — an edge-computing board reading sensors,
  // not a disco light. Irregular but small, never a hard on/off blink.
  useFrame(({ clock }) => {
    const material = ledRef.current?.material as MeshStandardMaterial | undefined;
    if (material) {
      const t = clock.getElapsedTime();
      material.emissiveIntensity = 0.6 + Math.max(0, Math.sin(t * 3.1) * Math.sin(t * 0.7)) * 0.9;
    }
  });

  return (
    <group
      ref={groupRef}
      position={BASE_POSITION}
      rotation={[0, 0.3, 0]}
      scale={CALIBRATION.scale}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
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
  );
}

useGLTF.preload(MODEL_PATHS.raspberryPi);
