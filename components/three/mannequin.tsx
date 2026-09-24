"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";

const ink = "#111110";
const maroon = "#6E1F24";

export type MannequinCarry = "none" | "laptop" | "flag";
export type MannequinHair = "short" | "puff" | "bun";
export type MannequinPose = "walk" | "idle" | "kick" | "look" | "hit";

type MannequinProps = {
  pose?: MannequinPose;
  carry?: MannequinCarry;
  hair?: MannequinHair;
  accent?: boolean;
  speed?: number;
  delay?: number;
  look?: number;
};

/** Hip-to-sole length of the rig, used to relate stride to ground speed. */
const LEG_LENGTH = 0.68;
const THIGH_SWING = 0.5;

/**
 * Gait cycles per second needed to cover `unitsPerSecond` without the feet
 * skating. One cycle is two steps, each roughly 2 * legLength * sin(swing)
 * long, so ground speed is stride * cycles — inverted here.
 */
export function walkSpeedFor(unitsPerSecond: number) {
  const stridePerCycle = 2 * (2 * LEG_LENGTH * Math.sin(THIGH_SWING));
  return (unitsPerSecond / stridePerCycle) * Math.PI * 2;
}

export function Mannequin({
  pose = "walk",
  carry = "none",
  hair = "short",
  accent = false,
  speed = 2.05,
  delay = 0,
  look = 0
}: MannequinProps) {
  const root = useRef<Group>(null);
  const pelvis = useRef<Group>(null);
  const chest = useRef<Group>(null);
  const head = useRef<Group>(null);
  const leftThigh = useRef<Group>(null);
  const rightThigh = useRef<Group>(null);
  const leftShin = useRef<Group>(null);
  const rightShin = useRef<Group>(null);
  const leftAnkle = useRef<Group>(null);
  const rightAnkle = useRef<Group>(null);
  const leftArm = useRef<Group>(null);
  const rightArm = useRef<Group>(null);
  const leftFore = useRef<Group>(null);
  const rightFore = useRef<Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + delay;
    const walking = pose === "walk";
    const kicking = pose === "kick";
    const hitting = pose === "hit";
    const idle = pose === "idle" || pose === "look";

    // Gait phase for the left leg; the right leg runs half a cycle behind.
    // 0 = heel strike, PI/2 = midstance, PI = toe off, 3PI/2 = mid-swing.
    const pL = t;
    const pR = t + Math.PI;

    if (root.current) {
      // Two rises per cycle, peaking at each midstance and dipping through
      // double support — a smooth curve rather than the bounce of an abs(sin).
      root.current.position.y = walking ? -Math.cos(t * 2) * 0.022 : 0;
      // Weight shifts laterally over whichever leg is carrying.
      root.current.position.x = walking ? -Math.sin(t) * 0.018 : 0;
    }

    if (pelvis.current) {
      // Hips rotate so the swinging leg's hip leads, and drop slightly on the
      // unsupported side.
      pelvis.current.rotation.y = walking ? -Math.cos(t) * 0.09 : 0;
      pelvis.current.rotation.z = walking ? Math.sin(t) * 0.035 : 0;
    }

    if (chest.current) {
      // Shoulders counter-rotate against the pelvis; that opposition is most
      // of what separates walking from a shuffle.
      chest.current.rotation.y = walking
        ? Math.cos(t) * 0.13
        : hitting
          ? Math.sin(t * 8) * 0.2
          : 0;
      chest.current.rotation.z = walking ? -Math.sin(t) * 0.03 : 0;
      chest.current.position.y = idle ? 0.2 + Math.sin(t * 0.7) * 0.008 : 0.2;
    }

    if (head.current) {
      // Head stays levelled against the torso's yaw rather than riding it.
      head.current.rotation.y =
        pose === "look"
          ? 0.42 + look * 0.02
          : walking
            ? -Math.cos(t) * 0.07
            : look * 0.01;
      head.current.rotation.x = walking ? Math.cos(t * 2) * 0.03 : 0;
    }

    const thigh = (p: number) => Math.cos(p) * THIGH_SWING;
    // Knee is near straight through stance and folds through swing.
    const knee = (p: number) => 0.12 + ((1 - Math.sin(p)) / 2) * 1.05;
    // Toe lifts to clear the ground in swing, points through toe-off.
    const ankle = (p: number) => Math.sin(p - 0.9) * 0.28 - 0.05;

    if (leftThigh.current) {
      leftThigh.current.rotation.x = walking ? thigh(pL) : 0;
    }
    if (rightThigh.current) {
      rightThigh.current.rotation.x = kicking
        ? -0.95 + Math.sin(t * 2.4) * 0.12
        : walking
          ? thigh(pR)
          : 0;
    }
    if (leftShin.current) {
      leftShin.current.rotation.x = walking ? knee(pL) : 0.08;
    }
    if (rightShin.current) {
      rightShin.current.rotation.x = kicking ? 0.2 : walking ? knee(pR) : 0.08;
    }
    if (leftAnkle.current) {
      leftAnkle.current.rotation.x = walking ? ankle(pL) : 0;
    }
    if (rightAnkle.current) {
      rightAnkle.current.rotation.x = kicking ? -0.3 : walking ? ankle(pR) : 0;
    }

    // Arms oppose the same-side leg.
    const swingL = walking ? -Math.cos(pL) * 0.42 : 0.08;
    const swingR = walking ? -Math.cos(pR) * 0.42 : 0.08;
    if (leftArm.current) leftArm.current.rotation.x = swingL;
    if (rightArm.current) {
      rightArm.current.rotation.x =
        carry === "laptop"
          ? -0.55
          : hitting
            ? -1.5 + Math.sin(t * 8) * 1.5
            : swingR;
      rightArm.current.rotation.z =
        carry === "laptop" ? -0.18 : hitting ? 0.5 : 0.06;
    }
    // Forearms trail the upper arm and stay a little flexed, as they do at rest.
    if (leftFore.current) {
      leftFore.current.rotation.x = walking
        ? 0.22 + Math.max(0, swingL) * 0.7
        : 0.12;
    }
    if (rightFore.current) {
      rightFore.current.rotation.x =
        carry === "laptop"
          ? 0.7
          : hitting
            ? 0.1
            : walking
              ? 0.22 + Math.max(0, swingR) * 0.7
              : 0.16;
    }
  });

  return (
    <group ref={root}>
      {/* Pelvis carries the legs and torso so hip rotation propagates to both. */}
      <group ref={pelvis} position={[0, 0.72, 0]}>
        <group position={[0, 0.2, 0]} ref={chest}>
          <mesh position={[0, 0.08, 0]}>
            <capsuleGeometry args={[0.13, 0.34, 6, 12]} />
            <meshStandardMaterial color="#f8f8f8" roughness={0.9} />{" "}
            {/* Shirt */}
          </mesh>
          {accent ? (
            <mesh position={[0, 0.12, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.12, 0.012, 8, 20]} />
              <meshStandardMaterial
                color={maroon}
                roughness={0.5}
                metalness={0.1}
              />
            </mesh>
          ) : null}
          <group ref={head} position={[0, 0.38, 0]}>
            <mesh>
              <sphereGeometry args={[0.105, 18, 18]} />
              <meshStandardMaterial color="#5c3a21" roughness={0.6} />{" "}
              {/* Skin */}
            </mesh>
            {hair === "puff" ? (
              <mesh position={[0, 0.08, -0.01]}>
                <sphereGeometry args={[0.12, 14, 14]} />
                <meshStandardMaterial color="#090909" roughness={0.9} />{" "}
                {/* Hair */}
              </mesh>
            ) : null}
            {hair === "bun" ? (
              <mesh position={[0, 0.1, -0.08]}>
                <sphereGeometry args={[0.045, 12, 12]} />
                <meshStandardMaterial color="#090909" roughness={0.9} />{" "}
                {/* Hair */}
              </mesh>
            ) : null}
            {hair === "short" ? (
              <mesh position={[0, 0.04, -0.02]}>
                <sphereGeometry args={[0.11, 14, 14]} />
                <meshStandardMaterial color="#090909" roughness={0.9} />{" "}
                {/* Hair */}
              </mesh>
            ) : null}
          </group>

          <group
            ref={leftArm}
            position={[-0.18, 0.22, 0]}
            rotation={[0, 0, 0.12]}
          >
            <mesh position={[0, -0.14, 0]}>
              <capsuleGeometry args={[0.035, 0.2, 4, 8]} />
              <meshStandardMaterial color="#f8f8f8" roughness={0.9} />{" "}
              {/* Sleeve */}
            </mesh>
            <group ref={leftFore} position={[0, -0.28, 0]}>
              <mesh position={[0, -0.12, 0]}>
                <capsuleGeometry args={[0.028, 0.18, 4, 8]} />
                <meshStandardMaterial color="#5c3a21" roughness={0.6} />{" "}
                {/* Skin */}
              </mesh>
            </group>
          </group>

          <group
            ref={rightArm}
            position={[0.18, 0.22, 0]}
            rotation={[0, 0, -0.12]}
          >
            <mesh position={[0, -0.14, 0]}>
              <capsuleGeometry args={[0.035, 0.2, 4, 8]} />
              <meshStandardMaterial color="#f8f8f8" roughness={0.9} />{" "}
              {/* Sleeve */}
            </mesh>
            <group ref={rightFore} position={[0, -0.28, 0]}>
              <mesh position={[0, -0.12, 0]}>
                <capsuleGeometry args={[0.028, 0.18, 4, 8]} />
                <meshStandardMaterial color="#5c3a21" roughness={0.6} />{" "}
                {/* Skin */}
              </mesh>
              <Carry carry={carry} />
            </group>
          </group>
        </group>

        <group ref={leftThigh} position={[-0.065, 0, 0]}>
          <mesh position={[0, -0.18, 0]}>
            <capsuleGeometry args={[0.05, 0.28, 4, 10]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.8} />{" "}
            {/* Pants */}
          </mesh>
          <group ref={leftShin} position={[0, -0.36, 0]}>
            <mesh position={[0, -0.16, 0]}>
              <capsuleGeometry args={[0.042, 0.26, 4, 10]} />
              <meshStandardMaterial color="#1a1a1a" roughness={0.8} />{" "}
              {/* Pants */}
            </mesh>
            {/* Ankle lets the foot roll heel-to-toe instead of staying rigid. */}
            <group ref={leftAnkle} position={[0.02, -0.32, 0]}>
              <mesh position={[0, 0, 0.04]}>
                <boxGeometry args={[0.08, 0.05, 0.16]} />
                <meshStandardMaterial color={maroon} roughness={0.7} />{" "}
                {/* Shoe */}
              </mesh>
            </group>
          </group>
        </group>

        <group ref={rightThigh} position={[0.065, 0, 0]}>
          <mesh position={[0, -0.18, 0]}>
            <capsuleGeometry args={[0.05, 0.28, 4, 10]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.8} />{" "}
            {/* Pants */}
          </mesh>
          <group ref={rightShin} position={[0, -0.36, 0]}>
            <mesh position={[0, -0.16, 0]}>
              <capsuleGeometry args={[0.042, 0.26, 4, 10]} />
              <meshStandardMaterial color="#1a1a1a" roughness={0.8} />{" "}
              {/* Pants */}
            </mesh>
            <group ref={rightAnkle} position={[0.02, -0.32, 0]}>
              <mesh position={[0, 0, 0.04]}>
                <boxGeometry args={[0.08, 0.05, 0.16]} />
                <meshStandardMaterial color={maroon} roughness={0.7} />{" "}
                {/* Shoe */}
              </mesh>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

function Carry({ carry }: { carry: MannequinCarry }) {
  if (carry === "laptop") {
    return (
      <group position={[0.02, -0.22, 0.08]} rotation={[-0.35, 0.4, -0.2]}>
        <mesh>
          <boxGeometry args={[0.2, 0.012, 0.14]} />
          <meshStandardMaterial color={ink} roughness={0.45} metalness={0.2} />
        </mesh>
        <mesh position={[0, 0.055, -0.05]} rotation={[-1.05, 0, 0]}>
          <boxGeometry args={[0.2, 0.13, 0.01]} />
          <meshStandardMaterial
            color="#1c1c1c"
            roughness={0.35}
            metalness={0.25}
          />
        </mesh>
        <mesh position={[0.055, 0.06, -0.046]}>
          <boxGeometry args={[0.035, 0.018, 0.004]} />
          <meshStandardMaterial color={maroon} roughness={0.4} />
        </mesh>
      </group>
    );
  }

  if (carry === "flag") {
    return (
      <group position={[0.04, -0.08, 0.02]} rotation={[0.2, 0, 0.15]}>
        <mesh position={[0, 0.16, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.42, 8]} />
          <meshStandardMaterial color={ink} />
        </mesh>
        <mesh position={[0.07, 0.28, 0]}>
          <boxGeometry args={[0.14, 0.1, 0.008]} />
          <meshStandardMaterial color={maroon} roughness={0.55} />
        </mesh>
      </group>
    );
  }

  return null;
}
