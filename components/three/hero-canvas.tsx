"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";

import type { Group, Mesh } from "three";
import {
  Mannequin,
  walkSpeedFor,
  type MannequinOutfit,
  type MannequinPose
} from "@/components/three/mannequin";
import { HeroFigure } from "@/components/hero/hero-figure";
import { SceneErrorBoundary } from "@/components/three/scene-error-boundary";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type HeroPhase = "enter" | "run" | "look" | "kick" | "cta" | "rest";

type HeroCanvasProps = {
  phase: HeroPhase;
  isMobile: boolean;
  className?: string;
};

export function HeroCanvas({ phase, isMobile, className }: HeroCanvasProps) {
  const reduceMotion = useReducedMotion();

  const still = <HeroFigure pose="idle" carry="laptop" />;

  if (reduceMotion) {
    return <div className={cn("relative", className)}>{still}</div>;
  }

  return (
    <div className={cn("relative h-full w-full", className)}>
      <SceneErrorBoundary fallback={still}>
        <Canvas
          camera={{
            position: isMobile ? [0.4, 1.15, 4.4] : [0.2, 1.25, 5.1],
            fov: isMobile ? 36 : 30
          }}
          dpr={[1, 1.4]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
          }}
        >
          <color attach="background" args={["#ffffff"]} />
          <ambientLight intensity={0.72} />
          <directionalLight position={[3.2, 5, 2.4]} intensity={1.05} />
          <directionalLight position={[-2.5, 1.4, -1]} intensity={0.25} />
          <Suspense fallback={null}>
            <HeroRig phase={phase} isMobile={isMobile} />
          </Suspense>
        </Canvas>
      </SceneErrorBoundary>
    </div>
  );
}

function HeroRig({ phase, isMobile }: { phase: HeroPhase; isMobile: boolean }) {
  const kicked = phase === "kick" || phase === "cta" || phase === "rest";
  const walkerPose: MannequinPose =
    phase === "kick" ? "kick" : phase === "look" ? "look" : "walk";

  return (
    <group position={[0, -0.82, 0]}>
      {/* The figures' only ground reference is this hairline, matching the
          page's other rules. A filled plane used to sit here, but on a white
          page it just read as a grey slab the walkers stood on — ContactShadows
          below renders onto its own surface and doesn't need one. */}
      <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 0.01]} />
        <meshStandardMaterial color="#030303" />
      </mesh>
      <Walker
        pose={isMobile ? "walk" : walkerPose}
        carry={isMobile ? "laptop" : "none"}
        outfit="paper"
        duration={10.8}
        start={-5.4}
        end={5.6}
        z={0.15}
        delay={0}
      />
      {isMobile ? null : (
        <>
          <Walker
            pose="walk"
            carry="laptop"
            hair="puff"
            outfit="slate"
            accent
            duration={12.2}
            start={-6.4}
            end={5.2}
            z={-0.2}
            delay={1.1}
          />
          <Walker
            pose={phase === "look" ? "look" : "walk"}
            carry="flag"
            hair="bun"
            outfit="sand"
            duration={13.1}
            start={-7.2}
            end={4.8}
            z={0.35}
            delay={2.2}
          />
        </>
      )}
      <StorySphere kicked={kicked} />
      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.22}
        scale={14}
        blur={2.4}
        far={3.2}
        color="#030303"
      />
    </group>
  );
}

function Walker({
  pose,
  carry = "none",
  hair = "short",
  outfit = "paper",
  accent = false,
  duration,
  start,
  end,
  z,
  delay
}: {
  pose: MannequinPose;
  carry?: "none" | "laptop" | "flag";
  hair?: "short" | "puff" | "bun";
  outfit?: MannequinOutfit;
  accent?: boolean;
  duration: number;
  start: number;
  end: number;
  z: number;
  delay: number;
}) {
  const group = useRef<Group>(null);

  // Drive the stride from how fast this walker actually crosses the scene, so
  // the feet plant instead of skating along under a fixed-rate cycle.
  const strideSpeed = useMemo(
    () => walkSpeedFor(Math.abs(end - start) / duration),
    [start, end, duration]
  );

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = ((clock.getElapsedTime() + delay) % duration) / duration;
    group.current.position.x = start + (end - start) * t;
    group.current.position.z = z;
    group.current.rotation.y = Math.PI / 2;
  });

  return (
    <group ref={group}>
      <Mannequin
        pose={pose}
        carry={carry}
        hair={hair}
        outfit={outfit}
        accent={accent}
        speed={strideSpeed}
        delay={delay}
      />
    </group>
  );
}

function StorySphere({ kicked }: { kicked: boolean }) {
  const mesh = useRef<Mesh>(null);
  const kickAt = useRef<number | null>(null);
  const origin = useMemo(() => ({ x: -1.1, y: 0.12, z: 0.2 }), []);

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    if (!kicked) {
      kickAt.current = null;
      mesh.current.position.set(origin.x, origin.y, origin.z);
      mesh.current.scale.set(1, 1, 1);
      return;
    }
    if (kickAt.current === null) kickAt.current = clock.getElapsedTime();
    const t = Math.min(1, (clock.getElapsedTime() - kickAt.current) / 1.15);
    const lift = Math.sin(t * Math.PI) * 0.55;
    mesh.current.position.set(origin.x + t * 3.4, origin.y + lift, origin.z);
    const squash = t > 0.82 ? 1 + (t - 0.82) * 1.4 : 1;
    mesh.current.scale.set(1 / squash, squash, 1 / squash);
    mesh.current.rotation.z = -t * 4.2;
  });

  return (
    <mesh ref={mesh} position={[origin.x, origin.y, origin.z]}>
      <sphereGeometry args={[0.11, 24, 24]} />
      <meshStandardMaterial color="#111110" roughness={0.32} metalness={0.18} />
    </mesh>
  );
}
