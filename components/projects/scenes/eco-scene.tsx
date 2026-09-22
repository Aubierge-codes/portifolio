"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";
import { ThreeFrame } from "@/components/three/three-frame";
import { Mannequin } from "@/components/three/mannequin";

function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.4, 8]} />
        <meshStandardMaterial color="#4A3B32" />
      </mesh>
      <mesh position={[0, 0.6, 0]}>
        <coneGeometry args={[0.3, 0.6, 8]} />
        <meshStandardMaterial color="#2E4A28" />
      </mesh>
      <mesh position={[0, 0.8, 0]}>
        <coneGeometry args={[0.25, 0.5, 8]} />
        <meshStandardMaterial color="#3A5F33" />
      </mesh>
    </group>
  );
}

function FloatingLeaves() {
  const groupRef = useRef<Group>(null);
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 0.5) * 0.1;
      groupRef.current.children.forEach((child, i) => {
        child.rotation.x = t * (0.2 + i * 0.1);
        child.rotation.y = t * (0.3 + i * 0.1);
      });
    }
  });

  return (
    <group ref={groupRef} position={[0, 1.2, 0]}>
      {[[-1, 0, 0], [0.5, 0.2, -0.5], [1.2, -0.1, 0.4]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <boxGeometry args={[0.06, 0.01, 0.04]} />
          <meshStandardMaterial color="#6E1F24" />
        </mesh>
      ))}
    </group>
  );
}

export function EcoScene() {
  return (
    <ThreeFrame className="h-44 md:h-52" fallback={<div className="h-full w-full bg-paper" />}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <planeGeometry args={[10, 10, 8, 8]} />
        <meshStandardMaterial color="#7A8B74" wireframe />
      </mesh>
      
      <Tree position={[-1.4, -0.1, -1]} />
      <Tree position={[1.2, -0.1, -0.5]} />
      <Tree position={[2.0, -0.1, -1.2]} />
      
      <FloatingLeaves />
      
      <group position={[0, -0.1, 0.8]} rotation={[0, -Math.PI / 4, 0]}>
        <Mannequin pose="walk" hair="bun" />
      </group>
    </ThreeFrame>
  );
}
