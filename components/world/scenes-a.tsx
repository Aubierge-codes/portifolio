"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  BufferAttribute,
  CatmullRomCurve3,
  Color,
  IcosahedronGeometry,
  MeshPhysicalMaterial,
  Object3D,
  PlaneGeometry,
  Vector3,
  type Group,
  type InstancedMesh,
  type Mesh
} from "three";
import { LaptopModel } from "@/components/three/laptop-model";
import {
  roundedBox,
  unitBox,
  unitCylinder
} from "@/components/three/hardware/kit";
import { CAST, Person, strideRate, type Look } from "@/components/world/person";
import {
  Bookshelf,
  Chair,
  Desk,
  Dust,
  GlassPanel,
  Ground,
  Plant,
  roundRect,
  surface,
  useCanvasTexture
} from "@/components/world/props";
import { imigongo } from "@/components/world/textures";

const MAROON = "#6e1f24";
const CORAL = "#eb5a3c";
const INK = "#151413";

// ---------------------------------------------------------------------------
// 01 HerIngress: a young woman at her desk, opportunities orbiting her, and an
// AI assistant answering beside the laptop.
// ---------------------------------------------------------------------------

const OPPORTUNITIES = [
  ["Scholarship", "Closes in 12 days"],
  ["Hackathon", "Kigali · Teams of 4"],
  ["Fellowship", "Women in STEM"],
  ["Internship", "Frontend · Remote"],
  ["Summer camp", "Mathematics"]
];

function OpportunityCard({ index }: { index: number }) {
  const ref = useRef<Group>(null);
  const [title, line] = OPPORTUNITIES[index];
  const map = useCanvasTexture(512, 320, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    roundRect(ctx, 6, 6, w - 12, h - 12, 28);
    ctx.fillStyle = "rgba(255,255,255,0.92)";
    ctx.fill();
    ctx.strokeStyle = "rgba(110,31,36,0.35)";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = MAROON;
    roundRect(ctx, 40, 40, 150, 34, 17);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "600 20px sans-serif";
    ctx.fillText("MATCH", 74, 64);
    ctx.fillStyle = INK;
    ctx.font = "600 46px sans-serif";
    ctx.fillText(title, 40, 150);
    ctx.fillStyle = "rgba(21,20,19,0.55)";
    ctx.font = "400 28px sans-serif";
    ctx.fillText(line, 40, 200);
    ctx.fillStyle = CORAL;
    ctx.beginPath();
    ctx.arc(w - 64, 64, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(21,20,19,0.12)";
    ctx.fillRect(40, 240, w - 80, 3);
  });

  useFrame(({ clock, camera }) => {
    if (!ref.current) return;
    const t =
      clock.getElapsedTime() * 0.12 +
      (index / OPPORTUNITIES.length) * Math.PI * 2;
    const radius = 1.25;
    ref.current.position.set(
      Math.cos(t) * radius,
      1.45 + Math.sin(t * 2.3 + index) * 0.12 + index * 0.07,
      Math.sin(t) * radius * 0.7 - 0.3
    );
    // Always turned to the viewer, so the card reads rather than mirroring.
    ref.current.lookAt(camera.position);
  });

  return (
    <group ref={ref}>
      <GlassPanel width={0.42} height={0.26} map={map} glow={1.1} />
    </group>
  );
}

