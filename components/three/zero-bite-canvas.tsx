"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group, Mesh } from "three";
import { ThreeFrame } from "@/components/three/three-frame";
import { ZeroBiteScene } from "@/components/projects/scenes/zero-bite-scene";
import { Mannequin } from "@/components/three/mannequin";
import { Satellite } from "@/components/three/satellite";

function Mosquito({ offset = 0, radius = 1.2 }: { offset?: number; radius?: number }) {
  const ref = useRef<Group>(null);
  const leftWing = useRef<Mesh>(null);
  const rightWing = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() + offset;
    if (!ref.current) return;
    
    // Mosquito tries to get to the center but is blocked by a radius (shield)
    // We animate it bumping against a sphere of `radius`
    
    // Base flight path
    const targetX = Math.sin(t * 1.5) * 1.5;
    const targetZ = Math.cos(t * 1.2) * 1.5;
    const targetY = 0.8 + Math.sin(t * 2) * 0.5;

    // Distance to center (0, 0.4, 0) - where the human is
    const dx = targetX;
    const dy = targetY - 0.4;
    const dz = targetZ;
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

    // If inside shield, push it out
    let finalX = targetX;
    let finalY = targetY;
    let finalZ = targetZ;

    if (dist < radius) {
      // It hit the shield, bounce outward
      const push = (radius - dist) + Math.abs(Math.sin(t * 10)) * 0.1;
      finalX += (dx / dist) * push;
      finalY += (dy / dist) * push;
      finalZ += (dz / dist) * push;
    }

    ref.current.position.x = finalX;
    ref.current.position.y = finalY;
    ref.current.position.z = finalZ;
    
    // Look towards center (where they want to go)
    ref.current.lookAt(0, 0.6, 0);

    // rapid wing flap
    if (leftWing.current && rightWing.current) {
      const flap = Math.sin(t * 80) * 0.6;
      leftWing.current.rotation.z = flap;
      rightWing.current.rotation.z = -flap;
    }
  });

  return (
    <group ref={ref} scale={0.4}>
      <mesh position={[0.15, 0, 0]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial color="#030303" />
      </mesh>
      <mesh position={[0.26, -0.02, 0]} rotation={[0, 0, -0.2]}>
        <cylinderGeometry args={[0.004, 0.008, 0.16, 8]} />
        <meshStandardMaterial color="#030303" />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      <mesh position={[-0.18, 0.02, 0]} rotation={[0, 0, 0.3]}>
        <capsuleGeometry args={[0.05, 0.2, 8, 8]} />
        <meshStandardMaterial color="#6E1F24" />
      </mesh>
      <mesh ref={leftWing} position={[0, 0.08, 0.06]}>
        <boxGeometry args={[0.24, 0.004, 0.08]} />
        <meshStandardMaterial color="#ffffff" opacity={0.6} transparent />
      </mesh>
      <mesh ref={rightWing} position={[0, 0.08, -0.06]}>
        <boxGeometry args={[0.24, 0.004, 0.08]} />
        <meshStandardMaterial color="#ffffff" opacity={0.6} transparent />
      </mesh>
    </group>
  );
}

function Shield() {
  const shieldRef = useRef<Mesh>(null);
  
  useFrame(({ clock }) => {
    if (shieldRef.current) {
      const t = clock.getElapsedTime();
      const material = shieldRef.current.material as import("three").MeshStandardMaterial;
      // Pulse effect on the shield
      material.opacity = 0.15 + Math.sin(t * 2) * 0.05;
    }
  });

  return (
    <mesh ref={shieldRef} position={[0, 0.4, 0]}>
      <sphereGeometry args={[1.2, 32, 32]} />
      <meshStandardMaterial 
        color="#88ccff" 
        transparent 
        opacity={0.2} 
        roughness={0.1}
        metalness={0.1}
        depthWrite={false}
      />
    </mesh>
  );
}

function Terrain() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
      <planeGeometry args={[8, 8, 12, 12]} />
      <meshStandardMaterial color="#ffffff" wireframe transparent opacity={0.15} />
    </mesh>
  );
}

export function ZeroBiteCanvas() {
  return (
    <ThreeFrame className="h-52 md:h-64" fallback={<ZeroBiteScene />}>
      <Terrain />
      
      {/* Human shielded in the center */}
      <group position={[0, -0.1, 0]} rotation={[0, 0.4, 0]}>
        <Mannequin pose="idle" look={0.5} />
      </group>
      
      <Shield />
      
      {/* Mosquitoes trying to get in */}
      <Mosquito offset={0} radius={1.25} />
      <Mosquito offset={4.2} radius={1.25} />
      <Mosquito offset={8.5} radius={1.25} />
      
      {/* Satellite in the sky */}
      <group position={[0, 2, -1]} scale={0.6}>
        <Satellite />
      </group>
    </ThreeFrame>
  );
}
