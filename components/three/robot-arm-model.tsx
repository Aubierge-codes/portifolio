"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import type { Group } from "three";
import { useModelInteraction } from "@/hooks/use-model-interaction";
import { useGroundedModel } from "@/hooks/use-grounded-model";
import {
  MODEL_CALIBRATION,
  MODEL_PATHS
} from "@/components/three/model-config";

const CALIBRATION = MODEL_CALIBRATION.robotArm;

export function RobotArmModel() {
  const { scene } = useGLTF(MODEL_PATHS.robotArm);
  const groupRef = useRef<Group>(null);
  const innerRef = useRef<Group>(null);
  const idleRef = useRef<Group>(null);

  const { handlePointerOver, handlePointerOut } = useModelInteraction(
    groupRef,
    {
      baseScale: CALIBRATION.scale,
      hoverScale: 1.03
    }
  );

  useGroundedModel(groupRef, innerRef, [scene]);

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
      rotation={[0, Math.PI / 2, 0]}
      scale={CALIBRATION.scale}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <group ref={innerRef}>
        <group ref={idleRef}>
          <primitive object={scene} />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload(MODEL_PATHS.robotArm);
