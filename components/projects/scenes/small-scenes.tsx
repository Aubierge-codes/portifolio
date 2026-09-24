"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group, Mesh, MeshStandardMaterial } from "three";
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

/**
 * Cloud built from a cluster of overlapping spheres at varied sizes and
 * depths, rather than three same-size balls in a row. The silhouette is what
 * sells a cloud: a heavier flat-ish base with piled, uneven tops. Shaded with
 * a slight grey underside so it has volume instead of reading as a white blob
 * on a white page.
 */
function Cloud({
  position,
  scale = 1,
  drift = 0.4,
  speed = 0.2,
  tone = "#ffffff"
}: {
  position: [number, number, number];
  scale?: number;
  drift?: number;
  speed?: number;
  tone?: string;
}) {
  const ref = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.position.x = position[0] + Math.sin(t * speed) * drift;
    // Puffs breathe very slightly so the mass isn't perfectly rigid.
    ref.current.scale.setScalar(scale * (1 + Math.sin(t * 0.4) * 0.012));
  });

  const puffs: [number, number, number, number][] = [
    // x, y, z, radius
    [0, 0, 0, 0.22],
    [0.21, 0.04, -0.04, 0.17],
    [-0.2, 0.02, 0.03, 0.16],
    [0.09, 0.14, 0.02, 0.15],
    [-0.09, 0.12, -0.05, 0.13],
    [0.34, -0.04, 0.01, 0.11],
    [-0.33, -0.03, -0.02, 0.1]
  ];

  return (
    <group ref={ref} position={position} scale={scale}>
      {puffs.map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[r, 18, 14]} />
          <meshStandardMaterial color={tone} roughness={1} flatShading={false} />
        </mesh>
      ))}
      {/* Flatter, slightly shaded base so the cloud sits rather than floats. */}
      <mesh position={[0, -0.08, 0]} scale={[1.15, 0.45, 0.9]}>
        <sphereGeometry args={[0.24, 18, 12]} />
        <meshStandardMaterial color="#e4e7ea" roughness={1} />
      </mesh>
    </group>
  );
}

function Rain({ count = 26 }: { count?: number }) {
  const ref = useRef<Group>(null);
  // Fixed offsets — Math.random() during render would reshuffle every frame.
  const drops = useRef(
    Array.from({ length: count }, (_, i) => ({
      x: -1.15 + (i % 13) * 0.18 + ((i * 37) % 7) * 0.012,
      z: -0.35 + ((i * 53) % 9) * 0.08,
      offset: ((i * 29) % 100) / 100
    }))
  );

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.children.forEach((child, i) => {
      const d = drops.current[i];
      const fall = (t * 0.85 + d.offset) % 1;
      child.position.y = 0.42 - fall * 1.15;
      // Fade out near the bottom so drops don't pop.
      const mesh = child as Mesh;
      const material = mesh.material as MeshStandardMaterial;
      material.opacity = Math.min(1, (1 - fall) * 2.2) * 0.5;
    });
  });

  return (
    <group ref={ref}>
      {drops.current.map((d, i) => (
        <mesh key={i} position={[d.x, 0, d.z]}>
          <capsuleGeometry args={[0.0055, 0.07, 3, 5]} />
          <meshStandardMaterial
            color="#8fa3b5"
            transparent
            opacity={0.5}
            roughness={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

export function WeatherScene() {
  return (
    <ThreeFrame
      className="h-40 md:h-48"
      fallback={<div className="h-full w-full bg-paper" />}
    >
      {/* Sun behind the break in the cloud cover. */}
      <mesh position={[1.05, 0.72, -1.2]}>
        <circleGeometry args={[0.3, 32]} />
        <meshBasicMaterial color="#f7e6c8" />
      </mesh>
      <Cloud position={[-0.62, 0.52, 0]} scale={1.05} speed={0.17} />
      <Cloud position={[0.62, 0.66, -0.45]} scale={0.8} speed={0.23} drift={0.3} />
      <Cloud
        position={[0.05, 0.3, 0.45]}
        scale={0.6}
        speed={0.29}
        drift={0.22}
        tone="#f1f3f5"
      />
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
