"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";

export function Satellite() {
  const rootRef = useRef<Group>(null);
  const panelRef = useRef<Group>(null);
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (rootRef.current) {
      // Orbiting motion
      rootRef.current.position.x = Math.sin(t * 0.4) * 2.5;
      rootRef.current.position.z = Math.cos(t * 0.4) * 2.5;
      rootRef.current.position.y = 1.8 + Math.sin(t * 0.8) * 0.3;
      // Look forward along orbit
      rootRef.current.rotation.y = t * 0.4 + Math.PI;
    }
    
    if (panelRef.current) {
      panelRef.current.rotation.x = t * 0.2; // slow panel rotation
    }
  });

  return (
    <group ref={rootRef} scale={0.4}>
      {/* Main Body */}
      <mesh>
        <cylinderGeometry args={[0.2, 0.2, 0.6, 12]} />
        <meshStandardMaterial color="#6E1F24" />
      </mesh>
      {/* Dish */}
      <mesh position={[0, 0.35, 0]} rotation={[0, 0, 0]}>
        <sphereGeometry args={[0.25, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#dddddd" side={2} />
      </mesh>
      {/* Antenna */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.4, 8]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      {/* Panels Group */}
      <group ref={panelRef}>
        <mesh position={[-0.7, 0, 0]}>
          <boxGeometry args={[1, 0.02, 0.3]} />
          <meshStandardMaterial color="#1a2e3a" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0.7, 0, 0]}>
          <boxGeometry args={[1, 0.02, 0.3]} />
          <meshStandardMaterial color="#1a2e3a" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Connection bars */}
        <mesh position={[-0.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
          <meshStandardMaterial color="#888888" />
        </mesh>
        <mesh position={[0.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
          <meshStandardMaterial color="#888888" />
        </mesh>
      </group>
    </group>
  );
}
