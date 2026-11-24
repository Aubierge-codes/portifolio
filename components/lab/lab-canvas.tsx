"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Html } from "@react-three/drei";
import {
  Color,
  MeshPhysicalMaterial,
  Object3D,
  Vector3,
  type Group,
  type PerspectiveCamera,
  type SpotLight
} from "three";
import { SceneEnvironment } from "@/components/three/scene-environment";
import { tuneRenderer } from "@/components/three/three-frame";
import {
  ARM_JOINTS,
  Board,
  Laptop,
  Monitor,
  RobotArm,
  makeScreenTexture,
  preloadModels
} from "@/components/three/real/models";
import { roundedBox } from "@/components/three/hardware/kit";
import { cn } from "@/lib/utils";

preloadModels(["arduino", "pi", "arm", "laptop", "monitor"]);

export type LabObject = "arduino" | "pi" | "arm" | "laptop" | "monitor";
export type LabEnv = "studio" | "dark" | "context";
export type LabAngle = "front" | "threeQuarter" | "top" | "detail";
export type Orbit = { az: number; pol: number; zoom: number };

/** Where each object sits on the bench, and how big a frame it needs. */
export const PLACES: Record<
  LabObject,
  { pos: [number, number, number]; yaw: number; radius: number; cy: number }
> = {
  monitor: { pos: [-0.1, 0, -0.26], yaw: 0.12, radius: 0.33, cy: 0.21 },
  laptop: { pos: [-0.52, 0, 0.0], yaw: 0.5, radius: 0.24, cy: 0.1 },
  arm: { pos: [0.48, 0, -0.08], yaw: -0.55, radius: 0.27, cy: 0.17 },
  arduino: { pos: [-0.1, 0, 0.2], yaw: 0.35, radius: 0.05, cy: 0.008 },
  pi: { pos: [0.14, 0, 0.22], yaw: -0.4, radius: 0.055, cy: 0.012 }
};

/**
 * Real, separately identifiable parts only (see INTERACTION_SPECIFICATION.md
 * §7): measured on the models from top-view renders, in each model's metres.
 */
export const HOTSPOTS: Record<
  "arduino" | "pi",
  { id: string; label: string; at: [number, number, number] }[]
> = {
  arduino: [
    { id: "usb", label: "USB-B", at: [-0.0105, 0.011, 0.0263] },
    { id: "jack", label: "Barrel jack", at: [0.0167, 0.011, 0.0245] },
    { id: "mcu", label: "ATmega328P", at: [0.0092, 0.007, -0.014] },
    { id: "digital", label: "Digital I/O", at: [-0.0224, 0.01, -0.0132] },
    { id: "analog", label: "Analog · Power", at: [0.0215, 0.01, -0.0132] }
  ],
  pi: [
    { id: "soc", label: "Broadcom SoC", at: [-0.0109, 0.012, 0.0082] },
    { id: "usb", label: "USB 2.0 ×4", at: [0.0082, 0.02, -0.0201] },
    { id: "eth", label: "Ethernet", at: [0.0228, 0.018, -0.0103] },
    { id: "gpio", label: "40-pin GPIO", at: [-0.0196, 0.013, -0.0022] },
    { id: "hdmi", label: "HDMI", at: [0.0076, 0.011, 0.0163] }
  ]
};

const ARM_LABELS: Record<(typeof ARM_JOINTS)[number], string> = {
  joint_base: "Base · yaw",
  joint_shoulder: "Shoulder",
  joint_elbow: "Elbow",
  joint_wrist: "Wrist",
  joint_hand: "Gripper"
};

/** Bench camera stops: overview, boards, arm. */
const STOPS = [
  { eye: [0.05, 0.62, 1.5], look: [0, 0.12, -0.02] },
  { eye: [0.05, 0.3, 0.62], look: [0.02, 0.01, 0.2] },
  { eye: [0.95, 0.5, 0.72], look: [0.42, 0.16, -0.08] }
] as const;

