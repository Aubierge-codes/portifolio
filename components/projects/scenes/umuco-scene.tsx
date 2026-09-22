"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group, Mesh } from "three";
import { ThreeFrame } from "@/components/three/three-frame";
import { Mannequin } from "@/components/three/mannequin";

function PathNode({ position, label }: { position: [number, number, number], label: string }) {
  const meshRef = useRef<Mesh>(null);
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.5;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <octahedronGeometry args={[0.2]} />
        <meshStandardMaterial color="#6E1F24" wireframe />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
    </group>
  );
}

function ConnectingLine() {
  return (
    <mesh position={[0, 0, -0.5]} rotation={[0, -0.2, 0]}>
      <boxGeometry args={[4, 0.02, 0.02]} />
      <meshStandardMaterial color="#030303" />
    </mesh>
  );
}

export function UmucoScene() {
  return (
    <ThreeFrame className="h-48 md:h-56" fallback={<div className="h-full w-full bg-paper" />}>
      <ConnectingLine />
      <PathNode position={[-1.5, 0.2, -0.2]} label="01" />
      <PathNode position={[0, -0.1, -0.6]} label="02" />
      <PathNode position={[1.5, 0.3, -0.8]} label="03" />
      
      <group position={[-0.5, -0.2, 0.4]} rotation={[0, 1.2, 0]}>
        <Mannequin pose="look" look={2} hair="bun" accent />
      </group>
    </ThreeFrame>
  );
}
