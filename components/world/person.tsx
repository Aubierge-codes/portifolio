"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  CatmullRomCurve3,
  CircleGeometry,
  Color,
  LatheGeometry,
  MeshPhysicalMaterial,
  SphereGeometry,
  TubeGeometry,
  Vector2,
  Vector3,
  type BufferGeometry,
  type Group,
  type Mesh
} from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { roundedBox, unitCylinder } from "@/components/three/hardware/kit";
import { fabricBump, hairBump, skinBump } from "@/components/world/textures";

/*
 * A procedural person, in metres, standing on y = 0 and facing +z.
 *
 * The body is a joint hierarchy (pelvis -> spine -> chest -> neck -> head,
 * hips -> knees -> ankles, shoulders -> elbows -> wrists) with smooth lathed
 * limbs hung from each joint, so every pose is just joint rotations. It's a
 * rigid-segment rig rather than a skinned mesh: clothing overlaps the joints,
 * which hides the seams at the distances these scenes are viewed from.
 */

export type Pose =
  | "walk"
  | "idle"
  | "type"
  | "read"
  | "talk"
  | "point"
  | "wave"
  | "tend"
  | "umbrella";
export type HairStyle = "short" | "afro" | "bun" | "braids" | "cropped";
export type Holding =
  "none" | "laptop" | "book" | "can" | "tablet" | "umbrella";

export type Look = {
  skin: string;
  hair: string;
  hairStyle: HairStyle;
  top: string;
  sleeves: "short" | "long";
  bottom: string;
  bottomStyle: "trousers" | "skirt";
  shoes: string;
  figure: "f" | "m";
  /** Overall height multiplier around 1.65 m. */
  height?: number;
};

/** A cast of distinct people. Muted clothing so the brand colours stay accents. */
export const CAST: Record<string, Look> = {
  amara: {
    skin: "#6b4430",
    hair: "#17110d",
    hairStyle: "braids",
    top: "#efebe4",
    sleeves: "long",
    bottom: "#2b2e35",
    bottomStyle: "trousers",
    shoes: "#6e1f24",
    figure: "f"
  },
  keza: {
    skin: "#8a5a3c",
    hair: "#1c1410",
    hairStyle: "afro",
    top: "#c9b79c",
    sleeves: "short",
    bottom: "#3b3a38",
    bottomStyle: "skirt",
    shoes: "#1d1c1b",
    figure: "f",
    height: 0.97
  },
  ines: {
    skin: "#a36f4b",
    hair: "#100c0a",
    hairStyle: "bun",
    top: "#6e1f24",
    sleeves: "long",
    bottom: "#d8d2c6",
    bottomStyle: "trousers",
    shoes: "#efebe4",
    figure: "f",
    height: 0.98
  },
  david: {
    skin: "#5a3a26",
    hair: "#0e0b09",
    hairStyle: "cropped",
    top: "#9aa3ad",
    sleeves: "long",
    bottom: "#23262c",
    bottomStyle: "trousers",
    shoes: "#1b1d21",
    figure: "m",
    height: 1.06
  },
  eric: {
    skin: "#7d5236",
    hair: "#15100c",
    hairStyle: "short",
    top: "#2f343b",
    sleeves: "short",
    bottom: "#b9ad97",
    bottomStyle: "trousers",
    shoes: "#3a2a20",
    figure: "m",
    height: 1.04
  },
  nadia: {
    skin: "#9b6a48",
    hair: "#2a1a12",
    hairStyle: "short",
    top: "#e2d7c3",
    sleeves: "long",
    bottom: "#6e1f24",
    bottomStyle: "skirt",
    shoes: "#1d1c1b",
    figure: "f",
    height: 0.99
  }
};

// Joint layout, metres.
const PELVIS_Y = 0.88;
const SEAT_PELVIS_Y = 0.5;
const HIP_X = 0.085;
const THIGH = 0.4;
const SHIN = 0.4;
const CHEST_Y = 0.3;
const SHOULDER: [number, number, number] = [0.165, 0.13, 0];
const UPPER_ARM = 0.28;
const FOREARM = 0.25;
const NECK_Y = 0.17;
const HEAD_Y = 0.24;
/** Ground covered per gait cycle, for matching stride to travel speed. */
const STRIDE = 2 * 2 * (THIGH + SHIN) * Math.sin(0.48);

