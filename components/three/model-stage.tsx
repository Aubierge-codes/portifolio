"use client";

import { useEffect, useRef } from "react";
import { ContactShadows, PerspectiveCamera } from "@react-three/drei";
import type { PerspectiveCamera as PerspectiveCameraImpl } from "three";
import { StudioLighting } from "@/components/three/studio-lighting";

type ModelStageProps = {
  children: React.ReactNode;
  /** Ground height the models sit on and shadows are cast onto. */
  floor?: number;
  /** Camera placement, so each scene frames its own subject. */
  cameraPosition?: [number, number, number];
  /** Point the camera aims at — usually just above the floor. */
  cameraTarget?: [number, number, number];
  cameraFov?: number;
  /** Softness/spread of the contact shadow. */
  shadowScale?: number;
  shadowBlur?: number;
  shadowOpacity?: number;
  lightIntensity?: number;
};

/**
 * Shared presentation stage for the GLB product scenes: its own framed
 * camera, studio lighting, and a soft contact shadow on the ground plane.
 *
 * The camera lives here rather than using ThreeFrame's shared one because
 * these panels are much taller than the site's other canvases, and a camera
 * tuned for the wide mannequin strips leaves product shots stranded in the
 * top third of the frame.
 */
export function ModelStage({
  children,
  floor = -0.5,
  cameraPosition = [0, 1.15, 4.6],
  cameraTarget = [0, 0.15, 0],
  cameraFov = 34,
  shadowScale = 9,
  shadowBlur = 2.6,
  shadowOpacity = 0.32,
  lightIntensity = 1
}: ModelStageProps) {
  const cameraRef = useRef<PerspectiveCameraImpl>(null);

  useEffect(() => {
    cameraRef.current?.lookAt(...cameraTarget);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameraTarget[0], cameraTarget[1], cameraTarget[2]]);

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={cameraPosition}
        fov={cameraFov}
      />
      <StudioLighting intensity={lightIntensity} shadows={false} />
      {children}
      <ContactShadows
        position={[0, floor, 0]}
        opacity={shadowOpacity}
        scale={shadowScale}
        blur={shadowBlur}
        far={4}
        resolution={512}
        color="#1c1b19"
      />
    </>
  );
}
