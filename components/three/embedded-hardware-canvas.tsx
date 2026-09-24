"use client";

import { ThreeFrame } from "@/components/three/three-frame";
import { ModelStage } from "@/components/three/model-stage";
import { Float, ScrollTilt, Turntable } from "@/components/three/motion-rigs";
import { ArduinoModel } from "@/components/three/arduino-model";
import { RaspberryPiModel } from "@/components/three/raspberry-pi-model";
import { RobotArmModel } from "@/components/three/robot-arm-model";
import { DataLink } from "@/components/three/data-link";
import { EmbeddedDiagram } from "@/components/projects/embedded-diagram";

const FLOOR = -0.5;
/** Signal order, left to right: read -> compute -> actuate. */
const ARDUINO: [number, number, number] = [-1.45, 0, 0.45];
const PI: [number, number, number] = [0.2, 0, 0.5];
const ARM: [number, number, number] = [1.5, 0, -0.55];

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
        <ScrollTilt yaw={0.26} pitch={0.05} lift={0.14}>
          <group position={[0, FLOOR, -0.1]}>
            {/* Laid out as the signal actually flows: the microcontroller
                reads, hands data to the computing board, which drives the
                physical output. Spaced so each stays readable on its own. */}
            <group position={ARDUINO} name="microcontroller">
              <Turntable period={54} sweep={0.3}>
                <Float amplitude={0.028} period={7} offset={0.1}>
                  <ArduinoModel />
                </Float>
              </Turntable>
            </group>
            <group position={PI} name="compute">
              <Turntable period={46} sweep={0.26} offset={0.5}>
                <Float amplitude={0.032} period={6.2} offset={0.55} tilt={0.02}>
                  <RaspberryPiModel />
                </Float>
              </Turntable>
            </group>
            <group position={ARM} name="output">
              <Turntable period={70} sweep={0.2} offset={0.25}>
                <RobotArmModel />
              </Turntable>
            </group>

            <DataLink
              from={[ARDUINO[0] + 0.3, 0.16, ARDUINO[2]]}
              to={[PI[0] - 0.32, 0.16, PI[2]]}
              sag={0.14}
              speed={0.34}
            />
            <DataLink
              from={[PI[0] + 0.1, 0.18, PI[2] - 0.22]}
              to={[ARM[0] + 0.22, 0.3, ARM[2] + 0.2]}
              sag={0.12}
              packets={1}
              speed={0.26}
            />
          </group>
        </ScrollTilt>
      </ModelStage>
    </ThreeFrame>
  );
}
