"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import {
  CanvasTexture,
  MeshStandardMaterial,
  SRGBColorSpace,
  type Mesh,
  type Object3D
} from "three";

/*
 * The real hardware models (see ASSET_INVENTORY.md). Each GLB was prepared in
 * Blender by design/tools/export-models.py: metres, origin at the base centre,
 * front facing +Z, semantic node names, harmonised materials. So nothing here
 * measures, levels or rescales anything at runtime.
 */

export const MODELS = {
  arm: "/models/robot-arm.glb",
  laptop: "/models/laptop.glb",
  arduino: "/models/arduino.glb",
  pi: "/models/raspberry-pi.glb",
  monitor: "/models/monitor.glb"
} as const;

/** A private copy of a cached model, so it can appear in several canvases. */
function useModel(path: string) {
  const { scene } = useGLTF(path);
  const copy = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((o) => {
      const mesh = o as Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
    return c;
  }, [scene]);
  return copy;
}

type Props = { scale?: number };

export function Board({ kind, scale = 1 }: Props & { kind: "arduino" | "pi" }) {
  const model = useModel(MODELS[kind]);
  return <primitive object={model} scale={scale} />;
}

export function Monitor({ scale = 1 }: Props) {
  const model = useModel(MODELS.monitor);
  return <primitive object={model} scale={scale} />;
}

/** Paints a canvas texture onto a named display mesh as a lit screen. */
function useScreen(
  model: Object3D,
  name: string,
  texture: CanvasTexture | null | undefined
) {
  useEffect(() => {
    if (!texture) return;
    // A named node may be a mesh or a group of mesh primitives.
    const node = model.getObjectByName(name);
    const meshes: Mesh[] = [];
    node?.traverse((o) => {
      if ((o as Mesh).isMesh) meshes.push(o as Mesh);
    });
    if (!meshes.length) return;
    // This model's screen UVs run bottom-up, like a canvas texture's default.
    texture.flipY = true;
    texture.needsUpdate = true;
    const material = new MeshStandardMaterial({
      color: "#000000",
      emissive: "#ffffff",
      emissiveMap: texture,
      emissiveIntensity: 1.2,
      roughness: 0.18
    });
    const previous = meshes.map((m) => m.material);
    meshes.forEach((m) => (m.material = material));
    return () => {
      meshes.forEach((m, i) => (m.material = previous[i]));
      material.dispose();
    };
  }, [model, name, texture]);
}

export function Laptop({
  scale = 1,
  screen,
  closed = false
}: Props & { screen?: CanvasTexture | null; closed?: boolean }) {
  const model = useModel(MODELS.laptop);
  useScreen(model, "screen", screen);
  const lid = useMemo(() => {
    const node = model.getObjectByName("lid");
    return node ? { node, rest: node.rotation.clone() } : null;
  }, [model]);
  const angle = useRef(0);
  // The lid's origin sits on the hinge; it swings about local Z, sprung.
  useFrame((_, delta) => {
    if (!lid) return;
    const target = closed ? LID_CLOSED : 0;
    angle.current += (target - angle.current) * (1 - Math.exp(-5 * delta));
    lid.node.rotation.z = lid.rest.z + angle.current;
  });
  return <primitive object={model} scale={scale} />;
}

/** Radians from open to shut for the laptop lid. */
const LID_CLOSED = -1.72;

// --- Articulated arm ------------------------------------------------------------

const JOINTS = [
  "joint_base",
  "joint_shoulder",
  "joint_elbow",
  "joint_wrist"
] as const;

/**
 * Pick-and-place keyframes as offsets from the rest pose:
 * [base yaw, shoulder, elbow, wrist, grip 0..1, seconds to reach this key].
 */
const CYCLE: [number, number, number, number, number, number][] = [
  [0, 0, 0, 0, 0, 1.2],
  [-0.55, 0.22, -0.3, 0.22, 0, 1.4],
  [-0.55, 0.38, -0.5, 0.36, 0, 0.9],
  [-0.55, 0.38, -0.5, 0.36, 1, 0.5],
  [-0.55, 0.08, -0.18, 0.1, 1, 0.9],
  [0.45, 0.08, -0.18, 0.1, 1, 1.7],
  [0.45, 0.34, -0.46, 0.32, 1, 0.9],
  [0.45, 0.34, -0.46, 0.32, 0, 0.5],
  [0.45, 0.1, -0.15, 0.08, 0, 0.8],
  [0, 0, 0, 0, 0, 1.5]
];
const CYCLE_LENGTH = CYCLE.reduce((sum, k) => sum + k[5], 0);

/** C2-continuous ease: starts and stops with zero velocity and acceleration. */
const smootherstep = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