function ChatBubble() {
  const dots = useRef<Group>(null);
  const map = useCanvasTexture(512, 360, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    roundRect(ctx, 8, 8, w - 16, h - 16, 40);
    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.fill();
    ctx.fillStyle = MAROON;
    ctx.beginPath();
    ctx.arc(64, 70, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "700 22px sans-serif";
    ctx.fillText("A", 56, 78);
    ctx.fillStyle = INK;
    ctx.font = "600 30px sans-serif";
    ctx.fillText("Asha", 104, 80);
    ctx.fillStyle = "rgba(21,20,19,0.75)";
    ctx.font = "400 27px sans-serif";
    ctx.fillText("Three matches for you.", 48, 150);
    ctx.fillText("The fellowship closes soon.", 48, 192);
  });

  useFrame(({ clock }) => {
    const group = dots.current;
    if (!group) return;
    const t = clock.getElapsedTime();
    group.children.forEach((child, i) => {
      child.position.y = Math.max(0, Math.sin(t * 5 - i * 0.7)) * 0.02;
    });
  });

  return (
    <group position={[0.75, 1.32, 0.15]} rotation={[0, -0.5, 0]}>
      <GlassPanel width={0.5} height={0.35} map={map} glow={1.15} />
      <group ref={dots} position={[-0.17, -0.115, 0.01]}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[i * 0.035, 0, 0]}>
            <sphereGeometry args={[0.009, 12, 8]} />
            <meshStandardMaterial
              color={CORAL}
              emissive={CORAL}
              emissiveIntensity={0.8}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export function HerIngressSet() {
  return (
    <group>
      <Ground radius={8} material="wood" />
      <group position={[0, 0, 0]}>
        <Desk width={1.5} depth={0.75} />
        {/* Laptop turned toward her. */}
        <group position={[0.05, 0.758, 0.05]} rotation={[0, Math.PI + 0.45, 0]}>
          <LaptopModel scale={0.1} />
        </group>
        <group position={[-0.58, 0.758, 0.12]}>
          <Plant scale={0.55} seed={2} />
        </group>
        <mesh
          geometry={unitCylinder(20)}
          material={surface().ceramic}
          position={[0.55, 0.805, -0.12]}
          scale={[0.04, 0.095, 0.04]}
          castShadow
        />
        <group position={[0, 0, -0.62]}>
          <Chair />
          <group position={[0, 0, 0.12]}>
            <Person look={CAST.amara} pose="type" phase={0.4} />
          </group>
        </group>
      </group>
      {OPPORTUNITIES.map((_, i) => (
        <OpportunityCard key={i} index={i} />
      ))}
      <ChatBubble />
      <group position={[-1.9, 0, -2.3]} rotation={[0, 0.35, 0]}>
        <Bookshelf width={1.6} rows={5} seed={5} />
      </group>
      <group position={[2.1, 0, -1.6]}>
        <Plant scale={1.6} seed={7} />
      </group>
      <Dust count={140} spread={[6, 3, 6]} />
    </group>
  );
}

// ---------------------------------------------------------------------------
// 02 UMUCOCore: terraced green hills, pins on the places that hold stories, an
// imigongo panel, and people out exploring.
// ---------------------------------------------------------------------------

function hillHeight(x: number, z: number) {
  const h =
    Math.sin(x * 0.22) * Math.cos(z * 0.19) * 1.6 +
    Math.sin(x * 0.53 + 1.3) * Math.sin(z * 0.47 + 0.4) * 0.6 +
    Math.cos((x + z) * 0.11) * 0.9 +
    0.5;
  // Keep the centre of the set calm and walkable.
  const d = Math.min(1, Math.hypot(x, z * 1.2) / 6);
  return h * d * d;
}

function Terrain() {
  const geometry = useMemo(() => {
    const g = new PlaneGeometry(56, 56, 140, 140);
    g.rotateX(-Math.PI / 2);
    const pos = g.getAttribute("position");
    const colors = new Float32Array(pos.count * 3);
    const low = new Color("#6f8f4e");
    const high = new Color("#9db36a");
    const terrace = new Color("#4f6e3a");
    const path = new Color("#b49a72");
    const c = new Color();
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const y = hillHeight(x, z);
      pos.setY(i, y);
      c.copy(low).lerp(high, Math.min(1, Math.max(0, y / 3)));
      // Terraces: contour bands cut into the slopes.
      if (y > 0.3 && Math.abs(((y * 4) % 1) - 0.5) < 0.07) c.lerp(terrace, 0.7);
      // A winding footpath through the valley.
      if (
        Math.abs(z - Math.sin(x * 0.35) * 1.4 - 1.2) < 0.35 &&
        Math.abs(x) < 9
      )
        c.lerp(path, 0.8);
      colors.set([c.r, c.g, c.b], i * 3);
    }
    g.setAttribute("color", new BufferAttribute(colors, 3));
    g.computeVertexNormals();
    return g;
  }, []);
  useLayoutEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <mesh geometry={geometry} receiveShadow>
      <meshPhysicalMaterial
        vertexColors
        roughness={0.95}
        sheen={0.4}
        sheenColor="#d8e8b0"
      />
    </mesh>
  );
}

