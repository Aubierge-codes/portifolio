"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group, Mesh, MeshStandardMaterial } from "three";
import { ThreeFrame } from "@/components/three/three-frame";

/**
 * Velora is frontend engineering work — responsive layout and component
 * organisation. So the scene is an interface reflowing: a viewport that
 * narrows and widens while its component blocks rearrange between a
 * multi-column and a stacked layout, which is the job made visible.
 */
function ResponsiveLayout() {
  const frame = useRef<Mesh>(null);
  const blocks = useRef<(Group | null)[]>([]);

  // Wide layout: header, two columns, footer. Narrow: everything stacked.
  const WIDE = [
    { x: 0, y: 0.52, w: 2.0, h: 0.16 },
    { x: -0.53, y: 0.16, w: 0.94, h: 0.46 },
    { x: 0.53, y: 0.16, w: 0.94, h: 0.46 },
    { x: 0, y: -0.28, w: 2.0, h: 0.2 }
  ];
  const NARROW = [
    { x: 0, y: 0.56, w: 0.96, h: 0.14 },
    { x: 0, y: 0.3, w: 0.96, h: 0.3 },
    { x: 0, y: -0.06, w: 0.96, h: 0.3 },
    { x: 0, y: -0.36, w: 0.96, h: 0.16 }
  ];

  useFrame(({ clock }) => {
    // Ease between the two breakpoints and hold at each end.
    const raw = (Math.sin(clock.getElapsedTime() * 0.5) + 1) / 2;
    const t = raw < 0.5 ? 2 * raw * raw : 1 - Math.pow(-2 * raw + 2, 2) / 2;

    const frameW = 2.3 - t * 1.05;
    if (frame.current) frame.current.scale.x = frameW / 2.3;

    blocks.current.forEach((block, i) => {
      if (!block) return;
      const a = WIDE[i];
      const b = NARROW[i];
      block.position.x = a.x + (b.x - a.x) * t;
      block.position.y = a.y + (b.y - a.y) * t;
      block.scale.x = a.w + (b.w - a.w) * t;
      block.scale.y = a.h + (b.h - a.h) * t;
    });
  });

  return (
    // Tilted back to cancel the shared camera's downward angle, so the layout
    // is read face-on like a screen instead of skewing into a trapezoid.
    <group position={[0, -0.05, 0]} rotation={[0.26, 0, 0]}>
      {/* Viewport that narrows and widens. */}
      <mesh ref={frame}>
        <planeGeometry args={[2.3, 1.42]} />
        <meshBasicMaterial color="#eceae6" />
      </mesh>

      {WIDE.map((_, i) => (
        <group
          key={i}
          ref={(el) => {
            blocks.current[i] = el;
          }}
          position={[0, 0, 0.01]}
        >
          <mesh>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial color={i === 0 ? "#6E1F24" : "#1b1d21"} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function VeloraScene() {
  return (
    <ThreeFrame
      className="h-40 md:h-48"
      fallback={<div className="h-full w-full bg-paper" />}
    >
      <ResponsiveLayout />
    </ThreeFrame>
  );
}

/**
 * Cloud built from a cluster of overlapping spheres at varied sizes and
 * depths, rather than three same-size balls in a row. The silhouette is what
 * sells a cloud: a heavier flat-ish base with piled, uneven tops. Shaded with
 * a slight grey underside so it has volume instead of reading as a white blob
 * on a white page.
 */
function Cloud({
  position,
  scale = 1,
  drift = 0.4,
  speed = 0.2,
  tone = "#ffffff"
}: {
  position: [number, number, number];
  scale?: number;
  drift?: number;
  speed?: number;
  tone?: string;
}) {
  const ref = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.position.x = position[0] + Math.sin(t * speed) * drift;
    // Puffs breathe very slightly so the mass isn't perfectly rigid.
    ref.current.scale.setScalar(scale * (1 + Math.sin(t * 0.4) * 0.012));
  });

  const puffs: [number, number, number, number][] = [
    // x, y, z, radius
    [0, 0, 0, 0.22],
    [0.21, 0.04, -0.04, 0.17],
    [-0.2, 0.02, 0.03, 0.16],
    [0.09, 0.14, 0.02, 0.15],
    [-0.09, 0.12, -0.05, 0.13],
    [0.34, -0.04, 0.01, 0.11],
    [-0.33, -0.03, -0.02, 0.1]
  ];

  return (
    <group ref={ref} position={position} scale={scale}>
      {puffs.map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[r, 18, 14]} />
          <meshStandardMaterial
            color={tone}
            roughness={1}
            flatShading={false}
          />
        </mesh>
      ))}
      {/* Flatter, slightly shaded base so the cloud sits rather than floats. */}
      <mesh position={[0, -0.08, 0]} scale={[1.15, 0.45, 0.9]}>
        <sphereGeometry args={[0.24, 18, 12]} />
        <meshStandardMaterial color="#e4e7ea" roughness={1} />
      </mesh>
    </group>
  );
}

