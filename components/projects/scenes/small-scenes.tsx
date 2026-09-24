"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group, Mesh } from "three";
import { ThreeFrame } from "@/components/three/three-frame";
import { Mannequin } from "@/components/three/mannequin";

/**
 * Velora is frontend engineering work — responsive layout and component
 * organisation. So the scene is an interface reflowing: a viewport that
 * narrows and widens while its component blocks rearrange between a
 * multi-column and a stacked layout, which is the job made visible.
 */
function ResponsiveLayout() {
  const frame = useRef<Mesh>(null);
  const blocks = useRef<(Group | null)[]>([]);

  // Wide layout: header, two columns, footer. Narrow: everything stacked.
  const WIDE = [
    { x: 0, y: 0.52, w: 2.0, h: 0.16 },
    { x: -0.53, y: 0.16, w: 0.94, h: 0.46 },
    { x: 0.53, y: 0.16, w: 0.94, h: 0.46 },
    { x: 0, y: -0.28, w: 2.0, h: 0.2 }
  ];
  const NARROW = [
    { x: 0, y: 0.56, w: 0.96, h: 0.14 },
    { x: 0, y: 0.3, w: 0.96, h: 0.3 },
    { x: 0, y: -0.06, w: 0.96, h: 0.3 },
    { x: 0, y: -0.36, w: 0.96, h: 0.16 }
  ];

  useFrame(({ clock }) => {
    // Ease between the two breakpoints and hold at each end.
    const raw = (Math.sin(clock.getElapsedTime() * 0.5) + 1) / 2;
    const t = raw < 0.5 ? 2 * raw * raw : 1 - Math.pow(-2 * raw + 2, 2) / 2;

    const frameW = 2.3 - t * 1.05;
    if (frame.current) frame.current.scale.x = frameW / 2.3;

    blocks.current.forEach((block, i) => {
      if (!block) return;
      const a = WIDE[i];
      const b = NARROW[i];
      block.position.x = a.x + (b.x - a.x) * t;
      block.position.y = a.y + (b.y - a.y) * t;
      block.scale.x = a.w + (b.w - a.w) * t;
      block.scale.y = a.h + (b.h - a.h) * t;
    });
  });

  return (
    // Tilted back to cancel the shared camera's downward angle, so the layout
    // is read face-on like a screen instead of skewing into a trapezoid.
    <group position={[0, -0.05, 0]} rotation={[0.26, 0, 0]}>
      {/* Viewport that narrows and widens. */}
      <mesh ref={frame}>
        <planeGeometry args={[2.3, 1.42]} />
        <meshBasicMaterial color="#eceae6" />
      </mesh>

      {WIDE.map((_, i) => (
        <group
          key={i}
          ref={(el) => {
            blocks.current[i] = el;
          }}
          position={[0, 0, 0.01]}
        >
          <mesh>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial color={i === 0 ? "#6E1F24" : "#1b1d21"} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function VeloraScene() {
  return (
    <ThreeFrame
      className="h-40 md:h-48"
      fallback={<div className="h-full w-full bg-paper" />}
    >
      <ResponsiveLayout />
    </ThreeFrame>
  );
}

function Cloud({ position }: { position: [number, number, number] }) {
  const ref = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.x = position[0] + Math.sin(clock.getElapsedTime() * 0.2) * 0.4;
    }
  });

  return (
    <group ref={ref} position={position}>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.2, -0.05, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-0.2, -0.05, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

function Rain() {
  const ref = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.children.forEach((child, i) => {
        child.position.y = 1 - ((clock.getElapsedTime() * 1.5 + i * 0.2) % 2);
      });
    }
  });
  return (
    <group ref={ref}>
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh key={i} position={[Math.random() * 2 - 1, 0, Math.random() - 0.5]}>
          <boxGeometry args={[0.01, 0.1, 0.01]} />
          <meshStandardMaterial color="#6E1F24" />
        </mesh>
      ))}
    </group>
  );
}

export function WeatherScene() {
  return (
    <ThreeFrame className="h-40 md:h-48" fallback={<div className="h-full w-full bg-paper" />}>
      <Cloud position={[-0.5, 0.5, 0]} />
      <Cloud position={[0.6, 0.6, -0.2]} />
      <Rain />
    </ThreeFrame>
  );
}

function FallingBooks() {
  const ref = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime();
      ref.current.children.forEach((child, i) => {
        child.position.y = Math.sin(t * 1.5 + i) * 0.1;
        child.rotation.z = Math.cos(t * 1.5 + i) * 0.1;
      });
    }
  });
  return (
    <group ref={ref} position={[-0.2, -0.2, 0]}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[i * 0.3, i * 0.1, 0]} rotation={[0, 0, i === 2 ? -0.4 : 0]}>
          <boxGeometry args={[0.2, 0.3, 0.05]} />
          <meshStandardMaterial color={i === 2 ? "#6E1F24" : "#111111"} />
        </mesh>
      ))}
    </group>
  );
}

export function BookstoreScene() {
  return (
    <ThreeFrame className="h-40 md:h-48" fallback={<div className="h-full w-full bg-paper" />}>
      <FallingBooks />
      <group position={[0.8, -0.4, 0]} rotation={[0, -1.2, 0]}>
        <Mannequin pose="walk" carry="laptop" />
      </group>
    </ThreeFrame>
  );
}

export function JavaScene() {
  return (
    <ThreeFrame className="h-40 md:h-48" fallback={<div className="h-full w-full bg-paper" />}>
      <group position={[0, -0.2, 0]}>
        <mesh position={[-0.6, 0, 0]} rotation={[0, 0.2, 0]}>
          <boxGeometry args={[0.4, 0.4, 0.4]} />
          <meshStandardMaterial color="#6E1F24" />
        </mesh>
        <mesh position={[0, 0.2, 0]} rotation={[0, 0.4, 0]}>
          <boxGeometry args={[0.4, 0.4, 0.4]} />
          <meshStandardMaterial color="#111111" />
        </mesh>
        <mesh position={[0.6, 0, 0]} rotation={[0, -0.2, 0]}>
          <boxGeometry args={[0.4, 0.4, 0.4]} />
          <meshStandardMaterial color="#444444" />
        </mesh>
      </group>
      <group position={[-1.2, -0.4, 0.5]} rotation={[0, 1.2, 0]}>
        <Mannequin pose="idle" hair="puff" />
      </group>
    </ThreeFrame>
  );
}
