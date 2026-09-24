"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group, Mesh, MeshBasicMaterial } from "three";
import { ThreeFrame } from "@/components/three/three-frame";
import { Mannequin } from "@/components/three/mannequin";

const CLAY = "#8a5a3c";
const WOVEN = "#c9b393";
const PLINTH = "#20232a";

/**
 * Heritage objects on display. These are deliberately generic vessel and
 * lidded-basket silhouettes — enough to read as cultural artefacts being kept
 * and studied, without claiming to depict any specific named object. The
 * project is about preservation and learning, so the scene shows a small
 * collection being tended rather than asserting provenance it can't back up.
 */
function Vessel() {
  return (
    <group>
      <mesh position={[0, 0.13, 0]}>
        <sphereGeometry args={[0.13, 16, 14]} />
        <meshStandardMaterial color={CLAY} roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.055, 0.08, 0.09, 14]} />
        <meshStandardMaterial color={CLAY} roughness={0.95} />
      </mesh>
    </group>
  );
}

function LiddedBasket() {
  return (
    <group>
      <mesh position={[0, 0.09, 0]}>
        <cylinderGeometry args={[0.12, 0.085, 0.18, 16]} />
        <meshStandardMaterial color={WOVEN} roughness={1} />
      </mesh>
      {/* Tall conical lid — the shape that makes it read as a basket, not a pot. */}
      <mesh position={[0, 0.29, 0]}>
        <coneGeometry args={[0.125, 0.24, 16]} />
        <meshStandardMaterial color={WOVEN} roughness={1} />
      </mesh>
      <mesh position={[0, 0.185, 0]}>
        <torusGeometry args={[0.122, 0.008, 6, 18]} />
        <meshStandardMaterial color="#6E1F24" roughness={0.85} />
      </mesh>
    </group>
  );
}

function Bowl() {
  return (
    <mesh position={[0, 0.07, 0]} rotation={[Math.PI, 0, 0]}>
      <sphereGeometry args={[0.12, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshStandardMaterial color={CLAY} roughness={0.95} side={2} />
    </mesh>
  );
}

function Plinth({
  x,
  children
}: {
  x: number;
  children: React.ReactNode;
}) {
  return (
    <group position={[x, 0, 0]}>
      <mesh position={[0, 0.16, 0]}>
        <boxGeometry args={[0.36, 0.32, 0.36]} />
        <meshStandardMaterial color={PLINTH} roughness={0.9} />
      </mesh>
      <group position={[0, 0.32, 0]}>{children}</group>
    </group>
  );
}

/**
 * Knowledge moving between the two figures: a soft mote that travels from the
 * one explaining toward the one listening, then repeats. The "passing forward"
 * the project is named for.
 */
function Transmission() {
  const ref = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const p = (clock.getElapsedTime() * 0.32) % 1;
    ref.current.position.x = 1.25 - p * 2.5;
    ref.current.position.y = 0.95 + Math.sin(p * Math.PI) * 0.16;
    const material = ref.current.material as MeshBasicMaterial;
    material.opacity = Math.sin(p * Math.PI) * 0.7;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.035, 10, 10]} />
      <meshBasicMaterial color="#c98a4b" transparent opacity={0} />
    </mesh>
  );
}

function Collection() {
  return (
    <group position={[0, -0.62, 0]}>
      <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5.5, 0.012]} />
        <meshStandardMaterial color="#111110" />
      </mesh>

      <Plinth x={-0.62}>
        <Vessel />
      </Plinth>
      <Plinth x={0.1}>
        <LiddedBasket />
      </Plinth>
      <Plinth x={0.82}>
        <Bowl />
      </Plinth>

      <Transmission />

      {/* One explaining, one listening — culture handed on, not just stored. */}
      <group position={[-1.5, 0, 0.5]} rotation={[0, 0.9, 0]} scale={0.74}>
        <Mannequin pose="reach" hair="bun" outfit="sand" accent />
      </group>
      <group position={[1.55, 0, 0.45]} rotation={[0, -1.0, 0]} scale={0.74}>
        <Mannequin pose="look" look={2} hair="puff" outfit="slate" />
      </group>
    </group>
  );
}

export function UmucoScene() {
  return (
    <ThreeFrame
      className="h-48 md:h-56"
      fallback={<div className="h-full w-full bg-paper" />}
    >
      <Collection />
    </ThreeFrame>
  );
}