/** Gait cycles (radians/second) that cover `metresPerSecond` without skating. */
export function strideRate(metresPerSecond: number) {
  return (metresPerSecond / STRIDE) * Math.PI * 2;
}

// --- Shared geometry --------------------------------------------------------

const cache = new Map<string, BufferGeometry>();
function cached<T extends BufferGeometry>(key: string, make: () => T): T {
  let geometry = cache.get(key) as T | undefined;
  if (!geometry) {
    geometry = make();
    cache.set(key, geometry);
  }
  return geometry;
}

/** A tapered limb with a soft muscle bulge and rounded ends, hanging down. */
function limb(
  key: string,
  r0: number,
  r1: number,
  length: number,
  bulge: number
) {
  return cached(`limb:${key}`, () => {
    const points: Vector2[] = [
      new Vector2(0, r0 * 0.55),
      new Vector2(r0 * 0.75, r0 * 0.4)
    ];
    const steps = 9;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const r =
        r0 + (r1 - r0) * t + bulge * Math.sin(Math.PI * t) * (1 - t * 0.4);
      points.push(new Vector2(r, -t * length));
    }
    points.push(new Vector2(r1 * 0.75, -length - r1 * 0.4));
    points.push(new Vector2(0, -length - r1 * 0.55));
    return new LatheGeometry(points, 16);
  });
}

/** Torso from hips to neck; flattened front-to-back by the mesh scale. */
function torso(figure: "f" | "m") {
  return cached(`torso:${figure}`, () => {
    const f = figure === "f";
    const profile: [number, number][] = [
      [0, -0.08],
      [f ? 0.14 : 0.13, -0.06],
      [f ? 0.148 : 0.135, 0.02],
      [f ? 0.112 : 0.122, 0.17],
      [f ? 0.13 : 0.14, 0.29],
      [f ? 0.158 : 0.178, 0.4],
      [f ? 0.135 : 0.152, 0.46],
      [0.06, 0.5],
      [0, 0.51]
    ];
    return new LatheGeometry(
      profile.map(([r, y]) => new Vector2(r, y)),
      24
    );
  });
}

function skirt() {
  return cached(
    "skirt",
    () =>
      new LatheGeometry(
        [
          new Vector2(0.135, 0.08),
          new Vector2(0.15, -0.05),
          new Vector2(0.185, -0.25),
          new Vector2(0.215, -0.43),
          new Vector2(0.205, -0.445)
        ],
        28
      )
  );
}

const sphere = (r: number, w = 24, h = 18) =>
  cached(`sphere:${r}:${w}:${h}`, () => new SphereGeometry(r, w, h));

/** Top hemisphere, used for eyelids. */
const lid = () =>
  cached(
    "lid",
    () => new SphereGeometry(0.0128, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2)
  );

/** Hair cap hugging the skull, leaving the face clear. */
const hairCap = (r: number) =>
  cached(
    `cap:${r}`,
    () => new SphereGeometry(r, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.6)
  );

/** A full, slightly irregular afro. Vertices nudged by layered sines. */
function afro() {
  return cached("afro", () => {
    const geometry = new SphereGeometry(0.15, 40, 30);
    const position = geometry.getAttribute("position");
    const v = new Vector3();
    for (let i = 0; i < position.count; i++) {
      v.fromBufferAttribute(position, i);
      const n =
        Math.sin(v.x * 90) * Math.sin(v.y * 80) * Math.sin(v.z * 85) * 0.006 +
        Math.sin(v.x * 31 + v.z * 27) * 0.004;
      v.multiplyScalar(1 + n / 0.15);
      position.setXYZ(i, v.x, v.y, v.z);
    }
    geometry.computeVertexNormals();
    return geometry;
  });
}

/** Braids falling from the back of the head to the shoulders. */
function braids() {
  return cached("braids", () => {
    const parts: TubeGeometry[] = [];
    for (let i = 0; i < 9; i++) {
      const a = Math.PI * (0.62 + (i / 8) * 0.76);
      const x = Math.cos(a) * 0.085;
      const z = Math.sin(a) * -0.07 - 0.02;
      const curve = new CatmullRomCurve3([
        new Vector3(x, 0.19, z),
        new Vector3(x * 1.25, 0.1, z * 1.4 - 0.02),
        new Vector3(x * 1.3, -0.04, z * 1.5 - 0.035),
        new Vector3(x * 1.25, -0.16, z * 1.5 - 0.04)
      ]);
      parts.push(new TubeGeometry(curve, 14, 0.0095, 6, false));
    }
    return mergeTubes(parts);
  });
}

