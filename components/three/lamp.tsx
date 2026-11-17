"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import {
  AdditiveBlending,
  CatmullRomCurve3,
  CylinderGeometry,
  LatheGeometry,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  SphereGeometry,
  SpriteMaterial,
  TubeGeometry,
  Vector2,
  Vector3,
  type Group,
  type PointLight
} from "three";
import { useModelInteraction } from "@/hooks/use-model-interaction";
import { canvasTexture, materials, MM } from "@/components/three/hardware/kit";
import { StudioLighting } from "@/components/three/studio-lighting";

type LampProps = {
  isOn: boolean;
  onToggle: () => void;
};

/*
 * A contemporary street lamp, in millimetres: plinth, tapered pole, a
 * shepherd's-crook arm and a shallow dome head with a frosted diffuser.
 * Origin is the foot of the pole at ground level; the head reaches toward +x.
 */

const WARM = "#ffcf8a";
const HEAD: [number, number, number] = [840, 3960, 0];
/** Display scale: brings the ~4.1 m lamp to ~2.5 scene units. */
const DISPLAY = 0.06;
/** Shift so the asymmetric silhouette sits centred on the camera's axis. */
const OFFSET: [number, number, number] = [-0.3, -1.24, 0];

const ON_LIGHT = 4.5;
const ON_EMISSIVE = 2.4;
const STANDBY_EMISSIVE = 0.3;
const GLOW_INNER = 0.6;
const GLOW_OUTER = 0.22;
const POOL = 0.55;
const TRANSITION = 4.5; // ~220 ms time constant; settles inside 400-800 ms

/** Raycastable but never drawn. */
const HIT = new MeshBasicMaterial({ colorWrite: false, depthWrite: false });

let geometries: {
  plinth: LatheGeometry;
  pole: CylinderGeometry;
  arm: TubeGeometry;
  shade: LatheGeometry;
  diffuser: CylinderGeometry;
  bulb: SphereGeometry;
} | null = null;

function lampGeometry() {
  geometries ??= {
    plinth: new LatheGeometry(
      [
        new Vector2(0, 0),
        new Vector2(140, 0),
        new Vector2(140, 30),
        new Vector2(112, 62),
        new Vector2(88, 360),
        new Vector2(66, 400),
        new Vector2(0, 400)
      ],
      40
    ),
    pole: new CylinderGeometry(40, 56, 3300, 32, 1, true).translate(
      0,
      400 + 1650,
      0
    ),
    arm: new TubeGeometry(
      new CatmullRomCurve3([
        new Vector3(0, 3640, 0),
        new Vector3(0, 3950, 0),
        new Vector3(90, 4125, 0),
        new Vector3(320, 4185, 0),
        new Vector3(620, 4140, 0),
        new Vector3(HEAD[0], HEAD[1] + 92, 0)
      ]),
      56,
      26,
      14
    ),
    shade: new LatheGeometry(
      [
        new Vector2(0, 98),
        new Vector2(130, 92),
        new Vector2(232, 58),
        new Vector2(274, 14),
        new Vector2(280, 0),
        new Vector2(262, 0),
        new Vector2(226, 42),
        new Vector2(128, 74),
        new Vector2(0, 80)
      ],
      48
    ),
    diffuser: new CylinderGeometry(256, 256, 6, 48),
    bulb: new SphereGeometry(52, 20, 14)
  };
  return geometries;
}

