"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  AdditiveBlending,
  BackSide,
  BufferAttribute,
  CatmullRomCurve3,
  Color,
  MeshPhysicalMaterial,
  SphereGeometry,
  Vector3,
  type Group,
  type LineSegments,
  type Mesh,
  type Sprite
} from "three";
import { roundedBox, unitBox } from "@/components/three/hardware/kit";
import { CAST, Person } from "@/components/world/person";
import {
  Bookshelf,
  Chair,
  Dust,
  GlassPanel,
  Ground,
  Plant,
  roundRect,
  surface,
  useCanvasTexture
} from "@/components/world/props";
import { cloudPuff, softDot } from "@/components/world/textures";

const MAROON = "#6e1f24";
const CORAL = "#eb5a3c";
const INK = "#151413";


// ---------------------------------------------------------------------------
// 06 Zero Bite: a village at dusk, a mosquito in the foreground, and a Raspberry
// Pi sending risk alerts out to a phone.
// ---------------------------------------------------------------------------

export function House({
  position,
  rotation = 0,
  width = 2.4
}: {
  position: [number, number, number];
  rotation?: number;
  width?: number;
}) {
  const walls = useMemo(
    () =>
      new MeshPhysicalMaterial({
        color: "#b98058",
        roughness: 0.95,
        map: surface().concrete.map
      }),
    []
  );
  const roof = useMemo(
    () =>
      new MeshPhysicalMaterial({
        color: "#9a9c9e",
        metalness: 0.7,
        roughness: 0.42
      }),
    []
  );
  useLayoutEffect(
    () => () => {
      walls.dispose();
      roof.dispose();
    },
    [walls, roof]
  );
  const D = 2;
  const H = 1.9;
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh
        geometry={unitBox()}
        material={walls}
        position={[0, H / 2, 0]}
        scale={[width, H, D]}
        castShadow
        receiveShadow
      />
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          geometry={unitBox()}
          material={roof}
          position={[0, H + 0.32, side * 0.55]}
          rotation={[side * 0.52, 0, 0]}
          scale={[width + 0.3, 0.025, 1.3]}
          castShadow
        />
      ))}
      <mesh position={[0.35, 0.6, D / 2 + 0.005]}>
        <planeGeometry args={[0.55, 1.2]} />
        <meshPhysicalMaterial color="#3a2a20" roughness={0.8} />
      </mesh>
      <mesh position={[-0.6, 1.15, D / 2 + 0.005]}>
        <planeGeometry args={[0.45, 0.4]} />
        <meshStandardMaterial
          color="#000"
          emissive="#ffb766"
          emissiveIntensity={1.8}
        />
      </mesh>
      <pointLight
        position={[-0.6, 1.15, D / 2 + 0.5]}
        intensity={1.2}
        distance={3}
        color="#ffb766"
      />
    </group>
  );
}

export function SignalRings({
  from,
  to
}: {
  from: [number, number, number];
  to: [number, number, number];
}) {
  const pulse = useRef<Mesh>(null);
  const curve = useMemo(() => {
    const a = new Vector3(...from);
    const b = new Vector3(...to);
    const mid = a.clone().lerp(b, 0.5);
    mid.y += 1.4;
    return new CatmullRomCurve3([a, mid, b]);
  }, [from, to]);
  useFrame(({ clock }) => {
    if (!pulse.current) return;
    const t = (clock.getElapsedTime() * 0.45) % 1;
    pulse.current.position.copy(curve.getPointAt(t));
  });
  return (
    <group>
      <mesh>
        <tubeGeometry args={[curve, 64, 0.008, 8, false]} />
        <meshStandardMaterial
          color={CORAL}
          emissive={CORAL}
          emissiveIntensity={1.6}
          transparent
          opacity={0.65}
        />
      </mesh>
      <mesh ref={pulse}>
        <sphereGeometry args={[0.045, 16, 12]} />
        <meshStandardMaterial
          color="#fff"
          emissive={CORAL}
          emissiveIntensity={3}
        />
      </mesh>
    </group>
  );
}

export function Hover({
  children,
  radius = 0.25,
  speed = 1
}: {
  children: React.ReactNode;
  radius?: number;
  speed?: number;
}) {
  const ref = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() * speed;
    ref.current.position.set(
      Math.sin(t * 0.9) * radius,
      Math.sin(t * 1.7) * radius * 0.4,
      Math.cos(t * 0.7) * radius * 0.5
    );
    ref.current.rotation.y = Math.sin(t * 0.5) * 0.4 - 0.6;
  });
  return <group ref={ref}>{children}</group>;
}

