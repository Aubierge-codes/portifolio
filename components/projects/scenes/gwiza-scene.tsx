"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group, Mesh, MeshBasicMaterial } from "three";
import { ThreeFrame } from "@/components/three/three-frame";
import { Mannequin, walkSpeedFor } from "@/components/three/mannequin";

const CYCLE = 9;
const APPROACH = 3.2; // walking toward each other
const SHAKE = 6.4; // met, shaking hands
const START_X = 1.55;
const MEET_X = 0.26;

const easeInOut = (v: number) =>
  v < 0.5 ? 2 * v * v : 1 - Math.pow(-2 * v + 2, 2) / 2;

/**
 * The connection itself: a ring that expands out of the clasped hands once the
 * handshake lands, which is the moment the project is actually about.
 */
function ConnectionPulse({ active }: { active: boolean }) {
  const ref = useRef<Mesh>(null);
  const progress = useRef(0);

  useFrame((_, delta) => {
    if (!ref.current) return;
    progress.current = active ? Math.min(1, progress.current + delta * 0.8) : 0;
    const p = progress.current;
    const s = 0.12 + p * 0.85;
    ref.current.scale.set(s, s, s);
    const material = ref.current.material as MeshBasicMaterial;
    material.opacity = p > 0 ? Math.sin(p * Math.PI) * 0.5 : 0;
  });

  return (
    <mesh ref={ref} position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.42, 0.5, 40]} />
      <meshBasicMaterial color="#6E1F24" transparent opacity={0} />
    </mesh>
  );
}

/** Lives inside the Canvas — useFrame is only valid below <ThreeFrame>. */
function Handshake() {
  const left = useRef<Group>(null);
  const right = useRef<Group>(null);
  const [met, setMet] = useState(false);

  // Stride matched to the approach so the walk-in doesn't skate.
  const strideSpeed = walkSpeedFor((START_X - MEET_X) / APPROACH);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() % CYCLE;
    const walking = t < APPROACH;

    // Close the gap, hold through the handshake, then reset off-frame.
    let x: number;
    if (walking) {
      x = START_X - (START_X - MEET_X) * easeInOut(t / APPROACH);
    } else if (t < SHAKE) {
      x = MEET_X;
    } else {
      x =
        MEET_X + (START_X - MEET_X) * easeInOut((t - SHAKE) / (CYCLE - SHAKE));
    }

    if (left.current) left.current.position.x = -x;
    if (right.current) right.current.position.x = x;

    const shaking = t >= APPROACH && t < SHAKE;
    if (shaking !== met) setMet(shaking);
  });

  const pose = met ? "reach" : "walk";

  return (
    <group position={[0, -0.62, 0]}>
      {/* Ground line only — the pair meeting is the subject, not a plinth. */}
      <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5, 0.012]} />
        <meshStandardMaterial color="#111110" />
      </mesh>

      <ConnectionPulse active={met} />

      <group ref={left} rotation={[0, Math.PI / 2, 0]}>
        <Mannequin
          pose={pose}
          hair="short"
          outfit="slate"
          speed={strideSpeed}
        />
      </group>
      <group ref={right} rotation={[0, -Math.PI / 2, 0]}>
        <Mannequin
          pose={pose}
          hair="puff"
          outfit="sand"
          accent
          speed={strideSpeed}
          delay={Math.PI}
        />
      </group>
    </group>
  );
}

export function GwizaScene() {
  return (
    <ThreeFrame
      className="h-44 md:h-52"
      fallback={<div className="h-full w-full bg-paper" />}
    >
      <Handshake />
    </ThreeFrame>
  );
}
