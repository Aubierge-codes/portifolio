"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import {
  CanvasTexture,
  CatmullRomCurve3,
  SRGBColorSpace,
  Vector3,
  type Group,
  type Mesh,
  type MeshStandardMaterial
} from "three";
import { roundedBox, unitBox } from "@/components/three/hardware/kit";
import { NodeMcu, PiezoDisc } from "@/components/three/hardware/nodemcu";
import { CAST, Person, strideRate } from "@/components/world/person";
import { Dust, Ground, surface } from "@/components/world/props";
import { ChapterLabel } from "@/components/world/chapter-label";
import { playClick } from "@/lib/sound";

/*
 * 07 KinetiQ: Piezo Energy Rwanda, as the real system works. A footstep presses
 * a tile, the piezo disc under it produces a voltage spike, the NodeMCU
 * ESP-12E reads it, and the reading lands on a Streamlit-style dashboard,
 * while the harvested charge lights a small LED lamp. Only the project's own
 * hardware appears: piezo discs, a NodeMCU, wiring and a dashboard.
 */

const TILES = [-2.2, -1.45, -0.7, 0.05, 0.8];
const TILE_Z = 1.1;
const MCU: [number, number, number] = [-0.35, 0.9, -0.55];
const SCREEN: [number, number, number] = [0.55, 1.25, -0.62];
const HISTORY = 160;

/** Shared, mutable signal state: written by steps and clicks, read per frame. */
function useSignal() {
  return useMemo(
    () => ({
      tile: TILES.map(() => 0),
      pulses: [] as { tile: number; t: number }[],
      charge: 0.15,
      energy: 0,
      trace: new Float32Array(HISTORY),
      head: 0
    }),
    []
  );
}
type Signal = ReturnType<typeof useSignal>;

function press(signal: Signal, i: number) {
  if (signal.tile[i] > 0.6) return;
  signal.tile[i] = 1;
  signal.pulses.push({ tile: i, t: 0 });
  // A step yields a spike of a few volts; harvested energy is tiny (mJ).
  signal.energy += 0.6 + Math.random() * 0.25;
}

function Wire({
  from,
  to,
  lift = 0.02
}: {
  from: [number, number, number];
  to: [number, number, number];
  lift?: number;
}) {
  const curve = useMemo(() => {
    const a = new Vector3(...from);
    const b = new Vector3(...to);
    const mid = a.clone().lerp(b, 0.5);
    mid.y = Math.min(a.y, b.y) + lift;
    return new CatmullRomCurve3([a, mid, b]);
  }, [from, to, lift]);
  return (
    <mesh>
      <tubeGeometry args={[curve, 40, 0.006, 6, false]} />
      <meshStandardMaterial color="#2c2f34" roughness={0.7} />
    </mesh>
  );
}

function Tiles({ signal }: { signal: Signal }) {
  const plates = useRef<(Mesh | null)[]>([]);
  useFrame((_, delta) => {
    signal.tile.forEach((v, i) => {
      signal.tile[i] = Math.max(0, v - delta * 2.2);
      const plate = plates.current[i];
      if (!plate) return;
      // A 1.4 mm press, and a glow only while the disc is producing.
      plate.position.y = 0.035 - signal.tile[i] * 0.0014 * 8;
      (plate.material as MeshStandardMaterial).emissiveIntensity =
        signal.tile[i] * 1.8;
    });
  });
  const click = (i: number) => (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    press(signal, i);
    playClick(0.8 + i * 0.08);
  };
  const hover = (on: boolean) => () => {
    document.body.style.cursor = on ? "pointer" : "auto";
  };
  return (
    <group position={[0, 0, TILE_Z]}>
      {TILES.map((x, i) => (
        <group
          key={x}
          position={[x, 0, 0]}
          onClick={click(i)}
          onPointerOver={hover(true)}
          onPointerOut={hover(false)}
        >
          <mesh
            geometry={roundedBox(0.66, 0.03, 0.66, 0.01)}
            material={surface().ink}
            position={[0, 0.015, 0]}
            receiveShadow
          />
          {/* The disc sits under a frosted top plate, visible through it. */}
          <group position={[0, 0.031, 0]}>
            <PiezoDisc scale={0.4} />
          </group>
          <mesh
            ref={(m) => void (plates.current[i] = m)}
            position={[0, 0.035, 0]}
            receiveShadow
          >
            <boxGeometry args={[0.6, 0.008, 0.6]} />
            <meshStandardMaterial
              color="#c9cbce"
              transparent
              opacity={0.55}
              roughness={0.35}
              emissive="#eb5a3c"
              emissiveIntensity={0}
            />
          </mesh>
          <Wire
            from={[0.3, 0.01, -0.3]}
            to={[MCU[0] - x, 0.01, MCU[2] - TILE_Z + 0.25]}
          />
        </group>
      ))}
    </group>
  );
}

