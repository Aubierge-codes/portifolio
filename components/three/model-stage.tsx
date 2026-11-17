"use client";

import { useLayoutEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { ContactShadows, PerspectiveCamera } from "@react-three/drei";
import {
  Vector3,
  type PerspectiveCamera as PerspectiveCameraImpl
} from "three";
import { StudioLighting } from "@/components/three/studio-lighting";

type Vec3 = [number, number, number];

type ModelStageProps = {
  children: React.ReactNode;
  /** Ground height the models sit on and shadows are cast onto. */
  floor?: number;
  /** Direction the camera looks from, relative to the target. Length is ignored. */
  cameraDirection?: Vec3;
  /** Point the camera aims at: the middle of the subject. */
  cameraTarget?: Vec3;
  cameraFov?: number;
  /**
   * World-space width and height the subject occupies. The camera backs off
   * until both fit, so the same scene frames itself at desktop, tablet and
   * phone aspect ratios instead of clipping on narrow canvases.
   */
  subject?: { width: number; height: number };
  /** Breathing room around the subject, as a fraction of its size. */
  margin?: number;
  /** Softness/spread of the contact shadow. */
  shadowScale?: number;
  shadowBlur?: number;
  shadowOpacity?: number;
  lightIntensity?: number;
};

/**
 * Shared presentation stage for the product scenes: a camera that fits the
 * subject to whatever size the canvas is, studio lighting, and a soft contact
 * shadow on the ground plane.
 */
export function ModelStage({
  children,
  floor = -0.5,
  cameraDirection = [0, 0.32, 1],
  cameraTarget = [0, 0.15, 0],
  cameraFov = 30,
  subject = { width: 3, height: 1.5 },
  margin = 0.14,
  shadowScale = 9,
  shadowBlur = 2.6,
  shadowOpacity = 0.32,
  lightIntensity = 1
}: ModelStageProps) {
  const cameraRef = useRef<PerspectiveCameraImpl>(null);
  const width = useThree((state) => state.size.width);
  const height = useThree((state) => state.size.height);

  const [dx, dy, dz] = cameraDirection;
  const [tx, ty, tz] = cameraTarget;

  useLayoutEffect(() => {
    const camera = cameraRef.current;
    if (!camera || !width || !height) return;
    const aspect = width / height;
    const halfV = Math.tan((cameraFov * Math.PI) / 360);
    const fitH = (subject.height * (1 + margin)) / 2 / halfV;
    const fitW = (subject.width * (1 + margin)) / 2 / (halfV * aspect);
    const distance = Math.max(fitH, fitW);
    const target = new Vector3(tx, ty, tz);
    camera.position
      .set(dx, dy, dz)
      .normalize()
      .multiplyScalar(distance)
      .add(target);
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    camera.lookAt(target);
  }, [
    width,
    height,
    cameraFov,
    subject.width,
    subject.height,
    margin,
    dx,
    dy,
    dz,
    tx,
    ty,
    tz
  ]);

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault fov={cameraFov} />
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
