"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import type { Group, Mesh, MeshStandardMaterial } from "three";
import { useModelInteraction } from "@/hooks/use-model-interaction";
import { MODEL_CALIBRATION, MODEL_PATHS, groundedPosition } from "@/components/three/model-config";

const CALIBRATION = MODEL_CALIBRATION.arduino;
const BASE_POSITION = groundedPosition(CALIBRATION);
const LED_COLOR = "#3ddc6a";

export function ArduinoModel() {
  const { scene } = useGLTF(MODEL_PATHS.arduino);
  const groupRef = useRef<Group>(null);
  const ledRef = useRef<Mesh>(null);

  const { handlePointerOver, handlePointerOut } = useModelInteraction(groupRef, {
    baseScale: CALIBRATION.scale,
    hoverScale: 1.04
  });

  // A restrained, steady power-LED pulse rather than a blinking indicator —
  // real Arduino boards keep this LED on solid, with only a faint breathing
  // variation so it doesn't read as "flashing."
  useFrame(({ clock }) => {
    const material = ledRef.current?.material as MeshStandardMaterial | undefined;
    if (material) {
      material.emissiveIntensity = 1.1 + Math.sin(clock.getElapsedTime() * 1.4) * 0.25;
    }
  });

  return (
    <group
      ref={groupRef}
      position={BASE_POSITION}
      rotation={[0, -0.35, 0]}
      scale={CALIBRATION.scale}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <primitive object={scene} />
      <mesh ref={ledRef} position={[0.22, 0.11, -0.32]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial
          color={LED_COLOR}
          emissive={LED_COLOR}
          emissiveIntensity={1.1}
        />
      </mesh>
    </group>
  );
}

useGLTF.preload(MODEL_PATHS.arduino);
