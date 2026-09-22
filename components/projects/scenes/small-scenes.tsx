"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";
import { ThreeFrame } from "@/components/three/three-frame";
import { Mannequin } from "@/components/three/mannequin";

export function VeloraScene() {
  return (
    <ThreeFrame className="h-40 md:h-48" fallback={<div className="h-full w-full bg-paper" />}>
      <group position={[0.2, 0, 0]}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[i * 0.4 - 0.4, -0.2, 0]}>
            <boxGeometry args={[0.3, 0.4, 0.3]} />
            <meshStandardMaterial color="#111111" />
          </mesh>
        ))}
      </group>
      <group position={[-0.8, -0.4, 0]} rotation={[0, Math.PI / 2, 0]}>
        <Mannequin pose="walk" />
      </group>
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
