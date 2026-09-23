"use client";

import { ThreeFrame } from "@/components/three/three-frame";
import { ArduinoModel } from "@/components/three/arduino-model";
import { RaspberryPiModel } from "@/components/three/raspberry-pi-model";
import { RobotArmModel } from "@/components/three/robot-arm-model";
import { EmbeddedDiagram } from "@/components/projects/embedded-diagram";

export function EmbeddedHardwareCanvas() {
  return (
    <ThreeFrame className="h-full w-full" fallback={<EmbeddedDiagram />}>
      <group position={[0, -0.55, 0.3]}>
        <group position={[-1.5, 0, 0.6]}>
          <ArduinoModel />
        </group>
        <group position={[1.5, 0, 0.6]}>
          <RaspberryPiModel />
        </group>
        <group position={[0, 0, -0.6]}>
          <RobotArmModel />
        </group>
      </group>
    </ThreeFrame>
  );
}