function mergeTubes(parts: TubeGeometry[]) {
  // One geometry, so all the braids are a single draw call.
  const merged = mergeGeometries(parts) ?? parts[0].clone();
  parts.forEach((part) => part.dispose());
  return merged;
}

// --- Materials --------------------------------------------------------------

const materialCache = new Map<string, ReturnType<typeof buildMaterials>>();

function buildMaterials(look: Look) {
  const skinTone = new Color(look.skin);
  const fabric = (color: string) =>
    new MeshPhysicalMaterial({
      color,
      roughness: 0.86,
      sheen: 0.5,
      sheenRoughness: 0.6,
      sheenColor: new Color(color).lerp(new Color("#ffffff"), 0.5),
      bumpMap: fabricBump(),
      bumpScale: 0.6
    });
  return {
    // Sheen tinted warm and a soft clearcoat approximate light scattering
    // under skin; there's no true subsurface pass at this scale.
    skin: new MeshPhysicalMaterial({
      color: skinTone,
      roughness: 0.52,
      sheen: 0.35,
      sheenRoughness: 0.45,
      sheenColor: skinTone.clone().lerp(new Color("#e8806a"), 0.3),
      clearcoat: 0.12,
      clearcoatRoughness: 0.6,
      bumpMap: skinBump(),
      bumpScale: 0.25
    }),
    lips: new MeshPhysicalMaterial({
      color: skinTone.clone().lerp(new Color("#5a2420"), 0.45),
      roughness: 0.4,
      clearcoat: 0.3
    }),
    hair: new MeshPhysicalMaterial({
      color: look.hair,
      roughness: 0.55,
      sheen: 1,
      sheenRoughness: 0.35,
      sheenColor: new Color(look.hair).lerp(new Color("#a08670"), 0.5),
      bumpMap: hairBump(),
      bumpScale: 1.2
    }),
    top: fabric(look.top),
    bottom: fabric(look.bottom),
    shoes: new MeshPhysicalMaterial({
      color: look.shoes,
      roughness: 0.45,
      clearcoat: 0.4,
      clearcoatRoughness: 0.4
    }),
    sole: new MeshPhysicalMaterial({ color: "#e9e5de", roughness: 0.8 }),
    sclera: new MeshPhysicalMaterial({ color: "#f1ede6", roughness: 0.35 }),
    iris: new MeshPhysicalMaterial({ color: "#2a170d", roughness: 0.3 }),
    // A clear dome over the iris: it's what catches the environment glints.
    cornea: new MeshPhysicalMaterial({
      color: "#ffffff",
      roughness: 0,
      metalness: 0,
      transparent: true,
      opacity: 0.12,
      clearcoat: 1,
      clearcoatRoughness: 0,
      depthWrite: false
    })
  };
}

function materialsFor(look: Look) {
  const key = JSON.stringify(look);
  let set = materialCache.get(key);
  if (!set) {
    set = buildMaterials(look);
    materialCache.set(key, set);
  }
  return set;
}

// --- Component ----------------------------------------------------------------

type PersonProps = {
  look: Look;
  pose?: Pose;
  /** Gait or gesture rate, radians per second. */
  speed?: number;
  /** Phase offset, so a crowd doesn't move in lockstep. */
  phase?: number;
  holding?: Holding;
  /** Where the head turns to look, in radians from straight ahead. */
  gaze?: number;
};