// ---------------------------------------------------------------------------
// 08 Weather: sky dome, drifting clouds, sun on one side, rain on the other.
// ---------------------------------------------------------------------------

function Sky() {
  const geometry = useMemo(() => {
    const g = new SphereGeometry(32, 48, 24);
    const pos = g.getAttribute("position");
    const colors = new Float32Array(pos.count * 3);
    const top = new Color("#7ea6cf");
    const horizon = new Color("#eef2f3");
    const c = new Color();
    for (let i = 0; i < pos.count; i++) {
      const y = Math.max(0, pos.getY(i) / 32);
      c.copy(horizon).lerp(top, Math.pow(y, 0.6));
      colors.set([c.r, c.g, c.b], i * 3);
    }
    g.setAttribute("color", new BufferAttribute(colors, 3));
    return g;
  }, []);
  useLayoutEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial
        vertexColors
        side={BackSide}
        fog={false}
        depthWrite={false}
      />
    </mesh>
  );
}

function Clouds({ count = 18 }: { count?: number }) {
  const group = useRef<Group>(null);
  const puffs = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: Math.sin(i * 12.9) * 14,
        y: 5.5 + (Math.sin(i * 4.1) * 0.5 + 0.5) * 3,
        z: -6 - (Math.sin(i * 7.7) * 0.5 + 0.5) * 10,
        s: 4 + (Math.sin(i * 2.3) * 0.5 + 0.5) * 5,
        dark: i % 3 === 0 && Math.sin(i * 12.9) > 0
      })),
    [count]
  );
  useFrame((_, delta) => {
    group.current?.children.forEach((child, i) => {
      child.position.x += delta * (0.15 + (i % 4) * 0.05);
      if (child.position.x > 16) child.position.x = -16;
    });
  });
  return (
    <group ref={group}>
      {puffs.map((p, i) => (
        <sprite key={i} position={[p.x, p.y, p.z]} scale={[p.s, p.s * 0.6, 1]}>
          <spriteMaterial
            map={cloudPuff()}
            color={p.dark ? "#9aa3ad" : "#ffffff"}
            transparent
            depthWrite={false}
            opacity={0.95}
            fog={false}
          />
        </sprite>
      ))}
    </group>
  );
}

function Rain({ count = 900 }: { count?: number }) {
  const ref = useRef<LineSegments>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 6);
    for (let i = 0; i < count; i++) {
      const x = -0.6 + (Math.sin(i * 12.9898) * 0.5 + 0.5) * 3.4;
      const y = (Math.sin(i * 78.233) * 0.5 + 0.5) * 6;
      const z = -2 + Math.sin(i * 37.719) * 3;
      arr.set([x, y, z, x - 0.02, y - 0.22, z], i * 6);
    }
    return arr;
  }, [count]);
  useFrame((_, delta) => {
    const attr = ref.current?.geometry.getAttribute("position");
    if (!attr) return;
    const a = attr.array as Float32Array;
    for (let i = 0; i < a.length; i += 3) {
      a[i + 1] -= delta * 7;
      if (a[i + 1] < 0) a[i + 1] += 6;
    }
    attr.needsUpdate = true;
  });
  return (
    <lineSegments ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial color="#9fb2c4" transparent opacity={0.55} />
    </lineSegments>
  );
}

function Sun() {
  const glow = useRef<Sprite>(null);
  useFrame(({ clock }) => {
    if (glow.current)
      glow.current.scale.setScalar(
        5 + Math.sin(clock.getElapsedTime() * 0.6) * 0.3
      );
  });
  return (
    <group position={[-7, 7, -14]}>
      <mesh>
        <sphereGeometry args={[1, 32, 16]} />
        <meshBasicMaterial color="#fff3d6" fog={false} />
      </mesh>
      <sprite ref={glow}>
        <spriteMaterial
          map={softDot()}
          color="#ffd9a0"
          transparent
          opacity={0.8}
          blending={AdditiveBlending}
          depthWrite={false}
          fog={false}
        />
      </sprite>
    </group>
  );
}

function WeatherCard() {
  const map = useCanvasTexture(512, 360, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    roundRect(ctx, 8, 8, w - 16, h - 16, 40);
    ctx.fillStyle = "rgba(255,255,255,0.93)";
    ctx.fill();
    ctx.fillStyle = INK;
    ctx.font = "600 110px sans-serif";
    ctx.fillText("24°", 44, 170);
    ctx.font = "400 30px sans-serif";
    ctx.fillStyle = "rgba(21,20,19,0.6)";
    ctx.fillText("Kigali · Showers later", 48, 230);
    ctx.fillStyle = CORAL;
    ctx.beginPath();
    ctx.arc(w - 110, 120, 46, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(21,20,19,0.12)";
    ctx.fillRect(48, 280, w - 96, 3);
  });
  const ref = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (ref.current)
      ref.current.position.y =
        2.1 + Math.sin(clock.getElapsedTime() * 0.8) * 0.06;
  });
  return (
    <group ref={ref} position={[1.9, 2.1, -0.6]} rotation={[0, -0.2, 0]}>
      <GlassPanel width={0.9} height={0.63} map={map} glow={1.1} />
    </group>
  );
}

