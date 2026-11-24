"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import {
  Vector2,
  Vector3,
  type DirectionalLight,
  type PerspectiveCamera
} from "three";
import { SceneErrorBoundary } from "@/components/three/scene-error-boundary";
import { SceneEnvironment } from "@/components/three/scene-environment";
import { tuneRenderer } from "@/components/three/three-frame";
import {
  Board,
  Laptop,
  RobotArm,
  makeScreenTexture
} from "@/components/three/real/models";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { hasWebGL } from "@/lib/webgl";
import { markHeroReady, useSiteEntered } from "@/lib/site-ready";

/*
 * The hero: Aubierge's real workstation photographed like a product. A stone
 * plinth carries the laptop (showing the portfolio), the articulated arm and
 * the two boards, arranged on a diagonal from the boards in front to the arm
 * behind. Composition, camera and motion follow DESIGN_BLUEPRINT.md §3.2 and
 * INTERACTION_SPECIFICATION.md §2–3.
 */

// No module-level preload: reduced-motion and no-WebGL visitors only ever see
// the still, so the models load when the live scene actually renders.

type HeroCanvasProps = {
  isMobile: boolean;
  className?: string;
};

export function HeroCanvas({ isMobile, className }: HeroCanvasProps) {
  const reduceMotion = useReducedMotion();
  const host = useRef<HTMLDivElement>(null);
  // Render only while the hero is on screen; off-screen it would keep a
  // second scene drawing at full rate behind the Work world.
  const [onScreen, setOnScreen] = useState(true);
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Reduced motion and no-WebGL keep the Blender still the DOM already shows.
  if (reduceMotion || !hasWebGL()) {
    return <ReadyOnMount />;
  }

  return (
    <div ref={host} className={cn("relative h-full w-full", className)}>
      <SceneErrorBoundary fallback={<ReadyOnMount />}>
        <Canvas
          frameloop={onScreen ? "always" : "never"}
          shadows="percentage"
          dpr={isMobile ? [1, 1.25] : [1, 1.5]}
          camera={{ fov: 30, near: 0.05, far: 20, position: [0, 0.5, 2] }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
          }}
          onCreated={tuneRenderer}
        >
          <SceneEnvironment />
          <Lights isMobile={isMobile} />
          <Suspense fallback={null}>
            <Workstation />
            <Director />
            <ReadyOnFirstFrame />
          </Suspense>
        </Canvas>
      </SceneErrorBoundary>
    </div>
  );
}

function Lights({ isMobile }: { isMobile: boolean }) {
  const key = useRef<DirectionalLight>(null);
  useEffect(() => {
    if (key.current) key.current.target.position.set(0.1, 0, 0);
  }, []);
  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight
        ref={key}
        position={[-1.2, 2.2, 1.6]}
        intensity={2.4}
        color="#fff4e6"
        castShadow
        shadow-mapSize={isMobile ? [1024, 1024] : [2048, 2048]}
        shadow-bias={-0.0002}
        shadow-normalBias={0.01}
        shadow-camera-left={-1}
        shadow-camera-right={1}
        shadow-camera-top={1}
        shadow-camera-bottom={-1}
        shadow-camera-near={0.5}
        shadow-camera-far={6}
      />
      <directionalLight
        position={[1.6, 0.8, 1.2]}
        intensity={0.45}
        color="#dce8ff"
      />
      <directionalLight
        position={[0.6, 1.4, -1.6]}
        intensity={1.1}
        color="#fff8f0"
      />
    </>
  );
}

/** Plinth and objects, in metres. The arm reaches back toward the boards. */
function Workstation() {
  const screen = useMemo(() => makeScreenTexture(false), []);
  useEffect(() => () => screen?.dispose(), [screen]);
  return (
    <group>
      {/* A studio floor that shows only the shadows falling on it, so the
          objects sit on the page itself, as in a catalogue photograph. */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0.1, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[4, 3]} />
        <shadowMaterial transparent opacity={0.16} />
      </mesh>
      <group position={[-0.02, 0, -0.04]} rotation={[0, 0.28, 0]}>
        <Laptop screen={screen} />
      </group>
      <group position={[0.5, 0, -0.1]} rotation={[0, 0.55, 0]}>
        <RobotArm />
      </group>
      <group position={[0.02, 0, 0.27]} rotation={[0, 0.55, 0]}>
        <Board kind="arduino" />
      </group>
      <group position={[0.26, 0, 0.24]} rotation={[0, -0.25, 0]}>
        <Board kind="pi" />
      </group>
      <ContactShadows
        position={[0.1, 0.0015, 0]}
        scale={[1.6, 1]}
        opacity={0.42}
        blur={2.2}
        far={0.4}
        resolution={512}
        color="#1c1b19"
      />
    </group>
  );
}

