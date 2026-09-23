"use client";

import { ThreeFrame } from "@/components/three/three-frame";
import { ModelStage } from "@/components/three/model-stage";
import { Float, Turntable } from "@/components/three/motion-rigs";
import { LaptopModel } from "@/components/three/laptop-model";

const FLOOR = -0.55;

export function WorkLaptopCanvas() {
  return (
    <ThreeFrame className="h-full w-full" fallback={<div />} lights={false}>
      <ModelStage
        floor={FLOOR}
        cameraPosition={[0, 1.5, 4.1]}
        cameraTarget={[0, 0.1, 0]}
        cameraFov={32}
        shadowScale={6}
        shadowBlur={2.2}
        shadowOpacity={0.35}
      >
        <group position={[-0.12, FLOOR, 0]}>
          <Turntable period={50} sweep={0.3}>
            <Float amplitude={0.035} period={7.5}>
              <LaptopModel />
            </Float>
          </Turntable>
        </group>
      </ModelStage>
    </ThreeFrame>
  );
}