/** Energy packets: tile -> NodeMCU along the floor wire, then USB to the screen. */
function Pulses({ signal }: { signal: Signal }) {
  const group = useRef<Group>(null);
  const routes = useMemo(
    () =>
      TILES.map(
        (x) =>
          new CatmullRomCurve3([
            new Vector3(x + 0.3, 0.02, TILE_Z - 0.3),
            new Vector3((x + MCU[0]) / 2, 0.02, (TILE_Z + MCU[2]) / 2),
            new Vector3(MCU[0], 0.02, MCU[2] + 0.25),
            new Vector3(MCU[0], MCU[1] + 0.02, MCU[2] + 0.06),
            new Vector3(SCREEN[0], SCREEN[1] - 0.25, SCREEN[2])
          ])
      ),
    []
  );
  const v = useMemo(() => new Vector3(), []);
  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    signal.pulses.forEach((p) => (p.t += delta * 0.55));
    while (signal.pulses.length && signal.pulses[0].t > 1)
      signal.pulses.shift();
    g.children.forEach((child, i) => {
      const p = signal.pulses[i];
      child.visible = !!p;
      if (p)
        child.position.copy(routes[p.tile].getPointAt(Math.min(1, p.t), v));
    });
  });
  return (
    <group ref={group}>
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} visible={false}>
          <sphereGeometry args={[0.025, 12, 10]} />
          <meshStandardMaterial
            color="#fff"
            emissive="#eb5a3c"
            emissiveIntensity={3}
          />
        </mesh>
      ))}
    </group>
  );
}

/** The dashboard: voltage trace, harvested energy, step count, drawn live. */
function Dashboard({ signal }: { signal: Signal }) {
  const { canvas, texture } = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 768;
    c.height = 448;
    const t = new CanvasTexture(c);
    t.colorSpace = SRGBColorSpace;
    return { canvas: c, texture: t };
  }, []);
  useLayoutEffect(() => () => texture.dispose(), [texture]);
  const tick = useRef(0);

  useFrame((_, delta) => {
    // Sample the summed tile output into the trace; redraw ~8 times a second.
    const v =
      signal.tile.reduce((a, b) => a + b * b, 0) * 3.2 + Math.random() * 0.06;
    signal.trace[signal.head % HISTORY] = v;
    signal.head++;
    tick.current += delta;
    if (tick.current < 0.12) return;
    tick.current = 0;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    ctx.fillStyle = "#fbfaf8";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#151413";
    ctx.font = "600 30px sans-serif";
    ctx.fillText("Piezo output", 36, 56);
    ctx.font = "400 18px monospace";
    ctx.fillStyle = "rgba(21,20,19,0.5)";
    ctx.fillText("NodeMCU ESP-12E · A0 · live", 36, 86);
    ctx.strokeStyle = "rgba(21,20,19,0.1)";
    for (let y = 130; y < h - 110; y += 50) {
      ctx.beginPath();
      ctx.moveTo(36, y);
      ctx.lineTo(w - 36, y);
      ctx.stroke();
    }
    ctx.strokeStyle = "#6e1f24";
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let i = 0; i < HISTORY; i++) {
      const val = signal.trace[(signal.head + i) % HISTORY];
      const x = 36 + (i / (HISTORY - 1)) * (w - 72);
      const y = h - 130 - Math.min(1, val / 4) * 190;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.fillStyle = "#151413";
    ctx.font = "600 40px sans-serif";
    ctx.fillText(`${signal.energy.toFixed(1)} mJ`, 36, h - 44);
    ctx.font = "400 18px monospace";
    ctx.fillStyle = "rgba(21,20,19,0.55)";
    ctx.fillText("harvested this session", 36, h - 16);
    ctx.fillStyle = "#eb5a3c";
    ctx.fillRect(w - 236, h - 70, 200 * Math.min(1, signal.charge), 18);
    ctx.strokeStyle = "rgba(21,20,19,0.3)";
    ctx.strokeRect(w - 236, h - 70, 200, 18);
    texture.needsUpdate = true;
  });

  return (
    <group position={SCREEN} rotation={[-0.06, -0.3, 0]}>
      <mesh
        geometry={roundedBox(0.8, 0.5, 0.03, 0.01)}
        material={surface().ink}
      />
      <mesh position={[0, 0, 0.016]}>
        <planeGeometry args={[0.76, 0.445]} />
        <meshStandardMaterial
          color="#000"
          emissive="#fff"
          emissiveMap={texture}
          emissiveIntensity={1.1}
        />
      </mesh>
      <mesh
        geometry={unitBox()}
        material={surface().steel}
        position={[0, -0.36, -0.03]}
        scale={[0.04, 0.24, 0.04]}
      />
    </group>
  );
}