const treeScratch = new Object3D();
function Trees({ count = 260 }: { count?: number }) {
  const canopy = useRef<InstancedMesh>(null);
  const trunks = useRef<InstancedMesh>(null);
  const spots = useMemo(() => {
    const out: [number, number, number, number][] = [];
    let i = 0;
    while (out.length < count && i < count * 6) {
      i++;
      const x = Math.sin(i * 12.9898) * 26;
      const z = Math.sin(i * 78.233) * 26;
      if (Math.hypot(x, z) < 6.5) continue;
      const s = 0.55 + (Math.sin(i * 3.1) * 0.5 + 0.5) * 0.8;
      out.push([x, hillHeight(x, z), z, s]);
    }
    return out;
  }, [count]);

  useLayoutEffect(() => {
    spots.forEach(([x, y, z, s], i) => {
      treeScratch.position.set(x, y + 0.9 * s, z);
      treeScratch.scale.set(s * 0.75, s * 0.9, s * 0.75);
      treeScratch.rotation.set(0, i, 0);
      treeScratch.updateMatrix();
      canopy.current?.setMatrixAt(i, treeScratch.matrix);
      treeScratch.position.set(x, y + 0.3 * s, z);
      treeScratch.scale.set(0.06 * s, 0.6 * s, 0.06 * s);
      treeScratch.updateMatrix();
      trunks.current?.setMatrixAt(i, treeScratch.matrix);
    });
    if (canopy.current) canopy.current.instanceMatrix.needsUpdate = true;
    if (trunks.current) trunks.current.instanceMatrix.needsUpdate = true;
  }, [spots]);

  const canopyGeometry = useMemo(() => new IcosahedronGeometry(0.7, 1), []);
  const canopyMaterial = useMemo(
    () =>
      new MeshPhysicalMaterial({
        color: "#3f6236",
        roughness: 0.8,
        sheen: 0.6,
        sheenColor: new Color("#a8c88a"),
        flatShading: true
      }),
    []
  );
  useLayoutEffect(
    () => () => {
      canopyGeometry.dispose();
      canopyMaterial.dispose();
    },
    [canopyGeometry, canopyMaterial]
  );

  return (
    <>
      <instancedMesh
        ref={canopy}
        args={[canopyGeometry, canopyMaterial, spots.length]}
        castShadow
      />
      <instancedMesh
        ref={trunks}
        args={[unitCylinder(6), surface().woodDark, spots.length]}
      />
    </>
  );
}

function StoryPin({
  position,
  delay = 0
}: {
  position: [number, number, number];
  delay?: number;
}) {
  const ring = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    if (!ring.current) return;
    const t = (clock.getElapsedTime() * 0.6 + delay) % 1;
    ring.current.scale.setScalar(0.2 + t * 1.2);
    (ring.current.material as MeshPhysicalMaterial).opacity = (1 - t) * 0.6;
  });
  return (
    <group position={position}>
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.018, 0.006, 0.9, 10]} />
        <meshPhysicalMaterial color={INK} roughness={0.35} clearcoat={0.6} />
      </mesh>
      <mesh position={[0, 0.95, 0]} castShadow>
        <sphereGeometry args={[0.1, 24, 16]} />
        <meshPhysicalMaterial
          color={MAROON}
          roughness={0.25}
          clearcoat={1}
          emissive={MAROON}
          emissiveIntensity={0.25}
        />
      </mesh>
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.32, 0.36, 48]} />
        <meshPhysicalMaterial
          color={CORAL}
          transparent
          opacity={0.5}
          depthWrite={false}
          emissive={CORAL}
          emissiveIntensity={0.6}
        />
      </mesh>
    </group>
  );
}

