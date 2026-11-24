"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  BufferAttribute,
  CanvasTexture,
  PlaneGeometry,
  Color,
  MeshPhysicalMaterial,
  SRGBColorSpace,
  type Group
} from "three";
import { Mosquito } from "@/components/three/mosquito";
import { RaspberryPiModel } from "@/components/three/raspberry-pi-model";
import { roundedBox, unitBox } from "@/components/three/hardware/kit";
import { CAST, Person } from "@/components/world/person";
import { Dust, Plant, surface } from "@/components/world/props";
import { House, Hover, SignalRings } from "@/components/world/scenes-b";
import { ChapterLabel } from "@/components/world/chapter-label";
import { worldState, type RiskLayer } from "@/components/world/world-state";

/*
 * 06 Zero Bite: malaria-risk exploration in Gisagara. Satellite and reanalysis
 * data (ERA5, Open-Meteo) are draped over the village as a grid the visitor can
 * switch between rainfall, temperature and the model's relative-risk index;
 * a Raspberry Pi field station sends alerts by SMS. The overlay copy states
 * plainly that this is risk exploration, not a diagnosis.
 */

const COLS = 26;
const ROWS = 16;
const CELL = 0.46;

/** Deterministic illustrative fields over the village area, 0..1. */
function fields(cx: number, cz: number) {
  // A seasonal stream runs diagonally through the low ground.
  const stream =
    Math.exp(-((cz - 0.35 * cx - 0.4) ** 2) / 0.9) +
    0.8 * Math.exp(-((cx + 2.2) ** 2 + (cz - 0.9) ** 2) / 1.2) +
    0.6 * Math.exp(-((cx - 2.4) ** 2 + (cz + 1.6) ** 2) / 1.5);
  const rain = Math.min(
    1,
    0.35 + 0.35 * Math.sin(cx * 0.35 + 1) + 0.3 * stream
  );
  const temp = Math.min(
    1,
    0.55 + 0.25 * Math.cos(cz * 0.5) - 0.2 * stream + 0.08 * Math.sin(cx)
  );
  const risk = Math.min(
    1,
    Math.max(0, 0.15 + 0.55 * stream * rain + 0.35 * temp * rain)
  );
  return { rain, temp, risk };
}

const PALETTE: Record<RiskLayer, [Color, Color]> = {
  rain: [new Color("#9db4c8"), new Color("#2e5372")],
  temp: [new Color("#e8b98f"), new Color("#b4482a")],
  risk: [new Color("#d98a7a"), new Color("#6e1f24")]
};

/**
 * The data layer: a heatmap draped over the ground as per-vertex colour and
 * alpha. Opacity rises with the value, so low readings fade into the earth
 * and the map reads as data rather than floor tiles. Rewritten only when the
 * visitor switches layer.
 */
function DataGrid() {
  const shown = useRef<RiskLayer | null>(null);
  const geometry = useMemo(() => {
    const g = new PlaneGeometry(COLS * CELL, ROWS * CELL, COLS * 2, ROWS * 2);
    g.rotateX(-Math.PI / 2);
    g.translate(0, 0.012, -0.6);
    const count = g.getAttribute("position").count;
    g.setAttribute(
      "color",
      new BufferAttribute(new Float32Array(count * 4), 4)
    );
    return g;
  }, []);
  useLayoutEffect(() => () => geometry.dispose(), [geometry]);
  const c = useMemo(() => new Color(), []);

  useFrame(() => {
    const layer = worldState.zeroBiteLayer;
    if (shown.current === layer) return;
    shown.current = layer;
    const [lo, hi] = PALETTE[layer];
    const pos = geometry.getAttribute("position");
    const col = geometry.getAttribute("color") as BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const v = Math.min(
        1,
        Math.max(0, fields(pos.getX(i), pos.getZ(i))[layer])
      );
      c.copy(lo).lerp(hi, v);
      col.setXYZW(i, c.r, c.g, c.b, Math.pow(v, 1.4) * 0.9);
    }
    col.needsUpdate = true;
  });

  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial
        vertexColors
        transparent
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

