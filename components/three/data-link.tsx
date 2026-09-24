"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { CatmullRomCurve3, Vector3, type Group, type Mesh } from "three";

/**
 * A signal path between two pieces of hardware: a slack cable with packets
 * running along it in one direction, so the bench reads as a pipeline
 * (microcontroller -> computing -> output) rather than three unrelated props
 * sharing a table.
 *
 * Deliberately one thin line per hop with a shallow sag — the brief here is a
 * legible route, not a loom of wires.
 */
export function DataLink({
  from,
  to,
  sag = 0.22,
  packets = 2,
  speed = 0.32,
  colour = "#6E1F24"
}: {
  from: [number, number, number];
  to: [number, number, number];
  sag?: number;
  packets?: number;
  speed?: number;
  colour?: string;
}) {
  const group = useRef<Group>(null);

  const curve = useMemo(() => {
    const a = new Vector3(...from);
    const b = new Vector3(...to);
    const mid = a.clone().lerp(b, 0.5);
    mid.y -= sag;
    return new CatmullRomCurve3([a, mid, b]);
  }, [from, to, sag]);

  const tube = useMemo(() => curve, [curve]);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    group.current.children.forEach((child, i) => {
      const p = (t * speed + i / packets) % 1;
      const point = curve.getPointAt(p);
      child.position.copy(point);
      // Fade in and out at the ends so packets don't pop at the connectors.
      const mesh = child as Mesh;
      const scale = Math.sin(p * Math.PI) * 0.9 + 0.1;
      mesh.scale.setScalar(scale);
    });
  });

  return (
    <group>
      <mesh>
        <tubeGeometry args={[tube, 24, 0.008, 6, false]} />
        <meshStandardMaterial color="#2f343a" roughness={0.9} />
      </mesh>
      <group ref={group}>
        {Array.from({ length: packets }).map((_, i) => (
          <mesh key={i}>
            <sphereGeometry args={[0.028, 8, 8]} />
            <meshStandardMaterial
              color={colour}
              emissive={colour}
              emissiveIntensity={1.2}
              roughness={0.4}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
