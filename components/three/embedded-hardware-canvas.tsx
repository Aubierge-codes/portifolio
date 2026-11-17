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
const ARDUINO: [number, number, number] = [-1.38, 0, 0.32];
const PI: [number, number, number] = [0.05, 0, 0.42];
const ARM: [number, number, number] = [1.5, 0, -0.42];

/**
 * Display scales that give the three pieces an even visual weight. The models
 * are built at true size, where the arm would dwarf the boards; these bring
 * each to roughly 1.1-1.5 units across.
 */
const SCALE = { arduino: 1.55, pi: 1.3, arm: 0.78 };

export function EmbeddedHardwareCanvas() {
  return (
    <ThreeFrame
      className="h-full w-full"
      fallback={<EmbeddedDiagram />}
      lights={false}
    >
      <ModelStage
        floor={FLOOR}
        cameraDirection={[0, 0.36, 1]}
        cameraTarget={[0, FLOOR + 0.55, 0.1]}
        cameraFov={28}
        subject={{ width: 4.2, height: 1.7 }}
        shadowScale={10}
        shadowOpacity={0.36}
      >
        <ScrollTilt yaw={0.22} pitch={0.04} lift={0.1}>
          <group position={[0, FLOOR, 0]}>
            {/* Laid out as the signal actually flows: the microcontroller
                reads, hands data to the computing board, which drives the
                physical output. Spaced so each stays readable on its own. */}
            <group position={ARDUINO} name="microcontroller">
              <Turntable period={54} sweep={0.22}>
                <Float amplitude={0.02} period={7} offset={0.1}>
                  <ArduinoModel scale={SCALE.arduino} />
                </Float>
              </Turntable>
            </group>
            <group position={PI} name="compute">
              <Turntable period={46} sweep={0.2} offset={0.5}>
                <Float
                  amplitude={0.024}
                  period={6.2}
                  offset={0.55}
                  tilt={0.015}
                >
                  <RaspberryPiModel scale={SCALE.pi} />
                </Float>
              </Turntable>
            </group>
            <group position={ARM} name="output">
              <RobotArmModel scale={SCALE.arm} />
            </group>

            <DataLink
              from={[ARDUINO[0] + 0.48, 0.06, ARDUINO[2] - 0.1]}
              to={[PI[0] - 0.54, 0.06, PI[2] - 0.05]}
              sag={0.08}
              speed={0.34}
            />
            <DataLink
              from={[PI[0] + 0.4, 0.15, PI[2] - 0.32]}
              to={[ARM[0] - 0.42, 0.06, ARM[2] + 0.12]}
              sag={0.08}
              packets={1}
              speed={0.26}
            />
          </group>
        </ScrollTilt>
      </ModelStage>
    </ThreeFrame>
  );
}