const PINS: [number, number, number][] = [
  [-3.2, 0, -1.4],
  [2.6, 0, -2.2],
  [0.4, 0, 2.6],
  [4.1, 0, 1.4]
];

function Walker({
  look,
  from,
  to,
  duration,
  phase = 0
}: {
  look: Look;
  from: [number, number];
  to: [number, number];
  duration: number;
  phase?: number;
}) {
  const ref = useRef<Group>(null);
  const dist = Math.hypot(to[0] - from[0], to[1] - from[1]);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const raw = ((clock.getElapsedTime() + phase) % (duration * 2)) / duration;
    const forward = raw < 1;
    const t = forward ? raw : 2 - raw;
    const x = from[0] + (to[0] - from[0]) * t;
    const z = from[1] + (to[1] - from[1]) * t;
    ref.current.position.set(x, hillHeight(x, z), z);
    const heading = Math.atan2(to[0] - from[0], to[1] - from[1]);
    ref.current.rotation.y = forward ? heading : heading + Math.PI;
  });
  return (
    <group ref={ref}>
      <Person
        look={look}
        pose="walk"
        speed={strideRate(dist / duration)}
        phase={phase}
      />
    </group>
  );
}

function Basket({ position }: { position: [number, number, number] }) {
  // Agaseke: the tall woven basket with its pointed lid.
  return (
    <group position={position}>
      <mesh position={[0, 0.16, 0]} castShadow>
        <cylinderGeometry args={[0.11, 0.08, 0.32, 24]} />
        <meshPhysicalMaterial color="#d9c49a" roughness={0.8} sheen={0.5} />
      </mesh>
      <mesh position={[0, 0.16, 0]}>
        <cylinderGeometry args={[0.112, 0.082, 0.05, 24]} />
        <meshPhysicalMaterial color={MAROON} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.42, 0]} castShadow>
        <coneGeometry args={[0.11, 0.22, 24]} />
        <meshPhysicalMaterial color="#d9c49a" roughness={0.8} sheen={0.5} />
      </mesh>
    </group>
  );
}

export function UmucoSet() {
  return (
    <group>
      <Terrain />
      <Trees />
      {PINS.map(([x, , z], i) => (
        <StoryPin
          key={i}
          position={[x, hillHeight(x, z), z]}
          delay={i * 0.27}
        />
      ))}
      {/* Imigongo panel on a low plinth: the culture at the centre of the map. */}
      <group position={[-0.6, 0, -0.6]} rotation={[0, 0.35, 0]}>
        <mesh
          geometry={roundedBox(1.9, 0.12, 0.5, 0.03)}
          material={surface().concrete}
          position={[0, 0.06, 0]}
          receiveShadow
          castShadow
        />
        <mesh position={[0, 0.82, 0]} castShadow>
          <boxGeometry args={[1.6, 1.4, 0.08]} />
          <meshPhysicalMaterial
            map={imigongo()}
            roughness={0.75}
            bumpMap={imigongo()}
            bumpScale={1.5}
          />
        </mesh>
      </group>
      <Basket position={[0.9, 0, -0.4]} />
      <Basket position={[1.15, 0, -0.65]} />
      <Walker look={CAST.keza} from={[-4, 1.6]} to={[3.5, 0.6]} duration={11} />
      <Walker
        look={CAST.david}
        from={[3.8, 2.4]}
        to={[-2.5, 2.2]}
        duration={13}
        phase={4}
      />
      <group
        position={[1.7, hillHeight(1.7, 0.6), 0.6]}
        rotation={[0, -0.6, 0]}
      >
        <Person look={CAST.nadia} pose="point" phase={1.2} gaze={0.2} />
      </group>
      <Dust count={90} spread={[14, 5, 14]} size={0.05} opacity={0.35} />
    </group>
  );
}

