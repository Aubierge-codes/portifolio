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
        cameraPosition={[0.4, 2.4, 7.2]}
        cameraTarget={[0, -0.1, 0]}
        cameraFov={32}
        shadowScale={10}
        shadowOpacity={0.3}
      >
        <group position={[0, FLOOR, -0.1]}>
          <group position={[-1.5, 0, 0.35]}>
            <ArduinoModel />
          </group>
          <group position={[1.5, 0, 0.2]}>
            <RaspberryPiModel />
          </group>
          <group position={[0, 0, -0.85]}>
            <RobotArmModel />
          </group>
        </group>
      </ModelStage>
    </ThreeFrame>
  );
}
