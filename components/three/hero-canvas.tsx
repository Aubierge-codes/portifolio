"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";

import { Vector3, type Group, type Mesh } from "three";
import {
  CAST,
  Person,
  strideRate,
  type Holding,
  type Look
} from "@/components/world/person";
import { HeroFigure } from "@/components/hero/hero-figure";
import { SceneErrorBoundary } from "@/components/three/scene-error-boundary";
import { tuneRenderer } from "@/components/three/three-frame";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { markHeroReady, useSiteEntered } from "@/lib/site-ready";
import { hasWebGL } from "@/lib/webgl";

type HeroPhase = "enter" | "run" | "look" | "kick" | "cta" | "rest";

type HeroCanvasProps = {
  phase: HeroPhase;
  isMobile: boolean;
  className?: string;
};

export function HeroCanvas({ phase, isMobile, className }: HeroCanvasProps) {
  const reduceMotion = useReducedMotion();

  // Sized like the placeholder shown while this chunk loads.
  const still = (
    <div className="flex h-full items-end justify-center pb-2">
      <HeroFigure pose="idle" carry="laptop" className="w-20" />
      <ReadyOnMount />
    </div>
  );

  // This component only renders on the client (dynamic, ssr: false), so the
  // WebGL check can't cause a hydration mismatch.
  if (reduceMotion || !hasWebGL()) {
    return (
      <div className={cn("relative h-full w-full", className)}>{still}</div>
    );
  }

  return (
    <div className={cn("relative h-full w-full", className)}>
      <SceneErrorBoundary fallback={still}>
        <Canvas
          camera={{
            position: isMobile ? [0.4, 1.15, 4.4] : [0.2, 1.25, 5.1],
            fov: isMobile ? 36 : 30
          }}
          dpr={[1, 1.4]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
          }}
          onCreated={tuneRenderer}
        >
          <color attach="background" args={["#ffffff"]} />
          <ambientLight intensity={0.72} />
          <directionalLight position={[3.2, 5, 2.4]} intensity={1.05} />
          <directionalLight position={[-2.5, 1.4, -1]} intensity={0.25} />
          <Suspense fallback={null}>
            <HeroRig phase={phase} isMobile={isMobile} />
            <ReadyOnFirstFrame />
            <CameraIntro />
          </Suspense>
        </Canvas>
      </SceneErrorBoundary>
    </div>
  );
}

/** Tells the site loader the hero has actually drawn, then does nothing. */
function ReadyOnFirstFrame() {
  const done = useRef(false);
  useFrame(() => {
    if (done.current) return;
    done.current = true;
    markHeroReady();
  });
  return null;
}

/**
 * Picks up where the loader leaves off: the camera waits a little higher and
 * further back, then glides into its resting framing as the overlay lifts.
 */
function CameraIntro() {
  const camera = useThree((s) => s.camera);
  const entered = useSiteEntered();
  const rest = useRef<Vector3 | null>(null);
  const start = useRef<number | null>(null);

  useFrame(({ clock }) => {
    rest.current ??= camera.position.clone();
    const base = rest.current;
    if (!entered) {
      camera.position.set(base.x - 0.3, base.y + 0.45, base.z + 1.6);
      return;
    }
    start.current ??= clock.getElapsedTime();
    const t = Math.min(1, (clock.getElapsedTime() - start.current) / 1.8);
    if (t >= 1 && camera.position.equals(base)) return;
    const e = 1 - Math.pow(1 - t, 3);
    camera.position.set(
      base.x - 0.3 * (1 - e),
      base.y + 0.45 * (1 - e),
      base.z + 1.6 * (1 - e)
    );
  });
  return null;
}

/** The static fallbacks count as ready as soon as they're on screen. */
function ReadyOnMount() {
  useEffect(() => markHeroReady(), []);
  return null;
}

/** The old mannequins stood about 1.4 units tall; people keep that framing. */
const PERSON_SCALE = 0.86;

function HeroRig({ phase, isMobile }: { phase: HeroPhase; isMobile: boolean }) {
  const kicked = phase === "kick" || phase === "cta" || phase === "rest";

  return (
    <group position={[0, -0.82, 0]}>
      {/* The figures' only ground reference is this hairline, matching the
          page's other rules. ContactShadows below renders onto its own
          surface and doesn't need a filled floor. */}
      <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 0.01]} />
        <meshStandardMaterial color="#030303" />
      </mesh>
      <Walker
        look={CAST.amara}
        holding="laptop"
        duration={10.8}
        start={-5.4}
        end={5.6}
        z={0.15}
        delay={0}
        lookAt={phase === "look" && !isMobile}
      />
      {isMobile ? null : (
        <>
          <Walker
            look={CAST.keza}
            holding="tablet"
            duration={12.2}
            start={-6.4}
            end={5.2}
            z={-0.2}
            delay={1.1}
          />
          <Walker
            look={CAST.david}
            duration={13.1}
            start={-7.2}
            end={4.8}
            z={0.35}
            delay={2.2}
            lookAt={phase === "look"}
          />
        </>
      )}
      <StorySphere kicked={kicked} />
      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.22}
        scale={14}
        blur={2.4}
        far={3.2}
        color="#030303"
      />
    </group>
  );
}

function Walker({
  look,
  holding = "none",
  duration,
  start,
  end,
  z,
  delay,
  lookAt = false
}: {
  look: Look;
  holding?: Holding;
  duration: number;
  start: number;
  end: number;
  z: number;
  delay: number;
  /** Turn the head toward the viewer for a beat. */
  lookAt?: boolean;
}) {
  const group = useRef<Group>(null);

  // Drive the stride from how fast this walker actually crosses the scene, so
  // the feet plant instead of skating along under a fixed-rate cycle.
  const stride = useMemo(
    () => strideRate(Math.abs(end - start) / duration / PERSON_SCALE),
    [start, end, duration]
  );

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = ((clock.getElapsedTime() + delay) % duration) / duration;
    group.current.position.x = start + (end - start) * t;
    group.current.position.z = z;
    group.current.rotation.y = Math.PI / 2;
  });

  return (
    <group ref={group} scale={PERSON_SCALE}>
      <Person
        look={look}
        pose="walk"
        holding={holding}
        speed={stride}
        phase={delay * 2.3}
        gaze={lookAt ? -1.1 : 0}
      />
    </group>
  );
}

function StorySphere({ kicked }: { kicked: boolean }) {
  const mesh = useRef<Mesh>(null);
  const kickAt = useRef<number | null>(null);
  const origin = useMemo(() => ({ x: -1.1, y: 0.12, z: 0.2 }), []);

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    if (!kicked) {
      kickAt.current = null;
      mesh.current.position.set(origin.x, origin.y, origin.z);
      mesh.current.scale.set(1, 1, 1);
      return;
    }
    if (kickAt.current === null) kickAt.current = clock.getElapsedTime();
    const t = Math.min(1, (clock.getElapsedTime() - kickAt.current) / 1.15);
    const lift = Math.sin(t * Math.PI) * 0.55;
    mesh.current.position.set(origin.x + t * 3.4, origin.y + lift, origin.z);
    const squash = t > 0.82 ? 1 + (t - 0.82) * 1.4 : 1;
    mesh.current.scale.set(1 / squash, squash, 1 / squash);
    mesh.current.rotation.z = -t * 4.2;
  });

  return (
    <mesh ref={mesh} position={[origin.x, origin.y, origin.z]}>
      <sphereGeometry args={[0.11, 24, 24]} />
      <meshStandardMaterial color="#111110" roughness={0.32} metalness={0.18} />
    </mesh>
  );
}
