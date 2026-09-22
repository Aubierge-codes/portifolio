"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group, Mesh } from "three";
import { ThreeFrame } from "@/components/three/three-frame";
import { ZeroBiteScene } from "@/components/projects/scenes/zero-bite-scene";

function Mosquito() {
  const ref = useRef<Group>(null);
  const wing = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (!ref.current) return;
    ref.current.position.x = Math.sin(t * 0.9) * 1.4 + Math.sin(t * 2.4) * 0.2;
    ref.current.position.y = 0.9 + Math.sin(t * 1.7) * 0.35 + Math.cos(t * 0.8) * 0.1;
    ref.current.position.z = Math.cos(t * 0.7) * 0.6;
    ref.current.rotation.y = Math.sin(t * 1.2) * 0.5;
    if (wing.current) {
      wing.current.rotation.z = Math.sin(t * 28) * 0.55;
    }
  });

  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial color="#030303" />
      </mesh>
      <mesh position={[0.18, 0, 0]} rotation={[0, 0, 0.4]}>
        <coneGeometry args={[0.04, 0.22, 8]} />
        <meshStandardMaterial color="#030303" />
      </mesh>
      <mesh ref={wing} position={[0, 0.08, 0]}>
        <boxGeometry args={[0.28, 0.01, 0.12]} />
        <meshStandardMaterial color="#6E1F24" />
      </mesh>
    </group>
  );
}

function Graph() {
  return (
    <mesh position={[0, 0.2, 0]}>
      <boxGeometry args={[2.4, 0.02, 0.02]} />
      <meshStandardMaterial color="#6E1F24" />
    </mesh>
  );
}

function Terrain() {
  return (
    <mesh rotation={[-Math.PI / 2.4, 0, 0]} position={[0, -0.4, 0]}>
      <planeGeometry args={[5.2, 2.4, 8, 4]} />
      <meshStandardMaterial color="#ffffff" wireframe />
    </mesh>
  );
}

export function ZeroBiteCanvas() {
  return (
    <ThreeFrame className="h-52 md:h-64" fallback={<ZeroBiteScene />}>
      <Terrain />
      <Graph />
      <Mosquito />
      <mesh position={[-1.2, 0.2, 0]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#030303" />
      </mesh>
      <mesh position={[0.8, 0.35, 0.2]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#6E1F24" />
      </mesh>
    </ThreeFrame>
  );
}
