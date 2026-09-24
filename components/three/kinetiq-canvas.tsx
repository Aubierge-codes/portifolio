"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group, Mesh, MeshStandardMaterial } from "three";
import { ThreeFrame } from "@/components/three/three-frame";
import { KinetiqScene } from "@/components/projects/scenes/kinetiq-scene";
import { Mannequin, walkSpeedFor } from "@/components/three/mannequin";

const TILES = [-1.5, -0.85, -0.2, 0.45, 1.1];
const START_X = -2.15;
const END_X = 1.75;
const WALK_SPEED = 0.72;
const DURATION = (END_X - START_X) / WALK_SPEED;
const LAMP_X = 2.15;

/**
 * A piezo tile. Depresses and glows for a moment when it takes a footstep,
 * then releases — the harvesting event the project is built around.
 */
function Tile({
  x,
  chargeRef
}: {
  x: number;
  chargeRef: React.MutableRefObject<number>;
}) {
  const plate = useRef<Mesh>(null);

  useFrame(() => {
    if (!plate.current) return;
    const c = chargeRef.current;
    plate.current.position.y = 0.02 - c * 0.014;
    const material = plate.current.material as MeshStandardMaterial;
    material.emissiveIntensity = c * 1.4;
  });

  return (
    <group position={[x, 0, 0]}>
      <mesh position={[0, 0.005, 0]}>
        <boxGeometry args={[0.58, 0.01, 0.58]} />
        <meshStandardMaterial color="#2a2d31" roughness={0.9} />
      </mesh>
      <mesh ref={plate} position={[0, 0.02, 0]}>
        <boxGeometry args={[0.52, 0.03, 0.52]} />
        <meshStandardMaterial
          color="#3c4249"
          emissive="#6E1F24"
          emissiveIntensity={0}
          roughness={0.7}
        />
      </mesh>
    </group>
  );
}

/** Charge travelling the bus from the tiles to the lamp. */
function Pulse({ pulseRef }: { pulseRef: React.MutableRefObject<number[]> }) {
  const group = useRef<Group>(null);

  useFrame(() => {
    if (!group.current) return;
    group.current.children.forEach((child, i) => {
      const p = pulseRef.current[i] ?? -1;
      const visible = p >= 0 && p <= 1;
      child.visible = visible;
      if (!visible) return;
      // Runs along the bus from where the step landed to the lamp.
      child.position.x = TILES[i] + (LAMP_X - TILES[i]) * p;
    });
  });

  return (
    <group ref={group} position={[0, -0.075, 0]}>
      {TILES.map((x) => (
        <mesh key={x} position={[x, 0, 0]}>
          <sphereGeometry args={[0.045, 10, 10]} />
          <meshStandardMaterial
            color="#6E1F24"
            emissive="#6E1F24"
            emissiveIntensity={1.6}
            roughness={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

/** Output indicator — brightens as charge arrives, decays between steps. */
function Lamp({ levelRef }: { levelRef: React.MutableRefObject<number> }) {
  const bulb = useRef<Mesh>(null);
  const glow = useRef<Mesh>(null);

  useFrame(() => {
    const level = levelRef.current;
    if (bulb.current) {
      const material = bulb.current.material as MeshStandardMaterial;
      material.emissiveIntensity = 0.15 + level * 2.6;
    }
    if (glow.current) {
      const material = glow.current.material as MeshStandardMaterial;
      material.opacity = level * 0.32;
      const s = 1 + level * 0.5;
      glow.current.scale.set(s, s, s);
    }
  });

  return (
    <group position={[LAMP_X, 0, 0]}>
      <mesh position={[0, 0.16, 0]}>
        <cylinderGeometry args={[0.03, 0.045, 0.32, 10]} />
        <meshStandardMaterial color="#2a2d31" roughness={0.85} />
      </mesh>
      <mesh ref={bulb} position={[0, 0.4, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial
          color="#f6e2c2"
          emissive="#ffc879"
          emissiveIntensity={0.15}
          roughness={0.35}
        />
      </mesh>
      <mesh ref={glow} position={[0, 0.4, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial
          color="#ffc879"
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function Harvest() {
  const walker = useRef<Group>(null);
  const charges = useRef(TILES.map(() => 0));
  const pulses = useRef(TILES.map(() => -1));
  const level = useRef(0);
  const lastTile = useRef(-1);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime() % DURATION;
    const x = START_X + WALK_SPEED * t;
    if (walker.current) {
      walker.current.position.x = x;
      walker.current.rotation.y = Math.PI / 2;
    }

    // Reset once the walker loops back to the start.
    if (x < START_X + 0.1) lastTile.current = -1;

    TILES.forEach((tileX, i) => {
      // Fire when the walker arrives over a tile it hasn't triggered yet.
      if (i > lastTile.current && x >= tileX) {
        lastTile.current = i;
        charges.current[i] = 1;
        pulses.current[i] = 0;
      }
      charges.current[i] = Math.max(0, charges.current[i] - delta * 3.2);
      if (pulses.current[i] >= 0) {
        pulses.current[i] += delta * 1.4;
        if (pulses.current[i] > 1) {
          pulses.current[i] = -1;
          // Charge lands: the lamp steps up.
          level.current = Math.min(1, level.current + 0.34);
        }
      }
    });

    level.current = Math.max(0, level.current - delta * 0.16);
  });

  return (
    <group position={[0, -0.5, 0]}>
      {/* Conduit bus running under the tiles to the lamp. */}
      <mesh position={[(START_X + LAMP_X) / 2, -0.075, 0]}>
        <boxGeometry args={[LAMP_X - START_X, 0.012, 0.012]} />
        <meshStandardMaterial color="#2a2d31" roughness={0.9} />
      </mesh>

      {TILES.map((x, i) => (
        <Tile
          key={x}
          x={x}
          chargeRef={{
            get current() {
              return charges.current[i];
            },
            set current(v: number) {
              charges.current[i] = v;
            }
          }}
        />
      ))}

      <Pulse pulseRef={pulses} />
      <Lamp levelRef={level} />

      <group ref={walker} position={[START_X, 0.035, 0]} scale={0.78}>
        <Mannequin
          pose="walk"
          outfit="slate"
          speed={walkSpeedFor(WALK_SPEED)}
        />
      </group>
    </group>
  );
}

export function KinetiqCanvas() {
  return (
    <ThreeFrame className="h-44 md:h-52" fallback={<KinetiqScene />}>
      <Harvest />
    </ThreeFrame>
  );
}
