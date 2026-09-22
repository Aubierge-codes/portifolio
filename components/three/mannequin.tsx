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

const mat = {
  color: ink,
  roughness: 0.78,
  metalness: 0.06
};

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
  const chest = useRef<Group>(null);
  const head = useRef<Group>(null);
  const leftThigh = useRef<Group>(null);
  const rightThigh = useRef<Group>(null);
  const leftShin = useRef<Group>(null);
  const rightShin = useRef<Group>(null);
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

    if (root.current) {
      root.current.position.y = walking ? Math.abs(Math.sin(t * 2)) * 0.04 : 0;
    }

    const stride = kicking ? 0 : walking ? Math.sin(t) : 0;
    const strideCos = kicking ? 0 : walking ? Math.cos(t) : 0;

    if (chest.current) {
      chest.current.rotation.y = walking ? Math.sin(t) * 0.12 : hitting ? Math.sin(t * 8) * 0.2 : 0;
      chest.current.rotation.z = walking ? Math.cos(t) * 0.04 : 0;
      chest.current.position.y = idle ? 0.92 + Math.sin(t * 0.7) * 0.008 : 0.92;
    }

    if (head.current) {
      head.current.rotation.y = pose === "look" ? 0.42 + look * 0.02 : (walking ? Math.sin(t) * -0.06 : look * 0.01);
      head.current.rotation.x = walking ? Math.sin(t * 2) * 0.04 : 0;
    }

    if (leftThigh.current) leftThigh.current.rotation.x = stride * 0.65;
    if (rightThigh.current) {
      rightThigh.current.rotation.x = kicking
        ? -0.95 + Math.sin(t * 2.4) * 0.12
        : -stride * 0.65;
    }
    if (leftShin.current) {
      leftShin.current.rotation.x = walking ? Math.max(0.05, -strideCos * 0.8) : 0.08;
    }
    if (rightShin.current) {
      rightShin.current.rotation.x = kicking
        ? 0.2
        : walking
          ? Math.max(0.05, strideCos * 0.8)
          : 0.08;
    }

    if (leftArm.current) leftArm.current.rotation.x = walking ? -stride * 0.5 : 0.08;
    if (rightArm.current) {
      rightArm.current.rotation.x =
        carry === "laptop" ? -0.55 : hitting ? -1.5 + Math.sin(t * 8) * 1.5 : walking ? stride * 0.5 : 0.08;
      rightArm.current.rotation.z = carry === "laptop" ? -0.18 : hitting ? 0.5 : 0.06;
    }
    if (leftFore.current) leftFore.current.rotation.x = walking ? (stride < 0 ? -stride * 0.5 : 0.1) : 0.12;
    if (rightFore.current) {
      rightFore.current.rotation.x = carry === "laptop" ? 0.7 : hitting ? 0.1 : walking ? (stride > 0 ? stride * 0.5 : 0.1) : 0.16;
    }
  });

  return (
    <group ref={root}>
      <group position={[0, 0.92, 0]} ref={chest}>
        <mesh position={[0, 0.08, 0]}>
          <capsuleGeometry args={[0.13, 0.34, 6, 12]} />
          <meshStandardMaterial color="#f8f8f8" roughness={0.9} /> {/* Shirt */}
        </mesh>
        {accent ? (
          <mesh position={[0, 0.12, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.12, 0.012, 8, 20]} />
            <meshStandardMaterial color={maroon} roughness={0.5} metalness={0.1} />
          </mesh>
        ) : null}
        <group ref={head} position={[0, 0.38, 0]}>
          <mesh>
            <sphereGeometry args={[0.105, 18, 18]} />
            <meshStandardMaterial color="#5c3a21" roughness={0.6} /> {/* Skin */}
          </mesh>
          {hair === "puff" ? (
            <mesh position={[0, 0.08, -0.01]}>
              <sphereGeometry args={[0.12, 14, 14]} />
              <meshStandardMaterial color="#090909" roughness={0.9} /> {/* Hair */}
            </mesh>
          ) : null}
          {hair === "bun" ? (
            <mesh position={[0, 0.1, -0.08]}>
              <sphereGeometry args={[0.045, 12, 12]} />
              <meshStandardMaterial color="#090909" roughness={0.9} /> {/* Hair */}
            </mesh>
          ) : null}
          {hair === "short" ? (
            <mesh position={[0, 0.04, -0.02]}>
              <sphereGeometry args={[0.11, 14, 14]} />
              <meshStandardMaterial color="#090909" roughness={0.9} /> {/* Hair */}
            </mesh>
          ) : null}
        </group>

        <group ref={leftArm} position={[-0.18, 0.22, 0]} rotation={[0, 0, 0.12]}>
          <mesh position={[0, -0.14, 0]}>
            <capsuleGeometry args={[0.035, 0.2, 4, 8]} />
            <meshStandardMaterial color="#f8f8f8" roughness={0.9} /> {/* Sleeve */}
          </mesh>
          <group ref={leftFore} position={[0, -0.28, 0]}>
            <mesh position={[0, -0.12, 0]}>
              <capsuleGeometry args={[0.028, 0.18, 4, 8]} />
              <meshStandardMaterial color="#5c3a21" roughness={0.6} /> {/* Skin */}
            </mesh>
          </group>
        </group>

        <group ref={rightArm} position={[0.18, 0.22, 0]} rotation={[0, 0, -0.12]}>
          <mesh position={[0, -0.14, 0]}>
            <capsuleGeometry args={[0.035, 0.2, 4, 8]} />
            <meshStandardMaterial color="#f8f8f8" roughness={0.9} /> {/* Sleeve */}
          </mesh>
          <group ref={rightFore} position={[0, -0.28, 0]}>
            <mesh position={[0, -0.12, 0]}>
              <capsuleGeometry args={[0.028, 0.18, 4, 8]} />
              <meshStandardMaterial color="#5c3a21" roughness={0.6} /> {/* Skin */}
            </mesh>
            <Carry carry={carry} />
          </group>
        </group>
      </group>

      <group ref={leftThigh} position={[-0.065, 0.72, 0]}>
        <mesh position={[0, -0.18, 0]}>
          <capsuleGeometry args={[0.05, 0.28, 4, 10]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.8} /> {/* Pants */}
        </mesh>
        <group ref={leftShin} position={[0, -0.36, 0]}>
          <mesh position={[0, -0.16, 0]}>
            <capsuleGeometry args={[0.042, 0.26, 4, 10]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.8} /> {/* Pants */}
          </mesh>
          <mesh position={[0.02, -0.32, 0.04]} rotation={[0.15, 0, 0]}>
            <boxGeometry args={[0.08, 0.05, 0.16]} />
            <meshStandardMaterial color={maroon} roughness={0.7} /> {/* Shoe */}
          </mesh>
        </group>
      </group>

      <group ref={rightThigh} position={[0.065, 0.72, 0]}>
        <mesh position={[0, -0.18, 0]}>
          <capsuleGeometry args={[0.05, 0.28, 4, 10]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.8} /> {/* Pants */}
        </mesh>
        <group ref={rightShin} position={[0, -0.36, 0]}>
          <mesh position={[0, -0.16, 0]}>
            <capsuleGeometry args={[0.042, 0.26, 4, 10]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.8} /> {/* Pants */}
          </mesh>
          <mesh position={[0.02, -0.32, 0.04]} rotation={[0.15, 0, 0]}>
            <boxGeometry args={[0.08, 0.05, 0.16]} />
            <meshStandardMaterial color={maroon} roughness={0.7} /> {/* Shoe */}
          </mesh>
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
          <meshStandardMaterial color="#1c1c1c" roughness={0.35} metalness={0.25} />
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