export function Person({
  look,
  pose = "idle",
  speed = 1,
  phase = 0,
  holding = "none",
  gaze = 0
}: PersonProps) {
  const m = materialsFor(look);
  const scale = look.height ?? 1;
  const seated = pose === "type" || pose === "read";

  const r = {
    root: useRef<Group>(null),
    pelvis: useRef<Group>(null),
    chest: useRef<Group>(null),
    head: useRef<Group>(null),
    hipL: useRef<Group>(null),
    hipR: useRef<Group>(null),
    kneeL: useRef<Group>(null),
    kneeR: useRef<Group>(null),
    ankleL: useRef<Group>(null),
    ankleR: useRef<Group>(null),
    shoulderL: useRef<Group>(null),
    shoulderR: useRef<Group>(null),
    elbowL: useRef<Group>(null),
    elbowR: useRef<Group>(null),
    lidL: useRef<Mesh>(null),
    lidR: useRef<Mesh>(null),
    skirt: useRef<Mesh>(null)
  };

  const blinkOffset = useMemo(() => (phase * 7.3) % 4, [phase]);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const t = time * speed + phase;
    const set = (
      ref: { current: Group | Mesh | null },
      x = 0,
      y = 0,
      z = 0
    ) => {
      ref.current?.rotation.set(x, y, z);
    };

    // Breathing and blinking run under every pose.
    const breath = Math.sin(time * 1.5 + phase) * 0.012;
    r.chest.current?.scale.set(1 + breath * 0.6, 1 + breath * 0.3, 1 + breath);
    const blinkT = (time + blinkOffset) % 4.1;
    const lidAngle = blinkT < 0.13 ? 1.15 : -0.5;
    set(r.lidL, lidAngle);
    set(r.lidR, lidAngle);

    const pelvis = r.pelvis.current;
    if (pelvis) {
      pelvis.position.set(0, seated ? SEAT_PELVIS_Y : PELVIS_Y, 0);
      pelvis.rotation.set(0, 0, 0);
    }

    if (pose === "walk") {
      const swing = Math.sin(t);
      const thighL = -swing * 0.48;
      const thighR = swing * 0.48;
      // Knee flexion peaks mid-swing, when that leg is travelling forward.
      const kneeL = 0.07 + 0.95 * Math.pow(Math.max(0, Math.cos(t)), 1.5);
      const kneeR = 0.07 + 0.95 * Math.pow(Math.max(0, -Math.cos(t)), 1.5);
      if (pelvis) {
        pelvis.position.y = PELVIS_Y - Math.cos(t * 2) * 0.018 - 0.012;
        pelvis.position.x = -swing * 0.016;
        pelvis.rotation.set(0, -Math.cos(t) * 0.09, swing * 0.03);
      }
      set(r.hipL, thighL);
      set(r.hipR, thighR);
      set(r.kneeL, kneeL);
      set(r.kneeR, kneeR);
      set(r.ankleL, -(thighL + kneeL) * 0.55);
      set(r.ankleR, -(thighR + kneeR) * 0.55);
      set(r.chest, 0.03, Math.cos(t) * 0.07, -swing * 0.02);
      set(r.shoulderL, swing * 0.38, 0, 0.07);
      set(r.shoulderR, -swing * 0.38, 0, -0.07);
      set(r.elbowL, -0.22 - Math.max(0, -swing) * 0.3);
      set(r.elbowR, -0.22 - Math.max(0, swing) * 0.3);
      set(r.head, -0.02, gaze + Math.sin(t * 0.5) * 0.05, 0);
      if (r.skirt.current) r.skirt.current.rotation.set(swing * 0.04, 0, 0);
      return;
    }

    if (r.skirt.current) r.skirt.current.rotation.set(0, 0, 0);

    if (seated) {
      set(r.hipL, -1.5, 0, 0.06);
      set(r.hipR, -1.5, 0, -0.06);
      set(r.kneeL, 1.45);
      set(r.kneeR, 1.45);
      set(r.ankleL, 0.05);
      set(r.ankleR, 0.05);
      if (pose === "type") {
        const tap = Math.sin(t * 13);
        set(r.chest, 0.12, 0, 0);
        set(r.shoulderL, -0.62 + tap * 0.02, 0, 0.18);
        set(r.shoulderR, -0.62 - tap * 0.02, 0, -0.18);
        set(r.elbowL, -0.95, 0, 0);
        set(r.elbowR, -0.95, 0, 0);
        // Mostly on the screen, glancing up now and then.
        const glance = Math.max(0, Math.sin(time * 0.35 + phase) - 0.7) * 1.4;
        set(r.head, 0.18 - glance * 0.3, gaze + glance * 0.5, 0);
      } else {
        set(r.chest, 0.16, 0, 0);
        set(r.shoulderL, -0.75, 0, 0.32);
        set(r.shoulderR, -0.75, 0, -0.32);
        set(r.elbowL, -1.45, 0.25, 0);
        set(r.elbowR, -1.45, -0.25, 0);
        set(r.head, 0.36 + Math.sin(time * 0.4 + phase) * 0.03, gaze, 0);
      }
      return;
    }

    // Standing poses share a slow weight shift.
    const shift = Math.sin(t * 0.45);
    if (pelvis) {
      pelvis.position.x = shift * 0.012;
      pelvis.rotation.set(0, 0, shift * 0.02);
    }
    set(r.hipL, 0, 0, -shift * 0.02);
    set(r.hipR, 0, 0, -shift * 0.02);
    set(r.kneeL, 0.03 + Math.max(0, shift) * 0.06);
    set(r.kneeR, 0.03 + Math.max(0, -shift) * 0.06);
    set(r.ankleL);
    set(r.ankleR);
    set(r.shoulderL, 0.02, 0, 0.08);
    set(r.elbowL, -0.18);
    set(r.chest, 0, 0, -shift * 0.015);
    set(r.head, 0, gaze + Math.sin(t * 0.3) * 0.18, 0);

    if (pose === "idle") {
      set(r.shoulderR, 0.02, 0, -0.08);
      set(r.elbowR, -0.18);
    } else if (pose === "talk") {
      const beat = Math.sin(t * 1.7);
      set(r.shoulderR, -0.55 + beat * 0.15, 0, -0.25);
      set(r.elbowR, -1.0 + Math.sin(t * 2.3) * 0.25);
      set(r.shoulderL, -0.2 - beat * 0.1, 0, 0.15);
      set(r.elbowL, -0.6);
      set(r.head, Math.sin(t * 2.1) * 0.04, gaze, Math.sin(t * 0.9) * 0.04);
    } else if (pose === "umbrella") {
      set(r.shoulderR, -0.5, 0, -0.12);
      set(r.elbowR, -1.3);
    } else if (pose === "point") {
      set(r.shoulderR, -1.35, 0.15, -0.1);
      set(r.elbowR, -0.08);
      set(r.head, -0.05, gaze, 0);
    } else if (pose === "wave") {
      set(r.shoulderR, 0, 0, -2.5);
      set(r.elbowR, -0.25, 0, -0.5 + Math.sin(t * 6) * 0.35);
    } else if (pose === "tend") {
      if (pelvis) pelvis.position.y = PELVIS_Y - 0.08;
      set(r.hipL, -0.45, 0, 0.04);
      set(r.hipR, -0.25, 0, -0.04);
      set(r.kneeL, 0.75);
      set(r.kneeR, 0.45);
      set(r.ankleL, -0.3);
      set(r.ankleR, -0.2);
      set(r.chest, 0.55 + Math.sin(t * 0.6) * 0.04, 0, 0);
      set(r.shoulderR, -0.95 + Math.sin(t * 0.8) * 0.08, 0, -0.1);
      set(r.elbowR, -0.35);
      set(r.shoulderL, -0.55, 0, 0.12);
      set(r.elbowL, -0.5);
      set(r.head, 0.25, gaze, 0);
    }
  });

  const top = m.top;
  const forearm = look.sleeves === "long" ? m.top : m.skin;
  const thigh = look.bottomStyle === "trousers" ? m.bottom : m.skin;
  const shin = look.bottomStyle === "trousers" ? m.bottom : m.skin;
  const f = look.figure === "f";

  const leg = (side: 1 | -1) => (
    <group
      ref={side === 1 ? r.hipL : r.hipR}
      position={[side * HIP_X, -0.04, 0]}
    >
      <mesh
        geometry={limb("thigh", 0.074, 0.052, THIGH, 0.012)}
        material={thigh}
      />
      <group ref={side === 1 ? r.kneeL : r.kneeR} position={[0, -THIGH, 0]}>
        <mesh
          geometry={limb("shin", 0.052, 0.034, SHIN, 0.012)}
          material={shin}
        />
        <group ref={side === 1 ? r.ankleL : r.ankleR} position={[0, -SHIN, 0]}>
          <mesh
            geometry={roundedBox(0.086, 0.062, 0.225, 0.028)}
            material={m.shoes}
            position={[0, -0.042, 0.05]}
          />
          <mesh
            geometry={roundedBox(0.088, 0.016, 0.228, 0.007)}
            material={m.sole}
            position={[0, -0.072, 0.05]}
          />
        </group>
      </group>
    </group>
  );

  const arm = (side: 1 | -1) => (
    <group
      ref={side === 1 ? r.shoulderL : r.shoulderR}
      position={[
        side * SHOULDER[0] * (f ? 0.95 : 1.04),
        SHOULDER[1],
        SHOULDER[2]
      ]}
    >
      <mesh
        geometry={sphere(0.046, 16, 12)}
        material={top}
        scale={[1, 0.85, 0.9]}
      />
      <mesh
        geometry={limb("upper", 0.046, 0.036, UPPER_ARM, 0.008)}
        material={top}
      />
      <group
        ref={side === 1 ? r.elbowL : r.elbowR}
        position={[0, -UPPER_ARM, 0]}
      >
        <mesh
          geometry={limb("fore", 0.036, 0.026, FOREARM, 0.006)}
          material={forearm}
        />
        <group position={[0, -FOREARM, 0]}>
          {/* Hand: palm, fingers as one soft mitt, and a thumb. */}
          <mesh
            geometry={roundedBox(0.024, 0.078, 0.056, 0.011)}
            material={m.skin}
            position={[0, -0.042, 0.002]}
          />
          <mesh
            geometry={roundedBox(0.018, 0.042, 0.017, 0.008)}
            material={m.skin}
            position={[side * -0.003, -0.026, 0.032]}
            rotation={[0.5, 0, 0]}
          />
          {side === -1 ? <Held holding={holding} /> : null}
        </group>
      </group>
    </group>
  );

  return (
    <group ref={r.root} scale={scale}>
      <group ref={r.pelvis} position={[0, PELVIS_Y, 0]}>
        {/* Hips and lower clothing. */}
        <mesh
          geometry={torso(look.figure)}
          material={look.bottomStyle === "skirt" ? m.bottom : m.bottom}
          scale={[1, 0.36, 0.66]}
          position={[0, -0.02, 0]}
        />
        {look.bottomStyle === "skirt" ? (
          <mesh
            ref={r.skirt}
            geometry={skirt()}
            material={m.bottom}
            scale={[1, 1, 0.78]}
          />
        ) : null}
        {leg(1)}
        {leg(-1)}

        {/* Upper body. */}
        <mesh
          geometry={torso(look.figure)}
          material={top}
          scale={[1, 1, 0.62]}
          position={[0, 0.02, 0]}
        />
        <group ref={r.chest} position={[0, CHEST_Y, 0]}>
          <mesh
            geometry={unitCylinder(16)}
            material={m.skin}
            position={[0, NECK_Y, 0.005]}
            scale={[0.042, 0.11, 0.042]}
          />
          {arm(1)}
          {arm(-1)}
          <group ref={r.head} position={[0, HEAD_Y, 0.012]}>
            <Head look={look} m={m} lidL={r.lidL} lidR={r.lidR} />
          </group>
        </group>
      </group>
    </group>
  );
}