// ---------------------------------------------------------------------------
// 03 Gwiza: recruiters at their desks, candidates arriving, and the matches
// between them drawn as glowing lines.
// ---------------------------------------------------------------------------

function MatchLine({
  from,
  to,
  delay = 0
}: {
  from: [number, number, number];
  to: [number, number, number];
  delay?: number;
}) {
  const packet = useRef<Mesh>(null);
  const curve = useMemo(() => {
    const a = new Vector3(...from);
    const b = new Vector3(...to);
    const mid = a.clone().lerp(b, 0.5);
    mid.y += 0.55;
    return new CatmullRomCurve3([a, mid, b]);
  }, [from, to]);
  useFrame(({ clock }) => {
    if (!packet.current) return;
    const t = (clock.getElapsedTime() * 0.35 + delay) % 1;
    packet.current.position.copy(curve.getPointAt(t));
    packet.current.scale.setScalar(0.4 + Math.sin(t * Math.PI) * 0.8);
  });
  return (
    <group>
      <mesh>
        <tubeGeometry args={[curve, 48, 0.006, 8, false]} />
        <meshStandardMaterial
          color={CORAL}
          emissive={CORAL}
          emissiveIntensity={1.4}
          transparent
          opacity={0.75}
        />
      </mesh>
      <mesh ref={packet}>
        <sphereGeometry args={[0.03, 12, 10]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive={CORAL}
          emissiveIntensity={3}
        />
      </mesh>
    </group>
  );
}

export function GwizaSet() {
  const recruiters: { x: number; look: keyof typeof CAST }[] = [
    { x: -1.9, look: "david" },
    { x: 0, look: "ines" }
  ];
  const candidates: {
    pos: [number, number];
    look: keyof typeof CAST;
    pose: "idle" | "talk" | "wave";
  }[] = [
    { pos: [-1.3, 1.2], look: "keza", pose: "talk" },
    { pos: [0.7, 1.5], look: "eric", pose: "idle" },
    { pos: [2.1, 1.0], look: "nadia", pose: "wave" }
  ];
  return (
    <group>
      <Ground radius={8} material="wood" />
      {recruiters.map(({ x, look }, i) => (
        <group key={x} position={[x, 0, -0.6]}>
          <Desk width={1.3} depth={0.7} />
          <group position={[0, 0.758, 0.05]} rotation={[0, 0.45, 0]}>
            <LaptopModel scale={0.1} />
          </group>
          <group position={[0, 0, -0.6]}>
            <Chair />
            <group position={[0, 0, 0.12]}>
              <Person look={CAST[look]} pose="type" phase={i * 1.7} />
            </group>
          </group>
        </group>
      ))}
      {candidates.map(({ pos, look, pose }, i) => (
        <group
          key={look}
          position={[pos[0], 0, pos[1]]}
          rotation={[0, Math.PI + (pos[0] > 0 ? 0.3 : -0.2), 0]}
        >
          <Person look={CAST[look]} pose={pose} phase={i * 2.1} />
        </group>
      ))}
      <MatchLine from={[-1.9, 1.5, -1.0]} to={[-1.3, 1.6, 1.2]} />
      <MatchLine from={[0, 1.5, -1.0]} to={[0.7, 1.6, 1.5]} delay={0.4} />
      <MatchLine from={[0, 1.5, -1.0]} to={[2.1, 1.6, 1.0]} delay={0.7} />
      {/* Glass partition and greenery at the back of the office. */}
      <mesh position={[0.6, 1.2, -2.6]}>
        <boxGeometry args={[5.5, 2.4, 0.03]} />
        <meshPhysicalMaterial
          color="#e8eef0"
          roughness={0.08}
          transparent
          opacity={0.22}
          clearcoat={1}
        />
      </mesh>
      <mesh
        geometry={unitBox()}
        material={surface().steel}
        position={[0.6, 2.42, -2.6]}
        scale={[5.5, 0.04, 0.05]}
      />
      {[-2.6, 3.4].map((x, i) => (
        <group key={x} position={[x, 0, -2.2]}>
          <Plant scale={1.7} seed={i + 11} />
        </group>
      ))}
      <Dust count={110} spread={[7, 3, 6]} />
    </group>
  );
}

// ---------------------------------------------------------------------------
// 04 Velora: a premium product on a turntable in a softbox studio.
// ---------------------------------------------------------------------------

function VeloraDevice() {
  const ref = useRef<Group>(null);
  const screen = useCanvasTexture(600, 1200, (ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#fbfaf8");
    g.addColorStop(1, "#f1ede6");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = INK;
    ctx.font = "600 64px sans-serif";
    ctx.fillText("Velora", 56, 170);
    ctx.fillStyle = MAROON;
    ctx.fillRect(56, 210, 120, 8);
    ctx.fillStyle = "rgba(21,20,19,0.18)";
    [300, 340, 380].forEach((y, i) =>
      ctx.fillRect(56, y, [440, 380, 300][i], 14)
    );
    roundRect(ctx, 56, 470, w - 112, 420, 36);
    ctx.fillStyle = "#e9e3d8";
    ctx.fill();
    ctx.fillStyle = CORAL;
    ctx.beginPath();
    ctx.arc(w / 2, 680, 90, 0, Math.PI * 2);
    ctx.fill();
    roundRect(ctx, 56, 960, 220, 84, 42);
    ctx.fillStyle = INK;
    ctx.fill();
  });

  useFrame(({ clock }) => {
    // Sweeps rather than spins, so the screen stays toward the camera.
    if (ref.current)
      ref.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.35) * 0.7;
  });

  return (
    <group ref={ref} position={[0, 0.32, 0]}>
      <group position={[0, 0.34, 0]} scale={0.8}>
        <mesh geometry={roundedBox(0.4, 0.82, 0.04, 0.05, 4)} castShadow>
          <meshPhysicalMaterial
            color="#3a3c40"
            metalness={0.9}
            roughness={0.25}
          />
        </mesh>
        <mesh position={[0, 0, 0.0205]}>
          <planeGeometry args={[0.37, 0.79]} />
          <meshPhysicalMaterial
            color="#000"
            emissive="#ffffff"
            emissiveMap={screen}
            emissiveIntensity={1.2}
            roughness={0.08}
            clearcoat={1}
          />
        </mesh>
        <mesh position={[0, 0, -0.0205]} rotation={[0, Math.PI, 0]}>
          <circleGeometry args={[0.035, 32]} />
          <meshPhysicalMaterial
            color={MAROON}
            metalness={0.4}
            roughness={0.3}
            clearcoat={1}
          />
        </mesh>
      </group>
    </group>
  );
}

