"use client";

import { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import type { Group } from "three";
import { useModelInteraction } from "@/hooks/use-model-interaction";
import { useGroundedModel } from "@/hooks/use-grounded-model";
import { MODEL_PATHS, MODEL_SCALE } from "@/components/three/model-config";

const SCALE = MODEL_SCALE.arduino;

export function ArduinoModel() {
  const { scene } = useGLTF(MODEL_PATHS.arduino);
  const groupRef = useRef<Group>(null);
  const innerRef = useRef<Group>(null);

  const { handlePointerOver, handlePointerOut } = useModelInteraction(
    groupRef,
    {
      baseScale: SCALE,
      hoverScale: 1.04
    }
  );

  useGroundedModel(groupRef, innerRef, [scene]);

  return (
    <group
      ref={groupRef}
      rotation={[0, -0.35, 0]}
      scale={SCALE}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <group ref={innerRef}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

useGLTF.preload(MODEL_PATHS.arduino);
