"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import type { Mesh } from "three";
import { ThreeFrame } from "@/components/three/three-frame";
import { KinetiqScene } from "@/components/projects/scenes/kinetiq-scene";

function PiezoRig() {
  const disc = useRef<Mesh>(null);
  const weight = useRef<Mesh>(null);
  const [active, setActive] = useState(false);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (weight.current) {
      weight.current.position.y = 1.15 + Math.abs(Math.sin(t * 2.4)) * 0.55;
    }
    if (disc.current) {
      const squash = active ? 0.18 : 0.08;
      disc.current.scale.y = 1 + Math.sin(t * (active ? 18 : 6)) * squash;
    }
  });

  return (
    <group onClick={() => setActive((value) => !value)}>
      <mesh ref={disc} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 0.08, 32]} />
        <meshStandardMaterial color="#030303" />
      </mesh>
      <mesh ref={weight} position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color="#6E1F24" />
      </mesh>
      <mesh position={[0, -0.35, 0]}>
        <boxGeometry args={[2.2, 0.06, 0.08]} />
        <meshStandardMaterial color="#030303" />
      </mesh>
    </group>
  );
}

export function KinetiqCanvas() {
  return (
    <ThreeFrame className="h-44 md:h-52" fallback={<KinetiqScene />}>
      <PiezoRig />
    </ThreeFrame>
  );
}
