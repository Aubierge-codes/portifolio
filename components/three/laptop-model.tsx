"use client";

import { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import type { Group, PointLight } from "three";
import { useModelInteraction } from "@/hooks/use-model-interaction";
import { MODEL_CALIBRATION, MODEL_PATHS, groundedPosition } from "@/components/three/model-config";

const CALIBRATION = MODEL_CALIBRATION.laptop;
const BASE_POSITION = groundedPosition(CALIBRATION);
// Approximate screen-panel position within the model's local bbox (upper,
// slightly toward the back where the display stands open) — the source
// file's materials were merged during optimization, so this is a soft light
// placed near the screen rather than an emissive material on it.
const SCREEN_LIGHT_POSITION: [number, number, number] = [-0.2, 2.1, -1.3];

export function LaptopModel() {
  const { scene } = useGLTF(MODEL_PATHS.laptop);
  const groupRef = useRef<Group>(null);
  const screenLightRef = useRef<PointLight>(null);

  const { handlePointerOver, handlePointerOut } = useModelInteraction(groupRef, {
    baseScale: CALIBRATION.scale,
    hoverScale: 1.03
  });

  return (
    <group
      ref={groupRef}
      position={BASE_POSITION}
      rotation={[0, -0.5, 0]}
      scale={CALIBRATION.scale}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <primitive object={scene} />
      <pointLight
        ref={screenLightRef}
        position={SCREEN_LIGHT_POSITION}
        intensity={0.5}
        color="#cfe8ff"
        distance={2.5}
        decay={2}
      />
    </group>
  );
}

useGLTF.preload(MODEL_PATHS.laptop);