type Materials = ReturnType<typeof buildMaterials>;

function Head({
  look,
  m,
  lidL,
  lidR
}: {
  look: Look;
  m: Materials;
  lidL: React.RefObject<Mesh | null>;
  lidR: React.RefObject<Mesh | null>;
}) {
  const f = look.figure === "f";
  return (
    <group>
      {/* Skull, jaw, nose, ears. */}
      <mesh
        geometry={sphere(0.1, 32, 24)}
        material={m.skin}
        position={[0, 0.105, 0]}
        scale={[0.82, 1, 0.92]}
      />
      <mesh
        geometry={sphere(0.07, 24, 16)}
        material={m.skin}
        position={[0, 0.05, 0.024]}
        scale={[f ? 0.8 : 0.88, 0.78, 0.9]}
      />
      <mesh
        geometry={sphere(0.016, 12, 10)}
        material={m.skin}
        position={[0, 0.088, 0.09]}
        scale={[1, 0.9, 1.1]}
      />
      {[1, -1].map((s) => (
        <mesh
          key={s}
          geometry={sphere(0.02, 12, 10)}
          material={m.skin}
          position={[s * 0.081, 0.098, -0.004]}
          scale={[0.42, 1, 0.68]}
        />
      ))}
      <mesh
        geometry={roundedBox(0.032, 0.007, 0.01, 0.003)}
        material={m.lips}
        position={[0, 0.058, 0.083]}
      />

      {/* Eyes: sclera, iris, clear cornea, and a lid that blinks. */}
      {[1, -1].map((s) => (
        <group key={s} position={[s * 0.031, 0.108, 0.071]}>
          <mesh geometry={sphere(0.0115, 16, 12)} material={m.sclera} />
          <mesh geometry={iris()} material={m.iris} position={[0, 0, 0.0113]} />
          <mesh geometry={sphere(0.0122, 16, 12)} material={m.cornea} />
          <mesh
            ref={s === 1 ? lidL : lidR}
            geometry={lid()}
            material={m.skin}
          />
          <mesh
            geometry={roundedBox(0.026, 0.0045, 0.008, 0.002)}
            material={m.hair}
            position={[s * 0.002, 0.021, 0.006]}
            rotation={[0, 0, s * -0.12]}
          />
        </group>
      ))}

      <Hair look={look} m={m} />
    </group>
  );
}