/** The load: an LED lamp whose brightness follows the stored charge. */
function Lamp({ signal }: { signal: Signal }) {
  const bulb = useRef<MeshStandardMaterial>(null);
  useFrame((_, delta) => {
    const add = signal.tile.reduce((a, b) => a + b, 0) * delta * 0.35;
    signal.charge = Math.max(
      0.12,
      Math.min(1, signal.charge + add - delta * 0.05)
    );
    if (bulb.current) bulb.current.emissiveIntensity = signal.charge * 4;
  });
  return (
    <group position={[1.7, 0, 0.2]}>
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.015, 0.025, 1.4, 12]} />
        <meshPhysicalMaterial color="#151413" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.44, 0]}>
        <sphereGeometry args={[0.08, 24, 16]} />
        <meshStandardMaterial
          ref={bulb}
          color="#fff8ee"
          emissive="#ffcf8a"
          emissiveIntensity={0.6}
        />
      </mesh>
      <Wire
        from={[0, 0.01, 0]}
        to={[MCU[0] - 1.7, 0.01, MCU[2] - 0.2 + 0.25]}
      />
    </group>
  );
}

function Walker({ signal }: { signal: Signal }) {
  const ref = useRef<Group>(null);
  const span = TILES[TILES.length - 1] - TILES[0] + 1.3;
  const duration = 7.5;
  useFrame(({ clock }) => {
    const raw = (clock.getElapsedTime() % (duration * 2)) / duration;
    const forward = raw < 1;
    const x = TILES[0] - 0.65 + (forward ? raw : 2 - raw) * span;
    if (ref.current) {
      ref.current.position.set(x, 0, TILE_Z);
      ref.current.rotation.y = forward ? Math.PI / 2 : -Math.PI / 2;
    }
    TILES.forEach((tx, i) => {
      if (Math.abs(x - tx) < 0.18) press(signal, i);
    });
  });
  return (
    <group ref={ref}>
      <Person
        look={CAST.nadia}
        pose="walk"
        speed={strideRate(span / duration)}
      />
    </group>
  );
}

export function KinetiqSet() {
  const signal = useSignal();
  const s = surface();
  return (
    <group>
      <Ground radius={8} material="concrete" />
      {/* Workbench with the NodeMCU, USB-wired to the dashboard. */}
      <group position={[0, 0, -0.6]}>
        <mesh
          geometry={roundedBox(2.0, 0.06, 0.8, 0.012)}
          material={s.wood}
          position={[0, 0.87, 0]}
          castShadow
          receiveShadow
        />
        {[-0.92, 0.92].map((x) => (
          <mesh
            key={x}
            geometry={unitBox()}
            material={s.steel}
            position={[x, 0.435, 0]}
            scale={[0.05, 0.87, 0.7]}
            castShadow
          />
        ))}
      </group>
      <group position={MCU}>
        <NodeMcu scale={0.3} />
      </group>
      <Wire
        from={[MCU[0] - 0.12, MCU[1] + 0.02, MCU[2]]}
        to={[SCREEN[0] - 0.1, 0.92, SCREEN[2] + 0.05]}
        lift={0.01}
      />
      <Tiles signal={signal} />
      <Pulses signal={signal} />
      <Dashboard signal={signal} />
      <Lamp signal={signal} />
      <Walker signal={signal} />
      <ChapterLabel at={[TILES[1], 0.12, TILE_Z + 0.45]}>
        Piezo tile · tap one
      </ChapterLabel>
      <ChapterLabel at={[MCU[0], MCU[1] + 0.12, MCU[2]]}>
        NodeMCU ESP-12E
      </ChapterLabel>
      <ChapterLabel at={[SCREEN[0], SCREEN[1] + 0.33, SCREEN[2]]}>
        Streamlit dashboard
      </ChapterLabel>
      <ChapterLabel at={[1.7, 1.62, 0.2]}>LED load</ChapterLabel>
      <Dust count={110} spread={[7, 3, 6]} />
    </group>
  );
}
