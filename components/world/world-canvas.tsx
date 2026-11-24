"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import {
  Bloom,
  EffectComposer,
  N8AO,
  Noise,
  ToneMapping,
  Vignette
} from "@react-three/postprocessing";
import { BlendFunction, ToneMappingMode } from "postprocessing";
import {
  Color,
  Fog,
  Vector3,
  type DirectionalLight,
  type Group,
  type PerspectiveCamera
} from "three";
import { SceneEnvironment } from "@/components/three/scene-environment";
import { tuneRenderer } from "@/components/three/three-frame";
import { SHOTS, SPACING, type Shot } from "@/components/world/chapters";
import {
  EcoSet,
  GwizaSet,
  HerIngressSet,
  UmucoSet,
  VeloraSet
} from "@/components/world/scenes-a";
import { BookstoreSet, JavaSet, WeatherSet } from "@/components/world/scenes-b";
import { KinetiqSet } from "@/components/world/kinetiq";
import { ZeroBiteSet } from "@/components/world/zero-bite";

const SETS: Record<string, () => React.JSX.Element> = {
  heringress: HerIngressSet,
  umucocore: UmucoSet,
  gwiza: GwizaSet,
  velora: VeloraSet,
  "eco-girls": EcoSet,
  "zero-bite": ZeroBiteSet,
  kinetiq: KinetiqSet,
  weather: WeatherSet,
  bookstore: BookstoreSet,
  "java-projects": JavaSet
};

/** Scroll position through the world, 0..1, written by the DOM and read per frame. */
export type ProgressRef = { current: number };

type WorldCanvasProps = {
  progress: ProgressRef;
  isMobile: boolean;
};

export function WorldCanvas({ progress, isMobile }: WorldCanvasProps) {
  // The effect set is chosen once, when the renderer is created, and never
  // changes while scrolling: swapping effects rebuilds the whole post
  // pipeline, which stalled the frame for over a second. Ambient occlusion is
  // the expensive pass, so it's reserved for discrete GPUs; integrated ones
  // (the typical mid laptop) keep a steady frame rate instead. Only
  // resolution adapts after that.
  const [quality, setQuality] = useState<"high" | "low">("low");
  const [dpr, setDpr] = useState(isMobile ? 1 : 1.25);
  const max = isMobile ? 1.25 : 1.5;

  return (
    <Canvas
      shadows="percentage"
      dpr={dpr}
      flat
      camera={{ fov: 36, near: 0.1, far: 140, position: [2.6, 1.75, 3.4] }}
      gl={{
        antialias: false,
        powerPreference: "high-performance",
        stencil: false
      }}
      onCreated={(state) => {
        tuneRenderer(state);
        if (!isMobile && isDiscreteGpu(state.gl.getContext()))
          setQuality("high");
      }}
    >
      <PerformanceMonitor
        flipflops={3}
        onDecline={() => setDpr((d) => Math.max(0.75, d - 0.25))}
        onIncline={() => setDpr((d) => Math.min(max, d + 0.25))}
        onFallback={() => setDpr(isMobile ? 0.75 : 1)}
      />
      <Suspense fallback={null}>
        <SceneEnvironment />
        <World progress={progress} isMobile={isMobile} quality={quality} />
      </Suspense>
    </Canvas>
  );
}

const DISCRETE =
  /nvidia|geforce|quadro|rtx|radeon (?!graphics)|radeon rx|apple m\d (pro|max|ultra)/i;

/** Best-effort read of the GPU name; false whenever it can't be known. */
function isDiscreteGpu(gl: WebGLRenderingContext | WebGL2RenderingContext) {
  try {
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const name = info
      ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL))
      : "";
    return DISCRETE.test(name);
  } catch {
    return false;
  }
}

const tmp = {
  eyeA: new Vector3(),
  eyeB: new Vector3(),
  lookA: new Vector3(),
  lookB: new Vector3(),
  eye: new Vector3(),
  look: new Vector3(),
  colorA: new Color(),
  colorB: new Color(),
  right: new Vector3()
};
const UP = new Vector3(0, 1, 0);

/** Where the camera sits for chapter `i`, `k` chapters away from it (-1..1). */
function pose(shot: Shot, i: number, k: number, eye: Vector3, look: Vector3) {
  const cx = i * SPACING;
  look.set(cx + shot.look[0], shot.look[1], shot.look[2]);
  // Orbit around the look point and drift in as the chapter is scrolled.
  const dx = shot.eye[0] - shot.look[0];
  const dz = shot.eye[2] - shot.look[2];
  const angle = k * shot.orbit;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const scale = 1 - (k + 0.5) * shot.dolly;
  const rise = (k + 0.5) * shot.dolly * 0.6;
  eye.set(
    look.x + (dx * cos - dz * sin) * scale,
    shot.eye[1] + (shot.look[1] - shot.eye[1]) * rise,
    look.z + (dx * sin + dz * cos) * scale
  );
}

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