/** Soft pool of light on the ground, drawn once. */
const poolTexture = canvasTexture(256, 256, (ctx, w, h) => {
  const gradient = ctx.createRadialGradient(
    w / 2,
    h / 2,
    0,
    w / 2,
    h / 2,
    w / 2
  );
  gradient.addColorStop(0, "rgba(255, 207, 138, 1)");
  gradient.addColorStop(0.4, "rgba(255, 207, 138, 0.35)");
  gradient.addColorStop(1, "rgba(255, 207, 138, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);
});

export function Lamp({ isOn, onToggle }: LampProps) {
  const groupRef = useRef<Group>(null);
  const lightRef = useRef<PointLight>(null);
  const geometry = lampGeometry();

  const { hovered, handlePointerOver, handlePointerOut, handleClick } =
    useModelInteraction(groupRef, {
      baseScale: MM * DISPLAY,
      hoverScale: 1.03,
      onClick: onToggle
    });

  // Everything that changes with the switch is owned by this lamp, so
  // toggling it never touches the shared materials.
  const owned = useMemo(
    () => ({
      diffuser: new MeshPhysicalMaterial({
        color: "#f4efe6",
        roughness: 0.55,
        emissive: WARM,
        emissiveIntensity: 0
      }),
      bulb: new MeshPhysicalMaterial({
        color: "#fff6e8",
        roughness: 0.2,
        emissive: WARM,
        emissiveIntensity: 0
      }),
      // Soft radial sprites rather than spheres, so the halo has no edge.
      glowInner: new SpriteMaterial({
        map: poolTexture(),
        transparent: true,
        opacity: 0,
        blending: AdditiveBlending,
        depthWrite: false
      }),
      glowOuter: new SpriteMaterial({
        map: poolTexture(),
        transparent: true,
        opacity: 0,
        blending: AdditiveBlending,
        depthWrite: false
      }),
      pool: new MeshBasicMaterial({
        map: poolTexture(),
        transparent: true,
        opacity: 0,
        blending: AdditiveBlending,
        depthWrite: false
      })
    }),
    []
  );
  useEffect(
    () => () => Object.values(owned).forEach((material) => material.dispose()),
    [owned]
  );

  useFrame((_, delta) => {
    const k = 1 - Math.exp(-TRANSITION * delta);
    const standby = hovered && !isOn ? STANDBY_EMISSIVE : 0;
    const emissive = isOn ? ON_EMISSIVE : standby;
    const ease = (value: number, target: number) =>
      value + (target - value) * k;

    owned.diffuser.emissiveIntensity = ease(
      owned.diffuser.emissiveIntensity,
      emissive
    );
    owned.bulb.emissiveIntensity = ease(owned.bulb.emissiveIntensity, emissive);
    owned.glowInner.opacity = ease(
      owned.glowInner.opacity,
      isOn ? GLOW_INNER : 0
    );
    owned.glowOuter.opacity = ease(
      owned.glowOuter.opacity,
      isOn ? GLOW_OUTER : 0
    );
    owned.pool.opacity = ease(owned.pool.opacity, isOn ? POOL : 0);
    if (lightRef.current) {
      lightRef.current.intensity = ease(
        lightRef.current.intensity,
        isOn ? ON_LIGHT : 0
      );
    }
  });

  const onClick = (event: ThreeEvent<MouseEvent>) => handleClick?.(event);
  const below: [number, number, number] = [HEAD[0], HEAD[1] - 60, HEAD[2]];

  return (
    <>
      <StudioLighting intensity={0.7} shadows={false} />
      <group position={OFFSET}>
        <group
          ref={groupRef}
          scale={MM * DISPLAY}
          onClick={onClick}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          {/* Invisible hit areas: the pole alone is a few pixels wide, too
              thin a target to click or tap reliably. */}
          <mesh position={[0, 2000, 0]} material={HIT}>
            <boxGeometry args={[420, 4000, 420]} />
          </mesh>
          <mesh position={[HEAD[0] - 120, HEAD[1], 0]} material={HIT}>
            <boxGeometry args={[900, 500, 600]} />
          </mesh>
          <mesh geometry={geometry.plinth} material={materials().graphite} />
          <mesh geometry={geometry.pole} material={materials().graphite} />
          <mesh geometry={geometry.arm} material={materials().graphite} />
          <group position={HEAD}>
            <mesh geometry={geometry.shade} material={materials().graphite} />
            <mesh
              geometry={geometry.diffuser}
              material={owned.diffuser}
              position={[0, 4, 0]}
            />
            <mesh
              geometry={geometry.bulb}
              material={owned.bulb}
              position={[0, 40, 0]}
            />
          </group>
          <sprite
            material={owned.glowInner}
            position={below}
            scale={[760, 760, 1]}
          />
          <sprite
            material={owned.glowOuter}
            position={below}
            scale={[1800, 1800, 1]}
          />
          <mesh
            material={owned.pool}
            position={[HEAD[0], 4, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[2400, 2400]} />
          </mesh>
          <pointLight
            ref={lightRef}
            position={below}
            intensity={0}
            color={WARM}
            distance={4}
            decay={2}
          />
        </group>
      </group>
    </>
  );
}