const PRESETS: Record<LabAngle, { az: number; pol: number; dist: number }> = {
  front: { az: 0, pol: 1.22, dist: 1 },
  threeQuarter: { az: 0.75, pol: 1.02, dist: 1 },
  top: { az: 0, pol: 0.22, dist: 1.05 },
  detail: { az: 0.45, pol: 0.92, dist: 0.55 }
};

type LabCanvasProps = {
  progress: { current: number };
  stop: number;
  inspect: LabObject | null;
  env: LabEnv;
  angle: LabAngle;
  orbit: React.MutableRefObject<Orbit>;
  focus: string | null;
  armPlaying: boolean;
  lidClosed: boolean;
  onSelect: (o: LabObject) => void;
  onFocus: (id: string | null) => void;
  isMobile: boolean;
};

export function LabCanvas(props: LabCanvasProps) {
  return (
    <Canvas
      shadows="percentage"
      dpr={props.isMobile ? [1, 1.25] : [1, 1.5]}
      camera={{ fov: 32, near: 0.01, far: 30, position: [0, 0.6, 1.5] }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      onCreated={tuneRenderer}
    >
      <SceneEnvironment />
      <Suspense fallback={null}>
        <Lab {...props} />
      </Suspense>
    </Canvas>
  );
}

const NIGHT = new Color("#0b0b0d");
const STUDIO = new Color("#f4f1ec");

function Lab({
  stop,
  inspect,
  env,
  angle,
  orbit,
  focus,
  armPlaying,
  lidClosed,
  onSelect,
  onFocus,
  isMobile
}: LabCanvasProps) {
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const key = useRef<SpotLight>(null);
  const groups = useRef<Partial<Record<LabObject, Group | null>>>({});
  const screen = useMemo(() => makeScreenTexture(true), []);
  useEffect(() => () => screen?.dispose(), [screen]);

  const bench = useMemo(
    () =>
      new MeshPhysicalMaterial({
        color: "#141316",
        roughness: 0.32,
        clearcoat: 0.35,
        clearcoatRoughness: 0.25
      }),
    []
  );
  const wall = useMemo(
    () => new MeshPhysicalMaterial({ color: "#0e0e10", roughness: 0.95 }),
    []
  );
  useEffect(
    () => () => {
      bench.dispose();
      wall.dispose();
    },
    [bench, wall]
  );

  useEffect(() => {
    if (key.current) key.current.target.position.set(0, 0, 0);
  }, []);

  const studio = inspect !== null && env === "studio";
  const isolate = inspect !== null && env !== "context";

  const s = useRef({
    eye: new Vector3(0.05, 0.62, 1.5),
    look: new Vector3(0, 0.12, 0),
    ready: false
  });
  const tmp = useMemo(
    () => ({
      eye: new Vector3(),
      look: new Vector3(),
      v: new Vector3(),
      bg: new Color()
    }),
    []
  );

  useFrame((_, delta) => {
    // Background and reflections follow the chosen environment.
    tmp.bg.copy(studio ? STUDIO : NIGHT);
    if (!(scene.background instanceof Color)) scene.background = new Color();
    (scene.background as Color).lerp(tmp.bg, 1 - Math.exp(-6 * delta));
    scene.environmentIntensity = studio ? 0.9 : 0.35;
    bench.color.lerp(
      studio ? STUDIO_BENCH : NIGHT_BENCH,
      1 - Math.exp(-6 * delta)
    );

    if (inspect) {
      const place = PLACES[inspect];
      const preset = PRESETS[angle];
      const centre = tmp.look.set(place.pos[0], place.cy, place.pos[2]);
      if (focus && inspect !== "arm") {
        const spot = HOTSPOTS[inspect as "arduino" | "pi"]?.find(
          (h) => h.id === focus
        );
        if (spot) toWorld(spot.at, place, centre);
      }
      const az = place.yaw + preset.az + orbit.current.az;
      const pol = Math.min(1.5, Math.max(0.12, preset.pol + orbit.current.pol));
      const dist =
        place.radius *
        4.1 *
        preset.dist *
        orbit.current.zoom *
        (focus ? 0.6 : 1) *
        (isMobile ? 1.25 : 1);
      tmp.eye.set(
        centre.x + Math.sin(az) * Math.sin(pol) * dist,
        centre.y + Math.cos(pol) * dist,
        centre.z + Math.cos(az) * Math.sin(pol) * dist
      );
    } else {
      const shot = STOPS[Math.min(STOPS.length - 1, stop)];
      tmp.eye.set(
        shot.eye[0],
        shot.eye[1],
        shot.eye[2] * (isMobile ? 1.35 : 1)
      );
      tmp.look.set(shot.look[0], shot.look[1], shot.look[2]);
    }

    const st = s.current;
    const k = st.ready ? 1 - Math.exp(-4.5 * delta) : 1;
    st.ready = true;
    st.eye.lerp(tmp.eye, k);
    st.look.lerp(tmp.look, k);
    camera.position.copy(st.eye);
    camera.lookAt(st.look);
  });

  const select = (o: LabObject) => (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    onSelect(o);
  };
  const hover = (on: boolean) => () => {
    document.body.style.cursor = on && !inspect ? "pointer" : "auto";
  };
  useEffect(() => () => void (document.body.style.cursor = "auto"), []);

  const visible = (o: LabObject) => !isolate || inspect === o;

  const objects: [LabObject, React.ReactNode][] = [
    ["monitor", <Monitor key="m" />],
    ["laptop", <Laptop key="l" screen={screen} closed={lidClosed} />],
    ["arm", <RobotArm key="a" playing={armPlaying} />],
    ["arduino", <Board key="ar" kind="arduino" />],
    ["pi", <Board key="p" kind="pi" />]
  ];

  return (
    <>
      <ambientLight intensity={studio ? 0.6 : 0.08} />
      <spotLight
        ref={key}
        position={[-0.6, 2.2, 1.1]}
        angle={0.55}
        penumbra={1}
        intensity={studio ? 18 : 26}
        color="#fff3e4"
        castShadow
        shadow-mapSize={isMobile ? [1024, 1024] : [2048, 2048]}
        shadow-bias={-0.0002}
      />
      <directionalLight
        position={[1.2, 0.9, -1.4]}
        intensity={studio ? 0.6 : 1.4}
        color="#ffe6d6"
      />
      {studio ? <hemisphereLight args={["#ffffff", "#e7e2d9", 1.1]} /> : null}

      {/* Bench and wall, with the maroon practical strip behind. */}
      <mesh
        geometry={roundedBox(1.7, 0.04, 0.78, 0.008)}
        material={bench}
        position={[0, -0.02, 0]}
        receiveShadow
      />
      {!studio ? (
        <>
          <mesh material={wall} position={[0, 0.6, -0.45]}>
            <planeGeometry args={[4, 2]} />
          </mesh>
          <mesh position={[0, 0.62, -0.44]}>
            <boxGeometry args={[1.1, 0.008, 0.004]} />
            <meshStandardMaterial
              color="#000"
              emissive="#6e1f24"
              emissiveIntensity={4}
            />
          </mesh>
        </>
      ) : null}

      {objects.map(([name, node]) => {
        const p = PLACES[name];
        return (
          <group
            key={name}
            ref={(g) => {
              groups.current[name] = g;
            }}
            position={p.pos}
            rotation={[0, p.yaw, 0]}
            visible={visible(name)}
            onClick={inspect ? undefined : select(name)}
            onPointerOver={hover(true)}
            onPointerOut={hover(false)}
          >
            {node}
          </group>
        );
      })}

      <ContactShadows
        position={[0, 0.001, 0]}
        scale={[1.7, 0.78]}
        opacity={studio ? 0.4 : 0.7}
        blur={2.4}
        far={0.5}
        resolution={512}
        color="#000"
      />

      {/* Board hotspots: passive labels at the boards stop, buttons when inspecting. */}
      {(["arduino", "pi"] as const).map((board) =>
        (inspect === board || (!inspect && stop === 1)) && visible(board)
          ? HOTSPOTS[board]
              // Two per board at the bench stop; all five when inspecting.
              .filter((h) => inspect === board || BENCH_LABELS.includes(h.id))
              .map((h) => (
                <Hotspot
                  key={`${board}-${h.id}`}
                  position={toWorld(
                    h.at,
                    PLACES[board],
                    new Vector3()
                  ).toArray()}
                  label={h.label}
                  active={focus === h.id}
                  interactive={inspect === board}
                  onClick={() => onFocus(focus === h.id ? null : h.id)}
                  light={studio}
                />
              ))
          : null
      )}
      {inspect === "arm" || (!inspect && stop === 2) ? (
        <ArmLabels arm={groups.current.arm ?? null} light={studio} />
      ) : null}
    </>
  );
}

const STUDIO_BENCH = new Color("#e7e2d9");
const BENCH_LABELS = ["mcu", "usb", "soc", "gpio"];
const NIGHT_BENCH = new Color("#141316");

/** Model-local point -> world, through the object's place on the bench. */
function toWorld(
  at: readonly [number, number, number],
  place: (typeof PLACES)[LabObject],
  out: Vector3
) {
  const c = Math.cos(place.yaw);
  const sn = Math.sin(place.yaw);
  return out.set(
    place.pos[0] + at[0] * c + at[2] * sn,
    place.pos[1] + at[1],
    place.pos[2] - at[0] * sn + at[2] * c
  );
}

function Hotspot({
  position,
  label,
  active,
  interactive,
  onClick,
  light
}: {
  position: [number, number, number];
  label: string;
  active: boolean;
  interactive: boolean;
  onClick: () => void;
  light: boolean;
}) {
  const tone = light ? "text-ink border-ink" : "text-paper border-paper";
  return (
    <Html position={position} center zIndexRange={[20, 0]}>
      {interactive ? (
        <button
          type="button"
          onClick={onClick}
          aria-pressed={active}
          className={cn(
            "flex min-h-8 items-center gap-2 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.12em]",
            tone
          )}
        >
          <span
            className={cn(
              "block h-3 w-3 rounded-full border-[1.5px]",
              active && "bg-coral border-coral"
            )}
          />
          <span
            className={cn(
              "transition-opacity",
              active ? "opacity-100" : "opacity-70"
            )}
          >
            {label}
          </span>
        </button>
      ) : (
        <span
          className={cn(
            "pointer-events-none flex items-center gap-2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.12em] opacity-80",
            tone
          )}
        >
          <span className="block h-2.5 w-2.5 rounded-full border-[1.5px]" />
          {label}
        </span>
      )}
    </Html>
  );
}

/** Labels that ride the arm's real joints as they move. */
function ArmLabels({ arm, light }: { arm: Group | null; light: boolean }) {
  const anchors = useRef<(Object3D | null)[]>([]);
  const joints = useMemo(
    () => ARM_JOINTS.map((n) => arm?.getObjectByName(n) ?? null),
    [arm]
  );
  const v = useMemo(() => new Vector3(), []);
  useFrame(() => {
    joints.forEach((j, i) => {
      const a = anchors.current[i];
      if (j && a) a.position.copy(j.getWorldPosition(v));
    });
  });
  return (
    <>
      {ARM_JOINTS.map((name, i) => (
        <group
          key={name}
          ref={(g) => {
            anchors.current[i] = g;
          }}
        >
          <Html center zIndexRange={[20, 0]}>
            <span
              className={cn(
                "pointer-events-none flex items-center gap-2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.12em] opacity-80",
                light ? "text-ink" : "text-paper"
              )}
            >
              <span className="block h-2.5 w-2.5 rounded-full border-[1.5px] border-current" />
              {ARM_LABELS[name]}
            </span>
          </Html>
        </group>
      ))}
    </>
  );
}