function Softbox({
  position,
  rotation,
  intensity = 2.2
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  intensity?: number;
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <planeGeometry args={[1.1, 1.5]} />
        <meshStandardMaterial
          color="#000"
          emissive="#fff6ea"
          emissiveIntensity={intensity}
          side={2}
        />
      </mesh>
      <mesh position={[0, 0, -0.08]}>
        <boxGeometry args={[1.18, 1.58, 0.14]} />
        <meshPhysicalMaterial color="#1c1c1e" roughness={0.6} />
      </mesh>
      <mesh position={[0, -1.4, -0.1]}>
        <cylinderGeometry args={[0.015, 0.015, 1.6, 8]} />
        <meshPhysicalMaterial
          color="#2c2f34"
          metalness={0.7}
          roughness={0.35}
        />
      </mesh>
    </group>
  );
}

export function VeloraSet() {
  const cyc = useMemo(() => {
    // Cyclorama: floor sweeping up into the back wall with no corner.
    const g = new PlaneGeometry(10, 8, 1, 40);
    const pos = g.getAttribute("position");
    for (let i = 0; i < pos.count; i++) {
      const v = (pos.getY(i) + 4) / 8; // 0 front .. 1 top
      const along = v * 8;
      const bend = 2.2;
      let y = 0;
      let z = 4 - along;
      if (along > 4) {
        const a = Math.min(Math.PI / 2, (along - 4) / bend);
        y =
          bend * (1 - Math.cos(a)) +
          Math.max(0, along - 4 - (Math.PI / 2) * bend);
        z = -Math.sin(a) * bend;
      }
      pos.setXYZ(i, pos.getX(i), y, z);
    }
    g.computeVertexNormals();
    return g;
  }, []);
  useLayoutEffect(() => () => cyc.dispose(), [cyc]);

  return (
    <group>
      <mesh geometry={cyc} position={[0, 0, -1.4]} receiveShadow>
        <meshPhysicalMaterial color="#9f9a93" roughness={0.9} side={2} />
      </mesh>
      {/* Turntable: lacquered plinth with a maroon pinstripe. */}
      <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.7, 0.74, 0.3, 64]} />
        <meshPhysicalMaterial
          color="#f7f5f2"
          roughness={0.15}
          clearcoat={1}
          clearcoatRoughness={0.05}
        />
      </mesh>
      <mesh position={[0, 0.27, 0]}>
        <cylinderGeometry args={[0.705, 0.705, 0.012, 64]} />
        <meshPhysicalMaterial color={MAROON} roughness={0.3} clearcoat={1} />
      </mesh>
      <VeloraDevice />
      <Softbox position={[-2, 1.6, 0.8]} rotation={[0, 0.9, 0]} />
      <Softbox
        position={[2.2, 1.9, 0.2]}
        rotation={[0, -1.1, 0]}
        intensity={1.6}
      />
      <pointLight
        position={[0, 2.4, -1.2]}
        intensity={6}
        distance={6}
        color="#fff1e0"
      />
      <Dust count={80} spread={[4, 3, 4]} size={0.025} />
    </group>
  );
}

