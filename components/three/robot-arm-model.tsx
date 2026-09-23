"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import type { Group } from "three";
import { useModelInteraction } from "@/hooks/use-model-interaction";
import { MODEL_CALIBRATION, MODEL_PATHS, groundedPosition } from "@/components/three/model-config";

const CALIBRATION = MODEL_CALIBRATION.robotArm;
const BASE_POSITION = groundedPosition(CALIBRATION);

export function RobotArmModel() {
  const { scene } = useGLTF(MODEL_PATHS.robotArm);
  const groupRef = useRef<Group>(null);
  const idleRef = useRef<Group>(null);

  const { handlePointerOver, handlePointerOut } = useModelInteraction(groupRef, {
    baseScale: CALIBRATION.scale,
    hoverScale: 1.03
  });

  // The joint hierarchy isn't semantically named in the source file, so
  // rather than guess at an individual segment, the whole rig gets one
  // slow, breathing-like sway — restrained idle presence, not a puppet show.
  useFrame(({ clock }) => {
    if (idleRef.current) {
      const t = clock.getElapsedTime();
      idleRef.current.rotation.y = Math.sin(t * 0.35) * 0.06;
      idleRef.current.position.y = Math.sin(t * 0.5) * 0.015;
    }
  });

  return (
    <group
      ref={groupRef}
      position={BASE_POSITION}
      scale={CALIBRATION.scale}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <group ref={idleRef}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

useGLTF.preload(MODEL_PATHS.robotArm);