/** Where in the cycle a given time falls, as joint offsets. */
function cyclePose(time: number) {
  let t = time % CYCLE_LENGTH;
  for (let i = 1; i < CYCLE.length; i++) {
    const span = CYCLE[i][5];
    if (t <= span) {
      const k = smootherstep(t / span);
      const a = CYCLE[i - 1];
      const b = CYCLE[i];
      return [0, 1, 2, 3, 4].map((c) => a[c] + (b[c] - a[c]) * k);
    }
    t -= span;
  }
  return [0, 0, 0, 0, 0];
}

export function RobotArm({
  scale = 1,
  playing = true,
  phase = 0
}: Props & { playing?: boolean; phase?: number }) {
  const model = useModel(MODELS.arm);
  const rig = useMemo(() => {
    const joints = JOINTS.map((n) => model.getObjectByName(n));
    const fingers = [
      model.getObjectByName("finger_a"),
      model.getObjectByName("finger_b")
    ];
    return {
      joints,
      fingers,
      rest: joints.map((j) => j?.rotation.clone()),
      fingerRest: fingers.map((f) => f?.rotation.clone())
    };
  }, [model]);
  const time = useRef(phase);
  const pose = useRef([0, 0, 0, 0, 0]);

  useFrame((_, delta) => {
    // The cycle clock only runs while playing; when stopped, the joints ease
    // home on a spring, so stopping mid-move never snaps.
    if (playing) time.current += delta;
    const target = playing ? cyclePose(time.current) : [0, 0, 0, 0, 0];
    const k = playing ? 1 : 1 - Math.exp(-3 * delta);
    pose.current = pose.current.map((v, i) => v + (target[i] - v) * k);
    const [yaw, shoulder, elbow, wrist, grip] = pose.current;
    const [base, sh, el, wr] = rig.joints;
    // Pitch joints turn about their axle (local X); the base about local Y.
    if (base && rig.rest[0]) base.rotation.y = rig.rest[0].y + yaw;
    if (sh && rig.rest[1]) sh.rotation.x = rig.rest[1].x + shoulder;
    if (el && rig.rest[2]) el.rotation.x = rig.rest[2].x + elbow;
    if (wr && rig.rest[3]) wr.rotation.x = rig.rest[3].x + wrist;
    rig.fingers.forEach((f, i) => {
      const rest = rig.fingerRest[i];
      if (f && rest) f.rotation.y = rest.y + (i ? -1 : 1) * grip * 0.28;
    });
  });

  return <primitive object={model} scale={scale} />;
}

/** Joint names, for labelling the arm's articulation. */
export const ARM_JOINTS = [
  "joint_base",
  "joint_shoulder",
  "joint_elbow",
  "joint_wrist",
  "joint_hand"
] as const;
export { CYCLE_LENGTH as ARM_CYCLE_SECONDS };

/** The portfolio's own page, for the laptop and monitor screens. */
export function drawScreen(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  dark = false
) {
  const bg = dark ? "#121214" : "#fbfaf8";
  const ink = dark ? "#e9e6e0" : "#151413";
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = ink;
  ctx.beginPath();
  ctx.arc(w * 0.07, h * 0.1, h * 0.018, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 0.35;
  [0.68, 0.76, 0.84].forEach((x) =>
    ctx.fillRect(w * x, h * 0.092, w * 0.05, h * 0.014)
  );
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#6e1f24";
  ctx.fillRect(w * 0.07, h * 0.3, w * 0.12, h * 0.014);
  ctx.fillStyle = ink;
  ctx.fillRect(w * 0.07, h * 0.36, w * 0.56, h * 0.05);
  ctx.fillRect(w * 0.07, h * 0.44, w * 0.42, h * 0.05);
  ctx.globalAlpha = 0.25;
  [0.56, 0.6, 0.64].forEach((y, i) =>
    ctx.fillRect(w * 0.07, h * y, w * [0.5, 0.54, 0.36][i], h * 0.014)
  );
  ctx.globalAlpha = 1;
  ctx.fillRect(w * 0.07, h * 0.72, w * 0.13, h * 0.07);
  ctx.fillStyle = "#eb5a3c";
  ctx.beginPath();
  ctx.arc(w * 0.8, h * 0.56, h * 0.11, 0, Math.PI * 2);
  ctx.fill();
}

export function makeScreenTexture(dark = false) {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 640;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  drawScreen(ctx, canvas.width, canvas.height, dark);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

/** Start fetching a scene's models early, e.g. when its section comes near. */
export function preloadModels(keys: (keyof typeof MODELS)[]) {
  keys.forEach((k) => useGLTF.preload(MODELS[k]));
}