/** An earth-observation satellite crossing the sky, with a faint scan. */
function Satellite() {
  const ref = useRef<Group>(null);
  const panel = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 96;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#1b2540";
      ctx.fillRect(0, 0, 256, 96);
      ctx.strokeStyle = "rgba(190,205,230,0.35)";
      for (let x = 0; x <= 256; x += 16) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 96);
        ctx.stroke();
      }
      for (let y = 0; y <= 96; y += 16) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(256, y);
        ctx.stroke();
      }
    }
    const t = new CanvasTexture(canvas);
    t.colorSpace = SRGBColorSpace;
    return t;
  }, []);
  const foil = useMemo(
    () =>
      new MeshPhysicalMaterial({
        color: "#c9a34a",
        metalness: 1,
        roughness: 0.38,
        clearcoat: 0.6
      }),
    []
  );
  useLayoutEffect(
    () => () => {
      panel.dispose();
      foil.dispose();
    },
    [panel, foil]
  );

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = (clock.getElapsedTime() * 0.025) % 1;
    ref.current.position.set(
      -7 + t * 14,
      5.4 + Math.sin(t * Math.PI) * 0.6,
      -2.6
    );
    ref.current.rotation.y = 0.3;
  });

  return (
    <group ref={ref}>
      <mesh
        geometry={roundedBox(0.5, 0.42, 0.42, 0.03)}
        material={foil}
        castShadow
      />
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 0.78, 0, 0]}>
          <mesh
            geometry={unitBox()}
            material={surface().steel}
            position={[-s * 0.25, 0, 0]}
            scale={[0.16, 0.02, 0.02]}
          />
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.9, 0.34]} />
            <meshPhysicalMaterial
              map={panel}
              metalness={0.4}
              roughness={0.25}
              clearcoat={1}
              side={2}
            />
          </mesh>
        </group>
      ))}
      <mesh position={[0, -0.28, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.12, 0.12, 24, 1, true]} />
        <meshPhysicalMaterial
          color="#e9e6e0"
          metalness={0.6}
          roughness={0.3}
          side={2}
        />
      </mesh>
      {/* Scan footprint: barely there, so it reads as sensing, not a laser. */}
      <mesh position={[0, -2.9, 0]}>
        <coneGeometry args={[1.4, 5.2, 32, 1, true]} />
        <meshBasicMaterial
          color="#eb5a3c"
          transparent
          opacity={0.045}
          depthWrite={false}
          side={2}
        />
      </mesh>
    </group>
  );
}

export function ZeroBiteSet() {
  const earth = useMemo(
    () =>
      new MeshPhysicalMaterial({
        color: "#a98663",
        roughness: 1,
        map: surface().concrete.map
      }),
    []
  );
  useLayoutEffect(() => () => earth.dispose(), [earth]);
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} material={earth} receiveShadow>
        <circleGeometry args={[11, 64]} />
      </mesh>
      <DataGrid />
      <House position={[-3.4, 0, -3.6]} rotation={0.35} />
      <House position={[1.6, 0, -4.4]} rotation={-0.2} width={2.8} />
      <House position={[4.9, 0, -2.4]} rotation={-0.9} width={2} />
      {[
        [-1.6, -3.4],
        [3.6, -3.6],
        [-5, -1.2]
      ].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <Plant
            scale={3.2 + (i % 2) * 0.6}
            seed={i + 30}
            pot={false}
            sway={2}
          />
        </group>
      ))}
      {/* Field station: a Raspberry Pi in an open case on a post. */}
      <group position={[-0.6, 0, 0.6]}>
        <mesh
          geometry={unitBox()}
          material={surface().woodDark}
          position={[0, 0.5, 0]}
          scale={[0.08, 1, 0.08]}
          castShadow
        />
        <mesh
          geometry={roundedBox(0.5, 0.06, 0.4, 0.015)}
          material={surface().ceramic}
          position={[0, 1.02, 0]}
          castShadow
        />
        <group position={[0, 1.05, 0]}>
          <RaspberryPiModel scale={0.22} />
        </group>
      </group>
      <SignalRings from={[-0.4, 1.55, 0.45]} to={[1.45, 1.25, 0.95]} />
      <group position={[1.7, 0, 1.05]} rotation={[0, -2.2, 0]}>
        <Person look={CAST.eric} pose="read" holding="tablet" phase={0.8} />
      </group>
      <mesh position={[1.7, 0.23, 1.05]}>
        <boxGeometry args={[0.42, 0.46, 0.42]} />
        <meshPhysicalMaterial color="#6d5340" roughness={0.9} />
      </mesh>
      <Satellite />
      <group position={[1.4, 1.8, 0.2]}>
        <Hover radius={0.3} speed={1.3}>
          <Mosquito scale={1.1} />
        </Hover>
      </group>
      <ChapterLabel at={[-0.6, 1.95, 0.6]}>
        Raspberry Pi · field station
      </ChapterLabel>
      <ChapterLabel at={[-2.6, 0.3, 1.6]}>Rainfall · ERA5</ChapterLabel>
      <ChapterLabel at={[2.6, 0.3, -0.4]}>
        Temperature · Open-Meteo
      </ChapterLabel>
      <ChapterLabel at={[1.7, 1.75, 1.05]}>
        SMS alert · Africa&apos;s Talking
      </ChapterLabel>
      <Dust
        count={140}
        spread={[10, 4, 8]}
        color="#ffd9a8"
        size={0.04}
        opacity={0.4}
      />
    </group>
  );
}
