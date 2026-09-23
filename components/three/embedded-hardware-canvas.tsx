"use client";

import { ThreeFrame } from "@/components/three/three-frame";
import { ModelStage } from "@/components/three/model-stage";
import { Float, Turntable } from "@/components/three/motion-rigs";
import { ArduinoModel } from "@/components/three/arduino-model";
import { RaspberryPiModel } from "@/components/three/raspberry-pi-model";
import { RobotArmModel } from "@/components/three/robot-arm-model";
import { EmbeddedDiagram } from "@/components/projects/embedded-diagram";

const FLOOR = -0.5;

export function EmbeddedHardwareCanvas() {
  return (
    <ThreeFrame
      className="h-full w-full"
      fallback={<EmbeddedDiagram />}
      lights={false}
    >
      <ModelStage
        floor={FLOOR}
        cameraPosition={[0, 2.5, 7.4]}
        cameraTarget={[0, 0.25, 0]}
        cameraFov={32}
        shadowScale={10}
        shadowOpacity={0.3}
      >
        <group position={[0, FLOOR, -0.1]}>
          <group position={[-1.15, 0, 0.5]}>
            <Turntable period={54} sweep={0.32}>
              <Float amplitude={0.03} period={7} offset={0.1}>
                <ArduinoModel />
              </Float>
            </Turntable>
          </group>
          <group position={[1.2, 0, 0.25]}>
            <Turntable period={46} sweep={0.28} offset={0.5}>
              <Float amplitude={0.035} period={6.2} offset={0.55} tilt={0.02}>
                <RaspberryPiModel />
              </Float>
            </Turntable>
          </group>
          <group position={[0.05, 0, -0.8]}>
            <Turntable period={70} sweep={0.22} offset={0.25}>
              <RobotArmModel />
            </Turntable>
          </group>
        </group>
      </ModelStage>
    </ThreeFrame>
  );
}
