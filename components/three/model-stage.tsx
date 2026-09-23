"use client";

import { ContactShadows } from "@react-three/drei";
import { StudioLighting } from "@/components/three/studio-lighting";

type ModelStageProps = {
  children: React.ReactNode;
  /** Ground height the models sit on and shadows are cast onto. */
  floor?: number;
  /** Softness/spread of the contact shadow. */
  shadowScale?: number;
  shadowBlur?: number;
  shadowOpacity?: number;
  lightIntensity?: number;
};

/**
 * Shared presentation stage for the GLB product scenes: studio lighting plus
 * a soft contact shadow on the ground plane. Without the shadow the models
 * read as cut out and pasted onto the white panel rather than sitting in it.
 * Matches the ContactShadows treatment the hero scene already uses.
 */
export function ModelStage({
  children,
  floor = -0.5,
  shadowScale = 9,
  shadowBlur = 2.6,
  shadowOpacity = 0.32,
  lightIntensity = 1
}: ModelStageProps) {
  return (
    <>
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