export function WeatherSet() {
  const wet = useMemo(
    () =>
      new MeshPhysicalMaterial({
        color: "#c9ccce",
        roughness: 0.22,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        map: surface().concrete.map
      }),
    []
  );
  useLayoutEffect(() => () => wet.dispose(), [wet]);
  return (
    <group>
      <Sky />
      <Sun />
      <Clouds />
      <mesh rotation={[-Math.PI / 2, 0, 0]} material={wet} receiveShadow>
        <circleGeometry args={[12, 64]} />
      </mesh>
      <Rain />
      <WeatherCard />
      {/* A walker under an umbrella, stepping out of the rain. */}
      <group position={[0.7, 0, 0.5]} rotation={[0, -0.4, 0]}>
        <Person
          look={CAST.ines}
          pose="umbrella"
          holding="umbrella"
          phase={1.6}
        />
      </group>
      <group position={[-1.6, 0, -1.0]}>
        <Plant scale={2} seed={44} />
      </group>
    </group>
  );
}

// ---------------------------------------------------------------------------
// 09 Bookstore: shelves, a reading chair and a quiet reader under a warm lamp.
// ---------------------------------------------------------------------------

function Rug() {
  const map = useCanvasTexture(512, 512, (ctx, w, h) => {
    ctx.fillStyle = "#e7dfd2";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = MAROON;
    ctx.lineWidth = 10;
    ctx.strokeRect(30, 30, w - 60, h - 60);
    ctx.strokeStyle = "rgba(21,20,19,0.5)";
    ctx.lineWidth = 3;
    ctx.strokeRect(56, 56, w - 112, h - 112);
    for (let i = 0; i < 4000; i++) {
      ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.05})`;
      ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2);
    }
  });
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0.006, 0.3]}
      receiveShadow
    >
      <planeGeometry args={[2.6, 2]} />
      <meshPhysicalMaterial
        map={map}
        roughness={1}
        sheen={0.6}
        sheenColor="#ffffff"
      />
    </mesh>
  );
}

function Armchair() {
  const fabric = useMemo(
    () =>
      new MeshPhysicalMaterial({
        color: "#c9b79c",
        roughness: 0.9,
        sheen: 0.8,
        sheenColor: new Color("#fff4e0")
      }),
    []
  );
  useLayoutEffect(() => () => fabric.dispose(), [fabric]);
  return (
    <group>
      <mesh
        geometry={roundedBox(0.8, 0.22, 0.75, 0.06)}
        material={fabric}
        position={[0, 0.36, 0]}
        castShadow
      />
      <mesh
        geometry={roundedBox(0.8, 0.7, 0.18, 0.07)}
        material={fabric}
        position={[0, 0.72, -0.3]}
        castShadow
      />
      {[-1, 1].map((s) => (
        <mesh
          key={s}
          geometry={roundedBox(0.14, 0.38, 0.72, 0.05)}
          material={fabric}
          position={[s * 0.4, 0.52, 0]}
          castShadow
        />
      ))}
      {[-1, 1].flatMap((x) =>
        [-1, 1].map((z) => (
          <mesh
            key={`${x}${z}`}
            geometry={unitBox()}
            material={surface().woodDark}
            position={[x * 0.33, 0.12, z * 0.3]}
            scale={[0.04, 0.24, 0.04]}
          />
        ))
      )}
    </group>
  );
}

export function BookstoreSet() {
  return (
    <group>
      <Ground radius={8} material="wood" />
      <Rug />
      <group position={[0, 0, -2.2]}>
        <Bookshelf width={2.4} rows={5} seed={1} />
      </group>
      <group position={[-2.4, 0, -0.9]} rotation={[0, 0.9, 0]}>
        <Bookshelf width={2} rows={5} seed={2} />
      </group>
      <group position={[2.4, 0, -0.9]} rotation={[0, -0.9, 0]}>
        <Bookshelf width={2} rows={5} seed={4} />
      </group>
      <group position={[0, 0, 0.2]} rotation={[0, 0.25, 0]}>
        <Armchair />
        <group position={[0, -0.05, 0.08]}>
          <Person look={CAST.amara} pose="read" holding="book" phase={2.2} />
        </group>
      </group>
      {/* Floor lamp. */}
      <group position={[0.85, 0, -0.1]}>
        <mesh position={[0, 0.8, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 1.6, 8]} />
          <meshPhysicalMaterial color={INK} metalness={0.6} roughness={0.35} />
        </mesh>
        <mesh position={[0, 1.62, 0]}>
          <cylinderGeometry args={[0.12, 0.2, 0.22, 32, 1, true]} />
          <meshPhysicalMaterial
            color="#f3ebdc"
            roughness={0.7}
            side={2}
            emissive="#ffcf8a"
            emissiveIntensity={0.6}
          />
        </mesh>
        <pointLight
          position={[0, 1.5, 0]}
          intensity={2.4}
          distance={4}
          color="#ffd8a8"
          castShadow={false}
        />
      </group>
      <group position={[-0.9, 0, 0.4]}>
        <Chair />
      </group>
      <Dust count={140} spread={[6, 3, 5]} color="#ffe9c8" />
    </group>
  );
}

// ---------------------------------------------------------------------------
// 10 Java: class structures floating in space, joined by their relationships.
// ---------------------------------------------------------------------------

const CLASSES: { name: string; at: [number, number, number] }[] = [
  { name: "Student", at: [-1.4, 1.8, 0] },
  { name: "Repository", at: [0.2, 2.5, -0.6] },
  { name: "Account", at: [1.6, 1.6, 0.2] },
  { name: "Saver", at: [0.4, 1.0, 0.8] },
  { name: "Serializable", at: [-0.2, 3.2, -1.4] }
];
const RELATIONS: [number, number][] = [
  [0, 1],
  [2, 1],
  [3, 2],
  [1, 4],
  [0, 3]
];

function ClassBlock({
  name,
  at,
  index
}: {
  name: string;
  at: [number, number, number];
  index: number;
}) {
  const ref = useRef<Group>(null);
  const map = useCanvasTexture(512, 512, (ctx, w, h) => {
    ctx.fillStyle = "rgba(255,255,255,0.96)";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = index === 4 ? MAROON : INK;
    ctx.fillRect(0, 0, w, 120);
    ctx.fillStyle = "#fff";
    ctx.font = `600 ${name.length > 10 ? 50 : 62}px sans-serif`;
    ctx.fillText(name, 34, 82);
    ctx.fillStyle = "rgba(21,20,19,0.25)";
    [180, 230, 280].forEach((y, i) =>
      ctx.fillRect(34, y, [300, 360, 240][i], 16)
    );
    ctx.fillStyle = "rgba(21,20,19,0.12)";
    ctx.fillRect(34, 330, w - 68, 3);
    [380, 430].forEach((y, i) => ctx.fillRect(34, y, [380, 280][i], 16));
  });
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.position.set(
      at[0],
      at[1] + Math.sin(t * 0.6 + index) * 0.08,
      at[2]
    );
    ref.current.rotation.y = Math.sin(t * 0.25 + index) * 0.35;
  });
  return (
    <group ref={ref}>
      <mesh castShadow>
        <boxGeometry args={[0.62, 0.62, 0.62]} />
        <meshPhysicalMaterial
          map={map}
          roughness={0.25}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
    </group>
  );
}

export function JavaSet() {
  return (
    <group>
      <Ground radius={8} material="concrete" />
      {CLASSES.map((c, i) => (
        <ClassBlock key={c.name} name={c.name} at={c.at} index={i} />
      ))}
      {RELATIONS.map(([a, b]) => {
        const from = new Vector3(...CLASSES[a].at);
        const to = new Vector3(...CLASSES[b].at);
        const curve = new CatmullRomCurve3([
          from,
          from
            .clone()
            .lerp(to, 0.5)
            .add(new Vector3(0, 0.2, 0)),
          to
        ]);
        return (
          <mesh key={`${a}-${b}`}>
            <tubeGeometry args={[curve, 32, 0.008, 8, false]} />
            <meshStandardMaterial
              color={b === 4 ? MAROON : INK}
              emissive={b === 4 ? MAROON : "#000"}
              emissiveIntensity={0.6}
            />
          </mesh>
        );
      })}
      {/* A plinth so the composition has a floor to cast onto. */}
      <mesh
        geometry={roundedBox(3.6, 0.1, 2.4, 0.03)}
        material={surface().ceramic}
        position={[0.1, 0.05, -0.2]}
        receiveShadow
        castShadow
      />
      <Dust count={120} spread={[6, 4, 5]} />
    </group>
  );
}