// ---------------------------------------------------------------------------
// 05 Eco Girls: a greenhouse, raised beds, sensors in the soil, and two girls
// tending the plants.
// ---------------------------------------------------------------------------

function Greenhouse() {
  const s = surface();
  const glass = useMemo(
    () =>
      new MeshPhysicalMaterial({
        color: "#eef4f0",
        roughness: 0.05,
        transparent: true,
        opacity: 0.16,
        clearcoat: 1,
        side: 2,
        depthWrite: false
      }),
    []
  );
  useLayoutEffect(() => () => glass.dispose(), [glass]);
  const W = 6;
  const D = 5;
  const H = 2.4;
  const ridge = 3.4;
  const bays = [-3, -1.5, 0, 1.5, 3];
  const slope = Math.hypot(D / 2, ridge - H);
  // Tilts a part's local y axis to run from the eave up to the ridge.
  const roofAngle = (side: number) => Math.atan2((-side * D) / 2, ridge - H);
  return (
    <group position={[0, 0, -0.4]}>
      {bays.map((x) => (
        <group key={x}>
          {[-1, 1].map((side) => (
            <group key={side}>
              <mesh
                geometry={unitBox()}
                material={s.steel}
                visible={side === -1}
                position={[x, H / 2, side * (D / 2)]}
                scale={[0.04, H, 0.04]}
                castShadow
              />
              <mesh
                geometry={unitBox()}
                material={s.steel}
                position={[x, (H + ridge) / 2, (side * D) / 4]}
                rotation={[roofAngle(side), 0, 0]}
                scale={[0.04, slope, 0.04]}
              />
            </group>
          ))}
        </group>
      ))}
      <mesh
        geometry={unitBox()}
        material={s.steel}
        position={[0, ridge, 0]}
        scale={[W, 0.05, 0.05]}
      />
      {[-1].map((side) => (
        <group key={side}>
          <mesh
            geometry={unitBox()}
            material={s.steel}
            position={[0, H, side * (D / 2)]}
            scale={[W, 0.04, 0.04]}
          />
          <mesh material={glass} position={[0, H / 2, side * (D / 2)]}>
            <planeGeometry args={[W, H]} />
          </mesh>
          <mesh
            material={glass}
            position={[0, (H + ridge) / 2, (side * D) / 4]}
            rotation={[roofAngle(side), 0, 0]}
          >
            <planeGeometry args={[W, slope]} />
          </mesh>
        </group>
      ))}
      <mesh
        material={glass}
        position={[-W / 2, H / 2, 0]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <planeGeometry args={[D, H]} />
      </mesh>
    </group>
  );
}

function RaisedBed({
  position,
  seed
}: {
  position: [number, number, number];
  seed: number;
}) {
  const s = surface();
  return (
    <group position={position}>
      <mesh
        geometry={roundedBox(2.2, 0.36, 0.8, 0.02)}
        material={s.wood}
        position={[0, 0.18, 0]}
        castShadow
        receiveShadow
      />
      <mesh
        geometry={unitBox()}
        material={s.soil}
        position={[0, 0.355, 0]}
        scale={[2.1, 0.02, 0.7]}
      />
      {[-0.8, -0.4, 0, 0.4, 0.8].map((x, i) => (
        <group key={x} position={[x, 0.36, (i % 2) * 0.16 - 0.08]}>
          <Plant
            scale={0.8 + ((seed + i) % 3) * 0.12}
            seed={seed * 10 + i}
            pot={false}
          />
        </group>
      ))}
    </group>
  );
}

function Sensor({
  position,
  delay = 0
}: {
  position: [number, number, number];
  delay?: number;
}) {
  const led = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    const m = led.current?.material as MeshPhysicalMaterial | undefined;
    if (m)
      m.emissiveIntensity =
        0.6 + Math.max(0, Math.sin(clock.getElapsedTime() * 2 + delay)) * 2;
  });
  return (
    <group position={position}>
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[0.012, 0.3, 0.03]} />
        <meshPhysicalMaterial color="#c9a34a" metalness={1} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[0.06, 0.07, 0.035]} />
        <meshPhysicalMaterial color="#f2efe8" roughness={0.4} clearcoat={0.6} />
      </mesh>
      <mesh ref={led} position={[0, 0.315, 0.019]}>
        <sphereGeometry args={[0.006, 10, 8]} />
        <meshPhysicalMaterial
          color="#7ee08a"
          emissive="#3fd25a"
          emissiveIntensity={1}
        />
      </mesh>
    </group>
  );
}

export function EcoSet() {
  return (
    <group>
      <Ground radius={8} material="concrete" />
      <Greenhouse />
      <RaisedBed position={[-1.2, 0, -1.2]} seed={1} />
      <RaisedBed position={[1.3, 0, -1.2]} seed={2} />
      <RaisedBed position={[-1.2, 0, 0.6]} seed={3} />
      <Sensor position={[-1.6, 0.36, 0.75]} />
      <Sensor position={[1.0, 0.36, -1.05]} delay={1.2} />
      <Sensor position={[-0.5, 0.36, -1.35]} delay={2.1} />
      <group position={[-0.2, 0, 1.45]} rotation={[0, Math.PI - 0.2, 0]}>
        <Person look={CAST.ines} pose="tend" holding="can" phase={0.3} />
      </group>
      <group position={[1.4, 0, 0.1]} rotation={[0, -2.2, 0]}>
        <Person look={CAST.keza} pose="tend" phase={2.4} />
      </group>
      <Dust count={120} spread={[6, 3, 5]} color="#fff6d8" />
    </group>
  );
}
