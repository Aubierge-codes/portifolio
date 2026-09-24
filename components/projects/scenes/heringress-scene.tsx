"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group, Mesh, MeshStandardMaterial } from "three";
import { ThreeFrame } from "@/components/three/three-frame";
import { Mannequin } from "@/components/three/mannequin";

const ink = "#111110";
const maroon = "#6E1F24";

/**
 * The climb: stepped ridges rising toward the summit. Reads as ascent from
 * the side, which is the whole point — the figure is above where she started.
 */
function Ascent() {
  const steps = [
    { x: -1.5, h: 0.18, d: 0.55 },
    { x: -0.95, h: 0.34, d: 0.5 },
    { x: -0.45, h: 0.52, d: 0.45 },
    { x: 0.05, h: 0.72, d: 0.45 }
  ];

  return (
    <group>
      {steps.map((s, i) => (
        <mesh key={s.x} position={[s.x, s.h / 2 - 0.1, 0]}>
          <boxGeometry args={[s.d, s.h, 0.6]} />
          <meshStandardMaterial
            color={i === steps.length - 1 ? ink : "#2a2a28"}
            roughness={0.95}
            metalness={0}
          />
        </mesh>
      ))}
    </group>
  );
}

/** Opportunities she's climbing toward — markers drifting up past the summit. */
function Opportunities({ count = 4 }: { count?: number }) {
  const groupRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    groupRef.current?.children.forEach((child, i) => {
      const phase = (t * 0.22 + i / count) % 1;
      child.position.y = 0.35 + phase * 0.95;
      child.position.x = 0.75 + Math.sin(phase * Math.PI * 2 + i) * 0.14;
      const mesh = child as Mesh;
      const material = mesh.material as MeshStandardMaterial;
      // Fade in off the ridge and back out at the top of the rise.
      material.opacity = Math.sin(phase * Math.PI) * 0.9;
      child.rotation.z = Math.sin(t * 0.6 + i) * 0.12;
    });
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: count }).map((_, i) => (
        <mesh key={i}>
          <planeGeometry args={[0.16, 0.2]} />
          <meshStandardMaterial
            color={i % 2 ? maroon : ink}
            transparent
            opacity={0.8}
            roughness={1}
          />
        </mesh>
      ))}
    </group>
  );
}

/** Low sun behind the summit — the horizon she's now high enough to see. */
function Sunrise() {
  const ref = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    // Barely moves; it should feel like dawn holding, not a sunrise timelapse.
    ref.current.position.y = 0.52 + Math.sin(clock.getElapsedTime() * 0.14) * 0.03;
  });

  return (
    <mesh ref={ref} position={[0.55, 0.52, -1.6]}>
      <circleGeometry args={[0.62, 48]} />
      <meshBasicMaterial color="#f0dcc6" transparent opacity={0.55} />
    </mesh>
  );
}

export function HerIngressScene({ papers }: { papers?: string[] }) {
  return (
    <ThreeFrame
      className="h-48 md:h-56"
      fallback={<div className="h-full w-full bg-paper" />}
    >
      <group position={[0.1, -0.5, 0]}>
        <Sunrise />
        <Ascent />
        <Opportunities count={papers?.length || 4} />
        {/* Standing at the top, turned to face the open horizon. */}
        <group position={[0.05, 0.62, 0]} rotation={[0, 0.5, 0]} scale={0.62}>
          <Mannequin pose="idle" hair="puff" outfit="sand" accent look={3} />
        </group>
      </group>
    </ThreeFrame>
  );
}