function World({
  progress,
  isMobile,
  quality
}: {
  progress: ProgressRef;
  isMobile: boolean;
  quality: "high" | "low";
}) {
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const scene = useThree((s) => s.scene);
  const gl = useThree((s) => s.gl);
  const size = useThree((s) => s.size);
  const key = useRef<DirectionalLight>(null);
  const sets = useRef<(Group | null)[]>([]);
  const smoothed = useRef({
    eye: new Vector3(2.6, 1.75, 3.4),
    look: new Vector3(0, 1, 0),
    fov: 36,
    ready: false
  });

  useMemo(() => {
    scene.background = new Color(SHOTS[0].tint);
    scene.fog = new Fog(SHOTS[0].tint, SHOTS[0].fog[0], SHOTS[0].fog[1]);
  }, [scene]);

  // Compile every set's shaders once, up front. Otherwise each set stalls
  // the frame the first time it comes into view.
  useEffect(() => {
    (sets.current.filter(Boolean) as Group[]).forEach(
      (g) => (g.visible = true)
    );
    gl.compileAsync(scene, camera).catch(() => undefined);
  }, [gl, scene, camera]);

  useFrame(({ clock }, delta) => {
    const n = SHOTS.length;
    const f = Math.min(n - 1, Math.max(0, progress.current * (n - 1)));
    const i = Math.min(n - 2, Math.floor(f));
    // Hold on each chapter, then travel: the blend only runs mid-way between.
    const w = smooth(0.3, 0.7, f - i);
    const a = SHOTS[i];
    const b = SHOTS[i + 1];
    pose(a, i, f - i, tmp.eyeA, tmp.lookA);
    pose(b, i + 1, f - i - 1, tmp.eyeB, tmp.lookB);
    tmp.eye.lerpVectors(tmp.eyeA, tmp.eyeB, w);
    tmp.look.lerpVectors(tmp.lookA, tmp.lookB, w);
    // Crane up between sets so travel reads as a move, not a cut.
    tmp.eye.y += Math.sin(w * Math.PI) * 3.2;
    // Camera breathing: a hand-held drift too small to notice as motion.
    const t = clock.getElapsedTime();
    tmp.eye.x += Math.sin(t * 0.31) * 0.03;
    tmp.eye.y += Math.sin(t * 0.47) * 0.02;

    // Frame the subject clear of the text: to the right on wide screens,
    // where the copy sits on the left; higher up on phones, where it's below.
    // Narrow screens see less width: back the camera off so the set fits.
    const aspect = size.width / Math.max(1, size.height);
    const widen = Math.pow(Math.min(2.6, Math.max(1, 1.6 / aspect)), 0.8);
    if (widen > 1) {
      tmp.eye.sub(tmp.look).multiplyScalar(widen).add(tmp.look);
    }

    tmp.right.subVectors(tmp.look, tmp.eye).cross(UP).normalize();
    const reach = tmp.eye.distanceTo(tmp.look);
    if (size.width >= 768) {
      const shift = reach * 0.16;
      tmp.look.addScaledVector(tmp.right, -shift);
      tmp.eye.addScaledVector(tmp.right, -shift * 0.4);
    } else {
      tmp.look.y -= reach * 0.1;
    }

    const s = smoothed.current;
    const k = s.ready ? 1 - Math.exp(-5 * delta) : 1;
    s.ready = true;
    s.eye.lerp(tmp.eye, k);
    s.look.lerp(tmp.look, k);
    s.fov += (a.fov + (b.fov - a.fov) * w - s.fov) * k;
    camera.position.copy(s.eye);
    camera.lookAt(s.look);
    if (Math.abs(camera.fov - s.fov) > 0.01) {
      camera.fov = s.fov;
      camera.updateProjectionMatrix();
    }

    // Background and fog follow the chapter's palette.
    tmp.colorA.set(a.tint).lerp(tmp.colorB.set(b.tint), w);
    (scene.background as Color).copy(tmp.colorA);
    const fog = scene.fog as Fog;
    fog.color.copy(tmp.colorA);
    fog.near = a.fog[0] + (b.fog[0] - a.fog[0]) * w;
    fog.far = a.fog[1] + (b.fog[1] - a.fog[1]) * w;

    // Key light and its shadow frustum ride along with the active set.
    const cx = s.look.x;
    if (key.current) {
      key.current.position.set(cx + 5, 9, 6);
      key.current.target.position.set(cx, 0, 0);
      key.current.target.updateMatrixWorld();
    }

    // Only the sets near the camera draw at all.
    sets.current.forEach((group, idx) => {
      // A neighbour shows only once the camera starts travelling toward it, so
      // big sets (the Weather sky) never bleed into the one being viewed.
      if (group) group.visible = Math.abs(idx - f) < 0.72;
    });
  });

  const high = quality === "high" && !isMobile;

  return (
    <>
      <hemisphereLight args={["#ffffff", "#d8d0c4", 0.55]} />
      <directionalLight
        ref={key}
        intensity={2.1}
        color="#fff4e6"
        castShadow
        shadow-mapSize={isMobile ? [1024, 1024] : [2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
        shadow-camera-left={-9}
        shadow-camera-right={9}
        shadow-camera-top={9}
        shadow-camera-bottom={-9}
        shadow-camera-near={1}
        shadow-camera-far={30}
      />
      <directionalLight
        position={[-6, 4, -4]}
        intensity={0.6}
        color="#dce8ff"
      />

      {SHOTS.map((shot, idx) => {
        const Set = SETS[shot.id];
        return (
          <group
            key={shot.id}
            position={[idx * SPACING, 0, 0]}
            ref={(g) => {
              sets.current[idx] = g;
            }}
          >
            <Set />
          </group>
        );
      })}

      <EffectComposer multisampling={0} enableNormalPass={false}>
        {high ? (
          <N8AO
            aoRadius={0.6}
            intensity={1.6}
            distanceFalloff={0.6}
            halfRes
            quality="performance"
          />
        ) : (
          <></>
        )}
        <Bloom
          intensity={isMobile ? 0.25 : 0.35}
          luminanceThreshold={0.85}
          luminanceSmoothing={0.2}
          mipmapBlur
        />
        <Vignette offset={0.32} darkness={0.42} />
        <Noise
          opacity={isMobile ? 0.015 : 0.028}
          blendFunction={BlendFunction.SOFT_LIGHT}
        />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    </>
  );
}
