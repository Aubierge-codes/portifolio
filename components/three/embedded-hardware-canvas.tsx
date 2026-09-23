"use client";

import { ThreeFrame } from "@/components/three/three-frame";
import { ModelStage } from "@/components/three/model-stage";
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
            <ArduinoModel />
          </group>
          <group position={[1.2, 0, 0.25]}>
            <RaspberryPiModel />
          </group>
          <group position={[0.05, 0, -0.8]}>
            <RobotArmModel />
          </group>
        </group>
      </ModelStage>
    </ThreeFrame>
  );
}
