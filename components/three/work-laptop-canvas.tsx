"use client";

import { ThreeFrame } from "@/components/three/three-frame";
import { ModelStage } from "@/components/three/model-stage";
import { LaptopModel } from "@/components/three/laptop-model";

const FLOOR = -0.55;

export function WorkLaptopCanvas() {
  return (
    <ThreeFrame className="h-full w-full" fallback={<div />} lights={false}>
      <ModelStage
        floor={FLOOR}
        shadowScale={6}
        shadowBlur={2.2}
        shadowOpacity={0.35}
      >
        <group position={[0, FLOOR, 0.2]}>
          <LaptopModel />
        </group>
      </ModelStage>
    </ThreeFrame>
  );
}
