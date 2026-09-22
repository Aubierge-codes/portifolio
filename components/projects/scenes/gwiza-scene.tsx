"use client";

import { ThreeFrame } from "@/components/three/three-frame";
import { Mannequin } from "@/components/three/mannequin";
import { Satellite } from "@/components/three/satellite";

function Bridge() {
  return (
    <mesh position={[0, -0.4, 0]}>
      <boxGeometry args={[4, 0.05, 0.4]} />
      <meshStandardMaterial color="#6E1F24" />
    </mesh>
  );
}

export function GwizaScene() {
  return (
    <ThreeFrame className="h-44 md:h-52" fallback={<div className="h-full w-full bg-paper" />}>
      <Bridge />
      <group position={[-1, -0.4, 0]} rotation={[0, Math.PI / 2, 0]}>
        <Mannequin pose="walk" hair="short" />
      </group>
      <group position={[1, -0.4, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <Mannequin pose="walk" hair="puff" accent />
      </group>
      {/* Add satellite orbiting above the bridge */}
      <Satellite />
    </ThreeFrame>
  );
}