const SUBJECT = new Vector3(0.16, 0.12, 0);
const SCREEN = new Vector3(0.0, 0.14, -0.06);
const DIRECTION = new Vector3(-0.32, 0.36, 1).normalize();
const UP = new Vector3(0, 1, 0);

/**
 * Camera director: frames the workstation for the canvas's shape, leaves the
 * left of wide frames to the type, follows the pointer slightly, glides in
 * after the loader and dollies toward the laptop as the hero scrolls away.
 */
function Director() {
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const size = useThree((s) => s.size);
  const entered = useSiteEntered();
  const pointer = useRef(new Vector2());
  const lastMove = useRef(0);
  const intro = useRef<number | null>(null);
  const state = useRef({
    ready: false,
    eye: new Vector3(),
    look: new Vector3(),
    offset: 0
  });
  const tmp = useMemo(
    () => ({ eye: new Vector3(), look: new Vector3(), dir: new Vector3() }),
    []
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        (e.clientY / window.innerHeight) * 2 - 1
      );
      lastMove.current = performance.now();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame(({ clock }, delta) => {
    // Full-bleed beside the copy only on landscape desktops (the CSS switches
    // at the same lg breakpoint); tablets and phones stack scene under text.
    const wide = typeof window !== "undefined" && window.innerWidth >= 1024;
    const aspect = size.width / Math.max(1, size.height);
    // Fit a 1.0 × 0.62 m subject; on wide frames it gets the right 46 %.
    const usable = wide ? 0.46 : 0.96;
    const halfV = Math.tan((camera.fov * Math.PI) / 360);
    const fitW = 1.0 / usable / 2 / (halfV * aspect);
    const fitH = 0.62 / 0.8 / 2 / halfV;
    let distance = Math.max(fitW, fitH);

    // Scroll: hold, then dolly toward the laptop's screen.
    const hero = Math.min(
      1,
      Math.max(0, window.scrollY / Math.max(1, window.innerHeight))
    );
    const dolly = Math.min(1, Math.max(0, (hero - 0.5) / 0.5));
    const d = dolly * dolly * (3 - 2 * dolly);
    tmp.look.copy(SUBJECT).lerp(SCREEN, d);
    distance *= 1 - 0.55 * d;

    // Pointer: a small orbit, easing home after four idle seconds.
    const idle = performance.now() - lastMove.current > 4000;
    const yaw = idle ? 0 : -pointer.current.x * 0.028;
    const pitch = idle ? 0 : pointer.current.y * 0.014;
    tmp.dir.copy(DIRECTION).applyAxisAngle(UP, yaw);
    tmp.dir.y += pitch;
    tmp.dir.normalize();

    // Intro: waits a little higher and further back until the loader lifts.
    let lift = 1;
    if (entered) {
      intro.current ??= clock.getElapsedTime();
      const t = Math.min(1, (clock.getElapsedTime() - intro.current) / 1.8);
      lift = 1 - (1 - Math.pow(1 - t, 3));
    }
    distance *= 1 + 0.35 * lift;
    tmp.eye.copy(tmp.dir).multiplyScalar(distance).add(tmp.look);
    tmp.eye.y += 0.18 * lift;

    const s = state.current;
    const k = s.ready ? 1 - Math.exp(-6 * delta) : 1;
    s.ready = true;
    s.eye.lerp(tmp.eye, k);
    s.look.lerp(tmp.look, k);
    camera.position.copy(s.eye);
    camera.lookAt(s.look);

    // Shift the frame so the subject sits right of centre on wide screens.
    const offset = wide ? -camera.getFilmWidth() * 0.24 * (1 - d) : 0;
    s.offset += (offset - s.offset) * k;
    if (Math.abs(camera.filmOffset - s.offset) > 1e-4) {
      camera.filmOffset = s.offset;
      camera.updateProjectionMatrix();
    }
  });

  return null;
}

/** Tells the site loader the hero has actually drawn. */
function ReadyOnFirstFrame() {
  const done = useRef(false);
  useFrame(() => {
    if (done.current) return;
    done.current = true;
    markHeroReady();
  });
  return null;
}

/** The still counts as ready as soon as it's on screen. */
function ReadyOnMount() {
  useEffect(() => markHeroReady(), []);
  return null;
}
