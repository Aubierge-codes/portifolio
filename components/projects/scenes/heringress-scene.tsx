"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";
import { ThreeFrame } from "@/components/three/three-frame";
import { Mannequin } from "@/components/three/mannequin";

function FloatingPapers({ count = 4 }: { count?: number }) {
  const groupRef = useRef<Group>(null);
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        child.position.y = Math.sin(t * 1.2 + i) * 0.2 + (i * 0.1);
        child.rotation.y = t * 0.5 + i;
        child.rotation.z = Math.sin(t * 0.8 + i) * 0.2;
      });
    }
  });

  return (
    <group ref={groupRef} position={[0.8, 0.5, -0.5]}>
      {Array.from({ length: count }).map((_, i) => (
        <mesh key={i} position={[i * 0.2 - 0.3, i * 0.1, i * -0.2]}>
          <boxGeometry args={[0.3, 0.4, 0.01]} />
          <meshStandardMaterial color="#ffffff" />
          {/* Paper lines */}
          <mesh position={[0, 0.1, 0.006]}>
            <boxGeometry args={[0.2, 0.02, 0.002]} />
            <meshStandardMaterial color="#6E1F24" />
          </mesh>
          <mesh position={[0, 0, 0.006]}>
            <boxGeometry args={[0.2, 0.02, 0.002]} />
            <meshStandardMaterial color="#111111" />
          </mesh>
          <mesh position={[0, -0.1, 0.006]}>
            <boxGeometry args={[0.15, 0.02, 0.002]} />
            <meshStandardMaterial color="#111111" />
          </mesh>
        </mesh>
      ))}
    </group>
  );
}

export function HerIngressScene({ papers }: { papers?: string[] }) {
  return (
    <ThreeFrame className="h-48 md:h-56" fallback={<div className="h-full w-full bg-paper" />}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#f4f4f4" />
      </mesh>
      
      <FloatingPapers count={papers?.length || 4} />
      
      <group position={[-0.5, -0.1, 0.5]} rotation={[0, 0.4, 0]}>
        <Mannequin pose="look" look={4} carry="laptop" hair="puff" />
      </group>
    </ThreeFrame>
  );
}
