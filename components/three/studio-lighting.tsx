"use client";

import { SceneEnvironment } from "@/components/three/scene-environment";

type StudioLightingProps = {
  /** Scales all three lights together, for scenes that need a softer read. */
  intensity?: number;
  /** Cast shadows from the key light. Off for scenes with nothing to catch them. */
  shadows?: boolean;
};

/**
 * Three-point studio rig shared by the GLB product scenes (hardware bench,
 * laptop). Key light from front-right for form, cooler fill from the left to
 * keep shadow sides from going black, and a rim from behind to separate the
 * model from the white panel. Paired with SceneEnvironment so metallic
 * materials have something to reflect.
 */
export function StudioLighting({
  intensity = 1,
  shadows = true
}: StudioLightingProps) {
  return (
    <>
      <SceneEnvironment />
      <ambientLight intensity={0.55 * intensity} />
      <directionalLight
        position={[3.2, 4.4, 3]}
        intensity={1.5 * intensity}
        castShadow={shadows}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0005}
      >
        <orthographicCamera
          attach="shadow-camera"
          args={[-4, 4, 4, -4, 0.1, 20]}
        />
      </directionalLight>
      <directionalLight
        position={[-3.5, 2.2, 1.5]}
        intensity={0.55 * intensity}
        color="#dce8ff"
      />
      <directionalLight
        position={[-1, 2.6, -4]}
        intensity={0.9 * intensity}
        color="#fff4e6"
      />
    </>
  );
}
