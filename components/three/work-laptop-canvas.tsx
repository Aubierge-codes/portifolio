"use client";

import { ThreeFrame } from "@/components/three/three-frame";
import { SceneEnvironment } from "@/components/three/scene-environment";
import { LaptopModel } from "@/components/three/laptop-model";

export function WorkLaptopCanvas() {
  return (
    <ThreeFrame className="h-full w-full" fallback={<div />}>
      <SceneEnvironment />
      <group position={[0, -0.55, 0.2]}>
        <LaptopModel />
      </group>
    </ThreeFrame>
  );
}
