"use client";

import { ThreeFrame } from "@/components/three/three-frame";
import { SceneEnvironment } from "@/components/three/scene-environment";
import { ArduinoModel } from "@/components/three/arduino-model";
import { RaspberryPiModel } from "@/components/three/raspberry-pi-model";
import { RobotArmModel } from "@/components/three/robot-arm-model";
import { EmbeddedDiagram } from "@/components/projects/embedded-diagram";

export function EmbeddedHardwareCanvas() {
  return (
    <ThreeFrame className="h-full w-full" fallback={<EmbeddedDiagram />}>
      <SceneEnvironment />
      <group position={[0.35, -0.5, -0.1]}>
        <group position={[-1.5, 0, 0.35]}>
          <ArduinoModel />
        </group>
        <group position={[1.5, 0, 0.2]}>
          <RaspberryPiModel />
        </group>
        <group position={[0.05, 0, -0.85]}>
          <RobotArmModel />
        </group>
      </group>
    </ThreeFrame>
  );
}