function Rain({ count = 26 }: { count?: number }) {
  const ref = useRef<Group>(null);
  // Fixed offsets — Math.random() during render would reshuffle every frame.
  const drops = useRef(
    Array.from({ length: count }, (_, i) => ({
      x: -1.15 + (i % 13) * 0.18 + ((i * 37) % 7) * 0.012,
      z: -0.35 + ((i * 53) % 9) * 0.08,
      offset: ((i * 29) % 100) / 100
    }))
  );

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.children.forEach((child, i) => {
      const d = drops.current[i];
      const fall = (t * 0.85 + d.offset) % 1;
      child.position.y = 0.42 - fall * 1.15;
      // Fade out near the bottom so drops don't pop.
      const mesh = child as Mesh;
      const material = mesh.material as MeshStandardMaterial;
      material.opacity = Math.min(1, (1 - fall) * 2.2) * 0.5;
    });
  });

  return (
    <group ref={ref}>
      {drops.current.map((d, i) => (
        <mesh key={i} position={[d.x, 0, d.z]}>
          <capsuleGeometry args={[0.0055, 0.07, 3, 5]} />
          <meshStandardMaterial
            color="#8fa3b5"
            transparent
            opacity={0.5}
            roughness={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

export function WeatherScene() {
  return (
    <ThreeFrame
      className="h-40 md:h-48"
      fallback={<div className="h-full w-full bg-paper" />}
    >
      {/* Sun behind the break in the cloud cover. */}
      <mesh position={[1.05, 0.72, -1.2]}>
        <circleGeometry args={[0.3, 32]} />
        <meshBasicMaterial color="#f7e6c8" />
      </mesh>
      <Cloud position={[-0.62, 0.52, 0]} scale={1.05} speed={0.17} />
      <Cloud
        position={[0.62, 0.66, -0.45]}
        scale={0.8}
        speed={0.23}
        drift={0.3}
      />
      <Cloud
        position={[0.05, 0.3, 0.45]}
        scale={0.6}
        speed={0.29}
        drift={0.22}
        tone="#f1f3f5"
      />
      <Rain />
    </ThreeFrame>
  );
}

const SPINE_COLOURS = [
  "#1b1d21",
  "#6E1F24",
  "#2f3a42",
  "#4a3b32",
  "#1b1d21",
  "#57483a",
  "#2b2f36",
  "#6E1F24",
  "#1f2933"
];

/**
 * A shelf of books with one title easing out of the row and turning to face
 * front — browsing and discovery, which is what the project is for. A book
 * rotating on the spot said "3D object"; a book being picked off a shelf says
 * "bookstore".
 */
function Shelf() {
  const picked = useRef<Group>(null);
  const PICK_INDEX = 4;

  useFrame(({ clock }) => {
    if (!picked.current) return;
    const cycle = 7;
    const t = (clock.getElapsedTime() % cycle) / cycle;
    // Out of the row, turn to face, hold, then back.
    const out =
      t < 0.25 ? t / 0.25 : t < 0.6 ? 1 : t < 0.85 ? 1 - (t - 0.6) / 0.25 : 0;
    const ease = out * out * (3 - 2 * out);
    picked.current.position.z = ease * 0.42;
    picked.current.position.y = ease * 0.06;
    picked.current.rotation.y = ease * 1.35;
  });

  return (
    <group position={[0, -0.35, 0]}>
      {/* shelf board */}
      <mesh position={[0, -0.03, 0]}>
        <boxGeometry args={[1.85, 0.05, 0.42]} />
        <meshStandardMaterial color="#4a3b32" roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.34, -0.19]}>
        <boxGeometry args={[1.85, 0.72, 0.04]} />
        <meshStandardMaterial color="#e6e1d9" roughness={1} />
      </mesh>

      {SPINE_COLOURS.map((colour, i) => {
        const x = -0.78 + i * 0.195;
        const h = 0.44 + ((i * 7) % 3) * 0.05;
        const isPicked = i === PICK_INDEX;
        const book = (
          <mesh position={[0, h / 2, 0]}>
            <boxGeometry args={[0.13, h, 0.3]} />
            <meshStandardMaterial color={colour} roughness={0.85} />
          </mesh>
        );
        return isPicked ? (
          <group key={i} ref={picked} position={[x, 0, 0]}>
            {book}
          </group>
        ) : (
          <group
            key={i}
            position={[x, 0, 0]}
            rotation={[0, 0, i % 4 === 3 ? 0.06 : 0]}
          >
            {book}
          </group>
        );
      })}
    </group>
  );
}

export function BookstoreScene() {
  return (
    <ThreeFrame
      className="h-40 md:h-48"
      fallback={<div className="h-full w-full bg-paper" />}
    >
      <Shelf />
    </ThreeFrame>
  );
}

const NODE_X = [-0.95, -0.02, 0.92];

/**
 * Save-Wise as a flow diagram rather than abstract objects: income arrives,
 * the app allocates a share of it, and the goal bar fills toward its target.
 * Deliberately three nodes and one bar — the point is that the logic reads at
 * a glance, not that it looks like a trading dashboard.
 */
function SaveWiseFlow() {
  const coins = useRef<(Group | null)[]>([]);
  const fill = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Coins travel income -> allocation -> goal, staggered along the path.
    coins.current.forEach((coin, i) => {
      if (!coin) return;
      const p = (t * 0.3 + i / coins.current.length) % 1;
      coin.position.x = NODE_X[0] + (NODE_X[2] - NODE_X[0]) * p;
      // Small hop between nodes so it reads as transfer, not a slide.
      coin.position.y = 0.34 + Math.abs(Math.sin(p * Math.PI * 2)) * 0.09;
      coin.rotation.y = p * Math.PI * 4;
      coin.visible = p < 0.97;
    });

    // Goal bar fills over a longer cycle, then resets — progress toward target.
    if (fill.current) {
      const progress = (t * 0.075) % 1;
      fill.current.scale.x = Math.max(0.001, progress);
      fill.current.position.x = -0.6 + progress * 0.6;
    }
  });

  return (
    <group position={[0, -0.18, 0]} rotation={[0.26, 0, 0]}>
      {/* connector rail */}
      <mesh position={[0, 0.34, -0.02]}>
        <planeGeometry args={[1.95, 0.012]} />
        <meshBasicMaterial color="#c9c5bd" />
      </mesh>

      {/* income -> allocation -> goal */}
      {NODE_X.map((x, i) => (
        <group key={x} position={[x, 0.34, 0]}>
          <mesh>
            <circleGeometry args={[0.15, 28]} />
            <meshBasicMaterial color={i === 1 ? "#6E1F24" : "#1b1d21"} />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <circleGeometry args={[0.105, 28]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          {/* glyphs: coin slot, split, target ring */}
          {i === 0 ? (
            <mesh position={[0, 0, 0.02]}>
              <planeGeometry args={[0.02, 0.09]} />
              <meshBasicMaterial color="#1b1d21" />
            </mesh>
          ) : null}
          {i === 1 ? (
            <>
              <mesh position={[0, 0.025, 0.02]}>
                <planeGeometry args={[0.1, 0.018]} />
                <meshBasicMaterial color="#6E1F24" />
              </mesh>
              <mesh position={[0, -0.025, 0.02]}>
                <planeGeometry args={[0.055, 0.018]} />
                <meshBasicMaterial color="#6E1F24" />
              </mesh>
            </>
          ) : null}
          {i === 2 ? (
            <mesh position={[0, 0, 0.02]}>
              <ringGeometry args={[0.03, 0.055, 20]} />
              <meshBasicMaterial color="#1b1d21" />
            </mesh>
          ) : null}
        </group>
      ))}

      {/* money in transit */}
      {[0, 1, 2].map((i) => (
        <group
          key={i}
          ref={(el) => {
            coins.current[i] = el;
          }}
        >
          <mesh position={[0, 0, 0.03]}>
            <circleGeometry args={[0.042, 18]} />
            <meshBasicMaterial color="#c98a4b" />
          </mesh>
        </group>
      ))}

      {/* goal progress bar */}
      <mesh position={[0, -0.12, 0]}>
        <planeGeometry args={[1.2, 0.085]} />
        <meshBasicMaterial color="#e2ded6" />
      </mesh>
      <mesh ref={fill} position={[-0.6, -0.12, 0.01]}>
        <planeGeometry args={[1.2, 0.085]} />
        <meshBasicMaterial color="#6E1F24" />
      </mesh>
    </group>
  );
}

export function JavaScene() {
  return (
    <ThreeFrame
      className="h-40 md:h-48"
      fallback={<div className="h-full w-full bg-paper" />}
    >
      <SaveWiseFlow />
    </ThreeFrame>
  );
}