const iris = () => cached("iris", () => new CircleGeometry(0.0064, 20));

function Hair({ look, m }: { look: Look; m: Materials }) {
  const capOn = (r: number, tilt = -0.32) => (
    <mesh
      geometry={hairCap(r)}
      material={m.hair}
      position={[0, 0.112, -0.004]}
      rotation={[tilt, 0, 0]}
      scale={[0.86, 1, 0.95]}
    />
  );
  switch (look.hairStyle) {
    case "afro":
      return (
        <>
          {capOn(0.104, -0.14)}
          <mesh
            geometry={afro()}
            material={m.hair}
            position={[0, 0.15, -0.025]}
            scale={[1, 0.86, 0.95]}
          />
        </>
      );
    case "bun":
      return (
        <>
          {capOn(0.105, -0.14)}
          <mesh
            geometry={sphere(0.048, 20, 16)}
            material={m.hair}
            position={[0, 0.2, -0.07]}
          />
        </>
      );
    case "braids":
      return (
        <>
          {capOn(0.105, -0.12)}
          <mesh geometry={braids()} material={m.hair} />
        </>
      );
    case "cropped":
      return capOn(0.102, -0.2);
    default:
      return capOn(0.106, -0.16);
  }
}

/** Props carried in the right hand. */
function Held({ holding }: { holding: Holding }) {
  if (holding === "none") return null;
  if (holding === "laptop")
    return (
      <mesh position={[0.01, -0.07, 0.02]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.018, 0.22, 0.3]} />
        <meshPhysicalMaterial
          color="#cfd1d4"
          metalness={0.9}
          roughness={0.32}
        />
      </mesh>
    );
  if (holding === "book")
    return (
      <group position={[0.06, -0.06, 0.1]} rotation={[-1.2, 0, 0.4]}>
        <mesh>
          <boxGeometry args={[0.15, 0.022, 0.21]} />
          <meshPhysicalMaterial color="#6e1f24" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.012, 0]}>
          <boxGeometry args={[0.14, 0.004, 0.2]} />
          <meshPhysicalMaterial color="#f3eee4" roughness={0.9} />
        </mesh>
      </group>
    );
  if (holding === "tablet")
    return (
      <mesh position={[0.02, -0.08, 0.06]} rotation={[-0.9, 0, 0]}>
        <boxGeometry args={[0.17, 0.008, 0.24]} />
        <meshPhysicalMaterial color="#1b1c1f" roughness={0.2} clearcoat={1} />
      </mesh>
    );
  if (holding === "umbrella")
    return (
      <group position={[0, -0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh position={[0, 0.42, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.95, 8]} />
          <meshPhysicalMaterial
            color="#2c2f34"
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>
        <mesh position={[0, 0.88, 0]} castShadow>
          <sphereGeometry
            args={[0.58, 32, 10, 0, Math.PI * 2, 0, Math.PI * 0.32]}
          />
          <meshPhysicalMaterial
            color="#6e1f24"
            roughness={0.5}
            side={2}
            sheen={0.4}
          />
        </mesh>
      </group>
    );
  if (holding !== "can") return null;
  return (
    <group position={[0, -0.13, 0.03]}>
      <mesh>
        <cylinderGeometry args={[0.065, 0.075, 0.17, 20]} />
        <meshPhysicalMaterial
          color="#6e8f6a"
          metalness={0.4}
          roughness={0.4}
          clearcoat={0.5}
        />
      </mesh>
      <mesh position={[0, 0.02, 0.12]} rotation={[1.1, 0, 0]}>
        <cylinderGeometry args={[0.01, 0.014, 0.2, 10]} />
        <meshPhysicalMaterial color="#6e8f6a" metalness={0.4} roughness={0.4} />
      </mesh>
    </group>
  );
}
